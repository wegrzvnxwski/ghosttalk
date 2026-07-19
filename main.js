let teksty = []
let tekstyKtoreJuzByly = [];
let aktualneAudio = null;
let duchyTimeout = null;
let isAutoMode = false;

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

function duchyBtn(){
    tekstyKtoreJuzByly = [];
    document.getElementById('tekstyByle').innerHTML = "";
    
    if (aktualneAudio && !aktualneAudio.paused){
        aktualneAudio.pause();
        aktualneAudio.currentTime = 0;
        document.getElementById('obecnyTekst').innerText = "";
    }

    if (duchyTimeout !== null){
        clearTimeout(duchyTimeout);
    }

    isAutoMode = true;
    
    duchy();
    zaplanujNastepnegoDucha();    
    
    document.getElementById('przycisk').innerText = "Restart";
}

function zaplanujNastepnegoDucha(){

    if (!isAutoMode) return;

    const czyNapad = Math.random() < 0.15;
    let kolejnyOdstep;

    if (czyNapad){
        kolejnyOdstep = Math.floor(Math.random() * 2000) + 1000;
    }
    else{
        const czyMaFocha = Math.random() < 0.10
        if (czyMaFocha){
            kolejnyOdstep = Math.floor(Math.random() * 30000) + 30000;
        }
        else{
            kolejnyOdstep = Math.floor(Math.random() * 10000) + 5000;
        }
    }

    duchyTimeout = setTimeout(() => {
        duchy();
        zaplanujNastepnegoDucha();
    }, kolejnyOdstep);
}

function duchy(){

    if (teksty.length === 0) {
        document.getElementById('obecnyTekst').innerText = "Trwa łączenie z zaświatami...";
        return;
    }

    if (aktualneAudio && !aktualneAudio.paused) {
        return; 
    }

    const toNaPewnoDuch = teksty[Math.floor(Math.random() * teksty.length)];

    const boxObecny = document.getElementById('obecnyTekst');
    boxObecny.innerText = toNaPewnoDuch.text;

    const tts = new Audio(toNaPewnoDuch.audio);
    aktualneAudio = tts;

    aktualneAudio.onended = function() {
        boxObecny.innerText = "";

        tekstyKtoreJuzByly.unshift(toNaPewnoDuch.text);
        if (tekstyKtoreJuzByly.length > 15) {
            tekstyKtoreJuzByly.pop(); 
        }
        document.getElementById('tekstyByle').innerHTML = tekstyKtoreJuzByly.join("<br>");
    };

    tts.play();
}