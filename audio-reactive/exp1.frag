#version 330
#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.1415926538
#define BLACK vec3(0.0)
#define WHITE vec3(1.0)
#define PINK vec3(249/255.0,188/255.0,207/255.0)
#define BLUE vec3(101/255.0,153/255.0,229/255.0)
#define YELLOW vec3(248/255.0,233/255.0,8/255.0)
#define ORANGE vec3(255/255.0, 163/255.0, 51/255.0)

uniform vec2 u_resolution;
uniform float u_time;
uniform sampler2D u_tex0;
uniform vec2 u_tex0Resolution;
uniform sampler2D u_tex1;
uniform vec2 u_tex1Resolution;
uniform sampler2D u_tex2;
uniform vec2 u_tex2Resolution;
uniform sampler2D u_tex3;
uniform vec2 u_tex3Resolution;
uniform sampler2D u_tex4;
uniform vec2 u_tex4Resolution;
uniform sampler2D u_tex5;
uniform vec2 u_tex5Resolution;


#include "../lygia/space/ratio.glsl";
#include "../lygia/space/cart2polar.glsl";
#include "../lygia/space/rotate.glsl";
#include "../lygia/draw/fill.glsl";
#include "../lygia/draw/stroke.glsl";
#include "../lygia/sdf/rectSDF.glsl";
#include "../lygia/sdf/circleSDF.glsl";
#include "../lygia/sdf/raysSDF.glsl";
#include "../lygia/sdf/flowerSDF.glsl";
#include "../lygia/generative/random.glsl";
#include "../lygia/generative/gnoise.glsl";
#include "../lygia/generative/cnoise.glsl";
#include "../lygia/generative/fbm.glsl";
#include "../lygia/generative/snoise.glsl";



void main() {
  vec2 uv = gl_FragCoord.st/u_resolution.xy;
  // uv = ratio(uv, u_resolution);
  float t = u_time/2.0;


  vec2 st1 = cart2polar(uv);
  // Frequency.
  float fft = texture2D(u_tex0, vec2(uv.x, 0.)).x;

  // Volume.
  float vol = texture2D(u_tex0, vec2(uv.x, 0.)).y;

  float dx = gnoise(fft+t);
  float dy = gnoise(fft+t*2);
  vec2 d1 = vec2(dx, dy);

  vec2 st2 = (gl_FragCoord.st/u_tex3Resolution.xy);
  float mod1 = cnoise(uv*15.00+d1+t)*0.005;
  float mod2 = cnoise(st2*10.0+d1+t)*0.005;
  float mod3 = gnoise(floor(uv.y*100.0+t))*0.005;

  float n = gnoise(fft);

  vec4 i1 = texture2D(u_tex1, uv + mod1);
  vec4 i2 = texture2D(u_tex2, uv + mod1);
  vec4 i3 = texture2D(u_tex3, uv + mod1);
  vec4 i4 = texture2D(u_tex4, uv + vec2(0.0, mod3));
  vec4 i5 = texture2D(u_tex5, uv + mod1);

  float r1 = floor(random(fft) * 10.0);
  vec2 st = floor(uv * r1);
  float b1 = random(st) < 0.5 ? 1 : 0;

  float c = fill(rectSDF(uv+vec2(0.0, 0.565)), 1.0, 0.01);

  vec3 color = mix(BLACK, WHITE, st.x);
  // color = mix(color, YELLOW, n);



  float b2 = i3.x * (gnoise( (fft*3.0) +t));
  // float b2 = i3.z;
  b2 += fbm(uv+t*0.0001*fft);
  // vec4 tex = mix(i3, i4, gnoise(i3.x* fft*10.0 +t));
  vec4 tex = mix(i4, i3, 1.0-c);
  // vec3 tex = mix(i3.xyz, i4.xyz, b2);
  // tex = i3;


  gl_FragColor = tex;
  // gl_FragColor = vec4(tex, 1.0);
  // gl_FragColor = vec4(color, 1.0);
  // gl_FragColor = i3;


}