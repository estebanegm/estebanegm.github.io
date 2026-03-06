// ===== RENDERIZAR TIMELINE =====
fetch('data/timeline.json')
    .then(response => {
        if (!response.ok) throw new Error('No se pudo cargar timeline.json');
        return response.json();
    })
    .then(data => {
        const container = document.getElementById('timeline-container');
        if (!container) {
            console.warn('No se encontró el contenedor del timeline');
            return;
        }
        
        let html = '';
        data.events.sort((a, b) => new Date(b.date) - new Date(a.date)).forEach(event => {
            html += `
                <div class="timeline-item ${event.category}">
                    <div class="timeline-date">${event.date}</div>
                    <div class="timeline-content">
                        <h4>${event.title}</h4>
                        <p>${event.description}</p>
                        ${event.link ? `<a href="${event.link}" class="timeline-link">Ver más →</a>` : ''}
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
        console.log('Timeline cargado correctamente');
    })
    .catch(error => {
        console.error('Error cargando timeline:', error);
        // Fallback: mostrar timeline con datos quemados
        const container = document.getElementById('timeline-container');
        if (container) {
            container.innerHTML = `
                <div class="timeline-item education">
                    <div class="timeline-date">2025</div>
                    <div class="timeline-content">
                        <h4>Diplomado en Física Teórica - MCTP</h4>
                        <p>Especialización en cosmología numérica y teoría de campos.</p>
                    </div>
                </div>
                <div class="timeline-item education">
                    <div class="timeline-date">2024</div>
                    <div class="timeline-content">
                        <h4>Titulación Ingeniería en Física Aplicada</h4>
                        <p>Tesis: 'Solución de la ecuación de calor unidimensional estacionaria empleando una red neuronal físicamente informada'.</p>
                    </div>
                </div>
                <div class="timeline-item research">
                    <div class="timeline-date">2024</div>
                    <div class="timeline-content">
                        <h4>Poster en 2° Congreso ICF UNAM</h4>
                        <p>Presentación de resultados de tesis sobre PINNs.</p>
                    </div>
                </div>
                <div class="timeline-item rubik">
                    <div class="timeline-date">2018</div>
                    <div class="timeline-content">
                        <h4>Miembro del Oaxaca Rubik's Team</h4>
                        <p>Coordinador y representante.</p>
                    </div>
                </div>
            `;
        }
    });

// ===== RENDERIZAR PROYECTOS DESTACADOS =====
fetch('data/projects.json')
    .then(response => {
        if (!response.ok) throw new Error('No se pudo cargar projects.json');
        return response.json();
    })
    .then(data => {
        const container = document.getElementById('projects-container');
        if (!container) {
            console.warn('No se encontró el contenedor de proyectos');
            return;
        }
        
        container.innerHTML = '';
        
        data.projects.filter(p => p.featured).forEach(project => {
            container.innerHTML += `
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
        });

        // Dibujar los canvas
        setTimeout(() => {
            if (typeof drawPINNPreview === 'function') drawPINNPreview();
            if (typeof drawCosmologyPreview === 'function') drawCosmologyPreview();
            if (typeof drawRubikPreview === 'function') drawRubikPreview();
        }, 100);
    })
    .catch(error => console.error('Error cargando proyectos:', error));

// ===== RENDERIZAR "AHORA MISMO" =====
fetch('data/now.json')
    .then(response => {
        if (!response.ok) throw new Error('No se pudo cargar now.json');
        return response.json();
    })
    .then(data => {
        const container = document.getElementById('now-container');
        if (!container) {
            console.warn('No se encontró el contenedor de "ahora mismo"');
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

// ===== FUNCIONES PARA DIBUJAR CANVAS =====
function drawPINNPreview() {
    const canvas = document.getElementById('pinn-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Dibujar gradiente
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(0, '#4da3ff');
    gradient.addColorStop(1, '#2d7be0');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(20, 70, canvas.width-40, 30);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px Inter';
    ctx.fillText('Ecuación de calor 1D', 20, 50);
    ctx.fillText('T(x,t) con BC variables', 20, 130);
}

function drawCosmologyPreview() {
    const canvas = document.getElementById('cosmology-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.strokeStyle = '#4da3ff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    for (let x = 0; x < canvas.width; x++) {
        let y = 100 + 30 * Math.sin(x * 0.03) * Math.cos(x * 0.01);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.stroke();
    
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px Inter';
    ctx.fillText('Espectro de potencia P(k)', 20, 50);
}

function drawRubikPreview() {
    const canvas = document.getElementById('rubik-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#4da3ff';
    for (let i = 0; i < 10; i++) {
        let height = 30 + i * 5;
        ctx.fillRect(40 + i * 25, 150 - height, 15, height);
    }
    
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px Inter';
    ctx.fillText('Evolución de tiempos', 20, 50);
}