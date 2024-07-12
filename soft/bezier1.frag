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
  px = 0.5;

  float res = 4.0;
  vec3 color = PINK;
  st = st * 2.0-1.0;
  st = st * res;

  for(int i = 0; i < 2; i++) {
    float r1 = -(random(i*4.0)*2.0-1.0);
    float r2 = random(i*22.0)*2.0-1.0;

    float l1 = r1*st.x + r2*st.y;
    vec3 ctemp = mix(PINK, YELLOW, l1);
    ctemp = blendDifference(color, ctemp);
 
    float r3 = pnoise(st, vec2(cnoise(st)));

    float sx = cnoise((ctemp.xy)+random(i*10.0));
    float sy = cnoise((ctemp.zy)+random(i*33.0));
    float x = r1 < 0.5 ? sx : sy;
    float y = r2 < 0.5 ? sy : sx;


    // control point
    // vec2 cp0 = vec2(0.25, sin(r1) * 0.25 + 0.5)*res;
    // vec2 cp1 = vec2(0.75, cos(r2) * 0.25 + 0.5)*res;
    // vec2 cp0 = vec2(gnoise(st.x)+0.1, gnoise(t));
    // vec2 cp1 = vec2(gnoise(st.y)-0.1, gnoise(t*2.0));
    vec2 cp0 = vec2(gnoise(sx*2.0+t), gnoise(t));
    vec2 cp1 = vec2(gnoise(sy*1.0+t), gnoise(t*2.0));

    
    float l = cubicBezier(x, cp0, cp1);
    vec3 c = mix(PINK, YELLOW, smoothstep(l, l+px, y));

    color = blendDifference(color, c);
    // color = c;

    // draw control points
    // color = mix(vec3(0.5), color, lineSegment(st, vec2(0.0), cp0));
    // color = mix(vec3(0.5), color, lineSegment(st, vec2(1.0), cp1));
    // color = mix(vec3(0.5), color, lineSegment(st, cp0, cp1));
    // color = mix(vec3(1.0,0.0,0.0), color, smoothstep(0.01,0.01+px,distance(cp0, st)));
    // color = mix(vec3(1.0,0.0,0.0), color, smoothstep(0.01,0.01+px,distance(cp1, st)));
  }
    
  
  
  
  // color = mix(vec3(1.0,0.0,0.0), color, smoothstep(0.01,0.01+px,distance(cp1, st)));
  
  gl_FragColor = vec4(color, 1.0);
}