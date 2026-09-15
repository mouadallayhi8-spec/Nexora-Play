"use strict";

/* =========================================================
   NEXORA PLAY V10
   SUPABASE + CLASSEMENT MONDIAL
   ========================================================= */

/* =========================================================
   SUPABASE
   ========================================================= */

const SUPABASE_URL = "https://bqnotpfwzsarkawtkako.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_gREwpkTlsJ-g4urIYrqZGA_gqVFIY0c";

const supabaseClient =
  window.supabase?.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
  ) || null;

const CLOUD_ID_KEY = "nexoraPlayCloudId";

/* =========================================================
   STORAGE
   ========================================================= */

const STORAGE_KEY = "nexoraPlayV10";

const defaultPlayer = {
  name: "Player",
  avatar: "P",
  xp: 0,
  level: 1,
  gamesPlayed: 0,
  wins: 0,
  losses: 0,
  streak: 0,
  lastDay: "",
  favoriteGames: [],
  achievements: [],
  history: [],
  quizCorrect: 0,
  quizAnswered: 0,
  bestScores: {},
  theme: "dark"
};

let player = loadPlayer();

/* =========================================================
   STATE
   ========================================================= */

const state = {
  page: "home",
  game: null,
  timers: [],
  intervals: [],
  animation: null,
  token: 0,

  quiz: null,
  memory: null,
  reaction: null,
  number: null,
  word: null,
  code: null,
  snake: null,
  pong: null,
  brick: null,
  space: null
};

/* =========================================================
   GAMES
   ========================================================= */

const games = [
  {
    id: "memory",
    name: "Memory Rush",
    icon: "🧠",
    category: "Réflexion",
    description: "Trouve toutes les paires le plus rapidement possible.",
    xp: 40
  },
  {
    id: "reaction",
    name: "Reaction Test",
    icon: "⚡",
    category: "Réflexes",
    description: "Attends le bon moment puis clique le plus vite possible.",
    xp: 35
  },
  {
    id: "number",
    name: "Number Rush",
    icon: "🔢",
    category: "Challenge",
    description: "Trouve le nombre mystère en un minimum d'essais.",
    xp: 35
  },
  {
    id: "word",
    name: "Word Scramble",
    icon: "🔤",
    category: "Mots",
    description: "Remets les lettres mélangées dans le bon ordre.",
    xp: 35
  },
  {
    id: "code",
    name: "Code Breaker",
    icon: "🔐",
    category: "Logique",
    description: "Trouve le code secret à quatre chiffres.",
    xp: 50
  },
  {
    id: "snake",
    name: "Snake",
    icon: "🐍",
    category: "Arcade",
    description: "Mange les bonus et fais grandir ton serpent.",
    xp: 45
  },
  {
    id: "pong",
    name: "Pong",
    icon: "🏓",
    category: "Arcade",
    description: "Affronte l'ordinateur dans un duel classique.",
    xp: 50
  },
  {
    id: "brick",
    name: "Brick Breaker",
    icon: "🧱",
    category: "Arcade",
    description: "Détruis toutes les briques sans perdre la balle.",
    xp: 60
  },
  {
    id: "space",
    name: "Space Dodge",
    icon: "🚀",
    category: "Arcade",
    description: "Évite les météores et bats ton meilleur score.",
    xp: 55
  }
];

/* =========================================================
   QUIZ DATA
   ========================================================= */

const quizData = {
  "HTML": [
    ["Quelle balise crée un lien ?", ["<a>", "<link>", "<href>", "<url>"], 0, "facile"],
    ["Quelle balise contient le titre de la page ?", ["<title>", "<headtitle>", "<h1>", "<name>"], 0, "facile"],
    ["Quel attribut indique l'adresse d'une image ?", ["src", "href", "alt", "link"], 0, "facile"],
    ["Quelle balise crée une liste non ordonnée ?", ["<ul>", "<ol>", "<list>", "<li>"], 0, "facile"],
    ["Quel élément contient le contenu visible principal ?", ["<body>", "<mainpage>", "<content>", "<visible>"], 0, "moyen"],
    ["Quel attribut améliore l'accessibilité d'une image ?", ["alt", "access", "label", "aria-img"], 0, "moyen"],
    ["Quelle balise permet d'intégrer une vidéo ?", ["<video>", "<media>", "<movie>", "<player>"], 0, "moyen"],
    ["Quelle balise représente une section indépendante ?", ["<section>", "<part>", "<area>", "<zone>"], 0, "moyen"],
    ["Quel attribut rend un champ obligatoire ?", ["required", "needed", "must", "validate"], 0, "difficile"],
    ["Quelle API permet de stocker des données côté navigateur ?", ["Web Storage", "Web Memory", "Browser SQL", "Client Cache"], 0, "difficile"],
    ["Quel élément est sémantiquement adapté à une navigation ?", ["<nav>", "<navigate>", "<menu-nav>", "<links>"], 0, "difficile"],
    ["Quel attribut associe un label à un champ ?", ["for", "target", "bind", "input"], 0, "difficile"]
  ],

  "Réseau informatique": [
    ["Que signifie IP ?", ["Internet Protocol", "Internet Port", "Internal Process", "Input Protocol"], 0, "facile"],
    ["Quel appareil relie plusieurs réseaux ?", ["Routeur", "Clavier", "Écran", "Switch USB"], 0, "facile"],
    ["Quel protocole est utilisé pour les pages web sécurisées ?", ["HTTPS", "FTP", "SMTP", "POP3"], 0, "facile"],
    ["Quel appareil connecte plusieurs machines dans un réseau local ?", ["Switch", "Modem TV", "Scanner", "Firewall physique uniquement"], 0, "facile"],
    ["Quel protocole traduit un nom de domaine en adresse IP ?", ["DNS", "HTTP", "SSH", "DHCP"], 0, "moyen"],
    ["Quel protocole attribue généralement une IP automatiquement ?", ["DHCP", "DNS", "FTP", "ARP"], 0, "moyen"],
    ["Que signifie LAN ?", ["Local Area Network", "Large Access Network", "Linked Area Node", "Local Access Name"], 0, "moyen"],
    ["Quel protocole permet une connexion distante sécurisée ?", ["SSH", "FTP", "HTTP", "DNS"], 0, "moyen"],
    ["Quelle adresse identifie une interface réseau ?", ["MAC", "HTML", "CPU", "RAM"], 0, "difficile"],
    ["Quel protocole est orienté connexion ?", ["TCP", "UDP", "DNS", "ARP"], 0, "difficile"],
    ["Quel équipement filtre le trafic selon des règles de sécurité ?", ["Pare-feu", "Hub", "Écran", "Point d'accès uniquement"], 0, "difficile"],
    ["Quel protocole est généralement sans connexion ?", ["UDP", "TCP", "SSH", "TLS"], 0, "difficile"]
  ],

  "Cybersécurité": [
    ["Qu'est-ce qu'un mot de passe fort ?", ["Long et difficile à deviner", "Très court", "Son prénom", "123456"], 0, "facile"],
    ["Qu'est-ce que le phishing ?", ["Une tentative de tromperie", "Un antivirus", "Un protocole", "Un langage"], 0, "facile"],
    ["À quoi sert un antivirus ?", ["Détecter des menaces", "Accélérer Internet", "Créer des comptes", "Remplacer le système"], 0, "facile"],
    ["Que faut-il faire avec un lien suspect ?", ["Ne pas cliquer", "Cliquer rapidement", "Le partager", "Donner son mot de passe"], 0, "facile"],
    ["Que signifie 2FA ?", ["Authentification à deux facteurs", "Deux fichiers actifs", "Deux firewalls", "Accès FTP"], 0, "moyen"],
    ["Pourquoi mettre les logiciels à jour ?", ["Corriger notamment des failles", "Changer la couleur", "Augmenter la taille", "Supprimer Internet"], 0, "moyen"],
    ["Qu'est-ce qu'une donnée sensible ?", ["Une information qui doit être protégée", "Une image publique", "Une couleur", "Une police"], 0, "moyen"],
    ["Que fait le chiffrement ?", ["Rend les données illisibles sans clé", "Supprime les données", "Accélère le Wi-Fi", "Crée un écran"], 0, "moyen"],
    ["Qu'est-ce qu'une faille de sécurité ?", ["Une faiblesse exploitable", "Un antivirus", "Un câble", "Une sauvegarde"], 0, "difficile"],
    ["Quel principe limite les accès au strict nécessaire ?", ["Moindre privilège", "Accès total", "Open Access", "Super utilisateur"], 0, "difficile"],
    ["Pourquoi faire des sauvegardes ?", ["Pour récupérer les données", "Pour augmenter le CPU", "Pour changer l'IP", "Pour supprimer les fichiers"], 0, "difficile"],
    ["Quel est un bon réflexe face à un message suspect ?", ["Vérifier sa source", "Répondre avec ses identifiants", "Le transférer", "Désactiver l'antivirus"], 0, "difficile"]
  ],

  "Bases de programmation": [
    ["Qu'est-ce qu'une variable ?", ["Une valeur stockée sous un nom", "Un écran", "Un câble", "Un navigateur"], 0, "facile"],
    ["Quelle structure répète une instruction ?", ["Boucle", "Variable", "Classe uniquement", "Commentaire"], 0, "facile"],
    ["Quel mot représente souvent une condition ?", ["if", "loop", "varname", "printonly"], 0, "facile"],
    ["À quoi sert une fonction ?", ["Regrouper du code réutilisable", "Créer un câble", "Éteindre le PC", "Changer le clavier"], 0, "facile"],
    ["Qu'est-ce qu'un bug ?", ["Une erreur dans un programme", "Une variable", "Une image", "Un serveur"], 0, "moyen"],
    ["Qu'est-ce qu'un tableau ?", ["Une collection de valeurs", "Un écran", "Une erreur", "Une boucle obligatoire"], 0, "moyen"],
    ["Que fait un opérateur + ?", ["Additionner dans un contexte numérique", "Supprimer une variable", "Créer une fonction", "Arrêter le programme"], 0, "moyen"],
    ["Pourquoi commenter du code ?", ["Pour l'expliquer", "Pour le ralentir", "Pour le supprimer", "Pour changer le CPU"], 0, "moyen"],
    ["Qu'est-ce qu'un algorithme ?", ["Une suite d'étapes pour résoudre un problème", "Une carte graphique", "Un virus", "Une base de données"], 0, "difficile"],
    ["Qu'est-ce qu'une condition imbriquée ?", ["Une condition dans une autre", "Une variable globale", "Une boucle infinie", "Une erreur réseau"], 0, "difficile"],
    ["Qu'est-ce qu'une valeur booléenne ?", ["Vrai ou faux", "Un nombre uniquement", "Une chaîne uniquement", "Une image"], 0, "difficile"],
    ["À quoi sert le débogage ?", ["À trouver et corriger des erreurs", "À supprimer Internet", "À créer une image", "À installer un écran"], 0, "difficile"]
  ],

  "Sciences": [
    ["Quelle planète est la plus proche du Soleil ?", ["Mercure", "Mars", "Terre", "Jupiter"], 0, "facile"],
    ["Quel gaz est essentiel à la respiration humaine ?", ["Oxygène", "Hélium", "Néon", "Hydrogène uniquement"], 0, "facile"],
    ["Quelle force nous maintient au sol ?", ["Gravité", "Lumière", "Électricité", "Pression sonore"], 0, "facile"],
    ["Combien de côtés possède un triangle ?", ["3", "4", "5", "6"], 0, "facile"],
    ["Quel organe pompe le sang ?", ["Cœur", "Poumon", "Foie", "Rein"], 0, "moyen"],
    ["Quelle est la formule de l'eau ?", ["H₂O", "CO₂", "O₂", "NaCl"], 0, "moyen"],
    ["Quel est le satellite naturel de la Terre ?", ["Lune", "Soleil", "Mars", "Vénus"], 0, "moyen"],
    ["Quelle unité mesure une force ?", ["Newton", "Watt", "Volt", "Octet"], 0, "moyen"],
    ["Quel phénomène transforme l'eau liquide en vapeur ?", ["Évaporation", "Fusion", "Condensation", "Solidification"], 0, "difficile"],
    ["Quel est le rôle principal de l'ADN ?", ["Porter une information génétique", "Produire du son", "Mesurer la température", "Créer de l'électricité"], 0, "difficile"],
    ["Quel phénomène explique la décomposition de la lumière blanche en couleurs ?", ["Dispersion", "Gravité", "Conduction", "Diffusion thermique"], 0, "difficile"],
    ["Quelle particule possède une charge électrique négative ?", ["Électron", "Proton", "Neutron", "Photon"], 0, "difficile"]
  ],

  "Géographie": [
    ["Quelle est la capitale de la France ?", ["Paris", "Lyon", "Marseille", "Lille"], 0, "facile"],
    ["Quel est le plus grand océan ?", ["Pacifique", "Atlantique", "Indien", "Arctique"], 0, "facile"],
    ["Sur quel continent se trouve l'Égypte ?", ["Afrique", "Europe", "Asie", "Amérique"], 0, "facile"],
    ["Quel pays possède Madrid comme capitale ?", ["Espagne", "Italie", "Portugal", "Grèce"], 0, "facile"],
    ["Quelle ligne sépare approximativement Nord et Sud ?", ["Équateur", "Méridien de Greenwich", "Tropique du Cancer", "Cercle polaire"], 0, "moyen"],
    ["Quel est le plus grand pays du monde par superficie ?", ["Russie", "Canada", "Chine", "États-Unis"], 0, "moyen"],
    ["Quel fleuve traverse l'Égypte ?", ["Nil", "Danube", "Amazonie", "Gange"], 0, "moyen"],
    ["Quelle est la capitale du Japon ?", ["Tokyo", "Kyoto", "Osaka", "Nagoya"], 0, "moyen"],
    ["Quel pays est surnommé le pays du Soleil-Levant ?", ["Japon", "Inde", "Chine", "Corée du Sud"], 0, "difficile"],
    ["Quel détroit sépare l'Europe de l'Afrique à l'ouest ?", ["Gibraltar", "Béring", "Malacca", "Bosporе"], 0, "difficile"],
    ["Quel est le plus haut sommet du monde ?", ["Everest", "K2", "Mont Blanc", "Kilimandjaro"], 0, "difficile"],
    ["Quelle mer sépare notamment l'Europe et l'Afrique ?", ["Méditerranée", "Baltique", "Caspienne", "Noire"], 0, "difficile"]
  ]
};

/* =========================================================
   ACHIEVEMENTS
   ========================================================= */

const achievementData = [
  ["first", "🎯 Premier défi", "Joue ton premier jeu.", p => p.gamesPlayed >= 1],
  ["five", "🔥 Déterminé", "Joue 5 parties.", p => p.gamesPlayed >= 5],
  ["ten", "🚀 Accro", "Joue 10 parties.", p => p.gamesPlayed >= 10],
  ["win", "🏆 Première victoire", "Gagne une partie.", p => p.wins >= 1],
  ["xp", "⭐ 500 XP", "Atteins 500 XP.", p => totalXP() >= 500],
  ["level5", "💎 Niveau 5", "Atteins le niveau 5.", p => p.level >= 5],
  ["quiz", "🎓 Curieux", "Réponds à 20 questions.", p => p.quizAnswered >= 20],
  [
    "perfect",
    "🧠 Sans faute",
    "Réussis un quiz sans erreur.",
    p => p.history.some(
      h => h.type === "quiz" &&
           h.score === h.total &&
           h.total > 0
    )
  ]
];

/* =========================================================
   CLOUD ID
   ========================================================= */

function getCloudId() {
  let id = localStorage.getItem(CLOUD_ID_KEY);

  if (id) return id;

  if (crypto?.randomUUID) {
    id = crypto.randomUUID();
  } else {
    id =
      "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        c => {
          const r = Math.random() * 16 | 0;
          const v = c === "x"
            ? r
            : (r & 0x3 | 0x8);

          return v.toString(16);
        }
      );
  }

  localStorage.setItem(CLOUD_ID_KEY, id);

  return id;
}

/* =========================================================
   SUPABASE SYNC
   ========================================================= */

let cloudSyncTimer = null;

function queueCloudSync() {
  clearTimeout(cloudSyncTimer);

  cloudSyncTimer = setTimeout(() => {
    syncPlayerToSupabase();
  }, 500);
}

async function syncPlayerToSupabase() {
  if (!supabaseClient) {
    console.warn("Supabase n'est pas chargé.");
    return false;
  }

  try {
    const payload = {
      id: getCloudId(),
      "Nom": player.name,
      "XP": totalXP(),
      "niveau": player.level,
      "games_played": player.gamesPlayed,
      "Victoires": player.wins,
      "quiz_correct": player.quizCorrect,
      "quiz_answered": player.quizAnswered,
      "updated_at": new Date().toISOString()
    };

    const { error } = await supabaseClient
      .from("players")
      .upsert(payload, {
        onConflict: "id"
      });

    if (error) {
      console.error("Erreur Supabase :", error);
      return false;
    }

    console.log("☁️ Profil synchronisé avec Supabase.");

    return true;

  } catch (error) {
    console.error("Erreur synchronisation :", error);
    return false;
  }
}

/* =========================================================
   LOAD GLOBAL LEADERBOARD
   ========================================================= */

async function loadGlobalLeaderboard() {
  const container =
    document.getElementById("globalLeaderboardBody");

  if (!container) return;

  if (!supabaseClient) {
    container.innerHTML = `
      <div class="empty">
        ⚠️ Supabase n'est pas chargé.
      </div>
    `;

    return;
  }

  container.innerHTML = `
    <div class="empty">
      ⏳ Chargement du classement mondial...
    </div>
  `;

  try {
    const { data, error } = await supabaseClient
      .from("players")
      .select(`
        id,
        "Nom",
        "XP",
        niveau,
        games_played,
        "Victoires",
        quiz_correct,
        quiz_answered
      `)
      .order("XP", {
        ascending: false
      })
      .order("Victoires", {
        ascending: false
      })
      .limit(50);

    if (error) {
      console.error("Erreur classement :", error);

      container.innerHTML = `
        <div class="empty">
          <div style="font-size:45px">⚠️</div>
          <h3>Classement indisponible</h3>
          <p style="margin-top:8px">
            Impossible de charger le classement mondial.
          </p>
        </div>
      `;

      return;
    }

    if (!data || data.length === 0) {
      container.innerHTML = `
        <div class="empty">
          <div style="font-size:45px">🏆</div>
          <h3>Aucun joueur pour le moment</h3>
          <p style="margin-top:8px">
            Sois le premier à jouer !
          </p>
        </div>
      `;

      return;
    }

    container.innerHTML = `
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Joueur</th>
              <th>Niveau</th>
              <th>Parties</th>
              <th>Victoires</th>
              <th>XP</th>
            </tr>
          </thead>

          <tbody>
            ${data.map((p, index) => {

              const isMe =
                p.id === getCloudId();

              const rank =
                index === 0
                  ? "🥇"
                  : index === 1
                    ? "🥈"
                    : index === 2
                      ? "🥉"
                      : index + 1;

              return `
                <tr class="${isMe ? "current-player" : ""}">

                  <td class="rank">
                    ${rank}
                  </td>

                  <td>
                    <strong>
                      ${escapeHTML(
                        p["Nom"] || "Player"
                      )}
                    </strong>

                    ${
                      isMe
                        ? `<span class="tag" style="margin-left:8px">
                             TOI
                           </span>`
                        : ""
                    }
                  </td>

                  <td>
                    ${Number(p.niveau) || 1}
                  </td>

                  <td>
                    ${Number(p.games_played) || 0}
                  </td>

                  <td>
                    ${Number(p["Victoires"]) || 0}
                  </td>

                  <td>
                    ⭐ ${Number(p["XP"]) || 0}
                  </td>

                </tr>
              `;

            }).join("")}
          </tbody>
        </table>
      </div>

      <p class="muted" style="margin-top:15px;text-align:center">
        🌐 Top 50 mondial
      </p>
    `;

  } catch (error) {
    console.error(error);

    container.innerHTML = `
      <div class="empty">
        <div style="font-size:45px">⚠️</div>
        <h3>Classement indisponible</h3>
        <p style="margin-top:8px">
          Une erreur est survenue.
        </p>
      </div>
    `;
  }
}

/* =========================================================
   STORAGE
   ========================================================= */

function loadPlayer() {
  try {
    const saved =
      JSON.parse(
        localStorage.getItem(STORAGE_KEY)
      );

    if (!saved) {
      return structuredClone(defaultPlayer);
    }

    return {
      ...structuredClone(defaultPlayer),
      ...saved,

      favoriteGames:
        Array.isArray(saved.favoriteGames)
          ? saved.favoriteGames
          : [],

      achievements:
        Array.isArray(saved.achievements)
          ? saved.achievements
          : [],

      history:
        Array.isArray(saved.history)
          ? saved.history
          : [],

      bestScores:
        saved.bestScores || {}
    };

  } catch {
    return structuredClone(defaultPlayer);
  }
}

function savePlayer() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(player)
  );
}

function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

/* =========================================================
   UTILS
   ========================================================= */

function today() {
  return new Date()
    .toISOString()
    .slice(0, 10);
}

function random(min, max) {
  return Math.floor(
    Math.random() * (max - min + 1)
  ) + min;
}

function shuffle(array) {
  const copy = [...array];

  for (
    let i = copy.length - 1;
    i > 0;
    i--
  ) {
    const j =
      Math.floor(
        Math.random() * (i + 1)
      );

    [
      copy[i],
      copy[j]
    ] = [
      copy[j],
      copy[i]
    ];
  }

  return copy;
}

function showToast(message) {
  const toast =
    document.getElementById("toast");

  if (!toast) return;

  toast.textContent = message;

  toast.classList.add("show");

  clearTimeout(showToast.timer);

  showToast.timer =
    setTimeout(() => {
      toast.classList.remove("show");
    }, 2600);
}

function addTimer(fn, ms) {
  const id = setTimeout(fn, ms);

  state.timers.push(id);

  return id;
}

function addInterval(fn, ms) {
  const id = setInterval(fn, ms);

  state.intervals.push(id);

  return id;
}

function stopAll() {
  state.timers.forEach(clearTimeout);
  state.intervals.forEach(clearInterval);

  state.timers = [];
  state.intervals = [];

  if (state.animation !== null) {
    cancelAnimationFrame(
      state.animation
    );

    state.animation = null;
  }

  state.token++;

  window.onkeydown = null;
  window.onkeyup = null;

  state.game = null;

  state.quiz = null;
  state.memory = null;
  state.reaction = null;
  state.number = null;
  state.word = null;
  state.code = null;
  state.snake = null;
  state.pong = null;
  state.brick = null;
  state.space = null;
}

function xpForNextLevel() {
  return 100 +
    (player.level - 1) * 50;
}

function addXP(amount) {
  if (
    !Number.isFinite(amount) ||
    amount <= 0
  ) {
    return;
  }

  player.xp += amount;

  let leveled = false;

  while (
    player.xp >= xpForNextLevel()
  ) {
    player.xp -= xpForNextLevel();

    player.level++;

    leveled = true;
  }

  if (leveled) {
    showToast(
      `🎉 Niveau ${player.level} atteint !`
    );
  }

  savePlayer();
  updateHeader();
}

function registerPlay(
  gameName,
  score,
  won,
  xp
) {
  const day = today();

  if (player.lastDay !== day) {

    if (player.lastDay) {

      const previous =
        new Date(player.lastDay);

      const current =
        new Date(day);

      const diff =
        Math.round(
          (current - previous) /
          86400000
        );

      player.streak =
        diff === 1
          ? player.streak + 1
          : 1;

    } else {
      player.streak = 1;
    }

    player.lastDay = day;
  }

  player.gamesPlayed++;

  if (won) {
    player.wins++;
  } else {
    player.losses++;
  }

  player.history.unshift({
    type: "game",
    name: gameName,
    score,
    won,
    xp,
    date:
      new Date()
        .toLocaleString("fr-FR")
  });

  player.history =
    player.history.slice(0, 30);

  const previous =
    player.bestScores[gameName];

  if (
    previous === undefined ||
    score > previous
  ) {
    player.bestScores[gameName] =
      score;
  }

  addXP(xp);

  updateAchievements();

  savePlayer();

  /* Synchronisation mondiale */
  queueCloudSync();
}

function updateAchievements() {
  achievementData.forEach(
    ([id, , , condition]) => {

      if (
        !player.achievements.includes(id) &&
        condition(player)
      ) {
        player.achievements.push(id);

        showToast(
          "🏅 Succès débloqué !"
        );
      }

    }
  );

  savePlayer();
}

function toggleFavorite(id) {
  if (
    player.favoriteGames.includes(id)
  ) {
    player.favoriteGames =
      player.favoriteGames.filter(
        x => x !== id
      );
  } else {
    player.favoriteGames.push(id);
  }

  savePlayer();

  render();
}

function updateHeader() {
  const miniName =
    document.getElementById(
      "miniName"
    );

  const miniLevel =
    document.getElementById(
      "miniLevel"
    );

  const miniAvatar =
    document.getElementById(
      "miniAvatar"
    );

  const themeIcon =
    document.getElementById(
      "themeIcon"
    );

  if (miniName) {
    miniName.textContent =
      player.name;
  }

  if (miniLevel) {
    miniLevel.textContent =
      `Niveau ${player.level}`;
  }

  if (miniAvatar) {
    miniAvatar.textContent =
      player.avatar;
  }

  if (themeIcon) {
    themeIcon.textContent =
      player.theme === "dark"
        ? "☾"
        : "☀";
  }

  document.body.classList.toggle(
    "light",
    player.theme === "light"
  );

  document
    .querySelectorAll("[data-page]")
    .forEach(btn => {
      btn.classList.toggle(
        "active",
        btn.dataset.page === state.page
      );
    });
}

function toggleTheme() {
  player.theme =
    player.theme === "dark"
      ? "light"
      : "dark";

  savePlayer();

  updateHeader();
}

function navigate(page) {
  stopAll();

  state.page = page;

  render();

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

/* =========================================================
   RENDER
   ========================================================= */

function render() {
  const app =
    document.getElementById("app");

  if (!app) return;

  switch (state.page) {

    case "games":
      app.innerHTML =
        renderGames();
      break;

    case "quiz":
      app.innerHTML =
        renderQuizHome();
      break;

    case "leaderboard":
      app.innerHTML =
        renderLeaderboard();
      break;

    case "profile":
      app.innerHTML =
        renderProfile();
      break;

    case "play":
      app.innerHTML =
        renderGameScreen();
      break;

    case "quizPlay":
      app.innerHTML =
        renderQuizGame();
      break;

    default:
      app.innerHTML =
        renderHome();
  }

  updateHeader();

  if (
    state.page === "leaderboard"
  ) {
    loadGlobalLeaderboard();
  }
}

/* =========================================================
   HOME
   ========================================================= */

function renderHome() {
  const xpNeed =
    xpForNextLevel();

  const percent =
    Math.min(
      100,
      (player.xp / xpNeed) * 100
    );

  return `
    <div class="page">

      <section class="hero">

        <div>

          <div class="eyebrow">
            NEXORA PLAY • V10
          </div>

          <h1>
            Joue.
            <span class="gradient-text">
              Apprends.
            </span>
            Progresse.
          </h1>

          <p>
            Une plateforme moderne avec des jeux arcade,
            des quiz éducatifs, des défis et un système
            de progression.
          </p>

          <div class="actions">

            <button
              class="btn primary"
              onclick="navigate('games')"
            >
              🎮 Jouer maintenant
            </button>

            <button
              class="btn"
              onclick="navigate('quiz')"
            >
              🎓 Faire un quiz
            </button>

          </div>

        </div>

        <div class="hero-card">

          <div class="level-ring">
            <strong>
              ${player.level}
            </strong>
          </div>

          <div class="center">

            <strong>
              Niveau ${player.level}
            </strong>

            <div class="xp-bar">

              <div
                style="width:${percent}%"
              ></div>

            </div>

            <small class="muted">
              ${player.xp} / ${xpNeed} XP
            </small>

          </div>

        </div>

      </section>

      <section class="section">

        <div class="stats-grid">

          <div class="stat">
            <div class="icon">🎮</div>
            <strong>
              ${player.gamesPlayed}
            </strong>
            <span>Parties jouées</span>
          </div>

          <div class="stat">
            <div class="icon">🏆</div>
            <strong>
              ${player.wins}
            </strong>
            <span>Victoires</span>
          </div>

          <div class="stat">
            <div class="icon">⭐</div>
            <strong>
              ${totalXP()}
            </strong>
            <span>XP total</span>
          </div>

          <div class="stat">
            <div class="icon">🔥</div>
            <strong>
              ${player.streak}
            </strong>
            <span>Streak</span>
          </div>

        </div>

      </section>

      <section class="section">

        <div class="section-head">

          <div>

            <h2>
              🚀 Défis du jour
            </h2>

            <p>
              Quelques objectifs pour progresser.
            </p>

          </div>

        </div>

        <div class="missions">
          ${renderMissions()}
        </div>

      </section>

      <section class="section">

        <div class="section-head">

          <div>

            <h2>
              🔥 Jeux populaires
            </h2>

            <p>
              Choisis ton prochain défi.
            </p>

          </div>

          <button
            class="btn"
            onclick="navigate('games')"
          >
            Voir tous
          </button>

        </div>

        <div class="cards">
          ${games
            .slice(0, 6)
            .map(gameCard)
            .join("")}
        </div>

      </section>

    </div>
  `;
}

function totalXP() {
  let total =
    player.xp;

  for (
    let i = 1;
    i < player.level;
    i++
  ) {
    total +=
      100 +
      (i - 1) * 50;
  }

  return total;
}

function renderMissions() {
  const missions = [
    {
      title: "Jouer 3 parties",
      current:
        Math.min(
          player.gamesPlayed,
          3
        ),
      target: 3,
      reward: 60
    },
    {
      title: "Gagner 2 parties",
      current:
        Math.min(
          player.wins,
          2
        ),
      target: 2,
      reward: 80
    },
    {
      title: "Répondre à 5 questions",
      current:
        Math.min(
          player.quizAnswered,
          5
        ),
      target: 5,
      reward: 50
    }
  ];

  return missions
    .map(m => {

      const done =
        m.current >= m.target;

      const percent =
        Math.min(
          100,
          (m.current / m.target) * 100
        );

      return `
        <div class="mission ${
          done
            ? "completed"
            : ""
        }">

          <div class="mission-top">

            <strong>
              ${
                done
                  ? "✅"
                  : "🎯"
              }
              ${m.title}
            </strong>

            <span class="tag">
              +${m.reward} XP
            </span>

          </div>

          <p class="muted">
            ${m.current} / ${m.target}
          </p>

          <div class="mission-progress">

            <div
              style="width:${percent}%"
            ></div>

          </div>

        </div>
      `;

    })
    .join("");
}

function gameCard(game) {
  const favorite =
    player.favoriteGames.includes(
      game.id
    );

  return `
    <article class="card game-card">

      <button
        class="icon-btn"
        style="
          position:absolute;
          right:14px;
          top:14px
        "
        onclick="toggleFavorite('${game.id}')"
        title="Favori"
      >
        ${
          favorite
            ? "❤️"
            : "♡"
        }
      </button>

      <div class="game-icon">
        ${game.icon}
      </div>

      <h3>
        ${game.name}
      </h3>

      <p>
        ${game.description}
      </p>

      <div class="card-bottom">

        <span class="tag">
          ${game.category}
        </span>

        <button
          class="btn primary"
          onclick="startGame('${game.id}')"
        >
          Jouer
        </button>

      </div>

    </article>
  `;
}

/* =========================================================
   GAMES PAGE
   ========================================================= */

function renderGames() {
  return `
    <div class="page">

      <div class="section-head">

        <div>

          <div class="eyebrow">
            ARCADE
          </div>

          <h2>
            🎮 Tous les jeux
          </h2>

          <p>
            Des petits jeux rapides à jouer directement
            dans le navigateur.
          </p>

        </div>

      </div>

      <div class="search-row">

        <input
          id="gameSearch"
          class="input"
          placeholder="🔎 Rechercher un jeu..."
          oninput="filterGames()"
        >

      </div>

      <div class="filters">

        <button
          class="filter active"
          data-filter="all"
          onclick="setGameFilter('all')"
        >
          Tous
        </button>

        <button
          class="filter"
          data-filter="Réflexion"
          onclick="setGameFilter('Réflexion')"
        >
          🧠 Réflexion
        </button>

        <button
          class="filter"
          data-filter="Réflexes"
          onclick="setGameFilter('Réflexes')"
        >
          ⚡ Réflexes
        </button>

        <button
          class="filter"
          data-filter="Mots"
          onclick="setGameFilter('Mots')"
        >
          🔤 Mots
        </button>

        <button
          class="filter"
          data-filter="Arcade"
          onclick="setGameFilter('Arcade')"
        >
          👾 Arcade
        </button>

      </div>

      <div
        id="gamesGrid"
        class="cards"
      >
        ${games
          .map(gameCard)
          .join("")}
      </div>

    </div>
  `;
}

let currentGameFilter = "all";

function setGameFilter(filter) {
  currentGameFilter =
    filter;

  document
    .querySelectorAll(".filter")
    .forEach(button => {

      button.classList.toggle(
        "active",
        button.dataset.filter === filter
      );

    });

  filterGames();
}

function filterGames() {
  const search =
    (
      document
        .getElementById(
          "gameSearch"
        )
        ?.value || ""
    ).toLowerCase();

  const filtered =
    games.filter(game => {

      const categoryOk =
        currentGameFilter === "all" ||
        game.category ===
          currentGameFilter;

      const searchOk =
        game.name
          .toLowerCase()
          .includes(search) ||
        game.description
          .toLowerCase()
          .includes(search);

      return (
        categoryOk &&
        searchOk
      );
    });

  const grid =
    document.getElementById(
      "gamesGrid"
    );

  if (!grid) return;

  grid.innerHTML =
    filtered.length
      ? filtered
          .map(gameCard)
          .join("")
      : `
        <div class="empty">
          Aucun jeu trouvé.
        </div>
      `;
}

/* =========================================================
   GAME START
   ========================================================= */

function startGame(id) {
  stopAll();

  state.page = "play";
  state.game = id;

  render();

  switch (id) {

    case "memory":
      startMemory();
      break;

    case "reaction":
      startReaction();
      break;

    case "number":
      startNumber();
      break;

    case "word":
      startWord();
      break;

    case "code":
      startCode();
      break;

    case "snake":
      startSnake();
      break;

    case "pong":
      startPong();
      break;

    case "brick":
      startBrick();
      break;

    case "space":
      startSpace();
      break;
  }
}

function renderGameScreen() {
  const game =
    games.find(
      g => g.id === state.game
    );

  if (!game) {
    state.page = "games";
    return renderGames();
  }

  return `
    <div class="page game-screen">

      <div class="game-header">

        <div>

          <button
            class="btn"
            onclick="navigate('games')"
          >
            ← Jeux
          </button>

          <h2
            style="margin-top:15px"
          >
            ${game.icon}
            ${game.name}
          </h2>

        </div>

        <div class="game-score">

          <span class="score-pill">
            ⭐ +${game.xp} XP
          </span>

        </div>

      </div>

      <div id="gameContent"></div>

    </div>
  `;
}

/* =========================================================
   MEMORY
   ========================================================= */

function startMemory() {
  const content =
    document.getElementById(
      "gameContent"
    );

  if (!content) return;

  const symbols = [
    "🚀",
    "🎮",
    "⚡",
    "🧠",
    "🔥",
    "🌟",
    "👾",
    "💎"
  ];

  const cards =
    shuffle([
      ...symbols,
      ...symbols
    ]);

  state.memory = {
    cards,
    flipped: [],
    matched: [],
    moves: 0,
    locked: false,
    start: Date.now()
  };

  content.innerHTML = `
    <div class="card">

      <div class="game-score">

        <span class="score-pill">
          Coups :
          <b id="memoryMoves">
            0
          </b>
        </span>

        <span class="score-pill">
          Paires :
          <b id="memoryPairs">
            0
          </b>/8
        </span>

      </div>

      <div
        id="memoryGrid"
        class="memory-grid"
      ></div>

    </div>
  `;

  drawMemory();
}

function drawMemory() {
  const grid =
    document.getElementById(
      "memoryGrid"
    );

  if (
    !grid ||
    !state.memory
  ) {
    return;
  }

  grid.innerHTML =
    state.memory.cards
      .map(
        (symbol, index) => {

          const visible =
            state.memory.flipped
              .includes(index) ||
            state.memory.matched
              .includes(index);

          return `
            <button
              class="memory-card ${
                visible
                  ? "flipped"
                  : ""
              } ${
                state.memory.matched
                  .includes(index)
                  ? "matched"
                  : ""
              }"
              onclick="memoryClick(${index})"
            >
              ${
                visible
                  ? symbol
                  : "?"
              }
            </button>
          `;
        }
      )
      .join("");

  const moves =
    document.getElementById(
      "memoryMoves"
    );

  const pairs =
    document.getElementById(
      "memoryPairs"
    );

  if (moves) {
    moves.textContent =
      state.memory.moves;
  }

  if (pairs) {
    pairs.textContent =
      state.memory.matched
        .length / 2;
  }
}

function memoryClick(index) {
  const game =
    state.memory;

  if (!game || game.locked)
    return;

  if (
    game.flipped
      .includes(index)
  ) {
    return;
  }

  if (
    game.matched
      .includes(index)
  ) {
    return;
  }

  game.flipped.push(index);

  drawMemory();

  if (
    game.flipped.length < 2
  ) {
    return;
  }

  game.moves++;

  const [
    a,
    b
  ] = game.flipped;

  if (
    game.cards[a] ===
    game.cards[b]
  ) {

    game.matched.push(
      a,
      b
    );

    game.flipped = [];

    drawMemory();

    if (
      game.matched.length ===
      game.cards.length
    ) {

      const score =
        Math.max(
          100,
          1200 -
            game.moves * 35
        );

      registerPlay(
        "Memory Rush",
        score,
        true,
        40
      );

      showGameResult(
        "🧠",
        "Memory terminé !",
        `${game.moves} coups`,
        40
      );
    }

    return;
  }

  game.locked = true;

  addTimer(() => {

    if (!state.memory)
      return;

    game.flipped = [];
    game.locked = false;

    drawMemory();

  }, 700);
}

/* =========================================================
   REACTION
   ========================================================= */

function startReaction() {
  const content =
    document.getElementById(
      "gameContent"
    );

  if (!content) return;

  content.innerHTML = `
    <div class="card">

      <div class="center">

        <p class="muted">
          Clique uniquement quand la zone devient verte.
        </p>

      </div>

      <div
        id="reactionZone"
        class="reaction-zone"
        onclick="reactionClick()"
      >
        Chargement...
      </div>

    </div>
  `;

  state.reaction = {
    phase: "waiting",
    start: 0
  };

  const zone =
    document.getElementById(
      "reactionZone"
    );

  zone.textContent =
    "Attends...";

  zone.classList.add(
    "waiting"
  );

  addTimer(() => {

    if (!state.reaction)
      return;

    state.reaction.phase =
      "ready";

    state.reaction.start =
      performance.now();

    zone.textContent =
      "CLIQUE !";

    zone.classList.remove(
      "waiting"
    );

    zone.classList.add(
      "ready"
    );

  }, random(1500, 4000));
}

function reactionClick() {
  const game =
    state.reaction;

  const zone =
    document.getElementById(
      "reactionZone"
    );

  if (
    !game ||
    !zone
  ) {
    return;
  }

  if (
    game.phase ===
    "waiting"
  ) {

    registerPlay(
      "Reaction Test",
      0,
      false,
      5
    );

    showGameResult(
      "⚠️",
      "Trop tôt !",
      "Tu as cliqué avant le signal.",
      5
    );

    return;
  }

  if (
    game.phase !==
    "ready"
  ) {
    return;
  }

  const time =
    Math.round(
      performance.now() -
      game.start
    );

  const score =
    Math.max(
      10,
      1000 - time
    );

  registerPlay(
    "Reaction Test",
    score,
    true,
    35
  );

  showGameResult(
    "⚡",
    "Excellent réflexe !",
    `${time} ms`,
    35
  );
}

/* =========================================================
   NUMBER
   ========================================================= */

function startNumber() {
  const content =
    document.getElementById(
      "gameContent"
    );

  if (!content) return;

  state.number = {
    target:
      random(1, 100),
    attempts: 0,
    max: 8
  };

  content.innerHTML = `
    <div class="card">

      <div class="center">

        <p class="muted">
          Je pense à un nombre entre 1 et 100.
        </p>

      </div>

      <div
        class="number-display"
        id="numberDisplay"
      >
        ?
      </div>

      <div class="number-controls">

        <input
          id="numberInput"
          class="input"
          type="number"
          min="1"
          max="100"
          placeholder="Ton nombre"
          onkeydown="
            if(event.key==='Enter')
              numberGuess()
          "
        >

        <button
          class="btn primary"
          onclick="numberGuess()"
        >
          Tester
        </button>

      </div>

      <p
        class="center muted"
        style="margin-top:15px"
      >
        Essais :
        <b id="numberAttempts">
          0
        </b>
        / 8
      </p>

    </div>
  `;

  document
    .getElementById(
      "numberInput"
    )
    ?.focus();
}

function numberGuess() {
  const game =
    state.number;

  const input =
    document.getElementById(
      "numberInput"
    );

  if (
    !game ||
    !input
  ) {
    return;
  }

  const value =
    Number(input.value);

  if (
    !Number.isInteger(value) ||
    value < 1 ||
    value > 100
  ) {

    showToast(
      "Entre un nombre de 1 à 100."
    );

    return;
  }

  game.attempts++;

  if (
    value ===
    game.target
  ) {

    const score =
      Math.max(
        100,
        900 -
          game.attempts * 90
      );

    registerPlay(
      "Number Rush",
      score,
      true,
      35
    );

    showGameResult(
      "🔢",
      "Trouvé !",
      `${game.attempts} essai(s)`,
      35
    );

    return;
  }

  const display =
    document.getElementById(
      "numberDisplay"
    );

  const attempts =
    document.getElementById(
      "numberAttempts"
    );

  if (display) {
    display.textContent =
      value < game.target
        ? "⬆️ Plus grand"
        : "⬇️ Plus petit";
  }

  if (attempts) {
    attempts.textContent =
      game.attempts;
  }

  input.select();

  if (
    game.attempts >=
    game.max
  ) {

    registerPlay(
      "Number Rush",
      0,
      false,
      5
    );

    showGameResult(
      "💡",
      "Dommage !",
      `Le nombre était ${game.target}.`,
      5
    );
  }
}

/* =========================================================
   WORD SCRAMBLE
   ========================================================= */

const words = [
  "javascript",
  "ordinateur",
  "reseau",
  "securite",
  "internet",
  "algorithme",
  "clavier",
  "navigateur",
  "programme",
  "serveur",
  "python",
  "robot"
];

function startWord() {
  const content =
    document.getElementById(
      "gameContent"
    );

  if (!content) return;

  const word =
    words[
      random(
        0,
        words.length - 1
      )
    ];

  const scrambled =
    shuffle(
      word.split("")
    ).join("");

  state.word = {
    word,
    scrambled
  };

  content.innerHTML = `
    <div class="card center">

      <p class="muted">
        Remets les lettres dans le bon ordre.
      </p>

      <div class="word-display">
        ${scrambled.toUpperCase()}
      </div>

      <div class="number-controls">

        <input
          id="wordInput"
          class="input"
          placeholder="Ta réponse..."
          onkeydown="
            if(event.key==='Enter')
              wordGuess()
          "
        >

        <button
          class="btn primary"
          onclick="wordGuess()"
        >
          Valider
        </button>

      </div>

    </div>
  `;

  document
    .getElementById(
      "wordInput"
    )
    ?.focus();
}

function wordGuess() {
  const game =
    state.word;

  const input =
    document.getElementById(
      "wordInput"
    );

  if (
    !game ||
    !input
  ) {
    return;
  }

  const answer =
    input.value
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(
        /[\u0300-\u036f]/g,
        ""
      );

  if (!answer)
    return;

  if (
    answer ===
    game.word
  ) {

    registerPlay(
      "Word Scramble",
      100,
      true,
      35
    );

    showGameResult(
      "🔤",
      "Bien joué !",
      game.word.toUpperCase(),
      35
    );

  } else {

    input.value = "";

    showToast(
      "❌ Ce n'est pas le bon mot."
    );
  }
}

/* =========================================================
   CODE BREAKER
   ========================================================= */

function startCode() {
  const content =
    document.getElementById(
      "gameContent"
    );

  if (!content) return;

  const code =
    String(
      random(0, 9999)
    ).padStart(
      4,
      "0"
    );

  state.code = {
    code,
    attempts: 0,
    max: 10
  };

  content.innerHTML = `
    <div class="card center">

      <p class="muted">
        Trouve le code secret à 4 chiffres.
      </p>

      <div class="code-display">
        ••••
      </div>

      <div class="number-controls">

        <input
          id="codeInput"
          class="input"
          maxlength="4"
          inputmode="numeric"
          placeholder="0000"
          onkeydown="
            if(event.key==='Enter')
              codeGuess()
          "
        >

        <button
          class="btn primary"
          onclick="codeGuess()"
        >
          Tester
        </button>

      </div>

      <p
        id="codeHint"
        class="muted"
        style="margin-top:15px"
      >
        Tentatives : 0 / 10
      </p>

    </div>
  `;

  document
    .getElementById(
      "codeInput"
    )
    ?.focus();
}

function codeGuess() {
  const game =
    state.code;

  const input =
    document.getElementById(
      "codeInput"
    );

  const hint =
    document.getElementById(
      "codeHint"
    );

  if (
    !game ||
    !input ||
    !hint
  ) {
    return;
  }

  const value =
    input.value.trim();

  if (
    !/^\d{4}$/.test(value)
  ) {

    showToast(
      "Entre exactement 4 chiffres."
    );

    return;
  }

  game.attempts++;

  if (
    value ===
    game.code
  ) {

    const score =
      Math.max(
        100,
        1000 -
          game.attempts * 80
      );

    registerPlay(
      "Code Breaker",
      score,
      true,
      50
    );

    showGameResult(
      "🔐",
      "Code cassé !",
      `${game.attempts} tentative(s)`,
      50
    );

    return;
  }

  let correctPlace = 0;
  let correctDigit = 0;

  for (
    let i = 0;
    i < 4;
    i++
  ) {

    if (
      value[i] ===
      game.code[i]
    ) {

      correctPlace++;

    } else if (
      game.code.includes(
        value[i]
      )
    ) {

      correctDigit++;
    }
  }

  hint.textContent =
    `Tentatives : ${game.attempts} / 10 • ` +
    `${correctPlace} bien placé(s) • ` +
    `${correctDigit} présent(s)`;

  input.value = "";
  input.focus();

  if (
    game.attempts >=
    game.max
  ) {

    registerPlay(
      "Code Breaker",
      0,
      false,
      5
    );

    showGameResult(
      "🔐",
      "Code non trouvé",
      `Le code était ${game.code}.`,
      5
    );
  }
}

/* =========================================================
   SNAKE
   ========================================================= */

function startSnake() {
  const content =
    document.getElementById(
      "gameContent"
    );

  if (!content) return;

  content.innerHTML = `
    <div class="card">

      <div class="game-score">

        <span class="score-pill">
          Score :
          <b id="snakeScore">
            0
          </b>
        </span>

      </div>

      <div class="canvas-box">

        <canvas
          id="snakeCanvas"
          width="600"
          height="420"
        ></canvas>

      </div>

      <div class="mobile-controls">

        <button
          onclick="snakeDirection(0,-1)"
        >
          ▲
        </button>

        <button
          onclick="snakeDirection(-1,0)"
        >
          ◀
        </button>

        <button
          onclick="snakeDirection(0,1)"
        >
          ▼
        </button>

        <button
          onclick="snakeDirection(1,0)"
        >
          ▶
        </button>

      </div>

    </div>
  `;

  const canvas =
    document.getElementById(
      "snakeCanvas"
    );

  const ctx =
    canvas.getContext("2d");

  state.snake = {
    canvas,
    ctx,
    cell: 21,
    cols:
      Math.floor(
        canvas.width / 21
      ),
    rows:
      Math.floor(
        canvas.height / 21
      ),
    snake: [
      {
        x: 8,
        y: 8
      },
      {
        x: 7,
        y: 8
      },
      {
        x: 6,
        y: 8
      }
    ],
    dir: {
      x: 1,
      y: 0
    },
    nextDir: {
      x: 1,
      y: 0
    },
    food: null,
    score: 0,
    lastMove: 0,
    speed: 105,
    gameOver: false
  };

  spawnSnakeFood();

  window.onkeydown = e => {

    const keys = {
      ArrowUp: [0, -1],
      ArrowDown: [0, 1],
      ArrowLeft: [-1, 0],
      ArrowRight: [1, 0],
      w: [0, -1],
      s: [0, 1],
      a: [-1, 0],
      d: [1, 0]
    };

    if (keys[e.key]) {

      e.preventDefault();

      snakeDirection(
        ...keys[e.key]
      );
    }
  };

  state.animation =
    requestAnimationFrame(
      snakeLoop
    );
}

function snakeDirection(x, y) {
  const game =
    state.snake;

  if (
    !game ||
    game.gameOver
  ) {
    return;
  }

  if (
    x === -game.dir.x &&
    y === -game.dir.y
  ) {
    return;
  }

  game.nextDir = {
    x,
    y
  };
}

function spawnSnakeFood() {
  const game =
    state.snake;

  if (!game) return;

  let food;

  do {

    food = {
      x:
        random(
          0,
          game.cols - 1
        ),
      y:
        random(
          0,
          game.rows - 1
        )
    };

  } while (
    game.snake.some(
      p =>
        p.x === food.x &&
        p.y === food.y
    )
  );

  game.food = food;
}

function snakeLoop(timestamp) {
  const game =
    state.snake;

  if (
    !game ||
    game.gameOver
  ) {
    return;
  }

  if (
    timestamp -
      game.lastMove >=
    game.speed
  ) {

    game.lastMove =
      timestamp;

    game.dir =
      game.nextDir;

    const head =
      game.snake[0];

    const next = {
      x:
        head.x +
        game.dir.x,
      y:
        head.y +
        game.dir.y
    };

    const hitWall =
      next.x < 0 ||
      next.x >= game.cols ||
      next.y < 0 ||
      next.y >= game.rows;

    const hitSelf =
      game.snake.some(
        p =>
          p.x === next.x &&
          p.y === next.y
      );

    if (
      hitWall ||
      hitSelf
    ) {

      game.gameOver =
        true;

      const won =
        game.score >= 10;

      registerPlay(
        "Snake",
        game.score,
        won,
        won
          ? 45
          : 8
      );

      showGameResult(
        won
          ? "🐍"
          : "💥",
        won
          ? "Belle partie !"
          : "Game Over",
        `Score : ${game.score}`,
        won
          ? 45
          : 8
      );

      return;
    }

    game.snake.unshift(
      next
    );

    if (
      next.x ===
        game.food.x &&
      next.y ===
        game.food.y
    ) {

      game.score++;

      spawnSnakeFood();

      const scoreEl =
        document.getElementById(
          "snakeScore"
        );

      if (scoreEl) {
        scoreEl.textContent =
          game.score;
      }

    } else {

      game.snake.pop();
    }
  }

  drawSnake();

  state.animation =
    requestAnimationFrame(
      snakeLoop
    );
}

function drawSnake() {
  const game =
    state.snake;

  if (!game) return;

  const {
    ctx,
    canvas,
    cell
  } = game;

  ctx.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

  ctx.fillStyle =
    "#090d18";

  ctx.fillRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

  game.snake.forEach(
    (p, index) => {

      ctx.fillStyle =
        index === 0
          ? "#20d9ee"
          : "#7c5cff";

      ctx.fillRect(
        p.x * cell + 2,
        p.y * cell + 2,
        cell - 4,
        cell - 4
      );
    }
  );

  ctx.fillStyle =
    "#ff6680";

  ctx.beginPath();

  ctx.arc(
    game.food.x * cell +
      cell / 2,
    game.food.y * cell +
      cell / 2,
    cell / 2 - 3,
    0,
    Math.PI * 2
  );

  ctx.fill();
}

/* =========================================================
   PONG
   ========================================================= */

function startPong() {
  const content =
    document.getElementById(
      "gameContent"
    );

  if (!content) return;

  content.innerHTML = `
    <div class="card">

      <div class="game-score">

        <span class="score-pill">
          Toi :
          <b id="playerScore">
            0
          </b>
        </span>

        <span class="score-pill">
          CPU :
          <b id="cpuScore">
            0
          </b>
        </span>

      </div>

      <div class="canvas-box">

        <canvas
          id="pongCanvas"
          width="800"
          height="450"
        ></canvas>

      </div>

      <p
        class="center muted"
        style="margin-top:12px"
      >
        ↑ ↓ ou W/S pour déplacer ta raquette
      </p>

      <div class="mobile-controls">

        <button
          onclick="pongMove(-1)"
        >
          ▲
        </button>

        <button
          onclick="pongMove(1)"
        >
          ▼
        </button>

      </div>

    </div>
  `;

  const canvas =
    document.getElementById(
      "pongCanvas"
    );

  const ctx =
    canvas.getContext("2d");

  state.pong = {
    canvas,
    ctx,
    paddleH: 90,
    playerY: 180,
    cpuY: 180,
    ball: {
      x: 400,
      y: 225,
      vx: 5,
      vy: 3
    },
    playerScore: 0,
    cpuScore: 0,
    last: 0,
    up: false,
    down: false,
    ended: false
  };

  window.onkeydown = e => {

    if (!state.pong)
      return;

    if (
      e.key === "ArrowUp" ||
      e.key.toLowerCase() === "w"
    ) {
      state.pong.up =
        true;
    }

    if (
      e.key === "ArrowDown" ||
      e.key.toLowerCase() === "s"
    ) {
      state.pong.down =
        true;
    }
  };

  window.onkeyup = e => {

    if (!state.pong)
      return;

    if (
      e.key === "ArrowUp" ||
      e.key.toLowerCase() === "w"
    ) {
      state.pong.up =
        false;
    }

    if (
      e.key === "ArrowDown" ||
      e.key.toLowerCase() === "s"
    ) {
      state.pong.down =
        false;
    }
  };

  state.animation =
    requestAnimationFrame(
      pongLoop
    );
}

function pongMove(direction) {
  const game =
    state.pong;

  if (!game) return;

  game.playerY +=
    direction * 25;

  game.playerY =
    Math.max(
      0,
      Math.min(
        game.canvas.height -
          game.paddleH,
        game.playerY
      )
    );
}

function resetPongBall(
  game,
  direction
) {
  game.ball = {
    x:
      game.canvas.width / 2,
    y:
      game.canvas.height / 2,
    vx:
      5 * direction,
    vy:
      random(-30, 30) / 10
  };
}

function pongLoop(timestamp) {
  const game =
    state.pong;

  if (
    !game ||
    game.ended
  ) {
    return;
  }

  const dt =
    Math.min(
      2,
      (
        timestamp -
        game.last
      ) / 16.67 || 1
    );

  game.last =
    timestamp;

  if (game.up) {
    game.playerY -=
      7 * dt;
  }

  if (game.down) {
    game.playerY +=
      7 * dt;
  }

  game.playerY =
    Math.max(
      0,
      Math.min(
        game.canvas.height -
          game.paddleH,
        game.playerY
      )
    );

  const target =
    game.ball.y -
    game.paddleH / 2;

  game.cpuY +=
    Math.sign(
      target -
      game.cpuY
    ) *
    4 *
    dt;

  game.cpuY =
    Math.max(
      0,
      Math.min(
        game.canvas.height -
          game.paddleH,
        game.cpuY
      )
    );

  game.ball.x +=
    game.ball.vx *
    dt;

  game.ball.y +=
    game.ball.vy *
    dt;

  if (
    game.ball.y <= 8 ||
    game.ball.y >=
      game.canvas.height - 8
  ) {
    game.ball.vy *= -1;
  }

  const ball =
    game.ball;

  const playerHit =
    ball.x <= 35 &&
    ball.x >= 20 &&
    ball.y >=
      game.playerY &&
    ball.y <=
      game.playerY +
      game.paddleH;

  const cpuHit =
    ball.x >=
      game.canvas.width - 35 &&
    ball.x <=
      game.canvas.width - 20 &&
    ball.y >=
      game.cpuY &&
    ball.y <=
      game.cpuY +
      game.paddleH;

  if (
    playerHit &&
    ball.vx < 0
  ) {

    ball.vx =
      Math.abs(
        ball.vx
      ) * 1.04;

    ball.vy +=
      (
        ball.y -
        (
          game.playerY +
          game.paddleH / 2
        )
      ) * .06;
  }

  if (
    cpuHit &&
    ball.vx > 0
  ) {

    ball.vx =
      -Math.abs(
        ball.vx
      ) * 1.04;

    ball.vy +=
      (
        ball.y -
        (
          game.cpuY +
          game.paddleH / 2
        )
      ) * .06;
  }

  if (
    ball.x < -20
  ) {

    game.cpuScore++;

    updatePongScore();

    if (
      game.cpuScore >= 5
    ) {

      endPong(false);

      return;
    }

    resetPongBall(
      game,
      1
    );
  }

  if (
    ball.x >
    game.canvas.width + 20
  ) {

    game.playerScore++;

    updatePongScore();

    if (
      game.playerScore >= 5
    ) {

      endPong(true);

      return;
    }

    resetPongBall(
      game,
      -1
    );
  }

  drawPong();

  state.animation =
    requestAnimationFrame(
      pongLoop
    );
}

function updatePongScore() {
  const playerScore =
    document.getElementById(
      "playerScore"
    );

  const cpuScore =
    document.getElementById(
      "cpuScore"
    );

  if (playerScore) {
    playerScore.textContent =
      state.pong.playerScore;
  }

  if (cpuScore) {
    cpuScore.textContent =
      state.pong.cpuScore;
  }
}

function drawPong() {
  const game =
    state.pong;

  if (!game) return;

  const {
    ctx,
    canvas,
    paddleH
  } = game;

  ctx.fillStyle =
    "#05070d";

  ctx.fillRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

  ctx.strokeStyle =
    "rgba(255,255,255,.12)";

  ctx.setLineDash([
    8,
    10
  ]);

  ctx.beginPath();

  ctx.moveTo(
    canvas.width / 2,
    0
  );

  ctx.lineTo(
    canvas.width / 2,
    canvas.height
  );

  ctx.stroke();

  ctx.setLineDash([]);

  ctx.fillStyle =
    "#20d9ee";

  ctx.fillRect(
    15,
    game.playerY,
    14,
    paddleH
  );

  ctx.fillStyle =
    "#7c5cff";

  ctx.fillRect(
    canvas.width - 29,
    game.cpuY,
    14,
    paddleH
  );

  ctx.fillStyle =
    "#fff";

  ctx.beginPath();

  ctx.arc(
    game.ball.x,
    game.ball.y,
    8,
    0,
    Math.PI * 2
  );

  ctx.fill();
}

function endPong(won) {
  const game =
    state.pong;

  if (
    !game ||
    game.ended
  ) {
    return;
  }

  game.ended =
    true;

  const score =
    game.playerScore *
    100;

  registerPlay(
    "Pong",
    score,
    won,
    won
      ? 50
      : 10
  );

  showGameResult(
    won
      ? "🏆"
      : "🏓",
    won
      ? "Victoire !"
      : "Défaite",
    `${game.playerScore} - ${game.cpuScore}`,
    won
      ? 50
      : 10
  );
}

/* =========================================================
   BRICK BREAKER
   ========================================================= */

function startBrick() {
  const content =
    document.getElementById(
      "gameContent"
    );

  if (!content) return;

  content.innerHTML = `
    <div class="card">

      <div class="game-score">

        <span class="score-pill">
          Score :
          <b id="brickScore">
            0
          </b>
        </span>

        <span class="score-pill">
          Vies :
          <b id="brickLives">
            3
          </b>
        </span>

      </div>

      <div class="canvas-box">

        <canvas
          id="brickCanvas"
          width="800"
          height="500"
        ></canvas>

      </div>

      <p
        class="center muted"
        style="margin-top:12px"
      >
        ← → ou A/D pour déplacer la barre
      </p>

    </div>
  `;

  const canvas =
    document.getElementById(
      "brickCanvas"
    );

  const ctx =
    canvas.getContext("2d");

  const bricks = [];

  for (
    let row = 0;
    row < 5;
    row++
  ) {

    for (
      let col = 0;
      col < 10;
      col++
    ) {

      bricks.push({
        x:
          50 +
          col * 72,
        y:
          45 +
          row * 30,
        w: 60,
        h: 18,
        alive: true
      });
    }
  }

  state.brick = {
    canvas,
    ctx,
    paddle: {
      x: 340,
      y: 455,
      w: 120,
      h: 13,
      speed: 8
    },
    ball: {
      x: 400,
      y: 430,
      vx: 4,
      vy: -4,
      r: 8
    },
    bricks,
    score: 0,
    lives: 3,
    left: false,
    right: false,
    ended: false
  };

  window.onkeydown = e => {

    if (!state.brick)
      return;

    if (
      e.key === "ArrowLeft" ||
      e.key.toLowerCase() === "a"
    ) {
      state.brick.left =
        true;
    }

    if (
      e.key === "ArrowRight" ||
      e.key.toLowerCase() === "d"
    ) {
      state.brick.right =
        true;
    }
  };

  window.onkeyup = e => {

    if (!state.brick)
      return;

    if (
      e.key === "ArrowLeft" ||
      e.key.toLowerCase() === "a"
    ) {
      state.brick.left =
        false;
    }

    if (
      e.key === "ArrowRight" ||
      e.key.toLowerCase() === "d"
    ) {
      state.brick.right =
        false;
    }
  };

  state.animation =
    requestAnimationFrame(
      brickLoop
    );
}

function brickLoop() {
  const game =
    state.brick;

  if (
    !game ||
    game.ended
  ) {
    return;
  }

  const {
    canvas,
    paddle,
    ball
  } = game;

  if (game.left) {
    paddle.x -=
      paddle.speed;
  }

  if (game.right) {
    paddle.x +=
      paddle.speed;
  }

  paddle.x =
    Math.max(
      0,
      Math.min(
        canvas.width -
          paddle.w,
        paddle.x
      )
    );

  ball.x +=
    ball.vx;

  ball.y +=
    ball.vy;

  if (
    ball.x - ball.r < 0 ||
    ball.x + ball.r >
      canvas.width
  ) {
    ball.vx *= -1;
  }

  if (
    ball.y - ball.r < 0
  ) {
    ball.vy *= -1;
  }

  if (
    ball.y + ball.r >=
      paddle.y &&
    ball.y - ball.r <=
      paddle.y +
      paddle.h &&
    ball.x >= paddle.x &&
    ball.x <=
      paddle.x +
      paddle.w &&
    ball.vy > 0
  ) {

    ball.vy =
      -Math.abs(
        ball.vy
      );

    const relative =
      (
        ball.x -
        (
          paddle.x +
          paddle.w / 2
        )
      ) /
      (paddle.w / 2);

    ball.vx =
      relative * 5;
  }

  for (
    const brick of
    game.bricks
  ) {

    if (!brick.alive)
      continue;

    if (
      ball.x + ball.r >
        brick.x &&
      ball.x - ball.r <
        brick.x +
        brick.w &&
      ball.y + ball.r >
        brick.y &&
      ball.y - ball.r <
        brick.y +
        brick.h
    ) {

      brick.alive =
        false;

      ball.vy *= -1;

      game.score += 10;

      const score =
        document.getElementById(
          "brickScore"
        );

      if (score) {
        score.textContent =
          game.score;
      }

      break;
    }
  }

  if (
    game.bricks.every(
      b => !b.alive
    )
  ) {

    game.ended =
      true;

    registerPlay(
      "Brick Breaker",
      game.score,
      true,
      60
    );

    showGameResult(
      "🧱",
      "Niveau terminé !",
      `Score : ${game.score}`,
      60
    );

    return;
  }

  if (
    ball.y >
    canvas.height + 20
  ) {

    game.lives--;

    const lives =
      document.getElementById(
        "brickLives"
      );

    if (lives) {
      lives.textContent =
        game.lives;
    }

    if (
      game.lives <= 0
    ) {

      game.ended =
        true;

      registerPlay(
        "Brick Breaker",
        game.score,
        false,
        8
      );

      showGameResult(
        "💥",
        "Game Over",
        `Score : ${game.score}`,
        8
      );

      return;
    }

    ball.x =
      canvas.width / 2;

    ball.y =
      430;

    ball.vx =
      random(-4, 4) || 3;

    ball.vy =
      -4;
  }

  drawBrick();

  state.animation =
    requestAnimationFrame(
      brickLoop
    );
}

function drawBrick() {
  const game =
    state.brick;

  if (!game) return;

  const {
    ctx,
    canvas,
    paddle,
    ball
  } = game;

  ctx.fillStyle =
    "#05070d";

  ctx.fillRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

  game.bricks.forEach(
    (brick, index) => {

      if (!brick.alive)
        return;

      ctx.fillStyle =
        index % 2 === 0
          ? "#7c5cff"
          : "#20d9ee";

      ctx.fillRect(
        brick.x,
        brick.y,
        brick.w,
        brick.h
      );
    }
  );

  ctx.fillStyle =
    "#fff";

  ctx.fillRect(
    paddle.x,
    paddle.y,
    paddle.w,
    paddle.h
  );

  ctx.beginPath();

  ctx.arc(
    ball.x,
    ball.y,
    ball.r,
    0,
    Math.PI * 2
  );

  ctx.fill();
}

/* =========================================================
   SPACE DODGE
   ========================================================= */

function startSpace() {
  const content =
    document.getElementById(
      "gameContent"
    );

  if (!content) return;

  content.innerHTML = `
    <div class="card">

      <div class="game-score">

        <span class="score-pill">
          Score :
          <b id="spaceScore">
            0
          </b>
        </span>

      </div>

      <div class="canvas-box">

        <canvas
          id="spaceCanvas"
          width="800"
          height="500"
        ></canvas>

      </div>

      <p
        class="center muted"
        style="margin-top:12px"
      >
        ← → ou A/D pour déplacer ton vaisseau
      </p>

      <div class="mobile-controls">

        <button
          onclick="spaceMove(-1)"
        >
          ◀
        </button>

        <button
          onclick="spaceMove(1)"
        >
          ▶
        </button>

      </div>

    </div>
  `;

  const canvas =
    document.getElementById(
      "spaceCanvas"
    );

  const ctx =
    canvas.getContext("2d");

  state.space = {
    canvas,
    ctx,
    player: {
      x: 400,
      y: 440,
      w: 40,
      h: 20,
      speed: 8
    },
    meteors: [],
    score: 0,
    lastSpawn: 0,
    spawnDelay: 700,
    left: false,
    right: false,
    ended: false
  };

  window.onkeydown = e => {

    if (!state.space)
      return;

    if (
      e.key === "ArrowLeft" ||
      e.key.toLowerCase() === "a"
    ) {
      state.space.left =
        true;
    }

    if (
      e.key === "ArrowRight" ||
      e.key.toLowerCase() === "d"
    ) {
      state.space.right =
        true;
    }
  };

  window.onkeyup = e => {

    if (!state.space)
      return;

    if (
      e.key === "ArrowLeft" ||
      e.key.toLowerCase() === "a"
    ) {
      state.space.left =
        false;
    }

    if (
      e.key === "ArrowRight" ||
      e.key.toLowerCase() === "d"
    ) {
      state.space.right =
        false;
    }
  };

  state.animation =
    requestAnimationFrame(
      spaceLoop
    );
}

function spaceMove(direction) {
  const game =
    state.space;

  if (!game) return;

  game.player.x +=
    direction *
    game.player.speed;

  game.player.x =
    Math.max(
      25,
      Math.min(
        game.canvas.width - 25,
        game.player.x
      )
    );
}

function spaceLoop(timestamp) {
  const game =
    state.space;

  if (
    !game ||
    game.ended
  ) {
    return;
  }

  const {
    canvas,
    player
  } = game;

  if (game.left) {
    player.x -=
      player.speed;
  }

  if (game.right) {
    player.x +=
      player.speed;
  }

  player.x =
    Math.max(
      25,
      Math.min(
        canvas.width - 25,
        player.x
      )
    );

  if (
    timestamp -
      game.lastSpawn >
    game.spawnDelay
  ) {

    game.lastSpawn =
      timestamp;

    game.meteors.push({
      x:
        random(
          20,
          canvas.width - 20
        ),
      y: -20,
      r:
        random(
          9,
          18
        ),
      speed:
        random(
          3,
          7
        )
    });

    game.spawnDelay =
      Math.max(
        300,
        700 -
          Math.floor(
            game.score / 10
          ) * 20
      );
  }

  game.meteors.forEach(
    m => {
      m.y +=
        m.speed;
    }
  );

  game.meteors =
    game.meteors.filter(
      m =>
        m.y <
        canvas.height + 30
    );

  for (
    const meteor of
    game.meteors
  ) {

    const dx =
      meteor.x -
      player.x;

    const dy =
      meteor.y -
      player.y;

    const distance =
      Math.sqrt(
        dx * dx +
        dy * dy
      );

    if (
      distance <
      meteor.r + 20
    ) {

      game.ended =
        true;

      const won =
        game.score >= 20;

      registerPlay(
        "Space Dodge",
        game.score,
        won,
        won
          ? 55
          : 8
      );

      showGameResult(
        won
          ? "🚀"
          : "💥",
        won
          ? "Excellent !"
          : "Collision !",
        `Score : ${game.score}`,
        won
          ? 55
          : 8
      );

      return;
    }
  }

  game.score++;

  const scoreEl =
    document.getElementById(
      "spaceScore"
    );

  if (scoreEl) {
    scoreEl.textContent =
      Math.floor(
        game.score / 10
      );
  }

  drawSpace();

  state.animation =
    requestAnimationFrame(
      spaceLoop
    );
}

function drawSpace() {
  const game =
    state.space;

  if (!game) return;

  const {
    ctx,
    canvas,
    player
  } = game;

  ctx.fillStyle =
    "#05070d";

  ctx.fillRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

  ctx.fillStyle =
    "rgba(255,255,255,.5)";

  for (
    let i = 0;
    i < 50;
    i++
  ) {

    const x =
      (i * 137) %
      canvas.width;

    const y =
      (i * 83) %
      canvas.height;

    ctx.fillRect(
      x,
      y,
      2,
      2
    );
  }

  ctx.fillStyle =
    "#20d9ee";

  ctx.beginPath();

  ctx.moveTo(
    player.x,
    player.y - 18
  );

  ctx.lineTo(
    player.x - 22,
    player.y + 15
  );

  ctx.lineTo(
    player.x,
    player.y + 8
  );

  ctx.lineTo(
    player.x + 22,
    player.y + 15
  );

  ctx.closePath();

  ctx.fill();

  game.meteors.forEach(
    meteor => {

      ctx.fillStyle =
        "#ff6680";

      ctx.beginPath();

      ctx.arc(
        meteor.x,
        meteor.y,
        meteor.r,
        0,
        Math.PI * 2
      );

      ctx.fill();
    }
  );
}

/* =========================================================
   RESULT
   ========================================================= */

function showGameResult(
  icon,
  title,
  description,
  xp
) {
  /*
    On garde le jeu actuel avant stopAll()
    pour que "Rejouer" relance le bon jeu.
  */

  const replayGame =
    state.game;

  stopAll();

  const content =
    document.getElementById(
      "gameContent"
    );

  if (!content) {
    navigate("games");
    return;
  }

  content.innerHTML = `
    <div class="card result">

      <div class="big">
        ${icon}
      </div>

      <h2>
        ${escapeHTML(title)}
      </h2>

      <p
        class="muted"
        style="margin:10px 0 20px"
      >
        ${escapeHTML(description)}
      </p>

      <p
        style="
          font-weight:900;
          margin-bottom:20px
        "
      >
        ⭐ +${xp} XP
      </p>

      <div
        class="actions"
        style="justify-content:center"
      >

        <button
          class="btn primary"
          onclick="startGame('${replayGame || "memory"}')"
        >
          🔄 Rejouer
        </button>

        <button
          class="btn"
          onclick="navigate('games')"
        >
          🎮 Autres jeux
        </button>

        <button
          class="btn"
          onclick="navigate('home')"
        >
          ⌂ Accueil
        </button>

      </div>

    </div>
  `;
}

/* =========================================================
   QUIZ HOME
   ========================================================= */

function renderQuizHome() {
  const categories =
    Object.keys(
      quizData
    );

  return `
    <div class="page quiz-layout">

      <div class="section-head">

        <div>

          <div class="eyebrow">
            EDUCATION
          </div>

          <h2>
            🎓 Quiz
          </h2>

          <p>
            Teste tes connaissances sans voir
            les réponses à l'avance.
          </p>

        </div>

      </div>

      <div class="cards">

        ${categories
          .map(
            category => `
              <div class="card game-card">

                <div class="game-icon">
                  🎓
                </div>

                <h3>
                  ${category}
                </h3>

                <p>
                  ${quizData[category].length}
                  questions disponibles
                  avec plusieurs niveaux de difficulté.
                </p>

                <div class="card-bottom">

                  <span class="tag">
                    Quiz éducatif
                  </span>

                  <button
                    class="btn primary"
                    onclick="openQuizSetup('${escapeHTML(category)}')"
                  >
                    Commencer
                  </button>

                </div>

              </div>
            `
          )
          .join("")}

      </div>

    </div>
  `;
}

function openQuizSetup(
  category
) {
  stopAll();

  state.page =
    "quiz";

  renderQuizSetup(
    category
  );
}

function renderQuizSetup(
  category
) {
  const app =
    document.getElementById(
      "app"
    );

  if (!app) return;

  app.innerHTML = `
    <div class="page quiz-layout">

      <div class="card">

        <button
          class="btn"
          onclick="navigate('quiz')"
        >
          ← Quiz
        </button>

        <div
          style="margin-top:25px"
        >

          <div class="eyebrow">
            CONFIGURATION
          </div>

          <h2>
            🎓
            ${escapeHTML(category)}
          </h2>

          <p class="muted">
            Choisis la difficulté et le nombre de questions.
          </p>

        </div>

        <div class="quiz-config">

          <div class="field">

            <label>
              Difficulté
            </label>

            <select
              id="quizDifficulty"
              class="select"
            >

              <option value="all">
                Toutes
              </option>

              <option value="facile">
                Facile
              </option>

              <option value="moyen">
                Moyen
              </option>

              <option value="difficile">
                Difficile
              </option>

            </select>

          </div>

          <div class="field">

            <label>
              Questions
            </label>

            <select
              id="quizCount"
              class="select"
            >

              <option value="5">
                5
              </option>

              <option value="8">
                8
              </option>

              <option value="10">
                10
              </option>

              <option value="12">
                12
              </option>

            </select>

          </div>

          <div
            class="field"
            style="display:flex;align-items:end"
          >

            <button
              class="btn primary"
              style="width:100%"
              onclick="startQuiz('${escapeHTML(category)}')"
            >
              🚀 Commencer
            </button>

          </div>

        </div>

      </div>

    </div>
  `;
}

function prepareQuiz(
  category,
  difficulty,
  count
) {
  let pool =
    quizData[category] ||
    [];

  if (
    difficulty !== "all"
  ) {

    const filtered =
      pool.filter(
        q =>
          q[3] ===
          difficulty
      );

    if (
      filtered.length > 0
    ) {
      pool =
        filtered;
    }
  }

  return shuffle(pool)
    .slice(
      0,
      Math.min(
        count,
        pool.length
      )
    )
    .map(q => {

      const answers =
        q[1].map(
          (
            text,
            index
          ) => ({
            text,
            correct:
              index === q[2]
          })
        );

      return {
        question: q[0],
        answers:
          shuffle(answers),
        difficulty:
          q[3]
      };
    });
}

function startQuiz(
  category
) {
  const difficulty =
    document.getElementById(
      "quizDifficulty"
    )?.value ||
    "all";

  const count =
    Number(
      document.getElementById(
        "quizCount"
      )?.value
    ) || 5;

  const questions =
    prepareQuiz(
      category,
      difficulty,
      count
    );

  if (
    !questions.length
  ) {

    showToast(
      "Impossible de charger ce quiz."
    );

    return;
  }

  state.page =
    "quizPlay";

  state.quiz = {
    category,
    questions,
    index: 0,
    correct: 0,
    answered: false,
    token:
      state.token
  };

  render();
}

/* =========================================================
   QUIZ GAME
   ========================================================= */

function renderQuizGame() {
  const q =
    state.quiz
      ?.questions[
        state.quiz.index
      ];

  if (!q) {
    finishQuiz();
    return "";
  }

  const total =
    state.quiz.questions.length;

  const progress =
    (
      state.quiz.index /
      total
    ) * 100;

  return `
    <div class="page quiz-layout">

      <div class="card">

        <div class="quiz-meta">

          <span>
            ${escapeHTML(
              state.quiz.category
            )}
          </span>

          <span>
            Question
            ${state.quiz.index + 1}
            /
            ${total}
          </span>

        </div>

        <div class="progress">

          <div
            style="width:${progress}%"
          ></div>

        </div>

        <span class="tag">
          ${q.difficulty}
        </span>

        <h1 class="quiz-question">
          ${escapeHTML(
            q.question
          )}
        </h1>

        <div class="answers">

          ${q.answers
            .map(
              (
                answer,
                i
              ) => `
                <button
                  class="answer"
                  onclick="answerQuiz(${i})"
                >
                  ${escapeHTML(
                    answer.text
                  )}
                </button>
              `
            )
            .join("")}

        </div>

      </div>

    </div>
  `;
}

function answerQuiz(index) {
  const game =
    state.quiz;

  if (
    !game ||
    game.answered
  ) {
    return;
  }

  game.answered =
    true;

  const question =
    game.questions[
      game.index
    ];

  const buttons =
    document.querySelectorAll(
      ".answer"
    );

  const selected =
    question.answers[
      index
    ];

  buttons.forEach(
    (
      button,
      i
    ) => {

      button.disabled =
        true;

      if (
        question.answers[
          i
        ].correct
      ) {
        button.classList.add(
          "correct"
        );
      }

    }
  );

  if (
    !selected.correct
  ) {

    buttons[index]
      ?.classList.add(
        "wrong"
      );

  } else {

    game.correct++;
  }

  player.quizAnswered++;

  if (
    selected.correct
  ) {
    player.quizCorrect++;
  }

  savePlayer();

  queueCloudSync();

  addTimer(() => {

    if (!state.quiz)
      return;

    game.index++;

    game.answered =
      false;

    if (
      game.index >=
      game.questions.length
    ) {

      finishQuiz();

    } else {

      render();
    }

  }, 700);
}

function finishQuiz() {
  const game =
    state.quiz;

  if (!game) return;

  const total =
    game.questions.length;

  const score =
    game.correct * 100;

  const percent =
    Math.round(
      (
        game.correct /
        total
      ) * 100
    );

  const xp =
    25 +
    game.correct * 8;

  player.history.unshift({
    type: "quiz",
    name:
      `Quiz ${game.category}`,
    score:
      game.correct,
    total,
    xp,
    date:
      new Date()
        .toLocaleString(
          "fr-FR"
        )
  });

  player.history =
    player.history.slice(
      0,
      30
    );

  addXP(xp);

  updateAchievements();

  savePlayer();

  queueCloudSync();

  const category =
    game.category;

  state.quiz =
    null;

  state.page =
    "quiz";

  const app =
    document.getElementById(
      "app"
    );

  if (!app) return;

  app.innerHTML = `
    <div class="page quiz-layout">

      <div class="card result">

        <div class="big">

          ${
            percent >= 80
              ? "🏆"
              : percent >= 50
                ? "🎓"
                : "📚"
          }

        </div>

        <h2>
          Quiz terminé !
        </h2>

        <p
          style="
            font-size:30px;
            font-weight:900;
            margin:15px
          "
        >
          ${game.correct}
          /
          ${total}
        </p>

        <p class="muted">
          ${percent}% de bonnes réponses
        </p>

        <p
          style="
            margin:18px;
            font-weight:900
          "
        >
          ⭐ +${xp} XP
        </p>

        <div
          class="actions"
          style="justify-content:center"
        >

          <button
            class="btn primary"
            onclick="openQuizSetup('${escapeHTML(category)}')"
          >
            🔄 Refaire
          </button>

          <button
            class="btn"
            onclick="navigate('quiz')"
          >
            🎓 Autres quiz
          </button>

          <button
            class="btn"
            onclick="navigate('home')"
          >
            ⌂ Accueil
          </button>

        </div>

      </div>

    </div>
  `;

  updateHeader();
}

/* =========================================================
   LEADERBOARD MONDIAL
   ========================================================= */

function renderLeaderboard() {
  return `
    <div class="page">

      <div class="section-head">

        <div>

          <div class="eyebrow">
            RANKING
          </div>

          <h2>
            🏆 Classement mondial
          </h2>

          <p>
            Les meilleurs joueurs de Nexora Play.
          </p>

        </div>

      </div>

      <div class="card leaderboard">

        <div
          id="globalLeaderboardBody"
        >
          <div class="empty">
            ⏳ Chargement du classement mondial...
          </div>
        </div>

      </div>

      <div
        class="card"
        style="margin-top:15px"
      >

        <h3>
          🌐 Comment ça marche ?
        </h3>

        <p
          class="muted"
          style="
            margin-top:8px;
            line-height:1.6
          "
        >
          Ton profil est synchronisé avec Supabase
          lorsque tu joues. Les joueurs partagent
          le même classement mondial.
        </p>

      </div>

    </div>
  `;
}

/* =========================================================
   PROFILE
   ========================================================= */

function renderProfile() {
  const xpNeed =
    xpForNextLevel();

  const percent =
    Math.min(
      100,
      player.xp /
        xpNeed *
        100
    );

  return `
    <div class="page">

      <div class="profile-layout">

        <div class="card profile-card">

          <div class="avatar-big">
            ${escapeHTML(
              player.avatar
            )}
          </div>

          <h2>
            ${escapeHTML(
              player.name
            )}
          </h2>

          <p class="muted">
            Niveau ${player.level}
          </p>

          <div class="xp-bar">

            <div
              style="width:${percent}%"
            ></div>

          </div>

          <small class="muted">
            ${player.xp}
            /
            ${xpNeed}
            XP
          </small>

          <div
            class="actions"
            style="justify-content:center;margin-top:20px"
          >

            <button
              class="btn"
              onclick="changeName()"
            >
              ✏️ Modifier le nom
            </button>

            <button
              class="btn"
              onclick="changeAvatar()"
            >
              🎨 Avatar
            </button>

            <button
              class="btn danger"
              onclick="resetProgress()"
            >
              🗑️ Réinitialiser
            </button>

          </div>

        </div>

        <div class="card">

          <h3>
            📊 Statistiques
          </h3>

          <div
            class="stats-grid"
            style="margin-top:15px"
          >

            <div class="stat">

              <strong>
                ${player.gamesPlayed}
              </strong>

              <span>
                Parties
              </span>

            </div>

            <div class="stat">

              <strong>
                ${player.wins}
              </strong>

              <span>
                Victoires
              </span>

            </div>

            <div class="stat">

              <strong>
                ${player.quizCorrect}
              </strong>

              <span>
                Bonnes réponses
              </span>

            </div>

            <div class="stat">

              <strong>
                ${player.streak}
              </strong>

              <span>
                Streak
              </span>

            </div>

          </div>

          <h3
            style="margin:30px 0 15px"
          >
            🏅 Succès
          </h3>

          <div class="achievement-grid">

            ${achievementData
              .map(
                ([
                  id,
                  title,
                  desc
                ]) => `
                  <div
                    class="achievement ${
                      player.achievements.includes(
                        id
                      )
                        ? "unlocked"
                        : ""
                    }"
                  >

                    <strong>
                      ${title}
                    </strong>

                    <span>
                      ${desc}
                    </span>

                  </div>
                `
              )
              .join("")}

          </div>

        </div>

      </div>

      <section class="section">

        <div class="section-head">

          <div>

            <h2>
              🕘 Historique
            </h2>

            <p>
              Les dernières activités de ton profil.
            </p>

          </div>

        </div>

        <div class="card">

          ${
            player.history.length
              ? `
                <div class="history">

                  ${player.history
                    .slice(
                      0,
                      20
                    )
                    .map(
                      h => `
                        <div
                          class="history-item"
                        >

                          <span>

                            ${
                              h.type ===
                              "quiz"
                                ? "🎓"
                                : "🎮"
                            }

                            ${escapeHTML(
                              h.name
                            )}

                          </span>

                          <strong>

                            ${
                              h.type ===
                              "quiz"
                                ? `${h.score}/${h.total}`
                                : h.score
                            }

                          </strong>

                        </div>
                      `
                    )
                    .join("")}

                </div>
              `
              : `
                <div class="empty">
                  Aucun historique pour le moment.
                </div>
              `
          }

        </div>

      </section>

    </div>
  `;
}

function changeName() {
  const name =
    prompt(
      "Nouveau nom :"
    );

  if (!name)
    return;

  const clean =
    name
      .trim()
      .slice(
        0,
        18
      );

  if (!clean)
    return;

  player.name =
    clean;

  player.avatar =
    clean
      .charAt(0)
      .toUpperCase();

  savePlayer();

  queueCloudSync();

  render();

  showToast(
    "✅ Profil mis à jour !"
  );
}

function changeAvatar() {
  const avatar =
    prompt(
      "Choisis un emoji pour ton avatar :",
      player.avatar
    );

  if (!avatar)
    return;

  player.avatar =
    [
      ...avatar.trim()
    ][0] ||
    player.avatar;

  savePlayer();

  render();

  showToast(
    "🎨 Avatar modifié !"
  );
}

async function resetProgress() {
  const confirmation =
    confirm(
      "Réinitialiser toute ta progression ?"
    );

  if (!confirmation)
    return;

  player =
    structuredClone(
      defaultPlayer
    );

  savePlayer();

  /*
    On conserve le même ID cloud.
    Le profil mondial est remis à zéro.
  */

  await syncPlayerToSupabase();

  state.page =
    "home";

  render();

  showToast(
    "🗑️ Progression réinitialisée."
  );
}

/* =========================================================
   NAVIGATION
   ========================================================= */

document.addEventListener(
  "click",
  event => {

    const button =
      event.target.closest(
        "[data-page]"
      );

    if (!button)
      return;

    navigate(
      button.dataset.page
    );
  }
);

/* =========================================================
   START
   ========================================================= */

updateHeader();
render();

/*
  Si le joueur a déjà joué auparavant,
  on synchronise son profil au chargement.
*/

if (
  player.gamesPlayed > 0
) {
  queueCloudSync();
}
