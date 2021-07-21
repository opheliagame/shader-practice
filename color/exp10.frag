#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

#define LGREEN    vec3(0.01, 0.78, 0.36)
#define DGREEN    vec3(0.12, 0.60, 0.33)
#define YGREEN    vec3(0.50, 1.00, 0.00)
#define WHITE     vec3(1.00, 1.00, 1.00)

#include "../lygia/draw/fill.glsl";
#include "../lygia/sdf/circleSDF.glsl";
#include "../lygia/generative/random.glsl";
#include "../lygia/generative/cnoise.glsl";
#include "../lygia/color/blend.glsl";
#include "../lygia/space/ratio.glsl";
#include "../lygia/space/rotate.glsl";

vec3 randomColor(float v1, float v2) {
  vec3 p1 = vec3(1.0);
  float toss = random(vec2(v1));
  // toss += cnoise(vec2(toss));
  if (toss < 0.5) p1 = LGREEN;
  else {
    toss = random(vec2(v1+v2));
    if (toss < 0.5) p1 = DGREEN;
    else p1 = YGREEN;
  }
  return p1;
}

vec4 circ(vec2 st, float s, float r) {
  float t = u_time;
  t = 0.0;
  float mod2 = cnoise(vec2(st*2.0)*1.0+t);
  float mod1 = (sin(st.x*2.0+t)*cos(st.y*4.0+t))*2.0;
  vec2 grid = st + vec2(random(s), sin(s*2.0+st*0.5+t/2.0));
  grid = st + vec2(random(s*10.0), cnoise(vec2(s)*3.24));
  // grid = st + vec2(sin(s+mod2*2.0+t)); 
  // grid += cos(s+t);
 
  float mod3 = abs(sin(t/5.0))*0.25;
  mod3 = 0.0;
  float c1 = fill(circleSDF(fract(grid), vec2(0.5)), 0.25+mod3, 0.1);
  vec2 mod_st = rotate(fract(grid), t+random(s), vec2(0.5));
  float c2 = fill(circleSDF(fract(mod_st), vec2(0.5-0.025, 0.5+0.025)), 0.2+mod3, 0.3);

  float n = cnoise(vec2(grid*2.0)+t); 

  vec3 c = mix(WHITE, YGREEN, 0.6);
  c = WHITE;
  vec3 col = mix(c, randomColor(s, r), 
        smoothstep(0.5-0.2, 0.5+0.2, c1));
  col = mix(col, WHITE, 
        mod_st.y*1.5*smoothstep(0.5-0.2, 0.5+0.2, c2));

  // c1 = mix(c1, 0.0, (mod_st.y*c2));
  // c2 = mix(c1, 1.0, 1.0-c1);
  // return fract(grid.y);
  return vec4(col, c1);
}

void main() {
  vec2 st = gl_FragCoord.xy/u_resolution.xy;
  st = ratio(st, u_resolution);
  float t = u_time/1.0;
  int size = 16;

  vec2 mod_st = rotate(st, radians(45.0), vec2(0.5));

  vec3 c = mix(WHITE, YGREEN, 0.0);
  // c = WHITE;
  float allcircs = 1.0;
  vec3 tempc1 = WHITE;
  vec3 tempc2 = WHITE;
  tempc1 = c;

  vec3 intersect = WHITE;

  for(int i = 1; i <= size; i++) {
    float s = float(i)*1.2;
    float r = 1.0/s;
    vec4 c1 = circ(st, s, 0.5);

    c = mix(c, c1.rgb, smoothstep(0.5-0.1, 0.5+0.1, c1.w));


    // float inter = step(0.5, c1);
    // inter = smoothstep(0.5-0.1, 0.5+0.1, c1);
    // allcircs = min(inter, allcircs);
    // allcircs -= inter;
    // allcircs = c1;

    // vec3 col1 = randomColor(s, r);
    // // tempc = col1;
    // tempc1 = mix(tempc1, col1, c1);
    // // tempc1 = mix(tempc1, WHITE, c1);
    // // tempc1 = blendLighten(tempc1, WHITE, smoothstep(0.5-0.2, 0.5+0.2, c1));
    // // tempc2 = mix(tempc2, WHITE, tempc1)
    // // tempc1 = blendDarken(tempc1, col1, smoothstep(0.5-0.1, 0.5+0.1, c1));
    // // tempc = blend(tempc, col1, smoothstep(0.5-0.1, 0.5+0.1, c1));
    // // col1 = mix(col1, WHITE, sin(mod_st.y)*1.2);
    // // c = blendLighten(c, col1, 0.5);
    // // tempc = blendAverage(tempc, col1 * smoothstep(0.5-0.1, 0.5+0.1, c1));

    // c = mix(c, col1, inter);
    // c = tempc1;
    // intersect = mix(intersect, 1.0-WHITE, inter);
  }

  // vec3 col1 = randomColor(1.0, 0.5);
  // c = vec3((allcircs));
  // c = fract(c);

  gl_FragColor = vec4(YGREEN, 1.0);
  gl_FragColor = vec4(c, 1.0);
}