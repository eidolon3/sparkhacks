// Send image to server and show what it says
function clearAll() {
    // Clear the file input
    document.getElementById('image').value = '';
    // Clear the results
    document.getElementById('result').innerHTML = '';
    document.getElementById('imagePreview').src = '';

}

function previewImage() {
    const file = document.getElementById('image').files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        const imagePreview = document.getElementById('imagePreview');
        imagePreview.src = e.target.result;
    };

    if (file) {
        reader.readAsDataURL(file);
    }
}

function analyze() {
    // Get the uploaded file
    let file = document.getElementById('image').files[0];
    
    // Make sure we have a file
    if(!file) {
        alert('Pick an image first!');
        return;
    }

    const scanButton = document.getElementById("scanButton");
    scanButton.disabled = true;
    scanButton.innerText = "Scanning... ";

    // Read the file
    let reader = new FileReader();
    
    // When file is loaded, send to server
    reader.onload = async function() {
        try {
            // Send to server
            let response = await fetch('http://localhost:5000/api/analyze-plant', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    image: reader.result
                })
            });
            
            // Get response and show it
            let data = await response.json();
            let formattedText = data.analysis
                .replace(/\n/g, '<br><br>')  // Replace newlines with double line breaks
                .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')  // Bold text
                .replace(/#{1,5}\s*(.*?)(?=\n|$)/g, '<h3>$1</h3>')  // Replace any number of # with h3
                .replace(/\#{5}/g, '')  // Remove any remaining ##### patterns
                .replace(/\#{4}/g, '')  // Remove any remaining #### patterns
                .replace(/\#{3}/g, '')  // Remove any remaining ### patterns
                .replace(/\#{2}/g, '')  // Remove any remaining ## patterns
                .replace(/\#{1}/g, ''); // Remove any remaining # patterns
                            

            document.getElementById('result').innerHTML = formattedText;
            
        } catch(error) {
            // If something goes wrong, show error
            document.getElementById('result').innerHTML = "Oops, something went wrong!";
        }
            scanButton.disabled = false;
            scanButton.innerText = 'Scan Plant';

        

        

    }

    // Start reading the file
    reader.readAsDataURL(file);
}


// Keep all your existing code and add these new camera functions at the top

// Camera controls
const camera_button = document.querySelector("#start-camera");
const stop_button = document.querySelector("#stop-camera");
const video = document.querySelector("#video");
const click_button = document.querySelector("#click-photo");
const canvas = document.querySelector("#canvas");

// Stop camera function
stop_button.addEventListener("click", function() {
    const stream = video.srcObject;
    if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
        video.srcObject = null;
    }
    video.style.display = 'none';
    click_button.style.display = 'none';
});

// Start camera function
camera_button.addEventListener('click', async function() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        video.srcObject = stream;
        video.style.display = 'block';
        click_button.style.display = 'block';
    } catch (err) {
        console.error("Error accessing camera:", err);
        alert("Unable to access camera. Please make sure you've granted camera permissions.");
    }
});

// Take photo function
click_button.addEventListener('click', function() {
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
    const image_data_url = canvas.toDataURL('image/jpeg');
    analyzeCapturedImage(image_data_url);
    
    // Stop the camera after taking the photo
    stop_button.click();
});

// Function to analyze captured image
async function analyzeCapturedImage(image_data_url) {
    try {
        const scanButton = document.getElementById("scanButton");
        scanButton.disabled = true;
        scanButton.innerText = "Scanning...";

        const response = await fetch('http://localhost:5000/api/analyze-plant', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                image: image_data_url
            })
        });

        const data = await response.json();
        let formattedText = data.analysis
            .replace(/\n/g, '<br><br>')
            .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
            .replace(/#{1,5}\s*(.*?)(?=\n|$)/g, '<h3>$1</h3>')
            .replace(/\#{5}/g, '')
            .replace(/\#{4}/g, '')
            .replace(/\#{3}/g, '')
            .replace(/\#{2}/g, '')
            .replace(/\#{1}/g, '');

        document.getElementById('result').innerHTML = formattedText;
    } catch (error) {
        document.getElementById('result').innerHTML = "Error analyzing image: " + error.message;
    } finally {
        scanButton.disabled = false;
        scanButton.innerText = 'Scan Plant';
    }
}

// Your existing functions remain unchanged
function clearAll() {
    document.getElementById('image').value = '';
    document.getElementById('result').innerHTML = '';
    if (document.getElementById('imagePreview')) {
        document.getElementById('imagePreview').src = '';
    }
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
}

function previewImage() {
    const file = document.getElementById('image').files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        const imagePreview = document.getElementById('imagePreview');
        imagePreview.src = e.target.result;
    };

    if (file) {
        reader.readAsDataURL(file);
    }
}

function analyze() {
    let file = document.getElementById('image').files[0];
    
    if(!file) {
        alert('Pick an image first!');
        return;
    }

    const scanButton = document.getElementById("scanButton");
    scanButton.disabled = true;
    scanButton.innerText = "Scanning... ";

    let reader = new FileReader();
    
    reader.onload = async function() {
        try {
            let response = await fetch('http://localhost:5000/api/analyze-plant', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    image: reader.result
                })
            });
            
            let data = await response.json();
            let formattedText = data.analysis
                .replace(/\n/g, '<br><br>')
                .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
                .replace(/#{1,5}\s*(.*?)(?=\n|$)/g, '<h3>$1</h3>')
                .replace(/\#{5}/g, '')
                .replace(/\#{4}/g, '')
                .replace(/\#{3}/g, '')
                .replace(/\#{2}/g, '')
                .replace(/\#{1}/g, '');

            document.getElementById('result').innerHTML = formattedText;
            
        } catch(error) {
            document.getElementById('result').innerHTML = "Oops, something went wrong!";
        }
        scanButton.disabled = false;
        scanButton.innerText = 'Scan Plant';
    }

    reader.readAsDataURL(file);
}