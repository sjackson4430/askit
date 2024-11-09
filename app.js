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
            // Remove credentials and Origin header as they might be causing CORS issues
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

document.addEventListener('DOMContentLoaded', () => {
    // 1. IP Address Display
    fetch('https://api.ipify.org?format=json')
        .then(response => response.json())
        .then(data => {
            document.getElementById('ip-address').textContent = `Your IP: ${data.ip}`;
        })
        .catch(error => console.error('Error fetching IP:', error));

    // 2. Feature Tabs
    const featureButtons = document.querySelectorAll('.feature-btn');
    featureButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            featureButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Hide all feature content
            document.querySelectorAll('.feature-content').forEach(content => {
                content.classList.add('hidden');
            });

            // Show selected feature content
            const featureId = `${button.dataset.feature}-section`;
            document.getElementById(featureId).classList.remove('hidden');
        });
    });

    // 3. System Information
    const systemInfo = {
        browser: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        cookiesEnabled: navigator.cookieEnabled,
        screenResolution: `${window.screen.width}x${window.screen.height}`
    };

    const systemInfoHtml = Object.entries(systemInfo)
        .map(([key, value]) => `<p><strong>${key}:</strong> ${value}</p>`)
        .join('');
    document.getElementById('system-info').innerHTML = systemInfoHtml;

    // 4. Quick Tips Carousel
    const tips = [
        "Regularly update your operating system",
        "Use antivirus software",
        "Back up your data frequently",
        "Clean your computer's vents",
        "Use strong, unique passwords"
    ];

    const tipsCarousel = document.getElementById('tips-carousel');
    let currentTip = 0;

    function showNextTip() {
        tipsCarousel.innerHTML = `<p class="tip">${tips[currentTip]}</p>`;
        currentTip = (currentTip + 1) % tips.length;
    }

    showNextTip();
    setInterval(showNextTip, 5000);

    // 5. Parallax Effect
    window.addEventListener('scroll', () => {
        const parallaxElements = document.querySelectorAll('.parallax');
        parallaxElements.forEach(element => {
            if (element.classList.contains('hero')) {
                const scrolled = window.pageYOffset;
                const rate = scrolled * 0.5;
                // Limit the transform to prevent overlap
                const maxTransform = element.offsetHeight * 0.3; // Adjust this value as needed
                const limitedRate = Math.min(rate, maxTransform);
                element.style.transform = `translateY(${limitedRate}px)`;
            } else {
                // Handle other parallax elements normally
                const scrolled = window.pageYOffset;
                const rate = scrolled * 0.5;
                element.style.transform = `translateY(${rate}px)`;
            }
        });
    });

    // 6. Animated Statistics
    let userCount = 0;
    const targetUsers = 1000;
    const userCounter = setInterval(() => {
        userCount += 5;
        document.getElementById('users-count').textContent = userCount;
        if (userCount >= targetUsers) clearInterval(userCounter);
    }, 20);

    document.getElementById('response-time').textContent = '0.8s';
});