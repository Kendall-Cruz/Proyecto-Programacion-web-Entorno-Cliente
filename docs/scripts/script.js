let countriesList = [];


async function LoadData() {
    try {
        const response = await fetch('https://restcountries.com/v3.1/all?fields=name,flags');
        const data = await response.json();  
        console.log(data)
        countriesList.push(data);
        return data;
    } catch (error) {
        console.error("Hubo un error al obtener los datos:", error);
        return null;
    }
}

async function processData() {
    let data = await LoadData();  

    if (data) {
        displayCountries(data); 
    } else {
        console.log("No se pudieron obtener los datos.");
    }
}

function displayCountries(countries) {
    
    let container = document.getElementById('api-country-list');
    
    countries.forEach(country => {
        let section = document.createElement('section');

        section.classList.add('country-card');

        section.innerHTML=`
            <div class="country-flag">
                <img src="${country.flags.svg}" alt="" id="flag">
            </div>
            <div class="country-names">
                <h3 class="country-name">${country.name.common}</h3>
                <p class="official-name">${country.name.official}</p>     
            </div>
                   
        `
        container.appendChild(section)
        console.log(section)
    });
}

LoadData();
displayCountries(processData())


console.log("aasdasd",countriesList)







