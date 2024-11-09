document.getElementById('askButton').addEventListener('click', async () => {
    const question = document.getElementById('question').value;
    const responseElement = document.getElementById('response');
    responseElement.innerHTML = 'Thinking...';

    try {
        const response = await fetch('https://askitbackend-production.up.railway.app/ask', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Origin': 'https://sjackson4430.github.io',
                'Access-Control-Allow-Credentials': 'true'
            },
            credentials: 'include',
            body: JSON.stringify({ question })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        responseElement.innerHTML = data.answer;
    } catch (error) {
        console.error('Error:', error); // This will help with debugging
        responseElement.innerHTML = 'Error: Could not get a response. ' + error.message;
    }
});
