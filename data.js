/* data.js - Structure Multi-Sources */

// 1. LISTE DES EXTENSIONS DISPONIBLES
const AVAILABLE_EXTENSIONS = [
    { id: "base", name: "sysreme de base", default: true },
    { id: "mt_base", name: "monstre et tresor (base)", default: true },
    // Exemple futur : { id: "kobolds", name: "Cavernes Kobolds", default: false }
];


// 3. DONNÉES DU JEU
const gameData = {

    "gen_salle": {
        label: "🏰 Générer Salle",
        method: "2d6",
        sources: {
            "base": {
                items: [
                    { text: "Trésor découvert !", next: ["tresors"] }, // 2
                    { text: "Trésor protégé par un piège.", next: ["pieges", "tresors"] }, // 3
                    { text: "Vide (si couloir). Sinon : Événements.", next: ["evenements_speciaux"] }, // 4
                    { text: "Vide. Éléments spéciaux.", next: ["elements_speciaux"] }, // 5
                    { text: "Des Nuisibles !", next: ["nuisibles"] }, // 6
                    { text: "Des Sbires !", next: ["sbires"] }, // 7
                    { text: "Vide (si couloir). Sinon : Sbires.", next: ["sbires"] }, // 8
                    { text: "Vide.", next: null }, // 9
                    { text: "Vide (si couloir). Sinon : Monstres étranges.", next: ["monstres_etranges"] }, // 10
                    { text: "Boss ! (+1 par boss rencontré).", next: ["boss"] }, // 11
                    { text: "Vide (si couloir). Sinon : Antre de dragon.", next: ["boss"] } // 12
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
                    "La salle est vide.", "La salle est vide.", "La salle est vide.",
                    { text: "✨ CHOIX : Indice, Porte secrète OU Trésor caché.", next: ["complications_tresor"] },
                    { text: "✨ CHOIX : Indice, Porte secrète OU Trésor caché.", next: ["complications_tresor"] }
                ]
            }
        }
    },

    "monstres_errants": {
        label: "⚔️ Monstres Errants",
        sources: {
            "base": {
                items: [
                    // 1 : Nuisibles
                    { text: "Attaque de Nuisibles !", next: ["nuisibles"] },
                    // 2 : Nuisibles
                    { text: "Attaque de Nuisibles !", next: ["nuisibles"] },
                    
                    // 3 : Sbires
                    { text: "Attaque de Sbires !", next: ["sbires"] },
                    // 4 : Sbires
                    { text: "Attaque de Sbires !", next: ["sbires"] },
                    
                    // 5 : Monstres étranges
                    { text: "Attaque de Monstres étranges !", next: ["monstres_etranges"] },
                    
                    // 6 : Boss
                    { text: "Attaque de Boss ! <br><i>(Si Petit Dragon : Relancez).</i><br>⚠️ Ne peut PAS être le Boss Final.", next: ["boss"] }
                ]
            }
        }
    },


    "complications_tresor": {
        label: "💀 Complications Trésor",
        sources: {
            "base": {
                items: [
                    { text: "Une alarme ! Monstres Errants.", next: ["monstres_errants"] },
                    { text: "Une alarme ! Monstres Errants.", next: ["monstres_errants"] },
                    { text: "Piège Niv 3 !", next: ["pieges"] },
                    { text: "Piège Niv 4 !", next: ["pieges"] },
                    { text: "Piège Niv 5 !", next: ["pieges"] },
                    "👻 Fantôme (Niveau d3+1)."
                ]
            }
        }
    },

    "nuisibles": {
        label: "Nuisibles",
        sources: {
            "mt_base": {
                items: [
                    { type: "monster", name: "Rats Géants", qty: "3d6", desc: "(Niv 1). Infection.", treasureMod: null, reaction: ["Fuir", "Fuir", "Fuir", "Se battre", "Se battre", "Se battre"] },
                    { type: "monster", name: "Chauves-souris", qty: "3d6", desc: "(Niv 1). Sorts -1.", treasureMod: null, reaction: ["Fuir", "Fuir", "Fuir", "Se battre", "Se battre", "Se battre"] },
                    { type: "monster", name: "Gobelins de colonie", qty: "2d6", desc: "(Niv 3). Trésor -1.", treasureMod: -1, reaction: ["Fuir", "Fuir", "Fuir", "Soudoyer", "Se battre", "Se battre"] },
                    { type: "monster", name: "Mille-pattes", qty: "1d6", desc: "(Niv 3). Poison.", treasureMod: null, reaction: ["Fuir", "Fuir", "Fuir", "Se battre", "Se battre", "Se battre"] },
                    { type: "monster", name: "Grenouilles vampires", qty: "1d6", desc: "(Niv 4).", treasureMod: -1, reaction: ["Fuir", "Se battre", "Se battre", "Se battre", "Mort", "Mort"] },
                    { type: "monster", name: "Rats squelettes", qty: "2d6", desc: "(Niv 3). Morts-vivants.", treasureMod: null, reaction: ["Fuir", "Fuir", "Se battre", "Se battre", "Se battre", "Se battre"] }
                ]
            }
            // EXEMPLE POUR EXTENSION FUTURE :
            /*
            ,"kobolds": {
                items: [
                     { type: "monster", name: "Kobolds Mineurs", qty: "2d6", desc: "(Niv 2).", reaction: [...] },
                     ... 5 autres monstres ...
                ]
            }
            */
        }
    },
    
    "sbires": {
        label: "Sbires",
        sources: {
            "mt_base": {
                items: [
                    { type: "monster", name: "Squelettes/Zombies", qty: "1d6+2", desc: "(Niv 3). Morts-vivants.", treasureMod: null, reaction: ["Mort", "Mort", "Mort", "Mort", "Mort", "Mort"] },
                    { type: "monster", name: "Gobelins", qty: "1d6+3", desc: "(Niv 3). Surprise.", treasureMod: -1, reaction: ["Fuir", "Soudoyer", "Soudoyer", "Se battre", "Se battre", "Se battre"] },
                    { type: "monster", name: "Hobgobelins", qty: "1d6", desc: "(Niv 4).", treasureMod: 1, reaction: ["Fuir", "Soudoyer", "Soudoyer", "Se battre", "Se battre", "Mort"] },
                    { type: "monster", name: "Orcs", qty: "1d6+1", desc: "(Niv 4). Peur magie.", treasureMod: 0, reaction: ["Soudoyer", "Soudoyer", "Se battre", "Se battre", "Se battre", "Mort"] },
                    { type: "monster", name: "Trolls", qty: "1d3", desc: "(Niv 5). Régénération.", treasureMod: 0, reaction: ["Se battre", "Se battre", "Mort", "Mort", "Mort", "Mort"] },
                    { type: "monster", name: "Champignhommes", qty: "2d6", desc: "(Niv 3). Poison.", treasureMod: 0, reaction: ["Soudoyer", "Soudoyer", "Se battre", "Se battre", "Se battre", "Se battre"] }
                ]
            }
        }
    },

    "monstres_etranges": {
        label: "Monstres Étranges",
        sources: {
            "mt_base": {
                items: [
                    { type: "monster", name: "Minotaure", qty: "1", desc: "(Niv 5). Charge.", treasureMod: 0, reaction: ["Soudoyer", "Soudoyer", "Se battre", "Se battre", "Mort", "Mort"] },
                    { type: "monster", name: "Dévoreur d’acier", qty: "1", desc: "(Niv 3). Mange équipement.", treasureMod: null, reaction: ["Fuir", "Soudoyer", "Soudoyer", "Se battre", "Se battre", "Se battre"] },
                    { type: "monster", name: "Chimère", qty: "1", desc: "(Niv 5). Souffle feu.", treasureMod: 0, reaction: ["Soudoyer", "Se battre", "Se battre", "Se battre", "Se battre", "Se battre"] },
                    { type: "monster", name: "Catoblépas", qty: "1", desc: "(Niv 4). Regard.", treasureMod: 1, reaction: ["Fuir", "Se battre", "Se battre", "Se battre", "Se battre", "Se battre"] },
                    { type: "monster", name: "Araignée géante", qty: "1", desc: "(Niv 5). Toiles.", treasureMod: 0, reaction: ["Se battre", "Se battre", "Se battre", "Se battre", "Se battre", "Se battre"] },
                    { type: "monster", name: "Gremlins invisibles", qty: "1d6+3", desc: "Volent objets !", treasureMod: null, reaction: null }
                ]
            }
        }
    },

    "boss": {
        label: "Boss",
        sources: {
            "mt_base": {
                items: [
                    { type: "monster", name: "Momie", qty: "1", desc: "(Niv 5).", treasureMod: 2, reaction: ["Se battre", "Se battre", "Se battre", "Se battre", "Se battre", "Se battre"] },
                    { type: "monster", name: "Brute Orque", qty: "1", desc: "(Niv 5).", treasureMod: 1, reaction: ["Soudoyer", "Se battre", "Se battre", "Se battre", "Se battre", "Mort"] },
                    { type: "monster", name: "Ogre", qty: "1", desc: "(Niv 5).", treasureMod: 0, reaction: ["Soudoyer", "Se battre", "Se battre", "Mort", "Mort", "Mort"] },
                    { type: "monster", name: "Méduse", qty: "1", desc: "(Niv 4).", treasureMod: 1, reaction: ["Soudoyer", "Quête", "Se battre", "Se battre", "Se battre", "Mort"] },
                    { type: "monster", name: "Seigneur du Chaos", qty: "1", desc: "(Niv 6).", treasureMod: 1, reaction: ["Fuir", "Se battre", "Mort", "Mort", "Mort", "Mort"] },
                    { type: "monster", name: "Petit Dragon", qty: "1", desc: "(Niv 6).", treasureMod: 1, reaction: ["Endormi", "Soudoyer", "Soudoyer", "Se battre", "Se battre", "Quête"] }
                ]
            }
        }
    },

    "tresors": {
        label: "💰 Trésors",
        sources: {
            "mt_base": {
                items: [
                    { type: "treasure", name: "Rien", formula: null },
                    { type: "treasure", name: "Pièces d'or", formula: "1d6" },
                    { type: "treasure", name: "Pièces d'or", formula: "2d6" },
                    { type: "treasure", name: "Parchemin", formula: null },
                    { type: "treasure", name: "Gemme", formula: "2d6 * 5" },
                    { type: "treasure", name: "Bijou", formula: "3d6 * 10" },
                    { type: "treasure", name: "✨ OBJET MAGIQUE !", formula: null }
                ]
            }
        }
    },
    
    "tresors_magiques": {
        label: "Trésors Magiques",
        sources: {
            "mt_base": {
                items: ["Baguette", "Anneau Téléportation", "Or des fous", "Arme +1", "Potion Soin", "Bâton Boule de Feu"]
            }
        }
    },

    "pieges": {
        label: "⚠️ Pièges",
        sources: {
            "base": {
                items: ["<b>1. Fléchette</b>", "<b>2. Gaz</b>", "<b>3. Trappe</b>", "<b>4. Piège à ours</b>", "<b>5. Lances</b>", "<b>6. Pierre</b>"]
            }
        }
    },

    "evenements_speciaux": {
        label: "⚡ Événements Spéciaux",
        sources: {
            "base": {
                items: [
                    // 1. Fantôme
                    {
                        text: "<b>1. Fantôme</b><br>Un fantôme traverse le groupe.<br><b>Échec :</b> -1 PV.<br><i>Prêtre ajoute son niveau.</i>",
                        levelFormula: "4", // Difficulté fixe de 4
                        testBtn: "👻 Jet de Peur (d6)"
                    },

                    // 2. Monstres Errants
                    {
                        text: "<b>2. Monstres Errants !</b><br>Ils vous attaquent par surprise.",
                        next: ["monstres_errants"] // Renvoie vers la table ci-dessus
                    },

                    // 3. Dame Blanche
                    {
                        text: "<b>3. Dame Blanche</b><br>Elle demande d'accomplir une quête.<br><b>Accepter :</b> Tirer une quête.<br><b>Refuser :</b> Elle disparaît (plus jamais revue).",
                        next: ["quetes"]
                    },

                    // 4. Piège
                    {
                        text: "<b>4. Piège !</b><br>Vous avez déclenché un mécanisme.",
                        next: ["pieges"]
                    },

                    // 5. Guérisseur
                    {
                        text: "<b>5. Guérisseur Itinérant</b><br>Soigne le groupe : <b>10 po par PV</b>.<br><i>Rencontre unique (si 2e fois : Relancez).</i>"
                    },

                    // 6. Alchimiste (Avec la gestion du Piège si 2ème fois)
                    {
                        text: "<b>6. Alchimiste Itinérant</b><br>Vend :<br>- Potion de soin (50 po)<br>- Poison de lame (30 po, +1 Atq unique, sauf morts-vivants/automates).<br><i>Rencontre unique !</i>",
                        next: ["pieges"] // Le bouton affichera le nom de la table piège, c'est pratique pour la 2ème fois
                    }
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
                    
                    // --- ICI LA STATUE MODIFIÉE ---
                    {
                        text: "<b>5. Statue</b><br>Vous pouvez l'ignorer ou la toucher.<br><i>Si vous la touchez, elle peut s'animer ou se briser (Trésor).</i>",
                        next: ["statue_result"] // <-- Ce bouton mènera au tirage monstre OU trésor
                    },
                    
                    // --- ICI LA SALLE ÉNIGME ---
                    {
                        text: "<b>6. Salle énigme</b><br>Boîte à énigme.<br><b>Échec :</b> -1 PV.<br><b>Réussite :</b> La boîte s'ouvre (Trésor).<br><i>Magiciens/Roublards ajoutent leur niveau.</i>",
                        levelFormula: "1d6",
                        testBtn: "🧠 Tenter de résoudre (d6)",
                        next: ["tresors"]
                    }
                ]
            }
        }
    },
    
    "statue_result": {
    label: "🗿 Résultat Statue",
    sources: {
        "base": {
            items: [
                // 1, 2, 3 : Monstre
                { type: "monster", name: "Statue Vivante", qty: "1", desc: "(Niv 4, 6 PV). Immunisé Magie.", treasureMod: null, reaction: ["Se battre", "Se battre", "Se battre", "Se battre", "Se battre", "Se battre"] },
                { type: "monster", name: "Statue Vivante", qty: "1", desc: "(Niv 4, 6 PV). Immunisé Magie.", treasureMod: null, reaction: ["Se battre", "Se battre", "Se battre", "Se battre", "Se battre", "Se battre"] },
                { type: "monster", name: "Statue Vivante", qty: "1", desc: "(Niv 4, 6 PV). Immunisé Magie.", treasureMod: null, reaction: ["Se battre", "Se battre", "Se battre", "Se battre", "Se battre", "Se battre"] },
                
                // 4, 5, 6 : Trésor Calculé (3d6 x 10)
                { type: "treasure", name: "La Statue se brise !", formula: "3d6 * 10" },
                { type: "treasure", name: "La Statue se brise !", formula: "3d6 * 10" },
                { type: "treasure", name: "La Statue se brise !", formula: "3d6 * 10" }
            ]
          }
      }
    },


    "quetes": {
        label: "Quêtes",
        sources: { "base": { items: ["Tête du Boss", "Or", "Vivant", "Objet magique", "Paix", "Tuer tout le monde"] } }
    },

    "gen_entree_visuel": {
        label: "🚪 Générer Entrée (Visuel 1-6)",
        specialType: "entrance_visual" 
    }
};

const CORRIDOR_IDS = [
    7, 8, 9, 10, 18, 20,21,22,27,33,35,37,40,41,43 // <-- EXEMPLE ! REMPLACEZ PAR VOS VRAIS NUMÉROS
];

// (Les autres numéros entre 7 et 43 seront considérés comme des SALLES)
