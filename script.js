let mediaRecorder;
let recordedChunks = [];
let waveSurfer;
let recordingTimer;
let recordingTime = 0;

// 初始化 Wavesurfer
function initializeWaveSurfer() {
    waveSurfer = WaveSurfer.create({
        container: '#waveform',
        waveColor: 'violet',
        progressColor: 'purple',
        height: 128,
    });
}

// 格式化时间显示
function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
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
        clearInterval(recordingTimer);
        const audioBlob = new Blob(recordedChunks);
        const audioUrl = URL.createObjectURL(audioBlob);
        
        // 加载波形到 Wavesurfer
        waveSurfer.load(audioUrl);
        
        const audioElement = document.createElement('audio');
        audioElement.controls = true;
        audioElement.src = audioUrl;
        document.getElementById('audioContainer').appendChild(audioElement);
        
        document.getElementById('status').textContent = '状态: 录音已停止';
        document.getElementById('startBtn').style.backgroundColor = '';
        document.getElementById('recordingTime').textContent = '';
        
        // 停止所有音轨
        stream.getTracks().forEach(track => track.stop());
    };
    
    mediaRecorder.start();
    document.getElementById('status').textContent = '状态: 正在录音';
    document.getElementById('startBtn').style.backgroundColor = 'red'; // 改为红色表示正在录音
    
    // 重置并启动计时器
    recordingTime = 0;
    document.getElementById('recordingTime').textContent = `录音时长: ${formatTime(recordingTime)}`;
    
    recordingTimer = setInterval(() => {
        recordingTime++;
        document.getElementById('recordingTime').textContent = `录音时长: ${formatTime(recordingTime)}`;
    }, 1000);
}

function stopRecording() {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
    }
}
