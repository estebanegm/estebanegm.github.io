// Renderizar proyectos destacados
fetch('data/projects.json')
    .then(response => response.json())
    .then(data => {
        const container = document.getElementById('projects-container');
        if (!container) return;
        
        data.projects.filter(p => p.featured).forEach(project => {
            container.innerHTML += `
                <div class="project-card" onclick="window.location.href='${project.link}'">
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
                            <a href="${project.link}" class="btn-small">Ver más</a>
                            <a href="${project.codeLink}" class="btn-small">Código</a>
                        </div>
                    </div>
                </div>
            `;
        });

        // Reinicializar canvases si existen funciones de dibujo
        if (typeof drawPINNPreview === 'function') drawPINNPreview();
        if (typeof drawCosmologyPreview === 'function') drawCosmologyPreview();
        if (typeof drawRubikPreview === 'function') drawRubikPreview();
    });

// Renderizar "Ahora mismo"
fetch('data/now.json')
    .then(response => response.json())
    .then(data => {
        const container = document.getElementById('now-container');
        if (!container) return;
        
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
    });

// Renderizar Timeline
fetch('data/timeline.json')
    .then(response => response.json())
    .then(data => {
        const container = document.getElementById('timeline-container');
        if (!container) return;
        
        let html = '<div class="timeline">';
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
        html += '</div>';
        
        container.innerHTML = html;
    });

// Funciones de dibujo para los canvas (simplificadas, puedes mantener las originales)
function drawPINNPreview() {
    const canvas = document.getElementById('pinn-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#4da3ff';
    ctx.fillRect(20, 50, canvas.width-40, 30);
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px Inter';
    ctx.fillText('PINN: Condiciones variables', 20, 100);
}

function drawCosmologyPreview() {
    const canvas = document.getElementById('cosmology-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = '#4da3ff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let x=0; x<canvas.width; x++) {
        let y = 100 + 30 * Math.sin(x*0.03);
        if (x===0) ctx.moveTo(x,y);
        else ctx.lineTo(x,y);
    }
    ctx.stroke();
}

function drawRubikPreview() {
    const canvas = document.getElementById('rubik-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#4da3ff';
    for (let i=0; i<10; i++) {
        ctx.fillRect(40 + i*25, 120 - i*5, 10, 30);
    }
}