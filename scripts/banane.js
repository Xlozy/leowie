/* ============================================================
   DIE ABSTRAKTE BANANE — Skript
   Wird auf der Seite /abstraktebanane/index.html geladen.
   Burger-Menu-Logik ist NICHT in dieser Datei – sie wird
   durch /scripts/burger-menu-multi-page.js abgedeckt.
   ============================================================ */

(function () {
    'use strict';

    // ---------- Konstanten ----------
    const GRID_SIZE = 3;
    const PIXEL_COUNT = GRID_SIZE * GRID_SIZE;
    const DEFAULT_HEX = '#FFFF00';
    const FORMSUBMIT_ENDPOINT = 'https://formsubmit.co/ajax/42eabba95174e976eb928ac9c2dfbd88';
    const SAMMLUNG_PFAD = '/abstraktebanane/sammlung.json';

    // ---------- State ----------
    let pixelColors = new Array(PIXEL_COUNT).fill(null);
    let currentColor = DEFAULT_HEX;

    // ---------- DOM-Referenzen ----------
    const grid = document.getElementById('pixel-grid');
    const hueInput = document.getElementById('hue');
    const hexInput = document.getElementById('hexInput');
    const colorDisplay = document.getElementById('colorDisplay');
    const generateBtn = document.getElementById('generateButton');
    const downloadBtn = document.getElementById('downloadButton');
    const submitBtn = document.getElementById('submitButton');
    const submissionForm = document.getElementById('submission-form');
    const submitName = document.getElementById('submitName');
    const submitDescription = document.getElementById('submitDescription');
    const submitConfirm = document.getElementById('submitConfirm');
    const submitCancel = document.getElementById('submitCancel');
    const submissionStatus = document.getElementById('submission-status');
    const honeypot = document.getElementById('hp');

    // ============================================================
    // Pixel-Grid aufbauen
    // ============================================================

    function buildGrid() {
        for (let i = 0; i < PIXEL_COUNT; i++) {
            const cell = document.createElement('button');
            cell.type = 'button';
            cell.className = 'pixel';
            cell.dataset.index = String(i);
            cell.setAttribute('role', 'gridcell');
            cell.setAttribute('aria-label', `Feld ${i + 1}`);
            cell.addEventListener('click', () => onPixelClick(i));
            grid.appendChild(cell);
        }
        renderGrid();
    }

    function renderGrid() {
        const cells = grid.querySelectorAll('.pixel');
        cells.forEach((cell, i) => {
            const color = pixelColors[i];
            cell.style.backgroundColor = color || '#f0f0f0';
            cell.setAttribute('aria-label', color ? `Feld ${i + 1}, gefärbt` : `Feld ${i + 1}, leer`);
        });
    }

    function onPixelClick(i) {
        if (pixelColors[i]) {
            pixelColors[i] = null;
        } else {
            pixelColors[i] = currentColor;
        }
        renderGrid();
    }

    // ============================================================
    // Farbauswahl
    // ============================================================

    function hueToHex(hue) {
        const h = hue / 360;
        const s = 1, l = 0.5;
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        const r = hue2rgb(p, q, h + 1 / 3);
        const g = hue2rgb(p, q, h);
        const b = hue2rgb(p, q, h - 1 / 3);
        const toHex = x => Math.round(x * 255).toString(16).padStart(2, '0');
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
    }

    function isValidHex(s) {
        return /^#([0-9A-F]{3}|[0-9A-F]{6})$/i.test(s);
    }

    function setColor(hex) {
        if (!isValidHex(hex)) return;
        currentColor = hex.toUpperCase();
        colorDisplay.style.backgroundColor = currentColor;
        hexInput.value = currentColor;
    }

    hueInput.addEventListener('input', () => {
        setColor(hueToHex(parseInt(hueInput.value, 10)));
    });

    hexInput.addEventListener('change', () => {
        let v = hexInput.value.trim();
        if (!v.startsWith('#')) v = '#' + v;
        if (isValidHex(v)) {
            setColor(v);
        } else {
            hexInput.value = currentColor;
        }
    });

    // ============================================================
    // Generator: zufällige verbundene Form
    // ============================================================

    function generateRandomBanana() {
        const count = 3 + Math.floor(Math.random() * 5);
        const chosen = new Set();
        const start = Math.floor(Math.random() * PIXEL_COUNT);
        chosen.add(start);

        while (chosen.size < count) {
            const candidates = new Set();
            chosen.forEach(idx => {
                neighbors(idx).forEach(n => {
                    if (!chosen.has(n)) candidates.add(n);
                });
            });
            if (candidates.size === 0) break;
            const arr = Array.from(candidates);
            const next = arr[Math.floor(Math.random() * arr.length)];
            chosen.add(next);
        }

        const hue = Math.floor(Math.random() * 360);
        const color = hueToHex(hue);
        setColor(color);

        pixelColors = new Array(PIXEL_COUNT).fill(null);
        chosen.forEach(idx => {
            pixelColors[idx] = color;
        });
        renderGrid();
    }

    function neighbors(idx) {
        const row = Math.floor(idx / GRID_SIZE);
        const col = idx % GRID_SIZE;
        const out = [];
        if (row > 0) out.push(idx - GRID_SIZE);
        if (row < GRID_SIZE - 1) out.push(idx + GRID_SIZE);
        if (col > 0) out.push(idx - 1);
        if (col < GRID_SIZE - 1) out.push(idx + 1);
        return out;
    }

    generateBtn.addEventListener('click', generateRandomBanana);

    // ============================================================
    // ID-Format: ABBA_ + 9× Feld
    //   leer:    "#"
    //   gefärbt: "#XXXXXX" (6 Hex-Zeichen)
    // Beispiel Default: ABBA_###FFFF00###FFFF00###FFFF00
    // ============================================================

    function generateId() {
        let id = 'ABBA_';
        for (let i = 0; i < PIXEL_COUNT; i++) {
            if (pixelColors[i]) {
                id += pixelColors[i];
            } else {
                id += '#';
            }
        }
        return id;
    }

    function parseId(id) {
        if (!id || !id.startsWith('ABBA_')) return null;
        const code = id.slice(5);
        const colors = [];
        let i = 0;
        let count = 0;
        while (i < code.length && count < PIXEL_COUNT) {
            if (code[i] !== '#') return null;
            const hexPart = code.slice(i + 1, i + 7);
            if (/^[0-9A-Fa-f]{6}$/.test(hexPart)) {
                colors.push('#' + hexPart.toUpperCase());
                i += 7;
            } else {
                colors.push(null);
                i += 1;
            }
            count++;
        }
        return colors.length === PIXEL_COUNT ? colors : null;
    }

    // ============================================================
    // SVG für Sammlung-Detailanzeige (weisser Hintergrund, ohne Signatur)
    // ============================================================

    function buildSvg(colors) {
        const cellSize = 100;
        const gap = 4;
        const padding = 12;
        const gridDim = GRID_SIZE * cellSize + (GRID_SIZE - 1) * gap;
        const w = gridDim + padding * 2;
        const h = gridDim + padding * 2;

        let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">`;
        svg += `<rect width="${w}" height="${h}" fill="#FFFFFF"/>`;

        for (let i = 0; i < PIXEL_COUNT; i++) {
            const color = colors[i];
            if (!color) continue;
            const row = Math.floor(i / GRID_SIZE);
            const col = i % GRID_SIZE;
            const x = padding + col * (cellSize + gap);
            const y = padding + row * (cellSize + gap);
            svg += `<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" fill="${color}"/>`;
        }

        svg += '</svg>';
        return svg;
    }

    // ============================================================
    // PNG-Download via Canvas
    // (weisser Hintergrund, dezente Signatur unten rechts)
    // ============================================================

    function downloadPng(filename) {
        const id = generateId();

        const cellSize = 200;
        const gap = 4;
        const margin = 30;
        const gridDim = GRID_SIZE * cellSize + (GRID_SIZE - 1) * gap;
        const w = gridDim + margin * 2;
        const h = gridDim + margin * 2;

        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');

        // Weisser Hintergrund
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, w, h);

        // Zellen
        for (let i = 0; i < PIXEL_COUNT; i++) {
            const color = pixelColors[i];
            if (!color) continue;
            const row = Math.floor(i / GRID_SIZE);
            const col = i % GRID_SIZE;
            const x = margin + col * (cellSize + gap);
            const y = margin + row * (cellSize + gap);
            ctx.fillStyle = color;
            ctx.fillRect(x, y, cellSize, cellSize);
        }

        // Signatur unten rechts (sehr dezent)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.18)';
        ctx.font = '11px Helvetica, Arial, sans-serif';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'bottom';
        ctx.fillText(id, w - 8, h - 6);

        canvas.toBlob((blob) => {
            if (!blob) {
                alert('PNG konnte nicht erzeugt werden.');
                return;
            }
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename + '.png';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 'image/png');
    }

    function hasAnyColor() {
        return pixelColors.some(c => c !== null);
    }

    downloadBtn.addEventListener('click', () => {
        if (!hasAnyColor()) {
            alert('Wähle zuerst Felder aus oder benutze den Generator-Knopf.');
            return;
        }
        downloadPng(generateId());
    });

    // ============================================================
    // Einreich-Formular
    // ============================================================

    submitBtn.addEventListener('click', () => {
        if (!hasAnyColor()) {
            alert('Wähle zuerst Felder aus oder benutze den Generator-Knopf.');
            return;
        }
        submissionForm.hidden = false;
        submissionStatus.textContent = '';
        submissionStatus.className = '';
        submitName.focus();
        submissionForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    submitCancel.addEventListener('click', () => {
        submissionForm.hidden = true;
        submissionStatus.textContent = '';
        submissionStatus.className = '';
    });

    submitConfirm.addEventListener('click', async () => {
        const name = submitName.value.trim();
        const description = submitDescription.value.trim();

        if (honeypot.value) {
            submissionStatus.textContent = 'Eingereicht.';
            submissionStatus.className = 'success';
            return;
        }

        if (name.length < 2) {
            submissionStatus.textContent = 'Bitte gib einen Namen oder ein Pseudonym an (mindestens 2 Zeichen).';
            submissionStatus.className = 'error';
            return;
        }

        const id = generateId();
        const today = new Date().toISOString().slice(0, 10);

        submissionStatus.textContent = 'Sende…';
        submissionStatus.className = '';
        submitConfirm.disabled = true;

        const payload = {
            _subject: `[Abstrakte Banane] ${id}`,
            _template: 'box',
            _captcha: 'false',
            id: id,
            name: name,
            description: description || '(keine Beschreibung)',
            zeitstempel: new Date().toISOString(),
            json_zum_kopieren: JSON.stringify({
                id: id,
                name: name,
                description: description,
                date: today
            }, null, 2)
        };

        try {
            const response = await fetch(FORMSUBMIT_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                submissionStatus.textContent = 'Danke. Deine Banane wurde eingereicht. Sie erscheint nach Prüfung in der Sammlung. Der Download startet jetzt.';
                submissionStatus.className = 'success';
                submitName.value = '';
                submitDescription.value = '';
                setTimeout(() => downloadPng(id), 600);
            } else {
                throw new Error('Server antwortete mit ' + response.status);
            }
        } catch (err) {
            submissionStatus.textContent = 'Übermittlung fehlgeschlagen. Probier es später nochmals oder lade die Banane einfach herunter.';
            submissionStatus.className = 'error';
            console.error(err);
        } finally {
            submitConfirm.disabled = false;
        }
    });

    // ============================================================
    // Sammlung laden und rendern
    // ============================================================

    async function loadSammlung() {
        const info = document.getElementById('sammlung-info');
        const table = document.getElementById('sammlung-table');
        const tbody = document.getElementById('sammlung-tbody');

        if (location.protocol === 'file:') {
            info.textContent = 'Die Sammlung wird beim direkten Öffnen der Datei nicht geladen. Sie erscheint, sobald die Seite über einen Webserver läuft.';
            return;
        }

        try {
            const res = await fetch(SAMMLUNG_PFAD, { cache: 'no-store' });
            if (!res.ok) throw new Error('not found');
            const data = await res.json();

            if (!Array.isArray(data) || data.length === 0) {
                info.textContent = 'Noch keine Bananen in der Sammlung.';
                return;
            }

            info.textContent = '';
            table.hidden = false;

            data.forEach((entry) => {
                const row = document.createElement('tr');
                row.className = 'zeile';

                const idCell = document.createElement('td');
                idCell.className = 'id-cell';
                idCell.textContent = entry.id || '—';
                row.appendChild(idCell);

                const nameCell = document.createElement('td');
                nameCell.textContent = entry.name || '—';
                row.appendChild(nameCell);

                const descCell = document.createElement('td');
                descCell.className = 'beschreibung-cell';
                const desc = entry.description || '';
                descCell.textContent = desc.length > 80 ? desc.slice(0, 80) + '…' : (desc || '—');
                row.appendChild(descCell);

                row.addEventListener('click', () => toggleDetail(row, entry));
                row.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggleDetail(row, entry);
                    }
                });
                row.tabIndex = 0;
                row.setAttribute('role', 'button');
                row.setAttribute('aria-expanded', 'false');

                tbody.appendChild(row);
            });
        } catch (err) {
            info.textContent = 'Sammlung konnte nicht geladen werden.';
            console.warn('Sammlung konnte nicht geladen werden:', err);
        }
    }

    function toggleDetail(row, entry) {
        const next = row.nextElementSibling;
        if (next && next.classList.contains('detail')) {
            next.remove();
            row.setAttribute('aria-expanded', 'false');
            return;
        }

        const detailRow = document.createElement('tr');
        detailRow.className = 'detail';

        const cell = document.createElement('td');
        cell.colSpan = 3;

        const colors = parseId(entry.id);
        const svg = colors ? buildSvg(colors) : '<p>Banane konnte nicht rekonstruiert werden.</p>';

        cell.innerHTML = `
            <div class="detail-content">
                <div class="detail-banane">${svg}</div>
                <div class="detail-text">
                    <dl>
                        <dt>ID</dt>
                        <dd><code>${escapeHtml(entry.id || '')}</code></dd>
                        <dt>Name</dt>
                        <dd>${escapeHtml(entry.name || '')}</dd>
                        <dt>Beschreibung</dt>
                        <dd>${escapeHtml(entry.description || '(keine Beschreibung)')}</dd>
                        ${entry.date ? `<dt>Eingereicht</dt><dd>${escapeHtml(entry.date)}</dd>` : ''}
                    </dl>
                </div>
            </div>
        `;

        detailRow.appendChild(cell);
        row.parentNode.insertBefore(detailRow, row.nextSibling);
        row.setAttribute('aria-expanded', 'true');
    }

    function escapeHtml(s) {
        return String(s).replace(/[<>&'"]/g, c =>
            ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&#39;', '"': '&quot;' }[c])
        );
    }

    // ============================================================
    // Init
    // ============================================================

    function init() {
        // Default-Banane: rechte Spalte gelb
        pixelColors = new Array(PIXEL_COUNT).fill(null);
        pixelColors[2] = DEFAULT_HEX;
        pixelColors[5] = DEFAULT_HEX;
        pixelColors[8] = DEFAULT_HEX;

        buildGrid();
        setColor(DEFAULT_HEX);
        hueInput.value = '60';

        loadSammlung();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
