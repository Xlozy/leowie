document.addEventListener('DOMContentLoaded', () => {
    // Warten, bis das erste Skript zu Ende ist
    const checkInterval = setInterval(() => {
        if (window.isPrintingFinished) {
            clearInterval(checkInterval);
            calculateLexicographicPosition();
        }
    }, 100);
});

function calculateLexicographicPosition() {
    const permutations = getPermutations();
    const position = findLexicographicPosition(permutations);
    displayPosition(position);
}

function getPermutations() {
    const lines = document.querySelectorAll('#content p');
    const permutations = [];
    lines.forEach((line, index) => {
        if (index > 0) { // Überspringe die erste Zeile
            permutations.push(line.textContent);
        }
    });
    return permutations;
}

function findLexicographicPosition(permutations) {
    const n = permutations.length;
    const factorials = calculateFactorials(n);
    let position = BigInt(0);

    for (let i = 0; i < n; i++) {
        const current = permutations[i];
        let smallerCount = 0;

        for (let j = i + 1; j < n; j++) {
            if (permutations[j] < current) {
                smallerCount++;
            }
        }

        position += BigInt(smallerCount) * factorials[n - 1 - i];
    }

    return position + BigInt(1); // +1 weil Positionen bei 1 beginnen
}

function calculateFactorials(n) {
    const factorials = [BigInt(1)];
    for (let i = 1; i <= n; i++) {
        factorials[i] = factorials[i - 1] * BigInt(i);
    }
    return factorials;
}

function displayPosition(position) {
    const outputCanvas = document.getElementById("content");
    const versionText = `
        <div class="version-anzeige">
            <p>Das Gedicht kennt 6! (6 x 5 x 4 x 3 x 2 x 1 = 720) Möglichkeiten, die Wörter «dreht», «sich», «doch», «alles», «um», «mich» auf einer Zeile anzuordnen. Das Gedicht kennt 720 Zeilen und erschöpft in jedem Lauf sämtliche seiner 720 Anordnungsmöglichkeiten. Das Gedicht kennt also 720! Versionen. Das hier ist die</p>
            <br>
            <p>${position.toString()}ste Version (lexikographisch bestimmt).</p>
            <br>
            <p>Am besten speicherst Du diese Ausführung ab, sie gehört Dir. (Es sei denn, die Unwahrscheinlichkeit in Person erhält dieselbe Version generiert.)</p>
        </div>
    `;
    outputCanvas.innerHTML += versionText;
}