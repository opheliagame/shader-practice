#version 330
#ifdef GL_ES
precision mediump float;
#endif

// recreating day 1 
// https://i.pinimg.com/564x/de/6c/5c/de6c5c0122e00fe4ebabb75f37e9d5ee.jpg


#define PI 3.1415926538
#define BLACK vec3(0.0)
#define WHITE vec3(1.0)
#define GREEN vec3(9, 158, 86)/255.0
#define ORANGE vec3(255, 128, 59)/255.0
#define PINK vec3(	255, 147, 142)/255.0
#define BLUE vec3(2, 8, 135)/255.0
#define YELLOW vec3(251/255.0,209/255.0,100/255.0)
#define RED vec3(255, 62, 65)/255.0
#define GREY1 vec3(222,223,224)/255.0
#define GREY2 vec3(230,230,231)/255.0
#define GREY3 vec3(186,185,177)/255.0
#define GREY4 vec3(216,217,216)/255.0
// #define GREEN vec3(1, 32, 15)/255.0
// #define sfract(x)      min( fract(x)/(1.-fwidth(x)), fract(-(x))/fwidth(x) ) // or 1.5*fwidth
// #define sf(x)     smoothstep( .1, .9 -step(.4,abs(x-.5)) , x-step(.9,x) )
// #define sfract(x) sf(fract(x))

uniform vec2 u_resolution;
uniform float u_time;

#include "../lygia/space/ratio.glsl";
#include "../lygia/space/cart2polar.glsl";
#include "../lygia/space/rotate.glsl";
#include "../lygia/draw/fill.glsl";
#include "../lygia/draw/stroke.glsl";
#include "../lygia/sdf/rectSDF.glsl";
#include "../lygia/sdf/starSDF.glsl";
#include "../lygia/sdf/polySDF.glsl";
#include "../lygia/sdf/circleSDF.glsl";
#include "../lygia/sdf/raysSDF.glsl";
#include "../lygia/sdf/rhombSDF.glsl";
#include "../lygia/sdf/flowerSDF.glsl";
#include "../lygia/generative/random.glsl";
#include "../lygia/generative/gnoise.glsl";
#include "../lygia/generative/cnoise.glsl";
#include "../lygia/generative/pnoise.glsl";
#include "../lygia/generative/fbm.glsl";
#include "../lygia/generative/snoise.glsl";
#include "../lygia/color/blend/average.glsl";
#include "../lygia/color/blend/softLight.glsl";

vec2 random21( vec2 p ) {
    return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
}

float voronoi(vec2 st, vec2 center, float scale) {
  st *= scale;

  // find coords of own and neighbour center 
  // vec2 i = center;


  vec2 i = floor(st);
  vec2 f = fract(st);

  float d = 1;

  for(int y = -1; y <= 1; y++) {
    for(int x = -1; x <= 1; x++) {
      vec2 neighbour = vec2(float(x), float(y));
      // vec2 point = fract(center);
      vec2 point = random21(i + neighbour);

      vec2 diff = neighbour + point - f;
      
      d = min(d, length(diff));
    }
  }
  return d;
}

vec2 getHexUv(vec2 st) {
  vec2 s = vec2(1.0, 1.73);
  vec4 hexIndex = round(vec4(st, st - vec2(0.5, 1.0)) / s.xyxy);
  vec4 offset = vec4(st - hexIndex.xy*s, st - (hexIndex.zw + 0.5)*s);
  vec4 res = dot(offset.xy, offset.xy) < dot(offset.zw, offset.zw) 
    ? vec4(offset.xy, hexIndex.xy) 
    : vec4(offset.zw, hexIndex.zw);

  vec2 uv = (res.xy+0.5);
  return uv;
}

float sFract(float x, float sm){
    
    // Extra smoothing factor. "1" is the norm.
    const float sf = 1.; 
    
    // The hardware "fwidth" is cheap, but you could take the expensive route and
    // calculate it by hand if more quality was required.
    vec2 u = vec2(x, fwidth(x)*sf*sm);
    
    // Ollj's original formula with a transcendental term omitted.
    u.x = fract(u.x);
    u += (1. - 2.*u)*step(u.y, u.x);
    return clamp(1. - u.x/u.y, 0., 1.); // Cos term ommitted.
}

float shape1(vec2 st) {
  st = fract(st);
  vec2 pos = vec2(0.5)-st;

  float r = length(pos)*1.0;
  float a = atan(pos.y,pos.x);
  // float a = sin(pos.y);
  // float a = 1.0-smoothstep(0.0, 1.0, atan(pos.y,pos.x));

  float f = (cos(a*3.0));
  return f;
}

float aafract(float x) {    // --- antialiased fract
    float v = fract(x),
          w = fwidth(x);    // NB: x must not be discontinuous or factor discont out
    return v < 1.-w ? v/(1.-w) : (1.-v)/w; // replace right step by down slope (-> chainsaw is continuous).
            // shortened slope : added downslope near v=1 
}

void main() {
  vec2 st = gl_FragCoord.st/u_resolution.xy;
  st = ratio(st, u_resolution);
  float t = u_time/2.0;

  st = (st*4.0);
  vec2 g1 = floor(st);

  st = mod(floor(st.x), 2.0) == 0.0 ? rotate(st, radians(180)) : rotate(st, radians(0));
  st = mod(floor(st.y), 2.0)+mod(floor(st.x), 2.0) == 0.0 ? rotate(st, radians(-90)) : rotate(st, radians(0));
  st = mod(floor(st.y), 2.0)+mod(floor(st.x), 2.0) == 2.0 ? rotate(st, radians(-90)) : rotate(st, radians(0));
  st = fract(st);
  // st = vec2(aafract(st.x), aafract(st.y));

  vec2 s = vec2(1.0, 1.73);
  // st = st+s;


  vec2 uv = getHexUv(st*3.0);
  vec2 uv1 = getHexUv((st+vec2(0.5, 0.1))*3.0);
  
  
  // float r1 = rhombSDF(rotate(uv+vec2(0.0, -(1/1.73)/2), radians(90)));
  float r1 = polySDF(uv, 6);
  float r2 = polySDF(uv1, 6);
  // float r3 = starSDF(uv, 6, 0.83);
  float r3 = shape1((st));
  float r4 = starSDF((st), 6, 0.1);

  // st = vec2(sFract(st.x, 0.1), sFract(st.y, 0.1));
  // st = fract(st);

  // float mod1 = floor(cnoise(g1*0.0+ floor(st*2.0)+t)*2.0+1.0);

  float beats[5] =  float[5](0.25, 0.5, 0.66, 0.82, 1.0);

  float t1 = t*120.0/60.0/4.0;
  float t2 = t*150.0/60.0;
  float beat = mod(floor(t1), 4.0);
  // beat = floor(t);
  bool isFirstBeat = floor(beat) == 0.0; 
  bool isSecondBeat = floor(beat) == 1.0; 


  float ft = 1.0;
  for(int i = 0; i < 5; i++) {
    float b = beats[i];

    if(fract(t1) > b) {
      continue;
    }
    else {

    ft = min(ft, b);
    }
  }

  float tforbeat = 1.0-step(ft-0.01, fract(t1)); 
  // tforbeat = step(0.5, st.x);/

  bool isBeat = tforbeat == 0.0;

  float t11 = beat/4.0*t2;

  float mod1 = floor(
    ( cnoise(floor(st*2.0))
  // + ( tforbeat * random(floor(beat*t)) )
  + tforbeat*random(floor(t))
  // * ( random(floor(beat*t/4.0)) *2.0)
  )*2.0+1.0);
  // float mod1 = floor(((floor(st))+ beat)*2.0+1.0);

  // st = fract(st*2.0);
  // r4 = 1.0-min(abs(st.x/st.y), abs(st.y/st.x))*(abs(sin(t))*1.0+1.0);
  // st = st*2.0-1.0;
  r4 = 1.0-min(abs(st.x/st.y), abs(st.y/st.x))*mod1;
  // r4 = 1.0-max(abs(st.x/0.5), abs(st.y/0.5))*1.0;
  
  float l1 = 1.0-smoothstep(r3, r3+0.02, (r4*2.5));
  //  - smoothstep(r3, r3+.05, r4*.0);

  float l2 = 1.0-smoothstep((r3), smoothstep(r3, r3+0.01, 10.0),  length(vec2(0.5)-st)*3.0 - r4);
  // float l2 = 1.0-smoothstep((r3), smoothstep(r3, r3+2.5, r3*3.0+0.5), r4*2.0);

  vec3 color = WHITE;
  // color = mix(color, WHITE, fill(r1, 0.8, 0.01));
  // color = mix(color, GREY1, stroke(r2, 0.9, 0.1, 0.01));
  // color = mix(color, BLUE, 1.0-smoothstep(r3,r3+0.01, length(vec2(0.5)-st)*3.0));
  // color = mix(color, BLUE, 1.0-smoothstep(r3,r3+0.05, r4*2.0));
  color = mix(color, GREEN, fract(ft*1.0));
  // color = mix(color, BLUE, tforbeat*random(floor(t)));
  // color = mix(color, BLUE, tforbeat);
  color = mix(color, BLUE, l2);
  // color = mix(color, isBeat ? BLUE : GREEN, 0.5);
  // color = mix(color, BLUE, 1.0-min(abs(st.x/st.y), abs(st.y/st.x))*2.0);
  


  gl_FragColor = vec4(color, 1.0);


}