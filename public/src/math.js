"use strict";

function GetOrthoProjection(f, n, l, r, t, b) {
    return [
         2/(r-l),      0,            0,           0,
         0,            2/(t-b),      0,           0,
         0,            0,           -2/(f-n),     0,
        -(r+l)/(r-l), -(t+b)/(t-b), -(f+n)/(f-n), 1
    ];
}

function GetIdentityMatrix() {
    return [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ];
}

function GetTranslation(x, y, z) {
    return [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        x, y, z, 1
    ];
}

function GetScale(x, y, z) {
    return [
        x, 0, 0, 0,
        0, y, 0, 0,
        0, 0, z, 0,
        0, 0, 0, 1
    ];
}