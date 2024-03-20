
<script src="twgl-full.min.js"></script>
<script type="module" src="ca.js"></script>

<style>
canvas {
    width: 100%;
}
</style>
<canvas id=canvas width="512" height="256"></canvas>


### Tutorials

* [JAX for Scaling Up Artificial Life (ALIFE2024)](./jax_alife24/)
* [SwissGL/GPU: tiny libraries for tiny and beautiful programs on the web (ALIFE2024)](./swissgl_alife24)
* [Differentiable Self-Organising Systems (ALIFE2021)](./alife21_tutorial/)



### Owners

[Alexander Mordvintsev](https://znah.net/),
[Ettore Randazzo](https://oteret.github.io/),
[Eyvind Niklasson](https://eyvind.me/)


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
