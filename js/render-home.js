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

// ===== RENDERIZAR TIMELINE =====
function loadTimeline() {
    const container = document.getElementById('timeline-container');
    if (!container) {
        console.error('❌ No se encontró timeline-container');
        return;
    }
    
    fetch('data/timeline.json')
        .then(response => {
            if (!response.ok) throw new Error('Error cargando timeline');
            return response.json();
        })
        .then(data => {
            container.innerHTML = '';
            
            const events = data.events.sort((a, b) => parseInt(b.date) - parseInt(a.date));
            
            events.forEach(event => {
                const eventHtml = `
                    <div class="timeline-item ${event.category}">
                        <div class="timeline-date">${event.date}</div>
                        <div class="timeline-content">
                            <h4>${event.title}</h4>
                            <p>${event.description}</p>
                            ${event.link ? `<a href="${event.link}" class="timeline-link">Ver más →</a>` : ''}
                        </div>
                    </div>
                `;
                container.innerHTML += eventHtml;
            });
            
            console.log('✅ Timeline cargado');
        })
        .catch(error => {
            console.error('Error cargando timeline:', error);
            container.innerHTML = `
                <div style="text-align: center; color: #ff6b6b; padding: 2rem;">
                    Error al cargar la línea de tiempo
                </div>
            `;
        });
}

// ===== RENDERIZAR PROYECTOS =====
function loadProjects() {
    const container = document.getElementById('projects-container');
    if (!container) {
        console.error('❌ No se encontró projects-container');
        return;
    }
    
    fetch('data/projects.json')
        .then(response => {
            if (!response.ok) throw new Error('Error cargando proyectos');
            return response.json();
        })
        .then(data => {
            container.innerHTML = '';
            
            data.projects.filter(p => p.featured).forEach(project => {
                const projectHtml = `
                    <div class="project-card">
                        <div class="project-badge">${project.badge}</div>
                        <div class="project-image">
                            <div class="project-preview">
                                <canvas id="${project.canvasId}" width="300" height="200"></canvas>
                            </div>
                        </div>
                        <div class="project-info">
                            <h3>${project.title}</h3>
                            <p>${project.description}</p>
                            <div class="project-tech">
                                ${project.tags.map(tag => `<span>${tag}</span>`).join('')}
                            </div>
                            <div class="project-links">
                                <a href="pages/proyectos/${project.pageFile}" class="btn-small">Ver más</a>
                                <a href="${project.codeLink}" target="_blank" class="btn-small">Código</a>
                            </div>
                        </div>
                    </div>
                `;
                container.innerHTML += projectHtml;
            });

            setTimeout(() => {
                drawPINNPreview();
                drawCosmologyPreview();
                drawRubikPreview();
            }, 100);
        })
        .catch(error => console.error('Error cargando proyectos:', error));
}

// ===== RENDERIZAR "AHORA MISMO" =====
function loadNow() {
    const container = document.getElementById('now-container');
    if (!container) {
        console.error('❌ No se encontró now-container');
        return;
    }
    
    fetch('data/now.json')
        .then(response => {
            if (!response.ok) throw new Error('Error cargando now');
            return response.json();
        })
        .then(data => {
            let html = '<div class="now-content">';
            html += '<h2 class="section-title">⚡ Ahora Mismo</h2>';
            html += '<ul>';
            data.items.forEach(item => {
                html += `<li><span class="now-emoji">${item.emoji}</span> ${item.text}</li>`;
            });
            html += '</ul>';
            html += `<p class="now-updated">Actualizado: ${data.last_updated}</p>`;
            html += '</div>';
            
            container.innerHTML = html;
        })
        .catch(error => console.error('Error cargando "ahora mismo":', error));
}

// ===== FUNCIONES PARA DIBUJAR CANVAS =====
function drawPINNPreview() {
    const canvas = document.getElementById('pinn-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#121a30';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.strokeStyle = '#4da3ff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    for (let x = 0; x < canvas.width; x++) {
        let y = 100 + 30 * Math.sin(x * 0.02) * Math.cos(x * 0.01);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.stroke();
    
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px Inter';
    ctx.fillText('PINN: Condiciones variables', 20, 30);
}

function drawCosmologyPreview() {
    const canvas = document.getElementById('cosmology-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#121a30';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.strokeStyle = '#4da3ff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    for (let x = 0; x < canvas.width; x++) {
        let y = 100 + 40 * Math.exp(-x/100) * Math.sin(x * 0.03);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.stroke();
    
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px Inter';
    ctx.fillText('Espectro de potencia', 20, 30);
}

function drawRubikPreview() {
    const canvas = document.getElementById('rubik-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#121a30';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#4da3ff';
    for (let i = 0; i < 10; i++) {
        let height = 30 + i * 8;
        ctx.fillRect(40 + i * 25, 150 - height, 15, height);
    }
    
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px Inter';
    ctx.fillText('Evolución de tiempos', 20, 30);
}

// ===== INICIALIZAR TODO =====
function init() {
    console.log('Inicializando página...');
    loadTimeline();
    loadProjects();
    loadNow();
    
    // Inicializar menú después de que los componentes estén cargados
    setTimeout(() => {
        initMobileMenu();
    }, 1000);
}

// Escuchar evento de componentes cargados
document.addEventListener('componentsLoaded', init);

// Si los componentes ya están cargados
if (document.readyState === 'complete') {
    init();
} else {
    window.addEventListener('load', init);
}
