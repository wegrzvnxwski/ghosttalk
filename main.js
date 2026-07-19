let teksty = []
let tekstyKtoreJuzByly = [];
// let aktualneAudio = null; // do dodania, gdy audio już przyjdzie

async function zaladujDuchy() {
    try {
        const response = await fetch('texts.json');
        teksty = await response.json();
    } catch (error) {
        document.getElementById('obecnyTekst').innerText = ("Duchy uciekły, skontaktuj się z administratorem");
        console.error('Błąd JSON:', error);
    }
}

zaladujDuchy();

function duchy(){

    if (teksty.length === 0) {
        document.getElementById('obecnyTekst').innerText = "Trwa łączenie z zaświatami...";
        return;
    }

    //if (aktualneAudio && !aktualneAudio.paused) {
        //return; 
    //}

    const toNaPewnoDuch = teksty[Math.floor(Math.random() * teksty.length)];

    const boxObecny = document.getElementById('obecnyTekst');
    boxObecny.innerText = toNaPewnoDuch.text;

    //aktualneAudio.onended = function() {
        //boxObecny.innerText = "";

        //tekstyKtoreJuzByly.unshift(toNaPewnoDuch.text);
        //if (tekstyKtoreJuzByly.length > 15) {
            //tekstyKtoreJuzByly.pop(); 
        //}
        document.getElementById('tekstyByle').innerHTML = tekstyKtoreJuzByly.join("<br>");

    const tts = new Audio(teksty.audio);
    tts.play();

    tekstyKtoreJuzByly.unshift(toNaPewnoDuch.text);

    if (tekstyKtoreJuzByly.length > 15) {
        tekstyKtoreJuzByly.pop(); 
    }

    document.getElementById('tekstyByle').innerHTML = tekstyKtoreJuzByly.join("<br>");

    document.getElementById('przycisk').innerText = "Restart";
}

setInterval(() => {
    duchy()
}, Math.random() * 10000 + 5000);