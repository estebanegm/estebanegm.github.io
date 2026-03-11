// ===== DETECTAR RUTA BASE =====
function getBasePath() {
    // Obtener la ruta actual
    const path = window.location.pathname;
    
    // Si estamos en la raíz o en una subcarpeta
    if (path.includes('/pages/')) {
        return '../'; // Estamos en una subcarpeta, subir un nivel
    }
    return ''; // Estamos en la raíz
}

// ===== LISTA DE COMPONENTES POR PÁGINA =====
// Componentes que siempre se cargan en todas las páginas
const commonComponents = ['header', 'footer'];

// Componentes específicos para la página principal
const homeComponents = [
    'hero',
    'sobre-mi',
    'timeline',
    'proyectos-destacados',
    'investigacion-preview',
    'ahora',
    'blog-preview'
];

// Determinar qué componentes cargar según la página
function getComponentsToLoad() {
    const path = window.location.pathname;
    
    // Siempre cargar header y footer
    let componentsToLoad = [...commonComponents];
    
    // Si estamos en la página principal (index.html o raíz)
    if (path.endsWith('index.html') || path.endsWith('/') || path === '/') {
        componentsToLoad = [...componentsToLoad, ...homeComponents];
        console.log('📄 Página principal detectada');
    } else {
        console.log('📄 Subpágina detectada');
    }
    
    return componentsToLoad;
}

// ===== FUNCIÓN PARA CARGAR UN COMPONENTE =====
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
            console.log(`✅ Componente ${component} cargado desde ${componentPath}`);
            
            // Inicializar menú hamburguesa después de cargar header
            if (component === 'header') {
                setTimeout(initMobileMenu, 100);
            }
        }
    } catch (error) {
        console.warn(`⚠️ Componente ${component} no encontrado:`, error);
    }
}

// ===== FUNCIÓN PARA INICIALIZAR EL MENÚ HAMBURGUESA =====
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (!hamburger || !navMenu) {
        console.warn('Menú hamburguesa no encontrado');
        return;
    }
    
    // Remover event listeners anteriores
    const newHamburger = hamburger.cloneNode(true);
    hamburger.parentNode.replaceChild(newHamburger, hamburger);
    const newNavMenu = navMenu.cloneNode(true);
    navMenu.parentNode.replaceChild(newNavMenu, navMenu);
    
    // Agregar nuevo event listener
    newHamburger.addEventListener('click', function(e) {
        e.stopPropagation();
        this.classList.toggle('active');
        newNavMenu.classList.toggle('active');
        document.body.style.overflow = newNavMenu.classList.contains('active') ? 'hidden' : 'auto';
    });
    
    // Cerrar menú al hacer clic en un enlace
    newNavMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            newHamburger.classList.remove('active');
            newNavMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });
    
    // Cerrar menú al hacer clic fuera
    document.addEventListener('click', function(e) {
        if (!newNavMenu.contains(e.target) && !newHamburger.contains(e.target)) {
            newHamburger.classList.remove('active');
            newNavMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
}

// ===== CARGAR COMPONENTES =====
async function loadAllComponents() {
    const componentsToLoad = getComponentsToLoad();
    console.log('📦 Componentes a cargar:', componentsToLoad);
    
    // Cargar componentes en paralelo
    await Promise.all(componentsToLoad.map(component => loadComponent(component)));
    
    console.log('✅ Todos los componentes cargados');
    
    // Disparar evento para que otras funciones sepan que ya puede renderizar
    document.dispatchEvent(new Event('componentsLoaded'));
}

// ===== INICIAR CARGA =====
document.addEventListener('DOMContentLoaded', loadAllComponents);
