//importing the clicked superhero from script.js i.e. Main List Page
const urlParams = new URLSearchParams(window.location.search);
const clickedSuperHero = urlParams.get("clickedSuperHero");
console.log(clickedSuperHero);

//Initializing all the necessary elements
var superheroImageEl = document.getElementById("superhero-image");
var superheroNameEl = document.getElementById("superhero-name");
var superheroDescriptionEl = document.getElementById("superhero-description");
var seriesEl = document.getElementById("series");
var comicsEl = document.getElementById("comics");
var eventsEl = document.getElementById("events");
const publicKey = "cb89a4a8ab5f5f8c84dd71835d4f047a";
const privateKey = "7bb5d05ce2d7562db4d06751e0b6b2b1f56e7db8";
const offset = 0;
const img = document.getElementById('hero-img');
//Generating a random time stamp
function generateTimestamp() {
  return Math.floor(Date.now() / 1000);
}

//Now fetching the info on thr Clicked SuperHero
function makeAPIRequest(offset) {
  var ts = generateTimestamp().toString();
  //console.log(ts);
  const hash = CryptoJS.MD5(ts + privateKey + publicKey).toString();
  //console.log(offset);
  fetch(
    `https://gateway.marvel.com/v1/public/characters?name=${clickedSuperHero}&limit=100&offset=${offset}&ts=${ts}&apikey=${publicKey}&hash=${hash}`
  )
    .then((response) => response.json())
    .then((data) => {
      let superHeroInfo = data.data.results;
      //console.log(superHeroInfo);
      fillAllDivs(superHeroInfo[0]);
    })
    .catch((error) => console.error("Error:", error));
}

makeAPIRequest(offset);

function fillAllDivs(superHero) {
  //console.log(`${superHero.thumbnail.path}.${superHero.thumbnail.extension}`);
  const imgSrc = `${superHero.thumbnail.path}.${superHero.thumbnail.extension}`;
  img.onload = function() {
    const aspectRatio = img.naturalWidth / img.naturalHeight;
    const containerWidth = 300; // Set your container width
    const containerHeight = containerWidth / aspectRatio;
    superheroImageEl.style.height = `${containerHeight}px`;
  };
  img.src = imgSrc; 
  superheroNameEl.textContent = superHero.name;
  superheroDescriptionEl.textContent = superHero.description;

  //Updating Series-List
  let seriesList = seriesEl.querySelector('#series-list');
  superHero.series.items.forEach(item => {
    const sli = document.createElement('li');
    sli.textContent = item.name;
    seriesList.appendChild(sli);
  });
  
  //Updating Comics-List
  let comicsList = comicsEl.querySelector('#comics-list');
  superHero.comics.items.forEach(item => {
    const cli = document.createElement('li');
    cli.textContent = item.name;
    comicsList.appendChild(cli);
  });

  //Updating Events-List
  let eventsList = eventsEl.querySelector('#events-list');
  superHero.events.items.forEach(item => {
    const eli = document.createElement('li');
    eli.textContent = item.name;
    eventsList.appendChild(eli);
  });

}
