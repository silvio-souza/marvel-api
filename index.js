const axios = require("axios"); //requests axios package
const fs = require("fs"); //request fs (FileSystem) package to manage the CSV file

// API request auth tokens
const apikey = "5de721d6ac2c691af3f0c8e6f9b6763e";
const hash = "f5f469e0e1ff84815e2566764ece572f";
const ts = "1691603446462";

// character requested info within the API
let character = "thor";
let characterId = 0;
let comicsAmount = 0;

// information that will be added on the CSV
let csv = "id,title,year,pages,price,cover\n";
let comicTitle = "";
let publicationYear = 0;
let coverUrl = "";
let price = 0;

async function getComicsInfo() {
  // method to request the character (Thor) results.
  await axios
    .get(
      `https://gateway.marvel.com/v1/public/characters?apikey=${apikey}&hash=${hash}&ts=${ts}&name=${character}`
    )
    /* 
      original API request:
      https://gateway.marvel.com/v1/public/characters?apikey=5de721d6ac2c691af3f0c8e6f9b6763e&hash=f5f469e0e1ff84815e2566764ece572f&ts=1691603446462&name=thor
    */
    .then((res) => {
      const results = res.data.data.results[0];
      character = results.name;
      characterId = results.id;
      comicsAmount = results.comics.available;
    });

  // method to request the comics information for the character
  // due to the API restriction for 100 items per request, this iterates until the amount of all comics are retrieved
  for (let i = 0; i < comicsAmount; i += 100) {
    console.log(`Loading: ${((i / comicsAmount) * 100).toFixed(2)}%`);
    await axios
      .get(
        `http://gateway.marvel.com/v1/public/characters/${characterId}/comics?apikey=${apikey}&hash=${hash}&ts=${ts}&offset=${i}&limit=100`
      )
      /*
        original API request:
        https://gateway.marvel.com/v1/public/characters/1009664/comics?apikey=5de721d6ac2c691af3f0c8e6f9b6763e&hash=f5f469e0e1ff84815e2566764ece572f&ts=1691603446462&offset=0&limit=100
      */
      .then((res) => {
        // threat the information received and add it to the CSV variable
        const comics = res.data.data.results;
        comics.forEach((comic) => {
          if (comic.format == "Comic") {
            [comicTitle, publicationYear] = getTitleAndYear(comic.title);
            coverUrl = `${comic.thumbnail.path}.${comic.thumbnail.extension}`;
            price = comic.prices[0].price;

            csv += `${comic.id},${comicTitle},${publicationYear},${comic.pageCount},${price},${coverUrl}\n`;
          }
        });
      });
  }

  // method to add the comic information to the CSV file
  fs.writeFile(`${character}-comics.csv`, csv, (err) => {
    if (err) throw err;
    console.log("File created successfully.");
  });
}

getComicsInfo();

// function to separate the title text and year of the comic
getTitleAndYear = (rawTitle) => {
  let title = rawTitle.split("(");
  let year = title[1].split(")");

  title = (title[0].replace(/,/g, ".") + year[1].trim()).toString();
  year = year[0].toString();

  return [title, year];
};
