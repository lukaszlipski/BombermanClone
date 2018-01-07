#version 300 es

in vec2 aPosition;
in vec2 aTexCoord;
in vec2 aOffset;
in float aTex;

uniform mat4 uProjection;
uniform mat4 uTranslation;
uniform mat4 uScale;

out vec2 fsTexCoord;
out float fsTex;

void main()
{
    vec4 Pos = uScale * vec4(aPosition,0,1);
    Pos.xy += aOffset;
    gl_Position = uProjection * uTranslation * Pos;

    fsTexCoord = aTexCoord;
    fsTex = aTex;
}