function initNetworkTools() {
    console.log('Initializing network tools...');
    
    initDNSLookup();
    initPingTest();
    initSystemInfo();
    initNetworkInfo();
}

function initDNSLookup() {
    const dnsBtn = document.getElementById('dnsLookupBtn');
    const dnsInput = document.getElementById('dnsInput');
    const dnsResult = document.getElementById('dnsResult');

    console.log('DNS Button:', dnsBtn);

    if (!dnsBtn || !dnsInput || !dnsResult) {
        console.error('DNS elements not found');
        return;
    }

    dnsBtn.onclick = async function() {
        try {
            console.log('DNS lookup clicked');
            dnsBtn.disabled = true;
            dnsResult.innerHTML = '<div class="loading">Loading...</div>';
            
            const domain = dnsInput.value.trim();
            if (!domain) {
                throw new Error('Please enter a domain name');
            }

            const data = await fetchToolsAPI(`/dns-lookup?domain=${encodeURIComponent(domain)}`);
            console.log('DNS lookup result:', data);
            
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

function initFeatureTabs() {
    const featureBtns = document.querySelectorAll('.feature-btn');
    const featureContents = document.querySelectorAll('.feature-content');

    featureBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            console.log('Feature button clicked:', btn.dataset.feature);
            
            // Remove active class from all buttons
            featureBtns.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            btn.classList.add('active');
            
            // Hide all feature contents
            featureContents.forEach(content => content.classList.add('hidden'));
            
            // Show selected feature content
            const selectedFeature = document.getElementById(`${btn.dataset.feature}-section`);
            if (selectedFeature) {
                selectedFeature.classList.remove('hidden');
            }
        });
    });
}

async function initTools() {
    console.log('Checking backend connections...');
    const backendsAvailable = await checkBackendConnections();
    updateBackendStatus(backendsAvailable);

    if (backendsAvailable) {
        console.log('Backends available, initializing tools...');
        initFeatureTabs();
        initNetworkTools();
    }
}

document.addEventListener('DOMContentLoaded', initTools);