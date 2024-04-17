// fragement shader
precision highp float;

uniform vec3 lightSrc;
uniform sampler2D texture;

varying vec3 fPosition;
varying vec3 fNormal;
varying vec2 vUv;

void main() {
    // Lighting calculations
    vec3 norm = normalize(fNormal);
    vec3 lightDir = normalize(lightSrc - fPosition);
    vec3 ambientColor = vec3(1.0, 1.0, 1.0);
    vec3 lightColor = vec3(1.0, 1.0, 1.0);

    // Toon shading 
    float intensity;
    intensity = dot(lightDir, norm);

    vec3 color;
    if(intensity > .8) {
        color = vec3(0.7);
    } else if(intensity > .7) {
        color = vec3(0.6);
    } else if(intensity > .5) {
        color = vec3(0.5);
    } else {
        color = vec3(0.45);
    }

    // ambient and diffuse components
    vec3 ambient = ambientColor * vec3(1.0);
    vec3 diffuse = color.rgb * lightColor;

    // Sample texture color
    vec4 texColor = texture2D(texture, vUv);
    vec3 finalColor = (ambient + diffuse) * texColor.rgb;

    // edge detection based on normals
    float edgeWidth = 0.8;
    float edgeThreshold = 0.5;
    float edgeIntensity = 1.0;

    // calculate edge by normal direction change
    float edgeFactor = dot(norm, vec3(0.0, 0.0, 1.0));
    edgeFactor = 1.0 - smoothstep(edgeThreshold - edgeWidth, edgeThreshold + edgeWidth, edgeFactor);

    // mix object color and outline color by edge detection
    vec3 outlineColor = vec3(0.0, 0.0, 0.0);
    finalColor = mix(finalColor, outlineColor, edgeFactor * edgeIntensity);

    gl_FragColor = vec4(finalColor, texColor.a);
}