// Lista de componentes a cargar (solo header y footer para todas las páginas)
const components = ['header', 'footer'];

// Función para determinar la ruta base
function getBasePath() {
    const path = window.location.pathname;
    if (path.includes('/pages/')) {
        return '../'; // Estamos en subcarpeta
    }
    return ''; // Estamos en la raíz
}

// Función para cargar un componente
async function loadComponent(component) {
    const basePath = getBasePath();
    const componentPath = `${basePath}components/${component}.html`;
    
    try {
        const response = await fetch(componentPath);
        if (!response.ok) throw new Error(`No se pudo cargar ${component}`);
        
        const data = await response.text();
        const element = document.getElementById(component);
        
        if (element) {
            element.innerHTML = data;
            console.log(`✅ Componente ${component} cargado`);
            
            // Inicializar menú hamburguesa después de cargar header
            if (component === 'header') {
                setTimeout(initMobileMenu, 100);
            }
        }
    } catch (error) {
        console.warn(`⚠️ Componente ${component} no encontrado:`, error);
    }
}

// Función para inicializar el menú hamburguesa
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (!hamburger || !navMenu) return;
    
    hamburger.addEventListener('click', function(e) {
        e.stopPropagation();
        this.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : 'auto';
    });
    
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });
}

// Cargar componentes
Promise.all(components.map(component => loadComponent(component)))
    .then(() => {
        console.log('✅ Componentes cargados');
    })
    .catch(error => {
        console.error('Error cargando componentes:', error);
    });
