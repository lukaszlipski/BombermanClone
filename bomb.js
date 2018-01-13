
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

    CalculateExplosion(game,maxTileX,maxTileY) {
        let explosion = '0000';
        let destroyed = '';
        // TODO: simplify this function
        for(let x = 1, minus = false, plus = false; x<this.PowerSizeInTiles; ++x) {
            if(this.TileX + x < maxTileX && !plus) {
                let tile = game.Tiles[this.TileX + x][this.TileY];
                if(tile == 49) {
                    explosion = ReplaceCharAt(explosion,0,x);
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
                    explosion = ReplaceCharAt(explosion,1,x);
                    minus = true;
                } else if (tile == 50) {
                    explosion = ReplaceCharAt(explosion,1,x);
                    game.Tiles[this.TileX - x][this.TileY] = 48;
                    destroyed += (this.TileX - x) + '-' + this.TileY + '.';
                    // TODO: spawn upgrade
                    minus = true;
                }
            }
        }
        for(let y = 1, minus = false, plus = false; y<this.PowerSizeInTiles; ++y) {
            if(this.TileY + y < maxTileY && !plus) {
                let tile = game.Tiles[this.TileX][this.TileY + y];
                if(tile == 49) {
                    explosion = ReplaceCharAt(explosion,2,y);
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
                    explosion = ReplaceCharAt(explosion,3,y);
                    minus = true;
                } else if (tile == 50) {
                    explosion = ReplaceCharAt(explosion,3,y);
                    game.Tiles[this.TileX][this.TileY - y] = 48;
                    destroyed += this.TileX + '-' + (this.TileY - y) + '.';
                    // TODO: spawn upgrade
                    minus = true;
                }
            }
        }
        return explosion + ',' + destroyed;
    }

}

function ReplaceCharAt(string, index, char) {
    if(index >= string.length) return string;
    return string.substr(0,index) + char + string.substr(index+1);
}


module.exports = Bomb;