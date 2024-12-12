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
#include "../lygia/draw/crossSDF"
#include "../lygia/draw/rectSDF"

void main(){
    vec2 st = (2. * uv - 1.) * vec2(u_resolution.x / u_resolution.y, 1.);
    vec2 mouse = u_mouse.xy / u_resolution;
    vec2 uv1 = (st+1.)/2.;

    float r1 = fill(rectSDF(uv1), 0.55);

    float rin = 0.0;
    int no = 4;
    for(int j = 0; j < no; j++) {
        float x = (float(j % 2) * 2.0-1.0) / 3.;
        float y = (float(j / 2) * 2.0-1.0) / 3.;
        vec2 pos = vec2(x, y);

        int n = 4; float s = 0.4;
        for(int i = 0; i < 4; i++) {
            float r = stroke(rectSDF(uv1 + pos), s, 0.02);
            s -= 0.04;
            rin += r;
        }
    }

    rin += fill(crossSDF(uv1, 1.), 0.55);
    rin *= r1;
    rin += stroke(rectSDF(uv1), 0.65, 0.03);
    rin += stroke(rectSDF(uv1), 0.7, 0.015);

    float c = rin;
    out_color = vec4(vec3(c), 1.);
}