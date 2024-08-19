document.addEventListener('DOMContentLoaded', () => {
    const words = [
        "Chabis.",
        "Lotterleben", "Erdwasserball", "Fristendasein.", "Eleleu-Eleleu!",
        "Aphasie", "Aphantasie", "Walpferd.",
        "Leerlauf", "buntschal", "Zufallsfund.",
        "Schreibfenchel.",
        "Fahrradieschen", "Blöterlisinn.",
        "Mondgesicht", "Bauchpinselei.",
        "Muschchopf", "Schwanengesang.",
        "Teigig", "Leprahaut", "AVierPaPier", "kotzübel.",
        "Humorbolle", "bonne-bonne", "Brösmelibart", "hurluberlu.",
        "Schlafsacksack", "Pantoffelpanik.",
        "Vegetarierkeule", "Dötzlidätsch.",
        "Onomatopotetry.",
        "CBHUBNESTA.",
        "Demichirurg", "Löli.",
        "Pfauengang", "Bühnenaffe", "Meuchelpuffer", "Bellgelächter.",
        "Sonnenstück", "Regenbütte.",
        "Brukhust", "Blust.",
        "Halbfranz", "wunderpfitzig", "talab", "talauf.",
        "Newsal", "Agaçierung", "Aufoktroyierung.",
        "Fanal", "telost.",
        "Glumps", "Äh-Kunst.",
        "Mäuseeuter", "felin.",
        "Nullbockkäfer", "Kescher.",
        "Ringgeli-Ränggeli", "Pollerkoller", "Behördenzappel", "Pflaumenlogistik.",
        "Geviert", "Wandelbahn", "Movens", "Iterabilität.",
        "Libertinage", "Konversoin.",
        "Lügenäther", "Ridikül.",
        "Sysiphos", "hyggellisch.",
        "Hassliebernicht", "hoffensichtlich.",
        "Götternacht", "Pathus.",
        "Pfeffer", "Paprika:", "Badatsch!",
        "Letztwort", "Grkuss."
    ];
    let currentIndex = 0;
    const blinkElement = document.getElementById('schreibt-wieso');
    let fullText = '';

    function addWord() {
        if (currentIndex < words.length) {
            if (fullText !== '' && !/[.!:]$/.test(fullText)) {
                fullText += ', ';
            } else if (/[.!:]$/.test(fullText)) {
                fullText += ' ';
            }
            fullText += words[currentIndex];
            blinkElement.textContent = fullText;
            currentIndex++;
            setTimeout(addWord, 1000 + Math.random() * 2000); // Zufällige Verzögerung zwischen 1000ms und 3000ms
        }
    }

    setTimeout(addWord, 2000); // Startet das Hinzufügen von Wörtern mit einer anfänglichen Verzögerung von 2000ms
});