// meetMe.js

// MEET ME MODULE
let currentIndex = 0;
let totalCertificates; // Declare totalCertificates in the global scope
let initialIndex; // Declare initialIndex here
let dragEndHandled = false; // Move the declaration here and initialize to false

document.addEventListener("DOMContentLoaded", function () {

    // FETCH CERTIFICATES FROM JSON DATA IN ORDER TO DISPLAY THE MODULE

    fetch('certificates.json')
        .then(response => response.json())
        .then(data => {
            certificates = data;
            const certificateContainer = document.getElementById('certificateContainer');
            const totalCertificates = certificates.length;
            const displayLimit = 3;

            function updateCertificates() {
                certificateContainer.innerHTML = ''; // Clear the container

                for (let i = 0; i < displayLimit; i++) {
                    const certificate = certificates[(currentIndex + i) % totalCertificates];

                    const certificateElement = document.createElement('div');
                    certificateElement.className = 'certificate-item';

                    const img = document.createElement('img');
                    img.src = certificate.src;
                    img.alt = certificate.alt;


                    certificateElement.tabIndex = '0';

                    certificateElement.addEventListener('click', function () {
                        openCertificatesModal(certificate);
                    });

                    certificateElement.addEventListener('dragstart', function (event) {
                        handleDragStart(event, currentIndex + i);
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
                        tocContentWrapper.style.backgroundImage = `url(${certificate.src})`; // Set background image
                        tocContentWrapper.style.backgroundSize = 'cover'; // Adjust background size as needed

                        // Set draggable to false on .toc-content-wrapper
                        tocContentWrapper.draggable = false;

                        tocContentWrapper.style.zIndex = (i === 0) ? 5 + 1 : (i === displayLimit - 1) ? 1 + 1 : 3 + 1;

                        certificateElement.appendChild(tocContentWrapper);
                    } else {
                        certificateElement.appendChild(img);

                    }

                    certificateElement.style.zIndex = (i === 0) ? 5 : (i === displayLimit - 1) ? 1 : 3;
                    certificateElement.classList.add((i === 0) ? 'first-certificate' : (i === displayLimit - 1) ? 'last-certificate' : 'middle-certificate');

                    certificateContainer.appendChild(certificateElement);

                    // Log certificates for debugging
                    console.log(`Certificate ${certificates.indexOf(certificate)} - certificateElement z-index: ${certificateElement.style.zIndex}`);

                    // Add a log for tocContentWrapper z-index
                    if (certificate.type === 'toc') {
                        console.log(`Certificate ${i} - tocContentWrapper z-index: ${tocContentWrapper.style.zIndex}`);
                        // Add the 'toc-image' class to the modal image with 'toc-content-wrapper'
                        certificateElement.classList.add('toc');

                        // Add hover effect to .toc-content-wrapper when .toc-image is hovered
                        certificateElement.addEventListener('mouseover', function () {
                            tocContentWrapper.style.transform = 'scale(1.1) translateY(-24%)';
                            tocContentWrapper.style.transition = 'transform 0.5s ease-in-out';
                        });

                        certificateElement.addEventListener('mouseout', function () {
                            tocContentWrapper.style.transform = 'none';
                            tocContentWrapper.style.transition = 'none';
                        });
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

            // LISTEN FOR DRAG TO NAVIGATE EVENTS IN ORDER TO GO BACKWARDS (RIGHT) OR FORWARDS (LEFT) THROUGH THE LOOP

            document.querySelectorAll(".certificate-item").forEach(function (certificateImage) {
                certificateImage.addEventListener("dragstart", function (event) {
                    console.log('Drag start event fired on image:', event);

                    handleDragStart(event, currentIndex);
                });
                certificateImage.addEventListener("dragover", function (event) {
                    console.log('Drag over event fired on image:', event);

                    handleDragMove(event);
                });
                certificateImage.addEventListener("dragend", function (event) {
                    console.log('Drag end event fired on image:', event);

                    handleDragEnd(event);
                });
            });

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

            // Store initial X position when drag starts
            let initialX;
            let isDragging = false;

            function handleDragStart(event) {
                isDragging = true;
                initialX = event.clientX;
                initialIndex = currentIndex;
                console.log('Drag Start', initialIndex);
                // Reset the drag end flag when drag starts
                dragEndHandled = false;
            }

            function handleDragMove(event) {
                if (isDragging && !dragEndHandled) {
                    const deltaX = event.clientX - initialX;

                    if (deltaX > 10) {
                        // Dragging to the right
                        if (event.target.closest('.modal-content-wrapper')) {
                            // Dragging inside modal content wrapper
                            navigateCertificates('right');
                        } else {
                            // Dragging inside certificate-item
                            currentIndex = (initialIndex + 1) % totalCertificates;
                            updateCertificates();
                        }
                    } else if (deltaX < -10) {
                        // Dragging to the left
                        if (event.target.closest('.modal-content-wrapper')) {
                            // Dragging inside modal content wrapper
                            navigateCertificates('left');
                        } else {
                            // Dragging inside certificate-item
                            currentIndex = (initialIndex - 1 + totalCertificates) % totalCertificates;
                            if (currentIndex < 0) {
                                currentIndex += totalCertificates;
                            }
                            updateCertificates();
                        }
                    }

                    console.log('Drag Move', deltaX, currentIndex);
                }
            }

            function handleDragEnd() {
                isDragging = false;
                // Set the drag end flag to true
                dragEndHandled = true;
                console.log('Drag End');
            }

            // Add event listeners for document-level drag events
            document.addEventListener("drag", handleDragMove);
            document.addEventListener("dragend", handleDragEnd);


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

                // Get the index of the clickedCertificate within the certificates array
                const indexInCertificates = certificates.findIndex(cert => cert.src === clickedCertificate.src);
                const modalLog = `Opened modal for CERTIFICATE (${indexInCertificates}) AND TYPE (${clickedCertificate.type.toUpperCase()})`;
                console.log(modalLog);

                // Create modal content wrapper
                const modalContentWrapper = document.createElement('div');
                modalContentWrapper.classList.add('modal-content-wrapper');

                // Add drag event listeners to the modal image
                modalContentWrapper.addEventListener("dragstart", function (event) {
                    handleDragStart(event, currentIndex);
                });

                modalContentWrapper.addEventListener("dragover", function (event) {
                    handleDragMove(event);
                });

                modalContentWrapper.addEventListener("dragend", function (event) {
                    handleDragEnd(event);
                });

                // Add TOC-specific content if the certificate is of type 'toc'
                if (clickedCertificate.type === 'toc') {

                    modalContentWrapper.classList.add('toc-modal');

                    const tocContentWrapper = document.createElement('div');
                    tocContentWrapper.className = 'toc-modal-content-wrapper';

                    // Add TOC-specific content
                    const headlineDiv = document.createElement('div');
                    headlineDiv.innerText = clickedCertificate.alt; // Assuming 'alt' contains the headline
                    headlineDiv.classList.add('toc-modal-headline');

                    tocContentWrapper.appendChild(headlineDiv);

                    const sectionsDiv = document.createElement('div');
                    sectionsDiv.className = 'toc-modal-sections';

                    clickedCertificate.sections.forEach(section => {
                        const textDiv = document.createElement('div');
                        textDiv.innerText = section.name;
                        textDiv.tabIndex = '0';

                        textDiv.addEventListener('click', function () {
                            navigateToSection(section.targetIndex);
                        });

                        sectionsDiv.appendChild(textDiv);
                    });

                    tocContentWrapper.appendChild(sectionsDiv);
                    tocContentWrapper.style.backgroundImage = `url(${clickedCertificate.src})`; // Set background image
                    tocContentWrapper.style.backgroundSize = 'cover'; // Adjust background size as needed

                    modalContentWrapper.appendChild(tocContentWrapper);
                } else {
                    // Create a modal image for the general certificates
                    const modalImage = document.createElement('img');
                    modalImage.classList.add('modal-content');
                    modalImage.src = clickedCertificate.src;
                    modalContentWrapper.appendChild(modalImage);
                }

                // Append the modal content wrapper to the certificate slider
                certificateSlider.innerHTML = ''; // Clear previous content
                certificateSlider.appendChild(modalContentWrapper);

                // Update lastModalId
                lastModalId = 'certificatesModal';
                console.log(certificates);


                // Display the modal
                modal.style.display = 'block';
                overlay.style.display = 'block';
            }



            // GLOBALLY SCOPED FUNCTIONS (MODAL NAVI & CLOSE FX)



            // NAVIGATE THROUGH CERTIFICATES IN THE MODAL

            // let modalWasNavigated = false;
            // let certificates; // Declare certificates in the global scope
            // let clickedCertificate; // Declare clickedCertificate in the global scope


            // Function to navigate through certificates in the modal
            function navigateCertificates(direction) {
                if (!certificates || certificates.length === 0) {
                    console.error('Error: Certificates array is empty.');
                    return;
                }
                const totalCertificates = certificates.length;
                console.log(totalCertificates);

                let displayedCertificateSrc;

                // Check if the current certificate is of type 'toc'
                if (certificates[currentIndex].type === 'toc') {
                    const tocContentWrapper = document.querySelector('#certificatesModal .toc-modal-content-wrapper');

                    // Check if the tocContentWrapper exists and has a background image
                    if (tocContentWrapper && tocContentWrapper.style.backgroundImage) {
                        // Extract the URL from the background image property
                        displayedCertificateSrc = tocContentWrapper.style.backgroundImage.replace('url("', '').replace('")', '');
                    }
                } else {
                    // Get the modal content element
                    const modalContent = document.querySelector('#certificatesModal .modal-content');

                    // Check if the modal content exists
                    if (modalContent) {
                        // Get the displayed certificate source using getAttribute
                        displayedCertificateSrc = modalContent.tagName === 'IMG' ? modalContent.getAttribute('src') : null;
                    }
                }

                console.log('Displayed Certificate Src:', displayedCertificateSrc);

                // Find the index of the displayed certificate in the certificates array
                const indexInCertificates = certificates.findIndex(cert => cert.src === displayedCertificateSrc);

                console.log(`Navigating from #(${indexInCertificates}) of type: (${certificates[indexInCertificates]?.type})`);


                // Update currentIndex based on the navigation direction

                if (direction === 'left') {
                    currentIndex = (indexInCertificates - 1 + totalCertificates) % totalCertificates;
                } else if (direction === 'right') {
                    currentIndex = (indexInCertificates + 1) % totalCertificates;
                }

                // Set the clickedCertificate for the updated currentIndex
                clickedCertificate = certificates[currentIndex];


                // Log the current index and type after navigation
                console.log(`NAVIGATING TO #(${currentIndex}) OF TYPE: (${certificates[currentIndex].type})`);

                // Update modalContentWrapper with the new certificate content
                // Create a new modalContentWrapper with the updated certificate content
                const newModalContentWrapper = document.createElement('div');
                newModalContentWrapper.classList.add('modal-content-wrapper');

                // Add drag event listeners to the modal image
                newModalContentWrapper.addEventListener("dragstart", function (event) {
                    console.log('Drag Start inside modal content wrapper:', event);

                    handleDragStart(event, currentIndex);
                });

                newModalContentWrapper.addEventListener("dragover", function (event) {
                    console.log('Dragging to Navigate from inside modal content wrapper:', event);

                    handleDragMove(event);
                });

                newModalContentWrapper.addEventListener("dragend", function (event) {
                    console.log('Drag End inside modal content wrapper:', event);

                    handleDragEnd(event);
                });

                // Add TOC-specific content if the certificate is of type 'toc'
                if (certificates[currentIndex].type === 'toc') {
                    newModalContentWrapper.classList.add('toc-modal');

                    const tocContentWrapper = document.createElement('div');
                    tocContentWrapper.className = 'toc-modal-content-wrapper';

                    // Add TOC-specific content
                    const headlineDiv = document.createElement('div');
                    headlineDiv.innerText = certificates[currentIndex].alt; // Assuming 'alt' contains the headline
                    headlineDiv.classList.add('toc-modal-headline');

                    tocContentWrapper.appendChild(headlineDiv);

                    const sectionsDiv = document.createElement('div');
                    sectionsDiv.className = 'toc-modal-sections';

                    certificates[currentIndex].sections.forEach(section => {
                        const textDiv = document.createElement('div');
                        textDiv.innerText = section.name;
                        textDiv.tabIndex = '0';

                        textDiv.addEventListener('click', function () {
                            navigateToSection(section.targetIndex);
                        });

                        sectionsDiv.appendChild(textDiv);
                    });

                    tocContentWrapper.appendChild(sectionsDiv);
                    tocContentWrapper.style.backgroundImage = `url(${clickedCertificate.src})`; // Set background image
                    tocContentWrapper.style.backgroundSize = 'cover'; // Adjust background size as needed

                    newModalContentWrapper.appendChild(tocContentWrapper);

                } else {
                    // Create a modal image for general certificates
                    const newModalImage = document.createElement('img');
                    newModalImage.classList.add('modal-content');
                    newModalImage.src = certificates[currentIndex].src;
                    newModalContentWrapper.appendChild(newModalImage);
                }

                // Get the certificate slider
                const certificateSlider = document.querySelector('#certificatesModal .certificate-slider');

                // Clear previous content and append the new modal content wrapper
                certificateSlider.innerHTML = '';
                certificateSlider.appendChild(newModalContentWrapper);

                // Update lastModalId
                lastModalId = 'certificatesModal';

                // Set the flag to true indicating modal navigation after successful navigation
                modalWasNavigated = true;

                // Display the modal
                const modal = document.getElementById('certificatesModal');
                const overlay = document.getElementById('overlay');
                modal.style.display = 'block';
                overlay.style.display = 'block';
            }


            // CLOSE MODAL (CERTIFICATE OR DIPLOMA) 

            function closeModal(modalId) {
                const modal = document.getElementById(modalId);
                const overlay = document.getElementById('overlay');

                if (modalId === 'diplomaModal') {
                    // Handle diploma modal if needed
                } else {

                    // Check if the current certificate is of type 'toc'
                    if (certificates[currentIndex].type === 'toc') {
                        const tocContentWrapper = document.querySelector('#certificatesModal .toc-modal-content-wrapper');

                        // Check if the tocContentWrapper exists and has a background image
                        if (tocContentWrapper && tocContentWrapper.style.backgroundImage) {
                            // Extract the URL from the background image property
                            displayedCertificateSrc = tocContentWrapper.style.backgroundImage.replace('url("', '').replace('")', '');
                        }
                    } else {
                        // Get the modal content element
                        const modalContent = document.querySelector('#certificatesModal .modal-content');

                        // Check if the modal content exists
                        if (modalContent) {
                            // Get the displayed certificate source using getAttribute
                            displayedCertificateSrc = modalContent.tagName === 'IMG' ? modalContent.getAttribute('src') : null;
                        }

                    }

                    console.log('Displayed Certificate Src:', displayedCertificateSrc);

                    // Find the index of the displayed certificate in the certificates array
                    const currentIndexInArray = certificates.findIndex(cert => cert.src === displayedCertificateSrc);

                    console.log(`Closed Certificate Modal. Index: ${currentIndexInArray}`);
                    const closeModalEvent = new CustomEvent('modalClosed', { detail: { currentIndex: currentIndexInArray } });
                    document.dispatchEvent(closeModalEvent);
                }

                modal.style.display = 'none';
                overlay.style.display = 'none';
                console.log(`Modal with ID ${modalId} closed. Display: ${modal.style.display}`);
            }

            window.addEventListener("resize", updateCertificates);
            updateCertificates();
        })
        .catch(error => {
            console.error('Error loading certificates:', error);
        });


}); // DOMContentLoaded Section Ends