#version 300 es

in vec2 aPosition;
in vec2 aTexCoord;
in vec2 aOffset;

uniform mat4 uProjection;
uniform mat4 uTranslation;
uniform mat4 uScale;
uniform float uTest;
uniform vec4 uTest2;

out vec3 fsColor;

void main()
{
    vec4 Pos = uScale * vec4(aPosition,0,1);
    Pos.xy += aOffset;
    gl_Position = uProjection * uTranslation * Pos;
    fsColor = vec3(aTexCoord,1);
}