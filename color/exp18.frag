#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

#define BLUE       vec3(0.56, 0.76, 0.94)
#define PINK       vec3(0.96, 0.69, 0.67)
#define ORANGE     vec3(1.00, 0.78, 0.70)
#define BLUEM      vec3(4, 92, 199)/255.0
#define BLUEL      vec3(92, 162, 247)/255.0
// #define BLUED      vec3(1, 53, 105)/255.0
#define BLUED      vec3(37, 19, 138)/255.0

// #define WHITE      vec3(199, 197, 197)/255.0
#define WHITE      vec3(1.0)
// #define COL1       vec3(181, 157, 154)/255.0
// #define COL2       vec3(107, 91, 89)/255.0
// #define COL3       vec3(18, 4, 2)/255.0

// #define WHITE      vec3(247, 198, 195)/255.0
#define COL1       vec3(235, 153, 47)/255.0
#define COL2       vec3(209, 115, 115)/255.0
#define COL3       vec3(161, 72, 72)/255.0

#include "../lygia/space/rotate.glsl";
#include "../lygia/space/ratio.glsl";
#include "../lygia/generative/random.glsl";
#include "../lygia/generative/cnoise.glsl";
#include "../lygia/draw/aastep.glsl";


float msmooth(float v, float s) {
  return smoothstep(v-0.003, v+0.003, s);
}

vec3 randomColor (vec2 st) {
  float t = u_time/40.0;
  float cpick = floor(cnoise(floor(st)*20.0+t)*3.0 + 0.7); 
  // float cpick = step(0.2, cnoise(floor(st)*10.0+t)); 
  // vec3 c1 = mix(BLUE, BLUED, cpick);

  vec3 c1 = COL3;
  if (cpick == 0.0) c1 = COL1;
  else if (cpick == 1.0) c1 = COL2;
  else if (cpick == 2.0) c1 = COL3; 
  // else c1 = WHITE;
  return c1;
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
  // t = 0.0;

  vec2 size = vec2(7.0, 7.0*1.5);
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
  vec2 g3 = (vec2(grid.x*2.0, grid.x-grid.y) + vec2(0.0));
  vec2 g3_fract = fract(g3);
  float sides2 = getChessGrid(g3*0.5 + vec2(0.0, 0.5));

  bool flip = sin(t) < 0.0;
  flip = true;

  float mod1 = sin(t*1.0);

  vec3 col1 = randomColor(vec2(g1) );
  vec3 col2 = randomColor(vec2(g3) );
  vec3 col3 = randomColor(vec2(g2) );
  col1 = COL1;
  col2 = COL2;
  col3 = COL3;

  // float shadow1 = 1.0 - (g1_fract.x * (1.0-g1_fract.y));
  float shadow1 = (g1_fract.y);
  float shadow2 = g2_fract.x;
  float shadow3 = -g2_fract.x;

  vec3 c = mix(WHITE, COL3, abs(sin(g2.x/size.x * 0.5 +t)));
  // vec3 c = mix(WHITE, COL3, abs(sin(st.x* 0.5 +t))*0.75);
  // c = mix(BLUEM, BLUED, mod1 * g2_fract.y);
  // c = mix(BLUEL, BLUEM, mod1);
  // c = mix(c, BLUEM, step(0.5, fract(grid.x)));

  // vec3 a = mix(col2, col3, mod1);
  // vec3 b = mix(col3, col2, (1.0-mod1));
  // vec3 c1 = mix(a, b, 0.0);

  // else c = mix(BLUE, BLUED, sides);
  // c = mix()
  c = mix(c, col2, (1.0-sides2) * shadow2);
  c = mix(c, col3, (1.0-sides) * shadow3);
  c = mix(c, col1, (1.0-tops) * shadow1);
  // c = mix(c, 1.0-WHITE, shadow1);
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