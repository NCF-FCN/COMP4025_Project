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
    vec4 color;
    if(intensity > 0.95)
        color = vec4(1.0, 1.0, 1.0, 1.0);
    else if(intensity > 0.5)
        color = vec4(0.6, 0.6, 0.6, 1.0);
    else if(intensity > 0.25)
        color = vec4(0.4, 0.4, 0.4, 1.0);
    else
        color = vec4(0.2, 0.2, 0.2, 1.0);

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