const axios = require("axios"); //requests axios package

// API request auth tokens
const apikey = "5de721d6ac2c691af3f0c8e6f9b6763e";
const hash = "f5f469e0e1ff84815e2566764ece572f";
const ts = "1691603446462";

// character requested info within the API
let character = "thor";
let characterId = 1009664;

// information that will be added on the CSV
let csv = "title,year,cover\n";
let comicTitle = "";
let publicationYear = 0;
let coverUrl = "";

/* 
original API request:
https://gateway.marvel.com/v1/public/characters?apikey=5de721d6ac2c691af3f0c8e6f9b6763e&hash=f5f469e0e1ff84815e2566764ece572f&ts=1691603446462&name=thor
*/

// method to request the character (Thor) results.
axios
  .get(
    `https://gateway.marvel.com/v1/public/characters?apikey=${apikey}&hash=${hash}&ts=${ts}&name=${character}`
  )
  .then((res) => {
    const results = res.data.data.results[0];
    character = results.name;
    characterId = results.id;
  });

/*
original API request:
https://gateway.marvel.com/v1/public/characters/1009664/comics?apikey=5de721d6ac2c691af3f0c8e6f9b6763e&hash=f5f469e0e1ff84815e2566764ece572f&ts=1691603446462
*/
//  method to request the comics information for the character
axios
  .get(
    `http://gateway.marvel.com/v1/public/characters/${characterId}/comics?apikey=${apikey}&hash=${hash}&ts=${ts}&offset=0&limit=100`
  )
  .then((res) => {
    // threat the information received and add it to the CSV variable
    const comics = res.data.data.results;
    comics.forEach((comic) => {
      if (comic.format == "Comic") {
        [comicTitle, publicationYear] = getTitleAndYear(comic.title);
        coverUrl = `${comic.thumbnail.path}.${comic.thumbnail.extension}`;

        csv += `${comicTitle},${publicationYear},${coverUrl}\n`;
      }
    });

    console.log(csv);
  });

// function to separate the title text and year of the comic
getTitleAndYear = (rawTitle) => {
  let title = rawTitle.split("(");
  let year = title[1].split(")");

  title = (title[0] + year[1].trim()).toString();
  year = year[0].toString();

  return [title, year];
};
