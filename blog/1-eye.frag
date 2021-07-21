#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float circle(vec2 _st, vec2 _pos, float _radius) {
    vec2 dist = _pos-_st;
    dist *= 0.5;
    float val = smoothstep(_radius-0.01, _radius+0.01,
                dot(dist,dist)*4.0);
    return val;
}

// void main() {
//     vec2 st = gl_FragCoord.xy/u_resolution.xy*2.0-1.0;
//     vec2 m = u_mouse/u_resolution.xy*2.0-1.0;
//     float c = 1.0-circle(fract(st*2.0), vec2(0.5), 0.2);

//     vec2 dir = m-st;
//     float smallc_len = 0.25;
//     if(length(dir) < 0.5) {
//         // dir += 0.25/2.0;v
//         // smallc_len += 0.25/2.;
//     }
    
//     float dirangle = atan(dir.y, dir.x);

//     // if(m.y*m.x < 0.0) {
//     //     dirangle *= -1.0;
//     // }
//     vec2 smallc_pos = vec2(cos(dirangle)*smallc_len, sin(dirangle)*smallc_len)+0.5;
//     float smallc = circle(fract(st*2.0), vec2(smallc_pos), 0.1);
//     vec3 color = vec3(smallc*c);
//     // color = vec3(smallc);

//     gl_FragColor = vec4(color, 1.0);
//     // gl_FragColor = vec4(vec3(length(dir)), 1.0);

//     // if(length(dir) < 0.5) {
//     //     gl_FragColor = vec4(vec3(0.0), 1.0);
        
//     // }
// }

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec2 m = u_mouse/u_resolution.xy;

    vec2 dir = m-st;
    float dirangle = atan(dir.y, dir.x);

    float c = 1.0-circle(fract(st*4.0), vec2(0.5), 0.2);

    float smallc_len = 0.25;
    vec2 smallc_pos = vec2(cos(dirangle)*smallc_len, sin(dirangle)*smallc_len)+0.5;
    float smallc = circle(fract(st*4.0), vec2(smallc_pos), 0.1);

    gl_FragColor = vec4(vec3(c*smallc), 1.0);
}