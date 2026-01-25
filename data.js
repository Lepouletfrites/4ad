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
    
     "boss": {
        label: "💀 Boss",
        // On met une source vide, car le script va ignorer ça et aller dans la POOL
        sources: { "base": { items: [] } } 
    },

    "sbires": {
        label: "⚔️ Sbires",
        sources: { "base": { items: [] } }
    },

    "nuisibles": {  // <--- C'est celui-là qui te manquait !
        label: "🐀 Nuisibles / Vermines",
        sources: { "base": { items: [] } }
    },

    "monstres_etranges": {
        label: "👁️ Monstres Étranges",
        sources: { "base": { items: [] } }
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
                    "<b>2. Temple béni</b><br>Un personnage au choix gagne <b>+1 Attaque</b> contre les morts-vivants ou les démons.(1 combat)",
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

/* --- MASTER POOL (Base de données de tous les monstres) --- */
const MASTER_MONSTER_POOL = [
    // EXEMPLE 1 : UN BOSS (Stats dynamiques selon le HCL)
    {
        id: "chef_orc_brutal",
        name: "Chef Orc Brutal",
        type: "BOSS", // Boss, Sbire, Vermine, Etrange
        
        // Conditions d'apparition (Pour le futur filtre)
        minHCL: 1, 
        maxHCL: 5, // N'apparaît plus après le niveau 5 (trop faible)

        // Stats Calculées
        level: "HCL + 2", // Si HCL 3 -> Niveau 5
        qty: "1",         // Boss unique
        life: "HCL + 4",  // Si HCL 3 -> 7 PV
        attacks: 2,       // 2 Attaques par tour
        damage: 2,        // 2 Dégâts par coup !
        
        // Trésor & Récompenses
        equipment: "Épée longue, Écu rouillé",
        treasure: { table: "tresors_boss", rolls: 2 }, // Tire 2 fois sur la table Boss
        morale: "+1",      // Bonus au jet de moral des sbires
        xp: "2 Rolls",     // Récompense d'XP
        
        // Info Lore
        habitat: "Donjons, Cavernes",
        desc: "Une montagne de muscles cicatrisés. Il hurle des ordres incompréhensibles.",
        
        // Table de réaction (comme avant)
        reaction: ["Fuite", "Soudoyer (50po)", "Combat", "Combat", "Combat", "Combat à mort"]
    },

    // EXEMPLE 2 : DES SBIRES (Stats plus simples)
    {
        id: "gobelins_fourbes",
        name: "Gobelins Fourbes",
        type: "SBIRE",
        extension: "diaboliques",
        
        minHCL: 1, maxHCL: 6,

        level: "HCL",     // Niveau égal au HCL du groupe
        qty: "d6 + 2",    // Nombre aléatoire
        life: "1",        // Les sbires ont souvent 1 PV
        attacks: 1,
        damage: 1,
        
        equipment: "Épée longue, Écu rouillé",
        treasure: { table: "tresors",  // Nom de la table dans gameData (ex: "tresors", "tresors_epiques")
        rolls: 2,               // Nombre de jets (informatif pour le joueur)
        mod: 1      }, // Malus au trésor
        morale: "-1",     // Lâches
        xp: "1 Roll",
        
        habitat: "Partout",
        desc: "Ils attaquent en meute et visent les jambes.",
        reaction: ["Fuite", "Fuite", "Soudoyer (10po)", "Combat", "Combat", "Combat"]
    },
    {
        id: "fourmis_gerirere",
        name: "Fourmis gerirere",
        type: "VERMINE",
        
        minHCL: 1, maxHCL: 99,

        level: "HCL + 6",     // Niveau égal au HCL du groupe
        qty: "d6 + 3",    // Nombre aléatoire
        life: "1",        // Les sbires ont souvent 1 PV
        attacks: 1,
        damage: 1,
        
        equipment: "lance a une main, bouclier",
        treasure: { table: "tresors",rolls: 1,mod:0},
        morale: "0",     // Lâches
        xp: "1/10",
        
        habitat: "montagne",
        desc: "Spray de PhéromonesAvant le contact, les fourmis projettent un liquide acre. Lancez 1d6 pour chaque PJ : sur 1 ou 2, le personnage est aspergé (sans défense possible).Conséquence : La victime, marquée par l'odeur, subit un malus de -1 en Défense contre tout homme-fourmi jusqu'à ce qu'elle soit lavée (immersion dans l'eau) ou purifiée (Bénédiction). Les cibles déjà marquées sont ignorées.",
        reaction: ["Fuite", "Soudoyer (10po/sbir)", "Soudoyer (10po/sbir)", "Combat", "Combat", "Combat"]
    },
    {
        id: "test",
        name: "test gerirere",
        type: "BOSS",
        
        minHCL: 1, maxHCL: 99,

        level: "HCL + 6",     // Niveau égal au HCL du groupe
        qty: "d6 + 3",    // Nombre aléatoire
        life: "1",        // Les sbires ont souvent 1 PV
        attacks: 1,
        damage: 1,
        
        equipment: "lance a une main, bouclier",
        treasure: { table: "tresors",rolls: 1,mod:0},
        morale: "0",     // Lâches
        xp: "1/10",
        
        habitat: "montagne",
        minions: {
        pool: "VERMINE",       // Dans quelle catégorie piocher ? (SBIRE, VERMINE, ETRANGE...)
        qty: "1d6",          // Combien sont-ils ?
        label: "fourmis_gerirere"  // Nom affiché sur le bouton
        },
        desc: "Spray de PhéromonesAvant le contact, les fourmis projettent un liquide acre. Lancez 1d6 pour chaque PJ : sur 1 ou 2, le personnage est aspergé (sans défense possible).Conséquence : La victime, marquée par l'odeur, subit un malus de -1 en Défense contre tout homme-fourmi jusqu'à ce qu'elle soit lavée (immersion dans l'eau) ou purifiée (Bénédiction). Les cibles déjà marquées sont ignorées.",
        reaction: ["Fuite", "Soudoyer (10po/sbir)", "Soudoyer (10po/sbir)", "Combat", "Combat", "Combat"]
    },
        // =========================================================================
    // 🐀 NUISIBLES / VERMINES (Niveaux Fixes - Ancienne Table)
    // =========================================================================
    {
        id: "vermine_rats_geants",
        name: "Rats Géants",
        type: "VERMINE",
        minHCL: 1, maxHCL: 99,

        level: 1,          // Niveau Fixe
        qty: "3d6",        // Nombreux
        life: 1,
        attacks: 1,
        damage: 1,

        treasure: null,    // "Pas de trésor"
        morale: 0,
        xp: "Aucun",       // Les vermines ne donnent souvent pas d'XP (règle de base)
        habitat: "Égouts, Caves",
        desc: "⚠️ <b>Infection :</b> Tout personnage blessé a 1 chance sur 6 de perdre 1 PV supplémentaire.",
        reaction: ["Fuite", "Fuite", "Fuite", "Combat", "Combat", "Combat"]
    },
    {
        id: "vermine_chauves_souris",
        name: "Chauves-souris Vampires",
        type: "VERMINE",
        minHCL: 1, maxHCL: 99,

        level: 1,
        qty: "3d6",
        life: 1,
        attacks: 1,
        damage: 1,

        treasure: null,
        morale: 0,
        xp: "Aucun",
        habitat: "Plafonds",
        desc: "🔊 <b>Cris :</b> Les sorts sont lancés à -1. (Non Morts-vivants).",
        reaction: ["Fuite", "Fuite", "Fuite", "Combat", "Combat", "Combat"]
    },
    {
        id: "vermine_gobelins_colonie",
        name: "Gobelins de Colonie",
        type: "VERMINE",   // Classé Vermine car dans ta table Nuisibles
        minHCL: 1, maxHCL: 99,

        level: 3,          // Niveau Fixe
        qty: "2d6",
        life: 1,
        attacks: 1,
        damage: 1,

        treasure: { table: "tresors", rolls: 1, mod: -1 }, // Trésor -1
        morale: "-1",      // Moral spécifié
        xp: "1 Roll",      // Les gobelins donnent généralement de l'XP
        habitat: "Grottes",
        desc: "Une petite colonie de pillards.",
        reaction: ["Fuite", "Fuite", "Fuite", "Soudoyer (5 po/tête)", "Combat", "Combat"]
    },
    {
        id: "vermine_mille_pattes",
        name: "Mille-pattes Géants",
        type: "VERMINE",
        minHCL: 1, maxHCL: 99,

        level: 3,
        qty: "1d6",
        life: 1,
        attacks: 1,
        damage: 1,

        treasure: null,
        morale: 0,
        xp: "Aucun",
        habitat: "Humide",
        desc: "☠️ <b>Poison :</b> Si blessé, faire un Jet de Sauvegarde (Niv 2) ou perdre 1 PV supplémentaire.",
        reaction: ["Fuite", "Fuite", "Fuite", "Combat", "Combat", "Combat"]
    },
    {
        id: "vermine_grenouilles",
        name: "Grenouilles Vampires",
        type: "VERMINE",
        minHCL: 1, maxHCL: 99,

        level: 4,
        qty: "1d6",
        life: 1,
        attacks: 1,
        damage: 1,

        treasure: { table: "tresors", rolls: 1, mod: -1 }, // Trésor -1
        morale: 0,
        xp: "Aucun",
        habitat: "Marais",
        desc: "Des batraciens assoiffés de sang. (Non Morts-vivants).",
        reaction: ["Fuite", "Combat", "Combat", "Combat", "Combat à mort", "Combat à mort"]
    },
    {
        id: "vermine_rats_squelettes",
        name: "Rats Squelettes",
        type: "VERMINE",
        minHCL: 1, maxHCL: 99,

        level: 3,
        qty: "2d6",
        life: 1,
        attacks: 1,
        damage: 1,

        treasure: null,
        morale: "Sans peur", // Morts-vivants
        xp: "Aucun",
        habitat: "Cryptes",
        desc: "🔨 <b>Armes écrasantes :</b> +1 Attaque.<br>🚫 <b>Arcs/Frondes :</b> Inutiles. (Morts-vivants).",
        reaction: ["Fuite", "Fuite", "Combat", "Combat", "Combat", "Combat"]
    },
        // =========================================================================
    // 😈 DIABOLIQUES (Tout en VERMINE + Extension activable)
    // =========================================================================
    {
        id: "diab_araignees",
        name: "Araignées",
        type: "VERMINE",
        extension: "diaboliques", // Extension requise
        minHCL: 1, maxHCL: 99,

        level: 3,
        qty: "3d6 + 3",
        life: 1,
        attacks: 1,
        damage: 1,

        treasure: { table: "tresors", rolls: 1, mod: -1 },
        morale: 0,
        xp: "Aucun", // Vermine = Pas d'XP par défaut (ou 1 Roll si tu veux)
        habitat: "Toiles",
        desc: "🕸️ <b>Toiles :</b> Fuite impossible (sauf Boule de feu).<br>☠️ <b>Poison :</b> Blessure = Save Niv 3 ou -1 PV fin combat.<br>🔨 <b>Armes écrasantes :</b> +1 Attaque.",
        reaction: ["Combat", "Combat", "Combat", "Combat", "Combat", "Combat"]
    },
    {
        id: "diab_stirges",
        name: "Stirges",
        type: "VERMINE",
        extension: "diaboliques",
        minHCL: 1, maxHCL: 99,

        level: 4,
        qty: "2d6 + 2",
        life: 1,
        attacks: 1,
        damage: 1,

        treasure: null,
        morale: 0,
        xp: "Aucun",
        habitat: "Grottes",
        desc: "🩸 <b>Succion :</b> Blessure = -1 PV auto chaque tour jusqu'à la mort des stirges.",
        reaction: ["Combat", "Combat", "Combat", "Combat", "Combat", "Combat"]
    },
    {
        id: "diab_serpents",
        name: "Serpents Géants",
        type: "VERMINE",
        extension: "diaboliques",
        minHCL: 1, maxHCL: 99,

        level: 5,
        qty: "1d6 + 4",
        life: 1,
        attacks: 1,
        damage: 1,

        treasure: { table: "tresors", rolls: 1, mod: 0 },
        morale: 0,
        xp: "Aucun",
        habitat: "Ruines",
        desc: "🐍 <b>Poison :</b> Blessure = Save Niv 4 ou -1 PV sup.",
        reaction: ["Pacifique", "Pacifique", "Combat", "Combat", "Combat", "Combat"]
    },
    {
        id: "diab_crapauds",
        name: "Crapauds Géants",
        type: "VERMINE",
        extension: "diaboliques",
        minHCL: 1, maxHCL: 99,

        level: 5,
        qty: "1d6 + 4",
        life: 1,
        attacks: 1,
        damage: 1,

        treasure: null,
        morale: 0,
        xp: "Aucun",
        habitat: "Marais",
        desc: "💥 <b>Explosion :</b> Tuer au contact = Save Poison Niv 3 ou -1 PV (sauf arc/sort).",
        reaction: ["Pacifique", "Pacifique", "Pacifique", "Combat", "Combat", "Combat"]
    },
    {
        id: "diab_squelettes_armure",
        name: "Squelettes en Armure",
        type: "VERMINE", // Demandé en Vermine
        extension: "diaboliques",
        minHCL: 1, maxHCL: 99,

        level: 5,
        qty: "2d3 + 4",
        life: 1,
        attacks: 1,
        damage: 1,

        treasure: { table: "tresors", rolls: 1, mod: -1 },
        morale: "Sans peur", // Morts-vivants
        xp: "Aucun",
        habitat: "Cryptes",
        desc: "🛡️ <b>Armure :</b> Pas de bonus écrasant. Arc à -1. (Morts-vivants).",
        reaction: ["Combat à mort", "Combat à mort", "Combat à mort", "Combat à mort", "Combat à mort", "Combat à mort"]
    },
    {
        id: "diab_hommes_boucs",
        name: "Hommes-Boucs",
        type: "VERMINE", // Demandé en Vermine
        extension: "diaboliques",
        minHCL: 1, maxHCL: 99,

        level: 6,
        qty: "2d3 + 1",
        life: 1,
        attacks: 1,
        damage: 1,

        treasure: { table: "tresors", rolls: 1, mod: 0 },
        morale: "+2", // Moral spécifié
        xp: "Aucun",
        habitat: "Montagnes",
        desc: "🐐 <b>Charge :</b> Niv 8 au 1er tour !",
        reaction: ["Soudoyer (30 po)", "Combat", "Combat", "Combat", "Combat", "Combat à mort"]
    },
    // =========================================================================
    // ⚔️ SBIRES (Base & Diaboliques)
    // =========================================================================
    
    // --- BASE ---
    {
        id: "sbire_squelettes",
        name: "Squelettes",
        type: "SBIRE",
        minHCL: 1, maxHCL: 99,
        level: 3,
        qty: "1d6+2",
        life: 1, attacks: 1, damage: 1,
        treasure: null,
        morale: "Sans peur", // Morts-vivants
        habitat: "Cryptes",
        desc: "<b>(Morts-vivants)</b>. Pas de trésor. Pas de moral.<br>🔨 <b>Armes écrasantes :</b> +1 Attaque.<br>🏹 <b>Flèches :</b> -1 Attaque.",
        reaction: ["Combat à mort", "Combat à mort", "Combat à mort", "Combat à mort", "Combat à mort", "Combat à mort"]
    },
    {
        id: "sbire_zombies",
        name: "Zombies",
        type: "SBIRE",
        minHCL: 1, maxHCL: 99,
        level: 3,
        qty: "1d6",
        life: 1, attacks: 1, damage: 1,
        treasure: null,
        morale: "Sans peur",
        habitat: "Cryptes",
        desc: "<b>(Morts-vivants)</b>. Pas de trésor. Pas de moral.<br>🏹 <b>Flèches :</b> -1 Attaque.",
        reaction: ["Combat à mort", "Combat à mort", "Combat à mort", "Combat à mort", "Combat à mort", "Combat à mort"]
    },
    {
        id: "sbire_gobelins",
        name: "Gobelins",
        type: "SBIRE",
        minHCL: 1, maxHCL: 99,
        level: 3,
        qty: "1d6+3",
        life: 1, attacks: 1, damage: 1,
        treasure: { table: "tresors", rolls: 1, mod: -1 },
        morale: -1,
        habitat: "Grottes",
        desc: "⚡ <b>Surprise :</b> 1 chance sur 6 d'agir avant le groupe.",
        reaction: ["Fuite", "Soudoyer (5 po)", "Soudoyer (5 po)", "Combat", "Combat", "Combat"]
    },
    {
        id: "sbire_hobgobelins",
        name: "Hobgobelins",
        type: "SBIRE",
        minHCL: 1, maxHCL: 99,
        level: 4,
        qty: "1d6",
        life: 1, attacks: 1, damage: 1,
        treasure: { table: "tresors", rolls: 1, mod: 1 },
        morale: 0,
        habitat: "Donjon",
        desc: "Militaires organisés.",
        reaction: ["Fuite", "Soudoyer (10 po)", "Soudoyer (10 po)", "Combat", "Combat", "Combat à mort"]
    },
    {
        id: "sbire_orcs",
        name: "Orcs",
        type: "SBIRE",
        minHCL: 1, maxHCL: 99,
        level: 4,
        qty: "1d6+1",
        life: 1, attacks: 1, damage: 1,
        treasure: { table: "tresors", rolls: 1, mod: 0 },
        morale: 0,
        habitat: "Cavernes",
        desc: "😱 <b>Peur :</b> Test Moral si tué par magie (à -1 si groupe < 50%).<br>🚫 <b>Magie :</b> Pas d'objets magiques (Remplacer par d6 x d6 po).",
        reaction: ["Soudoyer (10 po)", "Soudoyer (10 po)", "Combat", "Combat", "Combat", "Combat à mort"]
    },
    {
        id: "sbire_trolls",
        name: "Trolls",
        type: "SBIRE", // Classé en sbire selon ta liste
        minHCL: 1, maxHCL: 99,
        level: 5,
        qty: "1d3",
        life: 1, attacks: 1, damage: 1,
        treasure: { table: "tresors", rolls: 1, mod: 0 },
        morale: 0,
        habitat: "Montagnes",
        desc: "♻️ <b>Régénération :</b> Sauf si tué par sort/acide ou découpé (Action). Sinon revient sur 5-6.",
        reaction: ["Combat", "Combat", "Combat à mort", "Combat à mort", "Combat à mort", "Combat à mort (Auto si Nain)"]
    },
    {
        id: "sbire_champignhommes",
        name: "Champignhommes",
        type: "SBIRE",
        minHCL: 1, maxHCL: 99,
        level: 3,
        qty: "2d6",
        life: 1, attacks: 1, damage: 1,
        treasure: { table: "tresors", rolls: 1, mod: 0 },
        morale: 0,
        habitat: "Humide",
        desc: "🍄 <b>Poison :</b> Dégâts = Save Poison Niv 3 ou -1 PV.<br><i>(Halfelins ajoutent leur niveau).</i>",
        reaction: ["Soudoyer (d6 po)", "Soudoyer (d6 po)", "Combat", "Combat", "Combat", "Combat"]
    },

    // --- DIABOLIQUES ---
    {
        id: "sbire_diab_pillards_orcs",
        name: "Pillards Orcs",
        type: "SBIRE",
        extension: "diaboliques",
        minHCL: 1, maxHCL: 99,
        level: 5,
        qty: "1d6+6",
        life: 1, attacks: 1, damage: 1,
        treasure: { table: "tresors", rolls: 3, mod: -1 }, // "3 Trésors à -1"
        morale: 0,
        habitat: "Ruines",
        desc: "😱 <b>Peur Magie :</b> Moral si tué par sort (-1 si < 50%).",
        reaction: ["Soudoyer (40 po)", "Combat", "Combat à mort", "Combat à mort", "Combat à mort", "Combat à mort"]
    },
    {
        id: "sbire_diab_cockatrices",
        name: "Cockatrices",
        type: "SBIRE",
        extension: "diaboliques",
        minHCL: 1, maxHCL: 99,
        level: 5,
        qty: "1d3+4",
        life: 1, attacks: 1, damage: 1,
        treasure: { table: "tresors", rolls: 1, mod: 0 },
        morale: 0,
        habitat: "Nids",
        desc: "🗿 <b>Pétrification :</b> Blessure = Save Niv 2 ou Pétrifié (Soin: Bénédiction).",
        reaction: ["Combat à mort", "Combat à mort", "Combat à mort", "Combat à mort", "Combat à mort", "Combat à mort"]
    },
    {
        id: "sbire_diab_nains_possedes",
        name: "Nains Possédés",
        type: "SBIRE",
        extension: "diaboliques",
        minHCL: 1, maxHCL: 99,
        level: 5,
        qty: "1d6+3",
        life: 1, attacks: 1, damage: 1,
        treasure: { table: "tresors", rolls: 1, mod: 0 },
        morale: "Sans peur",
        habitat: "Mines",
        desc: "<b>(Morts-vivants)</b>. 👿 <b>Tenace :</b> Mort sur 1-2. Sur 3-6, attaque encore une fois !",
        reaction: ["Soudoyer (30 po)", "Soudoyer (30 po)", "Combat", "Combat", "Combat", "Combat à mort"]
    },
    {
        id: "sbire_diab_gnolls",
        name: "Gnolls",
        type: "SBIRE",
        extension: "diaboliques",
        minHCL: 1, maxHCL: 99,
        level: 6,
        qty: "2d3+4",
        life: 1, attacks: 1, damage: 1,
        treasure: { table: "tresors", rolls: 1, mod: 0 },
        morale: 1,
        habitat: "Plaines",
        desc: "🩸 <b>Frénésie :</b> Niv 7 contre les blessés.",
        reaction: ["Soudoyer (20 po)", "Soudoyer (20 po)", "Combat", "Combat", "Combat à mort", "Combat à mort"]
    },
    {
        id: "sbire_diab_maitrelames",
        name: "Maîtrelames Hobgobelins",
        type: "SBIRE",
        extension: "diaboliques",
        minHCL: 1, maxHCL: 99,
        level: 6,
        qty: "2d3+2",
        life: 1, attacks: 1, damage: 1,
        treasure: { table: "tresors", rolls: 1, mod: 1 },
        morale: 0,
        habitat: "Caserne",
        desc: "⚔️ <b>Contre-attaque :</b> Si vous faites 1 au dé (contact), subissez une attaque bonus.",
        reaction: ["Soudoyer (30 po)", "Soudoyer (30 po)", "Soudoyer (30 po)", "Combat", "Combat", "Combat à mort"]
    },
    {
        id: "sbire_diab_esclavagistes",
        name: "Esclavagistes du Chaos",
        type: "SBIRE",
        extension: "diaboliques",
        minHCL: 1, maxHCL: 99,
        level: 7,
        qty: "2d3+2",
        life: 1, attacks: 1, damage: 1,
        treasure: { table: "tresors", rolls: 2, mod: 0 },
        morale: +1,
        habitat: "Prison",
        desc: "⛓️ <b>Piège :</b> Résolvez un Piège à Ours (Niv 4) avant le combat (sauf errants).",
        reaction: ["Soudoyer (40 po)", "Soudoyer (40 po)", "Soudoyer (40 po)", "Combat", "Combat", "Combat"]
    },

    // =========================================================================
    // 👁️ MONSTRES ÉTRANGES (Base & Diaboliques)
    // =========================================================================
    
    // --- BASE ---
    {
        id: "etrange_minotaure",
        name: "Minotaure",
        type: "ETRANGE",
        minHCL: 1, maxHCL: 99,
        level: 5,
        qty: "1",
        life: 4, attacks: 2, damage: 1,
        treasure: { table: "tresors", rolls: 1, mod: 0 },
        morale: 0,
        habitat: "Labyrinthe",
        desc: "🐂 <b>Charge :</b> Votre 1er jet de Défense est à -1.<br><i>Déteste les Halfelins.</i>",
        reaction: ["Soudoyer (60 po)", "Soudoyer (60 po)", "Combat", "Combat", "Combat", "Combat à mort"]
    },
    {
        id: "etrange_devoreur_acier",
        name: "Dévoreur d’acier",
        type: "ETRANGE",
        minHCL: 1, maxHCL: 99,
        level: 3,
        qty: "1",
        life: 4, attacks: 3, damage: 0, // Dégâts spéciaux
        treasure: null,
        morale: 0,
        habitat: "Ruines",
        desc: "🛡️ <b>Mangeur de métal :</b> Ignore Armure Lourde.<br>⚠️ <b>Touche = Détruit objet :</b> Armure ➔ Bouclier ➔ Arme ➔ 3d6 po (Pas de dégâts PV).",
        reaction: ["Fuite", "Soudoyer (d6 po - Pas d'Or des fous)", "Soudoyer (d6 po)", "Combat", "Combat", "Combat"]
    },
    {
        id: "etrange_chimere",
        name: "Chimère",
        type: "ETRANGE",
        minHCL: 1, maxHCL: 99,
        level: 5,
        qty: "1",
        life: 6, attacks: 3, damage: 1,
        treasure: { table: "tresors", rolls: 1, mod: 0 },
        morale: 0,
        habitat: "Montagne",
        desc: "🔥 <b>Souffle (1-2 sur d6) :</b> Remplace les attaques. Tout le monde fait un Save Feu Niv 4 ou perd 1 PV.",
        reaction: ["Soudoyer (50 po)", "Combat", "Combat", "Combat", "Combat", "Combat"]
    },
    {
        id: "etrange_catoblepas",
        name: "Catoblépas",
        type: "ETRANGE",
        minHCL: 1, maxHCL: 99,
        level: 4,
        qty: "1",
        life: 4, attacks: 1, damage: 1,
        treasure: { table: "tresors", rolls: 1, mod: 1 },
        morale: 0,
        habitat: "Marais",
        desc: "👁️ <b>Regard (Début du combat) :</b> Tous les persos font un Save Niv 4 ou perdent 1 PV.",
        reaction: ["Fuite", "Combat", "Combat", "Combat", "Combat", "Combat"]
    },
    {
        id: "etrange_araignee_geante",
        name: "Araignée géante", // Unique, différente de la vermine
        type: "ETRANGE",
        minHCL: 1, maxHCL: 99,
        level: 5,
        qty: "1",
        life: 3, attacks: 2, damage: 1,
        treasure: { table: "tresors", rolls: 2, mod: 0 },
        morale: 0,
        habitat: "Toiles",
        desc: "🕸️ <b>Toiles :</b> Fuite impossible (sauf Boule de feu).<br>☠️ <b>Poison :</b> Blessure = Save Niv 3 ou -1 PV sup.",
        reaction: ["Combat", "Combat", "Combat", "Combat", "Combat", "Combat"]
    },
    {
        id: "etrange_gremlins",
        name: "Gremlins Invisibles",
        type: "ETRANGE",
        minHCL: 1, maxHCL: 99,
        level: 0, // Spécial
        qty: "1",
        life: 99, attacks: 0, damage: 0,
        treasure: null,
        morale: 0,
        habitat: "Partout",
        desc: "⚠️ <b>VOL :</b> Ils volent <b>d6+3 objets</b> !<br><b>Ordre de vol :</b> Magique ➔ Parchemin ➔ Potion ➔ Arme ➔ Gemme ➔ Pièces (paquet de 10).<br><i>Impossibles à combattre. Pas d'XP.</i><br>(S'ils volent TOUT : Vous gagnez un Indice).",
        reaction: [] // Pas de réaction standard
    },

    // --- DIABOLIQUES ---
    {
        id: "etrange_diab_doppleganger",
        name: "Doppleganger",
        type: "ETRANGE",
        extension: "diaboliques",
        minHCL: 1, maxHCL: 99,
        level: 5,
        qty: "1",
        life: 5, attacks: 1, damage: 1,
        treasure: { table: "tresors", rolls: 1, mod: 0 },
        morale: 0,
        habitat: "Villes",
        desc: "🎭 <b>Copie :</b> Prend l'apparence d'un PJ.<br>😵 <b>Confusion :</b> Chaque tour, faites un Save Niv 4 pour attaquer.<br><i>Le PJ copié attaque normalement.</i>",
        reaction: ["Combat", "Combat", "Combat", "Combat", "Combat", "Combat"]
    },
    {
        id: "etrange_diab_manterodeur",
        name: "Manterôdeur",
        type: "ETRANGE",
        extension: "diaboliques",
        minHCL: 1, maxHCL: 99,
        level: 6,
        qty: "1",
        life: 5, attacks: 1, damage: 1,
        treasure: null,
        morale: 0,
        habitat: "Plafond",
        desc: "👀 <b>Plafond :</b> Repérer sur 1-2 (1-4 si Roublard) = Fuite possible.<br>😱 <b>Embuscade :</b> Save Esquive Niv 3 (-1 Lourde, +1 Elfe/Roub).<br><b>Échec :</b> Paralysé et -1 PV auto chaque tour.",
        reaction: ["Combat à mort", "Combat à mort", "Combat à mort", "Combat à mort", "Combat à mort", "Combat à mort"]
    },
    {
        id: "etrange_diab_limon_vert",
        name: "Limon vert",
        type: "ETRANGE",
        extension: "diaboliques",
        minHCL: 1, maxHCL: 99,
        level: 6,
        qty: "1",
        life: 8, attacks: 3, damage: 1,
        treasure: null,
        morale: "Sans peur",
        habitat: "Humide",
        desc: "🤢 <b>Maladie :</b> Touche = Save Maladie Niv 4 (Halfelin +½).<br><b>Effet :</b> Chaque fois que vous perdez 1 PV, perdez-en un autre.<br><i>Soin : Bénédiction. Mort = Devient Limon.</i>",
        reaction: ["Combat à mort", "Combat à mort", "Combat à mort", "Combat à mort", "Combat à mort", "Combat à mort"]
    },
    {
        id: "etrange_diab_cube_acide",
        name: "Cube acide",
        type: "ETRANGE",
        extension: "diaboliques",
        minHCL: 1, maxHCL: 99,
        level: 6,
        qty: "1",
        life: 6, attacks: 1, damage: 1,
        treasure: { table: "tresors", rolls: 3, mod: 0 },
        morale: "Sans peur",
        habitat: "Couloirs",
        desc: "🧊 <b>Transparent :</b> Attaque en 1er sur 1-3.<br>📦 <b>Engloutissement :</b> Save Niv 2 (Niv 4 si attaqué au CàC) ou paralysé.<br>🚫 <b>Immune :</b> Sommeil, Éclair. Pas de bonus Roublard.",
        reaction: ["Combat à mort", "Combat à mort", "Combat à mort", "Combat à mort", "Combat à mort", "Combat à mort"]
    },
    {
        id: "etrange_diab_golem_chair",
        name: "Golem de chair",
        type: "ETRANGE",
        extension: "diaboliques",
        minHCL: 1, maxHCL: 99,
        level: 7,
        qty: "1",
        life: 8, attacks: 2, damage: 1,
        treasure: { table: "tresors", rolls: 1, mod: 0 },
        morale: 2,
        habitat: "Labo",
        desc: "🛡️ <b>Immune :</b> Écrasant et Sorts (Sauf Boule de Feu).<br>💥 <b>Brutal :</b> Si vous faites 1 en Défense = 2 Dégâts.",
        reaction: ["Pacifique", "Pacifique", "Combat", "Combat", "Combat", "Combat"]
    },
    {
        id: "etrange_diab_monstre_cimeterres",
        name: "Monstre aux cimeterres",
        type: "ETRANGE",
        extension: "diaboliques",
        minHCL: 1, maxHCL: 99,
        level: 8,
        qty: "1",
        life: 12, attacks: 2, damage: 1,
        treasure: { table: "tresors", rolls: 2, mod: 1 },
        morale: 0,
        habitat: "Arène",
        desc: "⚔️ <b>Lames :</b> Bras-cimeterres.<br>🚫 <b>Immune :</b> Sommeil.<br><i>Si Nain dans le groupe : Combat à mort.</i>",
        reaction: ["Soudoyer (250 po)", "Soudoyer (250 po)", "Combat", "Combat", "Combat à mort", "Combat à mort"]
    },

    // =========================================================================
    // 💀 BOSS (Base & Diaboliques)
    // =========================================================================
    
    // --- BASE ---
    {
        id: "boss_momie",
        name: "Momie",
        type: "BOSS",
        minHCL: 1, maxHCL: 99,
        level: 5,
        qty: "1",
        life: 4, attacks: 2, damage: 1,
        treasure: { table: "tresors", rolls: 1, mod: 2 },
        morale: "Sans peur",
        habitat: "Tombeau",
        desc: "<b>(Mort-vivant)</b>.<br>☣️ <b>Malédiction :</b> Si tué par Momie, le perso devient Momie.<br>🔥 <b>Boule de feu :</b> Attaque à +2 contre elle.",
        reaction: ["Combat", "Combat", "Combat", "Combat", "Combat", "Combat"]
    },
    {
        id: "boss_brute_orque",
        name: "Brute Orque",
        type: "BOSS",
        minHCL: 1, maxHCL: 99,
        level: 5,
        qty: "1",
        life: 5, attacks: 2, damage: 1,
        treasure: { table: "tresors", rolls: 1, mod: 1 },
        morale: 0,
        habitat: "Cavernes",
        desc: "🚫 <b>Pas d'objets magiques :</b> Si le trésor indique un objet magique, remplacez par <b>2d6 x d6 po</b>.",
        reaction: ["Soudoyer (50 po)", "Combat", "Combat", "Combat", "Combat", "Combat à mort"]
    },
    {
        id: "boss_ogre",
        name: "Ogre",
        type: "BOSS",
        minHCL: 1, maxHCL: 99,
        level: 5,
        qty: "1",
        life: 6, attacks: 1, damage: 2, // Brutal
        treasure: { table: "tresors", rolls: 1, mod: 0 },
        morale: 0,
        habitat: "Grottes",
        desc: "💢 <b>Brutal :</b> Inflige <b>2 Dégâts</b> par coup !",
        reaction: ["Soudoyer (30 po)", "Combat", "Combat", "Combat à mort", "Combat à mort", "Combat à mort"]
    },
    {
        id: "boss_meduse",
        name: "Méduse",
        type: "BOSS",
        minHCL: 1, maxHCL: 99,
        level: 4,
        qty: "1",
        life: 4, attacks: 1, damage: 1,
        treasure: { table: "tresors", rolls: 1, mod: 1 },
        morale: 0,
        habitat: "Ruines",
        desc: "🗿 <b>Regard (Début combat) :</b> Save Niv 4 ou <b>Pétrifié</b> (Hors-jeu).<br><i>(Roublards +½ niv. Soin : Bénédiction).</i>",
        reaction: ["Soudoyer (6d6 po)", "Quête", "Combat", "Combat", "Combat", "Combat à mort"]
    },
    {
        id: "boss_seigneur_chaos_base",
        name: "Seigneur du Chaos",
        type: "BOSS",
        minHCL: 1, maxHCL: 99,
        level: 6,
        qty: "1",
        life: 4, attacks: 3, damage: 1,
        treasure: { table: "tresors", rolls: 2, mod: 1 },
        morale: 0,
        habitat: "Temple",
        desc: "🎲 <b>Mort du Boss :</b> Sur 5-6 au d6, trouvez un Indice.",
        specialAction: { label: "⚡ Déterminer Pouvoir (d6)", table: "pouvoirs_chaos" },
        reaction: ["Fuite", "Combat", "Combat à mort", "Combat à mort", "Combat à mort", "Combat à mort"]
    },
    {
        id: "boss_petit_dragon",
        name: "Petit Dragon",
        type: "BOSS",
        minHCL: 1, maxHCL: 99,
        level: 6,
        qty: "1",
        life: 5, attacks: 2, damage: 1,
        treasure: { table: "tresors", rolls: 3, mod: 1 },
        morale: 0,
        habitat: "Antre",
        desc: "🔥 <b>Chaque tour (1-2 sur d6) :</b> Souffle ! (Save Niv 6 ou 1 Dégât).<br>🦷 <b>Sinon :</b> 2 Attaques (Morsures).",
        reaction: ["Endormi (+2 à votre 1ère attaque)", "Soudoyer (100+ po)", "Soudoyer (100+ po)", "Combat", "Combat", "Quête"]
    },

    // --- DIABOLIQUES ---
    {
        id: "boss_diab_seigneur_chaos",
        name: "Seigneur du Chaos (Diabolique)",
        type: "BOSS",
        extension: "diaboliques",
        minHCL: 1, maxHCL: 99,
        level: 6,
        qty: "1",
        life: 7, attacks: 3, damage: 1,
        treasure: { table: "tresors", rolls: 3, mod: 0 },
        morale: 0,
        habitat: "Temple",
        desc: "⚡ <b>Pouvoirs :</b> (1-4 Œil, 5 Drain, 6 Flammes).<br>⛓️ <b>Esclaves :</b> Libérés a la fin du combat = Indice mais jet Monstres Errants.",
        specialAction: { label: "⚡ Déterminer Pouvoir (d6)", table: "pouvoirs_chaos" },
        reaction: ["Soudoyer (200 po)", "Soudoyer (200 po)", "Combat à mort", "Combat à mort", "Combat à mort", "Combat à mort"]
    },
    {
        id: "boss_diab_demon_squelette",
        name: "Démon Squelette",
        type: "BOSS",
        extension: "diaboliques",
        minHCL: 1, maxHCL: 99,
        level: 7,
        qty: "1",
        life: 8, attacks: 2, damage: 1,
        treasure: { table: "tresors", rolls: 3, mod: 0 },
        morale: 1,
        habitat: "Enfers",
        desc: "<b>(Mort-vivant)</b>.<br>🩸 <b>Sang Maudit :</b> Chaque fois que VOUS êtes blessé, un Squelette apparaît !",
        specialAction: { label: "💀 Sang : Invoquer Squelette", table: "invocation_squelette_armure" },
        reaction: ["Défi magique", "Défi magique", "Combat", "Combat", "Combat", "Quête"]
    },
    {
        id: "boss_diab_commandant_hob",
        name: "Commandant Hobgobelin",
        type: "BOSS",
        extension: "diaboliques",
        minHCL: 1, maxHCL: 99,
        level: 7,
        qty: "1",
        life: 8, attacks: 2, damage: 1,
        treasure: { table: "tresors", rolls: 2, mod: 0 },
        morale: 0,
        habitat: "QG",
        desc: "⚔️ <b>Lame Vibrante :</b> À chaque attaque du Boss, 3 chances sur 6 que des Maîtrelames arrivent.",
        specialAction: { label: "⚔️ Appel : Invoquer Maîtrelames", table: "invocation_maitrelame" },
        reaction: ["Soudoyer (400 po)", "Soudoyer (400 po)", "Soudoyer (400 po)", "Combat à mort", "Combat à mort", "Combat à mort"]
    },
    {
        id: "boss_diab_apparition",
        name: "Apparition",
        type: "BOSS",
        extension: "diaboliques",
        minHCL: 1, maxHCL: 99,
        level: 7,
        qty: "1",
        life: 6, attacks: 1, damage: 1,
        treasure: { table: "tresors", rolls: 2, mod: 0 },
        morale: 0,
        habitat: "Ruines",
        desc: "<b>(Mort-vivant)</b>. 🕯️ <b>Noir (2/6) :</b> Lanternes éteintes.<br>😱 <b>Touche :</b> Save Magie Niv 4 ou Perte 1 Niveau.<br>🛡️ <b>Immunité :</b> Armes magiques/argent/feu/eau bénite seulement.",
        reaction: ["Soudoyer (Objet Magique)", "Soudoyer (Objet Magique)", "Quête", "Combat", "Combat", "Combat"]
    },
    {
        id: "boss_diab_troll_massif",
        name: "Troll Massif",
        type: "BOSS",
        extension: "diaboliques",
        minHCL: 1, maxHCL: 99,
        level: 8,
        qty: "1",
        life: 7, attacks: 2, damage: 1,
        treasure: { table: "tresors", rolls: 4, mod: 0 },
        morale: 0,
        habitat: "Cavernes",
        desc: "🔨 <b>Résistant :</b> Écrasant à -1.<br>♻️ <b>Régénération :</b> 1 PV/tour (Sauf feu/acide/découpe).",
        reaction: ["Soudoyer (250 po)", "Soudoyer (250 po)", "Soudoyer (250 po)", "Soudoyer (250 po)", "Combat à mort", "Combat à mort"]
    },
    {
        id: "boss_diab_jeune_dragon_rouge",
        name: "Jeune Dragon Rouge",
        type: "BOSS",
        extension: "diaboliques",
        minHCL: 1, maxHCL: 99,
        level: 9,
        qty: "1",
        life: 8, attacks: 2, damage: 1,
        treasure: { table: "tresors", rolls: 4, mod: 1 },
        morale: 0,
        habitat: "Montagne",
        desc: "🔥 <b>1er Tour :</b> Souffle Feu (Save Niv 7 ou d3 Dégâts).<br>Ensuite : 2 Attaques.",
        reaction: ["Endormi (+2 à votre 1ère attaque)", "Soudoyer (300 po)", "Soudoyer (300 po)", "Combat", "Combat", "Quête"]
    },
];
