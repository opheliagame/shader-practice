#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
uniform sampler2D u_texture_0;

float random(float x) {
    float y = fract(sin(x)*10000.0);
    return y;
}

float noise(float x) {
    float i = floor(x);  // integer
    float f = fract(x);  // fraction
    //float u = f * f * (3.0 - 2.0 * f ); // custom cubic curve
    //u = sin(f) + cos(f) * 2.0;
    //float y = mix(rand(i), rand(i + 1.0), u);
    float y = mix(random(i), random(i + 1.0), smoothstep(0.,1.,f));
    //y = rand(i);
    return y;
}

// 2D Random
float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))
                 * 43758.5453123);
}

// 2D Noise based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    // Smooth Interpolation

    // Cubic Hermine Curve.  Same as SmoothStep()
    vec2 u = f*f*(3.0-2.0*f);
    // u = smoothstep(0.,1.,f);

    // Mix 4 coorners percentages
    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    float deg = 6.0;
    // float grid = 4.0;
    // st = vec2(floor(random(st*grid)));

    vec2 a = vec2(random(floor(st*deg)));
    // vec2 p = vec2(fract(random(floor(st*deg))));
    vec2 p = fract((st*2.0+random(floor(st*deg))))/deg;
    vec2 rand = vec2(random(floor(st*deg)));
    // vec2 p = fract((st)*deg)/deg;
    vec4 tex = texture2D(u_texture_0, fract(st+a));

    // gl_FragColor = vec4(vec3(rand.x), 1.0);
    gl_FragColor = tex;
}

// void main() {
//     vec2 st = gl_FragCoord.xy/u_resolution.xy;
    
//     float deg = 4.0;
//     vec2 grid = vec2(random(floor(st*deg)));

//     vec2 tex_coord = fract(st+grid);
//     vec4 tex = texture2D(u_texture_0, tex_coord);

//     gl_FragColor = tex;
// }

// void main() {
//     vec2 st = gl_FragCoord.xy/u_resolution.xy;

//     vec2 tex_coord = st;
//     vec4 tex = texture2D(u_texture_0, tex_coord);

//     vec2 grid = floor(st*10.0)/10.0;

//     // gl_FragColor = tex;
//     gl_FragColor = vec4(vec3(grid.x, grid.y, 0.0), 1.0);
// }