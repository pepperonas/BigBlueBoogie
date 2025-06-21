(function() {
    // Cleanup
    const existing = document.getElementById('bbb-volume-control');
    if (existing) existing.remove();
    
    if (window.bbbVolumeInterval) {
        clearInterval(window.bbbVolumeInterval);
    }
    if (window.bbbSpeakerInterval) {
        clearInterval(window.bbbSpeakerInterval);
    }

    // Konfiguration
    const config = {
        normalVolume: 1.0,
        limitedVolume: 0.3,
        usersToLimit: [], 
        autoLimitEnabled: false
    };

    // Interface erstellen
    const interface = document.createElement('div');
    interface.id = 'bbb-volume-control';
    interface.innerHTML = `
        <style>
            #bbb-volume-control {
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 340px;
                background: #2C2E3B;
                border-radius: 12px;
                box-shadow: 0 8px 32px rgba(0,0,0,0.3);
                z-index: 99999;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
                color: #ffffff;
                max-height: 70vh;
                overflow: hidden;
                display: flex;
                flex-direction: column;
            }
            
            #bbb-volume-header {
                padding: 16px 20px;
                background: rgba(255,255,255,0.05);
                border-bottom: 1px solid rgba(255,255,255,0.1);
                display: flex;
                justify-content: space-between;
                align-items: center;
                cursor: move;
            }
            
            #bbb-volume-header h3 {
                margin: 0;
                font-size: 16px;
                font-weight: 500;
            }
            
            #bbb-volume-close {
                background: #ff5252;
                border: none;
                color: white;
                width: 24px;
                height: 24px;
                border-radius: 50%;
                cursor: pointer;
                font-size: 14px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s;
            }
            
            #bbb-volume-close:hover {
                background: #ff6b6b;
                transform: scale(1.1);
            }
            
            #bbb-volume-content {
                padding: 16px;
                overflow-y: auto;
                flex: 1;
            }
            
            .volume-section {
                background: rgba(255,255,255,0.05);
                border-radius: 8px;
                padding: 14px;
                margin-bottom: 12px;
            }
            
            .section-title {
                font-size: 13px;
                color: #b0b0b0;
                margin-bottom: 10px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            
            .master-control {
                background: rgba(76, 175, 80, 0.1);
                border: 1px solid rgba(76, 175, 80, 0.2);
            }
            
            .auto-limit-control {
                background: rgba(33, 150, 243, 0.1);
                border: 1px solid rgba(33, 150, 243, 0.2);
            }
            
            .toggle-row {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 12px;
            }
            
            .toggle-label {
                font-size: 14px;
                font-weight: 500;
            }
            
            .toggle-switch {
                position: relative;
                width: 44px;
                height: 24px;
                background: rgba(255,255,255,0.1);
                border-radius: 12px;
                cursor: pointer;
                transition: all 0.3s;
            }
            
            .toggle-switch.active {
                background: #4CAF50;
            }
            
            .toggle-slider {
                position: absolute;
                top: 2px;
                left: 2px;
                width: 20px;
                height: 20px;
                background: white;
                border-radius: 50%;
                transition: all 0.3s;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            }
            
            .toggle-switch.active .toggle-slider {
                left: 22px;
            }
            
            .volume-slider-row {
                display: flex;
                align-items: center;
                gap: 12px;
                margin-bottom: 8px;
            }
            
            .volume-slider {
                flex: 1;
                height: 6px;
                border-radius: 3px;
                background: rgba(255,255,255,0.1);
                outline: none;
                -webkit-appearance: none;
                cursor: pointer;
            }
            
            .volume-slider::-webkit-slider-thumb {
                -webkit-appearance: none;
                width: 16px;
                height: 16px;
                border-radius: 50%;
                background: #4CAF50;
                cursor: pointer;
                transition: all 0.2s;
            }
            
            .volume-slider::-webkit-slider-thumb:hover {
                transform: scale(1.2);
                background: #5CBF60;
            }
            
            .volume-value {
                font-size: 13px;
                color: #e0e0e0;
                min-width: 40px;
                text-align: right;
                font-weight: 500;
            }
            
            .current-speaker {
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 8px 12px;
                background: rgba(255,255,255,0.05);
                border-radius: 6px;
                margin-top: 8px;
                min-height: 32px;
            }
            
            .speaker-icon {
                color: #4CAF50;
                animation: pulse 2s infinite;
            }
            
            @keyframes pulse {
                0%, 100% { opacity: 0.6; }
                50% { opacity: 1; }
            }
            
            .user-list {
                max-height: 200px;
                overflow-y: auto;
                margin-top: 8px;
            }
            
            .user-item {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 8px 12px;
                background: rgba(255,255,255,0.03);
                border-radius: 6px;
                margin-bottom: 6px;
                transition: all 0.2s;
            }
            
            .user-item:hover {
                background: rgba(255,255,255,0.06);
            }
            
            .user-item.limited {
                background: rgba(255, 152, 0, 0.1);
                border: 1px solid rgba(255, 152, 0, 0.2);
            }
            
            .user-item.talking {
                background: rgba(76, 175, 80, 0.1);
                border: 1px solid rgba(76, 175, 80, 0.2);
            }
            
            .user-name {
                font-size: 13px;
                color: #e0e0e0;
                flex: 1;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            
            .limit-checkbox {
                cursor: pointer;
            }
            
            .limit-checkbox input {
                cursor: pointer;
                margin-right: 6px;
            }
            
            .limit-label {
                font-size: 11px;
                color: #ff9800;
            }
            
            .info-text {
                font-size: 11px;
                color: #888;
                margin-top: 8px;
                line-height: 1.4;
            }
            
            .status-bar {
                padding: 10px 16px;
                background: rgba(255,255,255,0.03);
                font-size: 11px;
                text-align: center;
                border-top: 1px solid rgba(255,255,255,0.1);
                color: #888;
            }
        </style>
        
        <div id="bbb-volume-header">
            <h3>🔊 Smart Volume Control</h3>
            <button id="bbb-volume-close">✕</button>
        </div>
        
        <div id="bbb-volume-content">
            <div class="volume-section master-control">
                <div class="section-title">Master-Lautstärke</div>
                <div class="volume-slider-row">
                    <input type="range" 
                           id="master-volume"
                           class="volume-slider" 
                           min="0" 
                           max="100" 
                           value="100">
                    <span class="volume-value">100%</span>
                </div>
                <div class="current-speaker">
                    <span id="speaker-display">Niemand spricht</span>
                </div>
            </div>
            
            <div class="volume-section auto-limit-control">
                <div class="toggle-row">
                    <span class="toggle-label">Auto-Limit aktivieren</span>
                    <div class="toggle-switch" id="auto-limit-toggle">
                        <div class="toggle-slider"></div>
                    </div>
                </div>
                
                <div class="volume-slider-row">
                    <span style="font-size: 12px; color: #888; min-width: 60px;">Limit auf:</span>
                    <input type="range" 
                           id="limit-volume"
                           class="volume-slider" 
                           min="0" 
                           max="100" 
                           value="30">
                    <span class="volume-value" id="limit-value">30%</span>
                </div>
                
                <div class="section-title" style="margin-top: 12px; margin-bottom: 8px;">Nutzer zum Limitieren</div>
                <div id="user-list" class="user-list">
                    <div class="info-text">Lade Teilnehmer...</div>
                </div>
                
                <div class="info-text">
                    Markiere Nutzer deren Lautstärke automatisch reduziert werden soll wenn sie sprechen.
                </div>
            </div>
        </div>
        
        <div class="status-bar" id="status-bar">
            Initialisiere...
        </div>
    `;
    
    document.body.appendChild(interface);
    
    // Elements
    const audioElement = document.getElementById('remote-media') || document.querySelector('audio');
    const masterSlider = document.getElementById('master-volume');
    const limitSlider = document.getElementById('limit-volume');
    const autoLimitToggle = document.getElementById('auto-limit-toggle');
    const speakerDisplay = document.getElementById('speaker-display');
    const userListContainer = document.getElementById('user-list');
    const statusBar = document.getElementById('status-bar');
    
    let currentSpeaker = null;
    let volumeBeforeLimit = 1.0;
    
    // Close Handler
    document.getElementById('bbb-volume-close').onclick = () => {
        clearInterval(window.bbbVolumeInterval);
        clearInterval(window.bbbSpeakerInterval);
        interface.remove();
    };
    
    // Master Volume Control
    if (audioElement) {
        masterSlider.oninput = function() {
            const value = this.value / 100;
            this.nextElementSibling.textContent = this.value + '%';
            audioElement.volume = Math.min(Math.max(value, 0), 1);
            if (!config.autoLimitEnabled || !currentSpeaker || !config.usersToLimit.includes(currentSpeaker)) {
                volumeBeforeLimit = value;
            }
        };
    }
    
    // Limit Volume Control
    limitSlider.oninput = function() {
        config.limitedVolume = this.value / 100;
        document.getElementById('limit-value').textContent = this.value + '%';
    };
    
    // Auto-Limit Toggle
    autoLimitToggle.onclick = function() {
        config.autoLimitEnabled = !config.autoLimitEnabled;
        this.classList.toggle('active');
        
        if (!config.autoLimitEnabled && audioElement) {
            audioElement.volume = volumeBeforeLimit;
            masterSlider.value = volumeBeforeLimit * 100;
            masterSlider.nextElementSibling.textContent = Math.round(volumeBeforeLimit * 100) + '%';
        }
        
        updateStatus();
    };
    
    // Sprecher-Erkennung mit der funktionierenden Methode
    function detectSpeaker() {
        let newSpeaker = null;
        
        const userContainers = document.querySelectorAll('span[id^="user-"]');
        
        userContainers.forEach(userSpan => {
            const userListItem = userSpan.querySelector('[data-test="userListItem"]');
            if (!userListItem) return;
            
            // Finde den Namen
            const buttonWithLabel = userListItem.querySelector('[aria-label]');
            if (!buttonWithLabel) return;
            
            const label = buttonWithLabel.getAttribute('aria-label');
            const userName = label.split(/\s+(Status|Präsentator)/)[0].trim();
            
            // Prüfe die Inner-Div Klasse (das ist der Sprecher-Indikator!)
            const innerDiv = userListItem.querySelector('.sc-iqseJM');
            if (innerDiv && innerDiv.classList.contains('dAFTGG')) {
                newSpeaker = userName;
            }
        });
        
        // Update wenn Sprecher gewechselt hat
        if (newSpeaker !== currentSpeaker) {
            currentSpeaker = newSpeaker;
            console.log('Sprecher gewechselt zu:', currentSpeaker || 'Niemand');
            updateSpeakerDisplay();
            applyAutoLimit();
        }
    }
    
    // Sprecher-Anzeige aktualisieren
    function updateSpeakerDisplay() {
        if (currentSpeaker) {
            speakerDisplay.innerHTML = `<span class="speaker-icon">🎤</span> ${currentSpeaker}`;
        } else {
            speakerDisplay.textContent = 'Niemand spricht';
        }
        
        // Update user list visuals
        document.querySelectorAll('.user-item').forEach(item => {
            item.classList.toggle('talking', item.dataset.userName === currentSpeaker);
        });
    }
    
    // Auto-Limit anwenden
    function applyAutoLimit() {
        if (!config.autoLimitEnabled || !audioElement) return;
        
        if (currentSpeaker && config.usersToLimit.includes(currentSpeaker)) {
            console.log(`Limitiere ${currentSpeaker} auf ${config.limitedVolume * 100}%`);
            audioElement.volume = config.limitedVolume;
            masterSlider.value = config.limitedVolume * 100;
            masterSlider.nextElementSibling.textContent = Math.round(config.limitedVolume * 100) + '%';
        } else {
            audioElement.volume = volumeBeforeLimit;
            masterSlider.value = volumeBeforeLimit * 100;
            masterSlider.nextElementSibling.textContent = Math.round(volumeBeforeLimit * 100) + '%';
        }
    }
    
    // User Liste aktualisieren
    function updateUserList() {
        const users = [];
        
        const userContainers = document.querySelectorAll('span[id^="user-"]');
        
        userContainers.forEach(userSpan => {
            const userListItem = userSpan.querySelector('[data-test="userListItem"]');
            if (!userListItem) return;
            
            const buttonWithLabel = userListItem.querySelector('[aria-label]');
            if (!buttonWithLabel) return;
            
            const label = buttonWithLabel.getAttribute('aria-label');
            const userName = label.split(/\s+(Status|Präsentator)/)[0].trim();
            
            if (userName && !users.includes(userName)) {
                users.push(userName);
            }
        });
        
        if (users.length === 0) {
            userListContainer.innerHTML = '<div class="info-text">Keine Nutzer gefunden</div>';
            return;
        }
        
        // Sortiere alphabetisch
        users.sort();
        
        userListContainer.innerHTML = users.map(name => `
            <div class="user-item ${config.usersToLimit.includes(name) ? 'limited' : ''} ${currentSpeaker === name ? 'talking' : ''}" 
                 data-user-name="${name}">
                <span class="user-name">${name}</span>
                <label class="limit-checkbox">
                    <input type="checkbox" 
                           data-user="${name}"
                           ${config.usersToLimit.includes(name) ? 'checked' : ''}>
                    <span class="limit-label">Limit</span>
                </label>
            </div>
        `).join('');
        
        // Checkbox Events
        userListContainer.querySelectorAll('input[type="checkbox"]').forEach(cb => {
            cb.onchange = function() {
                const userName = this.dataset.user;
                if (this.checked) {
                    if (!config.usersToLimit.includes(userName)) {
                        config.usersToLimit.push(userName);
                    }
                } else {
                    config.usersToLimit = config.usersToLimit.filter(u => u !== userName);
                }
                
                this.closest('.user-item').classList.toggle('limited', this.checked);
                updateStatus();
                
                if (currentSpeaker === userName) {
                    applyAutoLimit();
                }
            };
        });
        
        updateStatus();
    }
    
    // Status Update
    function updateStatus() {
        const limitCount = config.usersToLimit.length;
        const status = config.autoLimitEnabled 
            ? `Auto-Limit aktiv | ${limitCount} Nutzer markiert`
            : `Auto-Limit inaktiv | ${limitCount} Nutzer markiert`;
        statusBar.textContent = status;
    }
    
    // Initial load
    updateUserList();
    detectSpeaker();
    
    // Update Intervals
    window.bbbVolumeInterval = setInterval(updateUserList, 3000);
    window.bbbSpeakerInterval = setInterval(detectSpeaker, 100); // Schnelle Sprecher-Erkennung
    
    // Drag functionality
    let isDragging = false;
    let currentX, currentY, initialX, initialY, xOffset = 0, yOffset = 0;
    
    const header = document.getElementById('bbb-volume-header');
    header.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', dragEnd);
    
    function dragStart(e) {
        if (e.target.id === 'bbb-volume-close') return;
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;
        isDragging = true;
    }
    
    function drag(e) {
        if (!isDragging) return;
        e.preventDefault();
        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;
        xOffset = currentX;
        yOffset = currentY;
        interface.style.transform = `translate(${currentX}px, ${currentY}px)`;
    }
    
    function dragEnd() {
        initialX = currentX;
        initialY = currentY;
        isDragging = false;
    }
    
})();