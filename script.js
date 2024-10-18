let mediaRecorder;
let audioChunks = [];

function startRecording() {
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.start();

            mediaRecorder.ondataavailable = event => {
                audioChunks.push(event.data);
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
                const audioURL = URL.createObjectURL(audioBlob);
                const audioElement = document.createElement('audio');
                audioElement.controls = true;
                audioElement.src = audioURL;

                // 将生成的音频文件添加到音频容器
                const audioContainer = document.getElementById('audioContainer');
                audioContainer.innerHTML = ''; // 清空以前的音频
                audioContainer.appendChild(audioElement);

                audioChunks = []; // 清空音频块
            };

            document.getElementById('status').textContent = '状态: 正在录音';
            document.getElementById('recordingTime').textContent = '00:00:00';
            // 开始计时
            startTimer();
        });
}

function stopRecording() {
    if (mediaRecorder) {
        mediaRecorder.stop();
        document.getElementById('status').textContent = '状态: 未录音';
    }
}

// 计时器
let timerInterval;
let seconds = 0;

function startTimer() {
    timerInterval = setInterval(() => {
        seconds++;
        const hours = String(Math.floor(seconds / 3600)).padStart(2, '0');
        const minutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
        const secs = String(seconds % 60).padStart(2, '0');
        document.getElementById('recordingTime').textContent = `${hours}:${minutes}:${secs}`;
    }, 1000);
}
