/* data.js - Avec Salle/Couloir séparés et Liens */

const gameData = {
    // --- NOUVEAU : GÉNÉRATION SALLE (2d6) ---
    "gen_salle": {
        label: "🏰 Générer Salle",
        method: "2d6", // Indique au script d'utiliser 2 dés
        items: [
            // Index 0 correspond au résultat 2, Index 1 au résultat 3, etc.
            { text: "Trésor découvert !", next: ["tresors"] }, // 2
            { text: "Trésor protégé par un piège.", next: ["pieges", "tresors"] }, // 3
            { text: "Vide (si couloir). Sinon : Événements spéciaux.", next: ["evenements_speciaux"] }, // 4
            { text: "Vide. Éléments spéciaux.", next: ["elements_speciaux"] }, // 5
            { text: "Des Nuisibles !", next: ["nuisibles"] }, // 6
            { text: "Des Sbires !", next: ["sbires"] }, // 7
            { text: "Vide (si couloir). Sinon : Sbires.", next: ["sbires"] }, // 8
            { text: "Vide.", next: null }, // 9
            { text: "Vide (si couloir). Sinon : Monstres étranges.", next: ["monstres_etranges"] }, // 10
            { text: "Boss ! (+1 par boss rencontré). Si total 6+ = Boss Final.", next: ["boss"] }, // 11
            { text: "Vide (si couloir). Sinon : Antre de petit dragon.", next: ["boss"] } // 12 (Note: Dragon est dans la table Boss)
        ]
    },

    // --- NOUVEAU : GÉNÉRATION COULOIR (2d6) ---
    "gen_couloir": {
        label: "longue Générer Couloir",
        method: "2d6",
        items: [
            // Adaptation des règles pour les couloirs
            { text: "Trésor découvert !", next: ["tresors"] }, // 2
            { text: "Trésor protégé par un piège.", next: ["pieges", "tresors"] }, // 3
            { text: "Le couloir est vide.", next: null }, // 4 (Règle: Si c'est un couloir, vide)
            { text: "Vide. Éléments spéciaux.", next: ["elements_speciaux"] }, // 5
            { text: "Des Nuisibles !", next: ["nuisibles"] }, // 6
            { text: "Des Sbires !", next: ["sbires"] }, // 7
            { text: "Le couloir est vide.", next: null }, // 8
            { text: "Le couloir est vide.", next: null }, // 9
            { text: "Le couloir est vide.", next: null }, // 10
            { text: "Boss ! (Relancez d6+bonus pour voir si Final).", next: ["boss"] }, // 11
            { text: "Le couloir est vide.", next: null } // 12
        ]
    },
    
    "gen_entree_visuel": {
        label: "🚪 Générer Entrée (Visuel 1-6)",
        // Cette table est spéciale, elle sera gérée par une nouvelle fonction JS
        specialType: "entrance_visual" 
    },

    // --- ACTIONS DE JEU ---
    "fouille": {
        label: "🔍 Fouille (Salle vide)",
        items: [
            { text: "⚠️ Des monstres errants attaquent !", next: ["monstres_errants"] },
            "La salle est vide.",
            "La salle est vide.",
            "La salle est vide.",
            { text: "✨ CHOIX : Indice, Porte secrète OU Trésor caché.", next: ["complications_tresor"] },
            { text: "✨ CHOIX : Indice, Porte secrète OU Trésor caché.", next: ["complications_tresor"] }
        ]
    },

    "monstres_errants": {
        label: "⚔️ Monstres Errants",
        items: [
            { text: "Attaque de Nuisibles !", next: ["nuisibles"] },
            { text: "Attaque de Nuisibles !", next: ["nuisibles"] },
            { text: "Attaque de Sbires !", next: ["sbires"] },
            { text: "Attaque de Sbires !", next: ["sbires"] },
            { text: "Attaque de Monstres étranges !", next: ["monstres_etranges"] },
            { text: "Attaque de Boss ! (Relancez si Dragon).", next: ["boss"] }
        ]
    },

    "complications_tresor": {
        label: "💀 Complications Trésor Caché",
        items: [
            { text: "Une alarme ! Monstres Errants arrivent.", next: ["monstres_errants"] },
            { text: "Une alarme ! Monstres Errants arrivent.", next: ["monstres_errants"] },
            { text: "Piège Niv 3 ! (Voir Table Pièges résultat 3).", next: ["pieges"] },
            { text: "Piège Niv 4 ! (Voir Table Pièges résultat 4).", next: ["pieges"] },
            { text: "Piège Niv 5 ! (Voir Table Pièges résultat 5).", next: ["pieges"] },
            "👻 Fantôme (Niveau d3+1). Protège l'or."
        ]
    },

    // --- MONSTRES & AUTRES TABLES (Pas de changement sauf intégration format) ---
    // Je remets les monstres ici pour que le fichier soit complet
    "nuisibles": {
        label: "Nuisibles",
        items: [
            { type: "monster", name: "Rats Géants", qty: "3d6", desc: "(Niv 1). 1/6 infection.", treasureMod: null, reaction: ["Fuir", "Fuir", "Fuir", "Se battre", "Se battre", "Se battre"] },
            { type: "monster", name: "Chauves-souris", qty: "3d6", desc: "(Niv 1). Sorts -1.", treasureMod: null, reaction: ["Fuir", "Fuir", "Fuir", "Se battre", "Se battre", "Se battre"] },
            { type: "monster", name: "Gobelins de colonie", qty: "2d6", desc: "(Niv 3). Trésor -1.", treasureMod: -1, reaction: ["Fuir", "Fuir", "Fuir", "Soudoyer", "Se battre", "Se battre"] },
            { type: "monster", name: "Mille-pattes", qty: "1d6", desc: "(Niv 3). Poison.", treasureMod: null, reaction: ["Fuir", "Fuir", "Fuir", "Se battre", "Se battre", "Se battre"] },
            { type: "monster", name: "Grenouilles vampires", qty: "1d6", desc: "(Niv 4).", treasureMod: -1, reaction: ["Fuir", "Se battre", "Se battre", "Se battre", "Mort", "Mort"] },
            { type: "monster", name: "Rats squelettes", qty: "2d6", desc: "(Niv 3). Morts-vivants.", treasureMod: null, reaction: ["Fuir", "Fuir", "Se battre", "Se battre", "Se battre", "Se battre"] }
        ]
    },
    
    "sbires": {
        label: "Sbires",
        items: [
            { type: "monster", name: "Squelettes/Zombies", qty: "1d6+2", desc: "(Niv 3). Morts-vivants.", treasureMod: null, reaction: ["Mort", "Mort", "Mort", "Mort", "Mort", "Mort"] },
            { type: "monster", name: "Gobelins", qty: "1d6+3", desc: "(Niv 3). Surprise.", treasureMod: -1, reaction: ["Fuir", "Soudoyer", "Soudoyer", "Se battre", "Se battre", "Se battre"] },
            { type: "monster", name: "Hobgobelins", qty: "1d6", desc: "(Niv 4).", treasureMod: 1, reaction: ["Fuir", "Soudoyer", "Soudoyer", "Se battre", "Se battre", "Mort"] },
            { type: "monster", name: "Orcs", qty: "1d6+1", desc: "(Niv 4). Peur magie.", treasureMod: 0, reaction: ["Soudoyer", "Soudoyer", "Se battre", "Se battre", "Se battre", "Mort"] },
            { type: "monster", name: "Trolls", qty: "1d3", desc: "(Niv 5). Régénération.", treasureMod: 0, reaction: ["Se battre", "Se battre", "Mort", "Mort", "Mort", "Mort"] },
            { type: "monster", name: "Champignhommes", qty: "2d6", desc: "(Niv 3). Poison.", treasureMod: 0, reaction: ["Soudoyer", "Soudoyer", "Se battre", "Se battre", "Se battre", "Se battre"] }
        ]
    },

    "monstres_etranges": {
        label: "Monstres Étranges",
        items: [
            { type: "monster", name: "Minotaure", qty: "1", desc: "(Niv 5). Charge.", treasureMod: 0, reaction: ["Soudoyer", "Soudoyer", "Se battre", "Se battre", "Mort", "Mort"] },
            { type: "monster", name: "Dévoreur d’acier", qty: "1", desc: "(Niv 3). Mange équipement.", treasureMod: null, reaction: ["Fuir", "Soudoyer", "Soudoyer", "Se battre", "Se battre", "Se battre"] },
            { type: "monster", name: "Chimère", qty: "1", desc: "(Niv 5). Souffle feu.", treasureMod: 0, reaction: ["Soudoyer", "Se battre", "Se battre", "Se battre", "Se battre", "Se battre"] },
            { type: "monster", name: "Catoblépas", qty: "1", desc: "(Niv 4). Regard.", treasureMod: 1, reaction: ["Fuir", "Se battre", "Se battre", "Se battre", "Se battre", "Se battre"] },
            { type: "monster", name: "Araignée géante", qty: "1", desc: "(Niv 5). Toiles.", treasureMod: 0, reaction: ["Se battre", "Se battre", "Se battre", "Se battre", "Se battre", "Se battre"] },
            { type: "monster", name: "Gremlins invisibles", qty: "1d6+3", desc: "Volent objets !", treasureMod: null, reaction: null }
        ]
    },

    "boss": {
        label: "Boss",
        items: [
            { type: "monster", name: "Momie", qty: "1", desc: "(Niv 5).", treasureMod: 2, reaction: ["Se battre", "Se battre", "Se battre", "Se battre", "Se battre", "Se battre"] },
            { type: "monster", name: "Brute Orque", qty: "1", desc: "(Niv 5).", treasureMod: 1, reaction: ["Soudoyer", "Se battre", "Se battre", "Se battre", "Se battre", "Mort"] },
            { type: "monster", name: "Ogre", qty: "1", desc: "(Niv 5).", treasureMod: 0, reaction: ["Soudoyer", "Se battre", "Se battre", "Mort", "Mort", "Mort"] },
            { type: "monster", name: "Méduse", qty: "1", desc: "(Niv 4).", treasureMod: 1, reaction: ["Soudoyer", "Quête", "Se battre", "Se battre", "Se battre", "Mort"] },
            { type: "monster", name: "Seigneur du Chaos", qty: "1", desc: "(Niv 6).", treasureMod: 1, reaction: ["Fuir", "Se battre", "Mort", "Mort", "Mort", "Mort"] },
            { type: "monster", name: "Petit Dragon", qty: "1", desc: "(Niv 6).", treasureMod: 1, reaction: ["Endormi", "Soudoyer", "Soudoyer", "Se battre", "Se battre", "Quête"] }
        ]
    },

    "tresors": {
        label: "💰 Trésors",
        items: [
            { type: "treasure", name: "Rien", formula: null },
            { type: "treasure", name: "Pièces d'or", formula: "1d6" },
            { type: "treasure", name: "Pièces d'or", formula: "2d6" },
            { type: "treasure", name: "Parchemin", formula: null },
            { type: "treasure", name: "Gemme", formula: "2d6 * 5" },
            { type: "treasure", name: "Bijou", formula: "3d6 * 10" },
            { type: "treasure", name: "✨ OBJET MAGIQUE !", formula: null,next: ["tresors_magiques"]}
        ]
    },
    
    "tresors_magiques": {
        label: "Trésors Magiques",
        items: ["Baguette", "Anneau Téléportation", "Or des fous", "Arme +1", "Potion Soin", "Bâton Boule de Feu"]
    },

    "pieges": {
        label: "⚠️ Pièges",
        items: [
            "<b>1. Fléchette (Niv 2)</b>", 
            "<b>2. Gaz (Niv 3)</b>", 
            "<b>3. Trappe (Niv 4)</b>", 
            "<b>4. Piège à ours (Niv 4)</b>", 
            "<b>5. Lances (Niv 5)</b>", 
            "<b>6. Pierre (Niv 5)</b>"
        ]
    },

    "evenements_speciaux": {
        label: "Événements",
        items: ["Fantôme", "Monstres Errants !", "Dame blanche", "Piège !", "Guérisseur", "Alchimiste"]
    },
    
    "elements_speciaux": {
        label: "Éléments",
        items: ["Fontaine", "Temple béni", "Armurerie", "Autel maudit", "Statue", "Salle énigme"]
    },

    "quetes": {
        label: "Quêtes",
        items: ["Tête du Boss", "Or", "Vivant", "Objet magique", "Paix", "Tuer tout le monde"]
    }
};


// =================================================================
// === CONFIGURATION DES IMAGES (À REMPLIR PAR L'UTILISATEUR) ===
// =================================================================
// C'est ici que vous dites à l'ordi quelles images sont des couloirs.
// Regardez vos images de 7 à 43.
// Notez ici les numéros de toutes celles qui sont des COULOIRS.
// Séparez les par des virgules.

const CORRIDOR_IDS = [
    7, 8, 9, 10, 18, 20,21,22,27,33,35,37,40,41,43 // <-- EXEMPLE ! REMPLACEZ PAR VOS VRAIS NUMÉROS
];

// (Les autres numéros entre 7 et 43 seront considérés comme des SALLES)
