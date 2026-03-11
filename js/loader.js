// ===== DETECTAR QUÉ PÁGINA ES =====
function isHomePage() {
    const path = window.location.pathname;
    // Estamos en la página principal si:
    // - Termina en index.html
    // - Termina en /
    // - Es la raíz del sitio
    return path.endsWith('index.html') || path.endsWith('/') || path === '';
}

// ===== DETERMINAR RUTA BASE =====
function getBasePath() {
    const path = window.location.pathname;
    if (path.includes('/pages/')) {
        return '../'; // Estamos en subcarpeta (pages/proyectos/)
    }
    return ''; // Estamos en la raíz
}

// ===== LISTA DE COMPONENTES =====
// Componentes que siempre van en todas las páginas
const commonComponents = ['header', 'footer'];

// Componentes que SOLO van en la página principal
const homeComponents = [
    'hero',
    'sobre-mi',
    'timeline',
    'proyectos-destacados',
    'investigacion-preview',
    'ahora',
    'blog-preview'
];

// Determinar qué componentes cargar
function getComponentsToLoad() {
    if (isHomePage()) {
        console.log('📄 Página principal detectada - Cargando TODOS los componentes');
        return [...commonComponents, ...homeComponents];
    } else {
        console.log('📄 Subpágina detectada - Cargando solo header y footer');
        return commonComponents;
    }
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

// ===== FUNCIÓN PARA INICIALIZAR EL MENÚ HAMBURGUESA =====
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (!hamburger || !navMenu) return;
    
    // Remover event listeners anteriores
    const newHamburger = hamburger.cloneNode(true);
    hamburger.parentNode.replaceChild(newHamburger, hamburger);
    const newNavMenu = navMenu.cloneNode(true);
    navMenu.parentNode.replaceChild(newNavMenu, navMenu);
    
    newHamburger.addEventListener('click', function(e) {
        e.stopPropagation();
        this.classList.toggle('active');
        newNavMenu.classList.toggle('active');
        document.body.style.overflow = newNavMenu.classList.contains('active') ? 'hidden' : 'auto';
    });
    
    newNavMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            newHamburger.classList.remove('active');
            newNavMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });
}

// ===== CARGAR COMPONENTES =====
async function loadAllComponents() {
    const componentsToLoad = getComponentsToLoad();
    console.log('📦 Componentes a cargar:', componentsToLoad);
    
    await Promise.all(componentsToLoad.map(component => loadComponent(component)));
    console.log('✅ Todos los componentes cargados');
    
    // Disparar evento para otras funciones
    document.dispatchEvent(new Event('componentsLoaded'));
}

// ===== INICIAR =====
document.addEventListener('DOMContentLoaded', loadAllComponents);
