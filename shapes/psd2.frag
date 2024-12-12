#version 300 es

precision highp float;
precision highp sampler2D;

in vec2 uv;
out vec4 out_color;

uniform vec2 u_resolution;
uniform float u_time;
uniform vec4 u_mouse;
uniform sampler2D u_textures[16];

#define PI 3.1415926538

#include "../lygia/draw/fill"
#include "../lygia/draw/stroke"
#include "../lygia/sdf/polySDF"
#include "../lygia/space/rotate"

void main(){
    vec2 st = (2. * uv - 1.) * vec2(u_resolution.x / u_resolution.y, 1.);
    vec2 mouse = u_mouse.xy / u_resolution;
    vec2 uv1 = (st+1.)/2.;

    float p1 = fill(polySDF(uv1, 5), 0.55);
 
    float pin = 1.0;
    int n = 6;
    float s = 0.4;
    float prevs = 0.5;
    for(int i = 0; i < n; i++) {
        float rf = (2.0 * PI / (5. * 2.)) * (float(i));
        vec2 uv = rotate(uv1, rf);
        float p1 = fill(polySDF(uv, 5), prevs);
        float p2 = fill(polySDF(uv, 5), s);

        prevs = s; s -= 0.08;
        pin = pin - p1 + p2;
    }

    float c = p1 * pin;
    out_color = vec4(vec3(c), 1.);
}