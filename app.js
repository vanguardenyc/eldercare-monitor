document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const setupScreen = document.getElementById('setup-screen');
    const dashboardScreen = document.getElementById('dashboard-screen');
    const phoneInput = document.getElementById('parent-phone');
    const connectBtn = document.getElementById('connect-btn');
    const errorText = document.getElementById('setup-error');
    
    const networkIndicator = document.getElementById('network-indicator');
    const networkText = document.getElementById('network-text');
    const roomStatus = document.getElementById('room-status');
    
    const listenBtn = document.getElementById('listen-btn');
    const talkBtn = document.getElementById('talk-btn');

    // 1. Connection & Authentication Simulation
    connectBtn.addEventListener('click', () => {
        const phone = phoneInput.value.replace(/\D/g, '');
        if (phone.length >= 10) {
            setupScreen.classList.remove('active');
            dashboardScreen.classList.remove('hidden');
            dashboardScreen.classList.add('active');
            initializeMonitoring();
        } else {
            errorText.classList.remove('hidden');
        }
    });

    // 2. Network Stability Monitoring (Resilience over 5G/Wi-Fi)
    function updateNetworkStatus() {
        if (navigator.onLine) {
            // Check connection speed API if available, fallback to basic online status
            const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
            if (connection && (connection.effectiveType === '2g' || connection.rtt > 300)) {
                networkIndicator.className = 'dot yellow';
                networkText.textContent = 'High Latency';
            } else {
                networkIndicator.className = 'dot green';
                networkText.textContent = 'Connected (Low Latency)';
            }
        } else {
            networkIndicator.className = 'dot red';
            networkText.textContent = 'Offline - Attempting Reconnect';
        }
    }
    
    window.addEventListener('online', updateNetworkStatus);
    window.addEventListener('offline', updateNetworkStatus);
    
    // Polling simulation for network latency drops
    setInterval(updateNetworkStatus, 5000);

    // 3. Movement Tracking Simulation
    function initializeMonitoring() {
        const rooms = ['Living Room', 'Kitchen', 'Bedroom', 'Bathroom'];
        setInterval(() => {
            // Simulate room movement API fetch every 15 seconds
            const randomRoom = rooms[Math.floor(Math.random() * rooms.length)];
            roomStatus.textContent = randomRoom;
            roomStatus.style.animation = 'none';
            setTimeout(() => roomStatus.style.animation = 'highlight 1s ease', 10);
        }, 15000);
    }

    // 4. Bi-Directional Audio (WebRTC Mock)
    let isListening = false;
    
    listenBtn.addEventListener('click', async () => {
        isListening = !isListening;
        if (isListening) {
            listenBtn.classList.add('listening');
            listenBtn.innerHTML = '<span class="icon">🔊</span> Active...';
            // In a real build: await navigator.mediaDevices.getUserMedia({ audio: true })
            // and establish RTCPeerConnection to the remote device's stream.
        } else {
            listenBtn.classList.remove('listening');
            listenBtn.innerHTML = '<span class="icon">🔊</span> Listen In';
        }
    });

    // Push-to-talk functionality (Half-duplex failsafe for unstable networks)
    talkBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        talkBtn.style.opacity = '0.8';
        talkBtn.innerHTML = '<span class="icon">🎙️</span> Transmitting...';
        // Open local mic stream to remote peer
    });

    talkBtn.addEventListener('touchend', (e) => {
        e.preventDefault();
        talkBtn.style.opacity = '1';
        talkBtn.innerHTML = '<span class="icon">🎙️</span> Hold to Talk';
        // Close/mute local mic stream
    });

    // Mouse fallbacks for desktop testing
    talkBtn.addEventListener('mousedown', () => {
        talkBtn.innerHTML = '<span class="icon">🎙️</span> Transmitting...';
    });
    talkBtn.addEventListener('mouseup', () => {
        talkBtn.innerHTML = '<span class="icon">🎙️</span> Hold to Talk';
    });
    talkBtn.addEventListener('mouseleave', () => {
        talkBtn.style.opacity = '1';
        talkBtn.innerHTML = '<span class="icon">🎙️</span> Hold to Talk';
    });
});
