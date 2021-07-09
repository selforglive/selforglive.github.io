# Differentiable Self-Organizing Systems

[ALIFE 2021](https://www.robot100.cz/alife2021) Tutorial, July 20, 10:00-12:00 (CET)

<script src="twgl-full.min.js"></script>
<script type="module" src="ca.js"></script>

<style>
canvas {
    width: 100%;
}
</style>
<canvas id=canvas width="512" height="256"></canvas>


**Organizers:**
[Alexander Mordvintsev](https://znah.net/),
[Ettore Randazzo](https://oteret.github.io/),
[Eyvind Niklasson](https://eyvind.me/)

**Keywords:** self-organization, differentiable programming, cellular automata, reaction-diffusion

In this tutorial we are doing the cover the basic principles of using
differentiable programming for building self-organizing systems, i.e. systems
that consist of a large number of agents that reach global goals through local
interactions. We are going to:

* create a new tiny Neural Cellular Automata (NCA) model from scratch (588 params!)
* train this model to generate textures and solve some other tasks
* explore [Neural Reaction-Diffusion](https://selforglive.github.io/alife_rd_textures/)
* implement NCA with GLSL shaders and see what can we learn from 
* export resulting models as GLSL shaders

### Supplementary materials

* [Thread: Differentiable Self-organizing Systems at distill.pub](https://distill.pub/2020/selforg/)
* [Self-Organizing Neural Cellular Automata in 4 minutes  (video)](https://youtu.be/unF2CVkMIiE)
* [Hexells interactive web demo](https://znah.net/hexells)




<script type="module">
    import {CA} from "./ca.js"
    const canvas = document.getElementById('canvas');
    const gl = canvas.getContext('webgl', { alpha: false })
    const size = [512, 256];
    const ca = new CA(gl, size);
    ca.uniforms.mousePos = size;
    let stepPerFrame = 8.0;

    function triggerMousePos(e) {
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left)/rect.width;
        const y = (e.clientY - rect.top)/rect.height;
        const [w, h] = size;
        ca.uniforms.mousePos = [x*w, (1.0-y)*h];
        if (stepPerFrame<=0.0) {
            requestAnimationFrame(render);
        }
        stepPerFrame = 4.0;
    }

    canvas.addEventListener('mousemove', triggerMousePos);
    canvas.addEventListener('touchmove', e=>{
        for (const t of e.changedTouches) {
            triggerMousePos(t);
        }
    });


    function render() {
        if (stepPerFrame <= 0.0) {
            return;
        }
        for(let i=0; i<stepPerFrame; ++i) {
            ca.step();
        }
        stepPerFrame -= 0.025;
        twgl.bindFramebufferInfo(gl);
        ca.render();
        requestAnimationFrame(render);
    }
    render();

</script>
