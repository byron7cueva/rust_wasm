const rust = import('./pkg/index');
const canvas = document.getElementById('rustCanvas');
const gl = canvas.getContext('webgl', { antialias: true });

/* rust
  .then(m => m.say_hello_from_rust())
  .catch(console.error); */

  rust
  .then(m => {
    if (!gl) {
      alert('Fallo inicializar WebGL');
      return;
    }

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const FPS_THROTTLE = 1000.0 / 30.0; // milliseconds / frames
    const dougsClient = new m.DougsClient();
    const initialTime = Date.now();
    var lastDrawTime = -1; // In milliseconds

    function render () {
      window.requestAnimationFrame(render);
      const currTime = Date.now();

      if (currTime >= lastDrawTime + FPS_THROTTLE) {
        lastDrawTime = currTime;

        // Para cuando el navegador se campie el tamaño
        if (window.innerHeight != canvas.height || window.innerWidth != canvas.width) {
          canvas.height = window.innerHeight;
          canvas.width = window.innerWidth;
          canvas.style.height = window.innerHeight;

          canvas.width = window.innerWidth;
          canvas.clientWidth = window.innerWidth;
          canvas.style.width = window.innerWidth;

          gl.viewport(0, 0, window.innerWidth, window.innerHeight);
        }

        let elapsedTime = currTime - initialTime;
        // Rust Update call
        dougsClient.update(elapsedTime, window.innerHeight, window.innerWidth);
        // Rust Render call
        dougsClient.render();
      }
    }

    render();
  })