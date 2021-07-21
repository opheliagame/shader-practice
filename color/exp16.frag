#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

#define RED      vec3(1.0, 0.0, 0.0)
#define YELLOW   vec3(1.0, 1.0, 0.0)
#define BLUE     vec3(0.0, 0.0, 1.0)
#define WHITE    vec3(1.0, 1.0, 1.0)

#include "../lygia/generative/random.glsl";
#include "../lygia/generative/cnoise.glsl";
#include "../lygia/draw/aastep.glsl";
#include "../lygia/space/ratio.glsl";


float aafract(float x) {    // --- antialiased fract
    float v = fract(x),
          w = fwidth(x);    // NB: x must not be discontinuous or factor discont out
    return v < 1.-w ? v/(1.-w) : (1.-v)/w; // replace right step by down slope (-> chainsaw is continuous).
            // shortened slope : added downslope near v=1 
}

void main() {
  vec2 st = gl_FragCoord.xy/u_resolution.xy;
  st = ratio(st, u_resolution);
  float t = u_time/10.0;
  t = 0.0;

  vec2 size = vec2(2.5, 8.0)*1.0;
  vec2 mod_st = st*size;
  vec2 slope = vec2(0.0, 0.5);
  float flip = step(size.y/2.0, mod_st.y) == 1.0 ? 1.0 : -1.0;
  // flip = 1.0;
  slope.y *= flip;

  float rows = smoothstep(0.5-0.01, 0.5+0.01, fract(mod_st.y));
  mod_st.x += slope.y*0.5 * (floor(mod_st.y*1.0) ); 
  if (rows == 0.0) {
    mod_st.x += fract(mod_st.y)*slope.y;
    mod_st.x -= slope.y*0.5;
  } 
  if (flip == -1.0) mod_st.x += slope.y;
  float cols = (fract(mod_st.x));

  vec2 grid = (vec2(mod_st.x*2.0 + rows, mod_st.y*2.0));
  // grid = vec2(aafract(grid.x), aafract(grid.y));
  grid = fract(grid);

  float stair = smoothstep(0.5-0.01, 0.5+0.01, cols);
  float line1 = step(0.9, grid.x);
  float line2 = step(0.9, grid.y);
  float shadow1 = (1.0-aafract(st.y))*
                  (1.0-rows)*
                  aafract(1.0-mod_st.y)*
                  smoothstep(size.x-0.05, size.x+0.01, mod_st.x)*
                  0.75;
  float shadow3 = (1.0-aafract(st.y))*
                  (1.0-rows)*
                  aafract(1.0-mod_st.y)*
                  (1.0-aastep(0.5, mod_st.x))*
                  0.75;
  float shadow2 = (aafract(st.y))*
                  (1.0-rows)*
                  (aafract(mod_st.y))*
                  (aastep(0.01, size.x-mod_st.x)) * 
                  aastep(size.y/2.0, mod_st.y)* 1.5;

  float shadow4 = (aafract(st.y+0.5))*
                  (1.0-rows)*
                  (aafract(mod_st.y))*
                  (aastep(0.5, mod_st.x)) * 
                  (1.0-aastep(size.y/2.0, mod_st.y))* 1.5;

  //(1.0-fract(st.y-0.5))*)

  vec3 c = mix(WHITE, YELLOW, stair);
  c = WHITE;
  c = mix(c, 1.0-WHITE, shadow1); // top right
  c = mix(c, 1.0-WHITE, shadow3);// bottom left
  c = mix(c, 1.0-WHITE, shadow2);// top left
  c = mix(c, 1.0-WHITE, shadow4);// bottom right 


  c = mix(1.0-WHITE, c, aastep(0.00001, mod_st.x));
  c = mix(c, 1.0-WHITE, ((aastep(1.0, mod_st.x))) * 
                   (1.0-aastep(size.y/2.0, mod_st.y)));
  c = mix(c, 1.0-WHITE, aastep(3.0, mod_st.x));
  c = mix(c, 1.0-WHITE, (aastep(0.5, size.x-mod_st.x)) * 
                   aastep(size.y/2.0, mod_st.y));


  // c = mix(c, 1.0-WHITE, (line1+line2));
  // c = mix(c, RED, (step(0.01, size.x-mod_st.x)) * step(size.y/2.0, mod_st.y));
  // c = mix(c, RED, fract(1.0-mod_st.y));
  // c = mix(c, RED, ((step(0.5, mod_st.x)) * (1.0-step(size.y/2.0, mod_st.y))));

  gl_FragColor = vec4(RED, 1.0);
  gl_FragColor = vec4(c, 1.0);
}