#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

#include "../lygia/sdf/circleSDF.glsl";
#include "../lygia/generative/cnoise.glsl";
#include "../lygia/generative/snoise.glsl";
#include "../lygia/generative/random.glsl";
#include "../lygia/color/hueShift.glsl";
#include "../lygia/space/cart2polar.glsl";

/* Color palette */
#define BLACK           vec3(0.0, 0.0, 0.0)
#define WHITE           vec3(1.0, 1.0, 1.0)
#define RED             vec3(1.0, 0.0, 0.0)
#define GREEN           vec3(0.0, 1.0, 0.0)
#define BLUE            vec3(0.0, 0.0, 1.0)
#define YELLOW          vec3(1.0, 1.0, 0.0)
#define CYAN            vec3(0.0, 1.0, 1.0)
#define MAGENTA         vec3(1.0, 0.0, 1.0)
#define ORANGE          vec3(1.0, 0.5, 0.0)
#define PURPLE          vec3(1.0, 0.0, 0.5)
#define LIME            vec3(0.5, 1.0, 0.0)
#define ACQUA           vec3(0.0, 1.0, 0.5)
#define VIOLET          vec3(0.5, 0.0, 1.0)
#define AZUR            vec3(0.0, 0.5, 1.0)

float aafract(float x) {    // --- antialiased fract
    float v = fract(x),
          w = fwidth(x);    // NB: x must not be discontinuous or factor discont out
    return v < 1.-w ? v/(1.-w) : (1.-v)/w; // replace right step by down slope (-> chainsaw is continuous).
            // shortened slope : added downslope near v=1 
}

void main() {
  vec3 BLUE1 = vec3(119, 154, 242)/255.0;
  vec3 BLUE2 = vec3(0,15,137)/255.0;
  vec3 BLUE3 = mix(BLUE1, BLUE2, 0.5);
  float t = u_time/10.0;

  vec2 st = gl_FragCoord.xy/u_resolution.xy;
  st += vec2(cnoise(vec2(st)*2.0+u_time));

  vec2 grid = (vec2((st.x+t)*1.0 + 0.0/5.0, ((st.y+t) ) + 0.0/5.0) *10.0);
  grid = smoothstep(0.0, 1.0, grid);
  vec2 g = random2(grid);//+ random2(floor(u_time/2.0));

  vec2 loc = vec2( random(floor(st.x) + floor(u_time)), random(floor(st.y) + floor(u_time)) );
  vec2 space = vec2(aafract(st.x*5.0), aafract(st.y*5.0));
  float circ = circleSDF(smoothstep(0.0, 1.0, space), smoothstep(0.0, 1.0, vec2(aafract(g.x), aafract(g.y))));
  float c1 = 1.0-smoothstep(0.2, 0.8, circ* 0.5);
  float c2 = 1.0-smoothstep(0.2, 0.8, circ*2.0);
  // circ += cnoise(vec2(st) + u_time);

  // vec3 c = mix(BLUE3, BLUE1, abs(cnoise(vec2(c1)+u_time)));// * mix(BLUE2, BLUE1, g);
  // c *= mix(BLUE2, BLUE3, c2);
  // vec3 c = mix(BLUE2, BLUE3, g);
  // c *= mix(BLUE2, BLUE3, grid.y);
  // c = fract(c);

  vec3 c = vec3(BLUE2);
  c = mix(BLUE1, c, abs(sin(st.x)));
  // c = mix(BLUE3, c, g.x);
  // c = mix(BLUE3, c, c1);
  c = mix(WHITE, c, c1);
  // c = mix(BLUE3, c, g.x);
  // c = fract(c);
  // c = mix(BLUE1, BLUE2, c);

  float d1 = c1;
  // c = vec3(d1);
  gl_FragColor = vec4(c, 1.0);
}