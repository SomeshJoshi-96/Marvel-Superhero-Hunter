//Fetching all the required Elements and Buttons
const publicKey = "cb89a4a8ab5f5f8c84dd71835d4f047a";
const privateKey = "7bb5d05ce2d7562db4d06751e0b6b2b1f56e7db8";
const searchInput = document.getElementById("searchInput");
const hintsDiv = document.getElementById("hints");
const searchButton = document.getElementById("search-button");
var superHeroList = [];
var cardcontainer = document.getElementById("card-container");
let offset = 0;
var allCards;
const showAllCards = document.getElementById("show-all");
var favSuperHeroesArray = [];
//Checking if there exists any info regarding FavSuperHeroes
if (localStorage.getItem("myfavSuperHeroes") === null) {
  localStorage.setItem("myfavSuperHeroes", JSON.stringify(favSuperHeroesArray));
}
//console.log(localStorage.getItem("myfavSuperHeroes"))

//Generating a random time stamp
function generateTimestamp() {
  return Math.floor(Date.now() / 1000);
}

//making API request to retrieve marvel data of characters
function makeAPIRequest(offset) {
  var ts = generateTimestamp().toString();
  //console.log(ts);
  const hash = CryptoJS.MD5(ts + privateKey + publicKey).toString();
  //console.log(offset);
  fetch(
    `https://gateway.marvel.com/v1/public/characters?limit=100&offset=${offset}&ts=${ts}&apikey=${publicKey}&hash=${hash}`
  )
    .then((response) => response.json())
    .then((data) => {
      let superHeroInfo = data.data.results;
      let superHeroCount = data.data.total;
      //console.log(superHeroCount);
      // console.log(superHeroInfo);
      superHeroInfo.forEach((superHero) => {
        // Process or display superhero data here
        displaySuperHero(superHero);
        superHeroList.push(superHero.name);
      });
      if (offset + 100 < superHeroCount) {
        makeAPIRequest(offset + 100);
      } else {
        searchButton.innerHTML = '<i class="fa-solid fa-search"></i>';
        addFavButtonListeners();
        myFavouritesPage();
        cardsEventListener();
      }
    })
    .catch((error) => console.error("Error:", error));
}

makeAPIRequest(offset);

//console.log(superHeroList);

//Function to display SuperHero
function displaySuperHero(superHero) {
  const card = `
    <div class="superHero-card">
      <img src="${superHero.thumbnail.path}.${superHero.thumbnail.extension}" />
      <h3 id = "superHero-heading">${superHero.name}</h3>
      <div class="more-info" title="More Info"><i class="fa-solid fa-circle-info"></i></div>
      <button class="add-to-fav" title="Add to Favourites"><i class="fa-solid fa-spinner fa-spin"></i></button>
    </div>
  `;
  cardcontainer.insertAdjacentHTML("beforeend", card);
}

//Input Bar Search Input and displaying hints
searchInput.addEventListener("input", function () {
  const inputValue = this.value.toLowerCase();
  let matches = [];

  if (inputValue) {
    matches = superHeroList.filter((hint) =>
      hint.toLowerCase().startsWith(inputValue.toLowerCase())
    );
  }

  displayHints(matches);
});

//Function to display Matches of the typed Input
function displayHints(matches) {
  if (matches.length > 0) {
    hintsDiv.style.display = "block";
    hintsDiv.innerHTML = "";

    matches.forEach((match) => {
      const hintItem = document.createElement("div");
      hintItem.classList.add("hint");
      hintItem.textContent = match;
      hintsDiv.appendChild(hintItem);

      //if someone clicks on the hint item
      hintItem.addEventListener("click", function () {
        searchInput.value = match;
        hintsDiv.style.display = "none";
      });
    });
  } else {
    hintsDiv.style.display = "none";
  }
}

//If clicking out side search input - hints should be none
document.addEventListener("click", function (e) {
  if (e.target !== searchInput) {
    hintsDiv.style.display = "none";
  }
});

//Adding functionality to the search Button
searchButton.addEventListener("click", function () {
  allCards = document.querySelectorAll(".superHero-card");
  const inputValue = searchInput.value.toLowerCase();
  allCards.forEach((card) => {
    let cardName = card.querySelector("h3").textContent.toLowerCase();
    if (cardName.startsWith(inputValue)) {
      card.style.display = "flex";
      showAllCards.style.display = "inline-block";
    } else {
      card.style.display = "none";
      showAllCards.style.display = "inline-block";
    }
  });
});

//Adding functionality to the Show All Button
showAllCards.addEventListener("click", function () {
  allCards = document.querySelectorAll(".superHero-card");
  searchInput.value = "";
  allCards.forEach((card) => {
    card.style.display = "flex";
  });
});

//Adding fuctionality to the Add to Favourites Button
function addFavButtonListeners() {
  var favouriteButtons = document.querySelectorAll(".add-to-fav");
  favouriteButtons.forEach((button) => {
    button.innerHTML = `<i class="fa-solid fa-star"></i>`;
    button.addEventListener("click", function () {
      let selectedCard = button.closest(".superHero-card");
      let selectedName = selectedCard.querySelector("h3").textContent;
      console.log(selectedName);
      var favSuperHeroesArray = JSON.parse(
        localStorage.getItem("myfavSuperHeroes")
      );
      if (!favSuperHeroesArray.includes(selectedName)) {
        favSuperHeroesArray.push(selectedName);
      }
      localStorage.setItem(
        "myfavSuperHeroes",
        JSON.stringify(favSuperHeroesArray)
      );
    });
  });
}

//Adding event listener to My Favourites Link
function myFavouritesPage() {
  const myFaouritesEl = document.getElementById("my-favourites");
  myFaouritesEl.addEventListener("click", () => {
    //window.location.href = "index2.html";
    window.open("index2.html", "_blank");
  });
}

//Adding event listener to all Cards
//Exporting info of Clicked Element to other page
function cardsEventListener() {
  let allCards = document.getElementsByClassName("more-info");
  allCards = Array.from(allCards);
  allCards.forEach((card) => {
    card.addEventListener("click", () => {
      clickedSuperHero = card.parentNode.querySelector("h3").textContent;
      //Now exporting this ino to the index3/Clicked SuperHero Page
      const encodedclickedSuperHero = encodeURIComponent(clickedSuperHero);
      const infoTabUrl = `index3.html?clickedSuperHero=${encodedclickedSuperHero}`;
      window.open(infoTabUrl, "_blank");
    });
  });
}
