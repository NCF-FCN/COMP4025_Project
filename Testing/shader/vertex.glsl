// vertex shader
precision highp float;

varying vec3 fNormal;
varying vec3 fPosition;
varying vec2 vUv;
void main()
{
 fNormal = normalize(normalMatrix * normal);
 vec4 pos = modelViewMatrix * vec4(position, 1.0);
 fPosition = pos.xyz;
 vUv = uv;
 gl_Position = projectionMatrix * pos;
} 