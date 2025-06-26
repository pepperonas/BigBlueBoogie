# BBB Enhanced Control - Chrome Extension

🎛️ **Chrome Extension für BigBlueButton** mit Auto-Dialog-Handling, individueller Lautstärke-Kontrolle und Theme-Switching.

## ✨ Features

### ⚡ Master-Kontrolle
- **Ein-Klick Plugin Toggle** - Komplettes Plugin aktivieren/deaktivieren
- **Intelligente Ressourcen-Verwaltung** - Stoppt Background-Prozesse bei Deaktivierung
- **Smart Theme-Management** - Automatischer Wechsel zu Standard-Theme bei Deaktivierung

### 🤖 Auto-Dialog Handler
- **Automatische Dialog-Erkennung** - Erkennt BBB-Dialoge automatisch
- **5-Sekunden Countdown** - Wartezeit vor automatischem Klick
- **Audio-Feedback** - Start-Melodie, Dialog-Alarm, Erfolgs-Akkord
- **Toggle-Steuerung** - Ein/Aus über Popup oder Interface

### 🔊 Lautstärke-Kontrolle
- **Master-Lautstärke** - Globale Lautstärke-Kontrolle
- **Individuelle Nutzer-Lautstärken** - Separate Lautstärke pro Teilnehmer (standardmäßig aktiviert)
- **Live Sprecher-Erkennung** - Zeigt aktuell sprechende Person
- **Preset-Buttons** - Schnelle Einstellung (50%, 75%, 100%)
- **Per-User Reset** - Individuelle Zurücksetzung

### 🎨 Theme-Switcher
- **Standard** - Originales BBB-Design
- **Hell** - Heller Modus mit weißem Hintergrund
- **Hacker** - Grüner Matrix-Style mit Monospace-Font
- **Schreibmaschine** - Retro Typewriter-Look
- **Quick-Switch** - Direkte Theme-Auswahl über Popup

### 🎛️ Interface
- **Tabbed Navigation** - Dialog, Lautstärke, Themes
- **Drag & Drop** - Verschiebbare Oberfläche
- **Minimierbar** - Kompakte Ansicht mit Status-Info
- **Moderne UI** - Glassmorphism-Design mit Animationen

## 📦 Installation

### Google Chrome Extension installieren:

1. **Chrome öffnen** und zu **Extensions** navigieren:
   ```
   chrome://extensions/
   ```

2. **Developer Mode aktivieren:**
   - Toggle "Developer mode" oben rechts anklicken ✅

3. **Extension laden:**
   - Ordner `big-blue-boogie-plugin` mit **Drag & Drop** in das Chrome-Fenster ziehen
   - Alternativ: "Load unpacked" klicken → Ordner auswählen

4. **Fertig!**
   - 🎛️ BBB Enhanced Control Icon erscheint in der Chrome-Toolbar
   - Auf BigBlueButton-Seite testen

## 🎯 Verwendung

### Popup-Interface (Extension-Icon klicken):
- ⚡ **Master-Toggle** - Plugin komplett ein/aus
- 🤖 **Dialog Handler** - Auto-Klick aktivieren/deaktivieren
- 🔊 **Lautstärke öffnen** - Volume-Tab anzeigen
- 🎨 **Theme öffnen** - Theme-Tab anzeigen
- 🎨 **Quick-Themes** - Farbdots für direkten Theme-Wechsel
- 🔄 **Reload** / 🗑️ **Reset** - Seite neu laden oder zurücksetzen

### Hauptinterface (BBB-Seite):
Das Interface erscheint automatisch unten rechts mit drei Tabs:

- **🤖 Auto-Dialog Tab** - Status, Countdown, Toggle-Schalter
- **🔊 Lautstärke Tab** - Master-Slider, Sprecher-Anzeige, Teilnehmer-Liste
- **🎨 Theme Tab** - Theme-Auswahl Buttons

### Interface-Steuerung:
- **⚡/💤** Master-Toggle - Plugin aktivieren/pausieren
- **−/+** Minimieren/Maximieren (oder Doppelklick auf Header)
- **✕** Schließen
- **Header ziehen** - Interface verschieben

## 🔧 Technische Details

**Kompatibilität:**
- Chrome 88+, Chromium, Edge, Brave, Opera
- BigBlueButton alle Versionen (HTML5 Client)

**Performance:**
- <5MB RAM Verbrauch
- <1% CPU-Last im Hintergrund
- Intelligente Interval-Verwaltung

**Sicherheit:**
- Keine Netzwerk-Requests
- Lokale Datenspeicherung
- Sandbox-Execution

## 🐛 Problembehebung

**Extension lädt nicht:**
- Developer Mode aktiviert?
- Ordner komplett in Chrome gezogen?
- Console-Fehler prüfen (F12)

**Dialoge nicht erkannt:**
- BBB vollständig laden lassen
- Master-Toggle ⚡ aktiviert?
- Audio-Signale hörbar?

**Lautstärke funktioniert nicht:**
- Audio-Element vorhanden?
- Individual-Toggle aktiviert?
- Browser-Audio nicht stumm?

## 📝 Changelog

**v2.1 - Master Control:**
- ⚡ Master-Toggle Button hinzugefügt
- 💤 Intelligente Ressourcen-Verwaltung
- 🎨 Smart Theme-Management bei Plugin-Deaktivierung
- 🔊 Individuelle Lautstärke standardmäßig aktiviert

**v2.0 - Enhanced Control:**
- 📱 Tabbed Interface
- 🖱️ Drag & Drop Interface
- 🎨 Popup Redesign
- 🔄 Reset-Funktionalität

**v1.0 - Individual Features:**
- 🤖 Auto-Dialog Handler
- 🔊 Individual Volume Control
- 🎨 Theme Switcher

## 📄 Lizenz

MIT License

Copyright (c) 2025 Martin Pfeffer

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---

**Made with ❤️ by Martin Pfeffer - 2025**