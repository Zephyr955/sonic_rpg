const jouer = document.getElementById("jouer");
const nom = document.getElementById("nom");

jouer.addEventListener("click", () => {
    let nomJoueur = nom.value;

    if(nomJoueur != "") {
        localStorage.setItem("nom", nomJoueur);
        location.href = "./dialogue.html";
    }
    else {
        alert("Entrez votre nom");
    }
})