// Lista de componentes a cargar (en orden)
const components = [
    'header',
    'hero',
    'sobre-mi',
    'timeline',
    'proyectos-destacados',
    'investigacion-preview',
    'ahora',
    'blog-preview',
    'footer'
];

// Cargar cada componente
components.forEach(component => {
    fetch(`components/${component}.html`)
        .then(response => {
            if (!response.ok) throw new Error(`No se pudo cargar ${component}`);
            return response.text();
        })
        .then(data => {
            const element = document.getElementById(component);
            if (element) element.innerHTML = data;
        })
        .catch(error => console.warn(`Componente ${component} no encontrado, ignorando.`));
});