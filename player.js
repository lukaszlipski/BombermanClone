
class Player {
    constructor(socket, id) {
        this.ID = id;
        this.GameIndex = -1;
        this.Socket = socket;
        this.Input = [];
        this.CurrentPosition = [0,0];
        this.Velocity = 100;
        this.CurrentGame = null;
    }

    SetPosition(x,y) {
        this.CurrentPosition[0] = x;
        this.CurrentPosition[1] = y;
    }

}

module.exports = Player;