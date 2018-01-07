"use strict";


let TexManager = {
    Textures : [],

    Init : function() {
        this.Textures = [];
    },

    AddImg : function(name,callback) {
        let image = new Image();
        image.onload = () => {

            for(let i=0;i<this.Textures.length;++i) {
                if(this.Textures[i].name == name) {
                    if(callback && {}.toString.call(callback) === '[object Function]')
                    {
                        callback(this.Textures[i].img);     
                        return;
                    }
                }
            }

            let tex = Core.Context.createTexture();
            Core.Context.bindTexture(Core.Context.TEXTURE_2D, tex);
            Core.Context.texImage2D(Core.Context.TEXTURE_2D, 0, Core.Context.RGBA, Core.Context.RGBA, Core.Context.UNSIGNED_BYTE, image);
            Core.Context.texParameteri(Core.Context.TEXTURE_2D, Core.Context.TEXTURE_WRAP_S, Core.Context.CLAMP_TO_EDGE);
            Core.Context.texParameteri(Core.Context.TEXTURE_2D, Core.Context.TEXTURE_WRAP_T, Core.Context.CLAMP_TO_EDGE);
            Core.Context.texParameteri(Core.Context.TEXTURE_2D, Core.Context.TEXTURE_MIN_FILTER, Core.Context.NEAREST);
            Core.Context.texParameteri(Core.Context.TEXTURE_2D, Core.Context.TEXTURE_MAG_FILTER, Core.Context.NEAREST);
            Core.Context.bindTexture(Core.Context.TEXTURE_2D, null);
            this.Textures.push({ name : name, img : tex });
            if(callback && {}.toString.call(callback) === '[object Function]')
            {
                callback(tex);     
            }
        }
        image.src = 'img/' + name;
    },

    FindImg : function(name,callback) {
        let result = null;
        for(let i=0;i<this.Textures.length;++i) {
            if(this.Textures[i].name == name) {
                result = this.Textures[i];
            }
        }

        if(result == null) {
            this.AddImg(name,callback);
        } else {
            callback(result.img);
        }

    }

}