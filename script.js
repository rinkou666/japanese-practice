let mediaRecorder;
let audioChunks = [];

// 请求麦克风权限并初始化录音
navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.ondataavailable = event => {
            audioChunks.push(event.data);
        };
        mediaRecorder.onerror = event => {
            console.error("录音时出现错误: ", event.error);
        };
    })
    .catch(error => {
        console.error("无法访问麦克风", error);
        alert("无法访问麦克风，请检查浏览器的权限设置。");
    });

// 开始录音
function startRecording() {
    if (mediaRecorder) {
        audioChunks = [];
        mediaRecorder.start();
        document.getElementById("status").textContent = "状态: 正在录音...";
        document.getElementById("startBtn").disabled = true;
        document.getElementById("stopBtn").disabled = false;
        console.log("录音开始");
    } else {
        console.error("MediaRecorder未初始化。");
        alert("录音功能未初始化，请检查麦克风权限。");
    }
}

// 停止录音
function stopRecording() {
    if (mediaRecorder && mediaRecorder.state === "recording") {
        mediaRecorder.stop();
        document.getElementById("status").textContent = "状态: 录音停止";
        document.getElementById("startBtn").disabled = false;
        document.getElementById("stopBtn").disabled = true;
        console.log("录音停止");

        mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
            const audioUrl = URL.createObjectURL(audioBlob);

            // 创建一个音频元素并设置源
            const audioPlayer = document.createElement('audio');
            audioPlayer.controls = true; // 显示播放控制
            audioPlayer.src = audioUrl; // 设置音频源
            document.getElementById('audioContainer').innerHTML = ''; // 清空之前的内容
            document.getElementById('audioContainer').appendChild(audioPlayer); // 添加音频播放器
            audioPlayer.play(); // 自动播放录音
        };
    } else {
        console.error("录音未在进行中。");
    }
}

// 播放录音
function playRecording() {
    // 这个函数可以被移除，因为我们现在在停止录音后会自动播放
}
