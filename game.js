const Player = require('./player');

class Game {
    constructor(data) {
        this.Players = new Array(4);
        this.Players.forEach((val,index)=>{
            this.Players[index] = null;
        });

        this.Size = 0;
        this.Walls = [];
        this.Spawns = [];
        this.Map = data;
        this.ProcessMap(data);

        this.TileSize = 1024.0/20.0;
        this.PlayerSize = this.TileSize/2;

        this.IsGameRunning = false;
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

    AddPlayer(player) {
        if(player instanceof Player && this.Size <= 4 && !this.IsGameRunning) {
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
        this.Players.forEach((player)=>{

            player.Socket.send('STR|');
            player.Socket.send('MAP|' + this.Map);

            let x = this.Spawns[player.CurrentIndex].PosX * this.TileSize;
            let y = this.Spawns[player.CurrentIndex].PosY * this.TileSize;

            player.SetPosition(x,y);

        });
        this.IsGameRunning = true;
    }

    Update(delta) {
        if(!this.IsGameRunning) { return; }
 
        let update = 'UPD';    
        this.Players.forEach((player)=>{
            if(player == null) return;

            player.Input.forEach((input)=>{
                let deltaPos = [0,0];
                if(input[0] == '1') {
                    deltaPos[0] += 1;
                }
                if(input[1] == '1') {
                    deltaPos[0] -= 1;
                }
                if(input[2] == '1') {
                    deltaPos[1] -= 1;
                }
                if(input[3] == '1') {
                    deltaPos[1] += 1;
                }
                if(input[4] == '1') {
                    console.log('bomb form player ' + player.CurrentIndex);
                }
                let vLength = Math.sqrt( deltaPos[0] * deltaPos[0] + deltaPos[1] * deltaPos[1] );

                if(vLength != 0) // else no move this tick
                {
                    let xPos = player.CurrentPosition[0] + (deltaPos[0] / vLength) * delta * player.Velocity;
                    let yPos = player.CurrentPosition[1] + (deltaPos[1] / vLength) * delta * player.Velocity;
                    let CollsionX = false;
                    let CollsionY = false;

                    this.Walls.forEach((wall)=>{
                        if(AABB(xPos,player.CurrentPosition[1],this.PlayerSize,this.PlayerSize, 
                                wall.PosX * this.TileSize, wall.PosY * this.TileSize, this.TileSize, this.TileSize)) {
                            CollsionX = true;
                        }
                        if(AABB(player.CurrentPosition[0],yPos,this.PlayerSize,this.PlayerSize, 
                                wall.PosX * this.TileSize, wall.PosY * this.TileSize, this.TileSize, this.TileSize)) {
                            CollsionY = true;
                        }
                    });

                    if(!CollsionY) {
                        player.CurrentPosition[1] = yPos;
                    }
                    if(!CollsionX) {
                        player.CurrentPosition[0] = xPos;
                    }
  
                }
            });
    
            // Clear input
            player.Input = [];
    
            update += '|' + player.CurrentIndex + ',' + player.CurrentPosition[0] + ',' + player.CurrentPosition[1];
            
        });

        this.Players.forEach( (player,index,array) => {
            if(player !== null) 
            {
                try {
                    player.Socket.send(update);
                } catch(err) {
                    //console.log('Websocket error: %s', err); // WTF?
                }
            }
        });
    }

}

function AABB(x1,y1,width1,height1, x2,y2,width2,height2) {
    if(x1 < x2 + width2 && x1 + width1 > x2 && y1 < y2 + height2 && y1 + height1 > y2) {
        return true;
    }
    return false;
}

module.exports = Game;