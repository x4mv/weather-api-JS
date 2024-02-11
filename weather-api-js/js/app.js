import { api_key } from "./cfg.js";

// variables 
const ciudadInput = document.querySelector('#ciudad');
const paisInput = document.querySelector('#pais');
const formulario = document.querySelector('#formulario');
const resultadoView = document.querySelector('#resultado')


// event listeners 
document.addEventListener('DOMContentLoaded', () => {

    formulario.addEventListener('submit', obtenerDatos);
})

// funciones 
function obtenerDatos(e){
    e.preventDefault();

    const ciudad = ciudadInput.value;
    const pais = paisInput.value;

    if ( ciudad.trim() === '' || pais === ''){
        mostrarAlerta('Ambos campos son obligatorios', 'error')
        return;
    }
    mostrarAlerta('Trayendo los datos...')
    spinner();
    setTimeout(() => {
        consultarAPI(ciudad, pais)
    },3000);

}

function consultarAPI(ciudad, pais){

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${api_key}`;

    
    fetch(url)
        .then(respuesta => respuesta.json())
        .then(datos => {
            limpiarHTML()
            if (datos.cod === '404'){
                mostrarAlerta('Ciudad no encontrada', 'error')
                return;
            }

            // mostrar los datos de la respuesta 
            mostrarDatos(datos);
        })

}

function mostrarDatos(datos){
    
    const {name, main:{ temp, temp_max, temp_min}} = datos;

    // convertir de grados kelvin a grados Celsius

    const actualCelsius = calcularCelius(temp);
    const maxCelsius = calcularCelius(temp_max);
    const minCelsius = calcularCelius(temp_min);

    //creando el html para el nombre de la ciudad 
    const nombreCiudad  = document.createElement('p');
    nombreCiudad.innerHTML = `Temperatura en: ${name}`;
    nombreCiudad.className = 'font-bold text-2xl';

    // creando el html para las temperaturas (actual)
    const temperaturaActual  = document.createElement('p');
    temperaturaActual.innerHTML = `${actualCelsius} &#8451`;
    temperaturaActual.className = 'font-bold text-6xl';

    // temperatura maxima
    const maxTemp = document.createElement('p');
    maxTemp.innerHTML = `MAX: ${maxCelsius} &#8451`;
    maxTemp.className = 'font-bold text-xl';

    // temperatura minima
    const minTemp = document.createElement('p');
    minTemp.innerHTML = `MIN: ${minCelsius} &#8451`;
    minTemp.className = 'font-bold text-xl';


    // agregando el HMTL a la vista
    resultadoView.className = 'text-center text-white'
    resultadoView.appendChild(nombreCiudad)
    resultadoView.appendChild(temperaturaActual)
    resultadoView.appendChild(maxTemp)
    resultadoView.appendChild(minTemp)

}

const calcularCelius = grados => parseInt(grados - 273.15);


function mostrarAlerta(mensaje, tipo){
    const alerta = document.querySelector('.bg-red-600') || document.querySelector('.bg-green-600')

    
    if (!alerta){
        const divAlerta = document.createElement('DIV');

        if (tipo === 'error'){
            divAlerta.className = 'bg-red-600 m-4 p-2 text-white text-center'
        }else{
            divAlerta.className = 'bg-green-600 m-4 p-2 text-white text-center'
        }
    
        divAlerta.textContent = mensaje
    
        formulario.appendChild(divAlerta)

        setTimeout(() => {
            divAlerta.remove()
        }, 3000);
        
    }

    
}

function spinner(){

    limpiarHTML();
    const divSpinner = document.createElement('DIV');
    divSpinner.className = 'sk-fading-circle'

    divSpinner.innerHTML = `
    
    <div class="sk-circle1 sk-circle"></div>
    <div class="sk-circle2 sk-circle"></div>
    <div class="sk-circle3 sk-circle"></div>
    <div class="sk-circle4 sk-circle"></div>
    <div class="sk-circle5 sk-circle"></div>
    <div class="sk-circle6 sk-circle"></div>
    <div class="sk-circle7 sk-circle"></div>
    <div class="sk-circle8 sk-circle"></div>
    <div class="sk-circle9 sk-circle"></div>
    <div class="sk-circle10 sk-circle"></div>
    <div class="sk-circle11 sk-circle"></div>
    <div class="sk-circle12 sk-circle"></div>
    `

    resultadoView.appendChild(divSpinner);
}

function limpiarHTML(){
    while (resultadoView.firstChild){
        resultadoView.removeChild(resultadoView.firstChild)
    }
}