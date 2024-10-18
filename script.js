let mediaRecorder;
let recordedChunks = [];
let recordingTimer;
let recordingTime = 0;

// 格式化时间显示
function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

async function startRecording() {
    try {
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
        
        mediaRecorder = new MediaRecorder(stream, { mimeType });
        recordedChunks = [];
        
        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                recordedChunks.push(event.data);
            }
        };
        
        mediaRecorder.onstop = () => {
            clearInterval(recordingTimer);
            const audioBlob = new Blob(recordedChunks, { type: mimeType });
            const audioUrl = URL.createObjectURL(audioBlob);
            
            const audioElement = document.createElement('audio');
            audioElement.controls = true;
            audioElement.src = audioUrl;
            
            // 清除之前的录音
            const audioContainer = document.getElementById('audioContainer');
            audioContainer.innerHTML = '<h3>录音文件:</h3>';
            audioContainer.appendChild(audioElement);
            
            document.getElementById('status').textContent = '状态: 录音已停止';
            document.getElementById('startBtn').style.backgroundColor = '#94a3b8';
            
            // 停止所有音轨
            stream.getTracks().forEach(track => track.stop());
        };
        
        // 开始录音
        mediaRecorder.start();
        document.getElementById('status').textContent = '状态: 正在录音';
        document.getElementById('startBtn').style.backgroundColor = '#7d8a9b';
        
        // 重置并启动计时器
        recordingTime = 0;
        document.getElementById('recordingTime').textContent = formatTime(recordingTime);
        
        recordingTimer = setInterval(() => {
            recordingTime++;
            document.getElementById('recordingTime').textContent = formatTime(recordingTime);
        }, 1000);
        
    } catch (err) {
        console.error('录音失败:', err);
        alert('录音失败: ' + err.message);
    }
}

function stopRecording() {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
    }
}
