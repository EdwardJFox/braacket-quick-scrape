const fs = require('fs');
const rp = require('request-promise');
const cheerio = require('cheerio');
const Player = require('./player');

const baseUrl = 'https://braacket.com/league/SmashUK/player?rows=200';
const baseParams = '&page='

const playerUrl = 'https://braacket.com/league/SmashUK/player/';

const players = {};
var pages;

// First, grab the base url and start going through each page
rp(baseUrl)
  .then(function (html) {
    const $ = cheerio.load(html);
    pages = $('#search-page option:last-of-type').text();
    return parseInt(pages);
  })
  .then(function (pages) {
    var toRun = [];

    for (var i = 1; i <= pages; i++) {
      toRun.push(getLeaguePlayersPage(i));
    }

    return Promise.all(toRun);
  })
  .then(function () {
    return new Promise((resolve, reject) => {
      fs.writeFile('players.json', JSON.stringify(players), 'utf8', () => resolve());
    })
  })
  .catch(function (err) {
    console.log(err);
  });

function getLeaguePlayersPage(page) {
  return new Promise(function (resolve, reject) {
    rp(baseUrl + baseParams + page)
      .then(function (html) {
        const $ = cheerio.load(html);
        const playerRows = $('section:nth-of-type(3) tr');
        processPlayers(playerRows, $);
        resolve(true);
      }).
    catch(function (err) {
      reject(err);
    });
  });
}

function processPlayers(playerRows, $) {
  playerRows.each(function (index, elem) {
    // Ignore the header row
    if (index != 0) {
      const playerId = $(elem).find('td:first-of-type a').attr('href').split('/')[4];
      const playerName = $(elem).find('td:first-of-type').text().trim();
      const twitter = $(elem).find('.badge').attr('href');
      let region = undefined;
      if($(elem).find('.country_region_flag').length > 0) {
        region = {
          long: $(elem).find('.country_region_flag').attr('title'),
          short: $(elem).find('.country_region_flag').text()
        }
      }
      const character_1 = $(elem).find('.game_character:first-of-type').attr('title')
      let character_2 = $(elem).find('.game_character:last-of-type').attr('title')
      if(character_1 == character_2) {
        character_2 = undefined;
      }
      players[playerName] = new Player(playerId, playerName, twitter, region, character_1, character_2)
    }
  });
}

function getPlayerHeadToHead(player) {

}