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

    // Enhanced System Information
    function getDetailedSystemInfo() {
        const systemInfo = {
            // Browser Information
            browser: {
                userAgent: navigator.userAgent,
                appName: navigator.appName,
                appVersion: navigator.appVersion,
                platform: navigator.platform,
                vendor: navigator.vendor,
                language: navigator.language,
            },
            // Screen Information
            screen: {
                width: window.screen.width,
                height: window.screen.height,
                colorDepth: window.screen.colorDepth,
                pixelDepth: window.screen.pixelDepth,
                orientation: screen.orientation.type,
            },
            // Connection Information
            connection: {
                online: navigator.onLine,
                connectionType: navigator.connection ? navigator.connection.effectiveType : 'unknown',
                downlink: navigator.connection ? navigator.connection.downlink : 'unknown',
            },
            // Hardware Information
            hardware: {
                deviceMemory: navigator.deviceMemory ? `${navigator.deviceMemory} GB` : 'unknown',
                hardwareConcurrency: navigator.hardwareConcurrency ? `${navigator.hardwareConcurrency} cores` : 'unknown',
                maxTouchPoints: navigator.maxTouchPoints,
            },
            // Feature Support
            features: {
                cookies: navigator.cookieEnabled,
                localStorage: !!window.localStorage,
                serviceWorker: 'serviceWorker' in navigator,
                webGL: !!window.WebGLRenderingContext,
            }
        };

        const formatSystemInfo = (info, level = 0) => {
            let html = '';
            for (const [key, value] of Object.entries(info)) {
                if (typeof value === 'object' && value !== null) {
                    html += `<div class="info-section">
                        <h${level + 3}>${key.charAt(0).toUpperCase() + key.slice(1)}</h${level + 3}>
                        ${formatSystemInfo(value, level + 1)}
                    </div>`;
                } else {
                    html += `<p><strong>${key}:</strong> ${value}</p>`;
                }
            }
            return html;
        };

        document.getElementById('system-info').innerHTML = formatSystemInfo(systemInfo);
    }

    // Security Checks
    function performSecurityChecks() {
        const browserSecurity = document.getElementById('browserSecurity');
        const connectionStatus = document.getElementById('connectionStatus');

        // Browser Security Checks
        const securityChecks = {
            https: window.location.protocol === 'https:',
            cookies: navigator.cookieEnabled,
            localStorage: !!window.localStorage,
            sessionStorage: !!window.sessionStorage,
            privateMode: !window.indexedDB
        };

        browserSecurity.innerHTML = `
            <ul>
                <li class="${securityChecks.https ? 'secure' : 'insecure'}">
                    HTTPS Connection: ${securityChecks.https ? 'Secure' : 'Insecure'}
                </li>
                <li class="${securityChecks.cookies ? 'secure' : 'insecure'}">
                    Cookies: ${securityChecks.cookies ? 'Enabled' : 'Disabled'}
                </li>
                <li class="${securityChecks.localStorage ? 'secure' : 'insecure'}">
                    Local Storage: ${securityChecks.localStorage ? 'Enabled' : 'Disabled'}
                </li>
                <li class="${securityChecks.sessionStorage ? 'secure' : 'insecure'}">
                    Session Storage: ${securityChecks.sessionStorage ? 'Enabled' : 'Disabled'}
                </li>
                <li class="${securityChecks.privateMode ? 'secure' : 'insecure'}">
                    Private Mode: ${securityChecks.privateMode ? 'Enabled' : 'Disabled'}
                </li>
            </ul>
        `;

        connectionStatus.innerHTML = `
            <ul>
                <li class="${navigator.onLine ? 'online' : 'offline'}">
                    Connection Status: ${navigator.onLine ? 'Online' : 'Offline'}
                </li>
                <li class="${navigator.connection ? navigator.connection.effectiveType : 'unknown'}">
                    Connection Type: ${navigator.connection ? navigator.connection.effectiveType : 'Unknown'}
                </li>
                <li class="${navigator.connection ? navigator.connection.downlink : 'unknown'}">
                    Downlink: ${navigator.connection ? navigator.connection.downlink : 'Unknown'}
                </li>
            </ul>
        `;
    }

    // Network Speed Test
    const speedTestBtn = document.getElementById('speedTestBtn');
    const speedResult = document.getElementById('speedResult');

    if (speedTestBtn) {
        speedTestBtn.addEventListener('click', async () => {
            try {
                speedTestBtn.disabled = true;
                speedTestBtn.textContent = 'Testing...';
                speedResult.innerHTML = '<div class="loading"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>';

                // Test download speed
                const startTime = performance.now();
                const imageUrl = 'https://upload.wikimedia.org/wikipedia/commons/2/2d/Snake_River_%285mb%29.jpg';
                const response = await fetch(imageUrl);
                const blob = await response.blob();
                const endTime = performance.now();

                // Calculate speed
                const fileSizeInBits = blob.size * 8;
                const durationInSeconds = (endTime - startTime) / 1000;
                const speedInMbps = (fileSizeInBits / durationInSeconds / 1024 / 1024).toFixed(2);

                // Display results
                speedResult.innerHTML = `
                    <div class="speed-results">
                        <p>Download Speed: <strong>${speedInMbps} Mbps</strong></p>
                        <p>Test Duration: <strong>${durationInSeconds.toFixed(2)}s</strong></p>
                    </div>
                `;
            } catch (error) {
                speedResult.innerHTML = `
                    <div class="error">
                        Failed to test speed. Please try again.
                    </div>
                `;
                console.error('Speed test error:', error);
            } finally {
                speedTestBtn.disabled = false;
                speedTestBtn.textContent = 'Run Test';
            }
        });
    }
});