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
#include "../lygia/space/rotateY.glsl";
#include "../lygia/space/rotateX.glsl";
#include "../lygia/space/rotateZ.glsl";
#include "../lygia/draw/aastep.glsl";
#include "../lygia/draw/fill.glsl";
#include "../lygia/draw/rect.glsl";
#include "../lygia/sdf/rectSDF.glsl";
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
  // vec2 mod_st1 = vec2(mod_st.x, mod_st.y);
  // mod_st1.y += mod_st1.x * 1.0;
  // mod_st1.y *= 0.5;

  mod_st = rotate(mod_st, radians(45.0));

  float mod2 = step(0.8, random((floor(mod_st))));
  mod_st = vec2(aafract(mod_st.x), aafract(mod_st.y));
  // mod_st1 = vec2(aafract(mod_st1.x), aafract(mod_st1.y));
  
  vec3 mod_st2 = vec3((st.x-0.24)*7.0/2.0, mod_st.x, 0.0);
  mod_st2 = fract(mod_st2);
  // mod_st2 = rotateZ(mod_st2, radians(45.0), vec3(mod_st/2.0, 0.0));
  // mod_st2 = rotateY(mod_st2, radians(45.0+20.0), vec3(mod_st/2.0, 0.0));
  // mod_st2 = rotateZ(mod_st2, radians(15.0), vec3(0.5, 0.5, 0.0));
  // mod_st2 = vec3(aafract(mod_st2.x), aafract(mod_st2.y), 0.0);

  // float r = 1.0-rect(mod_st1, vec2(0.5));

  float mod3 = aastep(0.5, mod_st2.x);
  float mod4 = mod3 == 0.0 ? 0.5 : 1.0;
  float mod1 = min(mod4*mod_st2.x, (mod3) *(mod_st2.x));

  vec3 c = mix(WHITE, BLUE, mod1);
  c = mix(c, YELLOW, mod2);
  // c = mix(c, RED, (1.0-mod2)*st.y*mod_st2.x);
  // c = mix(c, RED, mod_st2.x * mod_st2.y);

  // c = mix(c, RED, mod_st2.z);
  // c = mix(c, RED, mod_st1.y);
  // c = mix(c, RED, mod_st1.x);

  // c *= r;

  gl_FragColor = vec4(RED, 1.0);
  gl_FragColor = vec4(c, 1.0);
}