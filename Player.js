document.addEventListener("DOMContentLoaded", function () {
    const video = document.getElementById('myVideo');
    const playPauseButton = document.getElementById('play-pause');
    const volumeControl = document.getElementById('volume');
    const fullscreenButton = document.getElementById('fullscreen');
    const dragDropButton = document.getElementById('drag-drop');
    const timeDisplay = document.getElementById('time-display');
    const progressBarContainer = document.getElementById('progress-bar-container');
    const progressBar = document.getElementById('progress-bar');
    const speedSelector = document.getElementById('speed-selector');
    const playlistButtons = document.querySelectorAll('#playlist button');

    playPauseButton.addEventListener('click', togglePlayPause);
    volumeControl.addEventListener('input', updateVolume);
    fullscreenButton.addEventListener('click', toggleFullscreen);
    dragDropButton.addEventListener('click', openFileDialog);
    speedSelector.addEventListener('change', changePlaybackSpeed);
    progressBarContainer.addEventListener('click', updateVideoProgress);
    video.addEventListener('timeupdate', updateProgressBar);

    playlistButtons.forEach(button => {
        button.addEventListener('click', function () {
            loadVideo(button.getAttribute('data-src'));
        });
    });

    function togglePlayPause() {
        if (video.paused || video.ended) {
            video.play();
            playPauseButton.innerHTML = '| |';
        } else {
            video.pause();
            playPauseButton.innerHTML = '▶️';
        }
    }

    function updateVolume() {
        video.volume = volumeControl.value;
    }

    function toggleFullscreen() {
        if (video.requestFullscreen) {
            video.requestFullscreen();
        } else if (video.mozRequestFullScreen) {
            video.mozRequestFullScreen();
        } else if (video.webkitRequestFullscreen) {
            video.webkitRequestFullscreen();
        } else if (video.msRequestFullscreen) {
            video.msRequestFullscreen();
        }
    }

    function openFileDialog() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'video/*';
        input.click();

        input.addEventListener('change', function () {
            const file = input.files[0];
            if (file) {
                const objectURL = URL.createObjectURL(file);
                video.src = objectURL;
                video.play();
                playPauseButton.innerHTML = '| |';
            }
        });
    }

    function changePlaybackSpeed() {
        video.playbackRate = parseFloat(speedSelector.value);
    }

    function updateVideoProgress(event) {
        const clickX = event.clientX - progressBarContainer.getBoundingClientRect().left;
        const percent = clickX / progressBarContainer.clientWidth;
        video.currentTime = percent * video.duration;
    }

    function updateProgressBar() {
        const percent = (video.currentTime / video.duration) * 100;
        progressBar.style.width = `${percent}%`;
        const currentTime = formatTime(video.currentTime);
        const duration = formatTime(video.duration);
        timeDisplay.textContent = `${currentTime} / ${duration}`;
    }

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        const formattedTime = `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
        return formattedTime;
    }

    function loadVideo(source) {
        video.src = source;
        video.play();
        playPauseButton.innerHTML = '| |';
    }

    // Prevent default behaviors for drag-and-drop
    document.addEventListener('dragover', function (e) {
        e.preventDefault();
    });

    document.addEventListener('drop', function (e) {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file && file.type.includes('video')) {
            const objectURL = URL.createObjectURL(file);
            video.src = objectURL;
            video.play();
            playPauseButton.innerHTML = '⏸';
        }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyPress);

    function handleKeyPress(event) {
        switch (event.key) {
            case 'Space':
                togglePlayPause();
                break;
            case 'ArrowUp':
                increaseVolume();
                break;
            case 'ArrowDown':
                decreaseVolume();
                break;
            case 'ArrowRight':
                fastForward();
                break;
            case 'ArrowLeft':
                rewind();
                break;
            // Add more cases for other shortcuts
        }
    }

    function increaseVolume() {
        if (video.volume < 1) {
            video.volume += 0.1;
        }
    }

    function decreaseVolume() {
        if (video.volume > 0) {
            video.volume -= 0.1;
        }
    }

    function fastForward() {
        video.currentTime += 5;
    }

    function rewind() {
        video.currentTime -= 5;
    }
});
