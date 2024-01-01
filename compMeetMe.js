// Find the diploma image element
const diplomaImage = document.querySelector('.single-image img');

// Check if the diploma image element exists
if (diplomaImage) {
    // Add a click event listener to the diploma image
    diplomaImage.addEventListener('click', function (event) {
        openDiplomaModal(event);
        lastModalId = 'diplomaModal';
    });
}
