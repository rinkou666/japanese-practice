let mediaRecorder;
let recordedChunks = [];
let waveSurfer;
let recordingTimer; // 记录计时器
let recordingTime = 0; // 录音时长

// 初始化 Wavesurfer
function initializeWaveSurfer() {
    waveSurfer = WaveSurfer.create({
        container: '#waveform',
        waveColor: 'violet',
        progressColor: 'purple',
        height: 128,
    });
}

initializeWaveSurfer();

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
    recordedChunks = [];

    mediaRecorder.ondataavailable = (event) => {
        recordedChunks.push(event.data);
    };

    mediaRecorder.onstop = () => {
        clearInterval(recordingTimer); // 停止计时器
        const audioBlob = new Blob(recordedChunks);
        const audioUrl = URL.createObjectURL(audioBlob);

        // 加载波形到 Wavesurfer
        waveSurfer.load(audioUrl);

        const audioElement = document.createElement('audio');
        audioElement.controls = true;
        audioElement.src = audioUrl;
        document.getElementById('audioContainer').appendChild(audioElement);

        document.getElementById('status').textContent = '状态: 录音已停止';
        document.getElementById('startBtn').style.backgroundColor = ''; // 重置按钮颜色
        document.getElementById('recordingTime').textContent = ''; // 重置录音时长
    };

    mediaRecorder.start();
    document.getElementById('status').textContent = '状态: 正在录音';
    document.getElementById('startBtn').style.backgroundColor = 'green'; // 设置按钮为绿色

    recordingTime = 0; // 重置录音时长
    recordingTimer = setInterval(() => {
        recordingTime++;
        document.getElementById('recordingTime').textContent = `录音时长: ${recordingTime}秒`;
    }, 1000); // 每秒更新一次
}

function stopRecording() {
    if (mediaRecorder) {
        mediaRecorder.stop();
    }
}
