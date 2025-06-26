// BBB Theme Switcher Overlay
(function() {
    'use strict';
    
    // Entferne existierendes Overlay falls vorhanden
    const existingOverlay = document.getElementById('bbb-theme-overlay');
    if (existingOverlay) {
        existingOverlay.remove();
    }
    
    // CSS Styles für Themes
    const themes = {
        light: {
            name: 'Light',
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
            name: 'Typewriter',
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
    
    // Erstelle Overlay Container
    const overlay = document.createElement('div');
    overlay.id = 'bbb-theme-overlay';
    overlay.innerHTML = `
        <div style="
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(145deg, #2C2E3B, #1e2027);
            border-radius: 12px;
            padding: 20px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.3);
            z-index: 10000;
            font-family: 'Roboto', sans-serif;
            min-width: 250px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.1);
        ">
            <div style="
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 16px;
            ">
                <h3 style="
                    margin: 0;
                    color: #ffffff;
                    font-size: 16px;
                    font-weight: 500;
                ">BBB Theme Switcher</h3>
                <button id="close-overlay" style="
                    background: none;
                    border: none;
                    color: #ffffff;
                    font-size: 18px;
                    cursor: pointer;
                    padding: 4px;
                    border-radius: 4px;
                    transition: background-color 0.2s;
                " onmouseover="this.style.backgroundColor='rgba(255,255,255,0.1)'" 
                   onmouseout="this.style.backgroundColor='transparent'">×</button>
            </div>
            <div id="theme-buttons"></div>
        </div>
    `;
    
    document.body.appendChild(overlay);
    
    // Erstelle Theme Buttons
    const buttonContainer = document.getElementById('theme-buttons');
    Object.keys(themes).forEach(themeKey => {
        const button = document.createElement('button');
        button.textContent = themes[themeKey].name;
        button.style.cssText = `
            display: block;
            width: 100%;
            margin-bottom: 8px;
            padding: 12px 16px;
            background: linear-gradient(145deg, #3d4049, #2a2c34);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 8px;
            color: #ffffff;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.2s ease;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        `;
        
        // Hover-Effekt
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-2px)';
            button.style.boxShadow = '0 4px 16px rgba(0,0,0,0.3)';
            button.style.background = 'linear-gradient(145deg, #4a4c56, #363841)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0)';
            button.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
            button.style.background = 'linear-gradient(145deg, #3d4049, #2a2c34)';
        });
        
        // Theme anwenden
        button.addEventListener('click', () => {
            applyTheme(themeKey);
        });
        
        buttonContainer.appendChild(button);
    });
    
    // Schließen Button
    document.getElementById('close-overlay').addEventListener('click', () => {
        overlay.remove();
    });
    
    // Theme anwenden Funktion
    function applyTheme(themeKey) {
        // Entferne vorherige Theme Styles
        const existingStyle = document.getElementById('bbb-custom-theme');
        if (existingStyle) {
            existingStyle.remove();
        }
        
        // Erstelle neuen Style
        const style = document.createElement('style');
        style.id = 'bbb-custom-theme';
        style.textContent = themes[themeKey].css;
        document.head.appendChild(style);
        
        // Feedback
        showNotification(`${themes[themeKey].name} Theme aktiviert!`);
        
        console.log(`BBB Theme geändert zu: ${themes[themeKey].name}`);
    }
    
    // Notification Funktion
    function showNotification(message) {
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
            z-index: 10001;
            font-family: 'Roboto', sans-serif;
            font-size: 14px;
            border: 1px solid rgba(255,255,255,0.1);
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Fade in
        setTimeout(() => {
            notification.style.opacity = '1';
        }, 10);
        
        // Auto remove
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 2000);
    }
    
    console.log('BBB Theme Switcher geladen! Overlay oben rechts verfügbar.');
})();