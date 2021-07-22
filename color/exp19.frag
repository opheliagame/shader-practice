#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

#define BLUEM      vec3(4, 92, 199)/255.0
#define BLUEL      vec3(92, 162, 247)/255.0
// #define BLUED      vec3(1, 53, 105)/255.0
#define BLUE       vec3(0.56, 0.76, 0.94)
#define BLUED      vec3(37, 19, 138)/255.0
#define WHITE      vec3(1.0)
#define PINK     vec3(0.97, 0.90, 0.90)

#include "../lygia/space/ratio.glsl";
#include "../lygia/generative/cnoise.glsl";
#include "../lygia/generative/random.glsl";

void main() {
  vec2 st = gl_FragCoord.xy/u_resolution.xy;
  st = ratio(st, u_resolution);
  float t = u_time/5.0;
  // t = 0.0;

  vec2 size = vec2(4.0, 6.0)*2.0;
  float horizon = 1.0-smoothstep(0.6-0.1, 0.6+0.1, st.y);
  float n1 = cnoise(vec2((st.x)*4.0, st.y*st.y*20.0) * (st.y) * size + t);
  float n2 = cnoise(st.yy*n1*0.5);

  vec2 grid = st * size;
  vec2 grid1 = vec2(st.x, st.x+st.y*10.0)*10.0*st.y;
  vec2 grid2 = vec2(st.x, st.x-st.y*10.0)*1.0*st.y+ t;
  float mod1 = cnoise(vec2(st.x*5.0+t, cnoise(vec2(st.y*st.y))*1.0) 
               )/1.0;
  float mod2 = cnoise(st.xx*2.0 * 
                (st.y)*10.0 +t*5.0 + n1)/5.0;
  float mod3 = cnoise(grid1);
  float mod4 = cnoise(grid2);
  mod1 = mix(mod3, mod4, 0.5);

  // float y1 = 1.0- (st.y-random(st.y));  // reflections
  float y1 = 1.0- (st.y-0.7);  // reflections
  float cloud = cnoise(vec2(st.x*2.0, y1*pow(y1, 5.0)) * y1 * 6.0 + vec2(0.0, t));

  vec3 c = mix(BLUE, BLUE, 1.0-horizon);
  c = mix(c, mix(BLUEL, BLUE, 0.5), horizon*(1.0-n1)*y1*0.75);
  // c = mix(BLUE, BLUEM, horizon);
  // c = mix(c, BLUE, n2*horizon);
  // c = mix(c, BLUE, mod4*horizon);
  // c = mix(c, BLUE, mod3*horizon);
  c = mix(c, BLUEL, mod1*horizon);

  float horizon1 = smoothstep(0.8-0.1, 0.8+0.1, st.y);
  c = mix(c, PINK, cloud*horizon1);
  c = mix(c, PINK, smoothstep(0.7-0.3, 0.7+0.3, st.y)*(1.0-horizon1-0.2));

  gl_FragColor = vec4(BLUEM, 1.0);
  gl_FragColor = vec4(c, 1.0);
}