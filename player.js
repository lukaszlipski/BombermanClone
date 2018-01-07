class Player {
    constructor(socket, index) {
        this.Index = index;
        this.Socket = socket;
        this.Input = [];
        this.CurrentPosition = [0,0];
        this.Velocity = [3,3];
    }

    SetPosition(x,y) {
        this.CurrentPosition[0] = x;
        this.CurrentPosition[1] = y;
    }
}

module.exports = Player;