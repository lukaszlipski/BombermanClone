
let MathLib = {
    AABB : function(x1,y1,width1,height1, x2,y2,width2,height2) {
        if(x1 < x2 + width2 && x1 + width1 > x2 && y1 < y2 + height2 && y1 + height1 > y2) {
            return true;
        }
        return false;
    }
}

module.exports = MathLib;