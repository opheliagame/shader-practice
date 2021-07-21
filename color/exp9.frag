#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

#define ORANGE   vec3(0.96, 0.40, 0.06)
#define YELLOW   vec3(0.98, 0.96, 0.11)
#define PINK     vec3(0.98, 0.45, 0.45)
#define WHITE    vec3(1.00, 1.00, 1.00)

#include "../lygia/draw/fill.glsl";
#include "../lygia/sdf/circleSDF.glsl";
#include "../lygia/sdf/rectSDF.glsl";
#include "../lygia/generative/random.glsl";
#include "../lygia/generative/cnoise.glsl";
#include "../lygia/color/blend.glsl";
#include "../lygia/space/ratio.glsl";

float circ(vec2 st, float s, float r) {
  float t = u_time/10.0;
  float flip = step(0.5, fract(t)) == 0.0 ? -1.0 : 1.0;

  float mod2 = cnoise(vec2(st*2.0)*1.0+t);
  float mod1 = (sin(st.x*2.0+t)*cos(st.y*4.0+t))*2.0;
 
  vec2 grid = st + vec2(random(s), mod2); 
  mod1 = fill(rectSDF(vec2(fract(mod1)), vec2(0.5)), 0.5, 0.2);
  grid.y += random(s*2.0)*mod1;
                // vec2(cnoise(vec2(s, s*mod1)*1.0+t));
  // grid *= cnoise(st*s)*s;
  // grid.x *= cnoise(vec2(st.x + s*10.0))*s;// + random(s);
  // grid.y *= cnoise(vec2(st.y + s*10.0))*s;// + random(s);
  // grid.x += random(s);
  // grid.y += random(s);
  // grid = fract(grid);

  // float rows = (step(0.5, fract(grid.y))) == 0.0 ? 0.5 : 0.0;
  // float cols = (step(0.5, fract(grid.x+rows)));
  // grid = fract(vec2(grid.x + rows, grid.y));

  // grid = (st*s);
  // vec2 p = vec2( fract(grid.x+rows) , fract(grid.y+0.5));
  // float mod1 = random(cols) == 0.0 ? 0.5 : random(fract(grid));

  vec2 pos = vec2((cnoise(vec2(grid)+s+t)));
  float c1 = fill(circleSDF(fract(grid), vec2(0.5)), 0.3, random(s));
  // return fract(grid.y);
  return c1;
}

void main() {
  vec2 st = gl_FragCoord.st/u_resolution.xy;
  st = ratio(st, u_resolution);
  float t = u_time/5.0;

  // vec3 c = mix(1.0-WHITE, PINK, 0.5);
  vec3 c = mix(WHITE, PINK, 0.5);
  // c = PINK;

  for(int i = 1; i < 30; i++) {
    float s1 = float(i)*2.0;
    float r1 = 1.0/(s1*1.0);
    float c1 = circ(st, s1, r1);

    vec3 p1 = vec3(1.0);
    float toss = random(vec2(s1));
    // toss += cnoise(vec2(toss));
    if (toss < 0.5) p1 = YELLOW;
    else {
      toss = random(vec2(s1+r1));
      if (toss < 0.5) p1 = ORANGE;
      else {
        toss = random(vec2(s1+r1*2.0));
        if (toss < 0.5) p1 = PINK;
        else p1 = WHITE;
      }
    }

    float mod1 = cnoise(p1*0.5+t);
    // mod1 = smoothstep(0.4, 0.6, mod1);
    // mod1 *= 0.1;
    c = blendAverage(c, p1, c1 * 
                smoothstep(0.5-0.1, 0.5+0.1, c1));
    // c = mix(c, p1, mod1*smoothstep(0.0, 1.0, mod1));
    // c = blendAverage(c, p1*c1);//, abs(sin(t)));
  }

  


  gl_FragColor = vec4(PINK, 1.0);
  gl_FragColor = vec4(c, 1.0);
}