#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

#include "../lygia/generative/random.glsl";
#include "../lygia/generative/cnoise.glsl";

/* Color palette */
#define MAROON           vec3(0.5, 0.0, 0.0)
#define PEACH            vec3(1.0, 0.8, 0.7)

float aafract(float x) {    // --- antialiased fract
    float v = fract(x),
          w = fwidth(x);    // NB: x must not be discontinuous or factor discont out
    return v < 1.-w ? v/(1.-w) : (1.-v)/w; // replace right step by down slope (-> chainsaw is continuous).
            // shortened slope : added downslope near v=1 
}

void main() {
  vec2 st = gl_FragCoord.xy/u_resolution.xy;
  float size = 5.0;
  vec2 mod_st = st*size;
  vec2 col_st = mod_st;
  
  float t = u_time/5.0;
  // t = 20.0;
  float flip = step(0.5, fract(t*0.5));
  if (flip == 0.0) flip = -1.0;

  vec2 slope = vec2(0.5, 1.2);
  slope.x = sin(t);

  vec2 wall = (0.5+ vec2(cnoise(vec2(t)))*size);
  wall = vec2(fract(t)*size, 0.0);
  if (mod_st.x > wall.x) col_st += vec2(0.0, (mod_st.x-wall.x) * slope.x * flip);
  else col_st += vec2(0.0, (mod_st.x-wall.x) * slope.x * -1.0 * flip);

  vec2 grid = vec2(aafract(col_st.x), aafract(col_st.y));
  grid.x += random(mod_st.x);
  
  float m1 = abs(sin(grid.y));
  float m2 = cnoise(st*5.0);

  vec2 stroke = smoothstep(m2-0.01, m2+0.01, grid);
  vec3 c = mix(MAROON, PEACH, m1);
  c = mix(PEACH*0.5+MAROON*0.5, c, flip);
  c = mix(MAROON, c*0.5, stroke.y);
  // if (flip == -1.0) c = mix(MAROON, c*0.5, stroke.y);

  // c = vec3(grid.y);
  gl_FragColor = vec4(c, 1.0);
}