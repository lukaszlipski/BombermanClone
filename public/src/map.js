class Map {
    constructor(tileSizeX,tileSizeY) {
        this.TileSizeX = tileSizeX;
        this.TileSizeY = tileSizeY;
        this.SizeX = -1;
        this.SizeY = -1;
        this.Background = new BackgroundSprite(this.TileSizeX,this.TileSizeY);
        this.Destroyables = [];
        this.Map = null;

        Core.MapLoadedCb = (sizeX,sizeY,map) => {
            this.SizeX = sizeX;
            this.SizeY = sizeY;
            let data = map.split(',');
            this.Map = new Array(this.SizeX);
            for(let i=0;i<data.length;++i){
                let y = i%this.SizeY; 
                let x = Math.floor(i/this.SizeY);
                if(y == 0) {
                    this.Map[x] = new Array(this.SizeY);
                }
                this.Map[x][y] = data[i];
            }
            this.ProcessMap();
        }
    }

    Draw() {
        this.Background.Draw();
        this.Destroyables.forEach((obj)=>{
            if(obj != null) {
                obj.Draw();
            }
        });
    }

    ProcessMap() {

        let offsets = [];
        for(let x=0;x<this.SizeX;++x) {
            for(let y=0;y<this.SizeY;++y) {
                let tile = this.Map[x][y];

                offsets.push(x * this.TileSizeX);
                offsets.push(y * this.TileSizeY);
                if(tile == 48 || tile == 57 || tile == 50) {
                    offsets.push(0);
                } else if (tile == 49) {
                    offsets.push(1);
                } else {
                    console.log('Bad number in map: ' + tile + '. On index X: ' + x + ' Y: ' + y);
                    offsets.push(0);
                }

                if(tile == 50) {
                    let destroyable = new Destroyable(x,y,this.TileSizeX);
                    this.Destroyables.push(destroyable);
                }
            }   
        }

        this.Background.SetData(offsets);
    }

    DestroyDestroyable(x,y) {
        this.Destroyables.forEach((destroyable,index) => {
            if(destroyable && destroyable.TileX == x && destroyable.TileY == y) {
                delete this.Destroyables[index];
                this.Destroyables[index] = null;
            }
        });
    }
}