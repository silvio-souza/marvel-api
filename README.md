# Retrieve Comics using Marvel API
This project is designed to use the [Marvel Comics API](https://developer.marvel.com/documentation/generalinfo) to retrieve informations from all the comics from a specific character and export it to a CSV file.

Currently it only retrieve the info of Thor comics, as it is static in the code.

The project was executed using [NodeJS](https://nodejs.org/en) with [Express](https://expressjs.com/) and [Axios](https://axios-http.com/docs/intro).

## What information is retrieved
On this version the comics information that are exported to the CSV are:
- Comic ID
- Title
- Year
- Number of Pages
- Price
- Cover URL

## Getting started
To run the project you'll need to perform the following steps:
1. Install NodeJS and NPM

For that you can go to the official page for [NodeJS](https://nodejs.org/pt-br/download). For standard installation NPM already comes with Node, but in case needed you may also go for the [NPM](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) page.

2. Install modules and dependencies

On the terminal within the project folder run the following line:
```
npm install
```
The modules and dependencies will be installed.

3. Execute the project Index file

Now you can execute the main index.js file and generate the CSV:
```
node index.js
```
The CSV file will be generated and saved on the project folder as "*{characterName}-comics.CSV*"

## Observations

- Since the API only accept a maximum of 100 items requested per request, it could take a while to generate the file for older characters that has a lot of comics published over the years (Thor, for example, has over 1800 listed on the API).
A simple loading percentage was added to give some feedback regarding the request and CSV build process.

- The program will only retrieve comics listed as "*Format: Comic*". Other types like "*Trade Paperback*" won't be added to the CSV file.
