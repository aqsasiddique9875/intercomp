// Mobile SPA Iframe Router based on mobile_execution_flow.md
const App = {
  activeView: 'splash',
  iframe: document.getElementById('portalFrame'),
  loader: document.getElementById('loadingOverlay'),

  // Mobile screen templates mapping
  screens: {
    'splash': 'screens/mobile_ad4fdcc896ba4b529a55fae35d3be56e_Liquid_Glass_Splash_Screen.html',
    'onboarding': 'screens/mobile_25a53d38e1b34f3f97656813e6fb0cb1_Onboarding_Carousel_COM-02.html',
    'role-selection': 'screens/mobile_ed5135a3e3674964b190166cbcbf1113_Role_Selection_COM-03.html',
    'reg': 'screens/mobile_1a076025461a4dc4bad866ed6d98bb3b_Student_Registration_COM-05.html',
    'signup': 'screens/mobile_signup.html',
    'login': 'screens/mobile_73c01c0c980a45af8f3fe8eac02040d2_Login_Screen_COM-04.html',
    'mfa': 'screens/mobile_3f182e61b905473294e58ff1bc99f585_Account_Security_MFA_-_Mobile.html',

    // Student Core
    'student-dash': 'screens/mobile_8bad17e278a64a9ca316744d376d9fb1_Student_Dashboard.html',
    'tests': 'screens/mobile_f6816511fb8a498b9f32199700db9876_Weekly_Tests_Hub.html',
    'test-entry': 'screens/mobile_1f162cf8bbc34279b557f56cffecaedc_Test_Entry__Guidelines.html',
    'test-player': 'screens/mobile_952d8a8184e24a54b99d386bb01670e0_Test_Player_Anti-Cheat_Mode.html',
    'courses': 'screens/mobile_e9aa3c620d904e9eb0be5f06961a8c67_Course_Catalog_Screen_19.html',
    'video': 'screens/mobile_ee618716fda44c04badbb3a4fb3932fa_Course_Player_-_Liquid_Glass_Elite.html',
    'assign': 'screens/mobile_4c34db15874749d18ab536bf7c7f1916_Assignment_Generator_ADM-05_-_iOS_Liquid_Glass.html',
    'submit': 'screens/mobile_5d0bbe95388b480da4f3d751bbc8f21b_Assignment_Submission_Page.html',
    'rewards': 'screens/mobile_74cdf5d70fff474c9f6f9c75ee8828cd_Rewards_Hub_STU-15_-_Liquid_Glass_Mobile.html',
    'leaderboard': 'screens/mobile_a1eab0a9d8014d8489d137377f183c4a_Student_Ranking__Leaderboard.html',
    'showcase': 'screens/mobile_d81ce52cb4c64bcdbb5e9d4144e0673e_Success_Showcase_STU-16.html',
    'profile': 'screens/mobile_3fe92f24fd834bf38ce21ce947d29733_Student_Profile_CV_Portfolio.html',
    'job-search': 'screens/mobile_7b107fe80c4845bfb0168fc817ca3f14_Search__Filters_JobsInternships.html',
    'job-details': 'screens/mobile_1458ea7fb7a94fb29ef274a5d90a2b7f_Job_Details_-_Senior_UX_Designer.html',

    // Company / Recruiter Core
    'company-dash': 'screens/mobile_e52141a0e71046c5b2161e0532141b7b_Company_Dashboard_COM-10_-_iOS_Liquid_Glass.html',
    'company-postings': 'screens/mobile_669895e3cc9942b0826c13924d96ef10_Postings_Management_COM-14_-_iOS_Liquid_Glass.html',
    'company-job-creator': 'screens/mobile_b8453ea8503645b49e74d4080f3f56f6_Job_Creator_Form_COM-13.html',
    'company-checkout': 'screens/mobile_ce13f8a276554ab2bb06c26e66b6af43_Recruiter_Checkout_COM-19_-_iOS_Liquid_Glass.html',
    'company-kanban': 'screens/mobile_e8103dc434044008b91ff204f4cfac09_Applicant_Kanban_-_TalentPlatform.html',
    'company-talent': 'screens/mobile_e0ba66f64cee43438e85d3e1d53c6df7_Talent_Search_COM-11_-_Liquid_Glass_Mobile.html',
    'company-profile': 'screens/mobile_company_profile.html',
    'company-plans': 'screens/mobile_company_plans.html',
    'company-candidate-details': 'screens/mobile_4e05dbfbeffe4e1181daadf5a1f89d0b_Candidate_Details_COM-12_-_iOS_Liquid_Glass.html',

    // Admin Core
    'admin-dash': 'screens/mobile_534216e3fb1a4c69a21c640a3f384df7_Admin_Dashboard_ADM-01_-_iOS_Liquid_Glass.html',
    'admin-verify': 'screens/mobile_65f943625e694479b189dbd82b9e519f_Verification_Queue_ADM-02_-_iOS_Liquid_Glass.html',
    'admin-courses': 'screens/mobile_d83b0828dee84eb09539bd870c1f4e67_Course_Management_Portal_ADM-09_-_iOS_Liquid_Glass.html',
    'admin-revenue': 'screens/mobile_admin_revenue.html',
    'admin-students': 'screens/mobile_admin_students.html',
    'admin-ads': 'screens/mobile_admin_ads.html',
    'admin-stories': 'screens/mobile_admin_stories.html'
  },

  // Clean slugs mapping matching the architecture specification
  slugs: {
    '#/splash': 'splash',
    '#/onboarding': 'onboarding',
    '#/role-selection': 'role-selection',
    '#/student/registration': 'reg',
    '#/student/signup': 'signup',
    '#/student/login': 'login',
    '#/student/mfa': 'mfa',
    '#/student/dashboard': 'student-dash',
    '#/student/test/entry': 'test-entry',
    '#/student/test/player': 'test-player',
    '#/student/courses': 'courses',
    '#/student/courses/video': 'video',
    '#/student/assignments': 'assign',
    '#/student/assignments/submit': 'submit',
    '#/student/rewards': 'rewards',
    '#/student/leaderboard': 'leaderboard',
    '#/student/showcase': 'showcase',
    '#/student/profile': 'profile',
    '#/student/jobs': 'job-search',
    '#/student/jobs/details': 'job-details',
    '#/company/dashboard': 'company-dash',
    '#/company/postings': 'company-postings',
    '#/company/postings/create': 'company-job-creator',
    '#/company/checkout': 'company-checkout',
    '#/company/kanban': 'company-kanban',
    '#/company/talent': 'company-talent',
    '#/company/profile': 'company-profile',
    '#/company/plans': 'company-plans',
    '#/company/candidate-details': 'company-candidate-details',
    '#/admin/dashboard': 'admin-dash',
    '#/admin/verify': 'admin-verify',
    '#/admin/courses': 'admin-courses',
    '#/admin/revenue': 'admin-revenue',
    '#/admin/students': 'admin-students',
    '#/admin/ads': 'admin-ads',
    '#/admin/stories': 'admin-stories'
  },

  getSlug(view) {
    for (const key in this.slugs) {
      if (this.slugs[key] === view) return key;
    }
    return null;
  },

  init() {
    const getActiveHash = () => {
      try {
        if (window.self !== window.top) {
          return window.top.location.hash;
        }
      } catch (e) {}
      return window.location.hash;
    };

    // Listen to hash changes in browser address bar
    const routingWindow = window.self !== window.top ? window.top : window;
    routingWindow.addEventListener('hashchange', () => {
      const hash = getActiveHash() || '#/splash';
      const view = this.slugs[hash];
      if (view && view !== this.activeView) {
        this.navigate(view, false);
      }
    });

    // Handle initial hash routing
    const initialHash = getActiveHash() || '#/splash';
    const initialView = this.slugs[initialHash] || 'splash';
    this.navigate(initialView, true);

    // Auto transition splash to onboarding in 2s
    setTimeout(() => {
      if (this.activeView === 'splash') {
        this.navigate('onboarding');
      }
    }, 2000);

    this.iframe.addEventListener('load', () => {
      this.hideLoader();
      this.injectScrollbarHiding();
      this.injectClickListeners();
      this.injectFetchInterceptor();
      this.injectAlertOverride();
      this.injectBottomNav();
      this.syncStatusBarBackground();
    });

    // Listen for cross-window navigation messages from the iframe
    window.addEventListener('message', (e) => {
      if (e.data && e.data.type === 'NAVIGATE') {
        this.navigate(e.data.view);
      }
    });
  },

  injectScrollbarHiding() {
    try {
      const doc = this.iframe.contentDocument || this.iframe.contentWindow.document;
      if (!doc) return;
      
      const style = doc.createElement('style');
      style.innerHTML = `
        /* Hide scrollbars globally on body */
        body {
          -ms-overflow-style: none !important;  /* IE and Edge */
          scrollbar-width: none !important;  /* Firefox */
        }
        body::-webkit-scrollbar {
          display: none !important; /* Chrome, Safari, Opera */
        }
        /* Hide scrollbars on all elements */
        ::-webkit-scrollbar {
          display: none !important;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none !important;
        }
      `;
      doc.head.appendChild(style);
    } catch (e) {
      console.warn("Failed to inject scrollbar hiding:", e);
    }
  },

  navigate(view, updateHash = true) {
    // Bypass Login/MFA/Signup screens: auto login mock student and route directly
    if (view === 'login' || view === 'mfa' || view === 'signup') {
      console.log(`Bypassing ${view} screen: logging in mock student and routing directly to dashboard`);
      const userObj = {
        id: "student_one",
        username: "studentone",
        email: "studentone@gmail.com",
        password: "123456",
        role: "student",
        skills: ["UI/UX Design", "Software Engineering", "React"],
        rating: 5.0,
        trustScore: 100
      };
      localStorage.setItem('currentUser', JSON.stringify(userObj));
      localStorage.setItem('supabase_access_token', 'mock_token_student');
      if (this.iframe && this.iframe.contentWindow) {
        try {
          this.iframe.contentWindow.localStorage.setItem('currentUser', JSON.stringify(userObj));
          this.iframe.contentWindow.localStorage.setItem('supabase_access_token', 'mock_token_student');
        } catch(e){}
      }
      view = 'student-dash';
    }

    // Session Guard check
    const isStudentView = ['student-dash', 'test-entry', 'test-player', 'courses', 'video', 'assign', 'submit', 'rewards', 'leaderboard', 'showcase', 'profile', 'job-search', 'job-details'].includes(view);
    const isCompanyView = ['company-dash', 'company-postings', 'company-checkout', 'company-kanban', 'company-talent', 'company-plans'].includes(view);
    
    let user = null;
    try {
      const stored = localStorage.getItem('currentUser') || (this.iframe && this.iframe.contentWindow && this.iframe.contentWindow.localStorage.getItem('currentUser'));
      if (stored) {
        user = JSON.parse(stored);
      }
    } catch (e) {}

    if (isStudentView && !user) {
      console.warn("Protected student view accessed without session, redirecting to login");
      view = 'login';
    } else if (isCompanyView && !user) {
      console.warn("Protected company view accessed without session, redirecting to role-selection");
      view = 'role-selection';
    }

    if (this.screens[view]) {
      this.activeView = view;
      this.showLoader();
      this.iframe.src = this.screens[view];
      
      if (updateHash) {
        const slug = this.getSlug(view);
        if (slug) {
          try {
            if (window.self !== window.top) {
              window.top.location.hash = slug;
            } else {
              window.location.hash = slug;
            }
          } catch (e) {
            window.location.hash = slug;
          }
        }
      }
    }
  },

  showLoader() {
    this.loader.style.opacity = '1';
    this.loader.style.pointerEvents = 'auto';
  },

  hideLoader() {
    this.loader.style.opacity = '0';
    this.loader.style.pointerEvents = 'none';
  },

  injectFetchInterceptor() {
    try {
      const win = this.iframe.contentWindow;
      if (!win) return;

      const originalFetch = win.fetch;
      win.fetch = function (resource, options = {}) {
        let token = null;
        try {
          for (let i = 0; i < win.localStorage.length; i++) {
            const key = win.localStorage.key(i);
            if (key && key.startsWith('sb-') && key.endsWith('-auth-token')) {
              const sessionData = JSON.parse(win.localStorage.getItem(key));
              if (sessionData && sessionData.access_token) {
                token = sessionData.access_token;
                break;
              }
            }
          }
        } catch (err) {}

        if (!token) {
          try {
            const storedUser = win.localStorage.getItem('currentUser');
            if (storedUser) {
              const userObj = JSON.parse(storedUser);
              token = userObj.token || 'mock_token';
            }
          } catch (err) {}
        }

        if (!token) {
          token = win.localStorage.getItem('supabase_access_token') || 'mock_token';
        }

        // Dynamically prefix relative /api calls with localhost:8080 when loaded from non-localhost base url
        if (typeof resource === 'string') {
          if (resource.startsWith('/api/') || resource.startsWith('api/')) {
            const relPath = resource.startsWith('/') ? resource : '/' + resource;
            const currentOrigin = win.location.origin;
            if (!currentOrigin || currentOrigin === 'null' || !currentOrigin.includes('localhost:8080')) {
              resource = 'http://localhost:8080' + relPath;
            }
          }
        }

        // Apply Authorization Header to our backend api calls
        if (token && typeof resource === 'string' && (resource.includes('localhost:8080') || resource.startsWith('/api/') || resource.startsWith('api/'))) {
          options.headers = options.headers || {};
          if (!options.headers['Authorization']) {
            options.headers['Authorization'] = `Bearer ${token}`;
          }
        }

        return originalFetch(resource, options)
          .then(res => {
            if (res.status === 401) {
              console.warn("Unauthorized API call, redirecting to login...");
              if (win.parent && win.parent.App) {
                win.parent.App.navigate('login');
              } else if (win.App) {
                win.App.navigate('login');
              }
            }
            return res;
          })
          .catch(err => {
            console.error("Fetch request failed:", err);
            alert("Network connection error. Please verify the backend API server is running on http://localhost:8080");
            throw err;
          });
      };
    } catch (err) {
      console.warn("Fetch intercept injection failed:", err);
    }
  },

  injectAlertOverride() {
    try {
      const win = this.iframe.contentWindow;
      if (!win) return;
      win.alert = (message) => {
        console.log("Iframe alert intercepted:", message);
        window.postMessage({
          type: 'SHOW_TOAST',
          message: message,
          isWarning: message.toLowerCase().includes('error') || message.toLowerCase().includes('fail') || message.toLowerCase().includes('warning') || message.toLowerCase().includes('cheat')
        }, '*');
      };
    } catch (e) {
      console.warn("Failed to override iframe alert:", e);
    }
  },

  injectClickListeners() {
    try {
      const doc = this.iframe.contentDocument || this.iframe.contentWindow.document;

      // Inject Anti-Cheat tab-blur listener on proctor player screen
      if (this.activeView === 'test-player') {
        const blurHandler = () => {
          let studentEmail = 'studentone@gmail.com';
          let studentName = 'Student One';
          try {
            const stored = this.iframe.contentWindow.localStorage.getItem('currentUser') || localStorage.getItem('currentUser');
            if (stored) {
              const u = JSON.parse(stored);
              studentEmail = u.email || studentEmail;
              studentName = u.username || studentName;
            }
          } catch(e){}

          // Log defocus activity to backend API
          fetch('http://localhost:8080/api/activity/log', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              studentName: studentName,
              email: studentEmail,
              alert: 'Proctor Defocus Alert (App switch)',
              severity: 'medium'
            })
          }).catch(err => console.error("Failed to log activity alert:", err));

          // Post warning message to parent to trigger Dynamic Island animation
          window.postMessage({ type: 'PROCTOR_WARNING', message: 'Anti-cheat flag raised: Focus lost!' }, '*');
        };
        this.iframe.contentWindow.addEventListener('blur', blurHandler);
      }

      doc.addEventListener('click', (e) => {
        const target = e.target.closest('button, a, [role="button"], .cursor-pointer, .kanban-item, .course-card, .assign-card, .job-card');
        if (!target) return;

        const text = (target.textContent || '').trim().toLowerCase();
        const id = (target.id || '').toLowerCase();
        const className = (target.className || '').toLowerCase();

        console.log(`Mobile Click: Text="${text}", ID="${id}", Class="${className}"`);

        // Global Back Button Handling
        const isBackClick = text === 'back' || id === 'back' || className.includes('back') || text === 'arrow_back' || text.includes('chevron_left');
        if (isBackClick) {
          if (this.activeView === 'video') {
            this.navigate('courses');
            return;
          } else if (this.activeView === 'submit') {
            this.navigate('assign');
            return;
          } else if (this.activeView === 'job-details') {
            this.navigate('job-search');
            return;
          } else if (this.activeView === 'test-entry' || this.activeView === 'test-player') {
            this.navigate('student-dash');
            return;
          } else if (['courses', 'assign', 'leaderboard', 'rewards', 'showcase', 'profile', 'job-search'].includes(this.activeView)) {
            this.navigate('student-dash');
            return;
          } else if (['company-postings', 'company-talent', 'company-kanban', 'company-checkout'].includes(this.activeView)) {
            this.navigate('company-dash');
            return;
          }
        }

        // Global Bottom Tab Navigation for core student screens
        const isStudentJourney = ['student-dash', 'courses', 'assign', 'leaderboard', 'rewards', 'showcase', 'profile', 'job-search', 'job-details'].includes(this.activeView);
        if (isStudentJourney) {
          if (text.includes('schedule') || text.includes('calendar') || text.includes('discover')) {
            this.navigate('student-dash');
            return;
          }
          if (text.includes('groups') || text.includes('applied') || text.includes('leaderboard')) {
            this.navigate('leaderboard');
            return;
          }
          if (text.includes('results') || text.includes('saved') || text.includes('badge') || text.includes('reward')) {
            this.navigate('rewards');
            return;
          }
          if (text.includes('settings') || text.includes('profile') || text.includes('person') || text.includes('account')) {
            this.navigate('profile');
            return;
          }
        }

        // Navigation Routing Rules
        if (this.activeView === 'onboarding') {
          this.navigate('role-selection');
        }

        else if (this.activeView === 'role-selection') {
          if (text.includes('student') || id.includes('student') || text.includes('candidate') || text.includes('exploring')) {
            // Automatically log in as mock student
            const userObj = {
              id: "student_one",
              username: "studentone",
              email: "studentone@gmail.com",
              password: "123456",
              role: "student",
              skills: ["UI/UX Design", "Software Engineering", "React"],
              rating: 5.0,
              trustScore: 100
            };
            localStorage.setItem('currentUser', JSON.stringify(userObj));
            localStorage.setItem('supabase_access_token', 'mock_token_student');
            if (this.iframe && this.iframe.contentWindow) {
              try {
                this.iframe.contentWindow.localStorage.setItem('currentUser', JSON.stringify(userObj));
                this.iframe.contentWindow.localStorage.setItem('supabase_access_token', 'mock_token_student');
              } catch(e){}
            }
            this.navigate('student-dash');
          } else if (text.includes('recruiter') || text.includes('company') || id.includes('recruiter') || text.includes('access dashboard')) {
            // Automatically log in as mock recruiter
            const userObj = {
              id: "company_second",
              username: "companysecond",
              email: "companysecond@gmail.com",
              password: "123456",
              role: "recruiter",
              companyId: "3",
              companyName: "zylor.io"
            };
            localStorage.setItem('currentUser', JSON.stringify(userObj));
            localStorage.setItem('supabase_access_token', 'mock_token_recruiter');
            if (this.iframe && this.iframe.contentWindow) {
              try {
                this.iframe.contentWindow.localStorage.setItem('currentUser', JSON.stringify(userObj));
                this.iframe.contentWindow.localStorage.setItem('supabase_access_token', 'mock_token_recruiter');
              } catch(e){}
            }
            this.navigate('company-dash');
          } else if (text.includes('admin') || text.includes('administrator') || id.includes('admin') || text.includes('enter admin portal')) {
            // Automatically log in as mock admin
            const userObj = {
              id: "admin_one",
              username: "adminone",
              email: "adminone@gmail.com",
              password: "123456",
              role: "admin"
            };
            localStorage.setItem('currentUser', JSON.stringify(userObj));
            localStorage.setItem('supabase_access_token', 'mock_token_admin');
            if (this.iframe && this.iframe.contentWindow) {
              try {
                this.iframe.contentWindow.localStorage.setItem('currentUser', JSON.stringify(userObj));
                this.iframe.contentWindow.localStorage.setItem('supabase_access_token', 'mock_token_admin');
              } catch(e){}
            }
            this.navigate('admin-dash');
          }
        }

        else if (this.activeView === 'login') {
          if (text.includes('register') || text.includes('sign up') || text.includes('join now')) {
            this.navigate('signup');
          } else {
            this.navigate('mfa');
          }
        }

        else if (this.activeView === 'signup') {
          if (text.includes('login') || text.includes('already have an account')) {
            this.navigate('login');
          } else {
            this.navigate('login');
          }
        }

        else if (this.activeView === 'reg') {
          this.navigate('login');
        }

        else if (this.activeView === 'mfa') {
          // Handled inside iframe or by postMessage OTP verify logic
        }

        else if (this.activeView === 'student-dash') {
          if (id === 'navApplications' || text.includes('applications')) {
            this.navigate('job-search');
          } else if (id === 'navLeaderboard' || text.includes('leaderboard')) {
            this.navigate('leaderboard');
          } else if (id === 'navRewards' || text.includes('rewards')) {
            this.navigate('rewards');
          } else if (id === 'navProfile' || text.includes('profile') || id.includes('profile') || className.includes('profile')) {
            this.navigate('profile');
          } else if (id === 'cardActiveCourse' || className.includes('btn-resume') || text.includes('resume class')) {
            this.navigate('courses');
          } else if (id === 'cardAssessment' || className.includes('btn-join') || text.includes('join proctor room')) {
            this.navigate('test-entry');
          } else if (text.includes('logout') || text.includes('exit')) {
            this.navigate('role-selection');
          }
        }

        else if (this.activeView === 'test-entry') {
          if (text.includes('launch') || text.includes('start') || text.includes('player')) {
            this.navigate('test-player');
          }
        }

        else if (this.activeView === 'test-player') {
          if (text.includes('submit') || text.includes('done') || id.includes('submit') || text.includes('save & next')) {
            alert("Secure assessment completed. Syncing score with proctor databases...");
            
            let studentEmail = 'studentone@gmail.com';
            try {
              const stored = this.iframe.contentWindow.localStorage.getItem('currentUser') || localStorage.getItem('currentUser');
              if (stored) studentEmail = JSON.parse(stored).email || studentEmail;
            } catch(e){}

            fetch('http://localhost:8080/api/tests/submit', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: studentEmail,
                score: 85,
                testId: 'calculus_101',
                testTitle: 'Advanced Calculus Final'
              })
            })
            .then(res => res.json())
            .then(data => {
              window.postMessage({ type: 'TEST_COMPLETED', score: 85 }, '*');
            })
            .catch(err => console.error("Test submit API error:", err));

            this.navigate('student-dash');
          }
        }

        else if (this.activeView === 'admin-dash') {
          if (text.includes('queue') || text.includes('process next') || text.includes('verify') || text.includes('in queue') || text.includes('urgent flags') || text.includes('flag') || text.includes('report') || text.includes('security')) {
            this.navigate('admin-verify');
          }
        }

        else if (this.activeView === 'courses') {
          if (className.includes('course-card') || text.includes('advanced') || text.includes('ux') || text.includes('software') || text.includes('continue')) {
            this.navigate('video');
          }
        }

        else if (this.activeView === 'video') {
          // Handled inside iframe (selecting lectures, player controls, tabs)
        }

        else if (this.activeView === 'assign') {
          if (className.includes('assign-card') || text.includes('parser') || text.includes('view') || text.includes('submit')) {
            this.navigate('submit');
          }
        }

        else if (this.activeView === 'submit') {
          if (text.includes('submit') || id.includes('submit') || className.includes('btn-submit')) {
            alert("Project submission successful.");
            this.navigate('assign');
          }
        }

        else if (this.activeView === 'profile') {
          if (text.includes('search') || text.includes('job') || id.includes('jobs') || text.includes('opportunities')) {
            this.navigate('job-search');
          }
        }

        else if (this.activeView === 'job-search') {
          if (className.includes('job-card') || text.includes('apply') || text.includes('ux') || text.includes('designer') || text.includes('strategist') || text.includes('developer')) {
            alert("Application submitted successfully!");
          }
        }

        // Company / Recruiter routes
        else if (this.activeView === 'company-dash') {
          if (text.includes('post job') || text.includes('create job') || id.includes('cardPostJob') || text.includes('add_circle')) {
            this.navigate('company-job-creator');
          } else if (text.includes('posting') || text.includes('job list') || id.includes('cardPostings')) {
            this.navigate('company-postings');
          } else if (text.includes('schedule') || text.includes('kanban') || id.includes('cardApplicants')) {
            this.navigate('company-kanban');
          } else if (text.includes('applicant') || text.includes('talent') || text.includes('candidate') || id.includes('cardTalent')) {
            this.navigate('company-talent');
          } else if (text.includes('checkout') || text.includes('pay') || id.includes('cardBilling')) {
            this.navigate('company-checkout');
          } else if (text.includes('logout') || text.includes('exit')) {
            this.navigate('role-selection');
          }
        }
      });
    } catch (err) {
      console.warn("Iframe click intercept warning: ", err);
    }
  },

  injectBottomNav() {
    try {
      const doc = this.iframe.contentDocument || this.iframe.contentWindow.document;
      if (!doc) return;

      const studentViews = ['student-dash', 'courses', 'video', 'assign', 'submit', 'rewards', 'leaderboard', 'showcase', 'profile', 'job-search', 'job-details'];
      const companyViews = ['company-dash', 'company-postings', 'company-kanban', 'company-talent', 'company-checkout', 'company-profile', 'company-plans', 'company-candidate-details'];
      const adminViews = ['admin-dash', 'admin-verify', 'admin-courses', 'admin-revenue', 'admin-students', 'admin-ads', 'admin-stories'];

      const isStudent = studentViews.includes(this.activeView);
      const isCompany = companyViews.includes(this.activeView);
      const isAdmin = adminViews.includes(this.activeView);

      if (!isStudent && !isCompany && !isAdmin) return;

      // Find existing nav element
      let nav = doc.querySelector('nav') || doc.getElementById('bottom-nav') || doc.querySelector('.bottom-nav');
      if (!nav) return;

      if (isStudent) {
        // Define student tabs
        const tabs = [
          { id: 'dashboard', label: 'Dashboard', icon: 'grid_view', view: 'student-dash' },
          { id: 'job', label: 'Job', icon: 'work', view: 'job-search' },
          { id: 'course', label: 'Course', icon: 'school', view: 'courses' },
          { id: 'profile', label: 'Profile', icon: 'person', view: 'profile' }
        ];

        // Build HTML
        const tabsHtml = tabs.map(tab => {
          let isActive = false;
          if (tab.id === 'dashboard') {
            isActive = ['student-dash', 'rewards', 'leaderboard', 'test-entry', 'test-player', 'assign', 'submit', 'showcase'].includes(this.activeView);
          } else if (tab.id === 'job') {
            isActive = ['job-search', 'job-details'].includes(this.activeView);
          } else if (tab.id === 'course') {
            isActive = ['courses', 'video'].includes(this.activeView);
          } else if (tab.id === 'profile') {
            isActive = ['profile'].includes(this.activeView);
          }

          const colorClass = isActive ? "text-primary font-bold" : "text-outline hover:text-primary-container";
          const fillSetting = isActive ? "font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;" : "font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;";

          return `
            <a class="flex flex-col items-center justify-center ${colorClass} active:scale-95 transition-transform duration-200 cursor-pointer" data-tab="${tab.id}">
              <span class="material-symbols-outlined text-[24px]" style="${fillSetting}">${tab.icon}</span>
              <span class="font-label-caps-mobile text-[11px] mt-1">${tab.label}</span>
            </a>
          `;
        }).join('');

        // Replace nav content
        nav.className = "fixed bottom-0 left-0 right-0 max-w-md mx-auto z-50 pb-1.5 rounded-t-2xl bg-white/20 border-t border-glass-border shadow-lg flex justify-around items-center h-20 px-4";
        nav.setAttribute('style', 'backdrop-filter: blur(28px); -webkit-backdrop-filter: blur(28px);');
        nav.innerHTML = tabsHtml;

        // Add click listeners to new tabs
        const navLinks = nav.querySelectorAll('a');
        navLinks.forEach(link => {
          link.addEventListener('click', (e) => {
            e.preventDefault();
            const tab = link.dataset.tab;
            if (tab === 'dashboard') this.navigate('student-dash');
            if (tab === 'job') this.navigate('job-search');
            if (tab === 'course') this.navigate('courses');
            if (tab === 'profile') this.navigate('profile');
          });
        });
      } else if (isCompany) {
        // Define company tabs
        const tabs = [
          { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', view: 'company-dash' },
          { id: 'postings', label: 'Postings', icon: 'work', view: 'company-postings' },
          { id: 'applicants', label: 'Applicants', icon: 'group', view: 'company-talent' },
          { id: 'reports', label: 'Reports', icon: 'analytics', view: 'company-checkout' }
        ];

        // Build HTML
        const tabsHtml = tabs.map(tab => {
          let isActive = false;
          if (tab.id === 'dashboard') {
            isActive = (this.activeView === 'company-dash');
          } else if (tab.id === 'postings') {
            isActive = (this.activeView === 'company-postings');
          } else if (tab.id === 'applicants') {
            isActive = ['company-kanban', 'company-talent', 'company-candidate-details'].includes(this.activeView);
          } else if (tab.id === 'reports') {
            isActive = (this.activeView === 'company-checkout');
          }

          const colorClass = isActive ? "text-primary font-bold" : "text-outline hover:text-primary-container";
          const fillSetting = isActive ? "font-variation-settings: 'FILL' 1;" : "";

          return `
            <a class="flex flex-col items-center justify-center ${colorClass} active:scale-95 transition-transform duration-200 cursor-pointer" data-tab="${tab.id}">
              <span class="material-symbols-outlined text-[24px]" style="${fillSetting}">${tab.icon}</span>
              <span class="font-label-caps-mobile text-[11px] mt-1">${tab.label}</span>
            </a>
          `;
        }).join('');

        // Replace nav content
        nav.className = "fixed bottom-0 left-0 right-0 max-w-md mx-auto z-50 pb-1.5 rounded-t-2xl bg-white/20 border-t border-glass-border shadow-lg flex justify-around items-center h-20 px-4";
        nav.setAttribute('style', 'backdrop-filter: blur(28px); -webkit-backdrop-filter: blur(28px);');
        nav.innerHTML = tabsHtml;

        // Add click listeners to new tabs
        const navLinks = nav.querySelectorAll('a');
        navLinks.forEach(link => {
          link.addEventListener('click', (e) => {
            e.preventDefault();
            const tab = link.dataset.tab;
            if (tab === 'dashboard') this.navigate('company-dash');
            if (tab === 'postings') this.navigate('company-postings');
            if (tab === 'applicants') this.navigate('company-talent');
            if (tab === 'reports') this.navigate('company-checkout');
          });
        });
      } else if (isAdmin) {
        // Define admin tabs
        const tabs = [
          { id: 'home', label: 'Home', icon: 'home', view: 'admin-dash' },
          { id: 'verify', label: 'Verify', icon: 'verified_user', view: 'admin-verify' },
          { id: 'courses', label: 'Courses', icon: 'school', view: 'admin-courses' },
          { id: 'students', label: 'Students', icon: 'groups', view: 'admin-students' }
        ];

        // Build HTML
        const tabsHtml = tabs.map(tab => {
          let isActive = false;
          if (tab.id === 'home') {
            isActive = (this.activeView === 'admin-dash');
          } else if (tab.id === 'verify') {
            isActive = (this.activeView === 'admin-verify');
          } else if (tab.id === 'courses') {
            isActive = (this.activeView === 'admin-courses');
          } else if (tab.id === 'students') {
            isActive = (this.activeView === 'admin-students');
          }

          const colorClass = isActive ? "text-primary font-bold" : "text-outline hover:text-primary-container";
          const fillSetting = isActive ? "font-variation-settings: 'FILL' 1;" : "";

          return `
            <a class="flex flex-col items-center justify-center ${colorClass} active:scale-95 transition-transform duration-200 cursor-pointer" data-tab="${tab.id}">
              <span class="material-symbols-outlined text-[24px]" style="${fillSetting}">${tab.icon}</span>
              <span class="font-label-caps-mobile text-[11px] mt-1">${tab.label}</span>
            </a>
          `;
        }).join('');

        // Replace nav content
        nav.className = "fixed bottom-0 left-0 right-0 max-w-md mx-auto z-50 pb-1.5 rounded-t-2xl bg-white/20 border-t border-glass-border shadow-lg flex justify-around items-center h-20 px-4";
        nav.setAttribute('style', 'backdrop-filter: blur(28px); -webkit-backdrop-filter: blur(28px);');
        nav.innerHTML = tabsHtml;

        // Add click listeners to new tabs
        const navLinks = nav.querySelectorAll('a');
        navLinks.forEach(link => {
          link.addEventListener('click', (e) => {
            e.preventDefault();
            const tab = link.dataset.tab;
            if (tab === 'home') this.navigate('admin-dash');
            if (tab === 'verify') this.navigate('admin-verify');
            if (tab === 'courses') this.navigate('admin-courses');
            if (tab === 'students') this.navigate('admin-students');
          });
        });
      }
    } catch(err) {
      console.warn("Failed to inject bottom nav:", err);
    }
  },

  syncStatusBarBackground() {
    try {
      const doc = this.iframe.contentDocument || this.iframe.contentWindow.document;
      if (!doc) return;
      
      const bodyStyle = window.getComputedStyle(doc.body);
      const bgColor = bodyStyle.backgroundColor;
      const bgImage = bodyStyle.backgroundImage;
      
      const deviceScreen = document.getElementById('deviceScreen');
      if (deviceScreen) {
        deviceScreen.style.backgroundColor = bgColor;
        deviceScreen.style.backgroundImage = bgImage;
      }
    } catch(err) {
      console.warn("Failed to sync status bar background:", err);
    }
  }
};

window.App = App;
App.init();
