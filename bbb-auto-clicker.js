// BigBlueButton Auto-Dialog Handler
(function() {
    'use strict';
    
    // Erstelle Status-Interface
    const createStatusUI = () => {
        const container = document.createElement('div');
        container.id = 'bbb-auto-dialog-status';
        container.style.cssText = `
            position: fixed;
            bottom: 10px;
            right: 80px;
            background: #2C2E3B;
            color: #ffffff;
            padding: 12px 18px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
            font-size: 14px;
            z-index: 999999;
            display: flex;
            align-items: center;
            gap: 12px;
            transition: all 0.3s ease;
        `;
        
        const icon = document.createElement('div');
        icon.style.cssText = `
            width: 8px;
            height: 8px;
            background: #4CAF50;
            border-radius: 50%;
            animation: pulse 2s infinite;
        `;
        
        const text = document.createElement('span');
        text.textContent = 'Warte auf Dialog...';
        text.style.cssText = `
            font-weight: 500;
            letter-spacing: 0.5px;
        `;
        
        const counter = document.createElement('span');
        counter.id = 'bbb-counter';
        counter.style.cssText = `
            margin-left: 8px;
            font-size: 12px;
            opacity: 0.8;
            font-weight: 400;
        `;
        
        // CSS Animation für Pulse-Effekt
        const style = document.createElement('style');
        style.textContent = `
            @keyframes pulse {
                0% { opacity: 1; transform: scale(1); }
                50% { opacity: 0.7; transform: scale(1.2); }
                100% { opacity: 1; transform: scale(1); }
            }
        `;
        document.head.appendChild(style);
        
        container.appendChild(icon);
        container.appendChild(text);
        container.appendChild(counter);
        document.body.appendChild(container);
        
        return { container, icon, text, counter };
    };
    
    // Akustisches Signal beim Start
    const playStartSound = () => {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 880; // A5 Note
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.2);
    };
    
    const ui = createStatusUI();
    playStartSound(); // Spiele Sound ab
    let checkInterval;
    let dialogFound = false;
    
    // Funktion zum Aktualisieren des Status
    const updateStatus = (message, color = '#4CAF50') => {
        ui.text.textContent = message;
        ui.icon.style.background = color;
    };
    
    // Funktion zum Finden und Klicken des OK-Buttons
    const handleDialog = () => {
        // Verschiedene Selektoren für BigBlueButton Dialoge
        const dialogSelectors = [
            '[role="dialog"]',
            '.modal',
            '.ReactModal__Content',
            '[aria-modal="true"]',
            '.portal--modal'
        ];
        
        const buttonSelectors = [
            'button:contains("OK")',
            'button:contains("Ok")',
            'button:contains("Okay")',
            'button:contains("Prüfen")',
            'button[aria-label*="OK"]',
            'button[aria-label*="Ok"]',
            'button[aria-label*="Prüfen"]',
            '.modal button.primary',
            '.modal button[type="submit"]',
            '[role="dialog"] button[type="button"]',
            '.ReactModal__Content button[role="button"]'
        ];
        
        // Suche nach Dialog
        let dialog = null;
        for (const selector of dialogSelectors) {
            dialog = document.querySelector(selector);
            if (dialog && dialog.offsetParent !== null) break;
        }
        
        if (dialog && !dialogFound) {
            dialogFound = true;
            updateStatus('Dialog gefunden! Warte 10 Sekunden...', '#FF9800');
            
            // Spiele Warnsignal
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            // Zwei-Ton-Signal
            oscillator.frequency.setValueAtTime(660, audioContext.currentTime); // E5
            oscillator.frequency.setValueAtTime(880, audioContext.currentTime + 0.1); // A5
            oscillator.type = 'sine';
            gainNode.gain.setValueAtTime(0.4, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
            
            // Nach 2 Sekunden: 3x Sound spielen
            setTimeout(() => {
                let soundCount = 0;
                const playTripleSound = () => {
                    if (soundCount < 3) {
                        const ctx = new (window.AudioContext || window.webkitAudioContext)();
                        const osc = ctx.createOscillator();
                        const gain = ctx.createGain();
                        
                        osc.connect(gain);
                        gain.connect(ctx.destination);
                        
                        osc.frequency.value = 1000; // Höherer Ton für Alarm
                        osc.type = 'sine';
                        gain.gain.setValueAtTime(0.5, ctx.currentTime);
                        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
                        
                        osc.start(ctx.currentTime);
                        osc.stop(ctx.currentTime + 0.15);
                        
                        soundCount++;
                        setTimeout(playTripleSound, 250); // 250ms Pause zwischen Tönen
                    }
                };
                playTripleSound();
            }, 2000);
            
            let countdown = 10;
            ui.counter.textContent = `(${countdown}s)`;
            
            const countdownInterval = setInterval(() => {
                countdown--;
                ui.counter.textContent = `(${countdown}s)`;
                
                if (countdown <= 0) {
                    clearInterval(countdownInterval);
                    
                    // Suche OK-Button
                    let okButton = null;
                    
                    // Versuche verschiedene Methoden
                    for (const selector of buttonSelectors) {
                        // jQuery-ähnliche :contains Funktionalität
                        const buttons = dialog.querySelectorAll('button');
                        for (const btn of buttons) {
                            if (btn.textContent.toLowerCase().includes('ok') ||
                                btn.textContent.toLowerCase().includes('okay') ||
                                btn.textContent.toLowerCase().includes('prüfen')) {
                                okButton = btn;
                                break;
                            }
                        }
                        if (okButton) break;
                        
                        // Direkte Selector-Suche
                        okButton = dialog.querySelector(selector);
                        if (okButton) break;
                        
                        // Spezifische Suche für Prüfen-Button
                        okButton = dialog.querySelector('button[aria-label="Prüfen"]');
                        if (okButton) break;
                    }
                    
                    if (okButton && !okButton.disabled) {
                        const buttonText = okButton.textContent.trim();
                        okButton.click();
                        updateStatus(`"${buttonText}" geklickt!`, '#4CAF50');
                        ui.counter.textContent = '✓';
                        
                        // Reset nach 3 Sekunden
                        setTimeout(() => {
                            dialogFound = false;
                            updateStatus('Warte auf Dialog...', '#4CAF50');
                            ui.counter.textContent = '';
                        }, 3000);
                    } else {
                        updateStatus('Button nicht gefunden!', '#f44336');
                        ui.counter.textContent = '✗';
                        dialogFound = false;
                    }
                }
            }, 1000);
        }
    };
    
    // Starte Überwachung
    checkInterval = setInterval(handleDialog, 500);
    
    // Cleanup-Funktion
    window.stopBBBAutoDialog = () => {
        clearInterval(checkInterval);
        ui.container.remove();
        console.log('BigBlueButton Auto-Dialog Handler gestoppt');
    };
    
    console.log('BigBlueButton Auto-Dialog Handler gestartet');
    console.log('Zum Stoppen: stopBBBAutoDialog()');
})();