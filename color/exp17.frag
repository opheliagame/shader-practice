#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

#define BLUE       vec3(0.56, 0.76, 0.94)
#define PINK       vec3(0.96, 0.69, 0.67)
#define ORANGE     vec3(1.00, 0.78, 0.70)
#define WHITE      vec3(1.00, 1.00, 1.00)
#define YELLOW     vec3(250, 229, 136)/255.0

#include "../lygia/generative/cnoise.glsl";
#include "../lygia/generative/random.glsl";
#include "../lygia/space/rotate.glsl";
#include "../lygia/space/ratio.glsl";
#include "../lygia/sdf/circleSDF.glsl";
#include "../lygia/draw/fill.glsl";

void main() {
  vec2 st = gl_FragCoord.xy/u_resolution.xy;
  st = ratio(st, u_resolution);
  float t = u_time/2.0;
  // t = 0.6;

  // st = rotate(st, radians(t*90.0));
  // float mod2 = cnoise(st.yy + vec2(t, 0.0));
  // mod2 = smoothstep(0.4, 0.5, mod2);
  float sky = step(0.7, st.y) == 1.0 ? 0.01 : st.y;
  sky = smoothstep(0.7-0.1, 0.7+0.1, st.y);
  float n = cnoise(vec2(st.x*1.2, st.y*(st.y)*4.0) * 
            pow((st.y), 1.0) * 10.0);
  // n += cnoise(vec2(n, st.y)+ vec2(t, 0.0));
  float sun = circleSDF(st, vec2(0.8, (sin(t*0.8))+0.8));

  float mod3 = cnoise(st.xx*2.0 * (st.y)*10.0 +t*2.0 + n)/10.0;
  float mod4 = cnoise(vec2(n*0.2));

  float mod1 = smoothstep(0.3, 0.7, n);
  float mod2 = smoothstep(clamp(-abs(sin(t)), -0.5, 0.2), clamp(abs(sin(t)), 0.2, 0.5), n);
  mod2 = smoothstep(0.2, 0.8, n);

  vec3 c = mix(BLUE, ORANGE+0.1*WHITE, smoothstep(0.7-0.1, 0.7+0.1, st.y));
  c = mix(c, mix(WHITE, BLUE, 0.0), (1.0-smoothstep(0.7-0.1, 0.7+0.1, st.y))*n);
  c = mix(c, mix(WHITE, BLUE, 0.5), (sun*1.0)*smoothstep(0.7-0.1, 0.7+0.1, st.y));
  c = mix(c, YELLOW, (1.0-smoothstep(0.3-0.2, 0.3+0.2, sun))*sky);
  c = mix(c, WHITE, mod3*(1.0-sky));
  // c = mix(c, 1.0-WHITE, smoothstep(0.0, 1.0, (sun)*st.y+1.0)*0.2);
  // c = mix(c, YELLOW, n*sky*(1.0-sun));
  // c = mix(c, WHITE, mod2);
  // c = mix(c, ORANGE, mod1);

  gl_FragColor = vec4(ORANGE, 1.0);
  gl_FragColor = vec4(c, sin(t*0.8)*0.5+1.0);
  // gl_FragColor = vec4(c, 1.0);
}