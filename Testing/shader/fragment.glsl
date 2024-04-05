precision highp float;

uniform vec3 lightSrc;
uniform sampler2D texture;

varying vec3 fPosition;
varying vec3 fNormal;
varying vec2 vUv;

void main() {
    vec3 ambientColor = vec3(0.2, 0.2, 0.2);
    vec3 lightColor = vec3(1.0, 1.0, 1.0);
    vec3 norm = normalize(fNormal);
    vec3 lightDir = normalize(lightSrc - fPosition);

    vec3 ambient = ambientColor;
    float diff = max(dot(norm, lightDir), 0.0);

    // use stepped lighting to get more stylized effect
    if(diff > 0.5)
        diff = 1.0;
    else if(diff > 0.2)
        diff = 0.5;
    else
        diff = 0.2;
    vec3 diffuse = diff * lightColor;

    // sample texture color
    vec4 texColor = texture2D(texture, vUv);
    vec3 finalColor = (ambient + diffuse) * texColor.rgb;

    // edge detection based on normals
    float edgeWidth = 1.5;
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