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

vec3 randomColor (vec2 st) {
  float cpick = floor(random(floor(st))*3.0); 
  vec3 c1 = 1.0-WHITE;
  if (cpick == 0.0) c1 = RED;
  else if (cpick == 1.0) c1 = BLUE;
  else if (cpick == 2.0) c1 = YELLOW; 
  // else c1 = WHITE;
  return c1;
}

void main() {
  vec2 st = gl_FragCoord.xy/u_resolution.xy;
  st = ratio(st, u_resolution);
  float t = u_time/2.0;
  // t = floor(t);
  t = 0.0;

  vec2 size = vec2(2.0, 4.0)*2.0;

  vec2 mod_st = st*size;
  vec2 slope = vec2(0.0, 1.0);
  float flip = random(floor(mod_st + floor(t))) < 0.5 ? -1.0 : 1.0;

  float rows = smoothstep(0.5-0.01, 0.5+0.01, fract(mod_st.y));
  mod_st.x += slope.y*0.5 * (floor(mod_st.y*1.0) ); 
  if (rows == 0.0) {
    mod_st.x += fract(mod_st.y)*slope.y * flip;
    mod_st.x -= slope.y*0.5;
  } 
  float cols = (fract(mod_st.x));

  vec2 grid = (vec2(mod_st.x*2.0 + rows, mod_st.y*2.0));
  // grid = vec2(aafract(grid.x), aafract(grid.y));
  grid = fract(grid);

  float stair = smoothstep(0.5-0.01, 0.5+0.01, cols);
  float rstair = random(stair);
  float line2 = 1.0-step(0.05, grid.y);
  float line3 = step(0.95, cols);

  vec3 c1 = randomColor(vec2(mod_st.xx+cols)*3.0 );
  vec3 c2 = randomColor(vec2(t)*2.0 );

  vec3 c = mix(c1, WHITE, stair);
  // c = WHITE;
  c = mix(c, 1.0-WHITE, line3);
  // c = mix(c2, c1, stair);
  // c = mix(c, GREY, rstair);
  if (rows == 0.0 && slope.y > 0.0 && stair == 1.0) c = mix(c, 1.0-WHITE, abs(sin((t)+st.y))*0.25);
  // if (rows == 0.0 && slope.y < 0.0) c = mix(c, 1.0-WHITE, fract(1.0-st.y)*0.5);

  gl_FragColor = vec4(BLUE, 1.0);
  gl_FragColor = vec4(c, 1.0);
}