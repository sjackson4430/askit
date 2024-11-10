const API_BASE_URL = 'https://askitbackend-production.up.railway.app'; // Your Railway app URL

async function fetchAPI(endpoint, options = {}) {
    const defaultOptions = {
        mode: 'cors',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Origin': 'https://sjackson4430.github.io'
        }
    };

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...defaultOptions,
            ...options,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`API call failed: ${error.message}`);
        throw error;
    }
}

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

    // DNS Lookup Tool
    initDNSLookup();

    // Ping Test
    initPingTest();

    // System Information Tool
    initSystemInfo();

    // Network Information Tool
    initNetworkInfo();
});

function initSpeedTest() {
    const speedTestBtn = document.getElementById('speedTestBtn');
    const speedResult = document.getElementById('speedResult');

    if (!speedTestBtn || !speedResult) return;

    speedTestBtn.onclick = async function() {
        speedTestBtn.disabled = true;
        speedTestBtn.textContent = 'Testing...';
        
        try {
            // Initialize UI
            speedResult.innerHTML = `
                <div class="speed-gauge">
                    <div class="gauge-value">0</div>
                    <div class="gauge-label">Mbps</div>
                    <div class="gauge-meter"><div class="meter-fill"></div></div>
                </div>
                <div class="test-progress">
                    <div class="progress-bar"><div class="progress-fill"></div></div>
                    <div class="progress-label">Preparing test...</div>
                </div>
            `;

            const elements = {
                gauge: speedResult.querySelector('.gauge-value'),
                meter: speedResult.querySelector('.meter-fill'),
                progress: speedResult.querySelector('.progress-fill'),
                label: speedResult.querySelector('.progress-label')
            };

            // Much larger test files
            const testSizes = [
                { size: 'medium', weight: 1, bytes: 25 * 1024 * 1024 },  // 25MB
                { size: 'large', weight: 2, bytes: 50 * 1024 * 1024 },   // 50MB
                { size: 'xlarge', weight: 3, bytes: 100 * 1024 * 1024 }  // 100MB
            ];

            let totalSpeed = 0;
            let totalWeight = 0;
            let maxSpeed = 0;

            for (let i = 0; i < testSizes.length; i++) {
                const { size, weight } = testSizes[i];
                elements.progress.style.width = `${((i + 1) / testSizes.length * 100)}%`;
                elements.label.textContent = `Testing ${size} file... (${((i + 1) / testSizes.length * 100).toFixed(0)}%)`;

                // Multiple samples per size
                const samples = 3;
                let sizeSpeed = 0;

                for (let j = 0; j < samples; j++) {
                    const startTime = performance.now();
                    const response = await fetch(`/speed-test-file/${size}?t=${Date.now()}`, {
                        cache: 'no-store'
                    });
                    const blob = await response.blob();
                    const endTime = performance.now();

                    const speedMbps = (blob.size * 8) / ((endTime - startTime) / 1000) / 1024 / 1024;
                    sizeSpeed += speedMbps;
                    maxSpeed = Math.max(maxSpeed, speedMbps);

                    // Update gauge during test
                    elements.gauge.textContent = speedMbps.toFixed(2);
                    elements.meter.style.width = `${Math.min((speedMbps / 1000) * 100, 100)}%`;
                }

                const avgSpeedForSize = (sizeSpeed / samples) * weight;
                totalSpeed += avgSpeedForSize;
                totalWeight += weight;
            }

            const finalSpeed = (totalSpeed / totalWeight).toFixed(2);
            
            // Final results
            speedResult.innerHTML = `
                <div class="speed-results">
                    <div class="speed-gauge final">
                        <div class="gauge-value">${finalSpeed}</div>
                        <div class="gauge-label">Mbps</div>
                        <div class="gauge-meter">
                            <div class="meter-fill" style="width: ${Math.min((finalSpeed / 1000) * 100, 100)}%"></div>
                        </div>
                    </div>
                    <div class="speed-details">
                        <p>Download Speed: <strong>${finalSpeed} Mbps</strong></p>
                        <p>Peak Speed: <strong>${maxSpeed.toFixed(2)} Mbps</strong></p>
                        <p>Quality: <strong>${getSpeedQuality(finalSpeed)}</strong></p>
                    </div>
                </div>
            `;
        } catch (error) {
            console.error('Speed test error:', error);
            speedResult.innerHTML = `
                <div class="error">Failed to complete speed test: ${error.message}</div>
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

function initDNSLookup() {
    const dnsBtn = document.getElementById('dnsLookupBtn');
    const dnsInput = document.getElementById('dnsInput');
    const dnsResult = document.getElementById('dnsResult');

    if (!dnsBtn || !dnsInput || !dnsResult) return;

    dnsBtn.onclick = async function() {
        try {
            dnsBtn.disabled = true;
            dnsResult.innerHTML = '<div class="loading"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>';
            
            const domain = dnsInput.value.trim();
            if (!domain) {
                throw new Error('Please enter a domain name');
            }

            const data = await fetchAPI(`/dns-lookup?domain=${encodeURIComponent(domain)}`);
            
            if (data.error) {
                throw new Error(data.error);
            }

            dnsResult.innerHTML = `
                <div class="dns-results">
                    <div class="info-group">
                        <h4>IP Address</h4>
                        <p>${data.ip || 'Not found'}</p>
                    </div>
                    ${Object.entries(data.records || {}).map(([type, records]) => `
                        <div class="info-group">
                            <h4>${type} Records</h4>
                            ${records.map(record => `<p>${record}</p>`).join('')}
                        </div>
                    `).join('')}
                </div>
            `;
        } catch (error) {
            console.error('DNS lookup error:', error);
            dnsResult.innerHTML = `<div class="error">${error.message}</div>`;
        } finally {
            dnsBtn.disabled = false;
        }
    };
}

function initPingTest() {
    const pingBtn = document.getElementById('pingTestBtn');
    const pingResult = document.getElementById('pingResult');

    if (!pingBtn || !pingResult) return;

    pingBtn.onclick = async function() {
        try {
            pingBtn.disabled = true;
            pingResult.innerHTML = '<div class="loading">Testing ping...</div>';
            
            const hosts = ['google.com', 'cloudflare.com', 'amazon.com'];
            let results = [];

            for (const host of hosts) {
                const startTime = performance.now();
                try {
                    const response = await fetch(`${API_BASE_URL}/ping?host=${encodeURIComponent(host)}`);
                    const data = await response.json();
                    const endTime = performance.now();
                    
                    results.push({
                        host,
                        time: Math.round(endTime - startTime),
                        status: data.success ? 'success' : 'failed',
                        details: data
                    });
                } catch (error) {
                    results.push({
                        host,
                        status: 'failed',
                        error: error.message
                    });
                }
            }

            pingResult.innerHTML = `
                <div class="ping-results">
                    ${results.map(result => `
                        <div class="ping-item ${result.status}">
                            <div class="ping-host">${result.host}</div>
                            ${result.time ? 
                                `<div class="ping-time">${result.time}ms</div>` : 
                                `<div class="ping-error">${result.error || 'Failed'}</div>`
                            }
                        </div>
                    `).join('')}
                </div>
            `;
        } catch (error) {
            pingResult.innerHTML = `<div class="error">${error.message}</div>`;
        } finally {
            pingBtn.disabled = false;
        }
    };
}

function initSystemInfo() {
    const sysInfoBtn = document.getElementById('sysInfoBtn');
    const sysInfoResult = document.getElementById('sysInfoResult');

    if (!sysInfoBtn || !sysInfoResult) return;

    sysInfoBtn.onclick = async function() {
        try {
            sysInfoBtn.disabled = true;
            sysInfoResult.innerHTML = '<div class="loading">Gathering system information...</div>';

            const response = await fetch(`${API_BASE_URL}/system-info`);
            const data = await response.json();

            sysInfoResult.innerHTML = `
                <div class="system-info">
                    <div class="info-group">
                        <h4>Browser Information</h4>
                        <p>Name: ${navigator.userAgent.split(') ')[0].split(' (')[0]}</p>
                        <p>Platform: ${navigator.platform}</p>
                        <p>Language: ${navigator.language}</p>
                        <p>Cookies Enabled: ${navigator.cookieEnabled ? 'Yes' : 'No'}</p>
                    </div>
                    <div class="info-group">
                        <h4>Screen Information</h4>
                        <p>Resolution: ${window.screen.width}x${window.screen.height}</p>
                        <p>Color Depth: ${window.screen.colorDepth}-bit</p>
                        <p>Pixel Ratio: ${window.devicePixelRatio}</p>
                    </div>
                    <div class="info-group">
                        <h4>System Resources</h4>
                        <p>Memory: ${data.memory}</p>
                        <p>CPU Cores: ${data.cpuCores}</p>
                        <p>OS Type: ${data.osType}</p>
                        <p>Platform: ${data.platform}</p>
                    </div>
                </div>
            `;
        } catch (error) {
            sysInfoResult.innerHTML = `<div class="error">${error.message}</div>`;
        } finally {
            sysInfoBtn.disabled = false;
        }
    };
}

function initNetworkInfo() {
    const netInfoBtn = document.getElementById('netInfoBtn');
    const netInfoResult = document.getElementById('netInfoResult');

    if (!netInfoBtn || !netInfoResult) return;

    netInfoBtn.onclick = async function() {
        try {
            netInfoBtn.disabled = true;
            netInfoResult.innerHTML = '<div class="loading">Checking network...</div>';

            const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
            const response = await fetch(`${API_BASE_URL}/network-info`);
            const data = await response.json();

            netInfoResult.innerHTML = `
                <div class="network-info">
                    <div class="info-group">
                        <h4>Connection Type</h4>
                        <p>Type: ${connection ? connection.effectiveType : 'Unknown'}</p>
                        <p>Downlink: ${connection ? connection.downlink + ' Mbps' : 'Unknown'}</p>
                        <p>RTT: ${connection ? connection.rtt + ' ms' : 'Unknown'}</p>
                    </div>
                    <div class="info-group">
                        <h4>Network Details</h4>
                        <p>Public IP: ${data.publicIp}</p>
                        <p>ISP: ${data.isp}</p>
                        <p>Location: ${data.location}</p>
                    </div>
                    <div class="info-group">
                        <h4>Connection Status</h4>
                        <p>Status: ${navigator.onLine ? 'Online' : 'Offline'}</p>
                        <p>Protocol: ${window.location.protocol}</p>
                        <p>Latency: ${data.latency}ms</p>
                    </div>
                </div>
            `;
        } catch (error) {
            netInfoResult.innerHTML = `<div class="error">${error.message}</div>`;
        } finally {
            netInfoBtn.disabled = false;
        }
    };
}

async function checkBackendConnection() {
    try {
        const response = await fetchAPI('/health');
        console.log('Health check response:', response);
        return response.status === 'healthy';
    } catch (error) {
        console.error('Backend connection check failed:', error);
        return false;
    }
}

function updateBackendStatus(isAvailable) {
    const statusEl = document.getElementById('backend-status');
    if (!statusEl) return;

    if (!isAvailable) {
        statusEl.classList.add('error');
        statusEl.textContent = 'Backend services unavailable';
        console.error('Backend connection failed');
    } else {
        statusEl.classList.remove('error');
        statusEl.textContent = '';
        console.log('Backend connection successful');
    }
}

async function initTools() {
    console.log('Checking backend connection...');
    const backendAvailable = await checkBackendConnection();
    updateBackendStatus(backendAvailable);

    if (!backendAvailable) {
        console.error('Backend server is not available');
        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.disabled = true;
            btn.title = 'Service temporarily unavailable';
        });
        return;
    }

    console.log('Backend available, initializing tools...');
    initSpeedTest();
    initDNSLookup();
    initPingTest();
    initSystemInfo();
    initNetworkInfo();
}

document.addEventListener('DOMContentLoaded', initTools);