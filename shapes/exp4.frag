#version 330
#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.1415926538
#define BLACK vec3(0.)
#define WHITE vec3(1.)

uniform vec2 u_resolution;
uniform float u_time;

#include "../lygia/space/ratio.glsl";
#include "../lygia/space/cart2polar.glsl";
#include "../lygia/sdf/circleSDF.glsl";
#include "../lygia/sdf/rectSDF.glsl";
#include "../lygia/sdf/opUnion.glsl";
#include "../lygia/sdf/opSubtraction.glsl";
#include "../lygia/draw/fill.glsl";

float randomSDF(vec2 st){
  
  // Define the center and radius of the arch
  vec2 center=vec2(.5,.5);
  float radius=.2;
  
  // Determine the number of foils
  int numFoils=5;
  
  // Calculate the angle for each foil
  float angleIncrement=radians(360./float(numFoils*2));
  
  // Calculate the distance from the current fragment to the center
  
  float dist = length(st - center);
  
  // Create a mask for the arch shape
  float mask=0.;
  for(int i=0;i<numFoils;i++){
    float angle=float(i)*angleIncrement + angleIncrement/2;
    vec2 foilPosition=center+vec2(cos(angle),sin(angle))*radius;
    float foilDistance=length(st-foilPosition);
    mask=max(mask,smoothstep(.0,.1,radius-foilDistance));
  }
  mask = max(mask, smoothstep(0.0, 1.0, (1.0-length(st-center))*radius));

  // return (1.0-length(st-center))*2.0;
  return (1.0-length(st-center))*(2.0);
  return mask;
}

float arch1(vec2 st) {
  
  float c = (circleSDF(st));//, 1., .01);
  float r = (rectSDF(st+vec2(0.0, 0.5), vec2(1.0)));//, 1., .01);

  float s = min(r, c);
  
  vec2 st1 = floor(cart2polar(st*2.0-1.0)*0.3);
  float s1 = 0.0;
  // for(int i = 0; i < 2; i++) {
  //   float a = radians(i * 90);
  float a = atan(st1.x, st1.y);

    s1 = circleSDF(st, vec2(cos(a), sin(a))*0.5+vec2(0.5))*2.0;
// s1 = circleSDF(st1);
    // s1 = max(s1, c);
    // s1 = opUnion(s1, c);
    // s1 = c;
    // s = min(s, c);
  // }


  return s1;

}

void main(){
  vec2 st=gl_FragCoord.st/u_resolution.xy;
  st=ratio(st,u_resolution);
  float t=u_time/2.;
  
  float c=fill(circleSDF(st),1.,.1);
  
  float s=fill(arch1(st),1.,.01);
  
  vec3 color=vec3(s);
  
  gl_FragColor=vec4(color,1.);
  
}