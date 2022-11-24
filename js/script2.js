// funcionalidad para página multimedia. 

const camaraFour = document.getElementById("camaraFour")
const resultadoCiudadClima = document.getElementById("resultadoCiudadClima")
let ultimoClima;
let ultimoAurora;
// Obtengo ciertos elementos del DOM que voy a usar
const button = document.getElementById('accionTop');
const result = document.getElementById('top5');
let html;

// locaciones elegidas para hacer el top 5 ordenadas según probabilidad. 

const locations = [
  {
    "id": "0",
    "name": "Longyearbyen",
    "description": "Longyearbyen, Svalbard, Noruega",
    "subdivision": " Svalbard",
    "country": " Noruega",
    "lat": "78.2232",
    "long": "15.6267"
  },
  {
    "id": "1",
    "name": "Tromso",
    "description": "Troms├©, Tromso, Noruega",
    "subdivision": " Troms County",
    "country": " Norway",
    "lat": "69.6492",
    "long": "18.9553"
  },
  {
    "id": "2",
    "name": "Whitehorse",
    "description": "Whitehorse, Yukon Territory, Canadá",
    "subdivision": " Yukon Territory",
    "country": " Canada",
    "lat": "60.7212",
    "long": "-135.057"
  },

  {
    "id": "3",
    "name": "Fairbanks",
    "description": "Fairbanks, Alaska, Estados Unidos",
    "subdivision": " Alaska",
    "country": " United States",
    "lat": "64.8378",
    "long": "-147.716"
  },
  {
    "id": "4",
    "name": "Flinders",
    "description": "Flinders, Victoria, Australia",
    "subdivision": "Victoria",
    "country": "Australia",
    "lat": "-38.4817",
    "long": "144.988"
  }];




// obtenemos la info cargada en index.html a través de localstorage. 

ultimoClima = JSON.parse(localStorage.getItem("clima"));
// se parsean 
ultimoAurora = JSON.parse(localStorage.getItem("aurora"));

ultimoNombre = localStorage.getItem("ciudad");

// pasamos toda la info para armar nuevamente una card con la última búsqueda. Esta vez toda la información de api aurora y api clima en la misma card. 

if (ultimoNombre) {
  nombreCorregido = ultimoNombre.replace(/["]+/g, '')
}

// recibe tres parámetros. - clima - aurora - nombre 

localData(ultimoClima, ultimoAurora, nombreCorregido)

function localData(clima, aurora) {

  const {
    name,
    clouds: { all },
    main: { temp, feels_like, temp_min, temp_max, humidity, pressure },
    wind: { deg, speed },
    weather: [array],
    coord: { lon, lat },
  } = clima;


  kp = Math.round(aurora.ace.kp) // redondea kp 

  // muestra información 

  resultadoCiudadClima.innerHTML =
    //html
    ` 
<div class="inside-card">

    <div>
        <p class="cityName">${name} / ${nombreCorregido} </p>

    </div>
    <div>
    <p class="description">Nubosidad: ${all}%</p>
    <p class="description"> ${clima.weather[0].description}</p>
    <p >Temperatura: ${temp} ºC</p>
    <p >Kp: ${kp} </p>
    <p >Probabilidad: ${aurora.probability.value} %</p>
    </div>

</div>

`;

  camaras(aurora.images.images.rothney.url) // de las 4 cámaras está está traida de la api aurora, era la única que funcionaba. Corresponde a Alberta Canadá. 

}


// función para pasarle el src al elemento html img. 

function camaras(url) {

  camaraFour.src = url



}


//FUNCIONALIDAD TOP 5 
// ejemplo de Gonzalo. 


async function hardPromiseAll() {
  // Array de Promesas:
  const promises = [];

  // Pusheo los fetch a un array de Promesas:
  locations.forEach(element => {
    promises.push(fetch(`https://api.auroras.live/v1/?type=all&lat=${element.lat}&long=${element.long}&forecast=false&threeday=false&probability=true`).then(result => result.json()))
  })

  try {
    // Ejecuto el Promise All con el array:
    const data = await Promise.all(promises);

    return data;
  } catch (err) {
    console.log(err);
    return [];
  }
}


// En el click del boton
button.addEventListener('click', function() {

  // const resultado = basicPromiseAll();
  const resultado = hardPromiseAll();

  resultado.then(function(valor) {
    console.table(valor)
  }
  );

  resultado.then(function(value) {
    // limpio
    result.innerHTML = '';

    value.forEach(function(aurora) {
      console.log(aurora)

    });

  })

  resultado.then(function(aurora) {
    console.log(aurora)
    // recorro data de aurora y se le asigna la información en locations, la api de aurora, NO TIENE NOMBRES!!!! 
    for (let index = 0; index < aurora.length; index++) {
      const element = aurora[index];
      aurora[index] = Object.assign({}, aurora[index], { nombre: locations[index] })


    }

  })

  // función para ordernar ciudad por probabilidad de mayor a menor. 
  resultado.then(function(aurora) {

    aurora.sort(((a, b) => b.probability.value - a.probability.value));
    html = "";
    aurora.forEach(element => { // cargo info para mostrar en una variable.

      html += `<p>Ciudad ${element.nombre.description}  ${element.probability.value} % </p>`;

    });

    // paso ese resultado de info a result. para mostrarlo 
    result.innerHTML = html;
    console.log(aurora)

  })

});







