// Constants for API endpoints - update these to match your actual backend URLs
const TOOLS_BACKEND = 'https://network-tools-backend.onrender.com';
const AI_BACKEND = 'https://askitbackend-production.up.railway.app';

// Helper function to check if backends are available
async function checkBackendConnections() {
    try {
        const toolsResponse = await fetch(`${TOOLS_BACKEND}/health`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Origin': window.location.origin
            }
        });
        
        const aiResponse = await fetch(`${AI_BACKEND}/health`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Origin': window.location.origin
            }
        });

        if (!toolsResponse.ok || !aiResponse.ok) {
            return false;
        }

        return true;
    } catch (error) {
        console.error('Backend check failed:', error);
        return false;
    }
}

// Initialize all features
function initFeatures() {
    const featureBtns = document.querySelectorAll('.feature-btn');
    featureBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const feature = btn.dataset.feature;
            
            // Update active button
            featureBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Show selected content
            document.querySelectorAll('.feature-content').forEach(content => {
                content.classList.add('hidden');
            });
            document.getElementById(`${feature}-section`).classList.remove('hidden');
        });
    });
}

// Initialize network tools
function initNetworkTools() {
    // DNS Lookup
    const dnsBtn = document.getElementById('dnsLookupBtn');
    const dnsInput = document.getElementById('dnsInput');
    
    if (dnsBtn && dnsInput) {
        dnsBtn.addEventListener('click', async () => {
            try {
                const domain = dnsInput.value.trim();
                if (!domain) {
                    throw new Error('Please enter a domain');
                }
                
                displayLoading('dnsResult');
                const response = await fetch(`${TOOLS_BACKEND}/tools/dns`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Origin': window.location.origin
                    },
                    body: JSON.stringify({ domain })
                });
                
                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(errorText || `Server returned ${response.status}`);
                }
                
                const data = await response.json();
                displayResult('dnsResult', data);
            } catch (error) {
                console.error('DNS Lookup error:', error);
                displayError('dnsResult', error.message);
            }
        });
    }

    // Ping Test
    const pingBtn = document.getElementById('pingTestBtn');
    const pingInput = document.getElementById('pingInput');
    
    if (pingBtn && pingInput) {
        pingBtn.addEventListener('click', async () => {
            try {
                const host = pingInput.value.trim();
                if (!host) {
                    throw new Error('Please enter a hostname or IP');
                }
                
                displayLoading('pingResult');
                const response = await fetch(`${TOOLS_BACKEND}/tools/ping`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Origin': window.location.origin
                    },
                    body: JSON.stringify({ host })
                });
                
                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(errorText || `Server returned ${response.status}`);
                }
                
                const data = await response.json();
                displayResult('pingResult', data);
            } catch (error) {
                console.error('Ping error:', error);
                displayError('pingResult', error.message);
            }
        });
    }

    // System Info
    const sysInfoBtn = document.getElementById('sysInfoBtn');
    if (sysInfoBtn) {
        sysInfoBtn.addEventListener('click', async () => {
            try {
                displayLoading('sysInfoResult');
                const response = await fetch(`${TOOLS_BACKEND}/system-info`);
                const data = await response.json();
                
                if (!response.ok) {
                    throw new Error(data.message || 'Failed to get system info');
                }
                
                displayResult('sysInfoResult', data);
            } catch (error) {
                displayError('sysInfoResult', error.message);
            }
        });
    }

    // Network Info
    const netInfoBtn = document.getElementById('netInfoBtn');
    if (netInfoBtn) {
        netInfoBtn.addEventListener('click', async () => {
            try {
                displayLoading('netInfoResult');
                const response = await fetch(`${TOOLS_BACKEND}/network-info`);
                const data = await response.json();
                
                if (!response.ok) {
                    throw new Error(data.message || 'Failed to get network info');
                }
                
                displayResult('netInfoResult', data);
            } catch (error) {
                displayError('netInfoResult', error.message);
            }
        });
    }
}

// Initialize AI Chat
function initAIChat() {
    const askButton = document.getElementById('askButton');
    const questionInput = document.getElementById('question');
    
    if (askButton && questionInput) {
        askButton.addEventListener('click', async () => {
            try {
                const question = questionInput.value.trim();
                if (!question) {
                    throw new Error('Please enter a question');
                }
                
                displayLoading('response');
                const response = await fetch(`${AI_BACKEND}/chat`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ question })
                });
                
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.message || 'Failed to get AI response');
                }
                
                displayResult('response', data);
            } catch (error) {
                displayError('response', error.message);
            }
        });
    }
}

// Helper functions for UI
function displayLoading(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = `
            <div class="loading-container">
                <div class="loading-indicator"></div>
                <p>Loading...</p>
            </div>
        `;
    }
}

function displayResult(elementId, data) {
    const element = document.getElementById(elementId);
    if (element) {
        let formattedContent = '';
        
        if (typeof data === 'object') {
            // Format object data
            Object.entries(data).forEach(([key, value]) => {
                formattedContent += `<div class="result-item">
                    <strong>${key}:</strong> 
                    <span>${Array.isArray(value) ? value.join(', ') : value}</span>
                </div>`;
            });
        } else {
            // Handle simple string/number results
            formattedContent = `<div class="result-item">${data}</div>`;
        }
        
        element.innerHTML = `
            <div class="result-container">
                ${formattedContent}
            </div>
        `;
    }
}

function displayError(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = `
            <div class="error-container">
                <p class="error-message">${message}</p>
            </div>
        `;
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Load IP address
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();
        document.getElementById('ip-address').textContent = `IP: ${ipData.ip}`;
        
        // Initialize all features
        initFeatures();
        initNetworkTools();
        initAIChat();
        
        // Check backend status
        const backendsAvailable = await checkBackendConnections();
        if (!backendsAvailable) {
            document.getElementById('backend-status').innerHTML = `
                <div class="error-container">
                    <p class="error-message">Some services are currently unavailable</p>
                </div>
            `;
        }
    } catch (error) {
        console.error('Initialization error:', error);
    }
});