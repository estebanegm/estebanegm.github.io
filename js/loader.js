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

// Función para cargar un componente
function loadComponent(component) {
    return fetch(`components/${component}.html`)
        .then(response => {
            if (!response.ok) throw new Error(`No se pudo cargar ${component}`);
            return response.text();
        })
        .then(data => {
            const element = document.getElementById(component);
            if (element) {
                element.innerHTML = data;
                console.log(`✅ Componente ${component} cargado`);
            }
        })
        .catch(error => {
            console.warn(`⚠️ Componente ${component} no encontrado:`, error);
        });
}

// Cargar todos los componentes
Promise.all(components.map(component => loadComponent(component)))
    .then(() => {
        console.log('✅ Todos los componentes cargados');
        // Disparar evento personalizado para que render-home.js sepa que ya puede renderizar
        document.dispatchEvent(new Event('componentsLoaded'));
    })
    .catch(error => {
        console.error('Error cargando componentes:', error);
    });
