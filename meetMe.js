// meetMe.js

// MEET ME MODULE
let currentIndex = 0;
let totalCertificates; // Declare totalCertificates in the global scope
let initialIndex; // Declare initialIndex here
let certificates; // Declare certificates in the global scope
let clickedCertificate; // Declare clickedCertificate in the global scope
// Add a flag to check if the user has interacted
let userInteracted = false;

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
                const tocIcon = document.getElementById('tocIcon');
                // Check if TOC certificate is in the container
                const tocCertificateInContainer = certificates.some((cert, index) =>
                    cert.type === 'toc' &&
                    index === 0 &&
                    currentIndex % totalCertificates === index % totalCertificates
                );
                // Toggle the display of the icon based on the condition
                tocIcon.style.display = tocCertificateInContainer ? 'none' : 'block';

                // Add an event listener to the tocIcon
                tocIcon.addEventListener('click', function () {

                    // Update the currentIndex and certificates with the TOC index
                    currentIndex = 0;
                    updateCertificates();
                });
                for (let i = 0; i < displayLimit; i++) {
                    const certificate = certificates[(currentIndex + i) % totalCertificates];

                    const certificateElement = document.createElement('div');
                    certificateElement.className = 'certificate-item';

                    const img = document.createElement('img');
                    img.src = certificate.src;
                    img.alt = certificate.alt;


                    certificateElement.tabIndex = '0';

                    certificateElement.addEventListener('click', function () {
                        currentIndex = certificates.indexOf(certificate);
                        updateCertificatesModal();
                    });


                    // LISTEN FOR DRAG TO NAVIGATE EVENTS IN ORDER TO GO BACKWARDS (RIGHT) OR FORWARDS (LEFT) THROUGH THE LOOP IN THE CERTIFICATE-CONTAINER

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

                        // Split the alt text into words
                        const words = certificate.alt.split(' ');

                        // Insert <br> after the first word
                        words.splice(1, 0, '<br>');

                        // Join the words back together
                        const updatedAlt = words.join(' ');

                        // Set the innerText with the updated alt
                        headlineDiv.innerHTML = updatedAlt;

                        headlineDiv.classList.add('toc-headline');
                        tocContentWrapper.appendChild(headlineDiv);


                        const sectionsDiv = document.createElement('div');
                        sectionsDiv.className = 'toc-sections';

                        certificate.sections.forEach(section => {
                            const textDiv = document.createElement('div');
                            textDiv.innerText = section.name;
                            textDiv.tabIndex = '0';

                            // EVENT LISTENERS TO TRIGGER AUDIO LOGIC FOR EACH OF THE 7 TOC SECTIONS TABS

                            // Add hover event to play the corresponding note
                            textDiv.addEventListener('mouseover', function () {
                                if (userInteracted) {
                                    const audioElement = document.getElementById(section.noteId);
                                    if (audioElement) {
                                        audioElement.currentTime = 0; // Reset audio to start
                                        audioElement.play(); // Start playing
                                        console.log(`Music is playing for section with noteId ${section.noteId}`);
                                    }
                                }
                            });

                            textDiv.addEventListener('mouseleave', function () {
                                const audioElement = document.getElementById(section.noteId);
                                if (userInteracted && audioElement) {
                                    if (!audioElement.paused) {
                                        // Add a short delay before pausing to avoid the warning
                                        setTimeout(() => {
                                            audioElement.pause(); // Pause only if it's currently playing
                                            audioElement.currentTime = 0; // Reset audio to start
                                            console.log(`Music is paused for section with noteId ${section.noteId}`);
                                        }, 100);
                                    }
                                }
                            });

                            textDiv.addEventListener('click', function (event) {
                                event.stopPropagation();
                                // Stop the audio playback
                                const audioElement = document.getElementById(section.noteId);
                                if (audioElement) {
                                    audioElement.pause();
                                    audioElement.currentTime = 0; // Reset audio to start
                                    console.log(`Music is stopped because the user chose the certificate with target index ${section.targetIndex}`);
                                }
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

            function navigateToSection(targetIndex, isModal = false) {
                currentIndex = targetIndex;

                if (isModal) {
                    updateCertificatesModal(); // Call the combined function to handle modal updates
                } else {
                    updateCertificates();
                }
            }

            // Listen for any user interaction event (e.g., click)
            document.addEventListener('click', function () {
                // Set the flag to true once the user interacts
                userInteracted = true;
            });



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


            // MODAL LOGIC BEGINS HERE

            // MODAL NAVI CLICK EVENT (GOES BACKWARD THROUGH LOOP) 

            document.querySelector("#leftArrow").addEventListener("click", function () {
                currentIndex = (currentIndex - 1 + totalCertificates) % totalCertificates;
                updateCertificatesModal();
            });

            // MODAL NAVI CLICK EVENT (GOES FORWARD THROUGH LOOP)

            document.querySelector("#rightArrow").addEventListener("click", function () {
                currentIndex = (currentIndex + 1) % totalCertificates;
                updateCertificatesModal();
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

            // LISTEN FOR CLICKS ON THE MODAL CLOSE ICON TO CLOSE THE MODAL

            // Add event listener for certificatesModal close button
            const certificatesCloseButton = document.getElementById('certificatesCloseButton');
            if (certificatesCloseButton) {
                certificatesCloseButton.addEventListener('click', function () {
                    closeModal('certificatesModal');
                });
            }

            // Add event listener for diplomaModal close button
            const diplomaCloseButton = document.getElementById('diplomaCloseButton');
            if (diplomaCloseButton) {
                diplomaCloseButton.addEventListener('click', function () {
                    closeModal('diplomaModal');
                });
            }

            // ACCESSIBILITY MATTERS: KEYBOARD EVENTS FOR MODAL NAVI


            // Accessible keyboard events for CERTIFICATE modal navigation
            const keyboardNavigation = document.getElementById('certificatesModal');
            if (keyboardNavigation) {
                keyboardNavigation.addEventListener('keydown', function (event) {
                    if (userInteracted) {
                        if (event.key === 'ArrowLeft') {
                            currentIndex = (currentIndex - 1 + totalCertificates) % totalCertificates;
                            updateCertificatesModal();
                        } else if (event.key === 'ArrowRight') {
                            currentIndex = (currentIndex + 1) % totalCertificates;
                            updateCertificatesModal();
                        } else if (event.key === 'Escape') {
                            closeModal();
                        }
                    }
                });
            }

            // Accessible keyboard events for DIPLOMA modal navigation
            const diplomaModal = document.getElementById('diplomaModal');
            if (diplomaModal) {
                diplomaModal.addEventListener('keydown', function (event) {
                    if (userInteracted) {
                        if (event.key === 'Escape') {
                            closeModal('diplomaModal');
                        }
                    }
                });
            }


            // DRAG FUNCTIONS TO NAVIGATE THROUGH CERTIFICATES (IN CERT-CONTAINER/SLIDER)

            // Store initial X position when drag starts
            let initialX;
            let isDragging = false;

            function handleDragStart(event) {
                isDragging = true;
                initialX = event.clientX;
                initialIndex = currentIndex;
                console.log('Drag Start', initialIndex);
            }

            function handleDragMove(event) {
                if (isDragging) {
                    const deltaX = event.clientX - initialX;

                    console.log('Drag Move', deltaX, currentIndex);

                    // Adjust the threshold value as needed
                    const dragThreshold = 7;

                    if (Math.abs(deltaX) > dragThreshold) {
                        if (deltaX > 0) {
                            // Dragging to the right
                            currentIndex = (initialIndex + 1) % totalCertificates;
                            updateCertificatesModal();
                        } else if (deltaX < 0) {
                            // Dragging to the left
                            currentIndex = (initialIndex - 1 + totalCertificates) % totalCertificates;
                            if (currentIndex < 0) {
                                currentIndex += totalCertificates;
                            }
                            updateCertificatesModal();
                        }
                    }

                    isDragging = false; // Set isDragging to false at the end of the move
                }
            }

            function handleDragEnd() {
                isDragging = false;

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

            // OPEN CERTIFICATES MODAL (CREATES MODAL DISPLAY AND ADDS DRAG AND CLICK EVENT LISTENERS TO OPENED CERTIFICATE)

            function updateCertificatesModal() {
                const modal = document.getElementById('certificatesModal');
                const overlay = document.getElementById('overlay');
                const certificateSlider = modal.querySelector('.certificate-slider');

                if (!modal || !overlay || !certificateSlider || certificates.length === 0) {
                    console.error('Error: Required elements for the certificates modal are missing or certificates array is empty');
                    return;
                }

                // Get the index of the clickedCertificate within the certificates array
                const indexInCertificates = currentIndex;
                const clickedCertificate = certificates[indexInCertificates];
                const modalLog = `Opened modal for CERTIFICATE (${indexInCertificates}) AND TYPE (${clickedCertificate.type ? clickedCertificate.type.toUpperCase() : 'Unknown'})`;
                console.log(modalLog);

                // Set currentIndex to the index of the clicked certificate
                currentIndex = indexInCertificates;

                // Create modal content wrapper
                const modalContentWrapper = document.createElement('div');
                modalContentWrapper.classList.add('modal-content-wrapper');

                // Add drag event listeners to the modal image
                modalContentWrapper.addEventListener("dragstart", function (event) {
                    console.log('Drag Start inside modal content wrapper:', event);
                    handleDragStart(event, currentIndex);
                });

                // Add TOC-specific content if the certificate is of type 'toc'
                if (clickedCertificate.type === 'toc') {
                    modalContentWrapper.classList.add('toc-modal');

                    const tocContentWrapper = document.createElement('div');
                    tocContentWrapper.className = 'toc-modal-content-wrapper';

                    // Add TOC-specific content

                    const headlineDiv = document.createElement('div');
                    headlineDiv.classList.add('toc-modal-headline');
                    headlineDiv.innerText = clickedCertificate.alt; // Assuming 'alt' contains the headline

                    // Split the headline text into words
                    const words = headlineDiv.innerText.split(' ');

                    // Insert <br> after the first word
                    words.splice(1, 0, '<br>');

                    // Join the words back together
                    const updatedHeadline = words.join(' ');

                    // Set the innerHTML with the updated headline
                    headlineDiv.innerHTML = updatedHeadline;

                    // Append the headline to the modal content wrapper
                    tocContentWrapper.appendChild(headlineDiv);

                    const sectionsDiv = document.createElement('div');
                    sectionsDiv.className = 'toc-modal-sections';

                    clickedCertificate.sections.forEach(section => {
                        const textDiv = document.createElement('div');
                        textDiv.innerText = section.name;
                        textDiv.tabIndex = '0';

                        // Add hover event to play the corresponding note
                        textDiv.addEventListener('mouseover', function () {
                            if (userInteracted) {
                                const audioElement = document.getElementById(section.noteId);
                                if (audioElement) {
                                    audioElement.currentTime = 0; // Reset audio to start
                                    audioElement.play(); // Start playing
                                    console.log(`Music is playing for section with noteId ${section.noteId}`);
                                }
                            }
                        });

                        textDiv.addEventListener('mouseleave', function () {
                            const audioElement = document.getElementById(section.noteId);
                            if (userInteracted && audioElement) {
                                if (!audioElement.paused) {
                                    // Add a short delay before pausing to avoid the warning
                                    setTimeout(() => {
                                        audioElement.pause(); // Pause only if it's currently playing
                                        audioElement.currentTime = 0; // Reset audio to start
                                        console.log(`Music is paused for section with noteId ${section.noteId}`);
                                    }, 100);
                                }
                            }
                        });

                        textDiv.addEventListener('click', function (event) {
                            event.stopPropagation();
                            // Stop the audio playback
                            const audioElement = document.getElementById(section.noteId);
                            if (audioElement) {
                                audioElement.pause();
                                audioElement.currentTime = 0; // Reset audio to start
                                console.log(`Music is stopped because the user chose the certificate with target index ${section.targetIndex}`);
                            }
                            navigateToSection(section.targetIndex, true);
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

                // Add a class to the certificate-slider when updating the modal
                certificateSlider.classList.add('flash-animation');

                // Wait for the animation to complete and then remove the class
                setTimeout(() => {
                    certificateSlider.classList.remove('flash-animation');
                }, 500); // Adjust the duration to match your CSS animation duration


                // Update lastModalId
                lastModalId = 'certificatesModal';
                console.log(certificates);

                // Display the modal
                modal.style.display = 'block';
                overlay.style.display = 'block';
            }

            // CLOSE MODAL (CERTIFICATE OR DIPLOMA) 

            function closeModal(modalId) {
                const modal = document.getElementById(modalId);
                const overlay = document.getElementById('overlay');

                // Get the index of the certificate to be on top when closing the modal
                const currentIndexInArray = currentIndex;

                // Update the certificates display
                const closeModalEvent = new CustomEvent('modalClosed', { detail: { currentIndex: currentIndexInArray } });
                document.dispatchEvent(closeModalEvent);

                // Close the modal
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