

class Bomb {
    constructor(tileX,tileY,tileSize) {
        this.PosX = tileX * tileSize;
        this.PosY = tileY * tileSize;
        this.Graphics = new Sprite(tileSize,tileSize,'bomb.png');
        this.Graphics.SetPosition(this.PosX,this.PosY);
    }

    Draw() {
        this.Graphics.Draw();
    }

    Destroy() {
        delete this.Graphics;
        // TODO: make explosion
    }
}

class Destroyable {
    constructor(tileX,tileY,tileSize) {
        this.TileX = tileX;
        this.TileY = tileY;
        this.PosX = tileX * tileSize;
        this.PosY = tileY * tileSize;
        this.Graphics = new Sprite(tileSize,tileSize,'barrel.png');
        this.Graphics.SetPosition(this.PosX,this.PosY);
    }

    Draw() {
        this.Graphics.Draw();
    }

    Destroy() {
        delete this.Graphics;
        // TODO: particles ?
    }
}