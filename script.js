// script.js

// TOGGLE NAVBAR MENU FOR SMALLER SCREENS

function toggleMenu() {
    const navList = document.querySelector('nav ul');
    navList.classList.toggle('active');
    const menuToggle = document.querySelector('.menu-toggle');
    menuToggle.classList.toggle('active');
}

// TOGGLE LIGHT/DARK THEME

function toggleTheme() {
    const body = document.body;
    body.classList.toggle('light-mode');

    const themeToggle = document.getElementById('theme-toggle');
    const isLightMode = body.classList.contains('light-mode');

    // Set different icons based on the theme
    if (isLightMode) {
        themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>'; // Full moon for dark theme
    } else {
        themeToggle.innerHTML = '<i class="fas fa-sun" style="color: yellow; filter: drop-shadow(0 0 5px rgba(0, 0, 0, 0.5));"></i>';

    }
}

// PLAY VIDEO

document.addEventListener('DOMContentLoaded', function () {
    const video = document.getElementById('backgroundVideo');
    video.pause(); // Pause the video on page load
});

function toggleVideo() {
    const video = document.getElementById('backgroundVideo');
    const playButton = document.getElementById('playButton');

    if (video.paused || video.ended) {
        video.play();
        playButton.innerHTML = '<i class="fas fa-pause"></i>';
    } else {
        video.pause();
        playButton.innerHTML = '<i class="fas fa-play"></i>';
    }
}

// MEET ME SLIDESHOW

document.addEventListener("DOMContentLoaded", function () {
    const certificates = document.querySelectorAll(".certificate-container img");
    const totalCertificates = certificates.length;
    const displayLimit = 3; // Set the initial display limit
    let currentIndex = 0;

    function updateCertificates() {
        const screenWidth = window.innerWidth;
        const maxTranslateXPercentage = -150; // Maximum translateX percentage for minimized screen
        const minTranslateXPercentage = 5; // Minimum translateX percentage for maximized screen

        certificates.forEach((certificate, index) => {
            const adjustedIndex = (index - currentIndex + totalCertificates) % totalCertificates;

            if (adjustedIndex >= 0 && adjustedIndex < displayLimit) {
                certificate.style.display = "block";
                certificate.style.zIndex = totalCertificates - adjustedIndex;

                // Adjust the transform property to create the step-like appearance
                const translateY = adjustedIndex * 35 + 8; // Increase this value to move the certificates further down

                // Calculate translateX dynamically based on screen width
                const minTranslateX = (minTranslateXPercentage / 100) * screenWidth;
                const maxTranslateX = (maxTranslateXPercentage / 100) * screenWidth;
                const translateX =
                    minTranslateX + ((maxTranslateX - minTranslateX) / screenWidth) * adjustedIndex * 35 + 8;

                certificate.style.transform = `translate(${translateX}px, ${translateY}px)`;
            } else {
                certificate.style.display = "none";
            }
        });
    }

    document.querySelector(".right").addEventListener("click", function () {
        currentIndex = (currentIndex + 1) % totalCertificates;
        updateCertificates();
    });

    document.querySelector(".left").addEventListener("click", function () {
        currentIndex = (currentIndex - 1 + totalCertificates) % totalCertificates;
        updateCertificates();
    });

    window.addEventListener("resize", updateCertificates); // Update certificates on window resize
    updateCertificates(); // Initial display
});
