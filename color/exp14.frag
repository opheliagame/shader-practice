#ifdef GL_ES
precision mediump float;
#endif


#define DPINK     vec3(0.98, 0.73, 0.73)
#define LPINK     vec3(0.97, 0.90, 0.90)
#define PURPLE    vec3(0.80, 0.70, 0.85)
#define GREY      vec3(0.52, 0.50, 0.47)
// #define GREEN     vec3(0.83, 0.85, 0.80)
#define GREEN     vec3(204, 245, 172)/255.0
#define WHITE     vec3(1.00, 1.00, 1.00)

uniform vec2 u_resolution;
uniform float u_time;

#include "../lygia/sdf/circleSDF.glsl";
#include "../lygia/sdf/rectSDF.glsl";
#include "../lygia/sdf/triSDF.glsl";
#include "../lygia/draw/fill.glsl";
#include "../lygia/generative/cnoise.glsl";
#include "../lygia/generative/random.glsl";
#include "../lygia/space/rotate.glsl";
#include "../lygia/space/ratio.glsl";
#include "../lygia/color/blend.glsl";

void main() {
  vec2 st = gl_FragCoord.xy/u_resolution.xy;
  // st = st ;
  float t = u_time/3.0;

  vec2 size = vec2(2.0, 4.0);
  vec2 slope = vec2(0.0, 1.0*sin(t));

  vec2 g1 = st*1.0;
  g1.x *= cnoise(vec2(g1.x + floor(t)))*size.x;
  g1.y *= cnoise(vec2(st.y + floor(t)))*size.y;
  vec2 random_c = floor(g1)/size;
  float r1 = step(0.5, fract(g1.y)) == 0.0 ? 0.5 : 0.0;
  vec3 c1 = vec3(step(0.5, fract(g1.x + r1))); 
  random_c = (vec2(g1.x + r1, g1.y*1.0));

  vec2 mod_st = st*size *1.5;
  // mod_st = step(0.2, mod_st)*mod_st;
  // mod_st = 1.0-step(0.2, mod_st)*mod_st;
  // mod_st.x += t/4.0;
  // mod_st = random_c;

  float rows = step(0.5, fract(mod_st.y));
  if (rows == 0.0) {
    mod_st.x += fract(mod_st.y)*slope.y;
  } 
  mod_st.x += slope.y*0.5 * (floor(mod_st.y*1.0) ); 
  if(rows == 0.0) {
    mod_st.x -= slope.y*0.5;
  }
  float cols = (fract(mod_st.x));

  vec2 grid = (vec2(mod_st.x*2.0 + rows, mod_st.y*2.0));
  grid = fract(grid);

  float stair = step(0.5, cols);
  float rstair = random(stair);
  float line2 = 1.0-step(0.05, grid.y);
  float line3 = 1.0-step(0.02, grid.x);

  vec3 c = mix(1.0-WHITE, DPINK, stair);
  // c = WHITE;
  // c = mix(c, GREY, rstair);
  // c = mix(c, 1.0-WHITE, line2+line3);
  if (rows == 0.0 && slope.y > 0.0) c = mix(c, 1.0-WHITE, fract(st.y)*0.5);
  if (rows == 0.0 && slope.y < 0.0) c = mix(c, 1.0-WHITE, fract(1.0-st.y)*0.5);
  
  // if(mod_st.x < 0.2 || mod_st.x > size.x*2.0-0.5) c = 1.0-WHITE;
  // if(mod_st.y < 1.0 || mod_st.y > size.y*2.0-1.0) c = 1.0-WHITE;

  gl_FragColor = vec4(LPINK, 1.0);
  gl_FragColor = vec4(c, 1.0);
}