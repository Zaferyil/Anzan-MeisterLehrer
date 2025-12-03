# 🧮 ANZAN MEISTER - Mentale Arithmetik

Eine Progressive Web App (PWA) für mentales Rechentraining, speziell entwickelt für Lehrer und Schüler.

## ✨ Features

- **4 Rechenarten**: Addition, Subtraktion, Multiplikation, Division
- **Flexible Geschwindigkeit**: Von langsam (4s) bis Meister (0.4s)
- **Anpassbare Schwierigkeitsgrade**: Verschiedene Zahlenbereiche und Aufgabenzahlen
- **Eigene Aufgaben**: Erstelle und speichere deine eigenen Rechenaufgaben
- **Offline-Funktionalität**: Funktioniert ohne Internetverbindung (PWA)
- **Responsive Design**: Funktioniert auf allen Geräten (Desktop, Tablet, Smartphone)
- **Sound-Feedback**: Akustische Rückmeldung für besseres Lernerlebnis
- **Countdown & Animationen**: Motivierende visuelle Effekte

## 🚀 Live Demo

Die App kann auf folgenden Plattformen gehostet werden:
- **Vercel**: Kostenlos, einfach, schnell
- **Netlify**: Kostenlos mit Continuous Deployment
- **GitHub Pages**: Kostenlos für öffentliche Repositories
- **Firebase Hosting**: Kostenlos für kleine Projekte

## 📦 Installation & Deployment

### Option 1: Vercel (Empfohlen)

1. Gehe zu [vercel.com](https://vercel.com)
2. Verbinde dein GitHub Repository
3. Deploy mit einem Klick
4. URL erhalten und teilen!

### Option 2: Netlify

1. Gehe zu [netlify.com](https://netlify.com)
2. "New site from Git" auswählen
3. Repository verbinden
4. Deploy!

### Option 3: GitHub Pages

1. Repository Settings öffnen
2. Pages aktivieren
3. Branch auswählen (main)
4. Speichern

### Option 4: Lokal testen

```bash
# Mit Python 3
python -m http.server 8000

# Oder mit Node.js (npx http-server)
npx http-server

# Dann öffne: http://localhost:8000
```

## 📱 PWA Installation

Die App kann als PWA auf jedem Gerät installiert werden:

1. Öffne die App im Browser
2. Klicke auf "Installieren" im Popup oder
3. Browser-Menü → "Zu Startbildschirm hinzufügen"

## 🎯 Verwendung

### Für Lehrer

1. **Einstellungen anpassen**: Wähle Rechenart, Geschwindigkeit und Schwierigkeitsgrad
2. **Eigene Aufgaben erstellen**: Nutze "Meine Aufgaben" für spezifische Übungen
3. **Im Unterricht verwenden**: Projiziere die App für die ganze Klasse

### Für Schüler

1. **Training starten**: Wähle dein Level und starte das Spiel
2. **Mentales Rechnen üben**: Merke dir die Zahlen und berechne das Ergebnis
3. **Fortschritt verfolgen**: Steigere dich von "Langsam" bis "Meister"

## 🛠️ Technologie-Stack

- **HTML5**: Strukturierung
- **CSS3**: Styling mit Glassmorphism-Design
- **Vanilla JavaScript**: Keine Abhängigkeiten!
- **Service Worker**: Offline-Funktionalität
- **Web Audio API**: Sound-Effekte
- **LocalStorage**: Speicherung von Einstellungen und Aufgaben

## 📂 Dateistruktur

```
anzan-meister/
├── index.html          # Haupt-HTML-Datei
├── app.js             # JavaScript-Logik
├── manifest.json      # PWA-Manifest
├── sw.js              # Service Worker
├── icon-192.png       # App-Icon (192x192)
├── icon-512.png       # App-Icon (512x512)
└── README.md          # Diese Datei
```

## 🎨 Anpassung

### Farben ändern

Die Hauptfarben sind im CSS definiert:
- Primär-Gradient: `#667eea → #764ba2 → #f093fb`
- Akzent-Farben: Gelb für Tasten, Grün für Erfolg

### Sounds anpassen

Die Sounds werden mit der Web Audio API generiert und können in `app.js` angepasst werden:
- `playBeep()`: Zahlen-Anzeige-Sound
- `playSuccessSound()`: Erfolgs-Melodie

## 🔒 Datenschutz

- Alle Daten werden lokal im Browser gespeichert
- Keine Server-Kommunikation
- Keine Cookies
- Keine Tracking-Tools

## 🤝 Beitragen

Verbesserungsvorschläge und Pull Requests sind willkommen!

## 📄 Lizenz

MIT License - Frei verwendbar für Bildungszwecke

## 👨‍💻 Entwickler

Entwickelt für den Einsatz im Unterricht und zum selbstständigen Üben.

## 📞 Support

Bei Fragen oder Problemen erstelle ein Issue auf GitHub.

---

**Viel Erfolg beim mentalen Rechentraining! 🧮✨**
