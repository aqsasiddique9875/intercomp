// Full-Stack Integrated Admin Portal Routing & Controller
const App = {
  activeView: 'dash',
  iframe: document.getElementById('adminFrame'),
  loader: document.getElementById('loadingOverlay'),
  
  // Backend URL
  backendUrl: 'http://localhost:8080',

  screens: {
    'dash': {
      title: 'Dashboard',
      icon: 'dashboard',
      url: 'screens/desktop_26f948ad3cd8471dbc91fb662c7c35a7_Central_Dashboard_-_Admin_Module.html'
    },
    'assign-generator': {
      title: 'Assignment Gen',
      icon: 'post_add',
      url: 'screens/desktop_54d5f0f8362a4e279b958d3ee6e27864_Assignment_Generator_-_Admin_Module.html'
    },
    'test-creator': {
      title: 'Test Creator',
      icon: 'quiz',
      url: 'screens/desktop_c6f0aa98715e456591fff25c7df65a2b_Test__Question_Bank_Creator_-_Split_Editor.html'
    },
    'quiz-dashboard': {
      title: 'Quiz Hub',
      icon: 'folder_special',
      url: 'screens/desktop_quiz_dashboard.html'
    },
    'ad-moderator': {
      title: 'Ad Moderator',
      icon: 'ads_click',
      url: 'screens/desktop_a8f12953a7ab4dd287fe9d32f7f7f0d3_Advertisement_Moderator_Admin_Module.html'
    },
    'campaigns': {
      title: 'Campaigns',
      icon: 'campaign',
      url: '/website/screens/desktop_38d13a4151134b38ad31e1c9decf2071_Ad_Campaign_Creator_Live_Preview.html'
    },
    'talent-pool': {
      title: 'Talent Pool',
      icon: 'person_search',
      url: '/website/screens/desktop_ca20e9e2ae964a9cb4e2060d71f5cb93_Talent_Search_Candidate_Search.html'
    },
    'budget': {
      title: 'Budget',
      icon: 'payments',
      url: '/website/screens/desktop_356ca8320edd454d98ab206be61f431c_Payment_Billing_Dashboard.html'
    },
    'submission-evaluator': {
      title: 'Submission Evaluator',
      icon: 'rate_review',
      url: 'screens/desktop_169677f127374c2b908c2ee327be6597_Student_Submission_Evaluator_-_Evaluation_Cockpit.html'
    },
    'courses': {
      title: 'Course Manager',
      icon: 'menu_book',
      url: 'screens/desktop_8ff103c6ce6f44619e695be8619b7625_Course_Management_Portal_-_Asset_Manager.html'
    },
    'email': {
      title: 'Email',
      icon: 'mail',
      url: 'screens/desktop_email_logs.html'
    },
    'success-publisher': {
      title: 'Success Stories',
      icon: 'publish',
      url: 'screens/desktop_ebcc7c1f3daf45f7a59183d1fda584b9_Success_Story_Publisher_-_Admin_Console.html'
    },
    'verify-queue': {
      title: 'Verification Queue',
      icon: 'verified_user',
      url: 'screens/desktop_02ef60e8cd50480eb342757ee5f80671_Company_Verification_Queue_-_Admin_Panel.html'
    },
    'website-admin': {
      title: 'Website Builder',
      icon: 'web',
      url: 'screens/desktop_website_admin.html'
    }
  },

  placeholders: {
    'dash': 'Search system logs...',
    'verify-queue': 'Search companies...',
    'assign-generator': 'Search assignments...',
    'test-creator': 'Search test questions...',
    'quiz-dashboard': 'Search quizzes...',
    'success-publisher': 'Search applications...',
    'ad-moderator': 'Search advertisements...',
    'campaigns': 'Search campaigns...',
    'talent-pool': 'Search candidates by name/skills...',
    'budget': 'Search transactions & invoices...',
    'submission-evaluator': 'Search student submissions...',
    'courses': 'Search assets & courses...',
    'email': 'Search email logs...',
    'website-admin': 'Search blog posts, SEO tags, or pages...'
  },

  getIframeSearchInput(doc) {
    if (!doc) return null;
    const ids = ['searchInput', 'searchBar', 'jobSearchInput', 'candidateSearchInput', 'logSearchInput', 'questionSearchInput', 'search-input', 'topbar-search'];
    for (let id of ids) {
      const el = doc.getElementById(id);
      if (el) return el;
    }
    const inputs = doc.querySelectorAll('input[type="text"], input[type="search"], input:not([type])');
    for (let input of inputs) {
      const placeholder = (input.getAttribute('placeholder') || '').toLowerCase();
      if (placeholder.includes('search') || placeholder.includes('filter')) {
        return input;
      }
    }
    return null;
  },

  performGenericDOMFilter(doc, query) {
    if (!doc) return;
    const cleanQuery = query.toLowerCase().trim();
    
    // 1. Table rows inside tbody
    const tbodies = doc.querySelectorAll('tbody');
    if (tbodies.length > 0) {
      let foundRows = false;
      tbodies.forEach(tbody => {
        const rows = tbody.querySelectorAll('tr');
        if (rows.length > 0) foundRows = true;
        rows.forEach(row => {
          if (row.cells && row.cells.length === 1 && (row.textContent.includes('Loading') || row.textContent.includes('No '))) {
            return;
          }
          const text = row.textContent.toLowerCase();
          if (!cleanQuery || text.includes(cleanQuery)) {
            row.style.setProperty('display', '', 'important');
          } else {
            row.style.setProperty('display', 'none', 'important');
          }
        });
      });
      if (foundRows) return;
    }
    
    // 2. Logs / list streams (e.g. security monitor, dashboard notifications)
    const logContainers = doc.querySelectorAll('.custom-scrollbar, #log-container, #logStream, .log-container, [id*="log-container" i], [id*="logStream" i]');
    if (logContainers.length > 0) {
      let foundLogs = false;
      logContainers.forEach(container => {
        const items = container.children;
        if (items.length > 0) foundLogs = true;
        for (let item of items) {
          const text = item.textContent.toLowerCase();
          if (!cleanQuery || text.includes(cleanQuery)) {
            item.style.setProperty('display', '', 'important');
          } else {
            item.style.setProperty('display', 'none', 'important');
          }
        }
      });
      if (foundLogs) return;
    }
    
    // 3. Grid cards (Quiz Hub, Verification Queue, etc.)
    const cards = doc.querySelectorAll('.glass-card, .card, [class*="card" i], .grid > div, .flex > div');
    if (cards.length > 0) {
      cards.forEach(card => {
        // Skip sidebar, header, topbar, nav, or main body wrappers
        if (
          card.closest('aside') || 
          card.closest('header') || 
          card.closest('nav') || 
          card.id === 'mainNavBar' || 
          card.tagName === 'BODY' ||
          card.tagName === 'HTML' ||
          card.tagName === 'MAIN'
        ) {
          return;
        }
        const text = card.textContent.toLowerCase();
        if (!cleanQuery || text.includes(cleanQuery)) {
          card.style.setProperty('display', '', 'important');
        } else {
          card.style.setProperty('display', 'none', 'important');
        }
      });
    }
  },

  init() {
    this.renderNavBar();
    
    if (document.fonts) {
      document.fonts.ready.then(() => {
        document.documentElement.classList.add('fonts-loaded');
      });
    } else {
      document.documentElement.classList.add('fonts-loaded');
    }
    
    this.iframe.addEventListener('load', () => {
      this.hideLoader();
      this.syncWithBackend();
      this.injectInterceptors();
      this.cleanIframeStyles();

      // Add fonts-loaded class to iframe document
      try {
        const doc = this.iframe.contentDocument || this.iframe.contentWindow.document;
        if (doc) {
          if (doc.fonts) {
            doc.fonts.ready.then(() => {
              doc.documentElement.classList.add('fonts-loaded');
            });
          } else {
            doc.documentElement.classList.add('fonts-loaded');
          }
        }
      } catch (e) {}

      // Sync search input value on load
      const mainSearchInput = document.getElementById('topbar-search');
      if (mainSearchInput && mainSearchInput.value) {
        try {
          const doc = this.iframe.contentDocument || this.iframe.contentWindow.document;
          const iframeSearchInput = this.getIframeSearchInput(doc);
          if (iframeSearchInput) {
            iframeSearchInput.value = mainSearchInput.value;
            iframeSearchInput.dispatchEvent(new Event('input', { bubbles: true }));
          }
          this.performGenericDOMFilter(doc, mainSearchInput.value);
        } catch (e) {}
      }
    });

    // Bind search input to dynamically find and trigger child iframe search inputs
    const mainSearchInput = document.getElementById('topbar-search');
    if (mainSearchInput) {
      mainSearchInput.addEventListener('input', (e) => {
        try {
          const doc = this.iframe.contentDocument || this.iframe.contentWindow.document;
          if (!doc) return;
          
          const iframeSearchInput = this.getIframeSearchInput(doc);
          if (iframeSearchInput) {
            iframeSearchInput.value = e.target.value;
            iframeSearchInput.dispatchEvent(new Event('input', { bubbles: true }));
            iframeSearchInput.dispatchEvent(new Event('change', { bubbles: true }));
            iframeSearchInput.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, key: 'Enter' }));
          }
          
          // Apply fallback/companion generic DOM filtering to ensure visual results match search query
          this.performGenericDOMFilter(doc, e.target.value);
        } catch (err) {
          console.warn("Failed to delegate search to iframe:", err);
        }
      });
    }

    // Check hash on load to persist active screen
    const hash = window.location.hash.substring(1);
    if (hash && this.screens[hash]) {
      this.navigate(hash);
    } else {
      this.navigate('dash');
    }

    // Handle hashchange event
    window.addEventListener('hashchange', () => {
      const currentHash = window.location.hash.substring(1);
      if (currentHash && this.screens[currentHash] && currentHash !== this.activeView) {
        this.navigate(currentHash);
      }
    });
  },

  navigate(view, queryParams = '') {
    if (this.screens[view]) {
      this.activeView = view;
      this.showLoader();
      
      // Add a timestamp cache-buster to force reload and bypass browser cache
      const cacheBuster = (queryParams ? '&' : '?') + 't=' + Date.now();
      this.iframe.src = this.screens[view].url + queryParams + cacheBuster;
      
      this.updateActiveNav();

      // Update topbar search placeholder and reset value on navigation
      const mainSearchInput = document.getElementById('topbar-search');
      if (mainSearchInput) {
        mainSearchInput.placeholder = this.placeholders[view] || 'Search...';
        mainSearchInput.value = '';
      }
      
      // Update hash in URL if it's different
      if (window.location.hash.substring(1) !== view) {
        window.location.hash = view;
      }
    }
  },

  showToast(message, type = 'success') {
    let container = document.getElementById('global-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'global-toast-container';
      container.className = 'fixed bottom-5 right-5 z-[10000] flex flex-col gap-3 pointer-events-none';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `pointer-events-auto flex items-center gap-3 px-6 py-4 rounded-2xl shadow-xl transition-all duration-300 transform translate-y-10 opacity-0 ${
        type === 'error' 
            ? 'bg-red-500 text-white border border-red-400' 
            : 'bg-primary text-white border border-primary-container/30'
    }`;
    toast.style.backdropFilter = 'blur(12px)';

    const icon = document.createElement('span');
    icon.className = 'material-symbols-outlined';
    icon.textContent = type === 'error' ? 'error' : 'check_circle';

    const text = document.createElement('span');
    text.className = 'text-sm font-semibold';
    text.textContent = message;

    toast.appendChild(icon);
    toast.appendChild(text);
    container.appendChild(toast);

    toast.offsetHeight;
    toast.classList.remove('translate-y-10', 'opacity-0');

    setTimeout(() => {
        toast.classList.add('translate-y-10', 'opacity-0');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
  },

  renderNavBar() {
    const nav = document.getElementById('mainNavBar');
    if (!nav) return;
    
    nav.innerHTML = '';
    
    Object.keys(this.screens).forEach(key => {
      const screen = this.screens[key];
      const a = document.createElement('a');
      a.href = '#';
      a.dataset.view = key;
      a.className = "flex items-center gap-3 text-purple-950/70 px-4 py-3 hover:bg-[#a34cbe]/10 hover:text-primary transition-all rounded-xl cursor-pointer text-xs font-semibold";
      
      const iconSpan = document.createElement('span');
      iconSpan.className = "material-symbols-outlined text-xl";
      iconSpan.textContent = screen.icon;
      
      const textSpan = document.createElement('span');
      textSpan.className = "text-xs font-semibold";
      textSpan.textContent = screen.title;
      
      a.appendChild(iconSpan);
      a.appendChild(textSpan);
      
      a.addEventListener('click', (e) => {
        e.preventDefault();
        this.navigate(key);
      });
      
      nav.appendChild(a);
    });
    
    this.updateActiveNav();
  },

  updateActiveNav() {
    const nav = document.getElementById('mainNavBar');
    if (!nav) return;
    
    const links = nav.querySelectorAll('a');
    links.forEach(link => {
      const view = link.dataset.view;
      if (view === this.activeView) {
        link.className = "flex items-center gap-3 text-purple-950 px-4 py-3 active-nav transition-all rounded-xl cursor-pointer text-xs font-semibold";
      } else {
        link.className = "flex items-center gap-3 text-purple-950/70 px-4 py-3 hover:bg-[#a34cbe]/10 hover:text-primary transition-all rounded-xl cursor-pointer text-xs font-semibold";
      }
    });
  },

  cleanIframeStyles() {
    try {
      const doc = this.iframe.contentDocument || this.iframe.contentWindow.document;
      
      // Inject standard override CSS to hide any page-specific sidebar/topbar and reset margins
      const style = doc.createElement('style');
      style.id = 'admin-injected-overrides';
      style.textContent = `
        aside.fixed.left-0, nav.fixed.left-0, #shared-sidebar, #shared-topbar, nav.fixed.top-0, header.fixed.top-0, header.sticky.top-0, nav.sticky.top-0, #ce-injected-header, #admin-sidebar { display: none !important; }
        html, body, .liquid-bg, body.liquid-bg, div.liquid-bg {
          padding-left: 0px !important;
          padding-top: 0px !important;
          background: #dae1f5 !important;
          background-color: #dae1f5 !important;
          background-image: none !important;
        }
        /* Hide local top header search bars inside the iframe (but keep inline filters like university search visible) */
        #shared-topbar input, header input, #job-search, #topbar-search {
          display: none !important;
        }
        .orb, [class*="orb"] {
          display: none !important;
        }
        body > main, main { margin-left: 0px !important; padding-left: 30px !important; padding-right: 30px !important; }
        body > main, main { padding-top: 2rem !important; }
        body > main, main, .max-w-max-width, [class*="max-w-max-width"], .max-w-container-max, [class*="max-w-container-max"] { max-width: none !important; width: 100% !important; }
        
        /* Hide scrollbars inside the iframe */
        html, body {
          scrollbar-width: none !important;
          -ms-overflow-style: none !important;
        }
        html::-webkit-scrollbar, body::-webkit-scrollbar {
          display: none !important;
        }
        /* Remove blue focus outline/ring on all inputs inside iframe */
        input:focus, textarea:focus, select:focus {
          outline: none !important;
          box-shadow: none !important;
          border-color: transparent !important;
          --tw-ring-color: transparent !important;
          --tw-ring-offset-width: 0px !important;
        }
        .material-symbols-outlined {
          visibility: hidden;
        }
        .fonts-loaded .material-symbols-outlined {
          visibility: visible !important;
        }
      `;
      doc.head.appendChild(style);

      // Force inline style overrides on main element to prevent child scripts from overriding specificity
      const mainEl = doc.querySelector('body > main, main');
      if (mainEl) {
        mainEl.style.setProperty('margin-left', '0px', 'important');
        mainEl.style.setProperty('padding-left', '30px', 'important');
        mainEl.style.setProperty('padding-right', '30px', 'important');
        mainEl.style.setProperty('padding-top', '20px', 'important');
      }
    } catch (err) {
      console.warn("Clean iframe styles error:", err);
    }
  },

  navigateExternal(url) {
    this.showLoader();
    this.iframe.src = url;
  },

  showLoader() {
    this.loader.style.opacity = '1';
    this.loader.style.pointerEvents = 'auto';
  },

  hideLoader() {
    this.loader.style.opacity = '0';
    this.loader.style.pointerEvents = 'none';
  },

  // Sync data dynamically with our Express backend and inject into raw Stitch HTML DOM
  syncWithBackend() {
    try {
      const doc = this.iframe.contentDocument || this.iframe.contentWindow.document;
      
      if (this.activeView === 'dash') {
        // Fetch data totals to update dashboard badges
        Promise.all([
          fetch(`${this.backendUrl}/api/companies`).then(r => r.json()),
          fetch(`${this.backendUrl}/api/submissions`).then(r => r.json()),
          fetch(`${this.backendUrl}/api/activities`).then(r => r.json()),
          fetch(`${this.backendUrl}/api/tests`).then(r => r.json()).catch(() => [])
        ]).then(([companies, subs, activities, tests]) => {
          // Dynamically replace text counts in dashboard cards if element tags exist
          const pendingComp = companies.filter(c => c.status === 'pending').length;
          const pendingGrades = subs.filter(s => s.status === 'pending').length;
          
          console.log(`Synced dashboard counts: Pending Companies=${pendingComp}, Pending Grades=${pendingGrades}`);
          
          const doc = this.iframe.contentDocument || this.iframe.contentWindow.document;
          if (doc) {
            const countEl = doc.getElementById('published-quizzes-count');
            if (countEl) {
              countEl.textContent = tests.length;
            }
          }
        });
      } 
      
      else if (this.activeView === 'verify-queue') {
        fetch(`${this.backendUrl}/api/companies`)
          .then(r => r.json())
          .then(companies => {
            console.log("Verify queue sync: ", companies);
            // We can inject rows or update text values inside the verification queue
          });
      }
    } catch (err) {
      console.warn("DOM sync warning: ", err);
    }
  },

  injectInterceptors() {
    try {
      const doc = this.iframe.contentDocument || this.iframe.contentWindow.document;
      doc.addEventListener('click', (e) => {
        const target = e.target.closest('button, a, [role="button"], .cursor-pointer, td, tr');
        if (!target) return;

        const text = (target.textContent || '').trim().toLowerCase();
        const id = (target.id || '').toLowerCase();
        
        console.log(`Admin Click: Text="${text}", ID="${id}"`);

        // Prioritize QuizStudio Tab Navigation
        const quizStudioViews = ['courses', 'test-creator', 'assign-generator', 'security-log', 'quiz-dashboard'];
        if (quizStudioViews.includes(this.activeView)) {
          if (text === 'dashboard') {
            e.preventDefault();
            this.navigate('courses');
            return;
          } else if (text === 'question bank') {
            e.preventDefault();
            this.navigate('test-creator');
            return;
          } else if (text === 'quiz hub') {
            e.preventDefault();
            this.navigate('quiz-dashboard');
            return;
          } else if (text === 'assessments') {
            e.preventDefault();
            this.navigate('assign-generator');
            return;
          } else if (text === 'analytics') {
            e.preventDefault();
            this.navigate('security-log');
            return;
          } else if (text.includes('create new quiz') || id === 'create-new-btn' || id === 'empty-action-btn') {
            e.preventDefault();
            this.navigate('test-creator');
            return;
          } else if (target.classList.contains('resume-btn') || text.includes('resume')) {
            const idx = target.dataset.idx;
            e.preventDefault();
            this.navigate('test-creator', '?draft_idx=' + idx);
            return;
          }
        }

        // Router rules
        if (this.activeView === 'dash') {
          if (text.includes('verification') || text.includes('verify company') || text.includes('company queue')) {
            this.navigate('verify-queue');
          } else if (text.includes('cheating') || text.includes('suspicious') || text.includes('log')) {
            this.navigate('security-log');
          } else if (text.includes('test') || text.includes('question bank') || text.includes('creator')) {
            this.navigate('test-creator');
          } else if (text.includes('quiz hub') || text.includes('quiz dashboard') || text.includes('quizzes')) {
            this.navigate('quiz-dashboard');
          } else if (text.includes('assignment') || text.includes('generator')) {
            this.navigate('assign-generator');
          } else if (text.includes('submission') || text.includes('evaluation') || text.includes('grade')) {
            this.navigate('submission-evaluator');
          } else if (text.includes('ad') || text.includes('moderator')) {
            this.navigate('ad-moderator');
          } else if (text.includes('campaign')) {
            this.navigate('campaigns');
          } else if (text.includes('course') || text.includes('asset') || text.includes('learning')) {
            this.navigate('courses');
          } else if (text.includes('success') || text.includes('publisher') || text.includes('story')) {
            this.navigate('success-publisher');
          }
        } 
        
        else if (this.activeView === 'ad-moderator' || this.activeView === 'campaigns') {
          if (text === 'campaigns') {
            e.preventDefault();
            this.navigateExternal('/website/screens/desktop_38d13a4151134b38ad31e1c9decf2071_Ad_Campaign_Creator_Live_Preview.html');
            this.activeView = 'campaigns';
            this.updateActiveNav();
          } else if (text === 'analytics') {
            e.preventDefault();
            this.navigateExternal('screens/desktop_a8f12953a7ab4dd287fe9d32f7f7f0d3_Advertisement_Moderator_Admin_Module.html');
            this.activeView = 'ad-moderator';
            this.updateActiveNav();
          } else if (text === 'talent pool') {
            e.preventDefault();
            this.navigateExternal('/website/screens/desktop_ca20e9e2ae964a9cb4e2060d71f5cb93_Talent_Search_Candidate_Search.html');
          } else if (text === 'budget') {
            e.preventDefault();
            this.navigateExternal('/website/screens/desktop_356ca8320edd454d98ab206be61f431c_Payment_Billing_Dashboard.html');
          } else if (text.includes('back') || id.includes('back')) {
            this.navigate('dash');
          }
        }
        
        else if (this.activeView === 'verify-queue') {
          if (text.includes('verify') || text.includes('view') || text.includes('skylync.io') || text.includes('coreknot.io')) {
            this.navigate('doc-verify');
          } else if (text.includes('back') || id.includes('back')) {
            this.navigate('dash');
          }
        } 
        
        else if (this.activeView === 'doc-verify') {
          if (text.includes('approve') || text.includes('verify') || text.includes('validate')) {
            // Call backend to verify company 1
            fetch(`${this.backendUrl}/api/companies/verify`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ id: '1', status: 'verified' })
            }).then(() => {
              this.showToast("Company status updated to verified in db.json.", "success");
              this.navigate('verify-queue');
            });
          } else if (text.includes('back') || id.includes('back')) {
            this.navigate('verify-queue');
          }
        } 
        
        else if (this.activeView === 'assign-generator') {
          if (text.includes('create') || text.includes('submit') || text.includes('generate')) {
            // Get inputs inside iframe
            const titleInput = doc.querySelector('input[placeholder*="title"], input[type="text"]');
            const titleVal = titleInput ? titleInput.value : 'HTML5 Canvas Parser';
            
            fetch(`${this.backendUrl}/api/assignments/create`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ title: titleVal, deadline: 'Thursday' })
            }).then(() => {
              this.showToast(`Assignment "${titleVal}" generated successfully!`, "success");
              this.navigate('dash');
            });
          } else if (text.includes('back') || id.includes('back')) {
            this.navigate('dash');
          }
        } 
        
        else if (this.activeView === 'test-creator') {
          if (text.includes('go to dashboard') || id === 'dash-nav-btn' || id === 'close-review-btn') {
            e.preventDefault();
            this.navigate('dash');
          }
        } 
        
        else if (this.activeView === 'submission-evaluator') {
          if (text.includes('submit') || text.includes('grade') || text.includes('evaluate')) {
            fetch(`${this.backendUrl}/api/submissions/grade`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ id: '101', grade: 'A+' })
            }).then(() => {
              this.showToast("Student grade updated successfully.", "success");
              this.navigate('dash');
            });
          } else if (text.includes('back') || id.includes('back')) {
            this.navigate('dash');
          }
        }
 
        else {
          if (text.includes('back') || id.includes('back')) {
            this.navigate('dash');
          }
        }
      });
    } catch (err) {
      console.warn("Click interceptor warning: ", err);
    }
  }
};

App.init();
