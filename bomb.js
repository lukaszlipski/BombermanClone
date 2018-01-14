const MathLib = require('./math');

class Bomb {
    constructor(posX, posY, index, tileSize) {
        this.Index = index;
        this.Time = 2;
        this.PosX = posX;
        this.PosY = posY;
        this.TileX = Math.floor(this.PosX/tileSize);
        this.TileY = Math.floor(this.PosY/tileSize);
        this.Size = 1024.0/20.0;
        this.IsNew = true;
        this.PowerSizeInTiles = 5;
    }

    Update(delta) {
        this.Time -= delta;
    }

    IsExploding() {
        if(this.Time <= 0) {
            return true;
        }
        return false;
    }

    GetIsNew() {
        let status = this.IsNew;
        this.IsNew = false;
        return status;
    }

    CalculateExplosion(game, maxTileX, maxTileY, players) {
        // TODO: simplify this function
        let MaxExplosion = (this.PowerSizeInTiles - 1).toString();
        let explosion = MaxExplosion + MaxExplosion + MaxExplosion + MaxExplosion;
        let destroyed = '';
        for(let x = 1, minus = false, plus = false; x<this.PowerSizeInTiles; ++x) {
            if(this.TileX + x < maxTileX && !plus) {
                let tile = game.Tiles[this.TileX + x][this.TileY];
                if(tile == 49) {
                    explosion = ReplaceCharAt(explosion,0,x - 1);
                    plus = true;
                } else if (tile == 50) {
                    explosion = ReplaceCharAt(explosion,0,x);
                    game.Tiles[this.TileX + x][this.TileY] = 48;
                    destroyed += (this.TileX + x) + '-' + this.TileY + '.';
                    // TODO: spawn upgrade
                    plus = true;
                }
            }
            if(this.TileX - x >= 0 && !minus) {
                let tile = game.Tiles[this.TileX - x][this.TileY];
                if(tile == 49) {
                    explosion = ReplaceCharAt(explosion,1,x - 1);
                    minus = true;
                } else if (tile == 50) {
                    explosion = ReplaceCharAt(explosion,1,x);
                    game.Tiles[this.TileX - x][this.TileY] = 48;
                    destroyed += (this.TileX - x) + '-' + this.TileY + '.';
                    // TODO: spawn upgrade
                    minus = true;
                }
            }

            // Check if player is near to the bomb explosion
            if(!plus) {
                players.forEach((player)=>{
                    this.CheckCollisionWithPlayer(player,(this.TileX + x) * this.Size, this.TileY * this.Size);
                });
            }
            if(!minus) {
                players.forEach((player)=>{
                    this.CheckCollisionWithPlayer(player,(this.TileX - x) * this.Size, this.TileY * this.Size);
                });
            }
        }
        for(let y = 1, minus = false, plus = false; y<this.PowerSizeInTiles; ++y) {
            if(this.TileY + y < maxTileY && !plus) {
                let tile = game.Tiles[this.TileX][this.TileY + y];
                if(tile == 49) {
                    explosion = ReplaceCharAt(explosion,2,y - 1);
                    plus = true;
                } else if (tile == 50) {
                    explosion = ReplaceCharAt(explosion,2,y);
                    game.Tiles[this.TileX][this.TileY + y] = 48;
                    destroyed += this.TileX + '-' + (this.TileY + y) + '.';
                    // TODO: spawn upgrade
                    plus = true;
                }
            }
            if(this.TileY - y >= 0 && !minus) {
                let tile = game.Tiles[this.TileX][this.TileY - y];
                if(tile == 49) {
                    explosion = ReplaceCharAt(explosion,3,y - 1);
                    minus = true;
                } else if (tile == 50) {
                    explosion = ReplaceCharAt(explosion,3,y);
                    game.Tiles[this.TileX][this.TileY - y] = 48;
                    destroyed += this.TileX + '-' + (this.TileY - y) + '.';
                    // TODO: spawn upgrade
                    minus = true;
                }
            }

            // Check if player is near to the bomb explosion
            if(!plus) {
                players.forEach((player)=>{
                    this.CheckCollisionWithPlayer(player,this.TileX * this.Size, (this.TileY + y) * this.Size);
                });
            }
            if(!minus) {
                players.forEach((player)=>{
                    this.CheckCollisionWithPlayer(player,this.TileX * this.Size, (this.TileY - y) * this.Size);
                });
            }
        }

        // Check if the player is in the same place as bomb
        players.forEach((player)=>{
            this.CheckCollisionWithPlayer(player,this.TileX * this.Size, this.TileY * this.Size);
        });

        return explosion + ',' + destroyed;
    }

    CheckCollisionWithPlayer(player,bombX,bombY) {
        if(player != null && player.IsAlive) {
                        
            let PlayerX = player.CurrentPosition[0];
            let PlayerY = player.CurrentPosition[1];
            let PlayerSize = player.PlayerSize;
            let CurrentExplosionX = bombX;
            let CurrentExplosionY = bombY;

            if(MathLib.AABB(PlayerX,PlayerY,PlayerSize,PlayerSize,CurrentExplosionX,CurrentExplosionY,this.Size,this.Size)) {
                player.IsAlive = false;
            }
        }
    }

}

function ReplaceCharAt(string, index, char) {
    if(index >= string.length) return string;
    return string.substr(0,index) + char + string.substr(index+1);
}


module.exports = Bomb;