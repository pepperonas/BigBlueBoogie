// BigBlueButton Enhanced Extension - Combined Functionality
(function() {
    'use strict';
    
    // Prüfe ob Extension bereits läuft
    if (window.bbbEnhancedActive) {
        console.log('BBB Enhanced Extension bereits aktiv');
        return;
    }
    window.bbbEnhancedActive = true;
    
    // Cleanup existing overlays
    const cleanupExisting = () => {
        ['bbb-auto-dialog-status', 'bbb-volume-control', 'bbb-theme-overlay'].forEach(id => {
            const existing = document.getElementById(id);
            if (existing) existing.remove();
        });
        
        if (window.bbbVolumeInterval) clearInterval(window.bbbVolumeInterval);
        if (window.bbbSpeakerInterval) clearInterval(window.bbbSpeakerInterval);
    };
    
    cleanupExisting();
    
    // Configuration for all features
    const config = {
        // Master Control
        pluginEnabled: true,
        
        // Dialog Handler
        dialogEnabled: true,
        dialogCountdown: 5,
        
        // Volume Control
        normalVolume: 1.0,
        userVolumes: {},
        autoLimitEnabled: true, // Default: aktiviert
        
        // Theme Switcher
        currentTheme: 'default',
        themeBeforeDisable: 'default', // Theme vor Deaktivierung merken
        
        // Interface
        isMinimized: false,
        position: { x: 0, y: 0 }
    };
    
    // Theme definitions
    const themes = {
        default: {
            name: 'Standard',
            css: ''
        },
        light: {
            name: 'Hell',
            css: `
                :root {
                    --palette-background: #ffffff;
                    --palette-surface: #f5f5f5;
                    --palette-primary: #2196f3;
                    --palette-text: #000000;
                    --palette-text-secondary: #666666;
                }
                body { background-color: #ffffff !important; color: #000000 !important; }
                [class*="styles__container"] { background-color: #ffffff !important; }
                [class*="styles__content"] { background-color: #f5f5f5 !important; color: #000000 !important; }
            `
        },
        hacker: {
            name: 'Hacker',
            css: `
                :root {
                    --palette-background: #000000;
                    --palette-surface: #0a0a0a;
                    --palette-primary: #00ff00;
                    --palette-text: #00ff00;
                    --palette-text-secondary: #00cc00;
                }
                body { 
                    background-color: #000000 !important; 
                    color: #00ff00 !important; 
                    font-family: 'Courier New', monospace !important;
                }
                [class*="styles__container"] { background-color: #000000 !important; }
                [class*="styles__content"] { 
                    background-color: #0a0a0a !important; 
                    color: #00ff00 !important;
                    font-family: 'Courier New', monospace !important;
                }
                * { text-shadow: 0 0 5px #00ff00 !important; }
            `
        },
        typewriter: {
            name: 'Schreibmaschine',
            css: `
                :root {
                    --palette-background: #ffffff;
                    --palette-surface: #f9f9f9;
                    --palette-primary: #333333;
                    --palette-text: #000000;
                    --palette-text-secondary: #444444;
                }
                body { 
                    background-color: #ffffff !important; 
                    color: #000000 !important; 
                    font-family: 'Courier New', 'Monaco', 'Lucida Console', monospace !important;
                    font-weight: normal !important;
                }
                [class*="styles__container"] { background-color: #ffffff !important; }
                [class*="styles__content"] { 
                    background-color: #f9f9f9 !important; 
                    color: #000000 !important;
                    font-family: 'Courier New', 'Monaco', 'Lucida Console', monospace !important;
                }
                * { 
                    font-family: 'Courier New', 'Monaco', 'Lucida Console', monospace !important;
                    letter-spacing: 0.5px !important;
                }
            `
        }
    };
    
    // Main Interface Creation
    const createMainInterface = () => {
        const container = document.createElement('div');
        container.id = 'bbb-enhanced-control';
        container.innerHTML = `
            <style>
                #bbb-enhanced-control {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    width: 420px;
                    background: linear-gradient(145deg, #2C2E3B, #1e2027);
                    border-radius: 12px;
                    box-shadow: 0 8px 32px rgba(0,0,0,0.3);
                    z-index: 999999;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
                    color: #ffffff;
                    max-height: 80vh;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                    transition: all 0.3s ease;
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255,255,255,0.1);
                }
                
                #bbb-enhanced-control.minimized {
                    width: 320px;
                    height: 56px;
                }
                
                .main-header {
                    padding: 16px 20px;
                    background: rgba(255,255,255,0.05);
                    border-bottom: 1px solid rgba(255,255,255,0.1);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    cursor: move;
                    user-select: none;
                }
                
                .main-header h3 {
                    margin: 0;
                    font-size: 16px;
                    font-weight: 500;
                    display: flex;
                    align-items: center;
                    gap: 8px;
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
                    width: 28px;
                    height: 28px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 14px;
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
                
                .minimize-btn {
                    background: #2196F3 !important;
                }
                
                .minimize-btn:hover {
                    background: #42A5F5 !important;
                }
                
                .close-btn {
                    background: #ff5252 !important;
                }
                
                .close-btn:hover {
                    background: #ff6b6b !important;
                }
                
                .master-toggle-btn {
                    background: #4CAF50 !important;
                    font-size: 16px !important;
                }
                
                .master-toggle-btn:hover {
                    background: #5CBF60 !important;
                }
                
                .master-toggle-btn:not(.active) {
                    background: #757575 !important;
                }
                
                .master-toggle-btn:not(.active):hover {
                    background: #9E9E9E !important;
                }
                
                #bbb-enhanced-control.disabled {
                    opacity: 0.6;
                }
                
                #bbb-enhanced-control.disabled .main-content {
                    pointer-events: none;
                }
                
                #bbb-enhanced-control.disabled .tab-navigation {
                    opacity: 0.5;
                }
                
                .main-content {
                    padding: 0;
                    overflow-y: auto;
                    flex: 1;
                    transition: all 0.3s ease;
                }
                
                #bbb-enhanced-control.minimized .main-content {
                    display: none;
                }
                
                .minimized-info {
                    display: none;
                    padding: 0 20px;
                    font-size: 12px;
                    color: #b0b0b0;
                    align-items: center;
                    gap: 8px;
                    flex: 1;
                }
                
                #bbb-enhanced-control.minimized .minimized-info {
                    display: flex;
                }
                
                .tab-navigation {
                    display: flex;
                    background: rgba(255,255,255,0.03);
                    border-bottom: 1px solid rgba(255,255,255,0.1);
                }
                
                .tab-button {
                    flex: 1;
                    padding: 12px 16px;
                    background: none;
                    border: none;
                    color: rgba(255,255,255,0.7);
                    cursor: pointer;
                    font-size: 13px;
                    font-weight: 500;
                    transition: all 0.2s;
                    border-bottom: 2px solid transparent;
                }
                
                .tab-button.active {
                    color: #ffffff;
                    background: rgba(255,255,255,0.05);
                    border-bottom-color: #4CAF50;
                }
                
                .tab-button:hover:not(.active) {
                    color: #ffffff;
                    background: rgba(255,255,255,0.03);
                }
                
                .tab-content {
                    display: none;
                    padding: 16px;
                    max-height: 500px;
                    overflow-y: auto;
                }
                
                .tab-content.active {
                    display: block;
                }
                
                .section {
                    background: rgba(255,255,255,0.05);
                    border-radius: 8px;
                    padding: 16px;
                    margin-bottom: 12px;
                }
                
                .section-title {
                    font-size: 13px;
                    color: #b0b0b0;
                    margin-bottom: 12px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    font-weight: 500;
                }
                
                .status-indicator {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 10px 12px;
                    background: rgba(255,255,255,0.03);
                    border-radius: 6px;
                    font-size: 14px;
                    margin-bottom: 12px;
                }
                
                .status-dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: #4CAF50;
                    animation: pulse 2s infinite;
                }
                
                .status-dot.inactive {
                    background: #757575;
                    animation: none;
                }
                
                @keyframes pulse {
                    0%, 100% { opacity: 0.6; transform: scale(1); }
                    50% { opacity: 1; transform: scale(1.2); }
                }
                
                .control-row {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 12px;
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
                
                .theme-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 8px;
                    margin-bottom: 12px;
                }
                
                .theme-button {
                    padding: 12px 16px;
                    background: rgba(255,255,255,0.08);
                    border: 1px solid rgba(255,255,255,0.15);
                    border-radius: 8px;
                    color: #ffffff;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: 500;
                    transition: all 0.2s;
                    text-align: center;
                }
                
                .theme-button:hover {
                    background: rgba(255,255,255,0.12);
                    border-color: rgba(255,255,255,0.25);
                    transform: translateY(-2px);
                }
                
                .theme-button.active {
                    background: #4CAF50;
                    border-color: #4CAF50;
                }
                
                .user-list {
                    max-height: 300px;
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
                    width: 180px;
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
                
                #bbb-enhanced-control.minimized .status-bar {
                    display: none;
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
                
                .countdown-display {
                    font-weight: bold;
                    color: #FF9800;
                    margin-left: 8px;
                }
            </style>
            
            <div class="main-header">
                <h3>🎛️ BBB Enhanced Control</h3>
                <div class="minimized-info">
                    <span id="minimized-status">Aktiv</span>
                    <span>•</span>
                    <span id="minimized-speaker">Niemand spricht</span>
                </div>
                <div class="header-controls">
                    <button class="header-button master-toggle-btn active" id="master-toggle-btn" title="Plugin Ein/Aus">⚡</button>
                    <button class="header-button minimize-btn" id="minimize-btn" title="Minimieren">−</button>
                    <button class="header-button close-btn" id="close-btn" title="Schließen">✕</button>
                </div>
            </div>
            
            <div class="main-content">
                <div class="tab-navigation">
                    <button class="tab-button active" data-tab="dialog">🤖 Auto-Dialog</button>
                    <button class="tab-button" data-tab="volume">🔊 Lautstärke</button>
                    <button class="tab-button" data-tab="theme">🎨 Themes</button>
                </div>
                
                <div class="tab-content active" id="dialog-tab">
                    <div class="section">
                        <div class="section-title">Auto-Dialog Handler</div>
                        <div class="status-indicator">
                            <div class="status-dot" id="dialog-status-dot"></div>
                            <span id="dialog-status-text">Überwacht Dialoge</span>
                            <span id="dialog-countdown" class="countdown-display"></span>
                        </div>
                        <div class="control-row">
                            <span>Dialog-Handler aktiviert</span>
                            <div class="toggle-switch active" id="dialog-toggle">
                                <div class="toggle-slider"></div>
                            </div>
                        </div>
                        <div class="info-text">
                            Erkennt automatisch OK-Dialoge und klickt sie nach ${config.dialogCountdown} Sekunden. Mit Ton-Feedback.
                        </div>
                    </div>
                </div>
                
                <div class="tab-content" id="volume-tab">
                    <div class="section">
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
                    
                    <div class="section">
                        <div class="control-row">
                            <span>Individuelle Lautstärken</span>
                            <div class="toggle-switch active" id="auto-limit-toggle">
                                <div class="toggle-slider"></div>
                            </div>
                        </div>
                        
                        <div class="preset-buttons">
                            <button class="preset-button" data-preset="50">50%</button>
                            <button class="preset-button" data-preset="75">75%</button>
                            <button class="preset-button" data-preset="100">100%</button>
                        </div>
                        
                        <div class="section-title" style="margin-top: 12px;">Teilnehmer</div>
                        <div id="user-list" class="user-list">
                            <div class="info-text">Lade Teilnehmer...</div>
                        </div>
                        
                        <div class="info-text">
                            Individuelle Lautstärken pro Sprecher. Aktiviere den Schalter oben, um sie zu verwenden.
                        </div>
                    </div>
                </div>
                
                <div class="tab-content" id="theme-tab">
                    <div class="section">
                        <div class="section-title">Theme-Auswahl</div>
                        <div class="theme-grid" id="theme-grid">
                            <!-- Theme buttons will be inserted here -->
                        </div>
                        <div class="info-text">
                            Wähle ein visuelles Theme für BigBlueButton. Änderungen werden sofort angewendet.
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="status-bar" id="status-bar">
                BBB Enhanced Control geladen
            </div>
        `;
        
        document.body.appendChild(container);
        return container;
    };
    
    // Akustische Signale
    const playLoadSound = () => {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const frequencies = [440, 554, 659];
            
            frequencies.forEach((freq, index) => {
                setTimeout(() => {
                    const oscillator = audioContext.createOscillator();
                    const gainNode = audioContext.createGain();
                    
                    oscillator.connect(gainNode);
                    gainNode.connect(audioContext.destination);
                    
                    oscillator.frequency.value = freq;
                    oscillator.type = 'sine';
                    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
                    
                    oscillator.start(audioContext.currentTime);
                    oscillator.stop(audioContext.currentTime + 0.15);
                }, index * 100);
            });
        } catch (e) {
            console.log('Audio nicht verfügbar:', e);
        }
    };
    
    const playDialogSound = () => {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            [660, 880].forEach((freq, index) => {
                setTimeout(() => {
                    const oscillator = audioContext.createOscillator();
                    const gainNode = audioContext.createGain();
                    
                    oscillator.connect(gainNode);
                    gainNode.connect(audioContext.destination);
                    
                    oscillator.frequency.value = freq;
                    oscillator.type = 'square';
                    gainNode.gain.setValueAtTime(0.4, audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
                    
                    oscillator.start(audioContext.currentTime);
                    oscillator.stop(audioContext.currentTime + 0.1);
                }, index * 120);
            });
        } catch (e) {
            console.log('Audio nicht verfügbar:', e);
        }
    };
    
    const playSuccessSound = () => {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const frequencies = [523, 659, 784];
            
            frequencies.forEach((freq, index) => {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.value = freq;
                oscillator.type = 'sine';
                gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
                
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.3);
            });
        } catch (e) {
            console.log('Audio nicht verfügbar:', e);
        }
    };
    
    // Create main interface and initialize
    const mainInterface = createMainInterface();
    playLoadSound();
    
    // Global variables
    let checkInterval;
    let dialogFound = false;
    let currentSpeaker = null;
    let volumeBeforeLimit = 1.0;
    
    // Get interface elements
    const elements = {
        // Dialog tab
        dialogStatusDot: document.getElementById('dialog-status-dot'),
        dialogStatusText: document.getElementById('dialog-status-text'),
        dialogCountdown: document.getElementById('dialog-countdown'),
        dialogToggle: document.getElementById('dialog-toggle'),
        
        // Volume tab
        masterVolume: document.getElementById('master-volume'),
        autoLimitToggle: document.getElementById('auto-limit-toggle'),
        speakerDisplay: document.getElementById('speaker-display'),
        userList: document.getElementById('user-list'),
        
        // Theme tab
        themeGrid: document.getElementById('theme-grid'),
        
        // Main controls
        masterToggleBtn: document.getElementById('master-toggle-btn'),
        minimizeBtn: document.getElementById('minimize-btn'),
        closeBtn: document.getElementById('close-btn'),
        statusBar: document.getElementById('status-bar'),
        minimizedStatus: document.getElementById('minimized-status'),
        minimizedSpeaker: document.getElementById('minimized-speaker'),
        
        // Audio element
        audioElement: document.getElementById('remote-media') || document.querySelector('audio')
    };
    
    // Theme Functions
    const applyTheme = (themeKey) => {
        const existingStyle = document.getElementById('bbb-custom-theme');
        if (existingStyle) existingStyle.remove();
        
        if (themes[themeKey] && themes[themeKey].css) {
            const style = document.createElement('style');
            style.id = 'bbb-custom-theme';
            style.textContent = themes[themeKey].css;
            document.head.appendChild(style);
        }
        
        config.currentTheme = themeKey;
        
        // Update themeBeforeDisable wenn Plugin aktiv ist
        if (config.pluginEnabled) {
            config.themeBeforeDisable = themeKey;
        }
        
        updateThemeButtons();
        showNotification(`${themes[themeKey].name} Theme aktiviert!`);
    };
    
    const updateThemeButtons = () => {
        document.querySelectorAll('.theme-button').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.theme === config.currentTheme);
        });
    };
    
    const initializeThemeButtons = () => {
        elements.themeGrid.innerHTML = Object.keys(themes).map(themeKey => 
            `<button class="theme-button ${themeKey === config.currentTheme ? 'active' : ''}" 
                     data-theme="${themeKey}">${themes[themeKey].name}</button>`
        ).join('');
        
        elements.themeGrid.addEventListener('click', (e) => {
            if (e.target.classList.contains('theme-button')) {
                applyTheme(e.target.dataset.theme);
            }
        });
    };
    
    // Volume Control Functions
    const detectSpeaker = () => {
        let newSpeaker = null;
        
        const userContainers = document.querySelectorAll('span[id^="user-"]');
        
        userContainers.forEach(userSpan => {
            const userListItem = userSpan.querySelector('[data-test="userListItem"]');
            if (!userListItem) return;
            
            const buttonWithLabel = userListItem.querySelector('[aria-label]');
            if (!buttonWithLabel) return;
            
            const label = buttonWithLabel.getAttribute('aria-label');
            const userName = label.split(/\s+(Status|Präsentator)/)[0].trim();
            
            const innerDiv = userListItem.querySelector('.sc-iqseJM');
            if (innerDiv && innerDiv.classList.contains('dAFTGG')) {
                newSpeaker = userName;
            }
        });
        
        if (newSpeaker !== currentSpeaker) {
            currentSpeaker = newSpeaker;
            updateSpeakerDisplay();
            updateMinimizedDisplay();
            applyUserVolume();
        }
    };
    
    const updateSpeakerDisplay = () => {
        if (currentSpeaker) {
            elements.speakerDisplay.innerHTML = `<span class="speaker-icon">🎤</span> ${currentSpeaker}`;
        } else {
            elements.speakerDisplay.textContent = 'Niemand spricht';
        }
        
        document.querySelectorAll('.user-item').forEach(item => {
            item.classList.toggle('talking', item.dataset.userName === currentSpeaker);
        });
    };
    
    const updateMinimizedDisplay = () => {
        if (!config.pluginEnabled) {
            elements.minimizedStatus.textContent = 'Deaktiviert';
            elements.minimizedSpeaker.textContent = 'Plugin pausiert';
            return;
        }
        
        elements.minimizedSpeaker.textContent = currentSpeaker || 'Niemand spricht';
        elements.minimizedStatus.textContent = config.autoLimitEnabled ? 'Vol: Aktiv' : 'Vol: Inaktiv';
    };
    
    const applyUserVolume = () => {
        if (!config.pluginEnabled || !config.autoLimitEnabled || !elements.audioElement) return;
        
        if (currentSpeaker && config.userVolumes[currentSpeaker] !== undefined) {
            const userVolume = config.userVolumes[currentSpeaker];
            const effectiveVolume = volumeBeforeLimit * userVolume;
            
            elements.audioElement.volume = effectiveVolume;
            elements.masterVolume.value = effectiveVolume * 100;
            elements.masterVolume.nextElementSibling.textContent = Math.round(effectiveVolume * 100) + '%';
        } else {
            elements.audioElement.volume = volumeBeforeLimit;
            elements.masterVolume.value = volumeBeforeLimit * 100;
            elements.masterVolume.nextElementSibling.textContent = Math.round(volumeBeforeLimit * 100) + '%';
        }
    };
    
    const updateUserList = () => {
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
            elements.userList.innerHTML = '<div class="info-text">Keine Nutzer gefunden</div>';
            return;
        }
        
        users.sort();
        
        users.forEach(name => {
            if (config.userVolumes[name] === undefined) {
                config.userVolumes[name] = 1.0;
            }
        });
        
        elements.userList.innerHTML = users.map(name => {
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
        
        // Add event listeners
        elements.userList.querySelectorAll('.user-volume-slider').forEach(slider => {
            slider.oninput = function() {
                const userName = this.dataset.user;
                const value = this.value / 100;
                
                this.nextElementSibling.textContent = this.value + '%';
                config.userVolumes[userName] = value;
                
                if (config.autoLimitEnabled && currentSpeaker === userName) {
                    applyUserVolume();
                }
            };
        });
        
        elements.userList.querySelectorAll('.reset-button').forEach(button => {
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
    };
    
    // Dialog Handler Functions
    const handleDialog = () => {
        if (!config.pluginEnabled || !config.dialogEnabled) return;
        
        const dialogSelectors = [
            '[role="dialog"]',
            '.modal',
            '.ReactModal__Content',
            '[aria-modal="true"]',
            '.portal--modal',
            '[data-test="modal"]'
        ];
        
        const buttonSelectors = [
            'button[aria-label*="OK"]',
            'button[aria-label*="Ok"]', 
            'button[aria-label*="Prüfen"]',
            'button[aria-label*="Check"]',
            '.modal button[type="submit"]',
            '.modal button.primary',
            '[role="dialog"] button[type="button"]'
        ];
        
        let dialog = null;
        for (const selector of dialogSelectors) {
            dialog = document.querySelector(selector);
            if (dialog && dialog.offsetParent !== null) break;
        }
        
        if (dialog && !dialogFound) {
            dialogFound = true;
            updateDialogStatus('Dialog erkannt - Countdown...', '#FF9800');
            playDialogSound();
            
            let countdown = config.dialogCountdown;
            elements.dialogCountdown.textContent = `(${countdown}s)`;
            
            const countdownInterval = setInterval(() => {
                countdown--;
                elements.dialogCountdown.textContent = `(${countdown}s)`;
                
                if (countdown <= 0) {
                    clearInterval(countdownInterval);
                    
                    let okButton = null;
                    
                    const buttons = dialog.querySelectorAll('button');
                    for (const btn of buttons) {
                        const text = btn.textContent.toLowerCase().trim();
                        if (text.includes('ok') || text.includes('prüfen') || text.includes('check')) {
                            okButton = btn;
                            break;
                        }
                    }
                    
                    if (!okButton) {
                        for (const selector of buttonSelectors) {
                            okButton = dialog.querySelector(selector);
                            if (okButton) break;
                        }
                    }
                    
                    if (okButton && !okButton.disabled) {
                        const buttonText = okButton.textContent.trim();
                        okButton.click();
                        updateDialogStatus(`"${buttonText}" geklickt!`, '#4CAF50');
                        elements.dialogCountdown.textContent = '✓';
                        playSuccessSound();
                        
                        setTimeout(() => {
                            dialogFound = false;
                            updateDialogStatus('Überwacht Dialoge', '#4CAF50');
                            elements.dialogCountdown.textContent = '';
                        }, 3000);
                    } else {
                        updateDialogStatus('Button nicht gefunden', '#f44336');
                        elements.dialogCountdown.textContent = '✗';
                        dialogFound = false;
                        
                        setTimeout(() => {
                            updateDialogStatus('Überwacht Dialoge', '#4CAF50');
                            elements.dialogCountdown.textContent = '';
                        }, 5000);
                    }
                }
            }, 1000);
        }
    };
    
    const updateDialogStatus = (message, color = '#4CAF50') => {
        elements.dialogStatusText.textContent = message;
        elements.dialogStatusDot.style.background = color;
    };
    
    // UI Helper Functions
    const showNotification = (message) => {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(145deg, #2C2E3B, #1e2027);
            color: #ffffff;
            padding: 16px 24px;
            border-radius: 8px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.3);
            z-index: 1000001;
            font-family: 'Roboto', sans-serif;
            font-size: 14px;
            border: 1px solid rgba(255,255,255,0.1);
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => notification.style.opacity = '1', 10);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                if (notification.parentNode) notification.remove();
            }, 300);
        }, 2000);
    };
    
    const updateStatus = () => {
        if (!config.pluginEnabled) {
            elements.statusBar.textContent = 'Plugin deaktiviert - Alle Funktionen pausiert';
            return;
        }
        
        const userCount = Object.keys(config.userVolumes).length;
        const modifiedCount = Object.values(config.userVolumes).filter(v => v !== 1.0).length;
        const status = config.autoLimitEnabled 
            ? `Individuelle Lautstärken aktiv | ${modifiedCount} von ${userCount} Nutzern angepasst`
            : `Dialog Handler: ${config.dialogEnabled ? 'AN' : 'AUS'} | ${userCount} Nutzer erkannt`;
        elements.statusBar.textContent = status;
    };
    
    // Tab Navigation
    const initializeTabs = () => {
        document.querySelectorAll('.tab-button').forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active from all tabs and contents
                document.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                
                // Add active to clicked tab and corresponding content
                btn.classList.add('active');
                document.getElementById(btn.dataset.tab + '-tab').classList.add('active');
            });
        });
    };
    
    // Master Plugin Toggle
    const togglePlugin = () => {
        config.pluginEnabled = !config.pluginEnabled;
        
        elements.masterToggleBtn.classList.toggle('active', config.pluginEnabled);
        mainInterface.classList.toggle('disabled', !config.pluginEnabled);
        
        if (config.pluginEnabled) {
            elements.masterToggleBtn.textContent = '⚡';
            elements.masterToggleBtn.title = 'Plugin deaktivieren';
            
            // Restart intervals
            if (!window.bbbVolumeInterval) {
                window.bbbVolumeInterval = setInterval(updateUserList, 3000);
            }
            if (!window.bbbSpeakerInterval) {
                window.bbbSpeakerInterval = setInterval(detectSpeaker, 100);
            }
            if (!checkInterval) {
                checkInterval = setInterval(handleDialog, 500);
            }
            
            // Restore previous theme and volume settings
            if (config.themeBeforeDisable && config.themeBeforeDisable !== 'default') {
                applyTheme(config.themeBeforeDisable);
            }
            
            // Restore individual volume setting
            config.autoLimitEnabled = true;
            elements.autoLimitToggle.classList.add('active');
            
        } else {
            elements.masterToggleBtn.textContent = '💤';
            elements.masterToggleBtn.title = 'Plugin aktivieren';
            
            // Stop all intervals
            if (window.bbbVolumeInterval) {
                clearInterval(window.bbbVolumeInterval);
                window.bbbVolumeInterval = null;
            }
            if (window.bbbSpeakerInterval) {
                clearInterval(window.bbbSpeakerInterval);
                window.bbbSpeakerInterval = null;
            }
            if (checkInterval) {
                clearInterval(checkInterval);
                checkInterval = null;
            }
            
            // Save current theme and switch to default
            config.themeBeforeDisable = config.currentTheme;
            if (config.currentTheme !== 'default') {
                applyTheme('default');
            }
            
            // Disable individual volume control
            config.autoLimitEnabled = false;
            elements.autoLimitToggle.classList.remove('active');
            
            // Reset volume to master level
            if (elements.audioElement) {
                elements.audioElement.volume = volumeBeforeLimit;
                elements.masterVolume.value = volumeBeforeLimit * 100;
                elements.masterVolume.nextElementSibling.textContent = Math.round(volumeBeforeLimit * 100) + '%';
            }
        }
        
        updateStatus();
        updateMinimizedDisplay();
        updateThemeButtons();
    };
    
    // Main Interface Event Handlers
    const initializeEventHandlers = () => {
        // Master Toggle
        elements.masterToggleBtn.onclick = togglePlugin;
        
        // Minimize/Maximize
        elements.minimizeBtn.onclick = function() {
            config.isMinimized = !config.isMinimized;
            mainInterface.classList.toggle('minimized', config.isMinimized);
            
            if (config.isMinimized) {
                this.textContent = '+';
                this.title = 'Maximieren';
                updateMinimizedDisplay();
            } else {
                this.textContent = '−';
                this.title = 'Minimieren';
            }
        };
        
        // Close
        elements.closeBtn.onclick = () => {
            clearInterval(window.bbbVolumeInterval);
            clearInterval(window.bbbSpeakerInterval);
            if (checkInterval) clearInterval(checkInterval);
            mainInterface.remove();
        };
        
        // Dialog toggle
        elements.dialogToggle.onclick = function() {
            config.dialogEnabled = !config.dialogEnabled;
            this.classList.toggle('active', config.dialogEnabled);
            
            if (config.dialogEnabled) {
                elements.dialogStatusDot.classList.remove('inactive');
                updateDialogStatus('Überwacht Dialoge', '#4CAF50');
            } else {
                elements.dialogStatusDot.classList.add('inactive');
                updateDialogStatus('Deaktiviert', '#757575');
            }
            updateStatus();
        };
        
        // Master volume
        if (elements.audioElement) {
            elements.masterVolume.oninput = function() {
                const value = this.value / 100;
                this.nextElementSibling.textContent = this.value + '%';
                
                if (!config.autoLimitEnabled || !currentSpeaker) {
                    elements.audioElement.volume = Math.min(Math.max(value, 0), 1);
                    volumeBeforeLimit = value;
                }
            };
        }
        
        // Auto-limit toggle
        elements.autoLimitToggle.onclick = function() {
            config.autoLimitEnabled = !config.autoLimitEnabled;
            this.classList.toggle('active');
            
            if (!config.autoLimitEnabled && elements.audioElement) {
                elements.audioElement.volume = volumeBeforeLimit;
                elements.masterVolume.value = volumeBeforeLimit * 100;
                elements.masterVolume.nextElementSibling.textContent = Math.round(volumeBeforeLimit * 100) + '%';
            } else if (config.autoLimitEnabled && currentSpeaker) {
                applyUserVolume();
            }
            
            updateStatus();
            updateMinimizedDisplay();
        };
        
        // Preset buttons
        document.querySelectorAll('.preset-button').forEach(button => {
            button.onclick = function() {
                const presetValue = parseInt(this.dataset.preset) / 100;
                
                document.querySelectorAll('.user-volume-slider').forEach(slider => {
                    slider.value = this.dataset.preset;
                    slider.nextElementSibling.textContent = this.dataset.preset + '%';
                    const userName = slider.dataset.user;
                    config.userVolumes[userName] = presetValue;
                });
                
                if (config.autoLimitEnabled && currentSpeaker) {
                    applyUserVolume();
                }
            };
        });
        
        // Double-click header to minimize
        document.querySelector('.main-header').ondblclick = function(e) {
            if (e.target.classList.contains('header-button')) return;
            elements.minimizeBtn.click();
        };
    };
    
    // Drag functionality
    const initializeDragFunctionality = () => {
        let isDragging = false;
        let currentX, currentY, initialX, initialY, xOffset = 0, yOffset = 0;
        
        const header = document.querySelector('.main-header');
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
            mainInterface.style.transform = `translate(${currentX}px, ${currentY}px)`;
        }
        
        function dragEnd() {
            initialX = currentX;
            initialY = currentY;
            isDragging = false;
        }
    };
    
    // Initialize everything
    initializeTabs();
    initializeEventHandlers();
    initializeThemeButtons();
    initializeDragFunctionality();
    
    // Start intervals
    updateUserList();
    detectSpeaker();
    updateMinimizedDisplay();
    updateStatus();
    
    window.bbbVolumeInterval = setInterval(updateUserList, 3000);
    window.bbbSpeakerInterval = setInterval(detectSpeaker, 100);
    checkInterval = setInterval(handleDialog, 500);
    
    // Extension Message Listener
    chrome.runtime.onMessage?.addListener((request, sender, sendResponse) => {
        if (request.action === 'toggle') {
            config.dialogEnabled = !config.dialogEnabled;
            elements.dialogToggle.classList.toggle('active', config.dialogEnabled);
            updateStatus();
            sendResponse({status: config.dialogEnabled ? 'started' : 'stopped'});
        }
        
        if (request.action === 'status') {
            sendResponse({
                active: config.dialogEnabled,
                dialogFound: dialogFound,
                pluginEnabled: config.pluginEnabled
            });
        }
        
        if (request.action === 'toggleMaster') {
            togglePlugin();
            sendResponse({enabled: config.pluginEnabled});
        }
        
        if (request.action === 'openVolume') {
            // Switch to volume tab and ensure interface is visible
            config.isMinimized = false;
            mainInterface.classList.remove('minimized');
            elements.minimizeBtn.textContent = '−';
            elements.minimizeBtn.title = 'Minimieren';
            
            // Switch to volume tab
            document.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            document.querySelector('.tab-button[data-tab="volume"]').classList.add('active');
            document.getElementById('volume-tab').classList.add('active');
            
            sendResponse({status: 'opened'});
        }
        
        if (request.action === 'openTheme') {
            // Switch to theme tab and ensure interface is visible
            config.isMinimized = false;
            mainInterface.classList.remove('minimized');
            elements.minimizeBtn.textContent = '−';
            elements.minimizeBtn.title = 'Minimieren';
            
            // Switch to theme tab
            document.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            document.querySelector('.tab-button[data-tab="theme"]').classList.add('active');
            document.getElementById('theme-tab').classList.add('active');
            
            sendResponse({status: 'opened'});
        }
        
        if (request.action === 'setTheme') {
            applyTheme(request.theme);
            sendResponse({status: 'applied'});
        }
        
        if (request.action === 'reset') {
            // Reset all configurations
            config.pluginEnabled = true;
            config.dialogEnabled = true;
            config.userVolumes = {};
            config.autoLimitEnabled = true; // Default: aktiviert
            config.currentTheme = 'default';
            config.themeBeforeDisable = 'default';
            config.isMinimized = false;
            
            // Apply default theme
            applyTheme('default');
            
            // Reset UI
            elements.masterToggleBtn.classList.add('active');
            elements.masterToggleBtn.textContent = '⚡';
            elements.masterToggleBtn.title = 'Plugin deaktivieren';
            elements.dialogToggle.classList.add('active');
            elements.autoLimitToggle.classList.add('active'); // Default: aktiviert
            mainInterface.classList.remove('minimized');
            mainInterface.classList.remove('disabled');
            
            // Reset volume
            if (elements.audioElement) {
                elements.audioElement.volume = 1.0;
                elements.masterVolume.value = 100;
                elements.masterVolume.nextElementSibling.textContent = '100%';
            }
            
            updateStatus();
            updateMinimizedDisplay();
            sendResponse({status: 'reset'});
        }
    });
    
    // Cleanup bei Seiten-Unload
    window.addEventListener('beforeunload', () => {
        if (checkInterval) clearInterval(checkInterval);
        if (window.bbbVolumeInterval) clearInterval(window.bbbVolumeInterval);
        if (window.bbbSpeakerInterval) clearInterval(window.bbbSpeakerInterval);
    });
    
    console.log('BBB Enhanced Extension geladen mit allen Features');
})();