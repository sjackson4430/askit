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
                
                const result = await fetchToolsAPI(`/dns-lookup?domain=${encodeURIComponent(domain)}`);
                displayResult('dnsResult', result);
            } catch (error) {
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
                if (!host) throw new Error('Please enter a hostname or IP');
                
                const result = await fetchToolsAPI(`/ping?host=${encodeURIComponent(host)}`);
                displayResult('pingResult', result);
            } catch (error) {
                displayError('pingResult', error.message);
            }
        });
    }

    // System Info
    const sysInfoBtn = document.getElementById('sysInfoBtn');
    if (sysInfoBtn) {
        sysInfoBtn.addEventListener('click', async () => {
            try {
                const result = await fetchToolsAPI('/system-info');
                displayResult('sysInfoResult', result);
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
                const result = await fetchToolsAPI('/network-info');
                displayResult('netInfoResult', result);
            } catch (error) {
                displayError('netInfoResult', error.message);
            }
        });
    }
}

// Helper functions for displaying results
function displayResult(elementId, data) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    element.innerHTML = `
        <div class="result-container">
            <pre>${JSON.stringify(data, null, 2)}</pre>
        </div>
    `;
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

// Add this function to initialize feature tabs
function initFeatureTabs() {
    const featureBtns = document.querySelectorAll('.feature-btn');
    const featureContents = document.querySelectorAll('.feature-content');
    
    console.log('Initializing feature tabs...'); // Debug log
    
    featureBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const feature = btn.dataset.feature;
            console.log('Feature clicked:', feature); // Debug log
            
            // Remove active class from all buttons and add to clicked button
            featureBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Hide all content sections and show the selected one
            featureContents.forEach(content => content.classList.add('hidden'));
            const selectedContent = document.getElementById(`${feature}-section`);
            if (selectedContent) {
                selectedContent.classList.remove('hidden');
            }
        });
    });
}

// Update your initTools function
async function initTools() {
    try {
        console.log('Initializing tools...'); // Debug log
        
        // Initialize feature tabs first
        initFeatureTabs();
        
        // Check backend connections
        const backendsAvailable = await checkBackendConnections();
        updateBackendStatus(backendsAvailable);

        if (backendsAvailable) {
            console.log('Backends available, initializing network tools...'); // Debug log
            initNetworkTools();
        } else {
            console.error('Backend connection failed');
            document.querySelectorAll('.tool-btn').forEach(btn => {
                btn.disabled = true;
                btn.title = 'Service temporarily unavailable';
            });
        }
    } catch (error) {
        console.error('Error initializing tools:', error);
    }
}

// Make sure this is at the bottom of your file
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing...'); // Debug log
    initTools();
});