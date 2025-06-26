# BigBlueButton Erweiterungsskripte

## Übersicht

Dieses Repository enthält eine Chrome-Extension und mehrere JavaScript-Userskripte, die die Funktionalität der BigBlueButton (BBB) Videokonferenzplattform erweitern. Die Tools bieten automatisierte Dialogverarbeitung, erweiterte Lautstärkeregelungsfunktionen und Theme-Anpassungen, um die Benutzererfahrung während Online-Meetings zu verbessern.

---

## Chrome Extension

### **big-blue-boogie-plugin/**

Eine Chrome-Extension, die alle Funktionen der einzelnen Skripte in einer benutzerfreundlichen Oberfläche vereint:

**Features:**
- ⚡ Master-Toggle zum Aktivieren/Deaktivieren des gesamten Plugins
- 🤖 Auto-Dialog Handler mit 5-Sekunden Countdown und Audio-Feedback
- 🔊 Individuelle Lautstärkeregelung für jeden Teilnehmer
- 🎨 Theme-Switcher mit vier verschiedenen Designs
- 📱 Tabbed Interface mit Drag & Drop Funktionalität

**Installation:**
1. Chrome Extensions öffnen: `chrome://extensions/`
2. Developer Mode aktivieren
3. Ordner `big-blue-boogie-plugin` per Drag & Drop hinzufügen

Weitere Details finden Sie in der [Extension-README](big-blue-boogie-plugin/README.md).

---

## Standalone-Skripte

### 1. **bbb-auto-clicker.js**

**Zweck:**
Erkennt und verarbeitet Dialogfelder in BigBlueButton automatisch, indem OK/Bestätigen-Buttons nach einem 10-Sekunden-Countdown geklickt werden. Bestätigt außerdem die Anwesenheit automatisch, sobald ein entsprechender Dialog erscheint.

**Funktionen:**

* Status-Benutzeroberfläche mit visueller Rückmeldung und Countdown-Timer
* Audiosignale beim Start und bei Erkennung von Dialogen
* Unterstützung verschiedener Dialogtypen und Button-Varianten
* Skript stoppbar via `stopBBBAutoDialog()` in der Konsole

**Verwendung:**

```text
1. Öffne die Browser-Entwicklerkonsole (F12 oder Rechtsklick → "Untersuchen" → "Konsole").
2. Kopiere den gesamten Inhalt von bbb-auto-clicker.js.
3. Füge den Code in die Konsole ein und drücke Enter.
4. Das Skript startet automatisch und zeigt die Status-UI an.
```

---

### 2. **bbb-theme-switcher.js**

**Zweck:**
Bietet verschiedene visuelle Themes für BigBlueButton-Meetings.

**Funktionen:**

* Vier verschiedene Themes: Standard, Hell, Hacker (Matrix-Style), Schreibmaschine
* Verschiebbare Benutzeroberfläche mit Theme-Auswahl
* Speichert die Theme-Auswahl automatisch
* Sofortige Anwendung der Theme-Änderungen

**Verwendung:**

```text
1. Öffne die Browser-Entwicklerkonsole (F12 oder Rechtsklick → "Untersuchen" → "Konsole").
2. Kopiere den gesamten Inhalt von bbb-theme-switcher.js.
3. Füge den Code in die Konsole ein und drücke Enter.
4. Die Theme-Auswahl erscheint unten rechts auf der BBB-Seite.
```

---

### 3. **bbb-volume-minimizable.js**

**Zweck:**
Bietet individuelle Lautstärkeregelung für jeden Benutzer in BBB-Meetings mit minimierbarer Oberfläche.

**Funktionen:**

* Verschiebbare und minimierbare Benutzeroberfläche
* Individuelle Lautstärkeregler pro Benutzer
* Voreinstellungsbuttons (50%, 75%, 100%)
* Echtzeit-Sprecherekennung und -anzeige
* Reset-Buttons für individuelle Lautstärken
* Kompakte Ansicht im minimierten Zustand

**Verwendung:**

```text
1. Öffne die Browser-Entwicklerkonsole (F12 oder Rechtsklick → "Untersuchen" → "Konsole").
2. Kopiere den gesamten Inhalt von bbb-volume-minimizable.js.
3. Füge den Code in die Konsole ein und drücke Enter.
4. Die Benutzeroberfläche erscheint unten rechts auf der BBB-Seite.
```

---

### 4. **bbb-limit-user-vol-final.js** *(veraltet)*

**Zweck:**
Ermöglicht die selektive Lautstärkebegrenzung für bestimmte Benutzer in BBB-Meetings.

**Funktionen:**

* Verschiebbare Benutzeroberfläche mit Hauptlautstärkeregelung
* Auto-Limit-Schalter, um Lautstärke für ausgewählte Benutzer zu reduzieren
* Echtzeit-Sprecherekennung und -anzeige
* Benutzerliste mit Kontrollkästchen zur Markierung
* Konfigurierbares Limit-Lautstärkelevel

**Verwendung:**

```text
1. Öffne die Browser-Entwicklerkonsole (F12 oder Rechtsklick → "Untersuchen" → "Konsole").
2. Kopiere den gesamten Inhalt von bbb-limit-user-vol-final.js.
3. Füge den Code in die Konsole ein und drücke Enter.
4. Die Benutzeroberfläche erscheint unten rechts auf der BBB-Seite.
```

---

## Anforderungen

* Moderner Webbrowser (Chrome, Firefox, Edge, etc.)
* BigBlueButton-Meeting-Umgebung
* JavaScript aktiviert

---

## Lizenz

Dieses Projekt ist unter der MIT-Lizenz lizenziert:

> MIT License
>
> Copyright (c) 2025 Martin Pfeffer
>
> Hiermit wird jeder Person, die eine Kopie dieser Software und der zugehörigen
> Dokumentationsdateien (die "Software") erhält, die Erlaubnis erteilt, die Software
> ohne Einschränkung zu nutzen, zu kopieren, zu modifizieren, zusammenzuführen, zu
> veröffentlichen, zu verteilen, zu unterlizenzieren und/oder zu verkaufen, und
> Personen, denen die Software zur Verfügung gestellt wird, diese Rechte zu
> gewähren, vorbehaltlich der folgenden Bedingungen:
>
> Der obige Urheberrechtshinweis und dieser Genehmigungshinweis müssen in allen
> Kopien oder wesentlichen Teilen der Software enthalten sein.
>
> DIE SOFTWARE WIRD "WIE BESEHEN" BEREITGESTELLT, OHNE JEGLICHE GEWÄHRLEISTUNG,
> AUSDRÜCKLICH ODER STILLSCHWEIGEND, EINSCHLIESSLICH, ABER NICHT BESCHRÄNKT AUF
> DIE GEWÄHRLEISTUNG DER MARKTGÄNGIGKEIT, EIGNUNG FÜR EINEN BESTIMMTEN ZWECK UND
> NICHTVERLETZUNG. IN KEINEM FALL SIND DIE AUTOREN ODER URHEBERRECHTSINHABER
> HAFTBAR FÜR JEGLICHE ANSPRÜCHE, SCHÄDEN ODER ANDERE VERPFLICHTUNGEN, OB IN
> EINER VERTRAGSSACHE, DELIKT ODER ANDERWEITIG, DIE AUS DER SOFTWARE ODER DER
> NUTZUNG ODER ANDEREN UMGANG MIT DER SOFTWARE ENTSTEHEN.

---

## Hinweise

* Diese Skripte interagieren direkt mit der DOM-Struktur von BigBlueButton und benötigen
  möglicherweise Updates, wenn sich das BBB-Frontend wesentlich ändert.
* Verwende die Skripte verantwortungsvoll und stelle sicher, dass sie den Richtlinien deiner
  Organisation für Browser-Scripts in Meeting-Umgebungen entsprechen.
