const rp = require('request-promise');
const cheerio = require('cheerio');
const baseUrl = 'https://braacket.com/league/SmashUK/player';
const baseParams = '?rows=200&page='
const Player = require('./player');

const players = {};
// First, grab the base url and start going through each page
rp(baseUrl)
  .then(function(html){
    const $ = cheerio.load(html);
    const playerRows = $('section:nth-of-type(3) tr');
    playerRows.each(function(index, elem) {
      // Ignore the header row
      if(index != 0 ) {
        const playerId = $(elem).find('td:first-of-type a').attr('href').split('/')[4];
        const playerName = $(elem).find('td:first-of-type').text().trim();
        const twitter = $(elem).find('.badge').attr('href');
        const region = $(elem).find('.country_region_flag').attr('title');
        players[playerName] = new Player(playerId, playerName, twitter, region)  
      }
    });

    console.log(players);
  })
  .catch(function(err){
    console.log(err);
  });