/* data.js - Structure Multi-Sources Organisée */

// =============================================================================
// 1. CONFIGURATION DES EXTENSIONS
// =============================================================================
const AVAILABLE_EXTENSIONS = [
    { id: "base", name: "Système de base", default: true },
    { id: "mt_base", name: "Monstres et Trésors (Base)", default: true },
    { id: "diaboliques", name: "Extension : Ennemis Diaboliques", default: false }
];

// =============================================================================
// 2. DONNÉES DU JEU (gameData)
// =============================================================================
const gameData = {

    /* -------------------------------------------------------------------------
       A. GÉNÉRATION DU DONJON (Entrée, Salles, Couloirs)
       ------------------------------------------------------------------------- */
    
    "gen_entree_visuel": {
        label: "🚪 Générer Entrée (Visuel 1-6)",
        specialType: "entrance_visual" 
    },

    "gen_salle": {
        label: "🏰 Générer Salle",
        method: "2d6",
        sources: {
            "base": {
                items: [
                    { text: "Trésor découvert !", next: ["tresors"] }, // 2
                    { text: "Trésor protégé par un piège.", next: ["pieges", "tresors"] }, // 3
                    { text: "Événements.", next: ["evenements_speciaux"] }, // 4
                    { text: "Éléments spéciaux.", next: ["elements_speciaux"] }, // 5
                    { text: "Des Nuisibles !", next: ["nuisibles"] }, // 6
                    { text: "Des Sbires !", next: ["sbires"] }, // 7
                    { text: "Sbires.", next: ["sbires"] }, // 8
                    { text: "Vide.", next: null }, // 9
                    { text: "Monstres étranges.", next: ["monstres_etranges"] }, // 10
                    { text: "Boss ! (+1 par boss rencontré).", next: ["boss"] }, // 11
                    { text: "Antre de dragon.", next: ["boss"] } // 12
                ]
            }
        }
    },

    "gen_couloir": {
        label: "longue Générer Couloir",
        method: "2d6",
        sources: {
            "base": {
                items: [
                    { text: "Trésor découvert !", next: ["tresors"] },
                    { text: "Trésor protégé par un piège.", next: ["pieges", "tresors"] },
                    { text: "Le couloir est vide.", next: null },
                    { text: "Vide. Éléments spéciaux.", next: ["elements_speciaux"] },
                    { text: "Des Nuisibles !", next: ["nuisibles"] },
                    { text: "Des Sbires !", next: ["sbires"] },
                    { text: "Le couloir est vide.", next: null },
                    { text: "Le couloir est vide.", next: null },
                    { text: "Le couloir est vide.", next: null },
                    { text: "Boss !", next: ["boss"] },
                    { text: "Le couloir est vide.", next: null }
                ]
            }
        }
    },

    "fouille": {
        label: "🔍 Fouille (Salle vide)",
        sources: {
            "base": {
                items: [
                    { text: "⚠️ Des monstres errants attaquent !", next: ["monstres_errants"] },
                    "La salle est vide.", 
                    "La salle est vide.", 
                    "La salle est vide.",
                    
                    // 5 et 6 : Le Choix
                    { 
                        text: "✨ <b>CHOIX :</b><br>1️⃣ <b>Indice</b> (Notez-le).<br>2️⃣ <b>Porte Secrète</b> (Regardez le plan).<br>3️⃣ <b>Trésor Caché</b> (Cliquez ci-dessous pour voir les risques).", 
                        next: ["complications_tresor"] // Envoie vers la table ci-dessus
                    },
                    { 
                        text: "✨ <b>CHOIX :</b><br>1️⃣ <b>Indice</b> (Notez-le).<br>2️⃣ <b>Porte Secrète</b> (Regardez le plan).<br>3️⃣ <b>Trésor Caché</b> (Cliquez ci-dessous pour voir les risques).", 
                        next: ["complications_tresor"] 
                    }
                ]
            }
        }
    },


    /* -------------------------------------------------------------------------
       B. TABLES DE MONSTRES (Base + Extensions)
       ------------------------------------------------------------------------- */

    "nuisibles": {
        label: "🐀 Table des Nuisibles",
        sources: {
            "mt_base": {
                items: [
                    // 1. Rats Géants
                    { type: "monster", name: "Rats Géants", qty: "3d6", desc: "<b>(Niv 1)</b>. Pas de trésor.<br>⚠️ <b>Infection :</b> Tout personnage blessé a 1 chance sur 6 de perdre 1 PV supplémentaire.", treasureMod: null, reaction: ["Fuir", "Fuir", "Fuir", "Se battre", "Se battre", "Se battre"] },
                    // 2. Chauves-souris
                    { type: "monster", name: "Chauves-souris Vampires", qty: "3d6", desc: "<b>(Niv 1)</b>. Pas de trésor. (Non Morts-vivants).<br>🔊 <b>Cris :</b> Les sorts sont lancés à -1.", treasureMod: null, reaction: ["Fuir", "Fuir", "Fuir", "Se battre", "Se battre", "Se battre"] },
                    // 3. Gobelins de colonie
                    { type: "monster", name: "Gobelins de colonie", qty: "2d6", desc: "<b>(Niv 3)</b>. Trésor -1. Moral -1.", treasureMod: -1, reaction: ["Fuir", "Fuir si en sous-nombre", "Fuir si en sous-nombre", "Soudoyer (5 po/tête)", "Se battre", "Se battre"] },
                    // 4. Mille-pattes
                    { type: "monster", name: "Mille-pattes géants", qty: "1d6", desc: "<b>(Niv 3)</b>. Pas de trésor.<br>☠️ <b>Poison :</b> Blessé = Jet de Sauvegarde poison Niv 2 ou perdre 1 PV sup.", treasureMod: null, reaction: ["Fuir", "Fuir si en sous-nombre", "Fuir si en sous-nombre", "Se battre", "Se battre", "Se battre"] },
                    // 5. Grenouilles
                    { type: "monster", name: "Grenouilles vampires", qty: "1d6", desc: "<b>(Niv 4)</b>. Trésor -1. (Non Morts-vivants).", treasureMod: -1, reaction: ["Fuir", "Se battre", "Se battre", "Se battre", "Se battre jusqu'à la mort", "Se battre jusqu'à la mort"] },
                    // 6. Rats Squelettes
                    { type: "monster", name: "Rats squelettes", qty: "2d6", desc: "<b>(Niv 3 Morts-vivants)</b>. Pas de trésor.<br>🔨 <b>Armes écrasantes :</b> +1 Attaque.<br>🚫 <b>Arcs/Frondes :</b> Inutiles.", treasureMod: null, reaction: ["Fuir", "Fuir", "Se battre", "Se battre", "Se battre", "Se battre"] }
                ]
            },
            "diaboliques": {
                items: [
                    // 1. Araignées
                    { type: "monster", name: "Araignées", qty: "3d6+3", desc: "<b>(Niv 3)</b>. Trésor -1 (Toiles).<br>🕸️ <b>Toiles :</b> Fuite impossible (sauf Boule de feu).<br>☠️ <b>Poison :</b> Blessure = Save Niv 3 ou -1 PV fin combat.<br>🔨 <b>Armes écrasantes :</b> +1 Attaque.", treasureMod: -1, reaction: ["Se battre", "Se battre", "Se battre", "Se battre", "Se battre", "Se battre"] },
                    // 2. Stirges
                    { type: "monster", name: "Stirges", qty: "2d6+2", desc: "<b>(Niv 4)</b>. Pas de trésor.<br>🩸 <b>Succion :</b> Blessure = -1 PV auto chaque tour jusqu'à la mort des stirges.", treasureMod: null, reaction: ["Se battre", "Se battre", "Se battre", "Se battre", "Se battre", "Se battre"] },
                    // 3. Serpents
                    { type: "monster", name: "Serpents Géants", qty: "1d6+4", desc: "<b>(Niv 5)</b>. Trésor Normal.<br>🐍 <b>Poison :</b> Blessure = Save Niv 4 ou -1 PV sup.", treasureMod: 0, reaction: ["Pacifique", "Pacifique", "Se battre", "Se battre", "Se battre", "Se battre"] },
                    // 4. Crapauds
                    { type: "monster", name: "Crapauds Géants", qty: "1d6+4", desc: "<b>(Niv 5)</b>. Pas de trésor.<br>💥 <b>Explosion :</b> Tuer au contact = Save Poison Niv 3 ou -1 PV (sauf arc/sort).", treasureMod: null, reaction: ["Pacifique", "Pacifique", "Pacifique", "Se battre", "Se battre", "Se battre"] },
                    // 5. Squelettes en Armure
                    { type: "monster", name: "Squelettes en Armure", qty: "2d3+4", desc: "<b>(Niv 5 Morts-vivants)</b>. Trésor -1.<br>🛡️ <b>Armure :</b> Pas de bonus écrasant. Arc à -1.", treasureMod: -1, reaction: ["Se battre jusqu’à la mort", "Se battre jusqu’à la mort", "Se battre jusqu’à la mort", "Se battre jusqu’à la mort", "Se battre jusqu’à la mort", "Se battre jusqu’à la mort"] },
                    // 6. Hommes-Boucs
                    { type: "monster", name: "Hommes-Boucs", qty: "2d3+1", desc: "<b>(Niv 6)</b>. Trésor Normal. Moral +2.<br>🐐 <b>Charge :</b> Niv 8 au 1er tour !", treasureMod: 0, reaction: ["Soudoyer (30 po)", "Se battre", "Se battre", "Se battre", "Se battre", "Se battre jusqu’à la mort"] }
                ]
            }
        }
    },

    "sbires": {
        label: "👹 Table des Sbires",
        sources: {
            "mt_base": {
                items: [
                    // 1. Squelettes
                    { type: "monster", name: "Squelettes", qty: "1d6+2", desc: "<b>(Niv 3 Morts-vivants)</b>. Pas de trésor. Pas de moral.<br>🔨 <b>Armes écrasantes :</b> +1 Attaque.<br>🏹 <b>Flèches :</b> -1 Attaque.", treasureMod: null, reaction: ["Se battre jusqu’à la mort", "Se battre jusqu’à la mort", "Se battre jusqu’à la mort", "Se battre jusqu’à la mort", "Se battre jusqu’à la mort", "Se battre jusqu’à la mort"] },
                    // 2. Zombies
                    { type: "monster", name: "Zombies", qty: "1d6", desc: "<b>(Niv 3 Morts-vivants)</b>. Pas de trésor. Pas de moral.<br>🏹 <b>Flèches :</b> -1 Attaque.", treasureMod: null, reaction: ["Se battre jusqu’à la mort", "Se battre jusqu’à la mort", "Se battre jusqu’à la mort", "Se battre jusqu’à la mort", "Se battre jusqu’à la mort", "Se battre jusqu’à la mort"] },
                    // 3. Gobelins
                    { type: "monster", name: "Gobelins", qty: "1d6+3", desc: "<b>(Niv 3)</b>. Trésor -1.<br>⚡ <b>Surprise :</b> 1 chance sur 6 d'agir avant le groupe.", treasureMod: -1, reaction: ["Fuir si sous-nombre", "Soudoyer (5 po/tête)", "Soudoyer (5 po/tête)", "Se battre", "Se battre", "Se battre"] },
                    // 4. Hobgobelins
                    { type: "monster", name: "Hobgobelins", qty: "1d6", desc: "<b>(Niv 4)</b>. Trésor +1.", treasureMod: 1, reaction: ["Fuir si sous-nombre", "Soudoyer (10 po/tête)", "Soudoyer (10 po/tête)", "Se battre", "Se battre", "Se battre jusqu’à la mort"] },
                    // 5. Orcs
                    { type: "monster", name: "Orcs", qty: "1d6+1", desc: "<b>(Niv 4)</b>. Trésor Normal.<br>😱 <b>Peur :</b> Test Moral si tué par magie (à -1 si groupe < 50%).<br>🚫 <b>Magie :</b> Pas d'objets magiques (Remplacer par d6 x d6 po).", treasureMod: 0, reaction: ["Soudoyer (10 po/tête)", "Soudoyer (10 po/tête)", "Se battre", "Se battre", "Se battre", "Se battre jusqu’à la mort"] },
                    // 6. Trolls
                    { type: "monster", name: "Trolls", qty: "1d3", desc: "<b>(Niv 5)</b>. Trésor Normal.<br>♻️ <b>Régénération :</b> Sauf si tué par sort/acide ou découpé (Action). Sinon revient sur 5-6.", treasureMod: 0, reaction: ["Se battre", "Se battre", "Se battre jusqu’à la mort", "Se battre jusqu’à la mort", "Se battre jusqu’à la mort", "Se battre jusqu’à la mort (Auto si Nain)"] },
                    // 7. Champignhommes
                    { type: "monster", name: "Champignhommes", qty: "2d6", desc: "<b>(Niv 3)</b>. Trésor Normal.<br>🍄 <b>Poison :</b> Dégâts = Save Poison Niv 3 ou -1 PV.<br><i>(Halfelins ajoutent leur niveau).</i>", treasureMod: 0, reaction: ["Soudoyer (d6 po/tête)", "Soudoyer (d6 po/tête)", "Se battre", "Se battre", "Se battre", "Se battre"] }
                ]
            },
            "diaboliques": {
                items: [
                    // 1. Pillards Orcs
                    { type: "monster", name: "Pillards Orcs", qty: "1d6+6", desc: "<b>(Niv 5)</b>. 3 Trésors à -1.<br>😱 <b>Peur Magie :</b> Moral si tué par sort (-1 si < 50%).", treasureMod: -1, reaction: ["Soudoyer (40 po)", "Se battre", "Se battre jusqu’à la mort", "Se battre jusqu’à la mort", "Se battre jusqu’à la mort", "Se battre jusqu’à la mort"] },
                    // 2. Cockatrices
                    { type: "monster", name: "Cockatrices", qty: "1d3+4", desc: "<b>(Niv 5)</b>. Trésor Normal.<br>🗿 <b>Pétrification :</b> Blessure = Save Niv 2 ou Pétrifié (Soin: Bénédiction).", treasureMod: 0, reaction: ["Se battre jusqu’à la mort", "Se battre jusqu’à la mort", "Se battre jusqu’à la mort", "Se battre jusqu’à la mort", "Se battre jusqu’à la mort", "Se battre jusqu’à la mort"] },
                    // 3. Nains Possédés
                    { type: "monster", name: "Nains Possédés", qty: "1d6+3", desc: "<b>(Niv 5 Morts-vivants)</b>. Trésor Normal.<br>👿 <b>Tenace :</b> Mort sur 1-2. Sur 3-6, attaque encore une fois !", treasureMod: 0, reaction: ["Soudoyer (30 po)", "Soudoyer (30 po)", "Se battre", "Se battre", "Se battre", "Se battre jusqu’à la mort"] },
                    // 4. Gnolls
                    { type: "monster", name: "Gnolls", qty: "2d3+4", desc: "<b>(Niv 6)</b>. Trésor Normal. Moral +1.<br>🩸 <b>Frénésie :</b> Niv 7 contre les blessés.", treasureMod: 0, reaction: ["Soudoyer (20 po)", "Soudoyer (20 po)", "Se battre", "Se battre", "Se battre jusqu’à la mort", "Se battre jusqu’à la mort"] },
                    // 5. Maîtrelames Hobgobelins
                    { type: "monster", name: "Maîtrelames Hobgobelins", qty: "2d3+2", desc: "<b>(Niv 6)</b>. Trésor +1.<br>⚔️ <b>Contre-attaque :</b> Si vous faites 1 au dé (contact), subissez une attaque bonus.", treasureMod: 1, reaction: ["Soudoyer (30 po)", "Soudoyer (30 po)", "Soudoyer (30 po)", "Se battre", "Se battre", "Se battre jusqu’à la mort"] },
                    // 6. Esclavagistes
                    { type: "monster", name: "Esclavagistes du Chaos", qty: "2d3+2", desc: "<b>(Niv 7)</b>. 2 Trésors. Moral +1.<br>⛓️ <b>Piège :</b> Résolvez un Piège à Ours (Niv 4) avant le combat (sauf errants).", treasureMod: 0, reaction: ["Soudoyer (40 po)", "Soudoyer (40 po)", "Soudoyer (40 po)", "Se battre", "Se battre", "Se battre"] }
                ]
            }
        }
    },

    "monstres_etranges": {
        label: "🐉 Monstres Étranges",
        sources: {
            "mt_base": {
                items: [
                    // 1. Minotaure
                    { type: "monster", name: "Minotaure", qty: "1", desc: "<b>(Niv 5, 4 PV, 2 Atq)</b>. Trésor Normal.<br>🐂 <b>Charge :</b> Votre 1er jet de Défense est à -1.<br><i>Déteste les Halfelins.</i>", treasureMod: 0, reaction: ["Soudoyer (60 po)", "Soudoyer (60 po)", "Se battre", "Se battre", "Se battre", "Se battre jusqu’à la mort"] },
                    // 2. Dévoreur d'acier
                    { type: "monster", name: "Dévoreur d’acier", qty: "1", desc: "<b>(Niv 3, 4 PV, 3 Atq)</b>. Pas de trésor.<br>🛡️ <b>Mangeur de métal :</b> Ignore Armure Lourde.<br>⚠️ <b>Touche = Détruit objet :</b> Armure ➔ Bouclier ➔ Arme ➔ 3d6 po (Pas de dégâts PV).", treasureMod: null, reaction: ["Fuir", "Soudoyer (d6 po - Pas d'Or des fous)", "Soudoyer (d6 po)", "Se battre", "Se battre", "Se battre"] },
                    // 3. Chimère
                    { type: "monster", name: "Chimère", qty: "1", desc: "<b>(Niv 5, 6 PV, 3 Atq)</b>. Trésor Normal.<br>🔥 <b>Souffle (1-2 sur d6) :</b> Remplace les attaques. Tout le monde fait un Save Feu Niv 4 ou perd 1 PV.", treasureMod: 0, reaction: ["Soudoyer (50 po)", "Se battre", "Se battre", "Se battre", "Se battre", "Se battre"] },
                    // 4. Catoblépas
                    { type: "monster", name: "Catoblépas", qty: "1", desc: "<b>(Niv 4, 4 PV)</b>. Trésor +1.<br>👁️ <b>Regard (Début du combat) :</b> Tous les persos font un Save Niv 4 ou perdent 1 PV.", treasureMod: 1, reaction: ["Fuir", "Se battre", "Se battre", "Se battre", "Se battre", "Se battre"] },
                    // 5. Araignée géante
                    { type: "monster", name: "Araignée géante", qty: "1", desc: "<b>(Niv 5, 3 PV, 2 Atq)</b>. <b>2 Jets de Trésor !</b><br>🕸️ <b>Toiles :</b> Fuite impossible (sauf Boule de feu).<br>☠️ <b>Poison :</b> Blessure = Save Niv 3 ou -1 PV sup.", treasureMod: 0, reaction: ["Se battre", "Se battre", "Se battre", "Se battre", "Se battre", "Se battre"] },
                    // 6. Gremlins
                    { text: "<b>6. Gremlins Invisibles</b><br>Ils volent <b>d6+3 objets</b> !<br><b>Ordre de vol :</b> Magique ➔ Parchemin ➔ Potion ➔ Arme ➔ Gemme ➔ Pièces (paquet de 10).<br><i>Impossibles à combattre. Pas d'XP.</i><br>(S'ils volent TOUT : Vous gagnez un Indice)." }
                ]
            },
            "diaboliques": {
                items: [
                    // 1. Doppleganger
                    { type: "monster", name: "Doppleganger", qty: "1", desc: "<b>(Niv 5, 5 PV)</b>. Trésor Normal.<br>🎭 <b>Copie :</b> Prend l'apparence d'un PJ.<br>😵 <b>Confusion :</b> Chaque tour, faites un Save Niv 4 pour attaquer.<br><i>Le PJ copié attaque normalement.</i>", treasureMod: 0, reaction: ["Se battre", "Se battre", "Se battre", "Se battre", "Se battre", "Se battre"] },
                    // 2. Manterôdeur
                    { type: "monster", name: "Manterôdeur", qty: "1", desc: "<b>(Niv 6, 5 PV)</b>. Pas de trésor. (Jamais errant).<br>👀 <b>Plafond :</b> Repérer sur 1-2 (1-4 si Roublard) = Fuite possible.<br>😱 <b>Embuscade :</b> Save Esquive Niv 3 (-1 Lourde, +1 Elfe/Roub).<br><b>Échec :</b> Paralysé et -1 PV auto chaque tour.", treasureMod: null, reaction: ["Se battre jusqu’à la mort", "Se battre jusqu’à la mort", "Se battre jusqu’à la mort", "Se battre jusqu’à la mort", "Se battre jusqu’à la mort", "Se battre jusqu’à la mort"] },
                    // 3. Limon vert
                    { type: "monster", name: "Limon vert", qty: "1", desc: "<b>(Niv 6, 8 PV, 3 Atq)</b>. Pas de trésor.<br>🤢 <b>Maladie :</b> Touche = Save Maladie Niv 4 (Halfelin +½).<br><b>Effet :</b> Chaque fois que vous perdez 1 PV, perdez-en un autre.<br><i>Soin : Bénédiction. Mort = Devient Limon.</i>", treasureMod: null, reaction: ["Se battre jusqu’à la mort", "Se battre jusqu’à la mort", "Se battre jusqu’à la mort", "Se battre jusqu’à la mort", "Se battre jusqu’à la mort", "Se battre jusqu’à la mort"] },
                    // 4. Cube acide
                    { type: "monster", name: "Cube acide", qty: "1", desc: "<b>(Niv 6, 6 PV)</b>. <b>3 Trésors</b>.<br>🧊 <b>Transparent :</b> Attaque en 1er sur 1-3.<br>📦 <b>Engloutissement :</b> Save Niv 2 (Niv 4 si attaqué au CàC) ou paralysé.<br>🚫 <b>Immune :</b> Sommeil, Éclair. Pas de bonus Roublard.", treasureMod: 0, reaction: ["Se battre jusqu’à la mort", "Se battre jusqu’à la mort", "Se battre jusqu’à la mort", "Se battre jusqu’à la mort", "Se battre jusqu’à la mort", "Se battre jusqu’à la mort"] },
                    // 5. Golem de chair
                    { type: "monster", name: "Golem de chair", qty: "1", desc: "<b>(Niv 7, 8 PV, 2 Atq)</b>. Trésor Normal. Moral +2.<br>🛡️ <b>Immune :</b> Écrasant et Sorts (Sauf Boule de Feu).<br>💥 <b>Brutal :</b> Si vous faites 1 en Défense = 2 Dégâts.", treasureMod: 0, reaction: ["Pacifique", "Pacifique", "Se battre", "Se battre", "Se battre", "Se battre"] },
                    // 6. Monstre aux cimeterres
                    { type: "monster", name: "Monstre aux cimeterres", qty: "1", desc: "<b>(Niv 8, 12 PV, 2 Atq)</b>. <b>2 Trésors +1</b>.<br>⚔️ <b>Lames :</b> Bras-cimeterres.<br>🚫 <b>Immune :</b> Sommeil.<br><i>Si Nain dans le groupe : Combat à mort.</i>", treasureMod: 1, reaction: ["Soudoyer (250 po)", "Soudoyer (250 po)", "Se battre", "Se battre", "Se battre jusqu’à la mort", "Se battre jusqu’à la mort"] }
                ]
            }
        }
    },

    "boss": {
        label: "💀 Table des Boss",
        sources: {
            "mt_base": {
                items: [
                    // 1. Momie
                    { type: "monster", name: "Momie", qty: "1", desc: "<b>(Niv 5 Mort-vivant, 4 PV, 2 Atq)</b>. Trésor +2.<br>☣️ <b>Malédiction :</b> Si tué par Momie, le perso devient Momie.<br>🔥 <b>Boule de feu :</b> Attaque à +2 contre elle.<br><i>Pas de moral.</i>", treasureMod: 2, reaction: ["Se battre", "Se battre", "Se battre", "Se battre", "Se battre", "Se battre"] },
                    // 2. Brute Orque
                    { type: "monster", name: "Brute Orque", qty: "1", desc: "<b>(Niv 5, 5 PV, 2 Atq)</b>. Trésor +1.<br>🚫 <b>Pas d'objets magiques :</b> Si le trésor indique un objet magique, remplacez par <b>2d6 x d6 po</b>.", treasureMod: 1, reaction: ["Soudoyer (50 po)", "Se battre", "Se battre", "Se battre", "Se battre", "Se battre jusqu’à la mort"] },
                    // 3. Ogre
                    { type: "monster", name: "Ogre", qty: "1", desc: "<b>(Niv 5, 6 PV)</b>. Trésor Normal.<br>💢 <b>Brutal :</b> Inflige <b>2 Dégâts</b> par coup !", treasureMod: 0, reaction: ["Soudoyer (30 po)", "Se battre", "Se battre", "Se battre jusqu’à la mort", "Se battre jusqu’à la mort", "Se battre jusqu’à la mort"] },
                    // 4. Méduse
                    { type: "monster", name: "Méduse", qty: "1", desc: "<b>(Niv 4, 4 PV)</b>. Trésor +1.<br>🗿 <b>Regard (Début combat) :</b> Save Niv 4 ou <b>Pétrifié</b> (Hors-jeu).<br><i>(Roublards +½ niv. Soin : Bénédiction).</i>", treasureMod: 1, reaction: ["Soudoyer (6d6 po)", "Propose une Quête (Allez au menu)", "Se battre", "Se battre", "Se battre", "Se battre jusqu’à la mort"] },
                    // 5. Seigneur du Chaos (Base)
                    { type: "monster", name: "Seigneur du Chaos", qty: "1", desc: "<b>(Niv 6, 4 PV, 3 Atq)</b>. <b>2 Trésors à +1</b>.<br>🎲 <b>Mort du Boss :</b> Sur 5-6 au d6, trouvez un Indice.", treasureMod: 1, specialAction: { label: "⚡ Déterminer Pouvoir (d6)", table: "pouvoirs_chaos" }, reaction: ["Fuir si sous-nombre", "Se battre", "Se battre jusqu’à la mort", "Se battre jusqu’à la mort", "Se battre jusqu’à la mort", "Se battre jusqu’à la mort"] },
                    // 6. Petit Dragon
                    { type: "monster", name: "Petit Dragon", qty: "1", desc: "<b>(Niv 6, 5 PV, 2 Atq)</b>. <b>3 Trésors à +1</b>.<br>🔥 <b>Chaque tour (1-2 sur d6) :</b> Souffle ! (Save Niv 6 ou 1 Dégât).<br>🦷 <b>Sinon :</b> 2 Attaques (Morsures).", treasureMod: 1, reaction: ["Endormi (+2 à votre 1ère attaque)", "Soudoyer (Tout l'or, min 100po / ou Obj Magique)", "Soudoyer (Tout l'or, min 100po / ou Obj Magique)", "Se battre", "Se battre", "Propose une Quête"] }
                ]
            },
            "diaboliques": {
                items: [
                    // 1. Seigneur du Chaos (Diabolique)
                    { type: "monster", name: "Seigneur du Chaos (Diabolique)", qty: "1", desc: "<b>(Niv 6, 7 PV, 3 Atq)</b>. <b>3 Trésors</b>.<br>⚡ <b>Pouvoirs :</b> (1-4 Œil, 5 Drain, 6 Flammes).<br>⛓️ <b>Esclaves :</b> Libérés a la fin du combat = Indice mais jet Monstres Errants.", treasureMod: 0, specialAction: { label: "⚡ Déterminer Pouvoir (d6)", table: "pouvoirs_chaos" }, reaction: ["Soudoyer (200 po)", "Soudoyer (200 po)", "Se battre jusqu’à la mort", "Se battre jusqu’à la mort", "Se battre jusqu’à la mort", "Se battre jusqu’à la mort"] },
                    // 2. Démon Squelette
                    { type: "monster", name: "Démon Squelette", qty: "1", desc: "<b>(Niv 7 Mort-vivant, 8 PV, 2 Atq)</b>. <b>3 Trésors</b>. Moral +1.<br>🩸 <b>Sang Maudit :</b> Chaque fois que VOUS êtes blessé, un Squelette apparaît !", treasureMod: 0, specialAction: { label: "💀 Sang : Invoquer Squelette", table: "invocation_squelette_armure" }, reaction: ["Défi magique", "Défi magique", "Se battre", "Se battre", "Se battre", "Quête"] },
                    // 3. Commandant Hobgobelin
                    { type: "monster", name: "Commandant Hobgobelin", qty: "1", desc: "<b>(Niv 7, 8 PV, 2 Atq)</b>. <b>2 Trésors</b>.<br>⚔️ <b>Lame Vibrante :</b> À chaque attaque du Boss, 3 chances sur 6 que des Maîtrelames arrivent.", treasureMod: 0, specialAction: { label: "⚔️ Appel : Invoquer Maîtrelames", table: "invocation_maitrelame" }, reaction: ["Soudoyer (400 po)", "Soudoyer (400 po)", "Soudoyer (400 po)", "Se battre jusqu’à la mort", "Se battre jusqu’à la mort", "Se battre jusqu’à la mort"] },
                    // 4. Apparition
                    { type: "monster", name: "Apparition", qty: "1", desc: "<b>(Niv 7 Mort-vivant, 6 PV)</b>. <b>2 Trésors</b>.<br>🕯️ <b>Noir (2/6) :</b> Lanternes éteintes.<br>😱 <b>Touche :</b> Save Magie Niv 4 ou Perte 1 Niveau.<br>🛡️ <b>Immunité :</b> Armes magiques/argent/feu/eau bénite seulement.", treasureMod: 0, reaction: ["Soudoyer (Objet Magique)", "Soudoyer (Objet Magique)", "Quête", "Se battre", "Se battre", "Se battre"] },
                    // 5. Troll Massif
                    { type: "monster", name: "Troll Massif", qty: "1", desc: "<b>(Niv 8, 7 PV, 2 Atq)</b>. <b>4 Trésors</b>.<br>🔨 <b>Résistant :</b> Écrasant à -1.<br>♻️ <b>Régénération :</b> 1 PV/tour (Sauf feu/acide/découpe).", treasureMod: 0, reaction: ["Soudoyer (250 po)", "Soudoyer (250 po)", "Soudoyer (250 po)", "Soudoyer (250 po)", "Se battre jusqu’à la mort", "Se battre jusqu’à la mort"] },
                    // 6. Jeune Dragon Rouge
                    { type: "monster", name: "Jeune Dragon Rouge", qty: "1", desc: "<b>(Niv 9, 8 PV, 2 Atq)</b>. <b>4 Trésors +1</b>.<br>🔥 <b>1er Tour :</b> Souffle Feu (Save Niv 7 ou d3 Dégâts).<br>Ensuite : 2 Attaques.", treasureMod: 1, reaction: ["Endormi (+2 à votre 1ère attaque)", "Soudoyer (300 po)", "Soudoyer (300 po)", "Se battre", "Se battre", "Quête"] }
                ]
            }
        }
    },

    "monstres_errants": {
        label: "⚔️ Monstres Errants",
        sources: {
            "base": {
                items: [
                    { text: "Attaque de Nuisibles !", next: ["nuisibles"] },
                    { text: "Attaque de Nuisibles !", next: ["nuisibles"] },
                    { text: "Attaque de Sbires !", next: ["sbires"] },
                    { text: "Attaque de Sbires !", next: ["sbires"] },
                    { text: "Attaque de Monstres étranges !", next: ["monstres_etranges"] },
                    { text: "Attaque de Boss ! <br><i>(Si Petit Dragon : Relancez).</i><br>⚠️ Ne peut PAS être le Boss Final.", next: ["boss"] }
                ]
            }
        }
    },

    /* -------------------------------------------------------------------------
       C. ÉVÉNEMENTS, PIÈGES ET ÉLÉMENTS SPÉCIAUX
       ------------------------------------------------------------------------- */

    "pieges": {
        label: "⚠️ Table des Pièges",
        sources: {
            "base": {
                items: [
                    { text: "<b>1. Une Fléchette</b><br>Attaque un personnage au hasard.<br><i>Le personnage doit réussir un jet de Défense ou perdre 1 PV.</i>", levelFormula: "2", testBtn: "🛡️ Jet de Défense (d6)" },
                    { text: "<b>2. Gaz Empoisonné</b><br>Attaque <b>tous</b> les personnages.<br><i>Jet de Défense requis sans bonus d'armure ni de bouclier !</i><br><b>Échec :</b> Perte de 1 PV.", levelFormula: "3", testBtn: "🛡️ Jet de Défense (d6)" },
                    { text: "<b>3. Une Trappe</b><br>S'ouvre sous un personnage à l'avant (au choix).<br><b>Modificateurs :</b><br>- Armure légère (-1), Lourde (-2)<br>- Halfelin/Elfe (+1), Roublard (+Niveau).<br><b>Échec :</b> Tombe, perd 1 PV. Besoin d'aide pour sortir. (Mort si seul).", levelFormula: "4", testBtn: "🤸 Jet de Sauvegarde (d6)" },
                    { text: "<b>4. Piège à Ours</b><br>Se referme sur un personnage à l'avant (au choix).<br><b>Modificateurs :</b> Halfelin/Elfe (+1), Roublard (+Niveau).<br><b>Échec :</b> -1 PV et devient <b>Boiteux</b>.<br><i>(Un personnage boiteux a -1 Atq/Déf et -2 contre les futurs pièges).</i>", levelFormula: "4", testBtn: "🤸 Jet de Sauvegarde (d6)" },
                    { text: "<b>5. Des Lances</b><br>Jaillissent du mur et attaquent <b>2 personnages</b> au hasard.<br><i>Chaque cible doit réussir un jet de Défense ou perdre 1 PV.</i>", levelFormula: "5", testBtn: "🛡️ Jet de Défense (d6)" },
                    { text: "<b>6. Bloc de Pierre Géant</b><br>Tombe sur un personnage à l'arrière (au choix).<br><i>Jet de Défense (Armure s'applique, mais <b>pas le bouclier</b>).</i><br><b>Échec :</b> Perte de <b>2 PV</b>.", levelFormula: "5", testBtn: "🛡️ Jet de Défense (d6)" }
                ]
            }
        }
    },

    "evenements_speciaux": {
        label: "⚡ Événements Spéciaux",
        sources: {
            "base": {
                items: [
                    { text: "<b>1. Fantôme</b><br>Un fantôme traverse le groupe.<br><b>Échec :</b> -1 PV.<br><i>Prêtre ajoute son niveau.</i>", levelFormula: "4", testBtn: "👻 Jet de Peur (d6)" },
                    { text: "<b>2. Monstres Errants !</b><br>Ils vous attaquent par surprise.", next: ["monstres_errants"] },
                    { text: "<b>3. Dame Blanche</b><br>Elle demande d'accomplir une quête.<br><b>Accepter :</b> Tirer une quête.<br><b>Refuser :</b> Elle disparaît (plus jamais revue).", next: ["quetes"] },
                    { text: "<b>4. Piège !</b><br>Vous avez déclenché un mécanisme.", next: ["pieges"] },
                    { text: "<b>5. Guérisseur Itinérant</b><br>Soigne le groupe : <b>10 po par PV</b>.<br><i>Rencontre unique (si 2e fois : Relancez).</i>" },
                    { text: "<b>6. Alchimiste Itinérant</b><br>Vend :<br>- Potion de soin (50 po)<br>- Poison de lame (30 po, +1 Atq unique, sauf morts-vivants/automates).<br><i>Rencontre unique !</i>", next: ["pieges"] }
                ]
            }
        }
    },

    "elements_speciaux": {
        label: "🔮 Éléments Spéciaux",
        sources: {
            "base": {
                items: [
                    "<b>1. Fontaine</b><br>Tous les personnages blessés récupèrent <b>1 PV</b> la première fois.<br><i>Les fontaines suivantes n’auront aucun effet.</i>",
                    "<b>2. Temple béni</b><br>Un personnage au choix gagne <b>+1 Attaque</b> contre les morts-vivants ou les démons.",
                    "<b>3. Armurerie</b><br>Tous les personnages peuvent <b>changer d’armes</b> s’ils le souhaitent.",
                    "<b>4. Autel maudit</b><br>Un personnage au hasard est <b>Maudit (-1 Défense)</b>.<br><i>Rompre :</i> Tuer un Boss seul, Temple béni, ou Bénédiction.",
                    { text: "<b>5. Statue</b><br>Vous pouvez l'ignorer ou la toucher.<br><i>Si vous la touchez, elle peut s'animer ou se briser (Trésor).</i>", next: ["statue_result"] },
                    { text: "<b>6. Salle énigme</b><br>Boîte à énigme.<br><b>Échec :</b> -1 PV.<br><b>Réussite :</b> La boîte s'ouvre (Trésor).<br><i>Magiciens/Roublards ajoutent leur niveau.</i>", levelFormula: "1d6", testBtn: "🧠 Tenter de résoudre (d6)", next: ["tresors"] }
                ]
            }
        }
    },

    "complications_tresor": {
        label: "💀 Complications Trésors Cachés",
        sources: {
            "base": {
                items: [
                    // 1-2 : Monstres Errants
                    { 
                        text: "<b>1. ALARME !</b><br>Des monstres errants attaquent.<br><i>(Pas de trésor si vous fuyez).</i>", 
                        next: ["monstres_errants"] 
                    },
                    { 
                        text: "<b>2. ALARME !</b><br>Des monstres errants attaquent.<br><i>(Pas de trésor si vous fuyez).</i>", 
                        next: ["monstres_errants"] 
                    },

                    // 3-5 : Piège (Niveau = Résultat du dé)
                    { 
                        text: "<b>3. Piège (Niv 3)</b><br><i>Roublard désarme.</i><br><b>Échec (ou pas de Roublard) :</b> 1 Blessure (Save) ou 2 Blessures (si jet de 1).", 
                        levelFormula: "3", // Niveau du piège
                        testBtn: "🛡️ Jet de Sauvegarde (d6)",
                        next: ["tresor_cache_gold"] // Bouton pour prendre l'or après
                    },
                    { 
                        text: "<b>4. Piège (Niv 4)</b><br><i>Roublard désarme.</i><br><b>Échec (ou pas de Roublard) :</b> 1 Blessure (Save) ou 2 Blessures (si jet de 1).", 
                        levelFormula: "4",
                        testBtn: "🛡️ Jet de Sauvegarde (d6)",
                        next: ["tresor_cache_gold"]
                    },
                    { 
                        text: "<b>5. Piège (Niv 5)</b><br><i>Roublard désarme.</i><br><b>Échec (ou pas de Roublard) :</b> 1 Blessure (Save) ou 2 Blessures (si jet de 1).", 
                        levelFormula: "5",
                        testBtn: "🛡️ Jet de Sauvegarde (d6)",
                        next: ["tresor_cache_gold"]
                    },

                    // 6 : Fantôme
                    { 
                        text: "<b>6. Fantôme Gardien</b><br>Protège l'or.<br><b>Prêtre :</b> Bannissement (d6 + Niv) >= Niveau Fantôme.<br><b>Échec/Pas de Prêtre :</b> Tout le monde perd <b>1 PV</b>, puis il disparaît.", 
                        levelFormula: "1d3+1", // Niveau du fantôme calculé
                        testBtn: "✝️ Tentative Bannissement (d6)",
                        next: ["tresor_cache_gold"]
                    }
                ]
            }
        }
    },


    "quetes": {
        label: "📜 Table de Quêtes",
        sources: {
            "base": {
                items: [
                    { text: "<b>1. Rapportez‑moi sa tête !</b><br>La créature veut la mort d'un Boss spécifique.<br><i>Le prochain Boss rencontré (ou déterminé au hasard) sera celui-ci.</i><br><b>Finir la quête :</b> Tuer ce Boss et rapporter sa tête ici.", next: ["boss"] },
                    { text: "<b>2. Apportez‑moi de l’or !</b><br>Apportez la somme demandée dans cette salle.<br><i>(Si vous possédez déjà cette somme : <b>Doublez</b> le montant affiché ci-dessous !).</i>", levelFormula: "1d6 * 50" },
                    { text: "<b>3. Je le veux vivant !</b><br>Comme la quête 1, mais vous devez <b>maîtriser</b> le Boss (le capturer).<br><b>Méthode :</b> Sort Sommeil OU combattre à -1 Attaque (assommer).<br>Ramenez-le ici attaché.", next: ["boss"] },
                    { text: "<b>4. Rapportez‑moi ça !</b><br>La créature veut un Objet Magique spécifique.<br><i>Chaque Boss tué a 1 chance sur 6 de l'avoir sur lui.</i><br>Ramenez l'objet ici.", next: ["tresors_magiques"] },
                    { text: "<b>5. Allez en paix !</b><br>Vous devez terminer <b>3 rencontres SANS violence</b>.<br><i>(Soudoyer, Aide, Sommeil+Corde, ou faire une autre quête).</i>" },
                    { text: "<b>6. Tuez tous les monstres !</b><br>Explorez <b>toutes</b> les salles du donjon et tuez <b>tous</b> les occupants.<br><i>(Sauf le donneur de quête, évidemment).</i>" }
                ]
            }
        }
    },

    /* -------------------------------------------------------------------------
       D. TRÉSORS ET RÉCOMPENSES
       ------------------------------------------------------------------------- */

    "tresors": {
        label: "💰 Trésors",
        sources: {
            "mt_base": {
                items: [
                    { type: "treasure", name: "Rien", formula: null },
                    { type: "treasure", name: "Pièces d'or", formula: "1d6" },
                    { type: "treasure", name: "Pièces d'or", formula: "2d6" },
                    { type: "treasure", name: "Parchemin", formula: null, next: ["sorts_aleatoires"] },
                    { type: "treasure", name: "Gemme", formula: "2d6 * 5" },
                    { type: "treasure", name: "Bijou", formula: "3d6 * 10" },
                    { type: "treasure", name: "✨ OBJET MAGIQUE !", formula: null, next: ["tresors_magiques"] }
                ]
            },
            "diaboliques": {
                items: [
                    // 0 ou moins
                    { type: "treasure", name: "Rien", formula: null }, 
                    // 1
                    { type: "treasure", name: "Pièces d'or", formula: "2d6 * 2" }, 
                    // 2
                    { type: "treasure", name: "Pièces d'or", formula: "2d6 * 5" }, 
                    // 3
                    { text: "<b>3. Choix : Parchemin ou Arme</b><br>• Soit un Parchemin (cliquez Sort).<br>• Soit une Arme en argent(cliquez Test Argent).<br><i>(valeur arme en Argent : +20 po, ou +40 po si 2 mains).</i>", next: ["sorts_aleatoires"], testBtn: "🥈 Test Argent (1-2 = Argent)" },
                    // 4
                    { type: "treasure", name: "Gemme", formula: "2d6 * 10" }, 
                    // 5
                    { type: "treasure", name: "Bijou", formula: "2d6 * 20" }, 
                    // 6+
                    { type: "treasure", name: "✨ OBJET MAGIQUE  !", formula: null, next: ["tresors_magiques"] } 
                ]
            }
        }
    },
    
    "tresors_magiques": {
        label: "✨ Trésors Magiques",
        sources: {
            "mt_base": {
                items: [
                    "<b>1. Baguette de sommeil</b><br>Lance <i>Sommeil</i> <b>3 fois</b> (épuisé ensuite).<br><i>Magiciens et Elfes uniquement (+Niveau au jet).</i>",
                    { text: "<b>2. Anneau de téléportation</b><br>Réussite auto Défense (fuit la salle, revient fin combat). Usage unique.<br><i>Devient un anneau d'or après usage (voir valeur ci-dessous).</i>", levelFormula: "1d6+1", testBtn: "💰 Valeur après usage (po)" },
                    "<b>3. Or des fous</b><br>Soudoie <b>automatiquement</b> le prochain monstre (peu importe la somme).<br><i>Usage unique.</i>",
                    { text: "<b>4. Arme magique (+1)</b><br>Permanent. Confère <b>+1</b> aux jets d'Attaque.<br><i>Déterminez le type ci-dessous :</i>", next: ["arme_magique_type"] },
                    "<b>5. Potion de soin</b><br>Guérit <b>tous</b> les PV perdus d'un personnage.<br>Action gratuite. Usage unique.<br><i>Interdit aux Barbares.</i>",
                    "<b>6. Bâton de boules de feu</b><br>Lance <i>Boule de feu</i> <b>2 fois</b> (épuisé ensuite).<br><i>Magiciens uniquement (+Niveau au jet).</i>"
                ]
            },
            "diaboliques": {
                items: [
                    { text: "<b>1. Arme Magique</b><br>Bonus permanent.<br>🎲 <b>Lancez d6 pour le Bonus :</b><br>1-4 : <b>+1</b> | 5-6 : <b>+2</b><br>⬇️ <b>Déterminez le type ci-dessous :</b>", specialAction: { label: "⚔️ Générer le Type (d6)", table: "type_arme_magique_diabolique" } },
                    { text: "<b>2. Armure Magique</b><br>Bonus permanent (Contre armes physiques seulement).<br>🎲 <b>Lancez d6 pour le Bonus :</b><br>1-4 : <b>+1</b> | 5-6 : <b>+2</b><br>⬇️ <b>Déterminez le type ci-dessous :</b>", specialAction: { label: "🛡️ Générer le Type (d6)", table: "type_armure_magique_diabolique" } },
                    { text: "<b>3. Fioles de liquide</b><br>Vous trouvez <b>1d3+1</b> fioles.<br>Pour <b>CHAQUE</b> fiole, lancez le dé ci-dessous :", specialAction: { label: "🧪 Contenu d'une fiole (d6)", table: "contenu_fiole_diabolique" } },
                    { text: "<b>4. Baguette de pouvoir</b><br>(Magiciens uniquement).<br>⚡ <b>Charges :</b> 2d3.<br><b>Effet :</b> +1 Niveau au sort par charge dépensée." },
                    { text: "<b>5. Peinture magique</b><br>Rend réel ce que vous dessinez (Porte, équipement max 15po...).<br>🎲 <b>Usage :</b> Après utilisation, lancez d6. <b>Sur 1 :</b> Le pot est vide." },
                    { text: "<b>6. Chapelet de prières</b><br>Contient <b>d6 perles</b>.<br><b>Usage :</b> Utilisez une perle lors d'une Bénédiction/Guérison.<br>🎲 <b>Lancez d6 :</b> Sur 4+, le sort ne compte pas comme utilisé pour la journée." }
                ]
            }
        }
    },


    "recompenses_epiques": {
        label: "🏆 Récompenses Épiques",
        sources: {
            "base": {
                items: [
                    "<b>1. Le livre de Skalitos</b><br>Contient les 6 sorts (comme des parchemins).<br>⚠️ <i>Détruit si le porteur meurt par souffle de dragon.</i><br>💰 <b>Vente :</b> 650 po.",
                    "<b>2. L’or de Kerrak Dar !</b><br>Information sur un trésor caché.<br>Dès que vous trouvez un <b>Indice</b>, vous trouvez aussi ce coffre.<br>💰 <b>Gain :</b> 500 po.",
                    "<b>3. Arme enchantée</b><br>Une arme lance <b>2 dés d'Attaque</b> et garde le meilleur.<br><i>(Touche les monstres magiques).</i><br>⏳ Disparaît à la fin de l'aventure.",
                    "<b>4. Bouclier de mise en garde</b><br>Protège même si le groupe est <b>Surpris</b> ou en <b>Fuite</b>.<br><i>(Objet Permanent).</i><br>💰 <b>Vente :</b> 200 po.",
                    { text: "<b>5. Flèche massacrante</b><br>Inflige <b>3 Blessures Auto</b> à un Boss spécifique.<br><i>(Utilisable une seule fois par un arc).</i><br>💰 <b>Vente :</b> 3d6 x 15 po.<br>🎲 <b>Déterminez la cible ci-dessous :</b>", next: ["boss"] },
                    "<b>6. Symbole sacré de guérison</b><br>(Prêtre uniquement). <b>Soin +2</b>.<br>✝️ <b>Résurrection :</b> Paye le retour à la vie si le corps et l'objet sont ramenés.<br>💰 <b>Vente :</b> 700 po."
                ]
            }
        }
    },

    /* -------------------------------------------------------------------------
       E. TABLES CACHÉES / UTILES / INVOCATIONS
       (Accessibles uniquement via des boutons)
       ------------------------------------------------------------------------- */

    "sorts_aleatoires": {
        label: "📜 Sort Aléatoire",
        hidden: true,
        sources: {
            "base": {
                items: [
                    "<b>1. Bénédiction</b><br>+1 Attaque ou Défense (usage unique) OU retire une malédiction/pétrification.",
                    "<b>2. Boule de feu</b><br>Tue d6+Niveau monstres (pas de jet d'attaque nécessaire).",
                    "<b>3. Éclair</b><br>Tue un monstre (pas de jet d'attaque nécessaire).",
                    "<b>4. Sommeil</b><br>Endort d6+Niveau monstres (ou 1 Boss).",
                    "<b>5. Fuir</b><br>Permet au groupe de fuir un combat automatiquement.",
                    "<b>6. Protéger</b><br>Le personnage a +1 en Défense pour tout le combat."
                ]
            }
        }
    },

    "statue_result": {
        label: "🗿 Résultat Statue",
        hidden: true,
        sources: {
            "base": {
                items: [
                    { type: "monster", name: "Statue Vivante", qty: "1", desc: "(Niv 4, 6 PV). Immunisé Magie.", treasureMod: null, reaction: ["Se battre", "Se battre", "Se battre", "Se battre", "Se battre", "Se battre"] },
                    { type: "monster", name: "Statue Vivante", qty: "1", desc: "(Niv 4, 6 PV). Immunisé Magie.", treasureMod: null, reaction: ["Se battre", "Se battre", "Se battre", "Se battre", "Se battre", "Se battre"] },
                    { type: "monster", name: "Statue Vivante", qty: "1", desc: "(Niv 4, 6 PV). Immunisé Magie.", treasureMod: null, reaction: ["Se battre", "Se battre", "Se battre", "Se battre", "Se battre", "Se battre"] },
                    { type: "treasure", name: "La Statue se brise !", formula: "3d6 * 10" },
                    { type: "treasure", name: "La Statue se brise !", formula: "3d6 * 10" },
                    { type: "treasure", name: "La Statue se brise !", formula: "3d6 * 10" }
                ]
            }
        }
    },

    "arme_magique_type": {
        label: "⚔️ Type d'Arme Magique (Base)",
        hidden: true,
        sources: {
            "base": {
                items: [
                    "<b>1. Arme écrasante légère</b> à une main.",
                    "<b>2. Arme tranchante légère</b> à une main.",
                    "<b>3. Arme écrasante</b> à une main.",
                    "<b>4. Arme tranchante</b> à une main.",
                    "<b>5. Arme tranchante</b> à une main.",
                    "<b>6. Arc.</b>"
                ]
            }
        }
    },

    "pouvoirs_chaos": {
        label: "⚡ Pouvoir du Seigneur du Chaos",
        hidden: true,
        sources: {
            "base": {
                items: [
                    "<b>1. Aucun pouvoir</b><br>Combattez normalement.",
                    "<b>2. Aucun pouvoir</b><br>Combattez normalement.",
                    "<b>3. Aucun pouvoir</b><br>Combattez normalement.",
                    "<b>4. Œil Maléfique</b><br>Avant le combat, chaque PJ lance un d6.<br><b>Échec (1-3) :</b> -1 Défense pour tout le combat.",
                    "<b>5. Drain d'énergie</b><br>Chaque fois qu'un PJ est blessé par le boss, lancez d6.<br><b>Échec (1-3) :</b> Le PJ perd 1 Niveau.",
                    "<b>6. Flammes Infernales</b><br>Avant le combat, chaque PJ lance un d6.<br><b>Échec (1-5) :</b> Perte de 2 PV.<br><i>(Prêtres ajoutent +½ niveau).</i>"
                ]
            }
        }
    },

    "type_arme_magique_diabolique": {
        label: "⚔️ Type d'Arme Magique (Diaboliques)",
        hidden: true,
        sources: { "base": { items: [
            "<b>1. Arme légère tranchante</b> (1 main).",
            "<b>2. Arme écrasante</b> (1 main).",
            "<b>3. Arme tranchante</b> (1 main).",
            "<b>4. Arme tranchante</b> (1 main).",
            "<b>5. Arme écrasante</b> (2 mains).",
            "<b>6. Arme tranchante</b> (2 mains)."
        ]}}
    },

    "type_armure_magique_diabolique": {
        label: "🛡️ Type d'Armure Magique (Diaboliques)",
        hidden: true,
        sources: { "base": { items: [
            "<b>1. Bouclier</b>",
            "<b>2. Bouclier</b>",
            "<b>3. Armure légère</b>",
            "<b>4. Armure lourde</b>",
            "<b>5. Armure lourde</b>",
            "<b>6. Anneau de protection</b> (Toutes classes sauf barbares)."
        ]}}
    },

    "contenu_fiole_diabolique": {
        label: "🧪 Contenu de la Fiole (Diaboliques)",
        hidden: true,
        sources: { "base": { items: [
            "<b>1. Potion de Guérison</b><br>Soin complet (Action gratuite).<br><i>Max 1/aventure par perso. (Sauf Barbares).</i>",
            "<b>2. Potion de Guérison</b><br>Soin complet (Action gratuite).<br><i>Max 1/aventure par perso. (Sauf Barbares).</i>",
            "<b>3. Potion de Guérison</b><br>Soin complet (Action gratuite).<br><i>Max 1/aventure par perso. (Sauf Barbares).</i>",
            "<b>4. Acide</b><br>Inflige 1 Blessure (Boss/Étrange) ou Tue 1 Sbire/Nuisible.<br><i>(1 sur d6 = Se brise sur vous !). Pas d'effet sur Morts-vivants/Golems.</i>",
            "<b>5. Acide</b><br>Inflige 1 Blessure (Boss/Étrange) ou Tue 1 Sbire/Nuisible.<br><i>(1 sur d6 = Se brise sur vous !). Pas d'effet sur Morts-vivants/Golems.</i>",
            "<b>6. Eau Bénite</b><br><b>1 Blessure Auto</b> contre Apparition ou Démon Squelette."
        ]}}
    },
    
    "tresor_cache_gold": {
        label: "💰 Trésor Caché",
        hidden: true,
        sources: {
            "base": {
                items: [
                    { 
                        type: "treasure", 
                        name: "Butin caché sous une lame de parquet", 
                        formula: "3d6 * 3d6" // Le calcul spécifique demandé
                    }
                ]
            }
        }
    },


    "invocation_squelette_armure": {
        hidden: true,
        sources: { "base": { items: [ 
            { type: "monster", name: "Squelettes en Armure (Invoqués)", qty: "1", desc: "<b>(Niv 5 Morts-vivants)</b>. Arrive pendant votre tour !", treasureMod: null, reaction: null }
        ]}}
    },

    "invocation_maitrelame": {
        hidden: true,
        sources: { "base": { items: [ 
            { type: "monster", name: "Maîtrelames Hobgobelins (Invoqués)", qty: "2d3+2", desc: "<b>(Niv 6)</b>. Arrive pendant votre tour !", treasureMod: null, reaction: null }
        ]}}
    }
};

// =============================================================================
// 3. CONSTANTES GLOBALES
// =============================================================================
const CORRIDOR_IDS = [
    7, 8, 9, 10, 18, 20, 21, 22, 27, 33, 35, 37, 40, 41, 43 
];
