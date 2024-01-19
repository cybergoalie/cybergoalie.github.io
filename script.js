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

// MEET ME SECTION WAS SUCCESSFULLY FILTERED OUT, ORGANIZED AND IS NOW THE MEETME.JS (ALSO IMPORTED INTO THE INDEX.HTML) & CERTIFICATES.JSON FILES


// SHOWCASE ONE PROJECT IN PORTFOLIO SECTION AT A TIME
document.addEventListener('DOMContentLoaded', function () {
    const projectCards = document.querySelectorAll('.project-card');
    const circles = document.querySelectorAll('.circle');

    // Show the second project card by default
    showProject(1);

    circles.forEach((circle, index) => {
      circle.addEventListener('click', () => {
        showProject(index);
      });
    });

    function showProject(index) {
      projectCards.forEach((card, i) => {
        if (i === index) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
        circles[i].classList.remove('active');
      });

      circles[index].classList.add('active');
    }
  });

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

 function scrollToTop() {
    window.scrollTo({
       top: 0,
       behavior: 'smooth'
    });
 }