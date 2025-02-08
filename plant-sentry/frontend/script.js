function analyze() {
    const file = document.getElementById('image').files[0];
    if (!file) {
        alert('Please select an image first');
        return;
    }

    const reader = new FileReader();
    reader.onload = async function() {
        try {
            const response = await fetch('http://localhost:5000/api/analyze-plant', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({image: reader.result})
            });
            
            const data = await response.json();
            document.getElementById('result').innerHTML = data.analysis
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')  // Bold text
                .replace(/###/g, '<br><br>');  // Add spacing between sections
        } catch (error) {
            document.getElementById('result').textContent = 'Error: ' + error.message;
        }
    }
    reader.readAsDataURL(file);
}