// ===== RENDERIZAR TIMELINE =====
function loadTimeline() {
    fetch('data/timeline.json')
        .then(response => {
            if (!response.ok) throw new Error('Error cargando timeline');
            return response.json();
        })
        .then(data => {
            const container = document.getElementById('timeline-container');
            if (!container) {
                console.error('No se encontró el contenedor timeline-container');
                return;
            }
            
            // Limpiar contenedor
            container.innerHTML = '';
            
            // Ordenar eventos por fecha (más reciente primero)
            const events = data.events.sort((a, b) => {
                return parseInt(b.date) - parseInt(a.date);
            });
            
            // Generar HTML
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
            
            console.log('✅ Timeline cargado correctamente');
        })
        .catch(error => {
            console.error('Error cargando timeline:', error);
            // Mostrar mensaje de error en el contenedor
            const container = document.getElementById('timeline-container');
            if (container) {
                container.innerHTML = `
                    <div style="text-align: center; color: #ff6b6b; padding: 2rem;">
                        <i class="fas fa-exclamation-triangle"></i>
                        Error al cargar la línea de tiempo
                    </div>
                `;
            }
        });
}

// ===== RENDERIZAR PROYECTOS =====
function loadProjects() {
    fetch('data/projects.json')
        .then(response => {
            if (!response.ok) throw new Error('Error cargando proyectos');
            return response.json();
        })
        .then(data => {
            const container = document.getElementById('projects-container');
            if (!container) {
                console.error('No se encontró el contenedor projects-container');
                return;
            }
            
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

            // Dibujar canvases después de un pequeño retraso
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
    fetch('data/now.json')
        .then(response => {
            if (!response.ok) throw new Error('Error cargando now');
            return response.json();
        })
        .then(data => {
            const container = document.getElementById('now-container');
            if (!container) {
                console.error('No se encontró el contenedor now-container');
                return;
            }
            
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
    
    // Dibujar fondo
    ctx.fillStyle = '#121a30';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Dibujar gráfica
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
    
    // Dibujar barras
    ctx.fillStyle = '#4da3ff';
    for (let i = 0; i < 10; i++) {
        let height = 30 + i * 8;
        ctx.fillRect(40 + i * 25, 150 - height, 15, height);
    }
    
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px Inter';
    ctx.fillText('Evolución de tiempos', 20, 30);
}

// ===== INICIALIZAR TODO CUANDO EL DOM ESTÉ LISTO =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM cargado, inicializando...');
    
    // Verificar que los contenedores existen
    setTimeout(() => {
        loadTimeline();
        loadProjects();
        loadNow();
    }, 500); // Pequeño retraso para asegurar que los componentes se cargaron
});

// También intentar cuando los componentes se carguen
window.addEventListener('load', function() {
    console.log('Página completamente cargada');
});
