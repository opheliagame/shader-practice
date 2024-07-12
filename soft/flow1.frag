#version 330
#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.1415926538
#define BLACK vec3(0.0)
#define WHITE vec3(1.0)
#define GREEN vec3(9, 158, 86)/255.0
#define ORANGE vec3(255, 128, 59)/255.0
#define PINK vec3(	255, 147, 142)/255.0
#define BLUE vec3(2, 8, 135)/255.0
#define YELLOW vec3(251/255.0,209/255.0,100/255.0)
#define RED vec3(255, 62, 65)/255.0

uniform vec2 u_resolution;
uniform float u_time;

#include "../lygia/generative/random.glsl";
#include "../lygia/generative/cnoise.glsl";
#include "../lygia/generative/snoise.glsl";
#include "../lygia/generative/gnoise.glsl";
#include "../lygia/generative/pnoise.glsl";
#include "../lygia/generative/fbm.glsl";
#include "../lygia/space/cart2polar.glsl";
#include "../lygia/space/rotate.glsl";
#include "../lygia/space/ratio.glsl";
#include "../lygia/sdf/lineSDF.glsl";
#include "../lygia/draw/stroke.glsl";

void main() {
  vec2 st = gl_FragCoord.xy/u_resolution.xy;
  st = ratio(st, u_resolution);
  float t = u_time/1.0;

  vec2 st1 = st*3.0;

  float n = cnoise(vec3(st.x, st.y, t))*1.0;
  float n1 = gnoise(n);

  float angle = st.x+sin(n);
  vec2 vel = vec2(cnoise(st1), cnoise(st1+t));
  vec2 fin = st + vel;
  fin = normalize(fin);

  // st = fract(st);

  st = st * 2.0 - 1.0 + vec2(-0.0, 0.0);
  angle = atan(st.y, st.x);

  float a = abs(sin(angle*3.0)) / length(st);
  a = smoothstep(0.0, 1.0, a+n);

  float b = fract(length((st*2.0+abs(sin(angle*4.0+t)))));

  a = mix(a, b, 0.5);
  // a = normalize(a);

  float n2 = gnoise(fin.x+fin.y);

  vec3 color = PINK;
  color = mix(color, GREEN, a);


  // color = vec3(fin.x, fin.y, fin.x);

  gl_FragColor = vec4(color, 1.0);
}