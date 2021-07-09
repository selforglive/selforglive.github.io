
<script src="twgl-full.min.js"></script>
<script type="module" src="ca.js"></script>

<canvas id=canvas width="512" height="256"></canvas>


# Differentiable Self-Organizing Systems

ALIFE 2021 Tutorial, July 20, 10:00-12:00 (CET)


**Organisers:** [Alexander Mordvintsev](https://znah.net/), [Ettore Randazzo](https://oteret.github.io/)
[Eyvind Niklasson](https://eyvind.me/)

**Keywords:** self-organization, differentiable programming, cellular automata, reaction-diffusion

In this workshop we are doing the cover the basic principles of using
differentiable programming for building self-organising systems, i.e. systems
that consist of a large number of agents, executing the same rule, that can
reach shared global goals through local asynchronous communication.

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
        stepPerFrame -= 0.05;
        twgl.bindFramebufferInfo(gl);
        ca.render();
        requestAnimationFrame(render);
    }
    render();

</script>
