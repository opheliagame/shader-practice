// Author @kyndinfo - 2016
// http://www.kynd.info
// Title: Cubic Bezier
// Original bezier function by Golan Levin and Collaborators
// http://www.flong.com/texts/code/shapers_bez/

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

#define PI 3.1415926538
#define BLACK vec3(0.0)
#define WHITE vec3(1.0)
#define PINK vec3(249/255.0,188/255.0,207/255.0)
#define BLUE vec3(101/255.0,153/255.0,229/255.0)
#define YELLOW vec3(248/255.0,233/255.0,8/255.0)

// Helper functions:
float slopeFromT (float t, float A, float B, float C){
  float dtdx = 1.0/(3.0*A*t*t + 2.0*B*t + C); 
  return dtdx;
}

float xFromT (float t, float A, float B, float C, float D){
  float x = A*(t*t*t) + B*(t*t) + C*t + D;
  return x;
}

float yFromT (float t, float E, float F, float G, float H){
  float y = E*(t*t*t) + F*(t*t) + G*t + H;
  return y;
}
float lineSegment(vec2 p, vec2 a, vec2 b) {
    vec2 pa = p - a, ba = b - a;
    float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );
    return smoothstep(0.0, 1.0 / u_resolution.x, length(pa - ba*h));
}

float cubicBezier(float x, vec2 a, vec2 b){

  float y0a = 0.0; // initial y
  float x0a = 0.0; // initial x 
  float y1a = a.y;    // 1st influence y   
  float x1a = a.x;    // 1st influence x 
  float y2a = b.y;    // 2nd influence y
  float x2a = b.x;    // 2nd influence x
  float y3a = 1.0; // final y 
  float x3a = 1.0; // final x 

  float A =   x3a - 3.0*x2a + 3.0*x1a - x0a;
  float B = 3.0*x2a - 6.0*x1a + 3.0*x0a;
  float C = 3.0*x1a - 3.0*x0a;   
  float D =   x0a;

  float E =   y3a - 3.0*y2a + 3.0*y1a - y0a;    
  float F = 3.0*y2a - 6.0*y1a + 3.0*y0a;             
  float G = 3.0*y1a - 3.0*y0a;             
  float H =   y0a;

  // Solve for t given x (using Newton-Raphelson), then solve for y given t.
  // Assume for the first guess that t = x.
  float currentt = x;
  for (int i=0; i < 5; i++){
    float currentx = xFromT (currentt, A,B,C,D); 
    float currentslope = slopeFromT (currentt, A,B,C);
    currentt -= (currentx - x)*(currentslope);
  	currentt = clamp(currentt,0.0,1.0); 
  } 

  float y = yFromT (currentt,  E,F,G,H);
  return y;
}

vec3 drawPoints(vec3 color, vec2 st, vec2 cp0, vec2 cp1, float px) {
  // draw control points
  color = mix(vec3(0.5), color, lineSegment(st, vec2(0.0), cp0));
  color = mix(vec3(0.5), color, lineSegment(st, vec2(1.0), cp1));
  color = mix(vec3(0.5), color, lineSegment(st, cp0, cp1));
  color = mix(vec3(1.0,0.0,0.0), color, smoothstep(0.01,0.01+px,distance(cp0, st)));
  color = mix(vec3(1.0,0.0,0.0), color, smoothstep(0.01,0.01+px,distance(cp1, st)));
  return color;
}

#include "../lygia/space/ratio.glsl";
#include "../lygia/space/cart2polar.glsl";
#include "../lygia/space/rotate.glsl";
#include "../lygia/draw/fill.glsl";
#include "../lygia/draw/stroke.glsl";
#include "../lygia/sdf/circleSDF.glsl";
#include "../lygia/generative/random.glsl";
#include "../lygia/generative/fbm.glsl";
#include "../lygia/generative/pnoise.glsl";
#include "../lygia/generative/gnoise.glsl";
#include "../lygia/generative/cnoise.glsl";
#include "../lygia/color/blend/difference.glsl";

void main() {
  vec2 st = gl_FragCoord.xy/u_resolution.xy;
  st = ratio(st, u_resolution);
	float t = u_time/2.0;
  t = 0.;

  vec2 ost = st;
  
  float px = 1.0 / u_resolution.y;
  px = 0.2;

  float res = 1.0;
  vec3 color = PINK;
  st = rotate(st, radians(-90));
  st = st * 2.0-1.0;
  st = cart2polar(st);
  st = st/(PI/1.0);
  st = st * 1.2;
  // st = st * 1.5;
  // st = st * 3.0;

  for(int i = 1; i <= 24; i++) {
    float r1 = random(i*1900.0+0.28);
    float r2 = random(i*4.0+212);

    float x = r1 < 0.5 ? st.x : st.y;
    float y = r2 < 0.5 ? st.y : st.x;
    // x = st.x;
    // y = st.y;

    vec2 cp0 = vec2(r1, r2);
    vec2 cp1 = vec2(r2, r1);
    float l1 = cubicBezier(abs(x), cp0, cp1);
    float l = l1;
    // for(int j = 1; j <= int(res); j++) {
    //   // control point    
    //   vec2 p1 = vec2(float(j));
    //   vec2 cp2 = vec2(p1.x + (p1.x - cp1.x)*0.5-float(j), p1.y + (p1.y - cp1.y)*0.5-float(j));
    //   vec2 cp3 = vec2(random(0.5), random(i*10));

      
    //   float l2 = cubicBezier(x-float(j), cp2, cp3);
    //   l = l+l2;


    //   cp0 = cp2;
    //   cp1 = cp3;
    //   // vec3 c1 = mix(PINK, YELLOW, smoothstep(l1, l1+px, clamp(st.y, 0.0, 1.0)));
    //   // vec3 c2 = mix(PINK, YELLOW, smoothstep(l2, l2+px, clamp(st.y, 1.0, 2.0)));
     
    //   // color = drawPoints(color, st, cp2, cp3, px);
    // }
    vec3 c = mix(PINK, YELLOW, smoothstep(l, l+px, abs(y)));
    color = blendDifference(color, c);


    
  }
    
  
  
  
  // color = mix(vec3(1.0,0.0,0.0), color, smoothstep(0.01,0.01+px,distance(cp1, st)));
  
  gl_FragColor = vec4(color, 1.0);
}