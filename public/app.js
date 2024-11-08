document.getElementById('askButton').addEventListener('click', async () => {
    const question = document.getElementById('question').value;
    const responseElement = document.getElementById('response');
    responseElement.innerHTML = 'Thinking...';

    try {
        const response = await fetch('/ask', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ question })
        });
        const data = await response.json();
        responseElement.innerHTML = data.answer;
    } catch (error) {
        responseElement.innerHTML = 'Error: Could not get a response.';
    }
});