<script src="swissgl.js"></script>

# SwissGL/GPU: tiny libraries for tiny and beautiful programs on the web

<canvas id="c" width="600" height="600"></canvas>

[ALIFE 2024](https://2024.alife.org/) Tutorial


**Organizers:**
[Alexander Mordvintsev](https://znah.net/)

**Keywords:** webgl, webgpu, gpu, shaders, particle systems, self-organization, cellular automata

Artificial Life is beautiful to watch and fascinating to interact with, and the modern Web has graphics and compute capabilities to share this beauty with the world. Over the last few years I developed a number of GPU-powered Web-native interactive ALife simulations, including Neural Cellular Automata and various agent-based systems. My experience culminated in a few principles of building expressive minimalist GPU API abstraction layers, that facilitate development of interactive simulations and visualizations, and led to the development of SwissGL/GPU library.

In this presentation I’m going to give a hands-on introduction into GPU programming for ALife by going through a number of examples built with a minimal set of tools and amount of code.

### Tutorial materials

TBD

### Supplementary materials

* [SwissGL](https://google.github.io/swissgl/)

<script>
    "use strict";
    const canvas = document.getElementById('c');
    const glsl = SwissGL(canvas);

    const step_n = 10;
    const params = {viewR:12.0, s2: [1.,4.,8.]};
    
    let state;
    function reset() {
        state = glsl({seed:123,
            FP:`(hash(ivec3(I, int(seed))).xy-0.5)*12.0,0,0`},
            {size:[20, 20], story:3, format:'rgba32f', tag:'state'});
    }
    reset();

    window.addEventListener('keydown', e=>{
        reset();
    })
    
    function step() {
        glsl({...params, past:state[1], FP:`
            vec3 pos = Src(I).xyz, field=vec3(0);
            mat3 grad = mat3(0);
            for (int y=0; y<ViewSize.y; ++y)
            for (int x=0; x<ViewSize.x; ++x) {
                vec3 dp = pos - Src(ivec2(x, y)).xyz;
                float r = length(dp);
                dp /= r+1e-8;
                vec3 f=exp(-r*r*s2), f_dr=-2.0*r*f*s2;
                field += f;
                grad += outerProduct(dp, f_dr);
            }
            const vec3 target = vec3(10.0,5.0,0.0);
            const vec3 w = vec3(0.5,1,1);
            vec3 dp = (field-target);
            //float E = dot(dp,dp*w);
            vec3 de = 2.0*dp*w;
            vec3 force = -grad*de;
            FOut.xyz = pos+force*0.01; 
        `},  state); 
    }

    function render(t) {
        for (let i=0; i<step_n; ++i) step();
        glsl({state:state[0], Grid: state[0].size, 
            Blend:'s+d', Aspect:'mean', ...params,
            VP:`(state(ID.xy).xy + XY*2.0)/viewR,0,1`, FP:`
            float r = 2.0*length(XY);
            FOut = vec4(exp(-r*r*s2)*s2*0.05, 1.0);`});        
        glsl({state:state[0], Grid: state[0].size, ...params,
            Blend:'d*(1-sa)+s*sa', Aspect:'mean',
            VP:`vec4 s = state(ID.xy);
            VPos = vec4((s.xy + XY*0.2)/viewR,0,1);`,
            FP:`smoothstep(1.0,0.2,length(XY))`});             
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
</script>