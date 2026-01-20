/* script.js - Version Complète : Multi-sources, Images, Tests, Combat, Trésors */

let currentMonster = null;
let activeExtensions = []; 

document.addEventListener('DOMContentLoaded', () => {
    loadSettings(); // Charger les préférences

    const container = document.getElementById("buttons-container");
    const modal = document.getElementById("result-modal");
    
    // Génération des boutons du menu principal
    for (const key in gameData) {
        const btn = document.createElement("button");
        btn.textContent = gameData[key].label;
        btn.className = "table-btn";
        
        if (gameData[key].specialType === "entrance_visual") {
             btn.onclick = () => drawVisualEntrance();
        } else {
             btn.onclick = () => pickRandomItem(key);
        }
        container.appendChild(btn);
    }

    // Fermeture des modaux au clic extérieur
    window.onclick = (event) => {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = "none";
        }
    }
});

// --- OUTILS MATHÉMATIQUES ---
function getRandomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function rollD6() { return getRandomInt(1, 6); }

function parseAndCalculate(text) {
    if (!text) return 0;
    // Remplace les "d" (ex: 3d6) par des lancers réels
    const evaluatedText = text.replace(/(\d*)d(\d+)/g, (match, p1, p2) => {
        const number = p1 === "" ? 1 : parseInt(p1);
        const faces = parseInt(p2);
        let total = 0;
        for (let i = 0; i < number; i++) { total += Math.floor(Math.random() * faces) + 1; }
        return total;
    });
    try { return eval(evaluatedText); } catch (e) { return 0; }
}

// --- GESTION DES MODAUX & IMAGE ---
function closeModal(id) { document.getElementById(id).style.display = "none"; }
function openModal() { document.getElementById("result-modal").style.display = "block"; }

function resetModal() {
    document.getElementById("interaction-area").innerHTML = ""; 
    document.getElementById("text-display").innerHTML = "";
    document.getElementById("modal-image").style.display = "none";
    document.getElementById("source-badge").style.display = "none";
    document.getElementById("dice-display").innerText = "";
    currentMonster = null;
}

// --- GESTION DES RÉGLAGES ---
function openSettings() {
    const list = document.getElementById("extensions-list");
    list.innerHTML = "";
    AVAILABLE_EXTENSIONS.forEach(ext => {
        const div = document.createElement("div");
        div.className = "extension-item";
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = "ext-" + ext.id;
        checkbox.checked = activeExtensions.includes(ext.id);
        checkbox.onchange = () => {
            if (checkbox.checked) {
                if (!activeExtensions.includes(ext.id)) activeExtensions.push(ext.id);
            } else {
                activeExtensions = activeExtensions.filter(id => id !== ext.id);
            }
            saveSettings();
        };
        const label = document.createElement("label");
        label.htmlFor = "ext-" + ext.id;
        label.textContent = ext.name;
        div.appendChild(checkbox);
        div.appendChild(label);
        list.appendChild(div);
    });
    document.getElementById("settings-modal").style.display = "block";
}

function loadSettings() {
    const saved = localStorage.getItem("4ad_extensions");
    activeExtensions = saved ? JSON.parse(saved) : AVAILABLE_EXTENSIONS.filter(e => e.default).map(e => e.id);
}
function saveSettings() { localStorage.setItem("4ad_extensions", JSON.stringify(activeExtensions)); }


// --- CŒUR DU SYSTÈME : TIRAGE ---
function pickRandomItem(key, forcedIndex = null) {
    const tableInfo = gameData[key];
    if (!tableInfo) return;

    resetModal();

    // 1. Choix de la Source (Base ou Extension)
    let chosenSourceKey = "base";
    let sourceNameDisplay = "";
    if (tableInfo.sources) {
        const possibleSources = activeExtensions.filter(extId => tableInfo.sources[extId]);
        if (possibleSources.length > 0) {
            chosenSourceKey = possibleSources[getRandomInt(0, possibleSources.length - 1)];
            const extObj = AVAILABLE_EXTENSIONS.find(e => e.id === chosenSourceKey);
            if (extObj && chosenSourceKey !== "base") sourceNameDisplay = `Source : ${extObj.name}`;
        }
    }
    const sourceData = tableInfo.sources[chosenSourceKey];
    if (!sourceData || !sourceData.items) return;
    const itemsList = sourceData.items;

    // 2. Tirage (Dés ou Index forcé)
    let randomIndex;
    let rollText;

    if (forcedIndex !== null) {
        randomIndex = forcedIndex;
        // Correction bornes
        if (randomIndex < 0) randomIndex = 0;
        if (randomIndex >= itemsList.length) randomIndex = itemsList.length - 1;
        rollText = `🔢 Résultat Calculé : ${randomIndex}`;
    } else if (tableInfo.method === "2d6") {
        const d1 = rollD6();
        const d2 = rollD6();
        const total = d1 + d2;
        randomIndex = total - 2; 
        rollText = `🎲 Résultat 2d6 : ${d1}+${d2} = ${total}`;
    } else {
        randomIndex = getRandomInt(0, itemsList.length - 1);
        rollText = `🎲 Tirage : ${randomIndex + 1} / ${itemsList.length}`;
    }

    const item = itemsList[randomIndex];

    // 3. Affichage
    const title = document.getElementById("modal-title");
    const diceDisplay = document.getElementById("dice-display");
    const textDisplay = document.getElementById("text-display");
    const interactionArea = document.getElementById("interaction-area");
    const sourceBadge = document.getElementById("source-badge");

    title.innerText = tableInfo.label;
    diceDisplay.innerText = rollText;
    sourceBadge.innerText = sourceNameDisplay;
    sourceBadge.style.display = sourceNameDisplay ? "inline-block" : "none";

    // --- ANALYSE DU TYPE D'OBJET ---

    if (item.type === "monster") {
        // MONSTRE
        currentMonster = item;
        let count = parseAndCalculate(item.qty);
        textDisplay.innerHTML = `<span class="monster-count">${count} ${item.name}</span> ${item.desc}`;
        addInteractionButtons(item, interactionArea);

    } else if (item.type === "treasure") {
        // TRÉSOR (Calcul automatique de la valeur)
        displayTreasureResult(item, textDisplay);
        
    } else {
        // TEXTE SIMPLE
        let finalText = item.text || item;
        
        // Si formule de difficulté (ex: Salle Enigme)
        if (item.levelFormula) {
            const lvl = parseAndCalculate(item.levelFormula);
            finalText += `<br><br><div style="border:2px solid #e67e22; padding:10px; border-radius:8px; color:#e67e22; font-weight:bold; font-size:1.2em;">🔒 DIFFICULTÉ CALCULÉE : ${lvl}</div>`;
        }
        
        textDisplay.innerHTML = finalText;
        addInteractionButtons(item, interactionArea);
    }

    openModal();
}

// --- BOUTONS D'INTERACTION ---
function addInteractionButtons(item, container) {
    // Bouton COMBAT
    if (item.type === "monster") {
        const combatBtn = document.createElement("button");
        combatBtn.className = "combat-btn";
        combatBtn.innerHTML = "⚔️ Combat (d6)";
        combatBtn.onclick = () => rollCombat(container);
        container.appendChild(combatBtn);
    }

    // Bouton RÉACTION
    if (item.reaction) {
        const reactBtn = document.createElement("button");
        reactBtn.className = "reaction-btn";
        reactBtn.innerHTML = "🎲 Réaction";
        reactBtn.onclick = showReaction;
        container.appendChild(reactBtn);
    }

    // Bouton TEST (ex: Résoudre énigme)
    if (item.testBtn) {
        const testBtn = document.createElement("button");
        testBtn.className = "combat-btn"; 
        testBtn.style.backgroundColor = "#e67e22";
        testBtn.innerHTML = item.testBtn;
        testBtn.onclick = () => rollTest(container);
        container.appendChild(testBtn);
    }

    // Bouton TRÉSOR (Lien intelligent)
    if (item.treasureMod !== null && item.treasureMod !== undefined) {
        const treasureBtn = document.createElement("button");
        treasureBtn.className = "treasure-btn";
        const sign = item.treasureMod > 0 ? "+" : "";
        const modText = item.treasureMod === 0 ? "Normal" : `${sign}${item.treasureMod}`;
        treasureBtn.innerHTML = `💰 Trésor (${modText})`;
        treasureBtn.onclick = () => navigateToTreasure(item.treasureMod);
        container.appendChild(treasureBtn);
    }

    // Bouton SUIVANT (Lien vers autre table)
    if (item.next) {
        item.next.forEach(nextKey => {
            const nextTable = gameData[nextKey];
            if (nextTable) {
                const nextBtn = document.createElement("button");
                nextBtn.className = "next-action-btn";
                nextBtn.innerHTML = `➡️ ${nextTable.label}`; // Texte simplifié
                nextBtn.onclick = () => pickRandomItem(nextKey);
                container.appendChild(nextBtn);
            }
        });
    }
}

// --- ACTIONS (DÉS, COMBAT, VISUEL) ---

function rollCombat(container) {
    displayUniqueResult(container, "combat-unique-res", "#e74c3c", "#2c0b0b", "⚔️ Attaque");
}

function rollTest(container) {
    displayUniqueResult(container, "test-unique-res", "#e67e22", "#2d1b0e", "🎲 Votre Jet");
}

function displayUniqueResult(container, id, color, bg, label) {
    let box = document.getElementById(id);
    if (!box) {
        box = document.createElement("div");
        box.id = id;
        box.className = "combat-result";
        box.style.borderColor = color;
        box.style.color = color;
        box.style.backgroundColor = bg;
        container.appendChild(box);
    }
    const roll = rollD6();
    box.innerHTML = `${label} : <span style="font-size:1.5em">${roll}</span>`;
    box.style.animation = 'none';
    box.offsetHeight; 
    box.style.animation = 'fadeIn 0.2s';
}

function showReaction() {
    if (!currentMonster || !currentMonster.reaction) return;
    const old = document.getElementById("reaction-res");
    if (old) old.remove();
    const roll = rollD6();
    const resultText = currentMonster.reaction[roll - 1];
    const div = document.createElement("div");
    div.id = "reaction-res";
    div.className = "dynamic-result-text";
    div.style.borderColor = "#4a90e2";
    div.style.color = "#4a90e2";
    div.innerHTML = `<strong>Réaction (${roll}) :</strong> ${resultText}`;
    document.getElementById("interaction-area").appendChild(div);
}

function navigateToTreasure(modifier) {
    const roll = rollD6();
    let total = roll + modifier;
    if (total < 1) total = 0; 
    if (total > 6) total = 6;
    pickRandomItem("tresors", total);
}

function displayTreasureResult(item, target, prefix = "") {
    let content = "";
    if (item.formula) {
        const value = parseAndCalculate(item.formula);
        content = `${prefix}<strong>${item.name}</strong><br><br><span style="font-size:1.8em; color:#f1c40f">${value} po</span>`;
    } else {
        content = `${prefix}<strong>${item.name}</strong>`;
    }
    target.innerHTML = content;
}

// --- FONCTIONS VISUELLES ---

function drawNewTile() {
    resetModal();
    const title = document.getElementById("modal-title");
    const diceDisplay = document.getElementById("dice-display");
    const modalImage = document.getElementById("modal-image");
    const interactionArea = document.getElementById("interaction-area");

    const imageNumber = getRandomInt(7, 43);

    title.innerText = "Nouvelle Pièce découverte !";
    diceDisplay.innerText = `Visuel n° ${imageNumber}`;
    modalImage.src = `images/${imageNumber}.png`; 
    modalImage.style.display = "block";

    let nextTableKey = CORRIDOR_IDS.includes(parseInt(imageNumber)) ? "gen_couloir" : "gen_salle";
    const nextTable = gameData[nextTableKey];
    
    if (nextTable) {
        const nextBtn = document.createElement("button");
        nextBtn.className = "next-action-btn";
        const typeLabel = nextTableKey === "gen_couloir" ? "ce Couloir" : "cette Salle";
        nextBtn.innerHTML = `➡️ Peupler ${typeLabel}`;
        nextBtn.onclick = () => pickRandomItem(nextTableKey);
        interactionArea.appendChild(nextBtn);
    }
    openModal();
}

function drawVisualEntrance() {
    resetModal();
    const title = document.getElementById("modal-title");
    const diceDisplay = document.getElementById("dice-display");
    const modalImage = document.getElementById("modal-image");
    const interactionArea = document.getElementById("interaction-area");

    const imageNumber = getRandomInt(1, 6);
    title.innerText = "Entrée du Donjon";
    diceDisplay.innerText = `Visuel Entrée n° ${imageNumber}`;
    modalImage.src = `images/${imageNumber}.png`; 
    modalImage.style.display = "block";

    const nextBtn = document.createElement("button");
    nextBtn.className = "next-action-btn";
    nextBtn.innerHTML = `➡️ Explorer (Tirer une nouvelle pièce)`;
    nextBtn.onclick = () => drawNewTile(); 
    interactionArea.appendChild(nextBtn);

    openModal();
}
