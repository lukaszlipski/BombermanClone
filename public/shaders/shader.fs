#version 300 es

precision mediump float;

in vec2 fsTexCoord;

uniform sampler2D uTex;
uniform sampler2D uTex2;

out vec4 Color;

void main()
{
    Color = texture(uTex,fsTexCoord) * texture(uTex2,fsTexCoord);
}