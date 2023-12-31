// meetMe.js

// MEET ME SLIDESHOW logic starts here

document.addEventListener("DOMContentLoaded", function () {

    // Fetch certificates data directly here
    fetch('certificates.json')
        .then(response => response.json())
        .then(certificatesData => {
            const certificateContainer = document.getElementById('certificateContainer');

            certificatesData.forEach((certificate, index) => {
                const img = document.createElement('img');
                img.src = certificate.src;
                img.alt = certificate.alt;
                img.className = 'certificate-item';
                img.tabIndex = '0';
                img.onclick = function () {
                    openCertificatesModal(this);
                };

                certificateContainer.appendChild(img);
            });

            // Continue with the rest of the existing code

            const certificates = document.querySelectorAll(".certificate-container img");

            const certificatesContainer = document.getElementById('certificateContainer');
            const totalCertificates = certificatesContainer.children.length;
            // OR THIS ONE LINE INSTEAD OF THE ABOVE 2: const totalCertificates = certificates.length;

            const displayLimit = 3;
            let currentIndex = 0;


            function updateCertificates() {
                const screenWidth = window.innerWidth;
                const maxTranslateXPercentage = -150;
                const minTranslateXPercentage = 5;

                certificates.forEach((certificate, index) => {
                    const adjustedIndex = (index - currentIndex + totalCertificates) % totalCertificates;

                    if (adjustedIndex >= 0 && adjustedIndex < displayLimit) {
                        certificate.style.display = "block";
                        certificate.style.zIndex = totalCertificates - adjustedIndex;

                        // Adjust the transform property to create the step-like appearance
                        const translateY = adjustedIndex * 23 + -5; // Increase this value to move the certificates farther down !!!CHECK

                        const minTranslateX = (minTranslateXPercentage / 100) * screenWidth;
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

            // Adding keyboard event handling for right arrow
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

            const overlay = document.getElementById('overlay');

            // Click event listener added to overlay to close the modal
            overlay.addEventListener('click', function (event) {
                // Check if the click occurred outside the modal content
                const modalContent = document.querySelector('.modal-content');
                if (modalContent && !modalContent.contains(event.target)) {
                    // Close the modal based on the lastModalId variable
                    closeModal(lastModalId);
                }
            });

            window.addEventListener("resize", updateCertificates);
            updateCertificates();
        })
        .catch(error => {
            console.error('Error loading certificates:', error);
        });
}); // Initial display

// MODAL logic begins here

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
        modalWasNavigated = true;
    } else {
        console.error('Next certificate not found');
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    const overlay = document.getElementById('overlay');

    if (modalId === 'diplomaModal') {

    } else {
        const closedCert = document.querySelector('.certificate-container img:not(.hidden)');
        if (!closedCert) {
            console.error('No certificate found. Aborting closeModal.');
            return;
        }
        let currentIndex;

        if (modalWasNavigated) {
            currentIndex = currentCertificateIndex;
            modalWasNavigated = false;
        } else {
            const certificates = document.querySelectorAll(".certificate-container img");
            currentIndex = Array.from(certificates).indexOf(closedCert);
        }

        const closeModalEvent = new CustomEvent('modalClosed', { detail: { currentIndex } });
        document.dispatchEvent(closeModalEvent);
    }

    modal.style.display = 'none';
    overlay.style.display = 'none';
    console.log(`Modal with ID ${modalId} closed. Display: ${modal.style.display}`);

}


function openDiplomaModal(event) {
    const overlay = document.getElementById('overlay');
    const modal = document.getElementById('diplomaModal');
    const modalImage = document.getElementById('diplomaImage');

    const clickedImageSrc = event.target.src;
    modalImage.src = clickedImageSrc;
    modal.style.display = 'block';
    overlay.style.display = 'block';
}

let lastModalId;

const diplomaImage = document.querySelector('.single-image img');
if (diplomaImage) {
    diplomaImage.addEventListener('click', function (event) {
        openDiplomaModal(event);
        lastModalId = 'diplomaModal';
    });
}

function openCertificatesModal(clickedCertificate) {
    const modal = document.getElementById('certificatesModal');
    const overlay = document.getElementById('overlay');
    const certificateSlider = modal.querySelector('.certificate-slider');
    const certificates = document.querySelectorAll('.certificate-container img');

    const modalImage = document.createElement('img');
    modalImage.classList.add('modal-content');
    certificateSlider.innerHTML = '';
    certificateSlider.appendChild(modalImage);

    currentCertificateIndex = Array.from(certificates).findIndex(cert => cert === clickedCertificate);

    modalImage.src = clickedCertificate.src;

    certificates.forEach((certificate, index) => {
        if (index !== currentCertificateIndex) {
            certificate.classList.add('hidden');
        } else {
            certificate.classList.remove('hidden');
        }
    });

    modal.style.display = 'block';
    overlay.style.display = 'block';
    lastModalId = 'certificatesModal';
}

function closeCertificatesModal() {
    closeModal('certificatesModal');
}

const closeCertificatesBtn = document.getElementById('closeCertificatesModal');
if (closeCertificatesBtn) {
    closeCertificatesBtn.addEventListener('click', closeCertificatesModal);
}

const leftArrow = document.getElementById('leftArrow');
if (leftArrow) {
    leftArrow.addEventListener('click', function () {
        navigateCertificates('left');
    });
}

const rightArrow = document.getElementById('rightArrow');
if (rightArrow) {
    rightArrow.addEventListener('click', function () {
        navigateCertificates('right');
    });
}

const keyboardNavigation = document.getElementById('certificatesModal');
if (keyboardNavigation) {
    keyboardNavigation.addEventListener('keydown', function (event) {
        if (event.key === 'ArrowLeft') {
            navigateCertificates('left');
        } else if (event.key === 'ArrowRight') {
            navigateCertificates('right');
        } else if (event.key === 'Escape') {
            closeCertificatesModal();
        }
    });
}

