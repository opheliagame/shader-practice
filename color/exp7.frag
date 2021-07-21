#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

#define RED      vec3(1.0, 0.0, 0.0)
#define YELLOW   vec3(1.0, 1.0, 0.0)
#define BLUE     vec3(0.0, 0.0, 1.0)
#define WHITE    vec3(1.0, 1.0, 1.0)

#include "../lygia/space/rotate.glsl";
#include "../lygia/draw/aastep.glsl";
#include "../lygia/generative/random.glsl";
#include "../lygia/generative/cnoise.glsl";

float aafract(float x) {    // --- antialiased fract
    float v = fract(x),
          w = fwidth(x);    // NB: x must not be discontinuous or factor discont out
    return v < 1.-w ? v/(1.-w) : (1.-v)/w; // replace right step by down slope (-> chainsaw is continuous).
            // shortened slope : added downslope near v=1 
}

void main() {
  vec2 st = gl_FragCoord.xy/u_resolution.xy;
  float t = u_time/2.0;
  t = 0.0;

  float size = 5.0;
  vec2 mod_st = vec2(st.x * size, st.y*size*1.5) + t; 
  mod_st = rotate(mod_st, radians(45.0), vec2(0.5));

  vec2 grid1 = vec2(floor(mod_st.x)/size, floor(mod_st.y)/(size*1.5));
  vec2 grid2 = vec2(floor(mod_st.x*2.0)/(size*2.0), floor(mod_st.y*2.0)/(size*1.5*2.0));
  float mod1 = fract((st.x-0.24)*7.0/2.0);
  mod1 = aastep(0.5, mod1);
  // mod1 = sin(mod1*2.0);
  // if (step(0.5, mod1/2.0) == 1.0) mod1 = mod1/2.0;
  float mod2 = aastep(0.5, fract(mod_st.x*0.5)) * aastep(0.5, fract(mod_st.y*0.5));
  float mod6 = step(0.5, fract(mod_st.x*0.5 + sin(t*2.0)*0.25)) * 
              step(0.5, fract(mod_st.y*0.5 + sin(t*2.0)*0.25));
  // mod2 = 1.0-mod2;
  float mod3 = step(0.4, ( cnoise(grid2*size+t)));

  mod_st = vec2(aafract(mod_st.x), aafract(mod_st.y));
  float m1 = step(0.05, fract(mod_st.x*0.5));
  float m2 = step(0.05, fract(mod_st.y*0.5));
  // mod_st = fract(mod_st);
  float mod4 = 
              // (1.0-mod1*(mod_st.y) + 1.0-(1.0-mod1)*mod_st.x) *
              (mod1*(mod_st.x) + (1.0-mod1)*mod_st.y);
  mod4 = (mod1*mod_st.y) + (1.0-mod1)*mod_st.x;

  // float mod5 = mod1;

  vec3 c1 = mix(BLUE, WHITE, mod4 * 1.0);
  vec3 c2 = mix(WHITE, BLUE, mod4 * 1.0);

  vec3 c = mix(WHITE, 1.0-WHITE, mod4);
  c = mix(c, YELLOW, mod2);
  c = mix(c, RED, mod3 * (1.0-mod2));
  // c = mix(1.0-WHITE, c, m1*m2);
  // c = mix(c, YELLOW, mod1);
  // c = vec3(step(0.5, cnoise(grid2*size+t)));
  
  // c = c1;

  // gl_FragColor = vec4(RED, 1.0);
  gl_FragColor = vec4(c, 1.0);
}