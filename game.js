

class Game {
    constructor(data) {
        this.Players = [];
        this.Size = 0;
        this.Walls = [];
        this.Spawns = [];
        this.ProcessMap(data);
        this.TileSize = 1024.0/20.0;
    }

    ProcessMap(data) {
        this.Walls = [];
        this.Spawns = [];

        let y = 0;
        let x = 0;

        for(let i=0;i<data.length; ++i) {
            
            switch(data[i]) {
                case 13: {
                    continue;
                }
                case 10: {
                    y++;
                    x = 0;
                    continue;
                }
                case 49: {
                    this.Walls.push({PosX : x, PosY : y});
                    break;
                }
                case 57: {
                    this.Spawns.push({PosX : x, PosY : y});
                    break;
                }
                case 0, 48: {
                    break;
                }
                default: {
                    console.warn('Bad number in map: ' + data[i]);
                }
            }
            x++;
        }
        
    }
}

module.exports = Game;