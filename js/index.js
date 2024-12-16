import { histoire } from "./histoire.js";

const mainMenu = document.querySelector(".menu");
const videoOpening = document.querySelector(".video_opening");
const dialogue = document.querySelector(".dialogue");
const choix = document.querySelectorAll(".choix");
const choixNom = document.querySelectorAll(".choix-nom");
const choixTexte = document.querySelectorAll(".choix-texte");
const choixContainer = document.querySelector(".choix-container");
const dialogueContainer = document.querySelector(".dialogue-container");
const chara = document.querySelector(".chara");
const texte = document.querySelector(".texte");
const charaContainer = document.querySelector(".chara-container");

if (!localStorage.getItem("chapitre")) {
    localStorage.setItem("scene", 0);
    localStorage.setItem("chapitre", 0);
}

if (localStorage.getItem("win")) {
    localStorage.setItem("scene", 0);
    localStorage.setItem("chapitre", 4);
}

let scene = parseInt(localStorage.getItem("scene"), 10) || 0;
let chapitre = parseInt(localStorage.getItem("chapitre"), 10) || 0;

let currentMusic = null;

changerMusique();

document.body.addEventListener("click", () => {
    const audioElement = document.querySelector("audio#background_music");
    if (audioElement && audioElement.paused) {
        audioElement
            .play()
            .catch((err) => console.warn("Lecture bloquée :", err));
    }
});

if (videoOpening && scene == 0 && chapitre == 0) {
    videoOpening.play();
    document.body.addEventListener("click", () => {
        videoOpening.remove();
    });
    videoOpening.addEventListener("ended", () => {
        videoOpening.remove();
    });
} else if (videoOpening) {
    videoOpening.remove();
}

if (mainMenu) {
    document.body.addEventListener("click", () => {
        let audio = document.getElementById("menu");
        audio.play();

        setTimeout(() => {
            if (!localStorage.getItem("nom")) {
                window.location.href = "form.html";
            } else {
                window.location.href = "dialogue.html";
            }
        }, 800);
    });
}

function recommencer() {
    localStorage.clear();
    location.reload();
}

function afficherScene() {
    if (histoire[chapitre][scene]["miniGame"] === "pierrePapierCiseaux") {
        jouerPierrePapierCiseaux();
    } else if (histoire[chapitre][scene]["choix"]) {
        afficherChoix();
    } else if (histoire[chapitre][scene]["texte"]) {
        document.body.style.padding = "64px";
        document.body.style.alignItems = "flex-end";
        chara.innerHTML = histoire[chapitre][scene]["chara"];
        texte.innerHTML = histoire[chapitre][scene]["texte"];
        choixContainer.style.display = "none";
        dialogueContainer.style.display = "flex";
    } else if (histoire[chapitre][scene]["fight"]) {
        localStorage.setItem(
            "playerStory",
            histoire[chapitre][scene]["playerStory"]
        );
        localStorage.setItem(
            "ennemyStory",
            histoire[chapitre][scene]["ennemyStory"]
        );
        localStorage.setItem("win", histoire[chapitre][scene]["win"]);
        window.location.href = "combat.html";
    }
    document.body.style.backgroundImage =
        histoire[chapitre][scene]["background"];

    if (histoire[chapitre][scene]["backgroundPosition"]) {
        document.body.style.backgroundPosition =
            histoire[chapitre][scene]["backgroundPosition"];
    } else {
        document.body.style.backgroundPosition = ""; 
    }

    changerMusique();
}

document.body.addEventListener("click", () => {
    const audioElement = document.querySelector("audio#background_music");
    if (audioElement && audioElement.paused) {
        audioElement
            .play()
            .catch((err) => console.warn("Lecture bloquée :", err));
    }
});


function afficherSceneSuivante() {
    scene++;
    localStorage.setItem("scene", scene);

    changerCouleur();
    afficherScene();

    document.body.addEventListener("click", () => {
        let audio_dialogue = document.getElementById("son_dialogue");
        audio_dialogue.play();
    });
}

function afficherChoix() {
    document.body.style.padding = "132px";
    document.body.style.alignItems = "center";
    choixNom[0].innerHTML = histoire[chapitre][scene]["choix"]["choixNom1"];
    choixNom[1].innerHTML = histoire[chapitre][scene]["choix"]["choixNom2"];
    choixTexte[0].innerHTML = histoire[chapitre][scene]["choix"]["choixTexte1"];
    choixTexte[1].innerHTML = histoire[chapitre][scene]["choix"]["choixTexte2"];
    choixContainer.style.display = "flex";
    dialogueContainer.style.display = "none";
}

function afficherChoixSelectionne(choixSelectionne) {
    if (choixSelectionne == 1) {
        if (histoire[chapitre][scene]["choix"]["choixChapitre1"]) {
            chapitre = histoire[chapitre][scene]["choix"]["choixChapitre1"];
            scene = 0;
            localStorage.setItem("chapitre", chapitre);
            localStorage.setItem("scene", scene);
        } else {
            afficherSceneSuivante();
        }
    } else {
        if (histoire[chapitre][scene]["choix"]["choixChapitre2"]) {
            chapitre = histoire[chapitre][scene]["choix"]["choixChapitre2"];
            scene = 0;
            localStorage.setItem("chapitre", chapitre);
            localStorage.setItem("scene", scene);
        } else {
            afficherSceneSuivante();
        }
    }
    afficherScene();
}

function jouerPierrePapierCiseaux() {
    const choixPossible = ["Pierre", "Feuille", "Ciseaux"];
    let choixJoueur;

    do {
        choixJoueur = prompt("Choisissez : Pierre, Feuille ou Ciseaux");
    } while (!choixPossible.includes(choixJoueur));

    const choixShadow = choixPossible[Math.floor(Math.random() * 3)];

    let gagnant;

    if (
        (choixJoueur === "Pierre" && choixShadow === "Ciseaux") ||
        (choixJoueur === "Feuille" && choixShadow === "Pierre") ||
        (choixJoueur === "Ciseaux" && choixShadow === "Feuille")
    ) {
        gagnant = "sonic";
    } else if (choixJoueur === choixShadow) {
        gagnant = "draw";
    } else {
        gagnant = "shadow";
    }

    if (gagnant === "sonic") {
        alert("Vous avez gagné contre Shadow !");
        localStorage.setItem("playerStory", "sonic");
        // Continuer l'histoire principale
        afficherSceneSuivante();
    } else if (gagnant === "shadow") {
        alert("Shadow a gagné !");
        localStorage.setItem("playerStory", "shadow");
        scene = 0;
        chapitre = 1;
        localStorage.setItem("scene", scene);
        localStorage.setItem("chapitre", chapitre);
        afficherScene();
    } else if (gagnant === "draw") {
        texte.innerHTML = "Égalité ! Réessayez encore une fois !";
        return jouerPierrePapierCiseaux();
    }
}



function changerMusique() {
    const nouvelleMusique = histoire[chapitre]?.[scene]?.music; 
    if (!nouvelleMusique) {
        console.warn(
            "Aucune musique définie pour cette scène :",
            chapitre,
            scene
        );
        return; 
    }

    if (nouvelleMusique !== currentMusic) {
        let audioElement = document.querySelector("audio#background_music");

        if (!audioElement) {
            audioElement = document.createElement("audio");
            audioElement.id = "background_music";
            audioElement.loop = true;
            document.body.appendChild(audioElement);
        }

        audioElement.pause();
        audioElement.src = nouvelleMusique;
        audioElement.load();

        audioElement
            .play()
            .then(() => console.log("Musique jouée :", nouvelleMusique))
            .catch((err) => console.warn("Lecture bloquée :", err));

        currentMusic = nouvelleMusique;
    }
}


function changerCouleur() {
    if (histoire[chapitre][scene]["chara"] == "AMY") {
        charaContainer.style.background = "linear-gradient(#F70AAC, #EF09B6)";
    } else if (histoire[chapitre][scene]["chara"] == "TAILS") {
        charaContainer.style.background = "linear-gradient(#FFB108, #EEB806)";
    } else if (histoire[chapitre][scene]["chara"] == "SONIC") {
        charaContainer.style.background = "linear-gradient(#4DBBFF, #2E9FE5)";
    } else if (histoire[chapitre][scene]["chara"] == "NARRATEUR") {
        charaContainer.style.background = "linear-gradient(#D3D3D0, #EBEAEA)";
    } else if (histoire[chapitre][scene]["chara"] == "EGGMAN") {
        charaContainer.style.background = "linear-gradient(#E00505, #BC0404)";
    } else if (histoire[chapitre][scene]["chara"] == "???") {
        charaContainer.style.background = "linear-gradient(#D3D3D0, #EBEAEA)";
    } else if (histoire[chapitre][scene]["chara"] == "KNUCKLES") {
        charaContainer.style.background = "linear-gradient(#E00505, #BC0404)";
    } else if (histoire[chapitre][scene]["chara"] == "CREAM") {
        charaContainer.style.background = "linear-gradient(#FFC792, #E2CBAA)";
    } else if (histoire[chapitre][scene]["chara"] == "SHADOW") {
        charaContainer.style.background = "linear-gradient(#DB0505, #7D1414)";
    } else if (histoire[chapitre][scene]["chara"] == "SEELKADOOM") {
        charaContainer.style.background = "linear-gradient(#1751E1, #1D1F92)";
    }
}

document.getElementById("reset_button").addEventListener("click", () => recommencer());

dialogueContainer.addEventListener("click", () => afficherSceneSuivante());
choix[0].addEventListener("click", () => afficherChoixSelectionne(1));
choix[1].addEventListener("click", () => afficherChoixSelectionne(2));
afficherScene();
