#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.1415926538

uniform vec2 u_resolution;
uniform float u_time;

#include "../lygia/generative/random.glsl";
#include "../lygia/generative/cnoise.glsl";
#include "../lygia/generative/snoise.glsl";
#include "../lygia/generative/gnoise.glsl";
#include "../lygia/generative/fbm.glsl";
#include "../lygia/space/cart2polar.glsl";
#include "../lygia/space/rotate.glsl";
#include "../lygia/sdf/lineSDF.glsl";
#include "../lygia/draw/stroke.glsl";

void main() {
  vec2 st = gl_FragCoord.xy/u_resolution.xy;
  vec2 orig_st = st;
  st = st * 2.0 - 1.0;
  st = rotate(st, u_time, vec2(0.0));
  // st /= 2.0; 
  st = cart2polar(st); 

  float size = PI * 1.0;
  vec2 st1 = st*size + vec2(cnoise(st*1.0+u_time), 0.0);
  vec2 fv = floor(st1);
  vec2 grid = fv/size;// + vec2(random(fv.x), random(fv.y));

  vec2 grid_move = vec2( sin(st.y+u_time)*1.0,  sin(st.x+u_time)*1.0);
  grid_move += u_time/2.0;
  vec2 r_grid = grid + grid_move;
  // vec2 r_grid = floor((random2((st)) + u_time*0.0)*10.0)/10.0;
  // r_grid +=  grid_move;
  r_grid = fract(r_grid);

  // vec3 c1 = vec3(0.9255, 0.6824, 0.8941);
  // vec3 c2 = vec3(0.8314, 0.9059, 0.6196);
  vec3 c1 = vec3(0.9255, 0.6824, 1.0); 
  vec3 c2 = vec3(0.8314, 0.9059, 0.0);
  // c1 += vec3(sin(cnoise(c1.xy + u_time))) * 0.2;
  c2 += vec3(sin(cnoise(c2.xy + u_time))) * 0.2;
  // c1 = fract(c1);
  // c2 = fract(c2);

  vec3 mix_mod = vec3(1.0, 1.0, smoothstep(0.0, 1.0, r_grid.x));
  mix_mod += vec3(1.0, cnoise(mix_mod*2.0+u_time/2.0), 1.0);
  mix_mod = fract(mix_mod);
  vec3 c = mix(c1, c2, mix_mod);
  // c.x *= r_grid.x;
  // c.y *= r_grid.y;
  // c.z *= r_grid.x;
  // c = fract(c);

  // r_grid = cart2polar(grid_move * 2.0 - 1.0);

  // c = vec3(r_grid.x, r_grid.y, 0.0);
  // c = vec3(random(fv.x));
  
  c = mix(vec3(0.0), vec3(1.0), fbm(orig_st));

  gl_FragColor = vec4(c, 1.0);
}