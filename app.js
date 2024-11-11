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

// Initialize network tools with improved error handling and validation
function initNetworkTools() {
    // DNS Lookup
    const dnsBtn = document.getElementById('dnsLookupBtn');
    const dnsInput = document.getElementById('dnsInput');
    
    if (dnsBtn && dnsInput) {
        const handleDnsLookup = debounce(async () => {
            const domain = dnsInput.value.trim();
            if (!domain) {
                displayError('dnsResult', 'Please enter a domain');
                return;
            }
            
            if (!validateDomain(domain)) {
                displayError('dnsResult', 'Invalid domain format');
                return;
            }
            
            dnsBtn.disabled = true;
            try {
                displayLoading('dnsResult');
                const response = await fetchWithTimeout(
                    `${TOOLS_BACKEND}/tools/dns`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                            'Origin': window.location.origin
                        },
                        body: JSON.stringify({ domain })
                    }
                );
                
                if (!response.ok) {
                    throw new Error(await response.text() || `Server returned ${response.status}`);
                }
                
                const data = await response.json();
                const formattedResult = formatDNSResults(data);
                displayResult('dnsResult', formattedResult);
            } catch (error) {
                console.error('DNS Lookup error:', error);
                displayError('dnsResult', error.message);
            } finally {
                dnsBtn.disabled = false;
            }
        }, 300);
        
        dnsBtn.addEventListener('click', handleDnsLookup);
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
                <span>Loading...</span>
            </div>
        `;
    }
}

function displayResult(elementId, content) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = `
            <div class="result-container">
                ${content}
            </div>
        `;
    }
}

function displayError(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = `
            <div class="error-container">
                <div class="error-message">
                    <i class="fas fa-exclamation-circle"></i>
                    <span>${message}</span>
                </div>
            </div>
        `;
    }
}

// Helper function to format DNS results
function formatDNSResults(data) {
    return `
        <div class="dns-results">
            <div class="info-group">
                <h4>IP Addresses</h4>
                ${data.ipAddresses?.map(ip => `<p>${ip}</p>`).join('') || '<p>No IP addresses found</p>'}
            </div>
            
            ${data.mailServers?.length ? `
                <div class="info-group">
                    <h4>Mail Servers</h4>
                    ${data.mailServers.map(mx => `
                        <p>Priority: ${mx.priority} - ${mx.exchange}</p>
                    `).join('')}
                </div>
            ` : ''}
            
            ${data.nameServers?.length ? `
                <div class="info-group">
                    <h4>Name Servers</h4>
                    ${data.nameServers.map(ns => `<p>${ns}</p>`).join('')}
                </div>
            ` : ''}
            
            ${data.txtRecords?.length ? `
                <div class="info-group">
                    <h4>TXT Records</h4>
                    ${data.txtRecords.map(txt => `<p>${txt}</p>`).join('')}
                </div>
            ` : ''}
        </div>
    `;
}

// Add utility functions
function validateDomain(domain) {
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
    return domainRegex.test(domain);
}

async function fetchWithTimeout(url, options, timeout = 5000) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    
    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal
        });
        clearTimeout(id);
        return response;
    } catch (error) {
        clearTimeout(id);
        throw error;
    }
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
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