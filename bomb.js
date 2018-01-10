
class Bomb {
    constructor(posX, posY, index) {
        this.Index = index;
        this.Time = 2;
        this.PosX = posX;
        this.PosY = posY;
        this.Size = (1024.0/20.0)/2.0;
        this.IsNew = true;
        this.PowerSizeInTiles = 7;
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

}

module.exports = Bomb;