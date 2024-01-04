var favSuperHeroesArray = JSON.parse(localStorage.getItem("myfavSuperHeroes"));
console.log(favSuperHeroesArray);
var cardcontainer = document.getElementById("card-container");
const publicKey = "cb89a4a8ab5f5f8c84dd71835d4f047a";
const privateKey = "7bb5d05ce2d7562db4d06751e0b6b2b1f56e7db8";

//Function to generate random ts
function generateTimestamp() {
  return Math.floor(Date.now() / 1000);
}

//Function to make API request
function makeAPIRequest() {
  var ts = generateTimestamp().toString();
  //console.log(ts);
  const hash = CryptoJS.MD5(ts + privateKey + publicKey).toString();
  //console.log(offset);
  favSuperHeroesArray.forEach((favSuperHero) => {
    let currentSuperHero = favSuperHero.replace(" ", "%20");
    //console.log(`https://gateway.marvel.com:443/v1/public/characters?name=${currentSuperHero}&ts=${ts}&apikey=${publicKey}&hash=${hash}`);
    fetch(
      `
      https://gateway.marvel.com:443/v1/public/characters?name=${currentSuperHero}&ts=${ts}&apikey=${publicKey}&hash=${hash}`
    )
      .then((response) => response.json())
      .then((data) => {
        let superHeroInfo = data.data.results;
        console.log(superHeroInfo[0].name);
        displaySuperHero(superHeroInfo[0]);
      })
      .catch((error) => console.error("Error:", error))
      .finally(() => {
        let delButtons = document.querySelectorAll(".del-from-fav");
        delButtons.forEach((button) => {
          button.addEventListener("click", function () {
            let currentCard = button.closest(".superHero-card");
            let currentSuperHero = currentCard.querySelector("h3").textContent;
            if (favSuperHeroesArray.includes(currentSuperHero)) {
              let index = favSuperHeroesArray.indexOf(currentSuperHero);
              favSuperHeroesArray.splice(index, 1);
              localStorage.setItem(
                "myfavSuperHeroes",
                JSON.stringify(favSuperHeroesArray)
              );
              currentCard.remove();
            }
          });
        });
      });
  });
}

makeAPIRequest();

//console.log(superHeroList);

//Function to display SuperHero
function displaySuperHero(superHero) {
  console.log(`${superHero.thumbnail.path}.${superHero.thumbnail.extension}`);
  const card = `
      <div class="superHero-card">
        <img src="${superHero.thumbnail.path}.${superHero.thumbnail.extension}" />
        <h3>${superHero.name}</h3>
        <button class="del-from-fav" title ="Delete From Favourites"><i class="fa-solid fa-trash"></i></button>
      </div>
    `;
  cardcontainer.insertAdjacentHTML("afterbegin", card);
}

//function to add event listener to Remove Button
