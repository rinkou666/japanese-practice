let mediaRecorder;
let recordedChunks = [];

// 获取音频输入权限
async function startRecording() {
    // 检查浏览器是否支持获取用户媒体
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert('您的浏览器不支持获取用户媒体设备。请使用支持的浏览器。');
        return;
    }

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

        let mimeType = '';
        if (MediaRecorder.isTypeSupported('audio/webm')) {
            mimeType = 'audio/webm';
        } else if (MediaRecorder.isTypeSupported('audio/wav')) {
            mimeType = 'audio/wav';
        } else {
            alert('您的浏览器不支持录音功能。');
            return;
        }

        mediaRecorder = new MediaRecorder(stream, { mimeType });

        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                recordedChunks.push(event.data);
            }
        };

        mediaRecorder.start();
        document.getElementById('status').textContent = '状态: 正在录音';
        console.log('Recording started');
    } catch (error) {
        console.error('Error accessing audio devices:', error);
        document.getElementById('status').textContent = '状态: 录音失败';
        alert('无法访问麦克风，请检查设置。');
    }
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
