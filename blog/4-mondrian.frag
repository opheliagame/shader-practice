#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

#include "../lygia/generative/random.glsl";
#include "../lygia/generative/cnoise.glsl";

#define RED      vec3(1.0, 0.0, 0.0)
#define YELLOW   vec3(1.0, 1.0, 0.0)
#define BLUE     vec3(0.0, 0.0, 1.0)
#define WHITE    vec3(1.0, 1.0, 1.0)

void main() {
  vec2 st = gl_FragCoord.xy/u_resolution.xy;
  float size = 10.0;
  float t = floor(u_time/2.0);

  vec2 grid = st;
  grid.x *= cnoise(vec2(st.x + t))*size;
  grid.y *= cnoise(vec2(st.y + t))*size;

  vec2 random_c = floor(grid)/size;
  float r = random(random_c);
  float rows = step(0.5, fract(grid.y)) == 0.0 ? r : 0.0;
  vec3 cols = vec3(step(0.5, fract(grid.x + rows))); 
  
  // random_c = floor(grid.x + rows)/size;
  random_c = floor(vec2(grid.x + rows, grid.y*2.0))/size;
  cols = vec3(random(random_c));
  vec3 colorf = vec3(0.0);
  colorf.x = step(random(0.1+r+t), random(random_c));
  colorf.y = step(random(0.2+r+t), random(random_c));
  colorf.z = step(random(0.3+r+t), random(random_c));

  vec2 outline = step(0.1, fract(vec2(grid.x + rows, grid.y*2.0)));
  vec3 color = WHITE;
  color = mix(color, RED, colorf.x);
  color = mix(color, YELLOW, colorf.y);
  color = mix(color, BLUE, colorf.z);
  // color = mix(color, 1.0-WHITE, 1.0-outline.y);
  // color = mix(color, 1.0-WHITE, 1.0-step(0.1, fract(grid.y*2.0)));
  // color = mix(color, 1.0-WHITE, 1.0-outline.x);

  gl_FragColor = vec4(color, 1.0);
}

void main2() {
  vec2 st = gl_FragCoord.xy/u_resolution.xy;
  float size = 8.0;
  float t = random(floor(st.y*size));
  t = floor(u_time/2.0);
  // t = 0.0;

  vec2 grid = st;
  vec2 fgrid = floor(st*size)/size+0.5;
  // grid *= cnoise(fgrid*1.0 + t)*size;
  grid.x *= cnoise(vec2(st.x + t))*size;
  grid.y *= cnoise(vec2(st.y + t))*size;
  // mod_st.x *= random((mod_st.x))*1.0;
  // mod_st = fract(mod_st);
  // mod_st = step(0.5 + cnoise(vec2(st.x)), mod_st);
  // mod_st = step(0.5, mod_st);

  float rv1 = floor(grid.x+st.x);
  float rows = (step(0.5, fract(grid.y))) == 0.0 ? 0.5 : 0.0;

  // vec2 c = floor(vec2(grid.x + rows, grid.y))/size;
  // vec2 c = floor(vec2(grid.x, grid.y))/size;
  float c = floor(grid.x + rows)/size;
  vec3 cols = vec3(step(0.5, fract(grid.x+rows)));
                  // step(0.5, fract(grid.x+rows)), 
                  // step(0.5, fract(grid.y))); 
  // cols = c;
  // cols = vec3(step(0.1, random(c)));
  // cols.x = step(0.1, random(c));
  // cols.y = step(0.2, random(c));
  // cols.z = step(0.5, random(c));
  cols.x = step(random(0.1 +  + t), random(c));
  cols.y = step(random(0.2 +  + t), random(c));
  cols.z = step(random(0.5 +  + t), random(c));
  // cols.x *= (step(random(cols + 10.0 + t), c)); 
  // cols.y *= (step(random(cols + 20.0 + t), c)); 
  // cols.z *= (step(random(cols + 30.0 + t), c));
  // if (cols == vec3(0.0)) cols =   WHITE;

  vec3 grid_c = vec3(cols);
  vec3 col_c = WHITE;  

  float rv = random(cols);
  // if (rv < 0.2) col_c *= YELLOW;
  
  // // cols = step(0.6, fract(grid.x + rows));
  // // rv = random(cols);
  // if (rv > 0.2 && rv < 0.4) col_c *= RED;
  
  // // cols = step(0.8, fract(grid.x + rows));
  // // rv = random(cols);
  // if (rv > 0.4 && rv < 0.6) col_c *= BLUE;

  vec2 mod1 = step(0.1, fract(vec2(grid.x + rows, grid.y*2.0)));
  // vec2 mod1 = step(0.1, fract(grid));

  col_c = mix(col_c, RED, grid_c.x);
  col_c = mix(col_c, YELLOW, grid_c.y);
  col_c = mix(col_c, BLUE, grid_c.z);
  col_c = mix(col_c, 1.0-WHITE, 1.0-mod1.y);
  col_c = mix(1.0-WHITE, col_c, step(0.1, fract(grid.y*2.0)));
  col_c = mix(col_c, 1.0-WHITE, 1.0-mod1.x);

  // col_c = mix(1.0-WHITE, col_c, mod1.x);
  

  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
  gl_FragColor = vec4(col_c, 1.0);
}