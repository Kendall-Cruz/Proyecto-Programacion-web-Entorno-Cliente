let countriesList = [];


async function LoadData() {
    try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        const data = await response.json();  
        countriesList = data;
        return data;
    } catch (error) {
        console.error("Hubo un error al obtener los datos:", error);
        return null;
    }
}

async function processData() {
    let data = await LoadData();  

    if (data.length > 0) {  
        console.log("Si hay datos")
        displayCountries(data);
    } else {
        console.log("No data available or failed to load.");
    }
}

function displayCountries(countries) {

    let container = document.getElementById('api-country-list');
    container.innerHTML = '';
    console.log("Si se cargaron los datos")
    countries.forEach(country => {
        let section = document.createElement('section');
        section.classList.add('country-card');

        section.innerHTML = `
            <div class="country-flag">
                <img src="${country.flags.svg}" alt="" id="flag">
            </div>
            <div class="country-names">
                <h3 class="country-name">${country.name.common}</h3>
                <p class="official-name">${country.name.official}</p>     
            </div>
        `;
        container.appendChild(section);
    });
}

function filterCountries(query) {
    return countriesList.filter(country =>
        country.name.common.toLowerCase().includes(query.toLowerCase())
    );
}

function handleSearch(event) {
    console.log("Se esta intentando buscar")
    const query = event.target.value;  
    const filteredCountries = filterCountries(query);  
    displayCountries(filteredCountries);  
}

function filterCountriesByRegion(region) {
    return countriesList.filter(country => 
        country.region.toLowerCase() === region.toLowerCase()
        
    );
}

function SelectChange(event){
    const value = event.target.value;
    const filteredCountriesRegion = filterCountriesByRegion(value);
    displayCountries(filteredCountriesRegion);
}

(async function () {
    const data = await processData();
    // displayCountries(data);

    try {
        const urlParams = new URLSearchParams(window.location.search);

        const formValue = urlParams.get('form');

        const response = await fetch('/docs/scripts/html.json');
        
        if (!response.ok) {
            throw new Error("Error al cargar el archivo JSON");
        }

        const data = await response.json();

        if (data.form && data.form[formValue]) {
            
            let form = document.querySelector('.form-input');
            form.innerHTML = data.form[formValue].html;  
        } else {
            throw new Error('La página solicitada no existe en el JSON');
        }

    } catch (error) {
        
    }

    let select = document.getElementById('regions')
    if(select){
        select.addEventListener('change', SelectChange)
    }

    let txtBox = document.getElementById('txtCountry')
    if(txtBox){
        txtBox.addEventListener('input', handleSearch);
    }
}())



