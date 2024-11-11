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
    if (!element) return;
    
    element.innerHTML = `
        <div class="error-container">
            <p class="error-message">${message}</p>
        </div>
    `;
}

// Add these styles for better result display