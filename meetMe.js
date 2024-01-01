// meetMe.js

// MEET ME INITIALIZED MODULE

document.addEventListener("DOMContentLoaded", function () {

    // FETCH CERTIFICATES FROM JSON DATA IN ORDER TO DISPLAY THE MODULE

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

            const certificates = document.querySelectorAll(".certificate-container img");
            const totalCertificates = certificates.length;

            const displayLimit = 3;
            let currentIndex = 0;

            // UPDATE CERTIFICATES

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

            // LISTEN FOR CLICK EVENT TO GO FORWARDS THROUGH THE LOOP OF CERTIFICATES (THEN UPDATE CERTIFICATES)

            document.querySelector(".right").addEventListener("click", function () {
                currentIndex = (currentIndex + 1) % totalCertificates;
                updateCertificates();
            });

            // LISTEN FOR CLICK EVENT TO GO BACKWARDS THROUGH THE LOOP OF CERTIFICATES (THEN UPDATE CERTIFICATES)

            document.querySelector(".left").addEventListener("click", function () {
                currentIndex = (currentIndex - 1 + totalCertificates) % totalCertificates;
                updateCertificates();
            });

            // ACCESSIBILITY MATTERS: Keyboard event handling for right arrow

            document.querySelector(".right").addEventListener("keydown", function (event) {
                if (event.key === "Enter" || event.key === " ") {
                    currentIndex = (currentIndex + 1) % totalCertificates;
                    updateCertificates();
                    event.preventDefault();
                }
            });

            // ACCESSIBILITY MATTERS: Keyboard event handling for left arrow

            document.querySelector(".left").addEventListener("keydown", function (event) {
                if (event.key === "Enter" || event.key === " ") {
                    currentIndex = (currentIndex - 1 + totalCertificates) % totalCertificates;
                    updateCertificates();
                    event.preventDefault();
                }
            });

            // LISTEN FOR DISPATCH OF THE MODALCLOSED EVENT (THEN UPDATE CERTIFICATES)

            document.addEventListener('modalClosed', function (event) {
                console.log('Received modalClosed event. Current Index of closed Certificate in the array:', event.detail.currentIndex);

                currentIndex = event.detail.currentIndex;
                console.log('Setting starting display of current index to the certificate it was closed on:', currentIndex);

                updateCertificates();
            });

            // LISTEN FOR FROM CLICK EVENT ON OVERLAY TO CLOSE THE MODAL

            const overlay = document.getElementById('overlay');
            overlay.addEventListener('click', function (event) {
                // Check if the click occurred outside the modal content
                const modalContent = document.querySelector('.modal-content');
                if (modalContent && !modalContent.contains(event.target)) {
                    // Close the modal based on the lastModalId variable
                    closeModal(lastModalId);
                }
            });
            // MODAL NAVI CLICK EVENT (GOES BACKWARD THROUGH LOOP) 

            const leftArrow = document.getElementById('leftArrow');
            if (leftArrow) {
                leftArrow.addEventListener('click', function () {
                    navigateCertificates('left');
                });
            }

            // MODAL NAVI CLICK EVENT (GOES FORWARD THROUGH LOOP)

            const rightArrow = document.getElementById('rightArrow');
            if (rightArrow) {
                rightArrow.addEventListener('click', function () {
                    navigateCertificates('right');
                });
            }

            // ACCESSIBILITY MATTERS: KEYBOARD EVENTS FOR MODAL NAVI

            const keyboardNavigation = document.getElementById('certificatesModal');
            if (keyboardNavigation) {
                keyboardNavigation.addEventListener('keydown', function (event) {
                    if (event.key === 'ArrowLeft') {
                        navigateCertificates('left');
                    } else if (event.key === 'ArrowRight') {
                        navigateCertificates('right');
                    } else if (event.key === 'Escape') {
                        closeModal();
                    }
                });
            }
            // LISTEN FOR CLICK EVENT ON DIPLOMA IMAGE TO OPEN DIPLOMA MODAL

            let lastModalId;

            const diplomaImage = document.querySelector('.single-image img');
            if (diplomaImage) {
                diplomaImage.addEventListener('click', function (event) {
                    openDiplomaModal(event);
                    lastModalId = 'diplomaModal';
                    console.log('Clicked on diplomaImage.');
                });
            }

            // OPEN CERTIFICATES MODAL (includes click event)

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
            // OPEN DIPLOMA MODAL

            function openDiplomaModal(event) {
                const overlay = document.getElementById('overlay');
                const modal = document.getElementById('diplomaModal');
                const modalImage = document.getElementById('diplomaImage');

                const clickedImageSrc = event.target.src;
                modalImage.src = clickedImageSrc;
                modal.style.display = 'block';
                overlay.style.display = 'block';
            }
            window.addEventListener("resize", updateCertificates);
            updateCertificates();
        })
        .catch(error => {
            console.error('Error loading certificates:', error);
        });

    // MODAL LOGIC BEGINS HERE





}); // DOMContentLoaded Section Ends

// GLOBALLY SCOPED FUNCTIONS (MODAL NAVI & CLOSE FX)

// NAVIGATE THROUGH CERTIFICATES IN THE MODAL

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

// CLOSE MODAL (CERTIFICATE OR DIPLOMA) 

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