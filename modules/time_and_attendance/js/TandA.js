// Time and Attendance Dashboard JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // KPI Tab Switching Functionality
    const kpiTabs = document.querySelectorAll('.kpi-tab');
    const kpiContents = document.querySelectorAll('.kpi-content');
    
    kpiTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            kpiTabs.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Hide all content
            kpiContents.forEach(content => content.classList.remove('active'));
            
            // Show content for selected tab
            const tabId = this.getAttribute('data-tab');
            document.getElementById(`${tabId}-tab`).classList.add('active');
        });
    });

    // Show/hide custom date range for KPI period selector
    const kpiPeriod = document.getElementById('kpi-period');
    const customDateRange = document.getElementById('custom-date-range-kpi');
    
    if (kpiPeriod && customDateRange) {
        kpiPeriod.addEventListener('change', function() {
            if (this.value === 'custom') {
                customDateRange.classList.remove('hidden');
            } else {
                customDateRange.classList.add('hidden');
            }
        });
    }
});

// Function for real-time updates connection
function connectToRealTimeUpdates(accountNumber) {
    console.log('Connecting to real-time updates for account:', accountNumber);
    // This would typically use WebSockets or Server-Sent Events
    // For now, we'll simulate with a periodic update
    setInterval(function() {
        updateDashboardStats();
        updateRecentActivity();
    }, 30000); // Update every 30 seconds
}

// Device management functions
function pingDevice(deviceId) {
    console.log('Pinging device:', deviceId);
    // Implementation would send a request to ping the device
    showResponse('info', `Pinging device ${deviceId}...`);
}

function configureDevice(deviceId) {
    console.log('Configure device:', deviceId);
    // This would open a device configuration modal
    showResponse('info', `Opening configuration for device ${deviceId}`);
}
