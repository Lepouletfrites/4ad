/* script.js - Version Finale Visuelle */

let currentMonster = null;

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById("buttons-container");
    const modal = document.getElementById("result-modal");
    const closeBtn = document.querySelector(".close-btn");

    for (const key in gameData) {
        const btn = document.createElement("button");
        btn.textContent = gameData[key].label;
        btn.className = "table-btn";
        
        // Si c'est le bouton spécial "Entrée visuelle"
        if (gameData[key].specialType === "entrance_visual") {
             btn.onclick = () => drawVisualEntrance();
        } else {
             btn.onclick = () => pickRandomItem(key);
        }
        container.appendChild(btn);
    }

    closeBtn.onclick = () => closeModal();
    window.onclick = (event) => {
        if (event.target == modal) closeModal();
    }
});

function closeModal() {
    document.getElementById("result-modal").style.display = "none";
}

function openModal() {
    document.getElementById("result-modal").style.display = "block";
}

function rollD6() { return Math.floor(Math.random() * 6) + 1; }

// Fonction utilitaire pour un entier aléatoire entre min et max (inclus)
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function parseAndCalculate(text) {
    if (!text) return 0;
    const evaluatedText = text.replace(/(\d*)d(\d+)/g, (match, p1, p2) => {
        const number = p1 === "" ? 1 : parseInt(p1);
        const faces = parseInt(p2);
        let total = 0;
        for (let i = 0; i < number; i++) { total += Math.floor(Math.random() * faces) + 1; }
        return total;
    });
    try { return eval(evaluatedText); } catch (e) { return 0; }
}

// --- NOUVELLES FONCTIONS VISUELLES ---

// Fonction pour le GROS BOUTON (Images 7-43)
function drawNewTile() {
    resetModal();
    const title = document.getElementById("modal-title");
    const diceDisplay = document.getElementById("dice-display");
    const modalImage = document.getElementById("modal-image");
    const interactionArea = document.getElementById("interaction-area");

    // 1. Tirer un numéro entre 7 et 43
    const imageNumber = getRandomInt(7, 43);

    title.innerText = "Nouvelle Pièce découverte !";
    diceDisplay.innerText = `Visuel n° ${imageNumber}`;
    
    // 2. Afficher l'image
    modalImage.src = `images/${imageNumber}.png`;
    modalImage.style.display = "block";

    // 3. Déterminer si c'est Couloir ou Salle (basé sur votre liste dans data.js)
    let nextTableKey = "";
    // On vérifie si le numéro tiré est dans la liste des couloirs
    // On utilise parseInt pour être sûr de comparer des nombres
    if (CORRIDOR_IDS.includes(parseInt(imageNumber))) {
        // C'est un COULOIR
        nextTableKey = "gen_couloir";
    } else {
        // C'est une SALLE
        nextTableKey = "gen_salle";
    }

    // 4. Créer le bouton "Suivant" approprié
    const nextTable = gameData[nextTableKey];
    if (nextTable) {
        const nextBtn = document.createElement("button");
        nextBtn.className = "next-action-btn";
        // On change le texte selon le type
        const typeLabel = nextTableKey === "gen_couloir" ? "ce Couloir" : "cette Salle";
        nextBtn.innerHTML = `➡️ Peupler ${typeLabel}`;
        nextBtn.onclick = () => pickRandomItem(nextTableKey);
        interactionArea.appendChild(nextBtn);
    }

    openModal();
}

// Fonction pour le bouton ENTRÉE (Images 1-6)
function drawVisualEntrance() {
    resetModal();
    const title = document.getElementById("modal-title");
    const diceDisplay = document.getElementById("dice-display");
    const modalImage = document.getElementById("modal-image");
    const interactionArea = document.getElementById("interaction-area");

    const imageNumber = getRandomInt(1, 6);
    title.innerText = "Entrée du Donjon";
    diceDisplay.innerText = `Visuel Entrée n° ${imageNumber}`;
    
    // Affichage image png
    modalImage.src = `images/${imageNumber}.png`; 
    modalImage.style.display = "block";

    // --- CHANGEMENT ICI ---
    // On crée un bouton qui lance "drawNewTile" (Tirer une nouvelle pièce)
    const nextBtn = document.createElement("button");
    nextBtn.className = "next-action-btn";
    
    // Nouveau texte
    nextBtn.innerHTML = `➡️ Explorer (Tirer une nouvelle pièce)`;
    
    // Nouvelle action : on appelle la fonction du gros bouton violet
    nextBtn.onclick = () => drawNewTile(); 
    
    interactionArea.appendChild(nextBtn);

    openModal();
}

// Fonction pour nettoyer le modal avant affichage
function resetModal() {
    document.getElementById("interaction-area").innerHTML = ""; 
    document.getElementById("text-display").innerHTML = "";
    // Important : on cache l'image par défaut pour qu'elle ne traîne pas sur les tirages textuels
    document.getElementById("modal-image").style.display = "none";
    currentMonster = null;
}

// --- FONCTION PRINCIPALE (Modifiée pour reset l'image) ---
function pickRandomItem(key, forcedIndex = null) {
    const tableInfo = gameData[key];
    if (!tableInfo) return;

    resetModal(); // <-- On nettoie tout (y compris l'image)
    
    const title = document.getElementById("modal-title");
    const diceDisplay = document.getElementById("dice-display");
    const textDisplay = document.getElementById("text-display");
    const interactionArea = document.getElementById("interaction-area");

    let randomIndex;
    let rollText;

    if (forcedIndex !== null) {
        randomIndex = forcedIndex;
        if (randomIndex < 0) randomIndex = 0;
        if (randomIndex >= tableInfo.items.length) randomIndex = tableInfo.items.length - 1;
        rollText = `🔢 Résultat Calculé : ${randomIndex}`;

    } else if (tableInfo.method === "2d6") {
        const d1 = rollD6();
        const d2 = rollD6();
        const total = d1 + d2;
        randomIndex = total - 2; 
        rollText = `🎲 Résultat 2d6 : ${d1}+${d2} = ${total}`;

    } else {
        randomIndex = Math.floor(Math.random() * tableInfo.items.length);
        rollText = `🎲 Tirage : ${randomIndex + 1} / ${tableInfo.items.length}`;
    }

    if (!tableInfo.items[randomIndex]) {
        textDisplay.innerText = "Erreur : Résultat hors limites.";
        openModal();
        return;
    }

    const item = tableInfo.items[randomIndex];
    title.innerText = tableInfo.label;
    diceDisplay.innerText = rollText;

    if (item.type === "monster") {
        currentMonster = item;
        let count = parseAndCalculate(item.qty);
        textDisplay.innerHTML = `<span class="monster-count">${count} ${item.name}</span> ${item.desc}`;
        addMonsterButtons(item, interactionArea);

    } else if (item.type === "treasure") {
        textDisplay.innerHTML = "";
        displayTreasureResult(item, textDisplay);
    } else {
        const textContent = item.text || item;
        textDisplay.innerHTML = textContent;
    }

    if (item.next) {
        item.next.forEach(nextKey => {
            const nextTable = gameData[nextKey];
            if (nextTable) {
                const nextBtn = document.createElement("button");
                nextBtn.className = "next-action-btn";
                nextBtn.innerHTML = `➡️ Aller vers : ${nextTable.label}`;
                nextBtn.onclick = () => pickRandomItem(nextKey);
                interactionArea.appendChild(nextBtn);
            }
        });
    }

    openModal();
}

function addMonsterButtons(item, container) {
    const combatBtn = document.createElement("button");
    combatBtn.className = "combat-btn";
    combatBtn.innerHTML = "⚔️ Combat (d6)";
    combatBtn.onclick = () => rollCombat(container);
    container.appendChild(combatBtn);

    if (item.reaction) {
        const reactBtn = document.createElement("button");
        reactBtn.className = "reaction-btn";
        reactBtn.innerHTML = "🎲 Réaction";
        reactBtn.onclick = showReaction;
        container.appendChild(reactBtn);
    }

    if (item.treasureMod !== null && item.treasureMod !== undefined) {
        const treasureBtn = document.createElement("button");
        treasureBtn.className = "treasure-btn";
        const sign = item.treasureMod > 0 ? "+" : "";
        const modText = item.treasureMod === 0 ? "Normal" : `${sign}${item.treasureMod}`;
        treasureBtn.innerHTML = `💰 Trésor (${modText})`;
        treasureBtn.onclick = () => navigateToTreasure(item.treasureMod);
        container.appendChild(treasureBtn);
    }
}

function rollCombat(container) {
    let combatBox = document.getElementById("combat-unique-res");
    if (!combatBox) {
        combatBox = document.createElement("div");
        combatBox.id = "combat-unique-res"; 
        combatBox.className = "combat-result"; 
        container.appendChild(combatBox);
    }
    const roll = rollD6();
    combatBox.innerHTML = `⚔️ Attaque : <span style="font-size:1.5em">${roll}</span>`;
    combatBox.style.animation = 'none';
    combatBox.offsetHeight; 
    combatBox.style.animation = 'fadeIn 0.2s';
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
        content = `${prefix}<strong>${item.name}</strong><br><br><span style="font-size:1.5em; color:#f1c40f">${value} po</span>`;
    } else {
        content = `${prefix}<strong>${item.name}</strong>`;
    }
    target.innerHTML = content;
}
