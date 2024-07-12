precision mediump float;

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

#include '../lygia/generative/fbm.glsl'

vec2 random21( vec2 p ) {
    return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
}

float voronoi(vec2 st, float scale) {
  st *= scale;

  vec2 i = floor(st);
  vec2 f = fract(st);

  float d = 1.0;
  for(int y = -1; y <= 1; y++) {
    for(int x = -1; x <= 1; x++) {
      vec2 neighbour = vec2(float(x), float(y));
      vec2 point = random21(i + neighbour);

      vec2 diff = neighbour + point - f;
      
      d = min(d, length(diff));
    }
  }
  return d;
}

float smooth_voronoi(vec2 st, float scale, float smoothness) {
  st *= scale;

  vec2 i = floor(st);
  vec2 f = fract(st);

  float d = 8.0;
  for(int y = -2; y <= 2; y++) {
    for(int x = -2; x <= 2; x++) {
      vec2 neighbour = vec2(float(x), float(y));
      vec2 point = random21(i + neighbour);

      vec2 diff = neighbour + point - f;

      float h = smoothstep(0.0, 1.0, 0.5 + 0.5 * (d-length(diff))/smoothness);    
      d = mix(d, length(diff), h) - smoothness * h * (1.0-h);
    }
  }
  return d;
}

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    st.x *= u_resolution.x / u_resolution.y;
    float t = u_time/10.0;

    st = st * 2.0-1.0;
    st.y += fbm(st+t)*0.08;

    float scale = 5.0;
    float v1 = voronoi(st, scale);
    float v2 = smooth_voronoi(st, scale, 0.3);

    float v3 = voronoi(st+vec2(2.0), scale);
    float v4 = smooth_voronoi(st+vec2(2.0), scale, 0.3);

    vec3 color = vec3(0.2902, 0.8196, 0.9961);
    color = mix(color, vec3(0.1686, 0.5647, 0.9608), (v3-v4)*12.0);
    color = mix(color, vec3(1.0, 1.0, 1.0), (v1-v2)*16.0);
    
    // color = c2;
    // color = mix(c2, c, 0.5);

    gl_FragColor = vec4(color, 1.0);
}