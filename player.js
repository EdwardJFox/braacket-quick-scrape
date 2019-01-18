module.exports = class Player {
  constructor(id, name, twitter, region, character_1, character_2) {
    this.id = id;
    this.name = name;
    this.twitter = twitter;
    this.region = region;
    this.character_1 = character_1;
    this.character_2 = character_2;
    this.head2head = {};
  }

  addMatch(against, won) {
    console.log(against);
    if(!this.head2head[against]) {
      this.head2head[against] = { won: 0, lost: 0 }
    }

    if(won) {
      this.head2head[against].won = this.head2head[against].won + 1
    } else {
      this.head2head[against].lost = this.head2head[against].lost + 1
    }
  }
}