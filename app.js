// Define separate backend URLs
const AI_BACKEND = 'https://askitbackend-production.up.railway.app';  // Node.js server
const TOOLS_BACKEND = 'https://network-tools-backend-production.up.railway.app';  // Python server

// Separate fetch functions for each backend
async function fetchAIAPI(endpoint, options = {}) {
    const defaultOptions = {
        mode: 'cors',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
    };

    try {
        const response = await fetch(`${AI_BACKEND}${endpoint}`, {
            ...defaultOptions,
            ...options,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`AI API call failed: ${error.message}`);
        throw error;
    }
}

async function fetchToolsAPI(endpoint, options = {}) {
    const defaultOptions = {
        mode: 'cors',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
    };

    try {
        const response = await fetch(`${TOOLS_BACKEND}${endpoint}`, {
            ...defaultOptions,
            ...options,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Tools API call failed: ${error.message}`);
        throw error;
    }
}

// AI/Chat functionality uses AI_BACKEND
async function sendMessage(message) {
    try {
        const response = await fetchAIAPI('/ask', {
            method: 'POST',
            body: JSON.stringify({ question: message })
        });

        if (response.error) {
            throw new Error(response.error);
        }

        return response;
    } catch (error) {
        console.error('Chat error:', error);
        throw error;
    }
}

// Network tools use TOOLS_BACKEND
async function pingHost(hostname) {
    try {
        const data = await fetchToolsAPI(`/ping?host=${encodeURIComponent(hostname)}`);
        return data;
    } catch (error) {
        console.error('Ping error:', error);
        throw error;
    }
}

// Check both backends' health
async function checkBackendConnections() {
    try {
        // Check AI backend
        console.log('Checking AI backend...');
        const aiHealth = await fetchAIAPI('/health');
        console.log('AI Backend health:', aiHealth);
        
        // Check Tools backend
        console.log('Checking Tools backend...');
        const toolsHealth = await fetchToolsAPI('/health');
        console.log('Tools Backend health:', toolsHealth);

        // Return true if both backends are healthy
        return aiHealth.status === 'healthy' && toolsHealth.status === 'healthy';
    } catch (error) {
        console.error('Backend connection check failed:', error);
        return false;
    }
}

// Update the ask button event listener
document.getElementById('askButton').addEventListener('click', async (event) => {
    const button = event.currentTarget;
    button.disabled = true;

    const question = document.getElementById('question').value;
    const responseElement = document.getElementById('response');
    responseElement.innerHTML = 'Thinking...';

    try {
        const response = await sendMessage(question);
        responseElement.innerHTML = response.answer;
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

// Network Tools Initialization
function initNetworkTools() {
    initDNSLookup();
    initPingTest();
    initSystemInfo();
    initNetworkInfo();
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

            const data = await fetchToolsAPI(`/dns-lookup?domain=${encodeURIComponent(domain)}`);
            
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
            dnsResult.innerHTML = `<div class="error">${error.message}</div>`;
        } finally {
            dnsBtn.disabled = false;
        }
    };
}

function initPingTest() {
    const pingBtn = document.getElementById('pingTestBtn');
    const pingInput = document.getElementById('pingInput');
    const pingResult = document.getElementById('pingResult');

    if (!pingBtn || !pingInput || !pingResult) return;

    pingBtn.onclick = async function() {
        try {
            pingBtn.disabled = true;
            pingResult.innerHTML = '<div class="loading"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>';
            
            const hostname = pingInput.value.trim();
            if (!hostname) {
                throw new Error('Please enter a hostname or IP');
            }

            const result = await pingHost(hostname);
            
            if (result.success) {
                pingResult.innerHTML = `
                    <div class="ping-results">
                        <div class="info-group">
                            <h4>Results for ${hostname}</h4>
                            <p>Status: <span class="success">Success</span></p>
                            <p>Average Response Time: ${result.average_time}ms</p>
                            <div class="ping-details">
                                <pre class="ping-output">${result.output}</pre>
                            </div>
                        </div>
                    </div>
                `;
            } else {
                throw new Error(result.error || 'Ping failed');
            }
        } catch (error) {
            pingResult.innerHTML = `
                <div class="error">
                    <p>Error: ${error.message}</p>
                </div>
            `;
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

            const data = await fetchToolsAPI('/system-info');

            sysInfoResult.innerHTML = `
                <div class="system-info">
                    <div class="info-group">
                        <h4>Browser Information</h4>
                        <p>Name: ${navigator.userAgent.split(') ')[0].split(' (')[0]}</p>
                        <p>Platform: ${navigator.userAgentData?.platform || navigator.platform}</p>
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
            const data = await fetchToolsAPI('/network-info');

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

function updateBackendStatus(isAvailable) {
    const statusEl = document.getElementById('backend-status');
    if (!statusEl) return;

    if (!isAvailable) {
        statusEl.classList.add('error');
        statusEl.textContent = 'Backend services unavailable';
        console.error('Backend connection failed');
    } else {
        statusEl.classList.remove('error');
        statusEl.textContent = 'Backend services connected';
        console.log('Backend connection successful');
    }
}

async function initTools() {
    console.log('Checking backend connections...');
    const backendsAvailable = await checkBackendConnections();
    updateBackendStatus(backendsAvailable);

    if (!backendsAvailable) {
        console.error('One or more backend servers are not available');
        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.disabled = true;
            btn.title = 'Service temporarily unavailable';
        });
        return;
    }

    console.log('Backends available, initializing tools...');
    initNetworkTools();
}

// Add styles
const styles = `
    #backend-status {
        padding: 0.5rem;
        margin: 1rem 0;
        text-align: center;
        border-radius: 4px;
    }

    #backend-status.error {
        background: rgba(255, 0, 0, 0.1);
        color: #ff0000;
        border: 1px solid #ff0000;
    }
`;

// Add styles to document
const styleSheet = document.createElement("style");
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

// Initialize when the page loads
document.addEventListener('DOMContentLoaded', initTools);