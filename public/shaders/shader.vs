#version 300 es

in vec2 aPosition;
in vec2 aTexCoord;
in float aOffset;

out vec3 fsColor;

void main()
{
    gl_Position = vec4(aPosition + aOffset,0,1);
    fsColor = vec3(aTexCoord.x);
}