#ifdef GL_ES
precision mediump float;
#endif

#define WHITE     vec3(0.8941, 0.8941, 0.8941)
#define GREY      vec3(0.6078, 0.6078, 0.6078)
#define BLACK      vec3(0.0)
#define RED        vec3(1.0, 0.0, 0.0)
#define COL1       vec3(245, 230, 225)/255.0
#define COL2       vec3(255, 240, 36)/255.0
#define COL3       vec3(102, 111, 237)/255.0

uniform vec2 u_resolution;
uniform float u_time;

#include "../lygia/sdf/starSDF.glsl";
#include "../lygia/sdf/circleSDF.glsl";
#include "../lygia/draw/fill.glsl";
#include "../lygia/draw/stroke.glsl";
#include "../lygia/space/ratio.glsl";
#include "../lygia/space/rotate.glsl";
#include "../lygia/generative/fbm.glsl";
#include "../lygia/generative/cnoise.glsl";
#include "../lygia/math/map.glsl";

float pattern1 (vec2 st, vec2 size) {
  vec2 mod_st = st*size;
  mod_st = fract(mod_st);
  mod_st = rotate(mod_st, radians(360.0/16.0));
  float lw = 0.2; 
  float blur = 0.05;
  float s1 = fill(starSDF(mod_st, 8, 0.31), 0.7, 0.1);
  float s1_line = stroke(starSDF(mod_st, 8, 0.31), 0.7, lw, blur);
  // mod_st = rotate(mod_st, -radians(360.0/16.0));
  float s2 = fill(starSDF(mod_st, 8, 0.07), 0.6, 0.1);
  float s2_line = stroke(starSDF(mod_st, 8, 0.08), 0.6, lw, blur);
  vec2 st1 = (st*size)+vec2(0.5);
  st1 = fract(st1);
  st1 = rotate(st1, radians(360.0/8.0));
  float s3 = fill(starSDF(st1, 4, 0.05), 0.4, 0.1);
  float s3_line = stroke(starSDF(st1, 4, 0.05), 0.4, lw, blur);

  float line = s1_line + s2_line + s3_line; 
  return line;
}

float pattern2 (vec2 st, vec2 size) {
  // unfinished
  float lw = 0.05; 
  float blur = 0.01;
  vec2 mod_st = fract(st*size);
  float s1 = stroke(starSDF(mod_st, 8, 0.55), 0.7, lw, blur);
  float s2 = stroke(starSDF(mod_st, 8, 0.32), 0.7, lw, blur);
  mod_st = rotate(mod_st, radians(360.0/16.0));
  float s4 = stroke(starSDF(mod_st, 8, 0.5), 2.0, lw*1.5, blur);

  mod_st = rotate(mod_st, -radians(360.0/16.0));
  mod_st = fract(mod_st+vec2(0.5));
  float s3 = stroke(starSDF(mod_st, 8, 0.5), 0.7, lw, blur);
  mod_st = rotate(mod_st, radians(45.0));
  mod_st = fract(mod_st*2.0);

  float s5 = stroke(starSDF(mod_st, 3, 0.3), 0.5, lw, blur);

  float line = s1+s2+s3+s4+s5;
  return line;
}

float pattern3 (vec2 st, vec2 size) {
  float lw = 0.05; 
  float blur = 0.01;
  vec2 mod_st = fract(st*size);
  float row = floor(st*size).y;
  float off = mod(row, 2.0) != 0.0 ? row*0.5 : 0.0;
  float s1 = stroke(starSDF(fract(mod_st+vec2(off, 0.0)), 6, 0.11), 0.7, lw, blur);
  
  float line = s1;
  return line;
}

void main() {
  vec2 st = gl_FragCoord.xy/u_resolution.xy;
  st = ratio(st, u_resolution);
  float t = u_time/10.0;

  vec2 size = vec2(2.0);
  float line = pattern3(vec2(st.x, st.y), size);
  
  // float cloud = fbm(st*2.0+t) * cnoise(st);

  

  vec3 c = WHITE;
  // c = mix(WHITE, GREY*2.0, cloud);
  // c = mix(c, BLACK, line);
  float s1 = fill(starSDF(st, 8, 0.31), 0.7, 0.01);

  vec2 mod_st = st*4-2;
  c = mix(c, BLACK, s1);
  // c = mix(c, RED, s4);

  gl_FragColor = vec4(WHITE, 1.0);
  gl_FragColor = vec4(c, 1.0);
}