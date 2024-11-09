document.getElementById('askButton').addEventListener('click', async (event) => {
    const button = event.currentTarget;
    button.disabled = true;  // Disable button while processing
    
    const question = document.getElementById('question').value;
    const responseElement = document.getElementById('response');
    responseElement.innerHTML = 'Thinking...';

    try {
        const response = await fetch('https://askitbackend-production.up.railway.app/ask', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Origin': 'https://sjackson4430.github.io'
            },
            credentials: 'include',
            body: JSON.stringify({ question })
        });
        
        // Handle rate limiting
        if (response.status === 429) {
            const data = await response.json();
            throw new Error(`Rate limit exceeded. Please try again later. ${data.retryAfter ? 
                `Retry after ${Math.ceil(data.retryAfter)} seconds.` : 
                'Please wait a while before trying again.'}`);
        }

        // Handle other errors
        if (!response.ok) {
            throw new Error(`Request failed with status: ${response.status}`);
        }

        const data = await response.json();
        
        // Check if data has an error property
        if (data.error) {
            throw new Error(data.error);
        }

        responseElement.innerHTML = data.answer;
    } catch (error) {
        console.error('Error:', error);
        responseElement.innerHTML = `<span style="color: red;">
            ${error.message.includes('Rate limit exceeded') ? 
                error.message : 
                'Sorry, there was an error getting your response. Please try again.'}
        </span>`;
    } finally {
        button.disabled = false;
    }
});
