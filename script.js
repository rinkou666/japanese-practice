let mediaRecorder;
let recordedChunks = [];

// 获取音频输入权限
async function startRecording() {
    // 获取麦克风音频
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    // 检查浏览器支持的音频格式
    let mimeType = '';
    if (MediaRecorder.isTypeSupported('audio/webm')) {
        mimeType = 'audio/webm';
    } else if (MediaRecorder.isTypeSupported('audio/wav')) {
        mimeType = 'audio/wav';
    } else {
        alert('您的浏览器不支持录音功能。');
        return;
    }

    // 创建 MediaRecorder 对象
    mediaRecorder = new MediaRecorder(stream, { mimeType });

    // 处理录音数据
    mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
            recordedChunks.push(event.data);
        }
    };

    // 开始录音
    mediaRecorder.start();
    console.log('Recording started');
}

// 停止录音并保存音频文件
function stopRecording() {
    mediaRecorder.stop();
    console.log('Recording stopped');

    mediaRecorder.onstop = () => {
        // 创建音频 Blob 对象
        const audioBlob = new Blob(recordedChunks, { type: mediaRecorder.mimeType });
        const audioUrl = URL.createObjectURL(audioBlob);
        const audioElement = document.createElement('audio');
        audioElement.controls = true;
        audioElement.src = audioUrl;

        // 清空已录制的数据
        recordedChunks = [];

        // 将音频元素添加到页面
        const recordingsList = document.getElementById('recordingsList');
        recordingsList.appendChild(audioElement);
        console.log('Audio recording is available for playback');
    };
}

// 绑定按钮事件
document.getElementById('startButton').addEventListener('click', startRecording);
document.getElementById('stopButton').addEventListener('click', stopRecording);
