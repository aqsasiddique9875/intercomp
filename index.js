document.addEventListener('DOMContentLoaded', () => {
  let allScreens = [];
  let currentFilter = {
    device: 'all',
    category: 'all',
    search: ''
  };

  // Selectors
  const screenList = document.getElementById('screenList');
  const visibleCount = document.getElementById('visibleCount');
  const screenSearch = document.getElementById('screenSearch');
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tagFilters = document.querySelectorAll('.tag-filter');
  
  const activeScreenTitle = document.getElementById('activeScreenTitle');
  const activeScreenDevice = document.getElementById('activeScreenDevice');
  const activeScreenId = document.getElementById('activeScreenId');
  const openExternal = document.getElementById('openExternal');
  
  const previewCanvas = document.getElementById('previewCanvas');
  const deviceFrame = document.getElementById('deviceFrame');
  const prototypeFrame = document.getElementById('prototypeFrame');
  const btnFit = document.getElementById('btnFit');
  const btnActual = document.getElementById('btnActual');
  const btnRotate = document.getElementById('btnRotate');
  
  // Add a nice overlay initially
  showWelcomeOverlay();

  // Load manifest.json
  fetch('screens/manifest.json')
    .then(res => res.json())
    .then(data => {
      allScreens = data;
      renderScreens();
    })
    .catch(err => {
      console.error("Failed to load screens manifest:", err);
      screenList.innerHTML = `<li class="error-msg" style="padding: 20px; text-align: center; color: var(--text-muted);">
        <i class="ri-error-warning-line" style="font-size: 24px; display: block; margin-bottom: 8px;"></i>
        Unable to load screens manifest. Please run the download script.
      </li>`;
    });

  // Search filter
  screenSearch.addEventListener('input', (e) => {
    currentFilter.search = e.target.value.toLowerCase();
    renderScreens();
  });

  // Device filters
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter.device = btn.dataset.device;
      renderScreens();
    });
  });

  // Category tags
  tagFilters.forEach(tag => {
    tag.addEventListener('click', () => {
      tagFilters.forEach(t => t.classList.remove('active'));
      tag.classList.add('active');
      currentFilter.category = tag.dataset.category;
      renderScreens();
    });
  });

  // Render screens list
  function renderScreens() {
    screenList.innerHTML = '';
    
    const filtered = allScreens.filter(s => {
      const matchesSearch = s.title.toLowerCase().includes(currentFilter.search) || s.id.includes(currentFilter.search);
      const matchesDevice = currentFilter.device === 'all' || s.device.toLowerCase() === currentFilter.device;
      
      let matchesCategory = true;
      if (currentFilter.category !== 'all') {
        const cat = currentFilter.category.toLowerCase();
        const title = s.title.toLowerCase();
        if (cat === 'student') {
          matchesCategory = title.includes('student') || title.includes('stu-') || title.includes('academic') || title.includes('member');
        } else if (cat === 'recruiter') {
          matchesCategory = title.includes('recruiter') || title.includes('company') || title.includes('active postings') || title.includes('talent') || title.includes('interviews') || title.includes('com-');
        } else if (cat === 'admin') {
          matchesCategory = title.includes('admin') || title.includes('adm-') || title.includes('moderator') || title.includes('evaluator') || title.includes('question bank');
        } else if (cat === 'onboarding') {
          matchesCategory = title.includes('splash') || title.includes('onboarding') || title.includes('gateway') || title.includes('role selection') || title.includes('login') || title.includes('forgot') || title.includes('security');
        }
      }
      
      return matchesSearch && matchesDevice && matchesCategory;
    });

    visibleCount.textContent = filtered.length;

    if (filtered.length === 0) {
      screenList.innerHTML = `<li style="padding: 20px; text-align: center; color: var(--text-muted); font-size: 13px;">No screens match the filters.</li>`;
      return;
    }

    filtered.forEach(s => {
      const li = document.createElement('li');
      li.className = 'screen-item';
      li.dataset.id = s.id;
      
      const isMobile = s.device.toLowerCase() === 'mobile';
      
      li.innerHTML = `
        <div class="screen-info">
          <span class="screen-title">${s.title}</span>
          <span class="screen-device ${s.device.toLowerCase()}">
            <i class="${isMobile ? 'ri-cellphone-line' : 'ri-computer-line'}"></i>
            ${s.device}
          </span>
        </div>
        <i class="ri-arrow-right-s-line screen-arrow"></i>
      `;
      
      li.addEventListener('click', () => {
        document.querySelectorAll('.screen-item').forEach(item => item.classList.remove('active'));
        li.classList.add('active');
        loadScreen(s);
      });
      
      screenList.appendChild(li);
    });
  }

  // Load selected screen into iframe
  function loadScreen(screen) {
    // Remove welcome overlay if present
    const welcome = document.querySelector('.welcome-overlay');
    if (welcome) welcome.remove();

    // Set metadata
    activeScreenTitle.textContent = screen.title;
    activeScreenDevice.textContent = screen.device;
    activeScreenDevice.className = `badge ${screen.device.toLowerCase()}`;
    activeScreenId.textContent = `Screen ID: ${screen.id}`;
    
    // Enable external link button
    openExternal.href = `screens/${screen.filename}`;
    openExternal.classList.remove('disabled');

    // Reset rotation & styles
    btnRotate.disabled = screen.device.toLowerCase() !== 'mobile';
    deviceFrame.classList.remove('landscape');
    
    // Set frame device type
    if (screen.device.toLowerCase() === 'mobile') {
      deviceFrame.className = 'device-frame mobile-mode';
    } else {
      deviceFrame.className = 'device-frame desktop-mode';
    }

    // Load URL in iframe
    prototypeFrame.src = `screens/${screen.filename}`;
  }

  // Showcase Welcome Overlay
  function showWelcomeOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'welcome-overlay';
    overlay.innerHTML = `
      <i class="ri-code-box-line welcome-logo"></i>
      <h3>EliteHire Interface Portal</h3>
      <p>Browse, preview, and test 130 fully interactive design system screens. Filter by device type, system modules, or search by keyword to begin.</p>
    `;
    previewCanvas.appendChild(overlay);
  }

  // Fit & Actual Size Zooming
  btnFit.addEventListener('click', () => {
    btnActual.classList.remove('active');
    btnFit.classList.add('active');
    deviceFrame.classList.add('fit-mode');
  });

  btnActual.addEventListener('click', () => {
    btnFit.classList.remove('active');
    btnActual.classList.add('active');
    deviceFrame.classList.remove('fit-mode');
  });

  // Rotation switcher for mobile
  btnRotate.addEventListener('click', () => {
    deviceFrame.classList.toggle('landscape');
  });
});
