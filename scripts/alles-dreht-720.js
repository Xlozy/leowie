const sentence = ["dreht", "sich", "doch", "alles", "um", "mich"];
const outputCanvas = document.getElementById("content");
const wrapper = document.getElementById("wrapper");

let permutations = generatePermutations(sentence);
permutations = shuffle(permutations);
// Entferne diese Zeile, die die ursprüngliche Permutation an den Anfang setzt
// permutations.unshift(sentence);

let currentPermutationIndex = 0;
window.isPrintingFinished = false; // Stelle sicher, dass diese Variable vorhanden ist

const printing = setInterval(printNextPermutation, 50); // Intervall auf 10 Millisekunden setzen

function generatePermutations(arr) {
    if (arr.length <= 1) return [arr];
    const permutations = [];
    const smallerPermutations = generatePermutations(arr.slice(1));
    const first = arr[0];
    for (let perm of smallerPermutations) {
        for (let i = 0; i <= perm.length; i++) {
            const newPerm = perm.slice(0, i).concat(first, perm.slice(i));
            permutations.push(newPerm);
        }
    }
    return permutations;
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function printNextPermutation() {
    if (currentPermutationIndex >= permutations.length) {
        clearInterval(printing);
        window.isPrintingFinished = true; // Markiere das Ende der Generierung
        return;
    }
    printToScreen(permutations[currentPermutationIndex]);
    currentPermutationIndex++;
}

function printToScreen(arr) {
    const line = arr.join(' ');
    outputCanvas.innerHTML += `<p>${line}</p>`;
    updateScroll();
}

let stickToBottom = false;
wrapper.addEventListener('scroll', userScrolled);

function updateScroll() {
    if (stickToBottom) {
        wrapper.scrollTop = wrapper.scrollHeight;
    }
}

function userScrolled() {
    const o = wrapper;
    let pos = (o.scrollTop || document.body.scrollTop) + o.offsetHeight;
    let max = o.scrollHeight;
    stickToBottom = isAround(pos, max, 20);
}

function isAround(x, y, tolerance) {
    return x >= (y - tolerance) && x <= (y + tolerance);
}

document.addEventListener('DOMContentLoaded', () => {
    printNextPermutation(); // Erste Zeile drucken
});