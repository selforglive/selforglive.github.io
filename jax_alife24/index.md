# JAX for Scaling Up Artificial Life

[ALIFE 2024](https://2024.alife.org/) Tutorial


**Organizers:**
[Ettore Randazzo](https://oteret.github.io/),
[Bert Chan](https://chakazul.github.io/)

**Keywords:** jax, self-organization, cellular automata, lenia, biomaker ca

This tutorial will focus on showing how to scale up and speed up ALife simulations through seamless hardware acceleration.
First, we will give a crash course on JAX, a Python framework that allows for massively parallel computations using numpy-like syntax. We will show how to perform computations, automatic vectorize and parallelize to CPUs, GPUs and TPUs, and show how to render videos using 3D raycasting. Throughout this tutorial, we will use and share Google Colab notebooks. Colab is a fantastic way for sharing code and allowing for reproducibility of experiments.
Afterwards, we will show two practical examples of ALife research where we used JAX.
1. Lenia is a family of self-organizing morphogenetic systems. Several Lenia variants like Flow Lenia, Particle Lenia, and the recent Liquid Lenia have been implemented using JAX, with the benefits of easy scale-up, autograd, and smooth application of gradient descent and evolutionary algorithms. We will also take a glimpse of an upcoming JAX-based “Lenia Engine”.
2. Biomaker CA is a framework that allows us to simulate Cellular Automata-based plant biomes. Plants are organisms composed by multiple CA cells, with each organism having their unique DNA. Plants reproduce with variation within the environment. Thanks to JAX parallelization, we can perform seamless meta-evolution such that our plants maximize a given goal. We will show parts of its implementation, how we render environments and how to perform different kinds of experiments. We will finally show how to implement new functionalities in Biomaker CA.

### Tutorial materials
* [JAX for ALife colab](https://colab.research.google.com/github/selforglive/selforglive.github.io/blob/main/jax_alife24/jax_for_alife_tutorial_2024.ipynb)
* Lenia colab
* [Biomaker CA slide deck](https://docs.google.com/presentation/d/1NCxSnXPi1AwjL8RYfzpBTeVwjL83Dj5EOW7EqOb5U70/edit?usp=sharing)
* [Biomaker CA colab: create a world with rain](https://colab.research.google.com/github/google-research/self-organising-systems/blob/master/self_organising_systems/biomakerca/examples/notebooks/run_rain_configuration.ipynb)

### Supplementary materials

* [Lenia](https://chakazul.github.io/lenia.html)
* [Biomaker CA](https://google-research.github.io/self-organising-systems/2023/biomaker-ca/)
