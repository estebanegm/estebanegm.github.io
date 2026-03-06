// Renderizar proyectos destacados
fetch('data/projects.json')
    .then(response => response.json())
    .then(data => {
        const container = document.getElementById('projects-container');
        if (!container) return;
        
        // Limpiar el contenedor
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
                            <!-- ESTOS SON LOS ENLACES CORREGIDOS -->
                            <a href="pages/proyectos/${project.pageFile}" class="btn-small">Ver más</a>
                            <a href="${project.codeLink}" target="_blank" class="btn-small">Código</a>
                        </div>
                    </div>
                </div>
            `;
        });

        // Reinicializar canvases
        if (typeof drawPINNPreview === 'function') drawPINNPreview();
        if (typeof drawCosmologyPreview === 'function') drawCosmologyPreview();
        if (typeof drawRubikPreview === 'function') drawRubikPreview();
    });