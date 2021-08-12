#ifdef GL_ES
precision mediump float;
#endif

#define WHITE     vec3(0.8196, 0.8196, 0.8196)
#define GREY      vec3(0.3608, 0.3608, 0.3608)
#define BLACK      vec3(0.0)

uniform vec2 u_resolution;
uniform float u_time;

#include "../lygia/sdf/rectSDF.glsl";
#include "../lygia/draw/fill.glsl";
#include "../lygia/space/rotate.glsl";
#include "../lygia/space/ratio.glsl";
#include "../lygia/generative/cnoise.glsl";
#include "../lygia/generative/fbm.glsl";
#include "../lygia/math/map.glsl";

void main() {
  vec2 st = gl_FragCoord.xy/u_resolution.xy;
  st = ratio(st, u_resolution);
  float t = u_time/10.0;

  vec2 wall = vec2(0.4);
  vec2 mod_st = st*2.0-1.0;
  // mod_st.x /= (1.0-mod_st.y)*1.5 + 1.0;
  // wall.x = mod_st.x/0.6;
  float flip = step(wall.x, st.x) == 0.0 ? 1.0 : -1.0;
  mod_st.x = (mod_st.x + 1.0)/2.0;
  mod_st.y += (mod_st.x - wall.x)*(1.0)*flip;

  float building = fill(rectSDF(fract(mod_st), vec2(0.6, 1.2)), 1.0, 0.01);
  float cloud = 1.0;

  vec2 size = vec2(15.0, 6.0)*1.0;
  vec2 space = vec2(mod_st.x*2.0-1.0, mod_st.y);

  float win1 = fill(rectSDF(fract(mod_st*size*2.0), vec2(0.9)),
               1.0, map(st.y, 0.0, 1.0, 0.05, 0.1));
  // float mod1 = space.x*0.5 + 0.1*-flip;
  // float mod2 = st.y*0.4 + 0.2;
  float mod1 = space.x*0.5;
  float mod2 = -(1.0-st.y)*0.4 + 0.2;
  float win2 = fill(rectSDF(fract(mod_st*size*2.0)+vec2(0.0), vec2(0.8)),
               1.0, map(st.y, 0.0, 1.0, 0.05, 0.1));
  float win3 = fill(rectSDF(fract(mod_st*size*2.0)+vec2(mod1, mod2)/2.0, vec2(0.8)),
               1.0, map(st.y, 0.0, 1.0, 0.05, 0.1)); 

  float shadow1 = step(0.5, st.x) == 0.0 ? building*(1.0-st.x) : building*st.x;
  float shadow2 = building*flip*(1.0-mod_st.x);

  vec3 c = mix(WHITE, GREY, fract(mod_st.x*10.0));
  c = WHITE;
  c = mix(c, WHITE*0.8, win1*building);
  c = mix(c, GREY*1.2, win2*building);
  c = mix(c, WHITE*0.9, win3*win2*building);
  c = mix(c, GREY, building*shadow1*shadow2);
  c = mix(c, BLACK, cloud*(1.0-building)*2.0);
  // c = mix(c, WHITE*0.3, fract(st2.x));
  // c = mix(c, WHITE*0.3, win2);

  gl_FragColor = vec4(WHITE, 1.0);
  gl_FragColor = vec4(c, 1.0);
  // gl_FragColor = vec4(vec3(shadow1*shadow2), 1.0);
}