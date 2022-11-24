const estado = document.getElementById('estado');



// Escucho a ver si el usuario se desconecta
window.addEventListener('offline', event => {
  console.log('usuario esta desconectado', event);
  estado.innerHTML = `<img class="gif" src="assets/offlinefinal.gif" alt="circulo rojo representa sin conexión">`

});

// Escucho a ver si el usuario se conecta nuevamente
window.addEventListener('online', event => {
  console.log('usuario esta conectado!! ALEGRIA!', event);
  estado.innerHTML = `<img class="gif" src="assets/onlinefinal.gif" alt="circulo verde representando conexión online">`
    ;
});

// Chequeo si tiene conexion al momento de carga
if (!navigator.onLine) {
  console.log('estoy sin conexion pero en el momento de carga!!');
  estado.innerHTML = `<img class="gif" src="assets/offlinefinal.gif" alt="circulo verde representando conexión online">`

} else {
  estado.innerHTML = `<img class="gif" src="assets/onlinefinal.gif" alt="circulo verde representando conexión online">`

}

