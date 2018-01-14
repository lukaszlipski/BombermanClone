
class Entity {
    constructor(tileX, tileY, tileSize, texture) {
        this.TileSize = tileSize;
        this.TileX = tileX;
        this.TileY = tileY;
        this.PosX = tileX * tileSize;
        this.PosY = tileY * tileSize;
        this.Graphics = new Sprite(tileSize, tileSize, texture);
        this.Graphics.SetPosition(this.PosX,this.PosY);
    }

    Update(delta) {
        
    }

    SetTile(x,y) {
        this.TileX = x;
        this.TileY = y;
        this.PosX = this.TileX * this.TileSize;
        this.PosY = this.TileY * this.TileSize;
        this.Graphics.SetPosition(this.PosX,this.PosY);
    }

    SetPosition(x,y) {
        this.PosX = x;
        this.PosY = y;
        this.Graphics.SetPosition(x,y);
    }

    Draw() {
        this.Graphics.Draw();
    }

    Destroy() {
        delete this.Graphics;
    }
}

class Player extends Entity {
    constructor(tileX,tileY,tileSize) {
        super(tileX,tileY,tileSize, 'player.png');
    }
}


class Bomb extends Entity {
    constructor(tileX,tileY,tileSize) {
        super(tileX,tileY,tileSize, 'bomb.png');
    }
}

class Destroyable extends Entity {
    constructor(tileX,tileY,tileSize) {
        super(tileX,tileY,tileSize, 'barrel.png');
    }
}

class Explosion extends Entity {
    constructor(tileX, tileY, tileSize) {
        super(tileX,tileY,tileSize, 'explosion.png');
        this.MaxLifeTime = 0.5;
        this.CurrentLifeTime = 0;
        this.IsValid = true;
    }

    Update(delta) {
        this.CurrentLifeTime += delta;
        if(this.CurrentLifeTime >= this.MaxLifeTime) {
            this.IsValid = false;
        }
    }

    Destroy() {
        this.Destroy();
    }
}