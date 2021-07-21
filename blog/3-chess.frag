#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

void main() {
  vec2 st = gl_FragCoord.xy/u_resolution.xy;
  vec2 grid = st*5.0;
  float rows = step(0.5, fract(grid.y)) == 0.0 ? 0.5 : 0.0;
  float cols = step(0.5, fract(grid.x + rows));

  vec3 board = vec3(cols);
  gl_FragColor = vec4(board, 1.0);
}