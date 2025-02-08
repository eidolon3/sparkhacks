// Send image to server and show what it says
function clearAll() {
    // Clear the file input
    document.getElementById('image').value = '';
    // Clear the results
    document.getElementById('result').innerHTML = '';
}

function analyze() {
    // Get the uploaded file
    let file = document.getElementById('image').files[0];
    
    // Make sure we have a file
    if(!file) {
        alert('Pick an image first!');
        return;
    }

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
                .replace(/###(.*)/g, '<h3>$1</h3>')
                .replace(/# (.*)/g, '<h2>$1</h2>');  // Headers
                

            document.getElementById('result').innerHTML = formattedText;
            
        } catch(error) {
            // If something goes wrong, show error
            document.getElementById('result').innerHTML = "Oops, something went wrong!";
        }
    }

    // Start reading the file
    reader.readAsDataURL(file);
}