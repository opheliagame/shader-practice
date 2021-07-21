#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

#define BLUE       vec3(0.56, 0.76, 0.94)
#define PINK       vec3(0.96, 0.69, 0.67)
#define ORANGE     vec3(1.00, 0.78, 0.70)
#define WHITE      vec3(1.00, 1.00, 1.00)
#define BLUEM      vec3(4, 92, 199)/255.0
#define BLUEL      vec3(92, 162, 247)/255.0
// #define BLUED      vec3(1, 53, 105)/255.0
#define BLUED      vec3(37, 19, 138)/255.0

#include "../lygia/space/rotate.glsl";
#include "../lygia/space/ratio.glsl";
#include "../lygia/generative/random.glsl";
#include "../lygia/generative/cnoise.glsl";
#include "../lygia/draw/aastep.glsl";


float msmooth(float v, float s) {
  return smoothstep(v-0.003, v+0.003, s);
}



float getGridFloat (vec2 grid) {
  // grid = rotate(grid, radians(u_time*2.0));
  // grid = fract(grid);
  // grid = vec2(grid.x, grid.y);
  // grid = fract(grid);
  // float row1 = aastep(1.0/3.0, fract(grid.y/1.5)) == 0.0 ? 1.0/3.0 : 0.0;
  // float row2 = aastep(2.0/3.0, fract(grid.y/1.5)) == 1.0 ? 2.0/3.0 : 0.0;
  // float cols = aastep(1.0/3.0, fract(grid.x/1.5 + max(row1, row2)));

  float row1 = msmooth(1.0/3.0, fract(grid.y/1.5)) == 0.0 ? 1.0/3.0 : 0.0;
  float row2 = msmooth(2.0/3.0, fract(grid.y/1.5)) == 1.0 ? 2.0/3.0 : 0.0;
  float cols = msmooth(1.0/3.0, fract(grid.x/1.5 + max(row1, row2)));

  return cols;
}

float getChessGrid (vec2 grid) {
  // grid = rotate(grid, radians(u_time*2.0));
  // grid = fract(grid);

  float row1 = msmooth(1.0/3.0, fract(grid.y/1.5)) == 0.0 ? 2.0/3.0 : 0.0;
  float row2 = msmooth(2.0/3.0, fract(grid.y/1.5)) == 1.0 ? 1.0/3.0 : 0.0;
  float cols = msmooth(1.0/3.0, fract(grid.x/1.5 + max(row1, row2)));
  return cols;
}


void main() {
  vec2 st = gl_FragCoord.xy/u_resolution.xy;
  st = ratio(st, u_resolution);
  float t = u_time/2.0;

  vec2 size = vec2(5.0, 5.0*1.5);
  vec2 grid = st*size + vec2(0.0, 0.5);

  vec2 g1 = vec2(grid.x-grid.y, grid.x+grid.y);
  vec2 g1_fract = fract(g1);
  vec2 g1_floor = floor(g1);

  vec2 g2 = (vec2(grid.x*2.0, grid.x+grid.y) + vec2(0.0));
  vec2 g2_fract = fract(g2);

  float turn = step(0.5, fract(grid.x)) == 1.0 ? -1.0 : 1.0;
  // g2 = rotate(g2, radians(0.0));

  // g1 = vec2(cnoise(g1.xx+t)*size);
  float tops = getGridFloat(g1*0.5);
  // tops = step(0.3, random(g1_floor*size));
  float obs = tops == 0.0 ? -1.0 : 1.0;

  vec2 g2_floor = floor(vec2(grid.x*2.0, grid.x+grid.y*turn*obs) );
  float sides = step(0.5, (fract(g2*0.5)).x);
  // g2 = rotate(g2, radians(30.0));
  sides = getChessGrid(g2*0.5);

  float shadow1 = fract(g2.y);
  bool flip = sin(t) < 0.0;
  flip = true;

  float mod1 = (sin(t));

  vec3 c = mix(BLUE, WHITE, mod1);
  // c = mix(BLUEM, BLUED, mod1 * g2_fract.y);
  // c = mix(BLUEL, BLUEM, mod1);
  // c = mix(c, BLUEM, step(0.5, fract(grid.x)));

  vec3 a = mix(BLUEL, BLUEM, mod1);
  vec3 b = mix(BLUEM, BLUEL, (1.0-mod1));
  vec3 c1 = mix(a, b, 0.5);

  if(flip) c = mix(c, c1, sides );
  // else c = mix(BLUE, BLUED, sides);
  c = mix(c, BLUED, (1.0-tops));
  // c = mix(c, PINK, obs);

  // c = mix(c, BLUE, fract(g2.x)*tops*sides * mod1);

  // grid = vec2(g1.x, g1.y);
  // float row1 = step(1.0/3.0, fract(grid.y/1.5)) == 0.0 ? 1.0/3.0 : 0.0;
  // float row2 = step(2.0/3.0, fract(grid.y/1.5)) == 1.0 ? 2.0/3.0 : 0.0;
  // float cols = step(1.0/3.0, fract(grid.x/1.5 + max(row1, row2)));
  // c = mix(WHITE, 1.0-WHITE, cols);

  gl_FragColor = vec4(BLUE, 1.0);
  gl_FragColor = vec4(c, 1.0);
}