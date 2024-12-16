const attaque = document.getElementById("attaque");
const magie = document.getElementById("magie");
const defense = document.getElementById("defense");
const pvPlayerDiv = document.getElementById("pv-player");
const pvEnnemyDiv = document.getElementById("pv-ennemy");
const barreEnnemyDiv = document.getElementById("barre-ennemy");
const listeSpecial = document.getElementById("attaque-special");
const imgPlayer = document.getElementById("img-player");
const imgEnnemy = document.getElementById("img-ennemy");
const namePlayer = document.getElementById("name-player");
const nameEnnemy = document.getElementById("name-ennemy");

let ennemyStory = localStorage.getItem("ennemyStory");
let playerStory = localStorage.getItem("playerStory");

const stats = {
    sonic: {
        name: "SONIC",
        img: "./img/Sonic_sprite.png",
        pv: 300,
        atk: 60,
        def: 5,
        magie: [
            {
                name: "BLINDSIDE BASHER",
                atk: 200,
                heal: 0,
                video: "./video/blindside_basher.mp4",
            },
            {
                name: "SKYPIERCE BOLT",
                atk: 200,
                heal: 0,
                video: "./video/skypierce_bolt.mp4",
            },
            {
                name: "THREEFOLD DEVASTATION",
                atk: 200,
                heal: 0,
                video: "./video/threefold_devastation.mp4",
            },
            {
                name: "HEAL",
                atk: 0,
                heal: 250,
                video: "./video/heal.mp4",
            },
        ],
    },
    shadow: {
        name: "SHADOW",
        img: "./img/Shadow_sprite.png",
        pv: 300,
        atk: 60,
        def: 7,
        magie: [
            {
                name: "BLINDSIDE BASHER",
                atk: 200,
                heal: 0,
                video: "./video/blindside_basher.mp4",
            },
            {
                name: "SKYPIERCE BOLT",
                atk: 200,
                heal: 0,
                video: "./video/skypierce_bolt.mp4",
            },
            {
                name: "THREEFOLD DEVASTATION",
                atk: 200,
                heal: 0,
                video: "./video/threefold_devastation.mp4",
            },
            {
                name: "HEAL",
                atk: 0,
                heal: 250,
                video: "./video/heal.mp4",
            },
        ],
    },
    seelkadoom: {
        name: "SEELKADOOM",
        img: "./img/sprite_seelkadoom.png",
        pv: 1200,
        atk: 65,
        def: 10,
    },
};

let player = {
    pv: stats[playerStory]["pv"],
    atk: stats[playerStory]["atk"],
    def: stats[playerStory]["def"],
};

let ennemy = {
    pv: stats[ennemyStory]["pv"],
    atk: stats[ennemyStory]["atk"],
    def: stats[ennemyStory]["def"],
};

let turnToggle = false;

function StartCombat() {
    imgPlayer.src = stats[playerStory]["img"];
    imgEnnemy.src = stats[ennemyStory]["img"];
    namePlayer.innerHTML = stats[playerStory]["name"];
    nameEnnemy.innerHTML = stats[ennemyStory]["name"];
    listeSpecial.innerHTML = ""; 

    stats[playerStory]["magie"].forEach((magie) => {
        const div = document.createElement("div");
        const h3 = document.createElement("h3");

        h3.innerHTML = magie["name"];

        div.addEventListener("click", () => {
            if (magie.video) {
                afficherVideo(magie.video);
            }
            PlayerTurn(
                "magie",
                Magie(magie["name"], magie["atk"], magie["heal"])
            );
            
        });

        div.appendChild(h3);
        listeSpecial.appendChild(div);
    });
}

StartCombat();

function PlayerTurn(action, magieName, magieAtk) {
    if (turnToggle == false) {
        turnToggle = true;
        if (action == "attaque") {
            Attaque(player, ennemy);
        } else if (action == "defense") {
            player["def"] = player["def"] * 2;
        }
        RefreshCombat();
        setTimeout(() => {
            EnnemyTurn();
            if (action == "defense") {
                player["def"] = player["def"] / 2;
            }
            turnToggle = false;
            if (player["pv"] <= 0) {
                turnToggle = true;
                afficherBoutonRecommencer();
            } else if (ennemy["pv"] <= 0) {
                turnToggle = true;
                localStorage.setItem("combatStatut", "win");
                localStorage.setItem("scene", 0); 
                localStorage.setItem("chapitre", 1);
                setTimeout(() => {
                    location.href = "./dialogue.html";
                }, 3000);
                
            }
        }, 500);
    }
}

magie.addEventListener("click", () => {
    let audio_magie = document.getElementById("magie_click");
    audio_magie.play();
    Magie();
});

function Reset() {
    player["pv"] = stats[playerStory]["pv"];
    ennemy["pv"] = stats[ennemyStory]["pv"];
    turnToggle = false;
    RefreshCombat();
}

function RefreshCombat() {
    pvPlayerDiv.style.width =
        (player["pv"] / stats[playerStory]["pv"]) * 100 + "%";
    pvEnnemyDiv.style.width =
        (ennemy["pv"] / stats[ennemyStory]["pv"]) * 100 + "%";

    if (player["pv"] <= 0) {
        pvPlayerDiv.style.width = 0;
        pvPlayerDiv.style.display = "none";
    } else if (ennemy["pv"] <= 0) {
        pvEnnemyDiv.style.width = 0;
        pvEnnemyDiv.style.display = "none";
    } else {
        pvPlayerDiv.style.display = "flex";
        pvEnnemyDiv.style.display = "flex";
    }
}

function EnnemyTurn() {
    if (ennemy["pv"] > 0) {
        Attaque(ennemy, player);
        RefreshCombat();
    }
}


function Attaque(attaquant, cible) {
    let rand = Math.floor(Math.random() * 10) - cible["def"];
    cible["pv"] -= attaquant["atk"] + rand;

    if (cible["pv"] < 0) {
        cible["pv"] = 0;
    }
}

if (!playerStory || !ennemyStory) {
    localStorage.setItem("playerStory", "sonic"); 
    localStorage.setItem("ennemyStory", "seelkadoom");
}

function Magie(magieSelectionnee, magieAtk, magieHeal) {
    if (!magieSelectionnee) {
        nameEnnemy.style.display = "none";
        imgEnnemy.style.display = "none";
        pvEnnemyDiv.style.display = "none";
        barreEnnemyDiv.style.display = "none";
        listeSpecial.style.display = "flex";
    } else {
        nameEnnemy.style.display = "flex";
        imgEnnemy.style.display = "flex";
        pvEnnemyDiv.style.display = "flex";
        barreEnnemyDiv.style.display = "flex";
        listeSpecial.style.display = "none";
        if (magieHeal == 0) {
            let rand = Math.floor(Math.random() * 10) - ennemy["def"];
            ennemy["pv"] -= magieAtk + rand;
        } else {
            let rand = Math.floor(Math.random() * 10);
            player["pv"] += magieHeal + rand;
            if (player["pv"] > stats[playerStory]["pv"]) {
                player["pv"] == stats[playerStory]["pv"];
            }
        }
    }
}

function afficherBoutonRecommencer() {
    const combatActions = document.getElementById("combat-actions");

    combatActions.innerHTML = "";

    const boutonRecommencer = document.createElement("button");
    boutonRecommencer.innerText = "Recommencer le combat";
    boutonRecommencer.classList.add("recommencer-btn");

    boutonRecommencer.addEventListener("click", () => {
        Reset(); 
        combatActions.innerHTML = ""; 
    });

    combatActions.appendChild(boutonRecommencer);
}

const attaqueDiv = document.getElementById("attaque");
const videoAttaque = "./video/attaque.mp4";

function afficherVideo(src) {
    const videoContainer = document.createElement("div");
    videoContainer.classList.add("video-container");

    const video = document.createElement("video");
    video.src = src;
    video.autoplay = true;
    video.style.width = "100%"; 
    video.style.height = "100vh"; 
    video.controls = false;

    const closeButton = document.createElement("button");
    closeButton.innerText = "X";
    closeButton.classList.add("close-btn");

    closeButton.addEventListener("click", () => {
        videoContainer.remove(); 
    });

    video.addEventListener("ended", () => {
        videoContainer.remove(); 
        PlayerTurn("attaque"); 
    });

    videoContainer.appendChild(video);
    videoContainer.appendChild(closeButton);

    document.body.appendChild(videoContainer); 
}

attaqueDiv.addEventListener("click", () => {
    afficherVideo(videoAttaque); 
});




attaque.addEventListener("click", () => PlayerTurn("attaque"));
defense.addEventListener("click", () => PlayerTurn("defense"));
