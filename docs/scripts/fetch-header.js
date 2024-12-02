fetch('/pages/header.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('top-header').innerHTML = data;
    })
    .catch(error => console.error("Error al cargar el header:", error));