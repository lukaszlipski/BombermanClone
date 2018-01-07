#version 300 es

precision mediump float;

in vec2 fsTexCoord;
in float fsTex;

uniform sampler2D uTex;
uniform sampler2D uTex2;

out vec4 Color;

void main()
{
    Color = texture(uTex,fsTexCoord) * (1.0 - fsTex) + texture(uTex2,fsTexCoord) * fsTex;
}