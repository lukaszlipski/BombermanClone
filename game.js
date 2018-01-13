const Player = require('./player');
const Bomb = require('./bomb');

class Game {
    constructor(data) {
        this.Players = new Array(4);
        this.Players.forEach((val,index)=>{
            this.Players[index] = null;
        });
        this.Bombs = [];
        this.Size = 0;
        this.SizeX = -1;
        this.SizeY = -1;
        this.Spawns = [];
        this.Map = data;
        this.Tiles;
        this.ProcessMap(data);

        this.TileSize = 1024.0/20.0;

        this.IsGameRunning = false;
    }

    ProcessMap(data) {
        this.Spawns = [];

        let y = 0;
        let x = 0;

        for(let i=0;i<data.length; ++i) {
            
            switch(data[i]) {
                case 13: {
                    if(this.SizeX == -1) {
                        this.SizeX = i;
                    }
                    continue;
                }
                case 10: {
                    y++;
                    x = 0;
                    continue;
                }
                case 57: {
                    this.Spawns.push({PosX : x, PosY : y});
                    break;
                }
                case 48:
                case 49:
                case 50: {
                    break;
                }
                default: {
                    console.warn('Bad number in map: ' + data[i]);
                }
            }
            x++;
        }

        this.SizeY = y;

        let map = new Array(this.SizeX);
        for(let i=0,x=0,y=0;i<data.length; ++i) {
            
            switch(data[i]) {
                case 48:
                case 49:
                case 50:
                case 51:
                case 52:
                case 53:
                case 54:
                case 55:
                case 56:
                case 57: {

                    if(typeof map[x] === 'undefined') {
                        map[x] = new Array(this.SizeY);
                    }

                    map[x++][y] = data[i];
                    break;
                }
                case 13: {
                    y++;
                    x = 0;
                    break;
                }
            }
        }

        this.Tiles = map;
    }

    AddPlayer(player) {
        if(player instanceof Player && this.Size <= 4) {
            let index = 0;
            for(let i=0;i<this.Players.length;++i) {
                if(this.Players[i] == null) {
                    index = i;
                    player.CurrentGame = this;
                    player.CurrentIndex = index; 
                    this.Players[i] = player;
                    break;
                }
            }

            player.Socket.send('WLC|' + index);
            this.Size++;

            return true;
        }
        return false;
    }

    RemovePlayer(player) {
        if(player instanceof Player && player.CurrentGame == this) {
            for(let i=0;i<this.Players.length;++i) {
                if(this.Players[i] == player) {
                    player.CurrentIndex = -1;
                    player.CurrentGame = null;
                    this.Players[i] = null;
                    break;
                }
            }

            this.Size--;

            return true;
        }
        return false;
    }

    StartGame() {
        //if(this.IsGameRunning == false) {
            this.Players.forEach((player)=>{
    
                player.Socket.send('STR|');
                player.Socket.send('MAP|' + this.SizeX + '|' + this.SizeY + '|' + this.Tiles);
    
                let x = this.Spawns[player.CurrentIndex].PosX * this.TileSize;
                let y = this.Spawns[player.CurrentIndex].PosY * this.TileSize;
    
                player.SetPosition(x,y);
    
            });
            this.IsGameRunning = true;
        //}
    }

    Update(delta) {
        if(!this.IsGameRunning) { return; }
 
        let update = 'UPD';    
        this.Players.forEach((player)=>{
            if(player != null) {
                player.Update(delta);
                update += '|' + player.CurrentIndex + ',' + player.CurrentPosition[0] + ',' + player.CurrentPosition[1];
            }

        });

        let bombs = 'BMB';
        this.Bombs.forEach((bomb,index)=>{
            if(bomb != null) {
                bomb.Update(delta);
                if(bomb.GetIsNew()) {
                    bombs += '|' + bomb.Index + ',' + 0 + ',' + bomb.TileX + ',' + bomb.TileY;
                }

                if(bomb.IsExploding()) {
                    let data = bomb.CalculateExplosion(this, this.SizeX, this.SizeY);

                    // TODO : Collsion detection with players

                    bombs += '|' + bomb.Index + ',' + 1 + ',' + data;
                    delete this.Bombs[index];
                    this.Bombs[index] = null;

                }

            }
        });

        this.Players.forEach( (player,index,array) => {
            if(player !== null) 
            {
                try {
                    player.Socket.send(update);
                    player.Socket.send(bombs);
                } catch(err) {
                    //console.log('Websocket error: %s', err); // WTF?
                }
            }
        });
    }

    AddBomb(x, y) {
        let index = -1;
        for(let i=0; i<this.Bombs.length;++i) {
            if(this.Bombs[i] == null) {
                index = i;
                break;
            }
        }
        if(index == -1) {
            this.Bombs.push(new Bomb(x, y, this.Bombs.length, this.TileSize));
        } else {
            this.Bombs[index] = new Bomb(x, y, index, this.TileSize);
        }
    }

}



module.exports = Game;