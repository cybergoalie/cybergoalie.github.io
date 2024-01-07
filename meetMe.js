// meetMe.js

// MEET ME MODULE

document.addEventListener("DOMContentLoaded", function () {

    // FETCH CERTIFICATES FROM JSON DATA IN ORDER TO DISPLAY THE MODULE

    fetch('certificates.json')
        .then(response => response.json())
        .then(data => {
            certificates = data;
            const certificateContainer = document.getElementById('certificateContainer');
            const totalCertificates = certificates.length;
            const displayLimit = 3;
            let currentIndex = 0;


            function updateCertificates() {
                certificateContainer.innerHTML = ''; // Clear the container

                for (let i = 0; i < displayLimit; i++) {
                    const certificate = certificates[(currentIndex + i) % totalCertificates];

                    const certificateElement = document.createElement('div');
                    certificateElement.className = 'certificate-item';

                    const img = document.createElement('img');
                    img.src = certificate.src;
                    img.alt = certificate.alt;
                    img.tabIndex = '0';

                    img.addEventListener('click', function () {
                        openCertificatesModal(certificate);
                    });

                    let tocContentWrapper; // Declare tocContentWrapper outside the if statement

                    if (certificate.type === 'toc') {
                        certificateElement.classList.add('toc');

                        // Handle TOC certificate item
                        tocContentWrapper = document.createElement('div');
                        tocContentWrapper.className = 'toc-content-wrapper';

                        // Add TOC-specific content
                        const headlineDiv = document.createElement('div');
                        headlineDiv.innerText = certificate.alt; // Assuming 'alt' contains the headline
                        headlineDiv.classList.add('toc-headline');

                        tocContentWrapper.appendChild(headlineDiv);

                        const sectionsDiv = document.createElement('div');
                        sectionsDiv.className = 'toc-sections';

                        certificate.sections.forEach(section => {
                            const textDiv = document.createElement('div');
                            textDiv.innerText = section.name;
                            textDiv.tabIndex = '0';

                            textDiv.addEventListener('click', function () {
                                navigateToSection(section.targetIndex);
                            });

                            sectionsDiv.appendChild(textDiv);
                        });

                        tocContentWrapper.appendChild(sectionsDiv);

                        tocContentWrapper.style.position = 'absolute';
                        tocContentWrapper.style.zIndex = (i === 0) ? 5 + 1 : (i === displayLimit - 1) ? 1 + 1 : 3 + 1;

                        certificateElement.appendChild(tocContentWrapper);
                        certificateElement.style.position = 'relative';
                    }

                    certificateElement.style.zIndex = (i === 0) ? 5 : (i === displayLimit - 1) ? 1 : 3;
                    certificateElement.classList.add((i === 0) ? 'first-certificate' : (i === displayLimit - 1) ? 'last-certificate' : 'middle-certificate');

                    certificateElement.appendChild(img);
                    certificateContainer.appendChild(certificateElement);

                    // Log certificates for debugging
                    console.log(`Certificate ${certificates.indexOf(certificate)} - certificateElement z-index: ${certificateElement.style.zIndex}`);

                    // Add a log for tocContentWrapper z-index
                    if (certificate.type === 'toc') {
                        console.log(`Certificate ${i} - tocContentWrapper z-index: ${tocContentWrapper.style.zIndex}`);
                    }
                }
            }

            function navigateToSection(targetIndex) {
                currentIndex = targetIndex;
                updateCertificates();
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

            // DRAG AND DROP EVENTS IN ORDER TO GO BACKWARDS (RIGHT) OR FORWARDS (LEFT) THROUGH THE LOOP

            document.querySelectorAll(".certificate-item img").forEach(function (certificateImage) {
                certificateImage.addEventListener("dragstart", function (event) {
                    handleDragStart(event, currentIndex);
                });
                certificateImage.addEventListener("dragover", function (event) {
                    handleDragMove(event);
                });
                certificateImage.addEventListener("dragend", function (event) {
                    handleDragEnd(event);
                });
            });

            // Store initial X position when drag starts
            let initialX;
            let isDragging = false;
            let initialIndex;

            function handleDragStart(event) {
                isDragging = true;
                initialX = event.clientX;
                initialIndex = currentIndex;
                console.log('Drag Start', initialIndex);
            }

            function handleDragMove(event) {
                if (isDragging) {
                    const deltaX = event.clientX - initialX;

                    if (deltaX > 10) {
                        // Dragging to the right
                        currentIndex = (initialIndex + 1) % totalCertificates;
                    } else if (deltaX < -10) {
                        // Dragging to the left
                        currentIndex = (initialIndex - 1 + totalCertificates) % totalCertificates;
                        if (currentIndex < 0) {
                            currentIndex += totalCertificates;
                        }
                    }

                    updateCertificates();
                }
            }
            function handleDragEnd() {
                isDragging = false;
                console.log('Drag End');
            }

            // Add event listeners for document-level drag events
            document.addEventListener("drag", handleDragMove);
            document.addEventListener("dragend", handleDragEnd);

            // MODAL LOGIC BEGINS HERE

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

            const diplomaImage = document.querySelector('.diploma-wrapper img');
            if (diplomaImage) {
                diplomaImage.addEventListener('click', function (event) {

                    openDiplomaModal(event);
                    lastModalId = 'diplomaModal';
                    console.log('Clicked on diplomaImage.');
                });
            }

            // OPEN DIPLOMA MODAL

            function openDiplomaModal(event) {
                const overlay = document.getElementById('overlay');
                const modal = document.getElementById('diplomaModal');
                const modalImage = document.getElementById('diplomaImage');

                // Check if required elements exist
                if (!overlay || !modal || !modalImage) {
                    console.error('Error: Required elements for the diploma modal are missing.');
                    return;
                }

                const clickedImageSrc = event.target.src;
                modalImage.src = clickedImageSrc;

                modal.style.display = 'block';
                overlay.style.display = 'block';

                console.log('Diploma modal opened successfully.');
            }

            // OPEN CERTIFICATES MODAL (includes click event)

            function openCertificatesModal(clickedCertificate) {
                const modal = document.getElementById('certificatesModal');
                const overlay = document.getElementById('overlay');
                const certificateSlider = modal.querySelector('.certificate-slider');

                if (!modal || !overlay || !certificateSlider || certificates.length === 0) {
                    console.error('Error: Required elements for the certificates modal are missing or certificates array is empty');
                    return;
                }

                // Log the entire certificates array
                console.log('# OF Certificates IN CERTIFICATES.JSON:', certificates.length);

                // Get the index of the clickedCertificate within the certificates array
                const indexInCertificates = certificates.findIndex(cert => cert.src === clickedCertificate.src);
                const modalLog = `Opened modal for CERTIFICATE (${indexInCertificates}) AND TYPE (${clickedCertificate.type.toUpperCase()})`;
                console.log(modalLog);

                // Create modal content wrapper
                const modalContentWrapper = document.createElement('div');
                modalContentWrapper.classList.add('modal-content-wrapper');

                // Create a common modal image
                const modalImage = document.createElement('img');
                modalImage.classList.add('modal-content');
                modalImage.src = clickedCertificate.src;

                // Handle TOC Certificate
                if (clickedCertificate.type === 'toc') {
                    // Create TOC modal content
                    const tocModalContent = document.createElement('div');
                    tocModalContent.classList.add('toc-modal', 'modal-content');
                    tocModalContent.style.backgroundImage = `url(${clickedCertificate.src})`;

                    // Create TOC content wrapper
                    const tocContentWrapper = document.createElement('div');
                    tocContentWrapper.classList.add('toc-content-wrapper');

                    // Add TOC headline to TOC content wrapper
                    const tocHeadlineDiv = document.createElement('div');
                    tocHeadlineDiv.innerText = clickedCertificate.alt; // Assuming 'alt' contains the headline
                    tocHeadlineDiv.classList.add('toc-headline');
                    tocContentWrapper.appendChild(tocHeadlineDiv);

                    // Add TOC sections to TOC content wrapper
                    const tocSectionsDiv = document.createElement('div');
                    tocSectionsDiv.classList.add('toc-sections');

                    clickedCertificate.sections.forEach(section => {
                        const sectionDiv = document.createElement('div');
                        sectionDiv.innerText = section.name;
                        sectionDiv.addEventListener('click', function () {
                            navigateCertificates(section.targetIndex);
                            closeModal('certificatesModal'); // Close the TOC modal after navigation
                        });
                        tocSectionsDiv.appendChild(sectionDiv);
                    });

                    // Append TOC sections to TOC content wrapper
                    tocContentWrapper.appendChild(tocSectionsDiv);

                    // Append TOC content wrapper to TOC modal content
                    tocModalContent.appendChild(tocContentWrapper);

                    // Append TOC modal content to modal content wrapper
                    modalContentWrapper.appendChild(tocModalContent);
                } else {
                    // Append regular modal image to wrapper
                    modalContentWrapper.appendChild(modalImage);
                }

                // Update Certificate Slider
                certificateSlider.innerHTML = '';
                certificateSlider.appendChild(modalContentWrapper);

                // Update lastModalId
                lastModalId = 'certificatesModal';
                console.log(certificates);

             

                // Display Modal and Overlay
                modal.style.display = 'block';
                overlay.style.display = 'block';

                console.log(modalLog);
            }




            window.addEventListener("resize", updateCertificates);
            updateCertificates();
        })
        .catch(error => {
            console.error('Error loading certificates:', error);
        });


}); // DOMContentLoaded Section Ends

// GLOBALLY SCOPED FUNCTIONS (MODAL NAVI & CLOSE FX)


// NAVIGATE THROUGH CERTIFICATES IN THE MODAL

let currentIndex = 0; // You can initialize it to 0 or any other initial index
let modalWasNavigated = false;
let certificates; // Declare certificates in the global scope

// Function to navigate through certificates in the modal
function navigateCertificates(direction) {
    if (!certificates || certificates.length === 0) {
        console.error('Error: Certificates array is empty.');
        return;
    }
    const totalCertificates = certificates.length;

    // Log the current index and type before navigation
    console.log(`NAVIGATING FROM #(${currentIndex}) OF TYPE: (${certificates[currentIndex].type})`);

    // Update currentIndex based on the navigation direction
    if (direction === 'left') {
        currentIndex = (currentIndex - 1 + totalCertificates) % totalCertificates;
    } else if (direction === 'right') {
        currentIndex = (currentIndex + 1) % totalCertificates;
    }
    // Log the current index and type after navigation
    console.log(`NAVIGATING TO #(${currentIndex}) OF TYPE: (${certificates[currentIndex].type})`);


    // Create modal content wrapper
    const modalContentWrapper = document.createElement('div');
    modalContentWrapper.classList.add('modal-content-wrapper');

    // Get the current certificate
    const currentCertificate = certificates[currentIndex];

    // Create a common modal image
    const modalImage = document.createElement('img');
    modalImage.classList.add('modal-content');
    modalImage.src = currentCertificate.src;

    // Append modal image to wrapper
    modalContentWrapper.appendChild(modalImage);

    // Handle TOC Certificate
    if (currentCertificate.type === 'toc') {
        // Create TOC modal content
        const tocModalContent = document.createElement('div');
        tocModalContent.classList.add('toc-modal', 'modal-content');
        tocModalContent.style.backgroundImage = `url(${currentCertificate.src})`;

        // Create TOC content wrapper
        const tocContentWrapper = document.createElement('div');
        tocContentWrapper.classList.add('toc-content-wrapper');

        // Add TOC headline to TOC content wrapper
        const tocHeadlineDiv = document.createElement('div');
        tocHeadlineDiv.innerText = currentCertificate.alt;
        tocHeadlineDiv.classList.add('toc-headline');
        tocContentWrapper.appendChild(tocHeadlineDiv);

        // Add TOC sections to TOC content wrapper
        const tocSectionsDiv = document.createElement('div');
        tocSectionsDiv.classList.add('toc-sections');

        currentCertificate.sections.forEach(section => {
            const sectionDiv = document.createElement('div');
            sectionDiv.innerText = section.name;
            sectionDiv.addEventListener('click', function () {
                navigateToSection(section.targetIndex);
                // closeModal('certificatesModal'); // Close the TOC modal after navigation
            });
            tocSectionsDiv.appendChild(sectionDiv);
        });

        // Append TOC sections to TOC content wrapper
        tocContentWrapper.appendChild(tocSectionsDiv);

        // Append TOC content wrapper to TOC modal content
        tocModalContent.appendChild(tocContentWrapper);

        // Append TOC modal content to modal content wrapper
        modalContentWrapper.innerHTML = '';
        modalContentWrapper.appendChild(tocModalContent);
    }

    // Update Certificate Slider
    const certificateSlider = document.querySelector('.certificate-slider');
    certificateSlider.innerHTML = '';
    certificateSlider.appendChild(modalContentWrapper);

    // Log after updating Certificate Slider
    console.log(`Completed Navigation to Certificate #(${currentIndex})`);


}










// CLOSE MODAL (CERTIFICATE OR DIPLOMA) 

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    const overlay = document.getElementById('overlay');

    if (modalId === 'diplomaModal') {
        // Handle diploma modal if needed
    } else {
        const closedCert = document.querySelector('.certificate-container img:not(.hidden)');

        if (!closedCert) {
            console.error('Error: No certificate found. Aborting closeModal.');
            return;
        }

        let currentIndex;

        if (modalWasNavigated) {
            currentIndex = currentIndex;
            modalWasNavigated = false;
        } else {
            const certificates = document.querySelectorAll(".certificate-container img");
            currentIndex = Array.from(certificates).indexOf(closedCert);
        }

        console.log(`Closed Certificate Modal. Index: ${currentIndex}`);
        const closeModalEvent = new CustomEvent('modalClosed', { detail: { currentIndex } });
        document.dispatchEvent(closeModalEvent);
    }

    modal.style.display = 'none';
    overlay.style.display = 'none';
    console.log(`Modal with ID ${modalId} closed. Display: ${modal.style.display}`);
}
