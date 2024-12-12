#version 300 es
// https://in.pinterest.com/pin/294845106871021312/

precision highp float;
precision highp sampler2D;

in vec2 uv;
out vec4 out_color;

uniform vec2 u_resolution;
uniform float u_time;
uniform vec4 u_mouse;
uniform sampler2D u_textures[16];

#include "../lygia/draw/fill"

#define blue vec3(0.294, 0.294, 1.000)
#define green vec3(0.165, 0.961, 0.349)
#define red vec3(0.980, 0.271, 0.271)

void main(){
    vec2 st = (2. * uv - 1.) * vec2(u_resolution.x / u_resolution.y, 1.);


    vec2 mouse = u_mouse.xy / u_resolution;
    vec2 uv1 = ((st + vec2(0.0, -0.08)) * vec2(8.0, 2.2)) ;

    

    vec2 base = step(fract(uv1), vec2(0.5, 0.65));
    // base.x = 1.0-base.x;
    uv1.x += fract(uv1.y*0.5) < 0.5 ? 2.5 : 0.0; 


    float p1 = step(fract(uv1.x / 8.0 + 0.) , 0.75);
    float p2 = step(fract(uv1.x / 8.0 + 0.) , 0.31);

    base.y = base.y * p1 ;

    

    vec3 c = vec3(1.0);
    c = mix(c, blue, base.y);
    c = mix(c, green, base.x - (base.y * (p2)));
    c = mix(c, blue, base.y * (p2));

    // float p1 = step((uv1.y + ))

    out_color = vec4((c), 1.);
}