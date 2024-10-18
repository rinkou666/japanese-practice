let mediaRecorder;
let recordedChunks = [];

// 获取音频输入权限
async function startRecording() {
    // 请求麦克风权限
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    // 检查浏览器支持的音频格式
    let mimeType = '';
    if (MediaRecorder.isTypeSupported('audio/wav')) {
        mimeType = 'audio/wav';
    } else if (MediaRecorder.isTypeSupported('audio/webm')) {
        mimeType = 'audio/webm';
    } else {
        alert('您的浏览器不支持录音功能。');
        return;
    }

    // 创建 MediaRecorder 实例
    mediaRecorder = new MediaRecorder(stream, { mimeType });

    // 其余录音逻辑
    mediaRecorder.ondataavailable = (event) => {
        recordedChunks.push(event.data);
    };

    mediaRecorder.start();
    document.getElementById('status').textContent = '状态: 正在录音';
}

// 停止录音并保存音频文件
function stopRecording() {
    mediaRecorder.stop();

    mediaRecorder.onstop = () => {
        const audioBlob = new Blob(recordedChunks, { type: mediaRecorder.mimeType });
        const audioUrl = URL.createObjectURL(audioBlob);
        const audioElement = document.createElement('audio');
        audioElement.controls = true;
        audioElement.src = audioUrl;

        recordedChunks = []; // 清空已录制的音频片段

        // 将音频元素添加到页面
        const audioContainer = document.getElementById('audioContainer');
        audioContainer.appendChild(audioElement);
        document.getElementById('status').textContent = '状态: 录音完成';

        // 调试信息
        console.log('Audio recording is available for playback:', audioUrl);
    };
}

// 绑定按钮事件
document.getElementById('startBtn').addEventListener('click', startRecording);
document.getElementById('stopBtn').addEventListener('click', stopRecording);
