"use strict";

let Core = {
    Canvas : null,
    Context : null,
    ClientSocket : null,
    DeltaTime : null,
    Width : -1,
    Height : -1,
    KeyboardKeys : new Array(233),
    MouseKeys : new Array(3),
    ProjectionMatrix : null,
    PlayerIndex : -1,
    ServerStatus : null,
    Bombs : [],
    MapLoadedCb : null,

    InitWebGL : function(canvasName) {
        // Init webgl context
        Core.Canvas = document.getElementById(canvasName);
        Core.Width = Core.Canvas.clientWidth;
        Core.Height = Core.Canvas.clientHeight;

        Core.Context = Core.Canvas.getContext('webgl2');
        if(!Core.Context)
        {
            console.log('WebGL2 is not supported by current web browser');
            return false;
        }
        console.log('WebGL Loaded');

        Core.Context.viewport(0, 0, Core.Width, Core.Height);
        this.ProjectionMatrix = GetOrthoProjection(0 ,100 ,0 , Core.Width ,0 ,Core.Height);
        return true;
    },

    InitWebSocket : function() {
        Core.ClientSocket = new WebSocket('ws://localhost:8080');
        Core.ClientSocket.onopen = event => {
            console.log('WebSocket Connected');
            Core.ClientSocket.send("HI"); 
            //Core.ClientSocket.close();
        };
        Core.ClientSocket.onerror = error => {
            console.log(error);
        };
        Core.ClientSocket.onmessage = message => {

            let data = message.data.split('|');
            switch(data[0]) {
                case 'STR':
                {
                    window.requestAnimationFrame(Frame);
                    break;
                }
                case 'WLC':
                {
                    this.PlayerIndex = data[1];
                    break;
                }
                case 'UPD':
                {
                    this.ServerStatus = data[1] + '|' + data[2] + '|' + data[3] + '|' + data[4];
                    break;
                }
                case 'BMB':
                {
                    //console.log(data.length);
                    for(let i=1;i<data.length;i++) {
                        this.Bombs.push(data[i]);
                    }
                    break;
                }
                case 'MAP':
                {
                    this.Map = data[1];
                    if(this.MapLoadedCb && {}.toString.call(this.MapLoadedCb) === '[object Function]') {
                        this.MapLoadedCb(data[1],data[2],data[3]);     
                    }
                    break;
                }
                default:
                {
                    console.error('Bad header');
                }
            }

        };
        return true;
    },

    InitControls : function() {
        
        for(let i=0; i<this.KeyboardKeys.length;++i) {
            this.KeyboardKeys[i] = 0;
        }

        for(let i=0; i<this.MouseKeys.length;++i) {
            this.MouseKeys[i] = 0;
        }

        document.addEventListener('keydown', (event)=>{
            this.KeyboardKeys[event.keyCode] = 1;
        }, false);

        document.addEventListener('keyup', (event)=>{
            this.KeyboardKeys[event.keyCode] = 0;
        }, false);

        document.addEventListener('mousedown', (event)=>{
            this.MouseKeys[event.button] = 1;
        }, false);
        document.addEventListener('mouseup', (event)=>{
            this.MouseKeys[event.button] = 0;
        }, false);

    },

    IsKeyPressed : function(key) {
        return this.KeyboardKeys[key];
    },

    IsMousePressed : function(btn) {
        return this.MouseKeys[btn];
    },

}



// Key & mouse defines
let MouseButton = {
    Left : 0,
    Middle : 1,
    Right : 2
};

let KeyboardKey = {
        Backspace : 8,
        Tab : 9,
        Enter : 13,
        Shift : 16,
        Ctrl : 17,
        Alt : 18,
        Pause : 19,
        CapsLock : 20,
        Esc : 27,
        Space : 32,
        PageUp : 33,
        PageDown : 34,
        End : 35,
        Home : 36,
        Left : 37,
        Up : 38,
        Right : 39,
        Down : 40,
        Insert : 45,
        Delete : 46,
        Zero : 48,
        One : 49,
        Two : 50,
        Three : 51,
        Four : 52,
        Five : 53,
        Six : 54,
        Seven : 55,
        Eight : 56,
        Nine : 57,
        A : 65,
        B : 66,
        C : 67,
        D : 68,
        E : 69,
        F : 70,
        G : 71,
        H : 72,
        I : 73,
        J : 74,
        K : 75,
        L : 76,
        M : 77,
        N : 78,
        O : 79,
        P : 80,
        Q : 81,
        R : 82,
        S : 83,
        T : 84,
        U : 85,
        V : 86,
        W : 87,
        X : 88,
        Y : 89,
        Z : 90,
        LeftWindow : 91,
        RightWindow : 92,
        Select : 93,
        Numpad : {
            Zero : 96,
            One : 97,
            Two : 98,
            Three : 99,
            Four : 100,
            Five : 101,
            Six : 102,
            Seven : 103,
            Eight : 104,
            Nine : 105,
            Multiply : 106,
            Add : 107,
            Subtract : 109,
            Point : 110,
            Divide : 111
        },
        F1 : 112,
        F2 : 113,
        F3 : 114,
        F4 : 115,
        F5 : 116,
        F6 : 117,
        F7 : 118,
        F8 : 119,
        F9 : 120,
        NumLock : 144,
        ScrollLock : 145,
        SemiColon : 186,
        EqualSign : 187,
        Comma : 188,
        Dash : 189,
        Period : 190,
        ForwardSlash : 191,
        GraveAccent : 192,
        OpenBracket : 219,
        BackSlash : 220,
        CloseBracket : 221,
        SingleQuote : 222
}