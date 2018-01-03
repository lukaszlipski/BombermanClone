#version 300 es

precision mediump float;

out vec4 Color;
in vec3 fsColor;

void main()
{
    Color = vec4(fsColor,1.0f);
}