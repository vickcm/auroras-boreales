const estado = document.getElementById('estado');
const online = document.getElementsByClassName("gifonline")
const offline = document.getElementsByClassName("gifoffline")
console.log(offline)
console.log(online)





// Escucho a ver si el usuario se desconecta
window.addEventListener('offline', event => {
  console.log('usuario esta desconectado', event);
  console.log(offline)

  online[0].hidden = true
  offline[0].hidden = false

});

// Escucho a ver si el usuario se conecta nuevamente
window.addEventListener('online', event => {
  console.log('usuario esta conectado!! ALEGRIA!', event);
  online[0].hidden = false
  offline[0].hidden = true


    
});

// Chequeo si tiene conexion al momento de carga
if (!navigator.onLine) {
  console.log('estoy sin conexion pero en el momento de carga!!');
  online[0].hidden = true
  offline[0].hidden = false


}  else {
  online[0].hidden = false
  offline[0].hidden = true

}
 
