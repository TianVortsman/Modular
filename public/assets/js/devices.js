// Devices Page JavaScript

// Global variables
let devices = [];
let currentDevice = null;
let cameraRefreshInterval = null;
let cameraRefreshRate = 1000; // 1 second
let currentDeviceId = null;
let currentDeviceIp = null;

// DOM Elements
const devicesGrid = document.getElementById('devicesGrid');
const noDevicesMessage = document.getElementById('noDevicesMessage');
const refreshDevicesBtn = document.getElementById('refreshDevicesBtn');
const addDeviceBtn = document.getElementById('addDeviceBtn');
const addFirstDeviceBtn = document.getElementById('addFirstDeviceBtn');

// Init on page load
document.addEventListener('DOMContentLoaded', () => {
    // Fetch devices on page load
    loadDevices();
    
    // Set up event listeners
    refreshDevicesBtn.addEventListener('click', loadDevices);
    addDeviceBtn.addEventListener('click', openAddDeviceModal);
    addFirstDeviceBtn.addEventListener('click', openAddDeviceModal);
    
    // Door control event listeners
    document.getElementById('unlockBtn').addEventListener('click', () => controlDoor('open'));
    document.getElementById('lockBtn').addEventListener('click', () => controlDoor('close'));
    document.getElementById('holdBtn').addEventListener('click', () => controlDoor('keep_open'));
    document.getElementById('keepClosedBtn')?.addEventListener('click', () => controlDoor('keep_closed'));
    
    // Intercom event listeners
    document.getElementById('callBtn').addEventListener('click', startCall);
    document.getElementById('hangupBtn').addEventListener('click', endCall);
});

// Load devices from API
function loadDevices() {
    // Show loading, hide no devices message
    devicesGrid.innerHTML = `
        <div class="device-loading">
            <div class="spinner"></div>
            <p>Loading devices...</p>
        </div>
    `;
    noDevicesMessage.classList.add('hidden');
    
    // Fetch devices from API
    fetch('../api/get_devices.php')
        .then(response => response.json())
        .then(data => {
            if (data.success && data.devices && data.devices.length > 0) {
                devices = data.devices;
                renderDevices(devices);
            } else {
                showNoDevices();
            }
        })
        .catch(error => {
            console.error('Error loading devices:', error);
            showNoDevices(error.message);
        });
}

// Render devices to grid
function renderDevices(devicesList) {
    devicesGrid.innerHTML = '';
    
    devicesList.forEach(device => {
        const card = createDeviceCard(device);
        devicesGrid.appendChild(card);
    });
}

// Create a device card element
function createDeviceCard(device) {
    const card = document.createElement('div');
    card.className = `device-card ${device.status}`;
    card.setAttribute('data-device-id', device.device_id);
    
    // Format last online date for display
    let lastOnlineDisplay = 'Never';
    if (device.last_online) {
        const lastOnline = new Date(device.last_online);
        const now = new Date();
        const diffMs = now - lastOnline;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);
        
        if (diffMins < 1) {
            lastOnlineDisplay = 'Just now';
        } else if (diffMins < 60) {
            lastOnlineDisplay = `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
        } else if (diffHours < 24) {
            lastOnlineDisplay = `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
        } else if (diffDays < 30) {
            lastOnlineDisplay = `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
        } else {
            lastOnlineDisplay = lastOnline.toLocaleDateString();
        }
    }
    
    card.innerHTML = `
        <div class="device-header">
        <div class="device-icon">
                <i class="fas fa-fingerprint"></i>
            </div>
            <div class="device-title">
                <div class="device-name">${device.device_name}</div>
                <div class="device-id">ID: ${device.device_id}</div>
            </div>
        </div>
        <div class="device-body">
            <div class="device-info-item">
                <i class="fas fa-network-wired"></i>
                <span>IP: ${device.ip_address}</span>
            </div>
            ${device.mac_address ? `
            <div class="device-info-item">
                <i class="fas fa-ethernet"></i>
                <span>MAC: ${device.mac_address}</span>
        </div>
            ` : ''}
            <div class="device-status">
                <div class="status-indicator status-${device.status}"></div>
                ${device.status.charAt(0).toUpperCase() + device.status.slice(1)}
            </div>
        </div>
        <div class="device-footer">
            <div class="device-last-seen">Last seen: ${lastOnlineDisplay}</div>
            <div class="device-actions">
                <button class="device-action-btn" onclick="openDeviceControlModal(${JSON.stringify(device).replace(/"/g, '&quot;')})">
                    <i class="fas fa-cog"></i> Control
                </button>
            </div>
        </div>
    `;
    
    // Add double-click event listener to open device control modal
    card.addEventListener('dblclick', () => {
        openDeviceControlModal(device);
    });
    
    return card;
}

// Show "No devices" message
function showNoDevices(errorMessage = null) {
    devicesGrid.innerHTML = '';
    noDevicesMessage.classList.remove('hidden');
    
    if (errorMessage) {
        noDevicesMessage.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i>
            <h2>Error Loading Devices</h2>
            <p>${errorMessage}</p>
            <button class="btn btn-primary" onclick="loadDevices()">Retry</button>
        `;
    }
}

// Add device modal functions
function openAddDeviceModal() {
    document.getElementById('addDeviceModal').classList.remove('hidden');
}

function closeAddDeviceModal() {
    document.getElementById('addDeviceModal').classList.add('hidden');
    // Reset form fields
    document.getElementById('deviceId').value = '';
    document.getElementById('deviceName').value = '';
    document.getElementById('deviceIp').value = '';
    document.getElementById('deviceMac').value = '';
    document.getElementById('deviceUsername').value = 'admin';
    document.getElementById('devicePassword').value = '12345';
}

function saveDevice() {
    const deviceData = {
        device_id: document.getElementById('deviceId').value,
        device_name: document.getElementById('deviceName').value,
        ip_address: document.getElementById('deviceIp').value,
        mac_address: document.getElementById('deviceMac').value,
        username: document.getElementById('deviceUsername').value,
        password: document.getElementById('devicePassword').value
    };
    
    // Validate required fields
    if (!deviceData.device_id || !deviceData.device_name || !deviceData.ip_address) {
        showResponseModal('error', 'Device ID, Name and IP Address are required');
        return;
    }
    
    // Show loading modal
    showLoadingModal('Saving device...');
    
    // Send data to server
    fetch('../api/add_device.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(deviceData)
    })
    .then(response => response.json())
    .then(data => {
        hideLoadingModal();
        
        if (data.success) {
            showResponseModal('success', 'Device added successfully');
            closeAddDeviceModal();
            loadDevices(); // Refresh the devices list
        } else {
            showResponseModal('error', data.message || 'Failed to add device');
        }
    })
    .catch(error => {
        hideLoadingModal();
        showResponseModal('error', 'Error saving device: ' + error.message);
    });
}

// Device control modal functions
function openDeviceControlModal(device) {
    const modalTitle = document.getElementById('deviceControlModalTitle');
    
    // Set modal title and store device info for operations
    if (modalTitle) {
        modalTitle.innerHTML = device.name || 'Device Control';
    }
    currentDeviceId = device.id || device.device_id;
    currentDevice = device;
    currentDeviceIp = device.ip_address;
    
    // Populate device info tab
    const deviceInfoTab = document.getElementById('deviceInfo');
    if (deviceInfoTab) {
        const deviceIdField = deviceInfoTab.querySelector('#device-id');
        const deviceSerialField = deviceInfoTab.querySelector('#device-serial');
        const deviceNameField = deviceInfoTab.querySelector('#device-name');
        const deviceIpField = deviceInfoTab.querySelector('#device-ip');
        const deviceMacField = deviceInfoTab.querySelector('#device-mac');
        const deviceFirmwareField = deviceInfoTab.querySelector('#device-firmware');
        const deviceModelField = deviceInfoTab.querySelector('#device-model');
        const deviceStatusField = deviceInfoTab.querySelector('#device-status');
        const deviceLastOnlineField = deviceInfoTab.querySelector('#device-last-online');
        
        // Fill in device information
        if (deviceIdField) deviceIdField.textContent = device.id || device.device_id || 'N/A';
        if (deviceSerialField) deviceSerialField.textContent = device.serial_number || 'N/A';
        if (deviceNameField) deviceNameField.textContent = device.name || device.device_name || 'N/A';
        if (deviceIpField) deviceIpField.textContent = device.ip_address || 'N/A';
        if (deviceMacField) deviceMacField.textContent = device.mac_address || 'N/A';
        if (deviceFirmwareField) deviceFirmwareField.textContent = device.firmware_version || 'N/A';
        if (deviceModelField) deviceModelField.textContent = device.model || 'N/A';
        
        // Format status with appropriate indicator
        if (deviceStatusField) {
            const statusIndicator = document.createElement('span');
            statusIndicator.className = device.status === 'online' ? 'status-indicator status-online' : 'status-indicator status-offline';
            const statusText = document.createTextNode(device.status === 'online' ? ' Online' : ' Offline');
            deviceStatusField.innerHTML = '';
            deviceStatusField.appendChild(statusIndicator);
            deviceStatusField.appendChild(statusText);
        }
        
        // Format last online time
        if (deviceLastOnlineField && device.last_online) {
            try {
                const lastOnlineDate = new Date(device.last_online);
                const formattedDate = lastOnlineDate.toLocaleString();
                deviceLastOnlineField.textContent = formattedDate;
            } catch (error) {
                deviceLastOnlineField.textContent = device.last_online || 'N/A';
            }
        } else if (deviceLastOnlineField) {
            deviceLastOnlineField.textContent = 'N/A';
        }
    }
    
    // Set up intercom buttons based on device status
    const startCallButton = document.getElementById('startCallBtn');
    const endCallButton = document.getElementById('endCallBtn');
    
    if (startCallButton && endCallButton) {
        if (device.status === 'online') {
            startCallButton.disabled = false;
            endCallButton.disabled = true; // Initially disabled until call is started
        } else {
            startCallButton.disabled = true;
            endCallButton.disabled = true;
        }
    }
    
    // Load door activity if that tab exists
    const doorActivityTab = document.getElementById('doorActivityTab');
    if (doorActivityTab) {
        loadDoorActivity(device.id || device.device_id);
    }
    
    // Show device control modal and select first tab
    showModal('deviceControlModal');
    selectTab('cameraTab');
    
    // Start camera feed refresh for this device
    refreshCameraFeed(device.ip_address);
}

function closeDeviceModal() {
    document.getElementById('deviceControlModal').classList.add('hidden');
    stopCameraFeedRefresh();
}

// Control door (open/close)
function controlDoor(action) {
    if (!currentDevice) return;
    
    showLoadingModal('Sending door command...');
    
    fetch(`../api/control_door.php?device_id=${currentDeviceId}&action=${action}`, {
        method: 'POST'
    })
    .then(response => response.json())
    .then(data => {
        hideLoadingModal();
        showResponseModal(data.success ? 'success' : 'error', data.message);
    })
    .catch(error => {
        hideLoadingModal();
        showResponseModal('error', 'Failed to control door: ' + error.message);
    });
}

// Camera feed functions
function loadCameraFeed(device) {
    const cameraFeed = document.getElementById('cameraFeed');
    if (!cameraFeed) return;
    
    // Create camera loading and error elements if they don't exist
    let cameraLoading = document.getElementById('cameraLoading');
    let cameraError = document.getElementById('cameraError');
    
    if (!cameraLoading) {
        cameraLoading = document.createElement('div');
        cameraLoading.id = 'cameraLoading';
        cameraLoading.className = 'camera-loading';
        cameraLoading.innerHTML = '<div class="spinner"></div><p>Loading feed...</p>';
        cameraFeed.parentNode.appendChild(cameraLoading);
    }
    
    if (!cameraError) {
        cameraError = document.createElement('div');
        cameraError.id = 'cameraError';
        cameraError.className = 'camera-error';
        cameraError.innerHTML = '<i class="fas fa-exclamation-triangle"></i><p>Failed to load camera feed</p>';
        cameraFeed.parentNode.appendChild(cameraError);
    }
    
    // Show loading indicator
    cameraFeed.classList.add('hidden');
    cameraError.classList.add('hidden');
    cameraLoading.classList.remove('hidden');
    
    // Generate URL with timestamp to prevent caching
    const timestamp = new Date().getTime();
    const deviceId = device.id || device.device_id;
    const imageUrl = `../api/get_camera_snapshot.php?device_id=${deviceId}&t=${timestamp}`;
    
    // Create new image object
    const img = new Image();
    img.onload = function() {
        // Image loaded successfully
        cameraFeed.src = imageUrl;
        cameraFeed.classList.remove('hidden');
        cameraLoading.classList.add('hidden');
        cameraError.classList.add('hidden');
    };
    
    img.onerror = function() {
        // Failed to load image
        cameraLoading.classList.add('hidden');
        cameraError.classList.remove('hidden');
        cameraFeed.classList.add('hidden');
    };
    
    // Set image source to start loading
    img.src = imageUrl;
    
    // Set up refresh interval
    if (cameraRefreshInterval) {
        clearInterval(cameraRefreshInterval);
    }
    
    cameraRefreshInterval = setInterval(() => {
        refreshCameraFeed();
    }, 5000); // Refresh every 5 seconds
}

function refreshCameraFeed(ipAddress) {
    if (!currentDevice && !ipAddress) return;
    
    if (ipAddress && !currentDevice) {
        // Create a temporary device object with the IP
        currentDevice = { ip_address: ipAddress, device_id: ipAddress };
    }
    
    loadCameraFeed(currentDevice);
}

function stopCameraFeedRefresh() {
    if (cameraRefreshInterval) {
        clearInterval(cameraRefreshInterval);
        cameraRefreshInterval = null;
    }
}

// Tab navigation
function openDeviceTab(evt, tabName) {
    // Hide all tab content
    const tabContents = document.getElementsByClassName('modal-tab-content');
    for (let i = 0; i < tabContents.length; i++) {
        tabContents[i].classList.remove('active');
    }
    
    // Remove active class from tab buttons
    const tabButtons = document.getElementsByClassName('modal-tab-btn');
    for (let i = 0; i < tabButtons.length; i++) {
        tabButtons[i].classList.remove('active');
    }
    
    // Show selected tab and mark button as active
    document.getElementById(tabName).classList.add('active');
    evt.currentTarget.classList.add('active');
    
    // Handle special actions for tabs
    if (tabName === 'deviceLive' && currentDevice) {
        loadCameraFeed(currentDevice);
    } else {
        stopCameraFeedRefresh();
    }
}

// Send custom command to device
function sendCommand(command) {
    if (!currentDevice) return;
    
    showLoadingModal('Sending command...');
    
    fetch(`../api/send_command.php`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            device_id: currentDeviceId,
            command: command
        })
    })
    .then(response => response.json())
    .then(data => {
        hideLoadingModal();
        showResponseModal(data.success ? 'success' : 'error', data.message);
    })
    .catch(error => {
        hideLoadingModal();
        showResponseModal('error', 'Failed to send command: ' + error.message);
    });
}

// Intercom functions
function startCall() {
    if (!currentDevice) return;
    
    // Update UI
    document.getElementById('intercomStatus').textContent = 'Calling...';
    document.getElementById('callBtn').disabled = true;
    document.getElementById('hangupBtn').disabled = false;
    
    // Send call command to server
    fetch('../api/start_call.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            device_id: currentDeviceId
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            document.getElementById('intercomStatus').textContent = 'Connected';
            // Here you would initialize WebRTC or other audio streaming
        } else {
            document.getElementById('intercomStatus').textContent = 'Failed to connect';
            document.getElementById('callBtn').disabled = false;
            document.getElementById('hangupBtn').disabled = true;
            showResponseModal('error', data.message || 'Failed to start call');
        }
    })
    .catch(error => {
        document.getElementById('intercomStatus').textContent = 'Error';
        document.getElementById('callBtn').disabled = false;
        document.getElementById('hangupBtn').disabled = true;
        showResponseModal('error', `Error starting call: ${error.message}`);
    });
}

function endCall() {
    if (!currentDevice) return;
    
    // Update UI
    document.getElementById('intercomStatus').textContent = 'Disconnecting...';
    
    // Send end call command to server
    fetch('../api/end_call.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            device_id: currentDeviceId
        })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('intercomStatus').textContent = 'Ready';
        document.getElementById('callBtn').disabled = false;
        document.getElementById('hangupBtn').disabled = true;
        
        if (!data.success) {
            showResponseModal('warning', data.message || 'Warning: Call may not have ended properly');
        }
    })
    .catch(error => {
        document.getElementById('intercomStatus').textContent = 'Ready';
        document.getElementById('callBtn').disabled = false;
        document.getElementById('hangupBtn').disabled = true;
        showResponseModal('error', `Error ending call: ${error.message}`);
    });
}

// Device commands
function executeCommand(command) {
    if (!currentDevice) return;
    
    // Show loading modal
    showLoadingModal(`Executing command: ${command}...`);
    
    // Send command to server
    fetch('../api/execute_command.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            device_id: currentDeviceId,
            command: command
        })
    })
    .then(response => response.json())
    .then(data => {
        hideLoadingModal();
        
        if (data.success) {
            showResponseModal('success', data.message || `Command ${command} executed successfully`);
        } else {
            showResponseModal('error', data.message || `Failed to execute command ${command}`);
        }
    })
    .catch(error => {
        hideLoadingModal();
        showResponseModal('error', `Error executing command: ${error.message}`);
    });
}

// Edit device functions
function editCurrentDevice() {
    if (!currentDevice) return;
    
    // Populate edit form
    document.getElementById('editDeviceId').value = currentDevice.id;
    document.getElementById('editDeviceDeviceId').value = currentDevice.device_id;
    document.getElementById('editDeviceName').value = currentDevice.device_name;
    document.getElementById('editDeviceIp').value = currentDevice.ip_address;
    document.getElementById('editDeviceMac').value = currentDevice.mac_address || '';
    document.getElementById('editDeviceUsername').value = currentDevice.username || 'admin';
    document.getElementById('editDevicePassword').value = '';
    
    // Show edit modal
    document.getElementById('editDeviceModal').classList.remove('hidden');
}

function closeEditDeviceModal() {
    document.getElementById('editDeviceModal').classList.add('hidden');
}

function updateDevice() {
    const deviceData = {
        id: document.getElementById('editDeviceId').value,
        device_id: document.getElementById('editDeviceDeviceId').value,
        device_name: document.getElementById('editDeviceName').value,
        ip_address: document.getElementById('editDeviceIp').value,
        mac_address: document.getElementById('editDeviceMac').value,
        username: document.getElementById('editDeviceUsername').value
    };
    
    // Only include password if it was changed
    const password = document.getElementById('editDevicePassword').value;
    if (password) {
        deviceData.password = password;
    }
    
    // Validate required fields
    if (!deviceData.device_name || !deviceData.ip_address) {
        showResponseModal('error', 'Device Name and IP Address are required');
        return;
    }
    
    // Show loading modal
    showLoadingModal('Updating device...');
    
    // Send data to server
    fetch('../api/update_device.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(deviceData)
    })
    .then(response => response.json())
    .then(data => {
        hideLoadingModal();
        
        if (data.success) {
            showResponseModal('success', 'Device updated successfully');
            closeEditDeviceModal();
            closeDeviceModal();
            loadDevices(); // Refresh the devices list
        } else {
            showResponseModal('error', data.message || 'Failed to update device');
        }
    })
    .catch(error => {
        hideLoadingModal();
        showResponseModal('error', 'Error updating device: ' + error.message);
    });
}

function deleteCurrentDevice() {
    if (!currentDevice) return;
    
    if (confirm(`Are you sure you want to delete this device? This action cannot be undone.`)) {
        // Show loading modal
        showLoadingModal('Deleting device...');
        
        // Send delete request to server
        fetch(`../api/delete_device.php?id=${currentDevice.id}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            hideLoadingModal();
            
            if (data.success) {
                showResponseModal('success', 'Device deleted successfully');
                closeDeviceModal();
                loadDevices(); // Refresh the devices list
            } else {
                showResponseModal('error', data.message || 'Failed to delete device');
            }
        })
        .catch(error => {
            hideLoadingModal();
            showResponseModal('error', 'Error deleting device: ' + error.message);
        });
    }
}

// Load door activity
function loadDoorActivity(deviceId) {
    const activityContainer = document.getElementById('doorActivityList');
    if (!activityContainer) return;
    
    activityContainer.innerHTML = '<div class="loading-spinner"></div>';
    
    // Fetch door activity for this device
    fetch(`../api/get_door_activity.php?device_id=${deviceId}`)
        .then(response => response.json())
        .then(data => {
            activityContainer.innerHTML = '';
            
            if (data.error) {
                activityContainer.innerHTML = `<div class="error-message">${data.error}</div>`;
                return;
            }
            
            if (data.length === 0) {
                activityContainer.innerHTML = '<div class="no-activity">No door activity recorded</div>';
                return;
            }
            
            // Render each activity item
            data.forEach(activity => {
                const activityItem = document.createElement('div');
                activityItem.className = 'activity-item';
                
                const formattedTime = new Date(activity.timestamp).toLocaleString();
                
                activityItem.innerHTML = `
                    <div class="activity-time">${formattedTime}</div>
                    <div class="activity-action">${activity.action}</div>
                    <div class="activity-user">${activity.user || 'System'}</div>
                `;
                
                activityContainer.appendChild(activityItem);
            });
        })
        .catch(error => {
            console.error('Error fetching door activity:', error);
            activityContainer.innerHTML = '<div class="error-message">Failed to load activity</div>';
        });
}

// Function to show a modal
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
        // Add a small delay before adding the visible class for animation effect
        setTimeout(() => {
            modal.classList.add('visible');
        }, 10);
    }
}

// Function to hide a modal
function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('visible');
        // Wait for animation to finish before hiding
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }
}

// Function to select a tab
function selectTab(tabId) {
    // Get all tab content elements and buttons
    const tabContents = document.querySelectorAll('.modal-tab-content');
    const tabButtons = document.querySelectorAll('.modal-tab-btn');
    
    // Hide all tab contents and deactivate all buttons
    tabContents.forEach(tab => {
        tab.classList.remove('active');
    });
    
    tabButtons.forEach(button => {
        button.classList.remove('active');
    });
    
    // Show the selected tab and activate its button
    const selectedTab = document.getElementById(tabId);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
    
    // Find the button that corresponds to this tab
    const buttonSelector = `.modal-tab-btn[onclick*="${tabId}"]`;
    const selectedButton = document.querySelector(buttonSelector);
    if (selectedButton) {
        selectedButton.classList.add('active');
    }
    
    // If the camera tab is selected, refresh the camera feed
    if (tabId === 'cameraTab' && currentDevice) {
        refreshCameraFeed(currentDevice.ip_address);
    }
}

// Function to start intercom call
function startIntercomCall() {
    if (!currentDevice || !currentDevice.ip_address) {
        const statusElement = document.getElementById('intercomStatus');
        if (statusElement) {
            statusElement.innerHTML = '<span class="error-message">No device selected</span>';
        }
        return;
    }
    
    const startCallBtn = document.getElementById('startCallBtn');
    const endCallBtn = document.getElementById('endCallBtn');
    const statusElement = document.getElementById('intercomStatus');
    
    if (startCallBtn) startCallBtn.disabled = true;
    if (statusElement) statusElement.innerHTML = '<div class="loading-spinner small"></div> Starting call...';
    
    const deviceId = currentDevice.id || currentDevice.device_id;
    
    fetch('../api/start_call.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ device_id: deviceId })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            if (statusElement) statusElement.innerHTML = '<span class="success-message">Call connected!</span>';
            if (startCallBtn) startCallBtn.disabled = true;
            if (endCallBtn) endCallBtn.disabled = false;
        } else {
            if (statusElement) statusElement.innerHTML = `<span class="error-message">Failed to start call: ${data.error || data.message || 'Unknown error'}</span>`;
            if (startCallBtn) startCallBtn.disabled = false;
        }
    })
    .catch(error => {
        console.error('Error starting call:', error);
        if (statusElement) statusElement.innerHTML = '<span class="error-message">Failed to start call</span>';
        if (startCallBtn) startCallBtn.disabled = false;
    });
}

// Function to end intercom call
function endIntercomCall() {
    if (!currentDevice || !currentDevice.ip_address) {
        const statusElement = document.getElementById('intercomStatus');
        if (statusElement) {
            statusElement.innerHTML = '<span class="error-message">No device selected</span>';
        }
        return;
    }
    
    const startCallBtn = document.getElementById('startCallBtn');
    const endCallBtn = document.getElementById('endCallBtn');
    const statusElement = document.getElementById('intercomStatus');
    
    if (endCallBtn) endCallBtn.disabled = true;
    if (statusElement) statusElement.innerHTML = '<div class="loading-spinner small"></div> Ending call...';
    
    const deviceId = currentDevice.id || currentDevice.device_id;
    
    fetch('../api/end_call.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ device_id: deviceId })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            if (statusElement) statusElement.innerHTML = '<span class="success-message">Call ended</span>';
            setTimeout(() => {
                if (statusElement) statusElement.innerHTML = 'Ready';
            }, 3000);
            if (startCallBtn) startCallBtn.disabled = false;
            if (endCallBtn) endCallBtn.disabled = true;
        } else {
            if (statusElement) statusElement.innerHTML = `<span class="error-message">Failed to end call: ${data.error || data.message || 'Unknown error'}</span>`;
            if (endCallBtn) endCallBtn.disabled = false;
        }
    })
    .catch(error => {
        console.error('Error ending call:', error);
        if (statusElement) statusElement.innerHTML = '<span class="error-message">Failed to end call</span>';
        if (endCallBtn) endCallBtn.disabled = false;
    });
}

// Function to open door
function openDoor() {
    if (!currentDeviceIp) {
        showStatusMessage('doorStatus', 'No device selected', 'error');
        return;
    }
    
    const openDoorBtn = document.getElementById('openDoorBtn');
    const statusElement = document.getElementById('doorStatus');
    
    if (openDoorBtn) openDoorBtn.disabled = true;
    if (statusElement) statusElement.innerHTML = '<div class="loading-spinner small"></div> Opening door...';
    
    fetch('api/open_door.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ device_id: currentDeviceIp })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            if (statusElement) statusElement.innerHTML = '<span class="success-message">Door opened successfully!</span>';
            // Refresh activity list if door opened successfully
            if (currentDeviceId) loadDoorActivity(currentDeviceId);
        } else {
            if (statusElement) statusElement.innerHTML = `<span class="error-message">Failed to open door: ${data.error || 'Unknown error'}</span>`;
        }
        
        if (openDoorBtn) {
            openDoorBtn.disabled = false;
            setTimeout(() => {
                if (statusElement) statusElement.innerHTML = '';
            }, 5000);
        }
    })
    .catch(error => {
        console.error('Error opening door:', error);
        if (statusElement) statusElement.innerHTML = '<span class="error-message">Failed to open door</span>';
        if (openDoorBtn) openDoorBtn.disabled = false;
    });
}

// Function to display status messages
function showStatusMessage(elementId, message, type = 'info') {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = `<span class="${type}-message">${message}</span>`;
    }
} 