document.addEventListener('DOMContentLoaded', function() {
    var backgroundMusic = document.getElementById('backgroundMusic');
    // Get the audio element

    // Play the music when the page loads
    backgroundMusic.play();

    // You can control the music with JavaScript functions if needed
    // For example, pause the music
    // backgroundMusic.pause();
});

let musicPlaying = true;

function toggleMusic() {
    var backgroundMusic = document.getElementById('backgroundMusic');
    let volumeIcons = document.querySelectorAll('.music-icon');

    if (musicPlaying) {
        backgroundMusic.pause();
    }
    else {
        backgroundMusic.play();
    }
    musicPlaying = !musicPlaying;

    volumeIcons.forEach((volumeIcon) => {
        if (volumeIcon.classList.contains('ri-volume-up-fill')) {
            volumeIcon.classList.replace('ri-volume-up-fill', 'ri-volume-mute-fill');
        } else {
            volumeIcon.classList.replace('ri-volume-mute-fill', 'ri-volume-up-fill');
        }
    });
}

