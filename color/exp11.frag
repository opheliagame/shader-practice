#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

#define LBROWN        vec3(0.74, 0.53, 0.40)
#define DBROWN        vec3(0.30, 0.19, 0.12)
#define WHITE         vec3(1.00, 1.00, 1.00)
#define GREY          vec3(0.52, 0.50, 0.47)
#define YELLOW        vec3(0.96, 0.87, 0.58)
// #define GREY          vec3(0.21, 0.21, 0.21)

#include "../lygia/sdf/circleSDF.glsl";
#include "../lygia/sdf/rectSDF.glsl";
#include "../lygia/draw/fill.glsl";
#include "../lygia/math/map.glsl";
#include "../lygia/generative/random.glsl";
#include "../lygia/generative/cnoise.glsl";

float aafract(float x) {    // --- antialiased fract
    float v = fract(x),
          w = fwidth(x);    // NB: x must not be discontinuous or factor discont out
    return v < 1.-w ? v/(1.-w) : (1.-v)/w; // replace right step by down slope (-> chainsaw is continuous).
            // shortened slope : added downslope near v=1 
}

float getDoor(vec2 mod_st, vec2 dsize, float blur) {
  float diffy = (dsize.y)/2.0;
  diffy = 0.5-dsize.y;
  float diffx = (dsize.x);
  float sdf1 = rectSDF(mod_st+vec2(0.0, diffy), dsize);
  float sdf2 = circleSDF(mod_st+vec2(0.0, diffy), 
              // vec2(0.5, (1.0-dsize.y)/2.0));
              vec2(0.5, 0.5+dsize.y/2.0));
  float sdf = sdf1+sdf2;
  float door1 = fill(sdf1, 1.0, blur*5.0);
  float door2 = fill(sdf2, dsize.x, blur);
  // float door3 = fill(circleSDF(mod_st, vec2(0.5, 0.0)), dsize.x, 0.01);
  float door = door1 + door2 - door1*door2;
  // door = smoothstep(0.0, 1.0, door);
  return door;
}

void main() {
  vec2 st = gl_FragCoord.xy/u_resolution.xy;
  float t = u_time/2.0;

  float size = 8.0;
  vec2 mod_st = st * size;
  vec2 wall = vec2(0.4, 0.0);
  vec2 slope = vec2(0.0, -size*0.5);

  if (st.x < wall.x) mod_st += vec2(0.0, (st.x - wall.x) * slope.y * -1.0);
  else mod_st += vec2(0.0, (st.x - wall.x) * slope.y);

  float dmod = map(floor(mod_st.y), 0.0, size, 0.0, 0.5);
  vec2 orig_mod = mod_st;
  mod_st = vec2(fract(mod_st.x), aafract(mod_st.y));

  vec2 dsize = vec2(0.3, 0.5)*(1.0-dmod);
  float door = getDoor(mod_st, dsize, 0.01);

  float mod1 = (dsize.y/2.0);
  float step1 = step(mod1, mod_st.y);
  float step2 = 0.0;
  if (st.x < wall.x) step2 = 1.0-step(0.2, mod_st.x);
  else step2 = step(0.8, mod_st.x);
  // step2 *= mod_st.x;

  float shadow = (1.0-step1) + (step2 - ((1.0-step1)*step2));
  if (st.x < wall.x) shadow *= mod_st.x * (1.0-mod_st.y);
  else shadow *= (1.0-mod_st.x) * (1.0-mod_st.y);
  // shadow *= -1.0;  
  float shadow1 =  (1.0-mod_st.y)*1.0;
  float shadow2 = (step2 - ((1.0-step1)*step2));
  if (st.x < wall.x) shadow2 *= 1.0-mod_st.x;
  else shadow2 *= (mod_st.x);
  // shadow2 *= 0.5;

  float dshadow = getDoor(mod_st, dsize, 0.2) - getDoor(mod_st, dsize, 0.05);

  float light_mod = random(floor(orig_mod));
  vec3 light = step(0.5, cnoise(floor(orig_mod)+(t/2.0))) == 0.0 
                ? YELLOW : 1.0-WHITE;

  vec3 c = mix(LBROWN, LBROWN, step(0.1, mod_st.y));
  c = LBROWN;
  // c = mix()
  // c = mix(c, DBROWN, (1.0-step1) * st.y*1.0);  
  // c = mix(c, DBROWN, (step2 - ((1.0-step1)*step2)) * (wall.x-st.x)*1.0);
  c = mix(c, DBROWN, shadow1);
  // c = mix(c, DBROWN, shadow2);
  if (light == YELLOW) c = mix(c, GREY, dshadow);
  c = mix(c, light, door*mod_st.y);

  // c = mix(LBROWN, WHITE, light_mod);

  gl_FragColor = vec4(LBROWN, 1.0);
  gl_FragColor = vec4(c, 1.0);
}