// Inicialización de una lista para almacenar los países obtenidos de la API
let countriesList = [];

// Función asíncrona para cargar datos desde la API
async function LoadData() {
    try {
        // Realiza una solicitud para obtener todos los países
        const response = await fetch('https://restcountries.com/v3.1/all');
        const data = await response.json();  
        countriesList = data; // Almacena los datos en la variable global
        return data; // Devuelve los datos obtenidos
    } catch (error) {
        // Manejo de errores si falla la solicitud
        console.error("Hubo un error al obtener los datos:", error);
        return null;
    }
}

// Función asíncrona para procesar los datos después de cargarlos
async function processData() {
    let data = await LoadData();  // Llama a LoadData y espera los datos

    // Verifica si los datos se cargaron correctamente
    if (data.length > 0) {  
        console.log("Si hay datos");
        displayCountries(data); // Muestra los países en la interfaz
    } else {
        console.log("No data available or failed to load.");
    }
}

// Función para mostrar la lista de países en el contenedor HTML
function displayCountries(countries) {
    let container = document.getElementById('api-country-list'); // Obtiene el contenedor
    container.innerHTML = ''; // Limpia el contenido previo
    console.log("Si se cargaron los datos");

    // Recorre la lista de países y crea elementos HTML para cada uno
    countries.forEach(country => {
        let section = document.createElement('section'); // Crea un elemento <section>
        section.classList.add('country-card'); // Añade una clase para estilo

        // Define el contenido HTML del país
        section.innerHTML = `
            <div class="country-flag">
                <img src="${country.flags.svg}" alt="" id="flag">
            </div>
            <div class="country-names">
                <h3 class="country-name">${country.name.common}</h3>
                <p class="official-name">${country.name.official}</p>     
            </div>
        `;

        // Añade un evento al hacer clic para mostrar un modal con más detalles
        section.addEventListener('click', () => {
            createCountryModal(country);
        });

        container.appendChild(section); // Agrega el elemento al contenedor
    });
}

// Función para filtrar países según un término de búsqueda
function filterCountries(query) {
    return countriesList.filter(country =>
        country.name.common.toLowerCase().includes(query.toLowerCase())
    );
}

// Maneja el evento de entrada en el cuadro de búsqueda
function handleSearch(event) {
    console.log("Se esta intentando buscar");
    const query = event.target.value;  // Obtiene el valor ingresado
    const filteredCountries = filterCountries(query);  // Filtra los países
    displayCountries(filteredCountries);  // Muestra los países filtrados
}

// Función para filtrar países por región
function filterCountriesByRegion(region) {
    return countriesList.filter(country => 
        country.region.toLowerCase() === region.toLowerCase()
    );
}

// Maneja el cambio en el selector de regiones
function SelectChange(event) {
    const value = event.target.value; // Obtiene el valor seleccionado
    const filteredCountriesRegion = filterCountriesByRegion(value); // Filtra por región
    displayCountries(filteredCountriesRegion); // Muestra los países filtrados
}

// Función para crear un modal con detalles de un país
function createCountryModal(country) {
    // Crea el contenedor del modal
    const modal = document.createElement('div');
    modal.classList.add('country-modal'); // Añade una clase para estilo
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <div class="modal-header">
                <img src="${country.flags.svg}" alt="${country.name.common} flag" class="modal-flag">
                <h2>${country.name.common}</h2>
            </div>
            <div class="modal-details">
                <p class = "detail"><span class="icon official-name-icon"></span><strong>Official Name:</strong> ${country.name.official}</p>
                <p class = "detail"><span class="icon region-icon"></span><strong>Region:</strong> ${country.region}</p>
                <p class = "detail"><span class="icon population-icon"></span><strong>Population:</strong> ${country.population.toLocaleString()}</p>
                <p class = "detail"><span class="icon capital-icon"></span><strong>Capital:</strong> ${country.capital ? country.capital[0] : 'N/A'}</p>
                <p class = "detail"><span class="icon languages-icon"></span><strong>Languages:</strong> ${Object.values(country.languages || {}).join(', ')}</p>
                <p class = "detail"><span class="icon currencies-icon"></span><strong>Currencies:</strong> ${Object.values(country.currencies || {}).map(curr => curr.name).join(', ')}</p>
            </div>
        </div>
    `;
    // Añade el modal al DOM
    document.body.appendChild(modal);

    // Maneja el cierre del modal al hacer clic en el botón de cierre
    const closeButton = modal.querySelector('.close-modal');
    closeButton.addEventListener('click', () => {
        document.body.removeChild(modal);
    });

    // Cierra el modal al hacer clic fuera del contenido
    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

// Función inmediatamente invocada para inicializar los eventos y cargar los datos
(async function () {
    const data = await processData(); // Carga y procesa los datos

    try {
        const urlParams = new URLSearchParams(window.location.search); // Obtiene los parámetros de la URL

        const formValue = urlParams.get('form'); // Obtiene un valor específico de los parámetros

        const response = await fetch('/docs/scripts/html.json'); // Carga un archivo JSON
        
        if (!response.ok) {
            throw new Error("Error al cargar el archivo JSON");
        }

        const data = await response.json();

        // Verifica si existe el formulario solicitado en el JSON
        if (data.form && data.form[formValue]) {
            let form = document.querySelector('.form-input');
            form.innerHTML = data.form[formValue].html;  
        } else {
            throw new Error('La página solicitada no existe en el JSON');
        }

    } catch (error) {
        // Manejo de errores al cargar el JSON o parámetros
    }

    // Añade el evento de cambio al selector de regiones
    let select = document.getElementById('regions');
    if(select){
        select.addEventListener('change', SelectChange);
    }

    // Añade el evento de entrada al cuadro de búsqueda
    let txtBox = document.getElementById('txtCountry');
    if(txtBox){
        txtBox.addEventListener('input', handleSearch);
    }
}());


