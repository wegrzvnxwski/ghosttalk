// KOD ROBOCZY, WYGENEROWANY PRZEZ AI W CELU AUTOMATYZACJI TWORZENIA PRÓBEK DŹWIĘKOWYCH

const fs = require('fs');
const path = require('path');
const googleTTS = require('google-tts-api');

// Konfiguracja
const PLIK_WEJSCIOWY = './texts.json';
const PLIK_WYJSCIOWY = './texts.json';
const FOLDER_AUDIO = './sounds';

// Tworzymy folder 'sounds', jeśli nie istnieje
if (!fs.existsSync(FOLDER_AUDIO)) {
    fs.mkdirSync(FOLDER_AUDIO);
}

// Prosta funkcja do tworzenia czystych nazw plików (slug)
function createSlug(text) {
    return text.toLowerCase()
               .replace(/[^\w\s-]/g, '') // Usuwa znaki specjalne
               .replace(/[\s-]+/g, '_')  // Spacje na podłogi
               .substring(0, 20);        // Ucinamy długie nazwy
}

// Wczytujemy JSON-a
let duchy = [];
try {
    const rawData = fs.readFileSync(PLIK_WEJSCIOWY, 'utf-8');
    duchy = JSON.parse(rawData);
} catch (err) {
    console.error("❌ Błąd wczytywania pliku JSON. Upewnij się, że plik nazywa się 'duchy.json'.");
    process.exit(1);
}

// Główna funkcja asynchroniczna
async function processGhosts() {
    console.log(`👻 Znalazłem ${duchy.length} dusz. Wzywam je do mikrofonu...\n`);

    for (let i = 0; i < duchy.length; i++) {
        const duch = duchy[i];
        const tekst = duch.text;
        
        // Zabezpieczenie przed pustymi tekstami
        if (!tekst) continue;

        // Budujemy nazwę pliku (np. "001_zimno_mi.mp3")
        const fileName = `${String(i + 1).padStart(3, '0')}_${createSlug(tekst)}.mp3`;
        const filePath = path.join(FOLDER_AUDIO, fileName);

        // Zapisujemy ścieżkę do obiektu, bez względu na to, czy plik już tam był
        duch.audio = `sounds/${fileName}`;

        // Jeśli plik już istnieje, nie tracimy czasu na ponowne pobieranie
        if (fs.existsSync(filePath)) {
            continue;
        }

        console.log(`[${i + 1}/${duchy.length}] Nagrywanie: "${tekst}"`);

        try {
            // Strzał do API Google TTS (język polski, powolne tempo żeby było creepy)
            const url = googleTTS.getAudioUrl(tekst, {
                lang: 'pl',
                host: 'https://translate.google.com',
            });

            // Pobieramy i zapisujemy plik binarnie
            const response = await fetch(url);
            const buffer = await response.arrayBuffer();
            fs.writeFileSync(filePath, Buffer.from(buffer));

            // Małe opóźnienie (throttle), żeby Google nie dało nam bana za spam requestami
            await new Promise(resolve => setTimeout(resolve, 500)); 

        } catch (err) {
            console.error(`❌ Błąd przy generowaniu "${tekst}":`, err.message);
        }
    }

    // Zapisujemy zaktualizowanego JSON-a
    fs.writeFileSync(PLIK_WYJSCIOWY, JSON.stringify(duchy, null, 4), 'utf-8');
    console.log(`\n✅ Koniec rytuału. Gotowy plik znajdziesz w '${PLIK_WYJSCIOWY}'.`);
}

processGhosts();