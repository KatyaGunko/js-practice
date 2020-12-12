document.addEventListener('DOMContentLoaded', () => {
    const fileUploadControl = document.getElementById('file-upload');

    renderImagesContainerData();

    fileUploadControl.addEventListener('change', (e) => {
        const file = fileUploadControl.files[0];

        getBase64(file).then(
            data => postData('http://localhost:3000/images', { file: data })
                .then(() => {
                    markProgressAsComplete();

                    setTimeout(() => renderImagesContainerData(), 4000);
                })
        );
    });
});

function markProgressAsComplete() {
    const progressIndicator = document.getElementById('progress-indicator');
    progressIndicator.style.transition = 'width 4s';

    progressIndicator.style.width = `100%`;
}

function resetProgress() {
    const progressIndicator = document.getElementById('progress-indicator');
    progressIndicator.style.transition = 'none';

    progressIndicator.style.width = `0`;
}

async function renderImagesContainerData() {
    const imagesContainer = document.getElementById('images');

    const res = await fetch('http://localhost:3000/images');
    const images = await res.json();
    imagesContainer.innerHTML = '';

    for (let i = 0; i < images.length; i++) {
        const img = document.createElement('img');
        img.src = images[i].file;
        img.className = 'gallery-img';

        imagesContainer.appendChild(img);
    }

    resetProgress();
}

async function postData(url = '', data = {}) {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    return await response.json();
}

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}