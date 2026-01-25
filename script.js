/* script.js - Version avec Barre de Dés Complète (d6, d8, d10, d12, d20) */

// --- VARIABLES GLOBALES ---
let currentMonster = null;
let activeExtensions = []; 
let currentGlobalDie = 6; 

// Stockage des monstres filtrés et valides
let activePools = {
    BOSS: [],
    SBIRE: [],
    VERMINE: [],
    ETRANGE: []
};

// --- INITIALISATION ---
document.addEventListener('DOMContentLoaded', () => {
    loadSettings(); 
    createInterface();
    switchTab('generator'); 
    
    // Fermeture modal au clic extérieur
    window.onclick = (event) => {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = "none";
        }
    }

    // Fermeture avec la croix
    const closeButtons = document.querySelectorAll(".close-btn");
    closeButtons.forEach(btn => {
        btn.onclick = function() {
            const modal = btn.closest(".modal");
            if (modal) modal.style.display = "none";
        }
    });
});

// --- GESTION DES ONGLETS ---
function switchTab(tabName) {
    document.getElementById("tab-generator").style.display = "none";
    document.getElementById("tab-bestiary").style.display = "none";
    
    const buttons = document.querySelectorAll(".tab-btn");
    buttons.forEach(btn => btn.classList.remove("active"));
    
    if (tabName === 'generator') {
        document.getElementById("tab-generator").style.display = "block";
        buttons[0].classList.add("active");
    } else {
        document.getElementById("tab-bestiary").style.display = "block";
        buttons[1].classList.add("active");
        renderBestiary(); 
    }
}

// --- INTERFACE PRINCIPALE (Modifiée pour les Dés) ---
function createInterface() {
    const container = document.getElementById("buttons-container");
    container.innerHTML = ""; 

    // 1. Barre de Dés Complète
    const toolBar = document.createElement("div");
    toolBar.className = "dice-toolbar"; 
    
    // Liste des dés à afficher
    const diceTypes = [6, 8, 10, 12, 20];

    diceTypes.forEach(faces => {
        const btn = document.createElement("button");
        btn.innerHTML = `<b>D${faces}</b>`;
        btn.className = `quick-dice-btn d${faces}-btn`;
        btn.onclick = () => showQuickDice(faces);
        toolBar.appendChild(btn);
    });

    container.appendChild(toolBar);

    // 2. Boutons des Tables
    for (const key in gameData) {
        if (gameData[key].hidden) continue; 

        const btn = document.createElement("button");
        btn.innerHTML = gameData[key].label; 
        btn.className = "table-btn";
        
        if (gameData[key].specialType === "entrance_visual") {
             btn.onclick = () => drawVisualEntrance();
        } else {
             btn.onclick = () => pickRandomItem(key);
        }
        container.appendChild(btn);
    }
}

// --- RÉGLAGES ---
function openSettings() {
    const list = document.getElementById("extensions-list");
    list.innerHTML = "";

    // A. Dé du Donjon
    const dieSection = document.createElement("div");
    dieSection.className = "settings-section";
    dieSection.innerHTML = "<h3>🎲 Dé du Donjon (Tier)</h3>";
    const dieContainer = document.createElement("div");
    dieContainer.className = "dice-selector";
    
    [6, 8, 10, 12].forEach(faces => {
        const btn = document.createElement("button");
        btn.innerHTML = `d${faces}`;
        btn.className = `die-select-btn ${currentGlobalDie === faces ? 'active' : ''}`;
        btn.onclick = () => { 
            currentGlobalDie = faces; 
            saveSettings(false); 
            openSettings(); 
        };
        dieContainer.appendChild(btn);
    });
    dieSection.appendChild(dieContainer);
    list.appendChild(dieSection);

    // B. Niveau HCL
    const hclSection = document.createElement("div");
    hclSection.className = "settings-section";
    hclSection.innerHTML = "<h3>⚔️ Niveau du Groupe (HCL)</h3>";
    
    const currentHCL = localStorage.getItem("4ad_hcl") ? parseInt(localStorage.getItem("4ad_hcl")) : 1;
    
    const hclInput = document.createElement("input");
    hclInput.type = "number";
    hclInput.id = "setting-hcl";
    hclInput.value = currentHCL;
    hclInput.min = 1;
    hclInput.max = 20;
    hclInput.style.padding = "10px";
    hclInput.style.fontSize = "1.5em";
    hclInput.style.width = "80px";
    hclInput.style.textAlign = "center";
    hclInput.style.borderRadius = "8px";
    hclInput.onchange = () => saveSettings(false); 

    hclSection.appendChild(hclInput);
    list.appendChild(hclSection);
    
    // C. Extensions
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
            saveSettings(false);
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

function saveSettings(closeModal = true) {
    localStorage.setItem("4ad_global_die", currentGlobalDie.toString());
    localStorage.setItem("4ad_extensions", JSON.stringify(activeExtensions));
    
    const hclInput = document.getElementById("setting-hcl");
    if (hclInput) {
        localStorage.setItem("4ad_hcl", hclInput.value);
    }

    generateMonsterPools(); 

    if (closeModal) {
        document.getElementById("settings-modal").style.display = "none";
    }
}

function loadSettings() {
    const savedExt = localStorage.getItem("4ad_extensions");
    activeExtensions = savedExt ? JSON.parse(savedExt) : AVAILABLE_EXTENSIONS.filter(e => e.default).map(e => e.id);
    
    const savedDie = localStorage.getItem("4ad_global_die");
    currentGlobalDie = savedDie ? parseInt(savedDie) : 6;
    
    generateMonsterPools();
}

// --- LOGIQUE MONSTRES ---
function calculateMonsterLevel(monster, currentHCL) {
    let rawLevel = resolveFormula(monster.level || "HCL", currentHCL);
    if (monster.minHCL !== undefined && rawLevel < monster.minHCL) rawLevel = monster.minHCL;
    if (monster.maxHCL !== undefined && rawLevel > monster.maxHCL) rawLevel = monster.maxHCL;
    return rawLevel;
}

function generateMonsterPools() {
    activePools = { BOSS: [], SBIRE: [], VERMINE: [], ETRANGE: [] };
    const currentHCL = parseInt(localStorage.getItem("4ad_hcl")) || 1;
    const maxDieScore = currentGlobalDie; 

    if (typeof MASTER_MONSTER_POOL !== 'undefined') {
        MASTER_MONSTER_POOL.forEach(monster => {
            if (monster.extension && !activeExtensions.includes(monster.extension)) return; 
            const realLevel = calculateMonsterLevel(monster, currentHCL);
            const maxBeatableLevel = currentHCL + maxDieScore - 1;
            if (realLevel > maxBeatableLevel) return; 
            if (activePools[monster.type]) activePools[monster.type].push(monster);
        });
    }
}

// --- BESTIAIRE ---
function renderBestiary() {
    const container = document.getElementById("bestiary-list");
    container.innerHTML = "";
    const currentHCL = parseInt(localStorage.getItem("4ad_hcl")) || 1;
    
    const typesOrder = ["BOSS", "SBIRE", "VERMINE", "ETRANGE"];
    const titles = { "BOSS": "💀 Boss", "SBIRE": "⚔️ Sbires", "VERMINE": "🐀 Nuisibles", "ETRANGE": "👁️ Étranges" };

    let foundAny = false;

    typesOrder.forEach(type => {
        const pool = activePools[type];
        if (pool && pool.length > 0) {
            foundAny = true;
            const section = document.createElement("div");
            section.className = "bestiary-section";
            
            const title = document.createElement("h3");
            title.className = "bestiary-title";
            title.innerText = `${titles[type]} (${pool.length})`;
            section.appendChild(title);
            
            pool.forEach(monster => {
                const itemDiv = document.createElement("div");
                itemDiv.className = "bestiary-item";
                const lvl = calculateMonsterLevel(monster, currentHCL);
                itemDiv.innerHTML = `<span>${monster.name}</span><span class="mon-lvl-badge">Niv ${lvl}</span>`;
                itemDiv.onclick = () => displayMonster(monster);
                section.appendChild(itemDiv);
            });
            container.appendChild(section);
        }
    });

    if (!foundAny) {
        container.innerHTML = "<div style='text-align:center; color:#777; padding:20px;'>Aucun monstre trouvé.</div>";
    }
}

// --- TIRAGE ALÉATOIRE ---
function pickRandomItem(key, forcedIndex = null) {
    resetModal();

    const categoryMap = { "boss": "BOSS", "sbires": "SBIRE", "nuisibles": "VERMINE", "monstres_etranges": "ETRANGE" };
    if (categoryMap[key]) {
        const poolType = categoryMap[key];
        const pool = activePools[poolType];
        if (!pool || pool.length === 0) {
            alert(`Aucun monstre '${poolType}' disponible (HCL: ${localStorage.getItem("4ad_hcl")}). Vérifiez vos extensions !`);
            return;
        }
        const monster = pool[getRandomInt(0, pool.length - 1)];
        displayMonster(monster);
        return; 
    }

    const tableInfo = gameData[key];
    if (!tableInfo) return;

    let chosenSourceKey = "base";
    let sourceNameDisplay = "";
    if (tableInfo.sources) {
        const possibleSources = Object.keys(tableInfo.sources).filter(srcKey => {
            return srcKey === "base" || activeExtensions.includes(srcKey);
        });
        if (possibleSources.length > 0) {
            chosenSourceKey = possibleSources[getRandomInt(0, possibleSources.length - 1)];
            if (chosenSourceKey !== "base") {
                const extObj = AVAILABLE_EXTENSIONS.find(e => e.id === chosenSourceKey);
                sourceNameDisplay = extObj ? `Source : ${extObj.name}` : "";
            }
        }
    }
    
    const sourceData = tableInfo.sources[chosenSourceKey].items;
    let item;
    let rollText = "";

    if (forcedIndex !== null) {
        let idx = forcedIndex; if (idx < 0) idx = 0; if (idx >= sourceData.length) idx = sourceData.length - 1;
        item = sourceData[idx]; rollText = `Calculé : ${idx}`;
    } else if (tableInfo.method === "2d6") {
        let d1 = rollD6(), d2 = rollD6(), tot = d1 + d2;
        item = sourceData[tot - 2]; rollText = `2d6 : ${d1}+${d2} = ${tot}`;
    } else {
        let idx = getRandomInt(0, sourceData.length - 1);
        item = sourceData[idx]; rollText = `Tirage : ${idx + 1}`;
    }

    const title = document.getElementById("modal-title");
    const diceDisplay = document.getElementById("dice-display");
    const textDisplay = document.getElementById("text-display");
    const interactionArea = document.getElementById("interaction-area");
    const sourceBadge = document.getElementById("source-badge");

    title.innerText = tableInfo.label;
    diceDisplay.innerText = rollText;
    sourceBadge.innerText = sourceNameDisplay;
    sourceBadge.style.display = sourceNameDisplay ? "inline-block" : "none";

    if (item.type === "treasure") {
        displayTreasureResult(item, textDisplay);
        addInteractionButtons(item, interactionArea);
    } else {
        let finalText = item.text || item;
        if (item.levelFormula) {
            const hcl = parseInt(localStorage.getItem("4ad_hcl")) || 1;
            const lvl = resolveFormula(item.levelFormula, hcl);
            finalText += `<br><br><div style="border:1px solid #e67e22; padding:8px; border-radius:6px; color:#e67e22;">🔒 DIFFICULTÉ : ${lvl}</div>`;
        }
        textDisplay.innerHTML = finalText;
        addInteractionButtons(item, interactionArea);
    }
    openModal();
}

// --- AFFICHAGE MONSTRE ---
function displayMonster(monsterItem) {
    resetModal(); 
    const title = document.getElementById("modal-title");
    const textDisplay = document.getElementById("text-display");
    const interactionArea = document.getElementById("interaction-area");
    
    title.innerText = "⚔️ RENCONTRE";
    document.getElementById("dice-display").innerText = ""; 
    
    const render = renderMonsterCard(monsterItem);
    textDisplay.innerHTML = render.html;

    const trackValue = (render.count > 1) ? render.count : render.pv;
    const trackLabel = (render.count > 1) ? "Ennemis restants" : `PV (Max: ${render.pv})`;
    addMonsterTracker(interactionArea, trackValue, trackLabel, monsterItem);

    addInteractionButtons(monsterItem, interactionArea);
    openModal();
}

function renderMonsterCard(monsterData) {
    const currentHCL = parseInt(localStorage.getItem("4ad_hcl")) || 1;
    
    const finalLevel = calculateMonsterLevel(monsterData, currentHCL);
    const finalPV = resolveFormula(monsterData.life || 1, currentHCL);
    const finalQty = resolveFormula(monsterData.qty || "1", currentHCL);
    
    const mName = monsterData.name || "Monstre Inconnu";
    const mType = monsterData.type || "ENNEMI";
    const mAtk = monsterData.attacks || 1;
    const mDmg = monsterData.damage || 1;
    const mMorale = monsterData.morale || "Neutre";
    const mXP = monsterData.xp || "Standard";
    const mHab = monsterData.habitat || "Inconnu";
    const mDesc = monsterData.desc || "";
    
    let mTr = "Aucun";
    if (monsterData.treasure) {
        const tCount = monsterData.treasure.rolls || 1;
        const tMod = monsterData.treasure.mod ? (monsterData.treasure.mod > 0 ? `+${monsterData.treasure.mod}` : monsterData.treasure.mod) : "";
        const tDisplayMod = tMod ? `[${tMod}]` : "";
        mTr = `${tCount}x ${tDisplayMod}`; 
    }

    let cardHTML = `
    <div class="monster-card">
        <div class="monster-header">
            <span class="monster-name">${mName}</span>
            <span class="monster-type">${mType}</span>
        </div>
        <div class="monster-stats-grid">
            <div class="stat-box"><span class="stat-label">Niveau</span><span class="stat-value">${finalLevel}</span></div>
            <div class="stat-box"><span class="stat-label">Nombre</span><span class="stat-value">${finalQty}</span></div>
            <div class="stat-box"><span class="stat-label">PV / Unité</span><span class="stat-value">${finalPV}</span></div>
            <div class="stat-box"><span class="stat-label">Attaques</span><span class="stat-value">${mAtk}</span></div>
            <div class="stat-box"><span class="stat-label">Dégâts</span><span class="stat-value">${mDmg}</span></div>
            <div class="stat-box"><span class="stat-label">Trésor</span><span class="stat-value" style="font-size:0.9em">${mTr}</span></div>
        </div>
        <div class="monster-sub-info">
            <span>🧠 Moral: <b>${mMorale}</b></span>
            <span>✨ XP: <b>${mXP}</b></span>
            <span>🌍 ${mHab}</span>
        </div>
        <div class="monster-desc">${mDesc}</div>
    </div>`;

    return { html: cardHTML, count: finalQty, pv: finalPV };
}

// --- TRACKER & MORAL ---
function addMonsterTracker(container, count, description, monsterData = null) {
    let startValue = count;
    let label = description; 
    let maxVal = startValue;
    let moraleStr = monsterData ? (monsterData.morale || "Neutre") : "Neutre";
    
    const wrapper = document.createElement("div");
    wrapper.className = "tracker-container";
    wrapper.dataset.max = maxVal;
    wrapper.dataset.morale = moraleStr;
    wrapper.dataset.checked = "false"; 
    
    wrapper.innerHTML = `
        <span class="tracker-label">${label}</span>
        <div class="tracker-controls">
            <button class="tracker-btn" onclick="updateTracker(this, -1)">-</button>
            <span class="tracker-value">${startValue}</span>
            <button class="tracker-btn" onclick="updateTracker(this, 1)">+</button>
        </div>
        <div class="morale-result"></div> 
    `;
    container.appendChild(wrapper);
}

window.updateTracker = function(btn, change) {
    const wrapper = btn.closest(".tracker-container");
    const display = wrapper.querySelector(".tracker-value");
    const moraleZone = wrapper.querySelector(".morale-result");
    
    let val = parseInt(display.innerText);
    val += change;
    if (val < 0) val = 0;
    
    display.innerText = val;
    if (val === 0) {
        display.classList.add("dead");
        display.innerHTML = "💀";
    } else {
        display.classList.remove("dead");
    }

    const max = parseInt(wrapper.dataset.max);
    const hasChecked = wrapper.dataset.checked === "true";
    const moraleStr = wrapper.dataset.morale;

    if (val > 0 && val <= (max / 2) && !hasChecked) {
        if (moraleStr === "Sans peur") {
            wrapper.dataset.checked = "true";
            return; 
        }

        let mod = 0;
        if (moraleStr !== "Neutre") {
            mod = parseInt(moraleStr) || 0;
        }

        const roll = rollD6();
        const total = roll + mod;
        let isFleeing = total <= 3;
        const sign = mod > 0 ? "+" : "";
        const modTxt = mod !== 0 ? `(${sign}${mod})` : "";
        
        let htmlResult = "";
        
        if (isFleeing) {
            htmlResult = `
            <div style="margin-top:10px; padding:8px; background:#e67e22; color:white; border-radius:6px; font-weight:bold; animation:fadeIn 0.5s;">
                🏃 ECHEC MORAL (${roll}${modTxt}=${total})<br>
                Les ennemis tentent de fuir !
            </div>`;
        } else {
            htmlResult = `
            <div style="margin-top:10px; padding:8px; background:#c0392b; color:white; border-radius:6px; font-weight:bold; animation:fadeIn 0.5s;">
                ⚔️ MORAL REUSSI (${roll}${modTxt}=${total})<br>
                Ils se battent jusqu'à la mort !
            </div>`;
        }

        moraleZone.innerHTML = htmlResult;
        wrapper.dataset.checked = "true"; 
    }
};

// --- BOUTONS D'ACTION ---
function addInteractionButtons(item, container) {
    const dCheck = `d${currentGlobalDie}`; 
    const ENEMY_TYPES = ["BOSS", "SBIRE", "VERMINE", "ETRANGE", "monster"];

    if (ENEMY_TYPES.includes(item.type)) {
        const combatBtn = document.createElement("button");
        combatBtn.className = "combat-btn";
        combatBtn.innerHTML = `⚔️ Combat (${dCheck})`; 
        combatBtn.onclick = () => rollCombat(container);
        container.appendChild(combatBtn);
    }

    if (item.reaction) {
        const reactBtn = document.createElement("button");
        reactBtn.className = "reaction-btn";
        reactBtn.innerHTML = "🎲 Réaction (d6)";
        reactBtn.onclick = () => showReaction(item);
        container.appendChild(reactBtn);
    }

    if (item.specialAction) {
        const spBtn = document.createElement("button");
        spBtn.className = "combat-btn"; 
        spBtn.style.backgroundColor = "#8e44ad"; 
        spBtn.innerHTML = item.specialAction.label;
        spBtn.onclick = () => showSpecialResult(item.specialAction.table);
        container.appendChild(spBtn);
    }

    if (item.treasure) {
        const treasureBtn = document.createElement("button");
        treasureBtn.className = "treasure-btn";
        const table = item.treasure.table || "tresors";
        const rolls = item.treasure.rolls || 1;
        const mod = item.treasure.mod || 0;
        const sign = mod > 0 ? "+" : "";
        const modText = mod === 0 ? "" : ` ${sign}${mod}`;
        
        treasureBtn.innerHTML = `💰 Trésor (${rolls}x${modText})`;
        treasureBtn.onclick = () => resolveMultipleTreasures(table, rolls, mod);
        container.appendChild(treasureBtn);
    } 

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

    if (item.minions) {
        const minionBtn = document.createElement("button");
        minionBtn.className = "combat-btn";
        minionBtn.style.backgroundColor = "#c0392b"; 
        minionBtn.style.border = "2px solid #e74c3c";
        minionBtn.innerHTML = `⚠️ Voir les ${item.minions.label} (${item.minions.qty})`;
        minionBtn.onclick = () => resolveMinions(item.minions);
        container.appendChild(minionBtn);
    }
}

function resolveMinions(minionData) {
    const textDisplay = document.getElementById("text-display"); 
    const interactionArea = document.getElementById("interaction-area");
    
    const count = parseAndCalculate(minionData.qty);
    const poolType = minionData.pool || "SBIRE";
    const pool = activePools[poolType];

    if (!pool || pool.length === 0) {
        alert(`Aucun sbire disponible.`);
        return;
    }

    const monster = pool[getRandomInt(0, pool.length - 1)];
    const currentHCL = parseInt(localStorage.getItem("4ad_hcl")) || 1;
    const finalLevel = calculateMonsterLevel(monster, currentHCL);
    const finalPV = resolveFormula(monster.life || 1, currentHCL);
    
    const minionCard = document.createElement("div");
    minionCard.style.marginTop = "15px";
    minionCard.style.padding = "10px";
    minionCard.style.backgroundColor = "#2c0b0b";
    minionCard.style.border = "2px dashed #c0392b";
    minionCard.style.borderRadius = "8px";
    minionCard.style.animation = "fadeIn 0.5s";

    minionCard.innerHTML = `
        <div style="color:#e74c3c; font-weight:bold; margin-bottom:5px; text-transform:uppercase;">⚠️ RENFORTS : ${count} x ${monster.name}</div>
        <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:5px; text-align:center; font-size:0.9em; margin-bottom:10px;">
            <div style="background:#4a1818; padding:3px; border-radius:4px;">Niv <b>${finalLevel}</b></div>
            <div style="background:#4a1818; padding:3px; border-radius:4px;">PV <b>${finalPV}</b></div>
            <div style="background:#4a1818; padding:3px; border-radius:4px;">Dmg <b>${monster.damage||1}</b></div>
        </div>
        <div style="font-style:italic; font-size:0.85em; color:#aaa; margin-bottom:10px;">${monster.desc || ""}</div>
    `;

    const trackerDiv = document.createElement("div");
    addMonsterTracker(trackerDiv, count, `Ennemis (${monster.name})`, monster);
    minionCard.appendChild(trackerDiv);

    textDisplay.appendChild(minionCard);

    const btns = interactionArea.getElementsByTagName("button");
    for(let btn of btns) {
        if(btn.innerHTML.includes(minionData.label)) {
            btn.disabled = true;
            btn.innerHTML = `✅ ${minionData.label} (En jeu)`;
            btn.style.opacity = "0.5";
        }
    }
}

// --- LOGIQUE TRÉSOR AVEC PROVENANCE ---
function getDeepestItem(item, breadcrumbs = []) {
    if (!item || typeof item === 'string') return { item: item, path: breadcrumbs };

    if (item.next && item.next.length > 0) {
        let currentName = item.name || "Autre";
        let newPath = [...breadcrumbs, currentName];

        const nextKey = item.next[0];
        const nextTable = gameData[nextKey];
        if (nextTable) {
            let chosenSourceKey = "base";
            if (nextTable.sources) {
                 const possibleSources = Object.keys(nextTable.sources).filter(k => k === "base" || activeExtensions.includes(k));
                 if(possibleSources.length > 0) chosenSourceKey = possibleSources[getRandomInt(0, possibleSources.length - 1)];
            }
            const sourceItems = nextTable.sources[chosenSourceKey] ? nextTable.sources[chosenSourceKey].items : [];
            if (sourceItems.length > 0) {
                return getDeepestItem(sourceItems[getRandomInt(0, sourceItems.length - 1)], newPath); 
            }
        }
    }
    return { item: item, path: breadcrumbs };
}

function resolveMultipleTreasures(tableKey, count, modifier) {
    const tableInfo = gameData[tableKey];
    if (!tableInfo) { alert(`Table '${tableKey}' introuvable.`); return; }

    resetModal(); 
    const title = document.getElementById("modal-title");
    const textDisplay = document.getElementById("text-display");
    const interactionArea = document.getElementById("interaction-area");

    title.innerText = `💰 BUTIN (${count} jets)`;
    
    let chosenSourceKey = "base";
    if (tableInfo.sources) {
        const possibleSources = Object.keys(tableInfo.sources).filter(k => k === "base" || activeExtensions.includes(k));
        if (possibleSources.length > 0) {
            chosenSourceKey = possibleSources[getRandomInt(0, possibleSources.length - 1)];
        }
    }

    let itemsList = tableInfo.sources[chosenSourceKey] ? tableInfo.sources[chosenSourceKey].items : [];
    let finalHTML = `<div style="text-align:left;">`;
    let totalGold = 0;

    for (let i = 0; i < count; i++) {
        const roll = rollD6();
        let total = roll + modifier;
        if (total < 1) total = 1; 
        if (total > itemsList.length) total = itemsList.length;

        let initialItem = itemsList[total - 1];
        let resultObj = getDeepestItem(initialItem);
        let finalItem = resultObj.item;
        let path = resultObj.path;
        
        let sourceText = "";
        if (path.length > 0) {
            sourceText = `<div style="font-size:0.8em; color:#aaa; font-style:italic;">(Source : ${path.join(" ➔ ")})</div>`;
        }

        let goldValue = 0;
        let itemText = "";

        if (!finalItem) {
            itemText = "Rien";
        } else if (typeof finalItem === 'string') {
            itemText = `<b>${finalItem}</b>`;
        } else if (finalItem.formula) {
            goldValue = parseAndCalculate(finalItem.formula);
            totalGold += goldValue;
            itemText = `<b>${finalItem.name}</b> <span style="color:#f1c40f;">(${goldValue} po)</span>`;
        } else {
             const name = finalItem.name || "Objet";
             const desc = finalItem.text || ""; 
             itemText = `<b>${name}</b> <br><span style="font-size:0.9em; color:#bbb;">${desc}</span>`;
        }

        const sign = modifier > 0 ? "+" : "";
        const modDisplay = modifier !== 0 ? ` (${sign}${modifier})` : "";
        
        finalHTML += `
        <div style="background:#2c3e50; padding:10px; margin-bottom:8px; border-radius:6px; border-left:4px solid #f1c40f;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <div style="color:#7f8c8d; font-size:0.75em;">Jet n°${i+1} : 🎲 ${roll}${modDisplay}</div>
                ${sourceText}
            </div>
            <div style="color:#ecf0f1; font-size:1.1em; margin-top:4px;">
                ${itemText}
            </div>
        </div>`;
    }

    finalHTML += `</div>`;

    if (totalGold > 0) {
        finalHTML += `
        <div style="margin-top:15px; padding:10px; background:#f39c12; color:#2c3e50; font-weight:bold; font-size:1.2em; border-radius:8px; text-align:center;">
            TOTAL : ${totalGold} po
        </div>`;
    }

    textDisplay.innerHTML = finalHTML;
    
    const closeBtn = document.createElement("button");
    closeBtn.className = "next-action-btn"; 
    closeBtn.innerHTML = "✅ Tout ramasser";
    closeBtn.onclick = () => document.getElementById("result-modal").style.display = "none";
    interactionArea.appendChild(closeBtn);
    openModal();
}

// --- UTILITAIRES ---
function resolveFormula(formula, currentHCL) {
    if (typeof formula === 'number') return formula; 
    if (!formula) return 0;
    let formulaStr = formula.toString().toUpperCase().replace(/HCL/g, currentHCL);
    try {
        if (formulaStr.includes("D")) {
            return parseAndCalculate(formulaStr); 
        } else {
            return eval(formulaStr); 
        }
    } catch (e) { return formula; }
}

function parseAndCalculate(text) {
    if (!text) return 0;
    const evaluatedText = text.toString().replace(/(\d*)[dD](\d+)/gi, (match, p1, p2) => {
        const number = p1 === "" ? 1 : parseInt(p1);
        const faces = parseInt(p2);
        let total = 0;
        for (let i = 0; i < number; i++) { total += Math.floor(Math.random() * faces) + 1; }
        return total;
    });
    try { return eval(evaluatedText); } catch (e) { return 0; }
}

function rollCombat(container) {
    const roll = getRandomInt(1, currentGlobalDie);
    const color = currentGlobalDie > 6 ? "#8e44ad" : "#e74c3c";
    displayUniqueResult(container, "combat-unique-res", color, "#2c0b0b", `⚔️ Attaque (d${currentGlobalDie})`, roll);
}

function showReaction(item) {
    if (!item || !item.reaction) return;
    const old = document.getElementById("reaction-res");
    if (old) old.remove();
    const roll = rollD6();
    let index = roll - 1;
    if (index >= item.reaction.length) index = item.reaction.length - 1;
    
    const div = document.createElement("div");
    div.id = "reaction-res";
    div.className = "dynamic-result-text";
    div.style.borderColor = "#4a90e2";
    div.style.color = "#4a90e2";
    div.innerHTML = `<strong>Réaction (${roll}) :</strong> ${item.reaction[index]}`;
    document.getElementById("interaction-area").appendChild(div);
}

function displayTreasureResult(item, target) {
    let content = "";
    if (item.formula) {
        const value = parseAndCalculate(item.formula);
        content = `<strong>${item.name}</strong><br><br><span style="font-size:1.8em; color:#f1c40f">${value} po</span>`;
    } else {
        content = `<strong>${item.name}</strong>`;
    }
    target.innerHTML = content;
}

function showSpecialResult(tableKey) {
    const table = gameData[tableKey];
    if (!table) return;
    const items = table.sources['base'].items; 
    let result, roll = 0;

    if (items.length === 1) {
        result = items[0]; 
    } else {
        roll = rollD6();
        let index = roll - 1;
        if (index >= items.length) index = items.length - 1;
        result = items[index];
    }
    
    const ENEMY_TYPES = ["BOSS", "SBIRE", "VERMINE", "ETRANGE", "monster"];
    let displayHTML = ENEMY_TYPES.includes(result.type) ? `<strong>${parseAndCalculate(result.qty)} ${result.name}</strong><br>${result.desc}` : (result.text || result);

    const div = document.createElement("div");
    div.className = "dynamic-result-text";
    div.style.borderColor = "#8e44ad"; 
    div.innerHTML = `<strong>Résultat ${roll > 0 ? '('+roll+')' : ''} :</strong> ${displayHTML}`;
    document.getElementById("interaction-area").appendChild(div);
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
    box.innerHTML = `${label} : <span style="font-size:1.5em">${value}</span>`;
    box.style.animation = 'none';
    box.offsetHeight; 
    box.style.animation = 'fadeIn 0.2s';
}

function getRandomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function rollD6() { return getRandomInt(1, 6); }
function resetModal() { 
    document.getElementById("interaction-area").innerHTML = ""; 
    document.getElementById("text-display").innerHTML = ""; 
    document.getElementById("dice-display").innerText = "";
    document.getElementById("modal-image").style.display = "none";
    document.getElementById("source-badge").style.display = "none";
    currentMonster = null;
}
function openModal() { document.getElementById("result-modal").style.display = "block"; }

function showQuickDice(faces) {
    resetModal();
    const title = document.getElementById("modal-title");
    const textDisplay = document.getElementById("text-display");
    title.innerText = `Lancer de D${faces}`;
    let result = getRandomInt(1, faces);
    textDisplay.innerHTML = `<div style="text-align:center; margin:20px 0;"><span style="font-size:4em; font-weight:bold; color:#e67e22;">${result}</span></div>`;
    openModal();
}

function drawNewTile() {
    resetModal();
    const title = document.getElementById("modal-title");
    const diceDisplay = document.getElementById("dice-display");
    const modalImage = document.getElementById("modal-image");
    const interactionArea = document.getElementById("interaction-area");

    const imageNumber = getRandomInt(7, 43);
    title.innerText = "Nouvelle Pièce";
    diceDisplay.innerText = `Visuel n° ${imageNumber}`;
    modalImage.src = `images/${imageNumber}.png`; 
    modalImage.style.display = "block";

    let nextTableKey = CORRIDOR_IDS.includes(parseInt(imageNumber)) ? "gen_couloir" : "gen_salle";
    const nextTable = gameData[nextTableKey];
    if (nextTable) {
        const nextBtn = document.createElement("button");
        nextBtn.className = "next-action-btn";
        nextBtn.innerHTML = `➡️ Peupler ${nextTableKey === "gen_couloir" ? "Couloir" : "Salle"}`;
        nextBtn.onclick = () => pickRandomItem(nextTableKey);
        interactionArea.appendChild(nextBtn);
    }
    openModal();
}

function drawVisualEntrance() {
    resetModal();
    const title = document.getElementById("modal-title");
    const modalImage = document.getElementById("modal-image");
    const interactionArea = document.getElementById("interaction-area");
    const imageNumber = getRandomInt(1, 6);
    title.innerText = "Entrée";
    modalImage.src = `images/${imageNumber}.png`; 
    modalImage.style.display = "block";
    const nextBtn = document.createElement("button");
    nextBtn.className = "next-action-btn";
    nextBtn.innerHTML = `➡️ Explorer`;
    nextBtn.onclick = () => drawNewTile(); 
    interactionArea.appendChild(nextBtn);
    openModal();
}
