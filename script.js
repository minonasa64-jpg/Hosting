document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('year').textContent = new Date().getFullYear();

    let allApps = [];
    const appsGrid = document.getElementById('appsGrid');
    const searchInput = document.getElementById('searchInput');
    const categoryButtons = document.querySelectorAll('#categoryFilters button');

    fetch('apps.json')
        .then(response => response.json())
        .then(data => {
            allApps = data;
            renderApps(allApps);
        })
        .catch(error => {
            console.error('خطأ في تحميل البيانات:', error);
            appsGrid.innerHTML = '<p style="text-align:center;grid-column:1/-1;color:var(--text-secondary);">عذراً، حدث خطأ في تحميل التطبيقات.</p>';
        });

    function renderApps(apps) {
        appsGrid.innerHTML = '';
        
        if (apps.length === 0) {
            appsGrid.innerHTML = '<p style="text-align:center;grid-column:1/-1;color:var(--text-secondary);">لا توجد تطبيقات مطابقة لبحثك.</p>';
            return;
        }

        apps.forEach(app => {
            const card = document.createElement('div');
            card.className = 'app-card';
            
            const img = document.createElement('img');
            img.src = app.icon || 'https://via.placeholder.com/90';
            img.alt = app.name;
            img.className = 'app-icon';
            
            const title = document.createElement('h3');
            title.textContent = app.name;
            
            const category = document.createElement('span');
            category.className = 'app-category';
            category.textContent = app.category;
            
            const desc = document.createElement('p');
            desc.className = 'app-desc';
            desc.textContent = app.description;
            
            const meta = document.createElement('div');
            meta.className = 'app-meta';
            meta.innerHTML = `
                <span><i class="fa-solid fa-code-branch"></i> ${app.version}</span>
                <span><i class="fa-solid fa-hard-drive"></i> ${app.size}</span>
            `;
            
            const btn = document.createElement('a');
            btn.href = app.download_url;
            btn.className = 'download-btn';
            btn.target = '_blank';
            btn.innerHTML = '<i class="fa-solid fa-download"></i> تحميل الآن';
            
            card.appendChild(img);
            card.appendChild(title);
            card.appendChild(category);
            card.appendChild(desc);
            card.appendChild(meta);
            card.appendChild(btn);
            
            appsGrid.appendChild(card);
        });
    }

    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const activeCategory = document.querySelector('#categoryFilters button.active').dataset.category;
        filterApps(term, activeCategory);
    });

    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const category = button.dataset.category;
            const term = searchInput.value.toLowerCase();
            filterApps(term, category);
        });
    });

    function filterApps(searchTerm, category) {
        let filtered = allApps;
        
        if (category !== 'all') {
            filtered = filtered.filter(app => app.category === category);
        }
        
        if (searchTerm) {
            filtered = filtered.filter(app => 
                app.name.toLowerCase().includes(searchTerm) || 
                app.description.toLowerCase().includes(searchTerm)
            );
        }
        
        renderApps(filtered);
    }
});
