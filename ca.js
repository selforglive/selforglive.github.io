const DATA = {"max_w":0.2758,"data_b64":"YmJ5p2iAbXZqoJ6DfCOGZWNikmqajbmPenNsjKCCZohiZId4d31gV3GSqXh1gnOQgHp/X0uAbZd5c32Tk8GRXmIgXmmAokmJhYOfgIFrQaB4d4l3f4B9bmx3gw14gmt2bnCQe3lueGMmcX1vh3R2d3x1g4FxPJZzgXl5hX16dHGBgR53gnqAc3x6iGeVaKoAkIN3gnWChH+AioN8f459e3qAfYB9hICEenyQgIVzeXyJdXZ5fX5xrm5+moSMgYB8iIhykXmLkYp+iYOChHp8jHaBi4eGh316g4F6eouSe7KJhIJ8iH5unmyOoJh5ioR4f4GFfH95f4NdfIGHnYFUjGyCjnxikWt8a3yReZKFbIudYGOQZ26Bf5SDeIOldYSWSpWXdWh2inSHnY99gFKBeX50gIGGnpR9XHhFqIaMcnKEZIdxe3p9Tn12dIZ7iIKDeWyIaExyhm2Ga2x7fHxwdIBhg4ZxipJ8iHqXhXRtTn6KfIV2gKRwdHWxf3uUn62rl4WBh4J2gYgykV14gIaMfnd5gIWRLYiNaXeEcYyFcYFugD6DcHiHf5qEgZ2RfGhIj3t2inV+foCDhIB8e4N2g3mAgoF+g4N+eX2Tfod4e3V/eH17koF5pWKAmoOFhXBpXW+ee6NziUuDZWx8hoFzi3GBjmyAgnFukpCGfXh1gXiFgG1peotpoWuKmpx9hoiDZYB/YqSecK9jb5ena3+Nf450dXtwf3uJnpaAfmx3ioKZhXOKgX6BeHx1emebf36ee42NfoBmf3WPe3J5"}
//const DATA = {"max_w":0.283,"data_b64":"MlFZXW/Dc4qDenGFk1uQe5l0l2OElW6OoXJLZnO5amuEh3OOaIt5YYJfjHmWaFCOcmR3cR2TVG6VfJxdeYF4mI8ae5KHkYqCkpKZk6OpTWKHgWuFfYl6boSXfylrmXSEhXyCjnSScnssXoWHcYeQjJR3inR4L2x+cY5RkTHUR6VWMGtwgn2KgXiVcIWhc2o6gHl/fH59f315fX5/fYqAfIOChXp5hXd/gXyGgolziYWIfIJ0fXx7inGIeISRdIiGfnl9hX+BfI+Cd4d/fYOAenlqfnJ3jHeAeX13f4SFeYaHf3SNhpCJjYpmk22KiHZ7h4yJgYp+f3uJi4BrhJOMjJ2EhoWGaXaIeoaFgX9ygnSNgFt6eH55c4WJhINpdnh8VoKfkoSGm3CHjY58fzR0YXCRfnR5hIN9iI46lJRpq3yfeHhaYXdkTHyRhHRsc2B4kaKPjT10jIaGnmGcgnWJepsAoGdwdXxte493eIN+G4B3g5trf5N9kn5QeEF5dZZ9gn1/noB1go8zYYF0c4d7d3aRfYNUNn94f3mIh39hfXJ8pCCDbpWEe2tsj3qCqXU3in+BfoR9f316f32AeIWAfX2DhX57hX58eHyDg4V7fn6Nent6e3N3i3B8g36Pb4uEgXyCgoF7gYWHg4WFeHJudmR7e2JzfXyEhImAfoF+jZhtfI17d29rfm2EdYB7fJGTfH10fYCPboNvioqOgXyKg4d8h4ORbXtyg3mGgJqGf4WCbm16gYGEiXhvfXZ+eHiAeWtqkXN/g4J0jpuH"};

function decodeBase64(b64) {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) {
    bytes[i] = bin.charCodeAt(i);
  }
  return bytes;
}

const shared = `
  precision highp float;
  uniform sampler2D state;
  uniform sampler2D perception;
  uniform sampler2D caParams;
  uniform float maxW;
  uniform vec2 size;
  uniform vec2 mousePos;
  uniform float seed;
  uniform float reset;
  varying vec2 uv;

  const float PQ = 4.0;
  const float Qzero = 127.0/255.0;
`;
const minVP = `
  attribute vec4 position;
  varying vec2 uv;
  void main() {
    uv = position.xy*0.5+0.5;
    gl_Position = position;
  }`;

const percProg = `
  float band;
  vec2 xy;
  vec4 R(int dx, int dy) {
    vec2 p = fract((xy+vec2(dx, dy))/size);
    p.x = (p.x+band)/3.0;
    return texture2D(state, p);
  }
  void main() {
    band = floor(gl_FragCoord.x/size.x);
    xy = gl_FragCoord.xy;
    xy.x -= band*size.x;
    vec4 ul=R(-1,1),  u=R(0,1),  ur=R(1,1);
    vec4  l=R(-1,0),              r=R(1,0);
    vec4 dl=R(-1,-1), d=R(0,-1), dr=R(1,-1);
    if (band==0.0) {
      vec4 c = R(0,0);
      gl_FragColor = (ul+ur+dl+dr)+2.0*(u+l+d+r)-12.0*c;
    } else {
      vec4 gx = ur+2.0*r+dr-ul-2.0*l-dl;
      vec4 gy = ul+2.0*u+ur-dl-2.0*d-dr;
      vec2 d = vec2(0.0, 1.0);
      vec2 diff = abs(mousePos-xy);
      diff = min(diff, size-diff);
      float r = length(diff);
      float a = 3.14*exp(-r*r/1e4);
      float s=sin(a), c=cos(a);
      d = d*mat2(c, s, -s, c);
      //vec2 d = normalize(mousePos-xy);
      //d = d*mat2(0.71, 0.71, -0.71, 0.71);
      gl_FragColor = band==1.0 ? gx*d.x+gy*d.y: 
                                -gx*d.y+gy*d.x;
    }
    gl_FragColor = gl_FragColor/PQ + Qzero;
  }`;

const updateProg = `
  const vec2 Wsize = vec2(12./4., 49.);

  vec4 hash43(vec3 p) {
      vec4 p4 = fract(vec4(p.xyzx)  * vec4(.1031, .1030, .0973, .1099));
      p4 += dot(p4, p4.wzxy+33.33);
      return fract((p4.xxyz+p4.yzzw)*p4.zywx);
  }
  vec4 getParam(float band, float i) {
    vec4 v = texture2D(caParams, (vec2(band, i)+0.5)/Wsize);
    return ((v-Qzero)/Qzero)*maxW;
  }
  void main() {
    vec2 xy = gl_FragCoord.xy/size;
    float band = floor(xy.x);
    xy = fract(xy);
    if (reset > 0.0) {
      gl_FragColor = vec4(Qzero);
      return;
    }
    vec4 y[6];
    for (int i=0; i<3; ++i) {
      vec2 p = vec2((xy.x+float(i))/3.0, xy.y);
      y[i] = (texture2D(state, p)-Qzero)*2.0;
      y[3+i] = (texture2D(perception, p)-Qzero)*PQ*2.0;
    }    
    vec4 x = (band==0.) ? y[0] : ((band==1.) ? y[1] : y[2]);
    vec4 dx = getParam(band, 48.);
    for (int i=0; i<6; ++i) {
        vec4 s=0.5-sign(y[i])*0.5;
        #define T(k) dx += getParam(band, float(i*4+k)+s[k]*24.0)*y[i][k]
        T(0); T(1); T(2); T(3);
    }
    vec4 mask = floor(hash43(vec3(gl_FragCoord.xy, seed))+0.5);
    x += dx*mask;
    x = x*0.5+Qzero;
    gl_FragColor = x;
  }
`;

const visProg = `
  void main() {    
    vec3 v = texture2D(state, uv/vec2(3.0, 1.0)).rgb*2.0-0.5;
    gl_FragColor = vec4(v, 1.0);
}`;

export class CA {
    constructor(gl, size) {
        this.gl = gl;
        this.size = size;
        const [w, h] = size;

        const [src, dst, perc] = [0, 1, 2].map(
            ()=>twgl.createFramebufferInfo(gl, [{ minMag: gl.NEAREST}], w*3, h));
        this.buf = {src, dst, perc};

        this.quad = twgl.createBufferInfoFromArrays(gl, {
            position: [-1,-1,0, 1,-1,0, -1,1,0, 1,1,0],
        });

        const caParams = twgl.createTexture(gl, {width:3, height: 48+1, 
            src: decodeBase64(DATA.data_b64), minMag: gl.NEAREST});
        
        this.uniforms = {
            caParams: caParams,
            perception: perc.attachments[0],
            state: src.attachments[0],
            size: size,
            seed: 0,
            mousePos: [-1, -1],
            maxW: DATA.max_w,
        };

        this.progs = {
            perc: twgl.createProgramInfo(gl, [minVP, shared+percProg]),
            update: twgl.createProgramInfo(gl, [minVP, shared+updateProg]),
            vis: twgl.createProgramInfo(gl, [minVP, shared+visProg]),
        }

        this.step(1);
    }

    step(reset) {
        this.uniforms.seed = Math.random()*1000;
        this.uniforms.reset = reset || 0.0;
        this.runProgram(this.progs.perc, this.buf.perc);
        this.runProgram(this.progs.update, this.buf.dst);
        [this.buf.src, this.buf.dst] = [this.buf.dst, this.buf.src];     
        this.uniforms.state = this.buf.src.attachments[0];  
    }

    runProgram(program, target) {
        const gl = this.gl;
        twgl.bindFramebufferInfo(gl, target);
        gl.useProgram(program.program);
        twgl.setBuffersAndAttributes(gl, program, this.quad);
        twgl.setUniforms(program, this.uniforms);
        twgl.drawBufferInfo(gl, this.quad, gl.TRIANGLE_STRIP);
    }

    render() {
        const gl = this.gl;
        const program = this.progs.vis;
        gl.useProgram(program.program);
        twgl.setBuffersAndAttributes(gl, program, this.quad);
        twgl.setUniforms(program, this.uniforms);
        twgl.drawBufferInfo(gl, this.quad, gl.TRIANGLE_STRIP);
    }
}


