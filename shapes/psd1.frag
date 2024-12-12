#version 300 es

precision highp float;
precision highp sampler2D;

in vec2 uv;
out vec4 out_color;

uniform vec2 u_resolution;
uniform float u_time;
uniform vec4 u_mouse;
uniform sampler2D u_textures[16];

#include "../lygia/generative/random"
#include "../lygia/draw/fill"
#include "../lygia/draw/stroke"
#include "../lygia/sdf/circleSDF"

void main(){
    vec2 st = (2. * uv - 1.) * vec2(u_resolution.x / u_resolution.y, 1.);
    vec2 mouse = u_mouse.xy / u_resolution;

    vec2 uv1 = (st+1.)/2.;
    
    float bc1 = stroke(circleSDF((st+1.)/2. - vec2(0.25/1.5, 0)), 0.5, 0.2);
    float bc2 = stroke(circleSDF((st+1.)/2. + vec2(0.25/1.5, 0)), 0.5, 0.2);

    float c1 = stroke(circleSDF((st+1.)/2. - vec2(0.25/1.5, 0)), 0.5, 0.08);
    float c2 = stroke(circleSDF((st+1.)/2. + vec2(0.25/1.5, 0)), 0.5, 0.08);
    
    float c11 = c1 - (bc1*bc2*2. * max(step(uv1.y, 0.5), 0.0));
    float c22 = c2 - (bc1*bc2*2. * max(step(1.0-uv1.y, 0.5), 0.0));

    float c = (1.0-c22) * c11 + c22;

    out_color = vec4(vec3(c), 1.);
}