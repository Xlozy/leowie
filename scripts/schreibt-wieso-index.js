document.addEventListener('DOMContentLoaded', () => {
    const words = [
        "Chabis.",
        "Lotterleben,", "Erdwasserball,", "Fristendasein.", "Eleleu-Eleleu!",
        "Aphasie,", "Aphantasie,", "Walpferd.",
        "Leerlauf,", "buntschal,", "Zufallsfund.",
        "Schreibfenchel.",
        "Fahrradieschen,", "Blöterlisinn.",
        "Mondgesicht,", "Bauchpinselei.",
        "Muschchopf,", "Schwanengesang.",
        "Teigig,", "Leprahaut,", "AVierPaPier,", "kotzübel.",
        "Humorbolle,", "bonne-bonne,", "Brösmelibart,", "hurluberlu.",
        "Schlafsacksack,", "Pantoffelpanik.",
        "Vegetarierkeule,", "Dötzlidätsch.",
        "Onomatopotetry.",
        "CBHUBNESTA.",
        "Demichirurg,", "Löli.",
        "Pfauengang,", "Bühnenaffe,", "Meuchelpuffer,", "Bellgelächter.",
        "Sonnenstück,", "Regenbütte.",
        "Brukhust,", "Blust.",
        "Halbfranz,", "wunderpfitzig,", "talab,", "talauf.",
        "Newsal,", "Agaçierung,", "Aufoktroyierung.",
        "Fanal,", "telost.",
        "Glumps,", "Äh-Kunst.",
        "Mäuseeuter,", "felin.",
        "Nullbockkäfer,", "Kescher.",
        "Ringgeli-Ränggeli,", "Pollerkoller,", "Behördenzappel,", "Pflaumenlogistik.",
        "Geviert,", "Wandelbahn,", "Movens,", "Iterabilität.",
        "Libertinage,", "Konversoin.",
        "Lügenäther,", "Ridikül.",
        "Sysiphos,", "hyggellisch.",
        "Hassliebernicht,", "hoffensichtlich.",
        "Götternacht,", "Pathus.",
        "Pfeffer,", "Paprika:", "Badatsch!",
        "Letztwort,", "Grkuss."
    ];
    let currentIndex = 0;
    const blinkElement = document.getElementById('blinking-word');

    function changeWord() {
        blinkElement.style.visibility = 'hidden';
        setTimeout(() => {
            if (currentIndex < words.length) {
                blinkElement.textContent = words[currentIndex];
                blinkElement.style.visibility = 'visible';
                currentIndex++;
                setTimeout(changeWord, 1500 + Math.random() * 1000); // Zufällige Verzögerung zwischen 1500ms und 2500ms
            } else {
                blinkElement.textContent = ''; // Löscht den Text nach dem letzten Wort
                clearInterval(wordInterval); // Stoppt das Intervall, wenn alle Wörter durchlaufen wurden
            }
        }, 1000); // Zeit, während der der Text ausgeblendet bleibt (hier 1000ms)
    }

    const wordInterval = setTimeout(changeWord, 2500); // Startet das erste Intervall
});