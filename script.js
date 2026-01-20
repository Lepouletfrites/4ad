/* script.js - Version Complète : Multi-sources, Dé Global, Barre d'outils, Invocations */

let currentMonster = null;
let activeExtensions = []; 
let currentGlobalDie = 6; // Dé par défaut (d6)

document.addEventListener('DOMContentLoaded', () => {
    loadSettings(); 

    const container = document.getElementById("buttons-container");
    
    // --- 1. CRÉATION DE LA BARRE D'OUTILS (DÉS RAPIDES) ---
    const toolBar = document.createElement("div");
    toolBar.className = "dice-toolbar"; 
    
    // Bouton D6 (Classique)
    const btnD6 = document.createElement("button");
    btnD6.innerHTML = "🎲 <b>D6</b>";
    btnD6.className = "quick-dice-btn d6-btn";
    btnD6.onclick = () => showQuickDice(6);
    
    // Bouton D8 (Abysses / Armes lourdes)
    const btnD8 = document.createElement("button");
    btnD8.innerHTML = "🎲 <b>D8</b>";
    btnD8.className = "quick-dice-btn d8-btn";
    btnD8.onclick = () => showQuickDice(8);

    toolBar.appendChild(btnD6);
    toolBar.appendChild(btnD8);
    container.appendChild(toolBar);

    // --- 2. GÉNÉRATION DES TABLES ---
    for (const key in gameData) {
        if (gameData[key].hidden) continue; 

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
function rollD8() { return getRandomInt(1, 8); }

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

    // --- 1. SÉLECTION DU DÉ GLOBAL ---
    const dieSection = document.createElement("div");
    dieSection.className = "settings-section";
    dieSection.innerHTML = "<h3>🎲 Dé du Donjon (Combats/Tests)</h3>";
    
    const diceOptions = [6, 8, 10, 12];
    const diceContainer = document.createElement("div");
    diceContainer.className = "dice-selector";

    diceOptions.forEach(faces => {
        const btn = document.createElement("button");
        btn.innerHTML = `d${faces}`;
        btn.className = `die-select-btn ${currentGlobalDie === faces ? 'active' : ''}`;
        btn.onclick = () => {
            currentGlobalDie = faces;
            saveSettings();
            openSettings(); // Rafraîchir pour voir le changement visuel
        };
        diceContainer.appendChild(btn);
    });
    dieSection.appendChild(diceContainer);
    list.appendChild(dieSection);

    // --- 2. SÉLECTION DES EXTENSIONS ---
    const extSection = document.createElement("div");
    extSection.className = "settings-section";
    extSection.innerHTML = "<h3>📚 Extensions</h3>";

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
        extSection.appendChild(div);
    });
    list.appendChild(extSection);

    document.getElementById("settings-modal").style.display = "block";
}

function loadSettings() {
    const savedExt = localStorage.getItem("4ad_extensions");
    activeExtensions = savedExt ? JSON.parse(savedExt) : AVAILABLE_EXTENSIONS.filter(e => e.default).map(e => e.id);

    // Chargement du dé global
    const savedDie = localStorage.getItem("4ad_global_die");
    currentGlobalDie = savedDie ? parseInt(savedDie) : 6;
}

function saveSettings() { 
    localStorage.setItem("4ad_extensions", JSON.stringify(activeExtensions));
    localStorage.setItem("4ad_global_die", currentGlobalDie.toString());
}


// --- CŒUR DU SYSTÈME : TIRAGE ---
function pickRandomItem(key, forcedIndex = null) {
    const tableInfo = gameData[key];
    if (!tableInfo) return;

    resetModal();

    // 1. Choix de la Source
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

    // 2. Tirage
    let randomIndex;
    let rollText;

    if (forcedIndex !== null) {
        randomIndex = forcedIndex;
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
        // TRÉSOR
        displayTreasureResult(item, textDisplay);
        // On affiche les boutons (très important pour les objets magiques)
        addInteractionButtons(item, interactionArea); 
        
    } else {
        // TEXTE SIMPLE
        let finalText = item.text || item;
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
    const dCheck = `d${currentGlobalDie}`; 

    // 1. Bouton COMBAT
    if (item.type === "monster") {
        const combatBtn = document.createElement("button");
        combatBtn.className = "combat-btn";
        combatBtn.innerHTML = `⚔️ Combat (${dCheck})`; 
        combatBtn.onclick = () => rollCombat(container);
        container.appendChild(combatBtn);
    }

    // 2. Bouton RÉACTION
    if (item.reaction) {
        const reactBtn = document.createElement("button");
        reactBtn.className = "reaction-btn";
        reactBtn.innerHTML = "🎲 Réaction (d6)";
        reactBtn.onclick = showReaction;
        container.appendChild(reactBtn);
    }

    // 3. Action Spéciale (Invocations, Magie...)
    if (item.specialAction) {
        const spBtn = document.createElement("button");
        spBtn.className = "combat-btn"; 
        spBtn.style.backgroundColor = "#8e44ad"; 
        spBtn.innerHTML = item.specialAction.label;
        spBtn.onclick = () => showSpecialResult(item.specialAction.table);
        container.appendChild(spBtn);
    }
    
    // 4. Bouton TEST
    if (item.testBtn) {
        // On remplace le texte "(d6)" par le dé actuel
        const label = item.testBtn.replace("(d6)", `(${dCheck})`);
        
        const testBtn = document.createElement("button");
        testBtn.className = "combat-btn"; 
        testBtn.style.backgroundColor = "#e67e22";
        testBtn.innerHTML = label;
        testBtn.onclick = () => rollTest(container, label);
        container.appendChild(testBtn);
    }

    // 5. Bouton TRÉSOR
    if (item.treasureMod !== null && item.treasureMod !== undefined) {
        const treasureBtn = document.createElement("button");
        treasureBtn.className = "treasure-btn";
        const sign = item.treasureMod > 0 ? "+" : "";
        const modText = item.treasureMod === 0 ? "Normal" : `${sign}${item.treasureMod}`;
        treasureBtn.innerHTML = `💰 Trésor (${modText})`;
        treasureBtn.onclick = () => navigateToTreasure(item.treasureMod);
        container.appendChild(treasureBtn);
    }

    // 6. Bouton SUIVANT
    if (item.next) {
        item.next.forEach(nextKey => {
            const nextTable = gameData[nextKey];
            if (nextTable) {
                const nextBtn = document.createElement("button");
                nextBtn.className = "next-action-btn";
                nextBtn.innerHTML = `➡️ ${nextTable.label}`;
                nextBtn.onclick = () => pickRandomItem(nextKey);
                container.appendChild(nextBtn);
            }
        });
    }
}

function showSpecialResult(tableKey) {
    const old = document.getElementById("special-res");
    if (old) old.remove();

    const table = gameData[tableKey];
    if (!table) return;
    
    // On prend la source "base"
    const items = table.sources['base'].items; 
    
    let result;
    let roll = 0;

    if (items.length === 1) {
        result = items[0]; 
    } else {
        roll = rollD6();
        let index = roll - 1;
        if (index >= items.length) index = items.length - 1;
        result = items[index];
    }

    let displayHTML = "";

    if (result.type === "monster") {
        let count = parseAndCalculate(result.qty);
        displayHTML = `<strong>${count} ${result.name}</strong><br>${result.desc}`;
    } else {
        displayHTML = result.text || result;
    }

    const div = document.createElement("div");
    div.id = "special-res";
    div.className = "dynamic-result-text";
    
    if (result.type === "monster") {
        div.style.borderColor = "#c0392b"; 
        div.style.color = "#e74c3c";       
        div.innerHTML = `<strong>⚠️ INVOCATION :</strong><br>${displayHTML}`;
    } else {
        div.style.borderColor = "#8e44ad"; 
        div.style.color = "#d2b4de";       
        div.innerHTML = `<strong>Résultat ${roll > 0 ? '('+roll+')' : ''} :</strong> ${displayHTML}`;
    }
    
    document.getElementById("interaction-area").appendChild(div);
}


// --- ACTIONS (DÉS, COMBAT, VISUEL) ---

function rollCombat(container) {
    const roll = getRandomInt(1, currentGlobalDie);
    const color = currentGlobalDie > 6 ? "#8e44ad" : "#e74c3c";
    
    displayUniqueResult(container, "combat-unique-res", color, "#2c0b0b", `⚔️ Attaque (d${currentGlobalDie})`, roll);
}

function rollTest(container, label) {
    const roll = getRandomInt(1, currentGlobalDie);
    const cleanLabel = label || `🎲 Test (d${currentGlobalDie})`;
    
    displayUniqueResult(container, "test-unique-res", "#e67e22", "#2d1b0e", cleanLabel, roll);
}

function displayUniqueResult(container, id, color, bg, label, value) {
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
    const finalRoll = value !== undefined ? value : rollD6();
    
    box.innerHTML = `${label} : <span style="font-size:1.5em">${finalRoll}</span>`;
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

// --- FONCTIONS VISUELLES ET OUTILS RAPIDES ---

function showQuickDice(faces) {
    resetModal();
    const title = document.getElementById("modal-title");
    const diceDisplay = document.getElementById("dice-display");
    const textDisplay = document.getElementById("text-display");
    
    title.innerText = `Lancer de D${faces}`;
    
    let result = getRandomInt(1, faces);
    
    diceDisplay.innerText = ""; 
    
    textDisplay.innerHTML = `
        <div style="text-align:center; margin: 20px 0;">
            <span style="font-size: 4em; font-weight: bold; color: ${faces === 8 ? '#8e44ad' : '#e67e22'};">
                ${result}
            </span>
            <br>
            <span style="color:#aaa; font-size:0.9em;">(Résultat sur ${faces} faces)</span>
        </div>
    `;
    
    openModal();
}

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
