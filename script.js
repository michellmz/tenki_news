document.addEventListener('DOMContentLoaded', () => {

    // --- Elementos del DOM ---
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    const searchBar = document.getElementById('search-bar');
    const tagContainer = document.getElementById('tag-container');
    const articleGrid = document.getElementById('article-grid');
    const articleCards = document.querySelectorAll('.article-card');

    let currentActiveTag = 'all'; // Estado para el filtro de etiquetas

    // --- 1. Funcionalidad de Modo Oscuro/Claro ---

    const STORAGE_KEY_THEME = 'tenki-news-theme';

    function loadTheme() {
        const storedTheme = localStorage.getItem(STORAGE_KEY_THEME);
        // Si no hay nada guardado, usa el 'theme-dark' por defecto del body
        if (storedTheme) {
            body.className = storedTheme;
        }
        updateThemeIcon();
    }

    function saveTheme(theme) {
        localStorage.setItem(STORAGE_KEY_THEME, theme);
    }

    function updateThemeIcon() {
        if (body.classList.contains('theme-dark')) {
            themeToggle.textContent = '☀️'; // Icono para cambiar a claro
        } else {
            themeToggle.textContent = '🌙'; // Icono para cambiar a oscuro
        }
    }

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('theme-dark');
        body.classList.toggle('theme-light');
        saveTheme(body.className);
        updateThemeIcon();
    });

    // --- 2. Generación Dinámica de Etiquetas ---

    function generateTags() {
        const tagSet = new Set();
        
        // Recolectar todas las etiquetas
        articleCards.forEach(card => {
            const tags = card.dataset.tags.split(',');
            tags.forEach(tag => tagSet.add(tag.trim()));
        });

        // Crear botones de etiquetas
        tagContainer.innerHTML = ''; // Limpiar contenedor
        
        // Botón "All"
        const allButton = document.createElement('button');
        allButton.className = 'tag-filter active'; // 'All' es activo por defecto
        allButton.dataset.tag = 'all';
        allButton.textContent = 'All Categories';
        tagContainer.appendChild(allButton);

        // Botones para cada etiqueta
        tagSet.forEach(tag => {
            const button = document.createElement('button');
            button.className = 'tag-filter';
            button.dataset.tag = tag;
            // Capitalizar la primera letra para mostrar
            button.textContent = tag.charAt(0).toUpperCase() + tag.slice(1); 
            tagContainer.appendChild(button);
        });
    }

    // --- 3. Lógica de Filtro (Búsqueda y Etiquetas) ---

    function filterArticles() {
        const searchTerm = searchBar.value.toLowerCase();

        articleCards.forEach(card => {
            const cardText = card.textContent.toLowerCase();
            const cardTags = card.dataset.tags;

            // Comprobar coincidencia de texto
            const textMatch = cardText.includes(searchTerm);

            // Comprobar coincidencia de etiqueta
            const tagMatch = (currentActiveTag === 'all' || cardTags.includes(currentActiveTag));

            // Mostrar u ocultar la tarjeta
            if (textMatch && tagMatch) {
                card.classList.remove('hide');
            } else {
                card.classList.add('hide');
            }
        });
    }

    // --- 4. Event Listeners para Filtros ---

    // Listener para la barra de búsqueda
    searchBar.addEventListener('input', filterArticles);

    // Listener para el contenedor de etiquetas (delegación de eventos)
    tagContainer.addEventListener('click', (e) => {
        // Asegurarse de que se hizo clic en un botón de filtro
        if (e.target.classList.contains('tag-filter')) {
            
            // Quitar 'active' del botón anterior
            tagContainer.querySelector('.active').classList.remove('active');
            
            // Añadir 'active' al botón clicado
            e.target.classList.add('active');
            
            // Actualizar el estado del filtro activo
            currentActiveTag = e.target.dataset.tag;
            
            // Volver a filtrar
            filterArticles();
        }
    });

    // --- Inicialización ---
    loadTheme();
    generateTags();
    
});
