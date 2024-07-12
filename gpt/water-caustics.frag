#version 330
#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_resolution;

float random(vec2 co) {
    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    float time = u_time;
    // Calculate the time-dependent offset for animation
    float offset = time * 0.1;
    
    // Calculate the coordinates for the caustics pattern
    vec2 patternCoord = uv * 10.0 + vec2(offset, offset * 0.5);
    
    // Generate a random value based on the pattern coordinates
    float noise = random(patternCoord);
    
    // Apply distortion to the UV coordinates using the random value
    vec2 distortedUV = uv + vec2(sin(time * 0.1), cos(time * 0.05)) * noise * 0.01;
    
    // Calculate the color for the water caustics
    vec3 causticsColor = vec3(0.0, 0.5, 1.0) * (1.0 - noise * 0.2);
    
    // Output the final color
    gl_FragColor = vec4(causticsColor, 1.0);
}

