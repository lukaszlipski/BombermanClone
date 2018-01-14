const MathLib = require('./math');
const Bomb = require('./bomb');

let BombDelay = 2;

class Player {
    constructor(socket, id) {
        this.ID = id;
        this.GameIndex = -1;
        this.Socket = socket;
        this.Input = [];
        this.CurrentPosition = [0,0];
        this.Velocity = 100;
        this.BombPlaced = 0;
        this.CurrentGame = null;
        this.PlayerSize = (1024.0/20.0)/2.0;
        this.IsAlive = true;
        this.Observer = false;
    }

    SetPosition(x,y) {
        this.CurrentPosition[0] = x;
        this.CurrentPosition[1] = y;
    }

    CanPlaceBomb() {
        if(this.BombPlaced <= 0) {
            return true;
        }
        return false;
    }

    UpdateBombTime(delta) {
        if(this.BombPlaced > 0) {
            this.BombPlaced -= delta;
        }
    }

    PlaceBomb() {
        this.BombPlaced = BombDelay;
        this.CurrentGame.AddBomb(this.CurrentPosition[0],this.CurrentPosition[1]);
    }

    Update(delta) {

        this.UpdateBombTime(delta);

        let deltaPos = [0,0];
        this.Input.forEach((input)=>{
            
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
                if(this.CanPlaceBomb()) {
                    this.PlaceBomb();
                }
            }
        });

        let vLength = Math.sqrt( deltaPos[0] * deltaPos[0] + deltaPos[1] * deltaPos[1] );

        if(vLength != 0) { // else no move in this tick

            let xPos = this.CurrentPosition[0] + (deltaPos[0] / vLength) * delta * this.Velocity;
            let yPos = this.CurrentPosition[1] + (deltaPos[1] / vLength) * delta * this.Velocity;
            let CollsionX = false;
            let CollsionY = false;

            for(let x = 0; x < this.CurrentGame.SizeX; ++x) {
                for(let y = 0; y < this.CurrentGame.SizeY; ++y) {
                    let tile = this.CurrentGame.Tiles[x][y];

                    if(tile == 49 || tile == 50) {
                        if(MathLib.AABB(xPos,this.CurrentPosition[1],this.PlayerSize,this.PlayerSize, 
                            x * this.CurrentGame.TileSize, y * this.CurrentGame.TileSize, this.CurrentGame.TileSize, this.CurrentGame.TileSize)) {
                        CollsionX = true;
                        }
                        if(MathLib.AABB(this.CurrentPosition[0],yPos,this.PlayerSize,this.PlayerSize, 
                                x * this.CurrentGame.TileSize, y * this.CurrentGame.TileSize, this.CurrentGame.TileSize, this.CurrentGame.TileSize)) {
                            CollsionY = true;
                        }
                    }
                    
                }   
            }


            if(!CollsionY) {
                this.CurrentPosition[1] = yPos;
            }
            if(!CollsionX) {
                this.CurrentPosition[0] = xPos;
            }

        }

        // Clear input
        this.Input = [];

    }

    

}

module.exports = Player;