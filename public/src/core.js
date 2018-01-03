"use strict";

let Core = {
    Canvas : null,
    Context : null,
    ClientSocket : null,
    DeltaTime : null,
    Width : -1,
    Height : -1,

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
            console.log(message.data);    
        };
        return true;
    }

}

