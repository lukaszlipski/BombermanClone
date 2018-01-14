"use strict";

Core.InitWebGL('GameCanvas');
Core.InitWebSocket();
Core.InitControls();
ShaderProgramManager.Init();
TexManager.Init();

let TileSize = Core.Width/20; // 20x15

let map = new Map(TileSize,TileSize);
let bombs = [];

let ExplosionManager = {
    Explosions : [],
    Add : function(explosion) {
        let index = -1;
        for(let i=0; i<this.Explosions.length; ++i) {
            if(this.Explosions[i] == null) {
                index = i;
                break;
            }
        }
        if(index > 0) {
            this.Explosions[index] = explosion;
        } else {
            this.Explosions.push(explosion);
        }
    },
    Update : function(delta) {
        this.Explosions.forEach((exp,index)=>{
            if(exp != null) {
                exp.Update(delta);
                if(!exp.IsValid) {
                    delete this.Explosions[index];
                    this.Explosions[index] = null;
                }
            }
        });
    },

    Draw : function() {
        this.Explosions.forEach((exp,index)=>{
            if(exp != null) {
                exp.Draw();
            }
        });
    }
}

let deltaTime = 0;
let lastTime = 0;

let players = new Array(4);
for(let i=0; i<4;++i) {
    players[i] = new Player(0, 0, TileSize/2);
}

function Frame(time) {
    window.requestAnimationFrame(Frame);
    
    deltaTime = (time - lastTime) / 1000;
    lastTime = time;

    let actions = '00000';
    if(Core.IsKeyPressed(KeyboardKey.D)) {
        actions = ReplaceCharAt(actions,0,'1');
    }
    if(Core.IsKeyPressed(KeyboardKey.A)) {
        actions = ReplaceCharAt(actions,1,'1');
    }
    if(Core.IsKeyPressed(KeyboardKey.W)) {
        actions = ReplaceCharAt(actions,2,'1');
    }
    if(Core.IsKeyPressed(KeyboardKey.S)) {
        actions = ReplaceCharAt(actions,3,'1');
    }
    if(Core.IsKeyPressed(KeyboardKey.Space)) {
        actions = ReplaceCharAt(actions,4,'1'); // TODO: add delay
    }
    
    Core.ClientSocket.send('ACT' + actions);

    if(Core.ServerStatus != null) {
        let playersStatus = Core.ServerStatus.split('|');
        playersStatus.forEach(element => {
            
            let status = element.split(',');

            if(status[0] != 'undefined') {
                players[status[0]].SetPosition(status[1],status[2]);
                if(status[3] == 'false') {
                    let CurrentPlayer = players[status[0]];
                    CurrentPlayer.Kill();
                }
            }
            
        });
        Core.ServerStatus = null; // Clear

    }

    Core.Bombs.forEach((bomb)=>{
        if(bomb != null) {
            let Info = bomb.split(',');
            if(Info[1] == 0) { // new bomb
                bombs[Info[0]] = new Bomb(Info[2],Info[3],TileSize);
            } else if(Info[1] == 1) { // bomb exploded
                
                let CurrentBomb = bombs[Info[0]];
                let Xplus = parseInt(Info[2][0]);
                let Xminus = parseInt(Info[2][1]);
                let Yplus = parseInt(Info[2][2]);
                let Yminus = parseInt(Info[2][3]);
                let ExplosionCount = Xplus + Xminus + Yplus + Yminus;

                for(let i=0;i<=Xplus;++i) {
                    ExplosionManager.Add(new Explosion( parseInt(CurrentBomb.TileX) + i,CurrentBomb.TileY,TileSize));
                }
                for(let i=1;i<=Xminus;++i) {
                    ExplosionManager.Add(new Explosion( parseInt(CurrentBomb.TileX) - i,CurrentBomb.TileY,TileSize));
                }
                for(let i=1;i<=Yplus;++i) {
                    ExplosionManager.Add(new Explosion( CurrentBomb.TileX,parseInt(CurrentBomb.TileY) + i,TileSize));
                }
                for(let i=1;i<=Yminus;++i) {
                    ExplosionManager.Add(new Explosion( CurrentBomb.TileX,parseInt(CurrentBomb.TileY) - i,TileSize));
                }

                let coords = Info[3].split('.');
                coords.forEach((coord)=>{
                    let xy = coord.split('-');
                    if(xy.length > 0) {
                        map.DestroyDestroyable(xy[0], xy[1]);
                    }
                });


                CurrentBomb.Destroy();
                delete bombs[Info[0]];
                CurrentBomb = null;
            }
        }
    });
    Core.Bombs = []; // Clear

    map.Draw();

    bombs.forEach((bomb)=>{
        if(bomb != null) {
            bomb.Draw();
        }
    });

    ExplosionManager.Update(deltaTime);
    ExplosionManager.Draw();

    players.forEach((player)=>{
        if(player != null) {
            player.Draw();
        }
    });

}

function ReplaceCharAt(string, index, char) {
    if(index >= string.length) return string;
    return string.substr(0,index) + char + string.substr(index+1);
}
