// script.js

// DISPLAY LOADING WRAPPER UNTIL THE PAGE IS FULLY LOADED

window.onload = function () {
    // Hide the loading wrapper
    document.getElementById("loading-wrapper").style.display = "none";
};


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

// MEET ME SECTION WAS SUCCESSFULLY FILTERED OUT, ORGANIZED AND IS NOW THE MEETME.JS (ALSO IMPORTED INTO THE INDEX.HTML) & CERTIFICATES.JSON FILES


// SHOWCASE ONE PROJECT IN PORTFOLIO SECTION AT A TIME
document.addEventListener('DOMContentLoaded', function () {
    const projectWrappers = document.querySelectorAll('.project-wrapper');
    const circles = document.querySelectorAll('.circle');
    let startX;

    // Show the second project wrapper by default
    showProject(1);

    projectWrappers.forEach((projectWrapper, index) => {
        projectWrapper.addEventListener('mousedown', (e) => {
            startX = e.clientX;
            projectWrapper.addEventListener('mousemove', handleDrag);
        });

        projectWrapper.addEventListener('mouseup', () => {
            projectWrapper.removeEventListener('mousemove', handleDrag);
        });

        projectWrapper.addEventListener('mouseleave', () => {
            projectWrapper.removeEventListener('mousemove', handleDrag);
        });

        circles.forEach((circle, index) => {
            circle.addEventListener('click', () => {
                showProject(index);
            });
        });

        function handleDrag(e) {
            const deltaX = e.clientX - startX;

            if (Math.abs(deltaX) >= 10) {
                const newIndex = deltaX > 0 ? Math.max(0, index - 1) : Math.min(projectWrappers.length - 1, index + 1);
                showProject(newIndex);
                startX = e.clientX;
            }
        }
    });

    function showProject(index) {
        projectWrappers.forEach((projectWrapper, i) => {
            const projectCard = projectWrapper.querySelector('.project-card');
            const circle = circles[i];

            if (i === index) {
                projectCard.style.display = 'block';
                projectWrapper.style.display = 'block';
            } else {
                projectCard.style.display = 'none';
                projectWrapper.style.display = 'none';
            }
            circle.classList.remove('active');
        });

        circles[index].classList.add('active');

        console.log('Show Project:', index);
    }
});





// SMOOTH-SCROLLING TO SECTIONS

document.addEventListener("DOMContentLoaded", function () {
    // Add smooth scrolling to all links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});

// SMOOTH-SCROLLING TO TOP

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}