// Constants for API endpoints - update these to match your actual backend URLs
const TOOLS_BACKEND = 'https://network-tools-backend.onrender.com/api/tools';
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

// Initialize network tools with improved error handling
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
                const data = await fetchToolsAPI(`/dns-lookup?domain=${encodeURIComponent(domain)}`);
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
        const handlePing = debounce(async () => {
            const host = pingInput.value.trim();
            if (!host) {
                displayError('pingResult', 'Please enter a hostname or IP');
                return;
            }
            
            pingBtn.disabled = true;
            try {
                displayLoading('pingResult');
                const data = await fetchToolsAPI(`/ping?host=${encodeURIComponent(host)}`);
                displayResult('pingResult', formatPingResults(data));
            } catch (error) {
                console.error('Ping error:', error);
                displayError('pingResult', error.message);
            } finally {
                pingBtn.disabled = false;
            }
        }, 300);
        
        pingBtn.addEventListener('click', handlePing);
    }

    // System Info
    const sysInfoBtn = document.getElementById('sysInfoBtn');
    if (sysInfoBtn) {
        const handleSysInfo = debounce(async () => {
            try {
                displayLoading('sysInfoResult');
                const data = await fetchToolsAPI('/system-info');
                displayResult('sysInfoResult', formatSystemInfo(data));
            } catch (error) {
                displayError('sysInfoResult', error.message);
            }
        }, 300);
        
        sysInfoBtn.addEventListener('click', handleSysInfo);
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

// Helper function to format ping results
function formatPingResults(data) {
    return `
        <div class="ping-results">
            <div class="info-group">
                <h4>Ping Results</h4>
                <p>Host: ${data.host}</p>
                <p>Time: ${data.time}ms</p>
                <p>Status: ${data.alive ? 'Alive' : 'No Response'}</p>
            </div>
        </div>
    `;
}

// Helper function to format system info
function formatSystemInfo(data) {
    return `
        <div class="system-info">
            <div class="info-group">
                <h4>System Information</h4>
                <p>OS: ${data.os}</p>
                <p>Platform: ${data.platform}</p>
                <p>Memory: ${data.memory}</p>
                <p>CPU: ${data.cpu}</p>
            </div>
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

// API Utility function
async function fetchToolsAPI(endpoint, options = {}) {
    const timeout = 10000; // 10 seconds timeout
    
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);
        
        const response = await fetch(`${TOOLS_BACKEND}${endpoint}`, {
            ...options,
            signal: controller.signal,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Origin': window.location.origin,
                ...options.headers
            },
            mode: 'cors'
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API call failed:', error);
        throw error;
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Load IP address
        const ipData = await fetchToolsAPI('/ip');
        document.getElementById('ip-address').textContent = `IP: ${ipData.ip}`;
        
        // Initialize all features
        initFeatures();
        initNetworkTools();
        initAIChat();
        
        // Check backend status
        const healthCheck = await fetchToolsAPI('/health').catch(() => ({ status: 'error' }));
        const statusElement = document.getElementById('backend-status');
        if (statusElement) {
            statusElement.textContent = healthCheck.status === 'ok' ? 
                'Backend services connected' : 
                'Backend services unavailable';
            statusElement.className = healthCheck.status === 'ok' ? 'success' : 'error';
        }
    } catch (error) {
        console.error('Initialization error:', error);
        displayError('backend-status', 'Failed to initialize services');
    }
});