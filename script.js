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

    document.addEventListener('modalClosed', function (event) {
        console.log('Received modalClosed event. Current Index of closed Certificate in the array:', event.detail.currentIndex);
        currentIndex = event.detail.currentIndex;

        console.log('Setting starting display of current index to the certificate it was closed on:', currentIndex);

        updateCertificates();
    });


    window.addEventListener("resize", updateCertificates); // Update certificates on window resize
    updateCertificates(); // Initial display
});

// Declare at the top level
let currentCertificateIndex;
let modalWasNavigated = false;

function navigateCertificates(direction) {
    const modal = document.getElementById('certificatesModal');
    const certificateSlider = modal.querySelector('.certificate-slider');
    const certificates = Array.from(document.querySelectorAll('.certificate-container img'));
    const modalImage = certificateSlider.querySelector('.modal-content');

    if (!modalImage) {
        console.error('modalImage is undefined');
        return;
    }

    console.log('Certificates array in navigateCertificates:', certificates);
    console.log('Certificates length in navigateCertificates:', certificates.length);

    if (certificates.length === 0) {
        console.error('Certificates array is empty');
        return;
    }

    let currentIndex = currentCertificateIndex;


    if (direction === 'left') {
        currentIndex = (currentIndex + 1 + certificates.length) % certificates.length;
    } else if (direction === 'right') {
        currentIndex = (currentIndex - 1 + certificates.length) % certificates.length;
    }

    const nextCertificate = certificates[currentIndex];

    if (nextCertificate) {
        modalImage.src = nextCertificate.src;
        currentCertificateIndex = currentIndex;
        modalWasNavigated = true; // Set the flag

    } else {
        console.error('Next certificate not found');
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    const overlay = document.getElementById('overlay');

    if (modalId === 'diplomaModal') {

    } else {

        // Log the identified certificate that the modal was closed on
        const closedCert = document.querySelector('.certificate-container img:not(.hidden)');
        if (!closedCert) {
            console.error('No certificate found. Aborting closeModal.');
            return;
        }
        let currentIndex;

        if (modalWasNavigated) {
            currentIndex = currentCertificateIndex;
            modalWasNavigated = false; // Reset the flag after using it

        } else {

            const certificates = document.querySelectorAll(".certificate-container img");
            currentIndex = Array.from(certificates).indexOf(closedCert);
        }
        // Dispatch a custom event with the updated currentIndex
        const closeModalEvent = new CustomEvent('modalClosed', { detail: { currentIndex } });
        document.dispatchEvent(closeModalEvent);

    }
    modal.style.display = 'none';
    overlay.style.display = 'none';
    console.log(`Modal with ID ${modalId} closed. Display: ${modal.style.display}`);

}

// LIGHTBOX MODAL

document.addEventListener('DOMContentLoaded', function () {
    const overlay = document.getElementById('overlay');

    // Add a click event listener to the overlay
    overlay.addEventListener('click', function () {
        // Close the modal based on the lastModalId variable
        closeModal(lastModalId);
    });

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

    // Variable to store the last opened modal id
    let lastModalId;

    // Click event to open the diploma modal
    const diplomaImage = document.querySelector('.single-image img');
    if (diplomaImage) {
        diplomaImage.addEventListener('click', function (event) {
            openDiplomaModal(event);
            // Set the lastModalId variable for the overlay click event
            lastModalId = 'diplomaModal';
        });
    }

});


function openCertificatesModal(clickedCertificate) {
    const modal = document.getElementById('certificatesModal');
    const overlay = document.getElementById('overlay');
    const certificateSlider = modal.querySelector('.certificate-slider');
    const certificates = document.querySelectorAll('.certificate-container img');

    // Initialize modalImage with the clicked certificate
    const modalImage = document.createElement('img');
    modalImage.classList.add('modal-content');
    certificateSlider.innerHTML = ''; // Clear existing content
    certificateSlider.appendChild(modalImage);

    // Find the index of the clicked certificate
    currentCertificateIndex = Array.from(certificates).findIndex(cert => cert === clickedCertificate);

    console.log('Opened modal on certificate index:', currentCertificateIndex);
    console.log('Opened modal on certificate source:', clickedCertificate.src);


    // Set the initially displayed certificate based on the clicked certificate
    modalImage.src = clickedCertificate.src;

    // Toggle visibility of certificates
    certificates.forEach((certificate, index) => {
        if (index !== currentCertificateIndex) {
            certificate.classList.add('hidden');
        } else {
            certificate.classList.remove('hidden');
        }
    });

    modal.style.display = 'block';
    overlay.style.display = 'block';
    console.log('Certificates modal opened. Display:', modal.style.display);
}



// Click event to open the certificate modal
const certificateContainer = document.querySelector('.certificate-container');
if (certificateContainer) {
    certificateContainer.addEventListener('click', function (event) {
        // Ensure that the clicked element is an image
        const clickedImage = event.target.closest('.certificate-item');
        if (clickedImage) {
            openCertificatesModal(clickedImage); // Pass the clicked certificate to the function
            // Set the lastModalId variable for the overlay click event
            lastModalId = 'certificatesModal';
        }
    });
}








