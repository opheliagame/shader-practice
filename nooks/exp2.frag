#ifdef GL_ES
precision mediump float;
#endif

#define WHITE     vec3(0.8196, 0.8196, 0.8196)
#define GREY      vec3(0.3608, 0.3608, 0.3608)

uniform vec2 u_resolution;
uniform float u_time;

#include "../lygia/space/ratio.glsl";
#include "../lygia/sdf/rectSDF.glsl";
#include "../lygia/draw/fill.glsl";
#include "../lygia/draw/aastep.glsl";
#include "../lygia/generative/random.glsl";
#include "../lygia/generative/fbm.glsl";
#include "../lygia/generative/cnoise.glsl";
#include "../lygia/math/map.glsl";

#include "../utils/utils.glsl";

void main() {
  vec2 st = gl_FragCoord.xy/u_resolution.xy;
  st = ratio(st, u_resolution);
  float t = u_time/2.0;
  t = 0.0;

  vec2 size = vec2(1.0);
  vec2 wall = vec2(0.65, 0.3);
  vec2 mod_st = st*size;
  float slope_mod = map(distance(st.x, wall.x), 
                    0.0, 0.65, 
                    -st.y, st.y);
  slope_mod *= step(wall.x, mod_st.x) == 0.0 ? 1.0 : -1.0;
  float slope = st.x < wall.x ? -0.12 : 0.7;
  slope += step(wall.x, mod_st.x) == 0.0 ? slope_mod : 0.0;
  slope += sin(t);
  mod_st.y += (st.x-wall.x) * size.x * slope;
  // slope_mod = map(floor(mod_st.y*20.0), 0.0, 20.0, 0.0, 10.0) + sin(t);
  // if(step(wall.y, mod_st.y) == 0.0) {
  //   mod_st = st*size;
  //   mod_st.y += (st.x-wall.x) * size.x * slope * slope_mod;
  // }


  float horizon = 1.0-smoothstep(wall.y-0.002, wall.y+0.002, mod_st.y);
  float shadow_d = step(wall.x, mod_st.x);
  float shadow_l = 1.0-shadow_d;
  float shadow1 = pow(1.0-mod_st.x-0.2, 2.0) + pow(mod_st.y, 2.0)*0.01;
  
  float shadow2 = pow(shadow_d*(1.0-st.x)*6.0, 2.0) + 
                  pow(smoothstep(wall.y, 1.0, mod_st.y*3.0), 2.0);
  if (shadow_d == 0.0) shadow2 = 0.0;
  float cloud = fbm(st*2.0)*cnoise(st*0.2);

  // slope_mod = (1.0-step(wall.y, mod_st.y))*shadow_d * fract(mod_st.y*20.0*st.y*0.5);
  
  // mod_st.y += horizon * st.y*0.5;
  vec2 bsize = vec2(20.0);
  vec2 window_st = (mod_st*bsize);
  // window_st.y += step(wall.x, st.x)*-abs(st.x-wall.x)*(1.0-st.y)*1.0;
  vec2 window_size = random(floor(mod_st*bsize)) < 0.5 ? vec2(1.0) : vec2(0.0);
  // window_size = vec2(0.5);
  // window_size.y *= (1.0-pow(abs(st.x-wall.x), 1.0));
  float window = fill(rectSDF(fract(window_st), window_size), 0.4, 0.1);
  float window_shadow = fill(rectSDF(fract(window_st), window_size), 0.5, 0.1);

  vec3 c = mix(WHITE, GREY, horizon);
  c = mix(c, GREY*0.8, shadow_d*horizon);
  c = mix(c, GREY*1.5, shadow_l*horizon);
  // c = mix(c, GREY, window_shadow*horizon);
  c = mix(c, GREY*0.7, shadow2*horizon);
  c = mix(c, WHITE*2.0, window*horizon);
  c = mix(c, 1.0-WHITE, cloud*(1.0-horizon));
  // c = mix(c, 1.0-WHITE, shadow1);
  // c = mix(c, 1.0-WHITE, smoothstep(0.95, 1.0, fract(window_st.y)));


  gl_FragColor = vec4(GREY, 1.0);
  gl_FragColor = vec4(c, 1.0);
  // gl_FragColor = vec4(vec3(slope_mod), 1.0);
}