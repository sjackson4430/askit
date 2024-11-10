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
    console.log('DOM Content Loaded'); // Debug log

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

    console.log('Speed Test Button:', speedTestBtn); // Debug log

    if (speedTestBtn) {
        console.log('Adding click listener to speed test button'); // Debug log
        
        speedTestBtn.addEventListener('click', async () => {
            console.log('Speed test button clicked'); // Debug log
            
            try {
                speedTestBtn.disabled = true;
                speedTestBtn.textContent = 'Testing...';
                speedResult.innerHTML = `
                    <div class="loading">
                        <div class="dot"></div>
                        <div class="dot"></div>
                        <div class="dot"></div>
                    </div>`;

                console.log('Starting speed test'); // Debug log

                // Test download speed
                const startTime = performance.now();
                const imageUrl = 'https://upload.wikimedia.org/wikipedia/commons/2/2d/Snake_River_%285mb%29.jpg';
                
                console.log('Fetching test file...'); // Debug log
                const response = await fetch(imageUrl);
                const blob = await response.blob();
                const endTime = performance.now();

                // Calculate speed
                const fileSizeInBits = blob.size * 8;
                const durationInSeconds = (endTime - startTime) / 1000;
                const speedInMbps = (fileSizeInBits / durationInSeconds / 1024 / 1024).toFixed(2);

                console.log('Speed test completed:', speedInMbps, 'Mbps'); // Debug log

                // Display results
                speedResult.innerHTML = `
                    <div class="speed-results">
                        <p>Download Speed: <strong>${speedInMbps} Mbps</strong></p>
                        <p>Test Duration: <strong>${durationInSeconds.toFixed(2)}s</strong></p>
                    </div>
                `;
            } catch (error) {
                console.error('Speed test error:', error); // Debug log
                speedResult.innerHTML = `
                    <div class="error">
                        Failed to test speed. Please try again.
                    </div>
                `;
            } finally {
                speedTestBtn.disabled = false;
                speedTestBtn.textContent = 'Run Test';
            }
        });
    } else {
        console.error('Speed test button not found!'); // Debug log
    }

    // Initialize speed test
    initSpeedTest();
});

function initSpeedTest() {
    const speedTestBtn = document.getElementById('speedTestBtn');
    const speedResult = document.getElementById('speedResult');

    if (!speedTestBtn || !speedResult) return;

    speedTestBtn.onclick = async function() {
        speedTestBtn.disabled = true;
        speedTestBtn.textContent = 'Testing...';
        
        try {
            // Initialize test UI
            speedResult.innerHTML = `
                <div class="speed-gauge">
                    <div class="gauge-value">0</div>
                    <div class="gauge-label">Mbps</div>
                    <div class="gauge-meter">
                        <div class="meter-fill"></div>
                    </div>
                </div>
                <div class="test-progress">
                    <div class="progress-bar">
                        <div class="progress-fill"></div>
                    </div>
                    <div class="progress-label">Preparing test...</div>
                </div>
            `;

            const gaugeValue = speedResult.querySelector('.gauge-value');
            const meterFill = speedResult.querySelector('.meter-fill');
            const progressFill = speedResult.querySelector('.progress-fill');
            const progressLabel = speedResult.querySelector('.progress-label');

            // Larger test files with weighted importance
            const testSizes = [
                { size: 'small', weight: 1, bytes: 1024 * 1024 },      // 1MB
                { size: 'medium', weight: 2, bytes: 5 * 1024 * 1024 }, // 5MB
                { size: 'large', weight: 3, bytes: 10 * 1024 * 1024 }, // 10MB
                { size: 'xlarge', weight: 4, bytes: 20 * 1024 * 1024 } // 20MB
            ];

            let totalSpeed = 0;
            let totalWeight = 0;
            let maxSpeed = 0;

            for (let i = 0; i < testSizes.length; i++) {
                const { size, weight, bytes } = testSizes[i];
                const progress = ((i / testSizes.length) * 100).toFixed(0);
                progressFill.style.width = `${progress}%`;
                progressLabel.textContent = `Testing ${size} file... (${progress}%)`;

                // Perform multiple samples for each size
                const samples = 3;
                let sizeSpeed = 0;

                for (let j = 0; j < samples; j++) {
                    const startTime = performance.now();
                    const response = await fetch(`/speed-test-file/${size}?t=${Date.now()}`, {
                        cache: 'no-store'
                    });
                    const blob = await response.blob();
                    const endTime = performance.now();

                    const fileSizeInBits = blob.size * 8;
                    const durationInSeconds = (endTime - startTime) / 1000;
                    const speedMbps = (fileSizeInBits / durationInSeconds / 1024 / 1024);
                    
                    sizeSpeed += speedMbps;
                    maxSpeed = Math.max(maxSpeed, speedMbps);
                }

                const avgSpeedForSize = (sizeSpeed / samples) * weight;
                totalSpeed += avgSpeedForSize;
                totalWeight += weight;

                const currentAvg = (totalSpeed / totalWeight).toFixed(2);
                gaugeValue.textContent = currentAvg;
                meterFill.style.width = `${Math.min((currentAvg / maxSpeed) * 100, 100)}%`;
            }

            const finalSpeed = (totalSpeed / totalWeight).toFixed(2);
            
            // Final results display
            speedResult.innerHTML = `
                <div class="speed-results">
                    <div class="speed-gauge final">
                        <div class="gauge-value">${finalSpeed}</div>
                        <div class="gauge-label">Mbps</div>
                        <div class="gauge-meter">
                            <div class="meter-fill" style="width: ${Math.min((finalSpeed / maxSpeed) * 100, 100)}%"></div>
                        </div>
                    </div>
                    <div class="speed-details">
                        <p>Average Download Speed: <strong>${finalSpeed} Mbps</strong></p>
                        <p>Peak Speed: <strong>${maxSpeed.toFixed(2)} Mbps</strong></p>
                        <p>Tests Completed: <strong>${testSizes.length * 3}</strong></p>
                        <p>Quality: <strong>${getSpeedQuality(finalSpeed)}</strong></p>
                    </div>
                </div>
            `;
        } catch (error) {
            console.error('Speed test error:', error);
            speedResult.innerHTML = `
                <div class="error">
                    Failed to complete speed test. Please try again.
                    <br>Error: ${error.message}
                </div>
            `;
        } finally {
            speedTestBtn.disabled = false;
            speedTestBtn.textContent = 'Run Test';
        }
    };
}

function getSpeedQuality(speed) {
    if (speed >= 100) return 'Excellent';
    if (speed >= 50) return 'Very Good';
    if (speed >= 25) return 'Good';
    if (speed >= 10) return 'Fair';
    return 'Poor';
}