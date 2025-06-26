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
        userVolumes: {}, // Individuelle Lautstärken für jeden Nutzer
        autoLimitEnabled: false,
        isMinimized: false
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
                width: 380px;
                background: #2C2E3B;
                border-radius: 12px;
                box-shadow: 0 8px 32px rgba(0,0,0,0.3);
                z-index: 99999;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
                color: #ffffff;
                max-height: 80vh;
                overflow: hidden;
                display: flex;
                flex-direction: column;
                transition: all 0.3s ease;
            }
            
            #bbb-volume-control.minimized {
                width: 280px;
                height: 56px;
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
            
            .header-controls {
                display: flex;
                gap: 8px;
                align-items: center;
            }
            
            .header-button {
                background: rgba(255,255,255,0.1);
                border: none;
                color: white;
                width: 24px;
                height: 24px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s;
                font-weight: bold;
            }
            
            .header-button:hover {
                background: rgba(255,255,255,0.2);
                transform: scale(1.05);
            }
            
            #bbb-volume-minimize {
                background: #2196F3;
            }
            
            #bbb-volume-minimize:hover {
                background: #42A5F5;
            }
            
            #bbb-volume-close {
                background: #ff5252;
            }
            
            #bbb-volume-close:hover {
                background: #ff6b6b;
            }
            
            #bbb-volume-content {
                padding: 16px;
                overflow-y: auto;
                flex: 1;
                transition: all 0.3s ease;
            }
            
            #bbb-volume-control.minimized #bbb-volume-content {
                display: none;
            }
            
            #bbb-volume-control.minimized .status-bar {
                display: none;
            }
            
            .minimized-info {
                display: none;
                padding: 0 20px;
                font-size: 12px;
                color: #b0b0b0;
                align-items: center;
                gap: 8px;
            }
            
            #bbb-volume-control.minimized .minimized-info {
                display: flex;
            }
            
            .minimized-speaker {
                color: #4CAF50;
                font-weight: 500;
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
                max-height: 350px;
                overflow-y: auto;
                margin-top: 8px;
            }
            
            .user-item {
                padding: 12px;
                background: rgba(255,255,255,0.03);
                border-radius: 8px;
                margin-bottom: 8px;
                transition: all 0.2s;
            }
            
            .user-item:hover {
                background: rgba(255,255,255,0.06);
            }
            
            .user-item.talking {
                background: rgba(76, 175, 80, 0.15);
                border: 1px solid rgba(76, 175, 80, 0.3);
            }
            
            .user-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 8px;
            }
            
            .user-name {
                font-size: 14px;
                color: #e0e0e0;
                font-weight: 500;
                flex: 1;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            
            .user-item.talking .user-name {
                color: #4CAF50;
            }
            
            .user-volume-control {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .user-volume-slider {
                width: 200px;
                height: 4px;
                border-radius: 2px;
                background: rgba(255,255,255,0.1);
                outline: none;
                -webkit-appearance: none;
                cursor: pointer;
            }
            
            .user-volume-slider::-webkit-slider-thumb {
                -webkit-appearance: none;
                width: 14px;
                height: 14px;
                border-radius: 50%;
                background: #2196F3;
                cursor: pointer;
                transition: all 0.2s;
            }
            
            .user-volume-slider::-webkit-slider-thumb:hover {
                transform: scale(1.2);
                background: #42A5F5;
            }
            
            .reset-button {
                background: rgba(255,255,255,0.1);
                border: 1px solid rgba(255,255,255,0.2);
                color: #fff;
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 11px;
                cursor: pointer;
                transition: all 0.2s;
            }
            
            .reset-button:hover {
                background: rgba(255,255,255,0.15);
                border-color: rgba(255,255,255,0.3);
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
                transition: all 0.3s ease;
            }
            
            .preset-buttons {
                display: flex;
                gap: 8px;
                margin-bottom: 12px;
                flex-wrap: wrap;
            }
            
            .preset-button {
                background: rgba(255,255,255,0.08);
                border: 1px solid rgba(255,255,255,0.15);
                color: #fff;
                padding: 6px 12px;
                border-radius: 6px;
                font-size: 12px;
                cursor: pointer;
                transition: all 0.2s;
                flex: 1;
                text-align: center;
            }
            
            .preset-button:hover {
                background: rgba(255,255,255,0.12);
                border-color: rgba(255,255,255,0.25);
            }
        </style>
        
        <div id="bbb-volume-header">
            <h3>🔊 Smart Volume Control</h3>
            <div class="header-controls">
                <button id="bbb-volume-minimize" class="header-button" title="Minimieren">−</button>
                <button id="bbb-volume-close" class="header-button" title="Schließen">✕</button>
            </div>
        </div>
        
        <div class="minimized-info">
            <span>🎤</span>
            <span id="minimized-speaker">Niemand spricht</span>
            <span>•</span>
            <span id="minimized-status">Inaktiv</span>
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
                    <span class="toggle-label">Individuelle Lautstärken aktivieren</span>
                    <div class="toggle-switch" id="auto-limit-toggle">
                        <div class="toggle-slider"></div>
                    </div>
                </div>
                
                <div class="preset-buttons">
                    <button class="preset-button" data-preset="50">Alle auf 50%</button>
                    <button class="preset-button" data-preset="75">Alle auf 75%</button>
                    <button class="preset-button" data-preset="100">Alle auf 100%</button>
                </div>
                
                <div class="section-title" style="margin-top: 12px; margin-bottom: 8px;">Individuelle Lautstärken</div>
                <div id="user-list" class="user-list">
                    <div class="info-text">Lade Teilnehmer...</div>
                </div>
                
                <div class="info-text">
                    Stelle für jeden Nutzer eine individuelle Lautstärke ein. Diese wird angewendet, wenn der jeweilige Nutzer spricht.
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
    const autoLimitToggle = document.getElementById('auto-limit-toggle');
    const speakerDisplay = document.getElementById('speaker-display');
    const userListContainer = document.getElementById('user-list');
    const statusBar = document.getElementById('status-bar');
    const minimizeButton = document.getElementById('bbb-volume-minimize');
    const minimizedSpeaker = document.getElementById('minimized-speaker');
    const minimizedStatus = document.getElementById('minimized-status');
    
    let currentSpeaker = null;
    let volumeBeforeLimit = 1.0;
    
    // Minimize/Maximize Handler
    minimizeButton.onclick = function() {
        config.isMinimized = !config.isMinimized;
        interface.classList.toggle('minimized', config.isMinimized);
        
        if (config.isMinimized) {
            this.textContent = '+';
            this.title = 'Maximieren';
            updateMinimizedDisplay();
        } else {
            this.textContent = '−';
            this.title = 'Minimieren';
        }
    };
    
    // Double-click auf Header zum Minimieren/Maximieren
    document.getElementById('bbb-volume-header').ondblclick = function(e) {
        if (e.target.classList.contains('header-button')) return;
        minimizeButton.click();
    };
    
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
            
            if (!config.autoLimitEnabled || !currentSpeaker) {
                audioElement.volume = Math.min(Math.max(value, 0), 1);
                volumeBeforeLimit = value;
            }
        };
    }
    
    // Auto-Limit Toggle
    autoLimitToggle.onclick = function() {
        config.autoLimitEnabled = !config.autoLimitEnabled;
        this.classList.toggle('active');
        
        if (!config.autoLimitEnabled && audioElement) {
            audioElement.volume = volumeBeforeLimit;
            masterSlider.value = volumeBeforeLimit * 100;
            masterSlider.nextElementSibling.textContent = Math.round(volumeBeforeLimit * 100) + '%';
        } else if (config.autoLimitEnabled && currentSpeaker) {
            applyUserVolume();
        }
        
        updateStatus();
        updateMinimizedDisplay();
    };
    
    // Preset Buttons
    document.querySelectorAll('.preset-button').forEach(button => {
        button.onclick = function() {
            const presetValue = parseInt(this.dataset.preset) / 100;
            
            // Setze alle User-Slider auf den Preset-Wert
            document.querySelectorAll('.user-volume-slider').forEach(slider => {
                slider.value = this.dataset.preset;
                slider.nextElementSibling.textContent = this.dataset.preset + '%';
                const userName = slider.dataset.user;
                config.userVolumes[userName] = presetValue;
            });
            
            // Wenn jemand gerade spricht, wende die neue Lautstärke an
            if (config.autoLimitEnabled && currentSpeaker) {
                applyUserVolume();
            }
        };
    });
    
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
            updateMinimizedDisplay();
            applyUserVolume();
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
    
    // Minimierte Anzeige aktualisieren
    function updateMinimizedDisplay() {
        minimizedSpeaker.textContent = currentSpeaker || 'Niemand spricht';
        minimizedStatus.textContent = config.autoLimitEnabled ? 'Aktiv' : 'Inaktiv';
    }
    
    // Nutzer-spezifische Lautstärke anwenden
    function applyUserVolume() {
        if (!config.autoLimitEnabled || !audioElement) return;
        
        if (currentSpeaker && config.userVolumes[currentSpeaker] !== undefined) {
            const userVolume = config.userVolumes[currentSpeaker];
            const effectiveVolume = volumeBeforeLimit * userVolume;
            
            console.log(`Setze Lautstärke für ${currentSpeaker}: ${Math.round(userVolume * 100)}% (effektiv: ${Math.round(effectiveVolume * 100)}%)`);
            
            audioElement.volume = effectiveVolume;
            masterSlider.value = effectiveVolume * 100;
            masterSlider.nextElementSibling.textContent = Math.round(effectiveVolume * 100) + '%';
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
        
        // Initialisiere neue Nutzer mit 100%
        users.forEach(name => {
            if (config.userVolumes[name] === undefined) {
                config.userVolumes[name] = 1.0;
            }
        });
        
        userListContainer.innerHTML = users.map(name => {
            const volume = config.userVolumes[name] || 1.0;
            return `
            <div class="user-item ${currentSpeaker === name ? 'talking' : ''}" 
                 data-user-name="${name}">
                <div class="user-header">
                    <span class="user-name">${name}</span>
                    <button class="reset-button" data-user="${name}">Reset</button>
                </div>
                <div class="user-volume-control">
                    <input type="range" 
                           class="user-volume-slider"
                           data-user="${name}"
                           min="0" 
                           max="100" 
                           value="${Math.round(volume * 100)}">
                    <span class="volume-value">${Math.round(volume * 100)}%</span>
                </div>
            </div>
        `}).join('');
        
        // Volume Slider Events
        userListContainer.querySelectorAll('.user-volume-slider').forEach(slider => {
            slider.oninput = function() {
                const userName = this.dataset.user;
                const value = this.value / 100;
                
                this.nextElementSibling.textContent = this.value + '%';
                config.userVolumes[userName] = value;
                
                // Wenn dieser Nutzer gerade spricht, sofort anwenden
                if (config.autoLimitEnabled && currentSpeaker === userName) {
                    applyUserVolume();
                }
            };
        });
        
        // Reset Button Events
        userListContainer.querySelectorAll('.reset-button').forEach(button => {
            button.onclick = function() {
                const userName = this.dataset.user;
                config.userVolumes[userName] = 1.0;
                
                const slider = this.closest('.user-item').querySelector('.user-volume-slider');
                slider.value = 100;
                slider.nextElementSibling.textContent = '100%';
                
                if (config.autoLimitEnabled && currentSpeaker === userName) {
                    applyUserVolume();
                }
            };
        });
        
        updateStatus();
        updateMinimizedDisplay();
    }
    
    // Status Update
    function updateStatus() {
        const userCount = Object.keys(config.userVolumes).length;
        const modifiedCount = Object.values(config.userVolumes).filter(v => v !== 1.0).length;
        const status = config.autoLimitEnabled 
            ? `Individuelle Lautstärken aktiv | ${modifiedCount} von ${userCount} Nutzern angepasst`
            : `Individuelle Lautstärken inaktiv | ${userCount} Nutzer erkannt`;
        statusBar.textContent = status;
    }
    
    // Initial load
    updateUserList();
    detectSpeaker();
    updateMinimizedDisplay();
    
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
        if (e.target.classList.contains('header-button')) return;
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