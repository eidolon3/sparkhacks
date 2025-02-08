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
                .replace(/### (.*)/g, '<h3>$1</h3>')
                .replace(/## (.*)/g, '<h3>$1</h3>')

                .replace(/# (.*)/g, '<h2>$1</h2>');  // Headers
                

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