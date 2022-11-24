// funcionalidad del index 

// constantes para obtener elementos del DOM de la 
const resultado = document.getElementById("resultado");
const resultadoCiudad = document.getElementById("resultadoCiudad")
const form = document.querySelector("form");
const input = document.getElementById("input_ciudad");
const botonCiudad = document.getElementById("botonCiudad");
const resultadoCiudadClima = document.getElementById("resultadoCiudadClima")
const mapaAurora = document.getElementById("mapaAurora");
const errorCiudad = document.getElementById("errorCiudad");
const camaraFour = document.getElementById("camaraFour");
let dataAurora = {};


// variables
let valorCiudad; // valor que toma el input o por defecto
let data;
let ultimoClima; // localstorage última búsqueda de clima 
var control = true; // se utilizará para ir llamando o no a las distintas funciones

// variables para utilizar la API de open weather map // 
const api_key = "8c8666d68069a9c8cd452639cf67f692"; // key 
const unidad_temperatura = "metric"; // grados centígrados
const lang = "es" // language. no sirve para nombre, sólo para descripciones. 


// inicio de funcionalidad de la pantalla home -el index

// obtenemos de localstorage si hay algo guardado tanto en clima como el nombre de la ciudad. 

ultimoClima = JSON.parse(localStorage.getItem("clima"));
ultimoNombre = localStorage.getItem("ciudad");


// pregunto si hay un nombre de ciudad guardado 
if (ultimoNombre) {
  nombreCorregido = ultimoNombre.replace(/["]+/g, '') // recupera el string con comillas rompe la funcionalidad. se la quitamos.
  valorCiudad = nombreCorregido
} else {
  // sino asigno por defecto
  valorCiudad = "Tromso"
}


console.log(ultimoClima)

// si hay clima en local storage mostramos mientras tanto este. Hasta que el usuario haga una nueva búsqueda. 
if (ultimoClima) {
  llamadaClima(valorCiudad);

} else {

  valorCiudad = "Tromso"
  llamadaClima(valorCiudad);


}


// validamos que no esté vacío y que el campo no se un número. 

function validarCiudad() {
  control = true;

  if (input.value !== "" && isNaN(input.value)) {
    valorCiudad = input.value;
    form.reset(); // reseteamos form. Vaciar. 
    control = true; // para el manejo de errores. 
    console.log(valorCiudad);

  } else {
    console.log(errorCiudad)
    errorCiudad.innerHTML = "❌Lo sentimos, no pudimos procesar tu búsqueda. Por favor intente nuevamente."
    form.reset();
    control = false; // para el manejo de errores 

  }
}

// escucho evento click

botonCiudad.addEventListener("click", (e) => {

  e.preventDefault() // prevenir el comportamiento por defecto del navegador 
  console.log(valorCiudad)
  validarCiudad() // llamo a validar ciudad 

  if (control) {

    errorCiudad.innerHTML = ""

    // si paso todo bien, llamamos  al clima 
    llamadaClima(valorCiudad)



  }



})

// llamada api clima 


function llamadaClima(valorCiudad) {


  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${valorCiudad}&appid=${api_key}&lang=${lang}&units=${unidad_temperatura}`
  )
    .then((resp) => {

      if (!resp.ok) throw Error(resp.status)

      return resp
    })

    .then(res => res.json())

    .then((json) => {

      recuperoDatosClima(json); // se van los datos para mostrar el clima 
      console.log(json)

    })
    // se agarra el error en la solicitud por si algo sale mal.
    .catch(() => errorCiudad.innerHTML = "❌Lo sentimos, no pudimos procesar tu búsqueda. Por favor intente nuevamente."
    ); // Capturar errores
}

// recupero datos del clima -

function recuperoDatosClima(data) {
  // seteamos el locastorage con la respuesta del fetch. Nos aseguramos la información. 
  localStorage.setItem("clima", JSON.stringify(data));
  localStorage.setItem("ciudad", valorCiudad);

  // empezamos a procesarla. Desestructuro para un manejo más simple. 

  const {
    name,
    clouds: { all },
    dt,
    timezone,
    main: { temp, feels_like, temp_min, temp_max, humidity, pressure },
    wind: { deg, speed },
    weather: [array],
    coord: { lon, lat },
  } = data;


  // llama a la api aurora para obtener kp con parámetros de long y lat de api clima 
  llamadaApiLive(lat, lon)

  // insertado para ver el clima 

  if (data.cod == 200) {

    // muestro datos 
    resultadoCiudadClima.innerHTML =
      // template string
      ` 
<div class="inside-card">

  <div >
  <p class="cityName">${name} / ${valorCiudad} </p>
  <div>
  <img src="./img/iconos/${data.weather[0].icon}.png">
    </div>

    <div>
      <p class="description">Nubosidad: ${all}%</p>
      <p class="description"> ${data.weather[0].description}</p>
      <p >Temperatura: ${temp} ºC</p>
    </div>
  </div>

  <div class="">
    <p >Sensación Térmica: ${feels_like}ºC  </p>
    <p >Min: ${temp_min}ºC</p>
    <p >Max: ${temp_max}ºC</p>
    <p >Humedad: ${humidity}%</p>
    <p >Presión Atmosférica: ${pressure} hPa</p>
    <p >Vientos: Vel: ${speed} km/h y Dir: ${deg}º</p>

  </div>
    </div>

`;
  } else {
    // si el cod de la ciudad no es 200 se muestra otro resultado.
    resultadoCiudadClima.innerHTML = `    <p class="text-blue"> No hemos encontrado ningún resultado. Por favor intente nuevamente</p>
`;
  }


}

// llama a api auroras live  - recibe latitud y longitud de los datos del clima. 
function llamadaApiLive(lat, long) {

  fetch(
    `https://api.auroras.live/v1/?type=all&lat=${lat}&long=${long}&forecast=false&&images=true&threeday=false`

  )
    .then((resp) => {

      // desarrollar manejo de errores. sobre todo 404. 
      if (!resp.ok) throw Error(resp.status)
      return resp
    })

    .then(res => res.json())

    .then((json) => {

      muestroDatosKp(json); // se van los datos para procesarlos y mostrarlos 


      localStorage.setItem("aurora", JSON.stringify(json)); // se setea info en local storage. Esto principalmente sirve, para enviar información del index a la página multimedia. 



    })
    // se agarra el error en la solicitud por si algo sale mal.
    .catch(err => console.log('Solicitud fallida', err)); // Capturar errores
}

// muestro titulo Ciudad 

function muestroTituloCiudad(valorCiudad) {

  if (valorCiudad) {
    resultado.innerHTML = `<p >${valorCiudad}  </p>`

  } else {
    resultado.innerHTML = `  <p >Tromso </p>
    `


  }


}

// muestra KP  -- recibe parámetro con datos de api aurora, y los envía a la función dentro de archivo progressivechart.js

function muestroDatosKp(json) {

  console.log(json)
  console.log(json.ace.kp)
  console.log(json.date)

  muestroTituloCiudad(valorCiudad)

  // parametro 1: dato, parámetro 2: getElement, parámetro 3: las unidades base que necesita para representar el gráfico. Arranca de 0. 

  grafico(json.ace.kp, "canvas", 9); // kp actual - envía parámetros que necesita la función para hacer el gráfico y la animación
  grafico(json.ace.kp1hour, "canvas2", 9); // kp 1 hs idem descripción. 
  grafico(json.probability.value, "canvas4", 99) // probabilidad idem descripción. 



}


