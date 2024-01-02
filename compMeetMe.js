const certificateContainer = document.getElementById('certificateContainer');
const certificatesData = /* ... your certificates array ... */;
const totalCertificates = certificatesData.length;
const displayLimit = 3;
let currentIndex = 0;

function updateCertificates() {
  certificateContainer.innerHTML = ''; // Clear the container
  for (let i = 0; i < displayLimit; i++) {
    const adjustedIndex = (currentIndex + i) % totalCertificates;
    const certificate = certificatesData[adjustedIndex];

    const certificateElement = document.createElement('div');
    certificateElement.className = 'certificate-item';
    certificateElement.innerHTML = `<img src="${certificate.src}" alt="${certificate.alt}">`;
    certificateContainer.appendChild(certificateElement);
  }
}
