#ifdef GL_ES
precision mediump float;
#endif

#define BLUEM      vec3(4, 92, 199)/255.0
#define BLUEL      vec3(92, 162, 247)/255.0
// #define BLUED      vec3(1, 53, 105)/255.0
#define BLUE       vec3(0.56, 0.76, 0.94)
// #define BLUED      vec3(37, 19, 138)/255.0
#define WHITE      vec3(1.0)
#define PINK     vec3(0.97, 0.90, 0.90)
// #define PINK     vec3(1.0, 0.8902, 0.7216)
#define BLUED     vec3(0.4902, 0.5843, 1.0)

uniform vec2 u_resolution;
uniform float u_time;

#include "../lygia/generative/cnoise.glsl";
#include "../lygia/generative/random.glsl";
#include "../lygia/generative/fbm.glsl";
#include "../lygia/space/ratio.glsl";
#include "../lygia/sdf/circleSDF.glsl";
#include "../lygia/draw/fill.glsl";

void main() {
  vec2 st = gl_FragCoord.xy/u_resolution.xy;
  st = ratio(st, u_resolution);
  float t = u_time/20.0;


  float inv_y = 1.0-st.y + 0.2;
  vec2 st1 = st*5.0;

  float y1 = 1.0-(st.y-1.5);
  vec2 c_size = vec2(y1*10.0, pow(y1, 2.0)  * 50.0);
  // c_size *= circ;

  float cloud = 0.0;
  float reflections = 0.0;
  float water = 0.0;
  float temp = 0.0;
  for(int i = 0; i < 2; i++) {
    float n = float(i);
    
    float c1 = fbm(vec2(st.x*3.0*y1, pow(1.0-st.y+0.7, 3.0)*4.0) + vec2(-t/2.0, t)); 
    // float c1 = fbm(vec2(st.x, 1.0-st.y)*2.0); 
    if(c1 > 0.0) cloud += c1;  
    else cloud += c1/5.0;  
    // cloud += 1.0-temp;


    float c2 = fbm(vec2(st.x*3.0*y1, pow(st.y+0.7+0.4, 3.0)*4.0) + vec2(-t/2.0, t)); 
    // float c2 = fbm(vec2(st.x, st.y+0.4)*2.0); 
    vec2 size = vec2(4.0, 6.0)*10.0;
    float ny = st.y+0.5;
    float grid1 = cnoise(vec2(st.y*2.0, st.y*0.5) * (ny) * size/1.2 + vec2(t*5.0));

    // float grid1 = cnoise(vec2(st.x*2.0, st.y*st.y*10.0)*st.y*10.0  + t);
    // float grid2 = cnoise(vec2(st.x*2.0*ny, st.x-ny*ny*10.0) * (ny)  + vec2(t));
    float grid2 = cnoise(vec2(st.x*60.0*ny, st.y*2.0) * (ny)  + vec2(t));
    float w = mix(grid1, grid2, 0.5) + random(st+t);
    w = grid1 * grid2 + random(c1)/3.0;
    
    float mod1 = 1.0- (st.y - cnoise(st.xy*10.0));
    // if(c2 > 0.0) reflections += c2*water;  
    if(c2 > 0.0) reflections += c2*0.5;
    water += w;
    
  }
  
  float horizon = smoothstep(0.15-0.08, 0.15+0.08, st.y);
  float h2 = smoothstep(0.3-0.1, 0.3+0.1, st.y);
  float h3 = smoothstep(0.15-0.1, 0.15+0.1, st.y);
  vec3 c = mix(BLUEL, BLUEL, horizon);
  c = mix(c, BLUED, st.y*1.0);
  c = mix(c, WHITE, cloud*st.y);
  c = mix(c, BLUED, (1.0-st.y-0.5)*(1.0-h3));
  c = mix(c, mix(WHITE, BLUEL, 0.75), water*(1.0-h3));
  c = mix(c, WHITE, reflections*(1.0-h3)*(1.0-st.y));
  // c = mix(c, WHITE, water*(1.0-h3));
  // c = mix(c, WHITE, smoothstep(0.15-0.05, 0.15+0.05, st.y)*(1.0-horizon));

  // c = mix(WHITE, 1.0-WHITE, st.x+st.y);
 

  gl_FragColor = vec4(BLUE, 1.0);
  gl_FragColor = vec4(c, 1.0);
}