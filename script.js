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
                const translateY = adjustedIndex * 23 + -5; // Increase this value to move the certificates further down

                // Calculate translateX dynamically based on screen width
                const minTranslateX = (minTranslateXPercentage / 100) * screenWidth
                const maxTranslateX = (maxTranslateXPercentage / 100) * screenWidth;
                const translateX =
                    minTranslateX + ((maxTranslateX - minTranslateX) / screenWidth) * adjustedIndex * 25 + 11;

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


    // Adding keyboard event handling for right arrow
    document.querySelector(".right").addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
            currentIndex = (currentIndex + 1) % totalCertificates;
            updateCertificates();
            event.preventDefault();
        }
    });

    // Adding keyboard event handling for left arrow
    document.querySelector(".left").addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
            currentIndex = (currentIndex - 1 + totalCertificates) % totalCertificates;
            updateCertificates();
            event.preventDefault();
        }
    });

    window.addEventListener("resize", updateCertificates); // Update certificates on window resize
    updateCertificates(); // Initial display
});


// LIGHTBOX MODAL

document.addEventListener('DOMContentLoaded', function () {
    const overlay = document.getElementById('overlay');

    // Add a click event listener to the overlay
    overlay.addEventListener('click', function () {
        // Close the modal based on the lastModalId variable
        closeModal(lastModalId);
    });

    // Click event to open the diploma modal
    const diplomaImage = document.querySelector('.single-image img');
    if (diplomaImage) {
        diplomaImage.addEventListener('click', function (event) {
            openDiplomaModal(event);
            // Set the lastModalId variable for the overlay click event
            lastModalId = 'diplomaModal';
        });
    }

    // Click event to open the certificate modal
    const certificateContainer = document.querySelector('.certificate-container');
    if (certificateContainer) {
        certificateContainer.addEventListener('click', function () {
            openCertificatesModal();
            // Set the lastModalId variable for the overlay click event
            lastModalId = 'certificatesModal';
        });
    }

    // Variable to store the last opened modal id
    let lastModalId;

   

    // Function to open the diploma modal
    function openDiplomaModal(event) {
        const overlay = document.getElementById('overlay');
        const modal = document.getElementById('diplomaModal');
        const modalImage = document.getElementById('diplomaImage');
    
        // Access the clicked image's source from the event
        const clickedImageSrc = event.target.src;
        modalImage.src = clickedImageSrc; // Set the source dynamically
        modal.style.display = 'block';
        overlay.style.display = 'block';
        console.log('Diploma modal opened. Display:', modal.style.display);
    }
    

    // Function to open the certificates modal
    function openCertificatesModal() {
        const modal = document.getElementById('certificatesModal');
        const overlay = document.getElementById('overlay');
        const certificateSlider = document.querySelector('.certificate-slider');
        const certificates = document.querySelectorAll('.certificate-container img');

        // Clear existing content
        certificateSlider.innerHTML = '';

        // Clone and append each certificate image to the modal
        certificates.forEach((certificate) => {
            const clonedCertificate = certificate.cloneNode(true);
            certificateSlider.appendChild(clonedCertificate);
        });

        modal.style.display = 'block';
        overlay.style.display = 'block';
        console.log('Certificates modal opened. Display:', modal.style.display);
    }
});
 // Companion Function to close the modal
    function closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            console.log(`Attempting to close modal with ID: ${modalId}`);
            modal.style.display = 'none';
            console.log(`Closed modal with ID: ${modalId}`);
            overlay.style.display = 'none';
        } else {
            console.log(`Modal with ID ${modalId} not found`);
        }
    }