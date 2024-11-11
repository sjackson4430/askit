// Add these constants at the top of your file
const TOOLS_BACKEND = 'https://network-tools-backend.onrender.com';
const AI_BACKEND = 'https://askitbackend-production.up.railway.app/';

// Add these fetch helper functions
async function fetchToolsAPI(endpoint) {
    try {
        const response = await fetch(`${TOOLS_BACKEND}${endpoint}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Tools API Error:', error);
        throw new Error('Failed to fetch from tools API');
    }
}

async function fetchAIAPI(endpoint) {
    try {
        const response = await fetch(`${AI_BACKEND}${endpoint}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('AI API Error:', error);
        throw new Error('Failed to fetch from AI API');
    }
}

// Add IP address loading function
async function loadIPAddress() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        const ipElement = document.getElementById('ip-address');
        if (ipElement) {
            ipElement.textContent = `IP: ${data.ip}`;
        }
    } catch (error) {
        console.error('Error loading IP:', error);
        const ipElement = document.getElementById('ip-address');
        if (ipElement) {
            ipElement.textContent = 'IP: Not available';
        }
    }
}

// Update the initNetworkTools function
function initNetworkTools() {
    console.log('Initializing network tools...');
    
    // DNS Lookup
    const dnsBtn = document.getElementById('dnsLookupBtn');
    const dnsInput = document.getElementById('dnsInput');
    if (dnsBtn && dnsInput) {
        dnsBtn.addEventListener('click', async () => {
            try {
                const domain = dnsInput.value.trim();
                if (!domain) throw new Error('Please enter a domain');
                
                displayLoading('dnsResult');
                dnsBtn.disabled = true;
                
                const result = await fetchToolsAPI(`/dns-lookup?domain=${encodeURIComponent(domain)}`);
                displayResult('dnsResult', result);
            } catch (error) {
                displayError('dnsResult', error.message);
            } finally {
                dnsBtn.disabled = false;
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
                if (!host) throw new Error('Please enter a hostname or IP');
                
                displayLoading('pingResult');
                pingBtn.disabled = true;
                
                const result = await fetchToolsAPI(`/ping?host=${encodeURIComponent(host)}`);
                displayResult('pingResult', result);
            } catch (error) {
                displayError('pingResult', error.message);
            } finally {
                pingBtn.disabled = false;
            }
        });
    }

    // Add similar loading states for other tools...
}

// Update the initTools function
async function initTools() {
    try {
        console.log('Initializing tools...');
        
        // Load IP address
        loadIPAddress();
        
        // Initialize feature tabs
        initFeatureTabs();
        
        // Initialize network tools
        initNetworkTools();
        
        // Update user info if authenticated
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            const userEmail = document.getElementById('userEmail');
            const userAvatar = document.getElementById('userAvatar');
            const userInfo = document.querySelector('.user-info');
            
            if (userEmail) userEmail.textContent = user.email;
            if (userAvatar && user.picture) userAvatar.src = user.picture;
            if (userInfo) userInfo.style.display = 'flex';
        }
    } catch (error) {
        console.error('Error initializing tools:', error);
    }
}

// Add these helper functions for better UI feedback
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
        element.innerHTML = `
            <div class="result-container">
                <pre>${JSON.stringify(data, null, 2)}</pre>
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

// Initialize everything when the DOM is loaded
document.addEventListener('DOMContentLoaded', initTools);