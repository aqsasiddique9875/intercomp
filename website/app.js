// Desktop SPA Iframe Router to use exact Stitch UI designs
const App = {
  activeView: 'splash',
  iframe: document.getElementById('portalFrame'),
  loader: document.getElementById('loadingOverlay'),

  // Screen files mapping
  screens: {
    'splash': 'screens/desktop_45bff8936a0044e694117e3b29aa5016_Desktop_Splash_Screen_-_Liquid_Glass_Elite.html',
    'onboarding': 'screens/desktop_92044a9e1c374317b32ccd3a24c085b0_Web_App_Onboarding_-_Verified_Assessments.html',
    'gateway': 'screens/desktop_dbcbd25e2aad48aebc8aca14924256fe_Gateway__Role_Selection_COM-03_-_Desktop.html',
    'register': 'screens/desktop_8fbdc8acf6464e618391e06ace7f9fe0_Student_Registration_Wizard_COM-05_-_Desktop.html',
    'login': 'screens/desktop_2bb05765b3404d8aa183e003a445cb67_Login_Screen_COM-04_-_Desktop_Liquid_Glass.html',
    'mfa': 'screens/desktop_243f4482cdec478ca59fe6f217373a36_Account_Security_MFA_-_Desktop.html',
    'student-dash': 'screens/desktop_652a4f60981b4e48aec1b1e58c75318c_Main_Dashboard_The_Habit_Loop_Hub.html',
    'recruiter-dash': 'screens/desktop_8b4165aa923042888bc128ee52bfebe4_Company_Dashboard_-_Command_Center.html',
    'tests': 'screens/desktop_259e275b59144d80865c766dbc962bbc_Weekly_Tests_Hub_STU-05_-_Desktop_Liquid_Glass.html',
    'mock-interviews': 'screens/desktop_mock_interviews.html',
    'guidelines': 'screens/desktop_a20bf89f9c0143a491f14f4c9b800e3a_Test_Integrity__Guidelines_STU-06.html',
    'player': 'screens/desktop_6a6c6e2ffcec472cb8095585aae804cb_STU-07_Anti-Cheat_Test_Player_Desktop.html',
    'courses': 'screens/desktop_ccfeaf6a83cb45ab9794a18d3d7f3696_Course_Catalog_STU-10_-_Desktop_Liquid_Glass.html',
    'video': 'screens/desktop_1316e3c1e4bb47268887f9771fd569c3_Advanced_UIUX_Design_-_Video_Player_STU-11.html',
    'assign': 'screens/desktop_46916bc37cc94ecca15651e955f0f6b2_Assignments_Dashboard_STU-08_-_Desktop.html',
    'submit': 'screens/desktop_ff2d2f5f212d4adbab98aa0c9df4f666_Assignment_Submission_STU-09.html',
    'leaderboard': 'screens/desktop_ca103fa4b2604fdeb8e97c4995a719d2_Global_Academic_Leaderboard_STU-14.html',
    'showcase': 'screens/desktop_69f29a36c4fb462ba1f179d1b0a2ec84_Success_Showcase_-_JobFlow_Elite.html',
    'premium': 'screens/desktop_eb8812503d9949feba810aba199f434c_Premium_Membership_Hub_-_Gold_Elite.html',
    'talent': 'screens/desktop_ca20e9e2ae964a9cb4e2060d71f5cb93_Talent_Search_Candidate_Search.html',
    'kanban': 'screens/desktop_8d906434847840c49b180d4b31856442_Applicant_Tracking_Board_-_Recruitment_Command_Center.html',
    'job-create': 'screens/desktop_2b156034eeb94154ad5169f671aa646f_Job_Creator_Editor_Split_View.html',
    'ad-campaign': 'screens/desktop_38d13a4151134b38ad31e1c9decf2071_Ad_Campaign_Creator__Live_Preview.html',
    'ad-store': 'screens/desktop_4035ff96780a4a6b975d8b66f0ca68d5_Advertisement_System_Store_-_Desktop_Catalog.html',
    'scheduler': 'screens/desktop_babc13b0b1e24ab38783e4441563f725_Interview_Scheduler_-_Recruitment_Command_Center.html',
    'verify-queue': 'screens/desktop_02ef60e8cd50480eb342757ee5f80671_Company_Verification_Queue_-_Admin_Panel.html',
    'doc-verify': 'screens/desktop_1d699cebc531409eaa607ec8fbdba8a7_Document_Verification_Viewer_-_Admin_Console.html',
    'mentors': 'screens/desktop_6d147c4317bf4073a4d6793b4fe7b31f_Career_Mentorship_Scheduler_Sarah_Jenkins.html',
    'opportunities': 'screens/desktop_8a2486e4386645ccbff69a9772ae7c07_Job_Details_STU-03_-_Liquid_Glass_Desktop.html',
    'schedule': 'screens/desktop_4f82db1800a14f35a3093041be5bb007_Student_Schedule_-_My_Weekly_View.html',
    'profile': 'screens/desktop_f842057dc6d044239356d9a94091271e_Student_Profile_Viewer_Candidate_Detail.html',
    'courses-design': 'screens/desktop_courses_design.html',
    'courses-engineering': 'screens/desktop_courses_engineering.html',
    'courses-business': 'screens/desktop_courses_business.html',
    'courses-data': 'screens/desktop_courses_data.html',
    'analytics': 'screens/desktop_032787d84817489794f0a674bc12be9d_Performance_Analytics_-_Recruitment_Hub.html',
    'student-analytics': 'screens/desktop_032787d84817489794f0a674bc12be9d_Performance_Analytics_-_Recruitment_Hub.html',
    'recruiter-analytics': 'screens/desktop_032787d84817489794f0a674bc12be9d_Performance_Analytics_-_Recruitment_Hub.html',
    'jobboard': 'screens/desktop_6485d4e661e848eeaae1436befd6c86a_Recruiter_Job_Board.html',
    'postings': 'screens/desktop_ff00cb05253245a18dcdd5bd2b21d125_Active_Postings_Management.html',
    'library': 'screens/desktop_library.html',
    'messages': 'screens/desktop_messages.html',
    'checkout': 'screens/desktop_b0a6532acbe445ef858eb71de3e36e33_Checkout_Billing_JobPath_Elite.html',
    'saved-drafts': 'screens/desktop_c4f07f7ce2194bf1b0506b1b53e0ea80_Saved_Drafts_Dashboard.html',
    'payment': 'screens/desktop_356ca8320edd454d98ab206be61f431c_Payment_Billing_Dashboard.html',
    'amb-hub': 'screens/desktop_6704669374e74c96804a3d36647a6de0_Ambassador_Hub_Dashboard_STU-AMB-01.html',
    'amb-referral': 'screens/desktop_1fa04347337143e7b52c9c2c6c4c840c_Referral_Center_STU-AMB-02.html',
    'amb-missions': 'screens/desktop_84a6bbc9383f428c9ee2da23e47771f3_Missions_Tasks_STU-AMB-03.html',
    'amb-leaderboard': 'screens/desktop_d2443c9d054b408e8dbde783dfed7aae_Leaderboard_Rewards_STU-AMB-04.html'
  },

  // Clean slugs mapping matching the architecture specification
  slugs: {
    '#/splash': 'splash',
    '#/onboarding': 'onboarding',
    '#/gateway': 'gateway',
    '#/student/register': 'register',
    '#/student/login': 'login',
    '#/student/mfa': 'mfa',
    '#/student/dashboard': 'student-dash',
    '#/student/quiz': 'tests',
    '#/student/test/hub': 'tests',
    '#/student/mock-interviews': 'mock-interviews',
    '#/student/interviews': 'mock-interviews',
    '#/student/test/guidelines': 'guidelines',
    '#/student/test/player': 'player',
    '#/student/courses': 'courses',
    '#/student/courses/video': 'video',
    '#/student/assignments': 'assign',
    '#/student/assignments/submit': 'submit',
    '#/student/leaderboard': 'leaderboard',
    '#/student/showcase': 'showcase',
    '#/student/premium': 'premium',
    '#/student/mentors': 'mentors',
    '#/student/opportunities': 'opportunities',
    '#/student/schedule': 'schedule',
    '#/company/dashboard': 'recruiter-dash',
    '#/company/talent': 'talent',
    '#/company/kanban': 'kanban',
    '#/company/jobs/create': 'job-create',
    '#/company/ads/campaign': 'ad-campaign',
    '#/company/ads/store': 'ad-store',
    '#/company/scheduler': 'scheduler',
    '#/admin/verify-queue': 'verify-queue',
    '#/admin/doc-verify': 'doc-verify',
    '#/student/profile': 'profile',
    '#/student/courses/design': 'courses-design',
    '#/student/courses/engineering': 'courses-engineering',
    '#/student/courses/business': 'courses-business',
    '#/student/courses/data': 'courses-data',
    '#/student/analytics': 'student-analytics',
    '#/company/jobboard': 'jobboard',
    '#/company/postings': 'postings',
    '#/company/analytics': 'recruiter-analytics',
    '#/student/library': 'library',
    '#/student/messages': 'messages',
    '#/student/checkout': 'checkout',
    '#/company/saved-drafts': 'saved-drafts',
    '#/company/payment': 'payment',
    '#/student/ambassador': 'amb-hub',
    '#/student/ambassador/referral': 'amb-referral',
    '#/student/ambassador/missions': 'amb-missions',
    '#/student/ambassador/leaderboard': 'amb-leaderboard'
  },

  getSlug(view) {
    for (const key in this.slugs) {
      if (this.slugs[key] === view) return key;
    }
    return null;
  },

  handleQuickApply(type, link) {
    console.log(`Quick Apply triggered for ${type}: ${link}`);
    this.navigate('checkout');
  },

  setupRecruiterSearch(doc) {
    if (!doc) return;
    const searchInput = doc.getElementById('job-search') || doc.getElementById('topbar-search') || doc.querySelector('header input, #shared-topbar input');
    if (!searchInput) return;

    // Check if already hooked
    if (searchInput.dataset.searchHooked === 'true') return;
    searchInput.dataset.searchHooked = 'true';

    const placeholders = {
      'recruiter-dash': 'Search dashboard activity...',
      'jobboard': 'Search job listings...',
      'talent': 'Search candidates by name, university or skills...',
      'postings': 'Search active postings...',
      'kanban': 'Search applicants & roles...',
      'job-create': 'Search template requirements...',
      'ad-campaign': 'Search active campaigns...',
      'ad-store': 'Search ad templates & catalogs...',
      'scheduler': 'Search scheduled interviews...',
      'saved-drafts': 'Search saved drafts...',
      'payment': 'Search transactions & payments...',
      'analytics': 'Search analytics data...'
    };

    if (placeholders[this.activeView]) {
      searchInput.placeholder = placeholders[this.activeView];
    }

    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const query = e.target.value;
        const win = this.iframe.contentWindow;
        if (win) {
          if (typeof win.filterJobs === 'function') win.filterJobs(query);
          else if (typeof win.applyFilter === 'function') win.applyFilter();
          else if (typeof win.filterCandidates === 'function') win.filterCandidates(query);
          else if (typeof win.applyFilters === 'function') win.applyFilters();
          else if (typeof win.onUniSearch === 'function') win.onUniSearch(query);
        }
        this.executeSearch(query);
      }
    });

    searchInput.addEventListener('input', (e) => {
      this.executeSearch(e.target.value);
    });
  },

  init() {
    // Override default alert in parent window
    window.alert = (msg) => {
      this.showToast(msg, 'info');
    };

    if (document.fonts) {
      document.fonts.ready.then(() => {
        document.documentElement.classList.add('fonts-loaded');
      });
    } else {
      document.documentElement.classList.add('fonts-loaded');
    }

    const getActiveHash = () => {
      try {
        if (window.self !== window.top) {
          return window.top.location.hash;
        }
      } catch (e) { }
      return window.location.hash;
    };

    // Listen to hash changes in browser address bar
    const routingWindow = window.self !== window.top ? window.top : window;
    routingWindow.addEventListener('hashchange', () => {
      const hash = getActiveHash() || '#/splash';
      const cleanHash = hash.split('?')[0];
      const view = this.slugs[cleanHash];
      if (view && view !== this.activeView) {
        this.navigate(view, false);
      }
    });

    // Handle initial hash routing
    const initialHash = getActiveHash() || '#/splash';
    const cleanInitialHash = initialHash.split('?')[0];
    const initialView = this.slugs[cleanInitialHash] || 'splash';
    this.navigate(initialView, true);

    // Auto route splash to onboarding after 3 seconds
    setTimeout(() => {
      if (this.activeView === 'splash') {
        this.navigate('onboarding');
      }
    }, 3000);

    // Dynamic click hook injection
    this.iframe.addEventListener('load', () => {
      this.hideLoader();
      this.injectClickHandlers();
      this.injectFetchInterceptor();
      this.styleRecruiterSidebar();
      
      // Inject global background override
      try {
        const doc = this.iframe.contentDocument || this.iframe.contentWindow.document;
        if (doc) {
          this.setupRecruiterSearch(doc);
          
          const globalBgStyle = doc.createElement('style');
          globalBgStyle.id = 'global-iframe-bg-override';
          globalBgStyle.innerHTML = `
             html, body, .liquid-bg, body.liquid-bg, div.liquid-bg {
               background: #dae1f5 !important;
               background-color: #dae1f5 !important;
               background-image: none !important;
             }
             /* Remove blue focus outline/ring on all inputs */
             input:focus,
             input[type="text"]:focus,
             input[type="search"]:focus,
             textarea:focus,
             select:focus {
               outline: none !important;
               box-shadow: none !important;
               border-color: transparent !important;
               --tw-ring-color: transparent !important;
               --tw-ring-offset-width: 0px !important;
             }

             /* Recruiter Portal Button Style Overrides */
             button[style*="background:#471A70"],
             button[style*="background:#471a70"],
             button[style*="background: #471A70"],
             button[style*="background: #471a70"],
             button[style*="background-color:#471A70"],
             button[style*="background-color:#471a70"],
             button[style*="background-color: #471A70"],
             button[style*="background-color: #471a70"],
             button[style*="background:#3d1660"],
             button[style*="background-color:#3d1660"],
             a[style*="background:#471A70"],
             a[style*="background:#471a70"],
             a[style*="background: #471A70"],
             a[style*="background: #471a70"],
             a[style*="background:#3d1660"],
             a[style*="background-color:#3d1660"],
             div[style*="background:#471A70"],
             div[style*="background:#471a70"],
             div[style*="background: #471A70"],
             div[style*="background: #471a70"],
             .bg-deep-purple,
             .bg-\\[\\#471A70\\],
             .bg-\\[\\#471a70\\] {
               background: #8731a3 !important;
               background-color: #8731a3 !important;
               color: #ffffff !important;
               box-shadow: 0 4px 14px rgba(135, 49, 163, 0.25) !important;
             }

             button[style*="background:#471A70"]:hover,
             button[style*="background:#471a70"]:hover,
             button[style*="background: #471A70"]:hover,
             button[style*="background: #471a70"]:hover,
             button[style*="background-color:#471A70"]:hover,
             button[style*="background-color:#471a70"]:hover,
             button[style*="background-color: #471A70"]:hover,
             button[style*="background-color: #471a70"]:hover,
             button[style*="background:#3d1660"]:hover,
             button[style*="background-color:#3d1660"]:hover,
             a[style*="background:#471A70"]:hover,
             a[style*="background:#471a70"]:hover,
             a[style*="background: #471A70"]:hover,
             a[style*="background: #471a70"]:hover,
             a[style*="background:#3d1660"]:hover,
             a[style*="background-color:#3d1660"]:hover,
             div[style*="background:#471A70"]:hover,
             div[style*="background:#471a70"]:hover,
             div[style*="background: #471A70"]:hover,
             div[style*="background: #471a70"]:hover,
             .bg-\\[\\#471A70\\]:hover,
             .bg-\\[\\#471a70\\]:hover {
               background: #a34cbe !important;
               background-color: #a34cbe !important;
               color: #ffffff !important;
             }

             .orb, [class*="orb"] {
               display: none !important;
             }
             .material-symbols-outlined {
               visibility: hidden;
             }
             .fonts-loaded .material-symbols-outlined {
               visibility: visible !important;
             }
          `;
          doc.head.appendChild(globalBgStyle);

          if (doc.fonts) {
            doc.fonts.ready.then(() => {
              doc.documentElement.classList.add('fonts-loaded');
            });
          } else {
            doc.documentElement.classList.add('fonts-loaded');
          }
        }
      } catch (e) {
        console.warn("Global background override injection failed:", e);
      }

      // Override child iframe alert to display in parent window toast
      try {
        const win = this.iframe.contentWindow;
        if (win) {
          win.alert = (msg) => {
            this.showToast(msg, 'info');
          };
        }
      } catch (err) { }

      // Inject CSS rule to hide scrollbars globally inside the iframe
      try {
        const doc = this.iframe.contentDocument || this.iframe.contentWindow.document;
        if (doc) {
          const scrollStyle = doc.createElement('style');
          scrollStyle.innerHTML = `
            ::-webkit-scrollbar {
              display: none !important;
              width: 0 !important;
              height: 0 !important;
            }
            html, body {
              -ms-overflow-style: none !important;
              scrollbar-width: none !important;
            }
          `;
          doc.head.appendChild(scrollStyle);
        }
      } catch (err) {
        console.warn("Iframe scrollbar hiding failed:", err);
      }

      // Inject CSS rule inside iframe to hide its local nav/header elements and eliminate extra left space (only for student portal screens)
      const studentViews = ['student-dash', 'opportunities', 'schedule', 'tests', 'mock-interviews', 'guidelines', 'player', 'courses', 'video', 'assign', 'submit', 'leaderboard', 'showcase', 'premium', 'mentors', 'profile', 'courses-design', 'courses-engineering', 'courses-business', 'courses-data', 'student-analytics', 'analytics', 'library', 'messages', 'checkout', 'amb-hub', 'amb-referral', 'amb-missions', 'amb-leaderboard'];
      if (studentViews.includes(this.activeView)) {
        try {
          const doc = this.iframe.contentDocument || this.iframe.contentWindow.document;
          if (doc) {
            const hideStyle = doc.createElement('style');
            hideStyle.id = 'student-portal-layout-reset';
            const bgVal = '#dae1f5';
            hideStyle.innerHTML = `
              html, body {
                background: ${bgVal} !important;
                background-color: ${bgVal} !important;
                background-image: none !important;
                margin: 0 !important;
                padding: 0 !important;
                overflow-x: hidden !important;
              }
              header, nav, aside, footer,
              .SideNavBar, .TopNavBar, 
              #SideNavBar, #TopNavBar,
              #shared-topbar, #shared-sidebar,
              header[id*="shared"], aside[id*="shared"] {
                display: none !important;
              }
              main, .main-content, #drafts-main {
                margin-left: 0 !important;
                margin-right: 0 !important;
                padding-left: 1.25rem !important;
                padding-right: 1.25rem !important;
                padding-top: 1rem !important;
                max-width: 100% !important;
                width: 100% !important;
                box-sizing: border-box !important;
              }
              /* Hide catalog navbar wrapper specifically */
              nav.fixed.top-0 {
                display: none !important;
              }
              aside.fixed {
                display: none !important;
              }
              main.ml-64, main.lg\\:ml-64, main.pl-64, main.lg\\:pl-64, main.xl\\:pl-64,
              main.ml-\\[220px\\], main[class*="ml-"], main[style*="margin-left"],
              div[class*="ml-\\[220px\\]"] {
                margin-left: 0 !important;
                padding-left: 1.25rem !important;
                padding-right: 1.25rem !important;
                padding-top: 1rem !important;
                max-width: 100% !important;
                width: 100% !important;
              }
              .max-w-max-width, [class*="max-w-max-width"], .max-w-container-max, [class*="max-w-container-max"],
              .max-w-\\[1400px\\], .max-w-\\[1280px\\], .max-w-7xl, .max-w-6xl {
                max-width: 100% !important;
                width: 100% !important;
                margin-left: 0 !important;
                margin-right: 0 !important;
              }
              main > div, main > div.mx-auto, div.mx-auto {
                margin-left: 0 !important;
                margin-right: 0 !important;
                max-width: 100% !important;
              }
            `;
            doc.head.appendChild(hideStyle);

            // Direct inline style overrides to ensure no script overrides it
            const mainEls = doc.querySelectorAll('main, .main-content, #drafts-main, [class*="ml-"]');
            mainEls.forEach(el => {
              el.style.setProperty('margin-left', '0px', 'important');
              el.style.setProperty('padding-left', '1.25rem', 'important');
              el.style.setProperty('padding-right', '1.25rem', 'important');
              el.style.setProperty('padding-top', '1rem', 'important');
              el.style.setProperty('max-width', '100%', 'important');
              el.style.setProperty('width', '100%', 'important');
            });
            const autoWrappers = doc.querySelectorAll('main > div, .mx-auto, [class*="max-w-"]');
            autoWrappers.forEach(el => {
              if (!el.closest('header') && !el.closest('nav') && !el.closest('aside')) {
                el.style.setProperty('margin-left', '0px', 'important');
                el.style.setProperty('margin-right', '0px', 'important');
                el.style.setProperty('max-width', '100%', 'important');
                el.style.setProperty('width', '100%', 'important');
              }
            });
          }
        } catch (err) {
          console.warn("Iframe local navbar hiding failed:", err);
        }
      }

      // Trigger direction-based slide-in animation
      const direction = this.iframe.dataset.direction || 'right';
      this.iframe.className = 'w-full h-full border-none block';
      void this.iframe.offsetWidth; // trigger reflow
      this.iframe.classList.add(`slide-in-${direction}`);
    });

    // Set up click handlers for parent sidebar links
    document.querySelectorAll('#sharedSidebar a').forEach(a => {
      a.addEventListener('click', (e) => {
        const view = a.dataset.view;
        if (view) {
          this.navigate(view);
        }
      });
    });

    // Set up top bar search handler
    const sharedSearchInput = document.getElementById('sharedSearchInput');
    if (sharedSearchInput) {
      sharedSearchInput.addEventListener('input', (e) => {
        this.executeSearch(e.target.value);
      });
      sharedSearchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          this.executeSearch(e.target.value);
        }
      });
    }

    // Set up profile button click
    const sharedProfileBtn = document.getElementById('sharedProfileBtn');
    if (sharedProfileBtn) {
      sharedProfileBtn.addEventListener('click', () => {
        this.navigate('profile');
      });
    }

    // Set up notifications toggling in parent window
    const sharedNotificationBtn = document.getElementById('sharedNotificationBtn');
    const sharedNotificationDropdown = document.getElementById('sharedNotificationDropdown');
    const sharedNotificationBadge = document.getElementById('sharedNotificationBadge');
    const sharedClearNotificationsBtn = document.getElementById('sharedClearNotificationsBtn');

    if (sharedNotificationBtn && sharedNotificationDropdown) {
      sharedNotificationBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        sharedNotificationDropdown.classList.toggle('hidden');
      });

      document.addEventListener('click', (e) => {
        if (!sharedNotificationDropdown.classList.contains('hidden') && !sharedNotificationDropdown.contains(e.target) && e.target !== sharedNotificationBtn) {
          sharedNotificationDropdown.classList.add('hidden');
        }
      });
    }

    if (sharedClearNotificationsBtn && sharedNotificationBadge) {
      sharedClearNotificationsBtn.addEventListener('click', () => {
        sharedNotificationBadge.classList.add('hidden');
        const listItems = sharedNotificationDropdown.querySelector('.space-y-3');
        if (listItems) {
          listItems.innerHTML = `
            <p class="text-xs text-purple-950/50 italic py-4 text-center">No new notifications.</p>
          `;
        }
      });
    }
    this.initAIChat();
  },

  navigate(view, updateHash = true, direction = 'right') {
    if (view === 'guidelines') {
      view = 'player';
    }
    if (this.screens[view]) {
      this.activeView = view;
      this.showLoader();
      this.iframe.dataset.direction = 'right';
      this.iframe.src = this.screens[view] + '?t=' + Date.now();

      // Clear shared search input and adjust placeholder dynamically on view navigation
      const sharedSearchInput = document.getElementById('sharedSearchInput');
      const sharedSearchContainer = document.getElementById('sharedSearchContainer');
      if (sharedSearchInput) {
        sharedSearchInput.value = '';

        const placeholders = {
          'student-dash': 'Search dashboard...',
          'courses': 'Search courses...',
          'assign': 'Search assignments...',
          'tests': 'Search quizzes...',
          'mock-interviews': 'Search mock tracks, questions, mentors...',
          'opportunities': 'Search opportunities...',
          'library': 'Search library...',
          'messages': 'Search messages...',
          'mentors': 'Search mentors...',
          'student-analytics': 'Search analytics...',
          'leaderboard': 'Search grades...',
          'schedule': 'Search schedule...',
          'amb-hub': 'Search ambassador hub...',
          'amb-referral': 'Search referral center...',
          'amb-missions': 'Search missions & tasks...',
          'amb-leaderboard': 'Search leaderboard & rewards...'
        };

        const isSearchEnabled = placeholders.hasOwnProperty(view);
        if (sharedSearchContainer) {
          if (isSearchEnabled) {
            sharedSearchContainer.classList.remove('opacity-0', 'pointer-events-none', 'invisible');
            sharedSearchInput.removeAttribute('disabled');
            sharedSearchInput.placeholder = placeholders[view];
          } else {
            sharedSearchContainer.classList.add('opacity-0', 'pointer-events-none', 'invisible');
            sharedSearchInput.setAttribute('disabled', 'true');
            sharedSearchInput.placeholder = 'Search...';
          }
        }
      }

      // If logging out or returning to guest screens, clear student streak history to restart on next login
      if (view === 'gateway' || view === 'login' || view === 'register') {
        localStorage.removeItem('userStreak');
        localStorage.removeItem('lastVisitDate');
        localStorage.removeItem('streakHistory');
      }

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

      // AI Agent floating button visibility control (visible on all screens except splash)
      const aiBtn = document.getElementById('floatingAIAgentBtn');
      const aiChat = document.getElementById('floatingAIChatWindow');
      if (aiBtn) {
        if (view === 'splash') {
          aiBtn.classList.add('hidden');
          if (aiChat) aiChat.classList.add('hidden');
        } else {
          aiBtn.classList.remove('hidden');
        }
      }

      // Notify AI chat window of screen change if open
      const messagesContainer = document.getElementById('aiChatMessages');
      if (messagesContainer && view !== 'splash') {
        const screenNames = {
          'onboarding': 'Onboarding & Skills Setup',
          'gateway': 'Gateway Role Selection',
          'register': 'Student Registration Wizard',
          'login': 'Login Screen',
          'mfa': 'Multi-Factor Authentication (MFA)',
          'student-dash': 'Student Dashboard',
          'recruiter-dash': 'Recruiter Command Center',
          'tests': 'Weekly Tests Hub / Schedule',
          'mock-interviews': 'AI & Peer Mock Interviews Hub',
          'guidelines': 'Test Integrity & Guidelines',
          'player': 'Anti-Cheat Test Player',
          'courses': 'Courses Catalog',
          'video': 'Video Player Classroom',
          'assign': 'Assignments Dashboard',
          'submit': 'Assignment Submission Portal',
          'leaderboard': 'Grades & Leaderboard',
          'showcase': 'Success Showcase',
          'premium': 'Premium Membership Hub',
          'talent': 'Talent Candidate Search',
          'kanban': 'Applicant Tracking Board (Kanban)',
          'job-create': 'Job Creator & Editor',
          'ad-campaign': 'Ad Campaign Creator',
          'ad-store': 'Ad System Store',
          'scheduler': 'Interview Scheduler',
          'verify-queue': 'Company Verification Queue',
          'doc-verify': 'Document Verification Viewer',
          'mentors': 'Mentors Booking',
          'opportunities': 'Job Opportunities Board',
          'profile': 'Student Profile Viewer',
          'courses-design': 'Design Course Catalog',
          'courses-engineering': 'Engineering Course Catalog',
          'courses-business': 'Business Course Catalog',
          'courses-data': 'Data Science Course Catalog',
          'analytics': 'Performance Analytics',
          'library': 'Resource Library',
          'messages': 'Inbox Messages',
          'checkout': 'Checkout & Billing',
          'amb-hub': 'Ambassador Hub',
          'amb-referral': 'Referral Center',
          'amb-missions': 'Missions & Tasks',
          'amb-leaderboard': 'Leaderboard & Rewards'
        };
        // System notification bubble removed at user request
      }

      // Dynamic Sidebar / Header display toggling for Student portal
      const studentViews = ['student-dash', 'opportunities', 'schedule', 'tests', 'mock-interviews', 'guidelines', 'player', 'courses', 'video', 'assign', 'submit', 'leaderboard', 'showcase', 'premium', 'mentors', 'profile', 'courses-design', 'courses-engineering', 'courses-business', 'courses-data', 'student-analytics', 'library', 'messages', 'checkout', 'amb-hub', 'amb-referral', 'amb-missions', 'amb-leaderboard'];
      const sharedHeader = document.getElementById('sharedHeader');
      const sharedSidebar = document.getElementById('sharedSidebar');
      const frameContainer = document.getElementById('frameContainer');

      if (studentViews.includes(view)) {
        if (sharedHeader) sharedHeader.classList.remove('hidden');
        if (sharedSidebar) sharedSidebar.classList.remove('hidden');
        if (frameContainer) {
          frameContainer.className = "fixed top-14 left-0 lg:left-64 right-0 bottom-0 overflow-hidden";
        }

        // Highlight active sidebar navigation item in parent window
        document.querySelectorAll('#sharedSidebar a').forEach(a => {
          if (a.dataset.view === view) {
            a.className = "flex items-center gap-3 text-purple-950 px-4 py-3 active-nav transition-all rounded-xl cursor-pointer";
          } else {
            a.className = "flex items-center gap-3 text-purple-950/70 px-4 py-3 hover:bg-[#a34cbe]/10 hover:text-primary transition-all rounded-xl cursor-pointer";
          }
        });
      } else {
        if (sharedHeader) sharedHeader.classList.add('hidden');
        if (sharedSidebar) sharedSidebar.classList.add('hidden');
        if (frameContainer) {
          frameContainer.className = "fixed top-0 left-0 right-0 bottom-0 overflow-hidden";
        }
      }
    }
  },

  executeSearch(query) {
    try {
      const iframeWin = this.iframe.contentWindow;
      if (iframeWin) {
        console.log(`[Parent Search] Executing search: "${query}" on activeView: "${this.activeView}"`);
        const cleanQuery = query.toLowerCase().trim();

        // 1. Trigger child-specific filtering functions
        if (typeof iframeWin.filterJobs === 'function') {
          iframeWin.filterJobs(query);
        } else if (typeof iframeWin.renderJobs === 'function') {
          if (typeof iframeWin.applyFilter === 'function') {
            const searchInput = iframeWin.document.getElementById('job-search') || iframeWin.document.getElementById('topbar-search');
            if (searchInput) searchInput.value = query;
            iframeWin.applyFilter();
          }
        }

        if (typeof iframeWin.renderCourses === 'function') {
          iframeWin.renderCourses(query);
        }
        if (typeof iframeWin.renderAssignments === 'function') {
          iframeWin.renderAssignments(query);
        }
        if (typeof iframeWin.renderQuizzes === 'function') {
          iframeWin.renderQuizzes(query);
        }
        if (typeof iframeWin.filterMockInterviews === 'function') {
          iframeWin.filterMockInterviews(query);
        }
        if (typeof iframeWin.renderLeaderboard === 'function') {
          iframeWin.renderLeaderboard(query);
        }
        if (typeof iframeWin.renderSchedule === 'function') {
          iframeWin.renderSchedule(query);
        }
        if (typeof iframeWin.filterResources === 'function') {
          iframeWin.filterResources(query);
        }
        if (typeof iframeWin.filterChats === 'function') {
          iframeWin.filterChats(query);
        }
        if (typeof iframeWin.filterCandidates === 'function') {
          iframeWin.filterCandidates(query);
        }
        if (typeof iframeWin.onUniSearch === 'function') {
          iframeWin.onUniSearch(query);
        }

        // 2. Apply robust, generic DOM fallback filtering to ensure visual matching
        const doc = iframeWin.document;
        if (doc) {
          let items = Array.from(doc.querySelectorAll('.glass-card, .card, .course-card, .assign-card, .job-card, .test-card, .kanban-item, tbody tr, .grid > div, .flex > div, [class*="card" i]'));

          // Exclude structural containers, body, header, nav
          items = items.filter(item => {
            if (
              item.closest('nav') || 
              item.closest('header') || 
              item.closest('aside') || 
              item.tagName === 'NAV' || 
              item.tagName === 'HEADER' || 
              item.tagName === 'ASIDE' ||
              item.tagName === 'BODY' ||
              item.tagName === 'HTML' ||
              item.id === 'shared-sidebar' ||
              item.id === 'shared-topbar'
            ) {
              return false;
            }
            // Keep only leaf items of the matched selectors
            return !item.querySelector('.glass-card, .card, .course-card, .assign-card, .job-card, .test-card, .kanban-item, tbody tr');
          });

          items.forEach(item => {
            const text = item.textContent.toLowerCase();
            if (!cleanQuery || text.includes(cleanQuery)) {
              item.style.setProperty('display', '', 'important');
            } else {
              item.style.setProperty('display', 'none', 'important');
            }
          });
        }
      }
    } catch (err) {
      console.warn("Search execution error:", err);
    }
  },

  handleQuickApply(type, link) {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (isLoggedIn) {
      if (type === 'job') {
        this.showToast("Application submitted successfully!", "success");
        if (link) {
          window.open(link, '_blank');
        }
      } else if (link) {
        window.open(link, '_blank');
      }
    } else {
      localStorage.setItem('pendingQuickApply', JSON.stringify({ type, link, view: this.activeView }));
      this.navigate('login');
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

  showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    // Create toast element
    const toast = document.createElement('div');
    toast.className = `flex items-center gap-3 px-4 py-3 rounded-2xl border pointer-events-auto shadow-lg transition-all duration-300 transform translate-x-full opacity-0 max-w-sm glass-card`;

    // Icon and styles based on type
    let icon = 'info';
    let iconColor = 'text-primary';

    if (type === 'success') {
      icon = 'check_circle';
      iconColor = 'text-green-600';
    } else if (type === 'warning') {
      icon = 'warning';
      iconColor = 'text-amber-500';
    } else if (type === 'error') {
      icon = 'error';
      iconColor = 'text-red-500';
    }

    toast.innerHTML = `
      <span class="material-symbols-outlined ${iconColor} text-xl flex-shrink-0" style="font-variation-settings: 'FILL' 1;">${icon}</span>
      <p class="text-xs font-semibold text-purple-950 flex-grow pr-4 leading-normal">${message}</p>
      <button class="text-purple-950/40 hover:text-purple-950 transition-colors flex items-center justify-center flex-shrink-0">
        <span class="material-symbols-outlined text-sm">close</span>
      </button>
    `;

    container.appendChild(toast);

    // Close button event listener
    const closeBtn = toast.querySelector('button');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        toast.classList.add('translate-x-full', 'opacity-0');
        setTimeout(() => toast.remove(), 300);
      });
    }

    // Trigger slide-in transition
    setTimeout(() => {
      toast.classList.remove('translate-x-full', 'opacity-0');
    }, 10);

    // Auto-remove after 4 seconds
    setTimeout(() => {
      if (toast.parentNode) {
        toast.classList.add('translate-x-full', 'opacity-0');
        setTimeout(() => {
          if (toast.parentNode) toast.remove();
        }, 300);
      }
    }, 4000);
  },

  styleRecruiterSidebar() {
    try {
      const doc = this.iframe.contentDocument || this.iframe.contentWindow.document;
      if (!doc) return;

      const sidebar = doc.getElementById('shared-sidebar');
      if (!sidebar) return;

      // Find the active nav item by looking for the background style #471A70 or rgb(71, 26, 112)
      const navLinks = sidebar.querySelectorAll('a');
      navLinks.forEach(a => {
        const bg = (a.style.backgroundColor || a.style.background || '').toLowerCase();
        const styleAttr = (a.getAttribute('style') || '').toLowerCase();
        if (
          bg.includes('471a70') || bg.includes('71, 26, 112') || bg.includes('71,26,112') ||
          styleAttr.includes('#471a70') || styleAttr.includes('71, 26, 112') || styleAttr.includes('71,26,112')
        ) {
          a.classList.add('active-nav');
          // Clear hardcoded inline styles so they don't interfere
          a.style.background = '';
          a.style.backgroundColor = '';
          a.style.color = '';
          const span = a.querySelector('span');
          if (span) span.style.color = '';
        }
      });

      // Inject style overrides
      const overrideStyle = doc.createElement('style');
      overrideStyle.innerHTML = `
        #shared-sidebar {
          background: rgba(255, 255, 255, 0.35) !important;
          backdrop-filter: blur(28px) !important;
          -webkit-backdrop-filter: blur(28px) !important;
          border-right: 1px solid rgba(255, 255, 255, 0.6) !important;
          box-shadow: 0 12px 40px 0 rgba(71, 26, 112, 0.15) !important;
          font-family: 'Inter', sans-serif !important;
          padding-top: 2rem !important;
          padding-bottom: 2.5rem !important;
          width: 260px !important;
        }

        #shared-sidebar div[style*="font-size:18px"],
        #shared-sidebar div {
          font-family: 'Inter', sans-serif !important;
        }

        #shared-sidebar div[style*="font-size:18px"] {
          color: #1a0533 !important;
          font-size: 20px !important;
          font-weight: 800 !important;
        }

        #shared-sidebar div[style*="font-size:11px"] {
          color: rgba(45, 17, 82, 0.7) !important;
          font-weight: 600 !important;
        }

        #shared-sidebar a.snav-btn,
        #shared-sidebar a[id^="snav-"] {
          font-family: 'Inter', sans-serif !important;
          font-size: 12px !important;
          font-weight: 600 !important;
          border-radius: 12px !important;
          padding: 12px 16px !important;
          transition: all 0.2s ease !important;
          text-transform: none !important;
          letter-spacing: normal !important;
          width: calc(100% - 20px) !important;
          margin-left: 10px !important;
        }

        #shared-sidebar a:not(.active-nav) {
          background: transparent !important;
          color: rgba(45, 17, 82, 0.7) !important;
        }
        #shared-sidebar a:not(.active-nav) span {
          color: rgba(45, 17, 82, 0.7) !important;
        }

        #shared-sidebar a:not(.active-nav):hover {
          background: rgba(163, 76, 190, 0.1) !important;
          color: #8731a3 !important;
        }
        #shared-sidebar a:not(.active-nav):hover span {
          color: #8731a3 !important;
        }

        #shared-sidebar a.snav-btn.active-nav,
        #shared-sidebar a.active-nav,
        #shared-sidebar a[style*="background:#471A70"],
        #shared-sidebar a[style*="background:#471a70"],
        #shared-sidebar a[style*="background: #471A70"],
        #shared-sidebar a[style*="background: #471a70"] {
          background: rgba(163, 76, 190, 0.2) !important;
          box-shadow: inset 0 0 0 1px rgba(163, 76, 190, 0.3) !important;
          color: #8731a3 !important;
          font-weight: bold !important;
        }
        #shared-sidebar a.snav-btn.active-nav span,
        #shared-sidebar a.active-nav span,
        #shared-sidebar a[style*="background:#471A70"] span,
        #shared-sidebar a[style*="background:#471a70"] span,
        #shared-sidebar a[style*="background: #471A70"] span,
        #shared-sidebar a[style*="background: #471a70"] span {
          color: #8731a3 !important;
        }

        #snav-logout {
          color: #c0295a !important;
          font-family: 'Inter', sans-serif !important;
          font-size: 12px !important;
          font-weight: 600 !important;
          text-transform: none !important;
          letter-spacing: normal !important;
        }
        #snav-logout span {
          color: #c0295a !important;
        }

        #snav-help {
          color: rgba(45, 17, 82, 0.7) !important;
          font-family: 'Inter', sans-serif !important;
          font-size: 12px !important;
          font-weight: 600 !important;
          text-transform: none !important;
          letter-spacing: normal !important;
        }
        #snav-help span {
          color: rgba(45, 17, 82, 0.7) !important;
        }

        #snav-new-posting {
          background: #8731a3 !important;
          box-shadow: 0 4px 16px rgba(135, 49, 163, 0.25) !important;
          font-family: 'Inter', sans-serif !important;
          border-radius: 999px !important;
          width: calc(100% - 24px) !important;
          margin-left: 12px !important;
        }

        /* Adjust main layout and topbar left margin to align with wider sidebar */
        html body > main, html body main, html body .ml-\\[220px\\], html body .ml-64, html body .lg\\:ml-64 {
          margin-left: 260px !important;
        }
        #shared-topbar {
          left: 260px !important;
          width: calc(100vw - 260px) !important;
        }
        
        #shared-sidebar, #shared-sidebar *, aside, aside * {
          user-select: none !important;
          -webkit-user-select: none !important;
          -moz-user-select: none !important;
          -ms-user-select: none !important;
        }
        
        .material-symbols-outlined {
          visibility: hidden;
        }
        
        .fonts-loaded .material-symbols-outlined {
          visibility: visible !important;
        }
      `;
      doc.head.appendChild(overrideStyle);

      if (doc.fonts) {
        doc.fonts.ready.then(() => {
          doc.documentElement.classList.add('fonts-loaded');
        });
      } else {
        doc.documentElement.classList.add('fonts-loaded');
      }
    } catch (err) {
      console.warn("Failed to inject recruiter sidebar styles:", err);
    }
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
        } catch (err) { }

        if (!token) {
          try {
            const storedUser = win.localStorage.getItem('currentUser');
            if (storedUser) {
              const userObj = JSON.parse(storedUser);
              token = userObj.token || 'mock_token';
            }
          } catch (err) { }
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
            if (win.parent && win.parent.App && typeof win.parent.App.showToast === 'function') {
              win.parent.App.showToast("Network connection error. Please verify the backend API server is running on http://localhost:8080", "error");
            } else {
              alert("Network connection error. Please verify the backend API server is running on http://localhost:8080");
            }
            throw err;
          });
      };
    } catch (err) {
      console.warn("Fetch intercept injection failed:", err);
    }
  },

  // Intercept element clicks inside the loaded iframe document
  injectClickHandlers() {
    try {
      const doc = this.iframe.contentDocument || this.iframe.contentWindow.document;
      doc.addEventListener('click', (e) => {
        const target = e.target.closest('button, a, [role="button"], .cursor-pointer, .kanban-item, .course-card, .assign-card, .job-card, #userprofilebtn, .userprofilebtn');
        if (!target) return;

        if (target.id === 'userprofilebtn' || target.closest('#userprofilebtn')) {
          this.navigate('profile');
          return;
        }

        const text = (target.textContent || '').trim().toLowerCase();
        const id = (target.id || '').toLowerCase();
        const className = (target.className || '').toLowerCase();

        console.log(`Click intercepted: Text="${text}", ID="${id}", Class="${className}"`);

        // Global Navigation captures (if target is a sidebar/header link)
        const studentViews = ['student-dash', 'opportunities', 'tests', 'guidelines', 'player', 'courses', 'video', 'assign', 'submit', 'leaderboard', 'showcase', 'premium', 'mentors', 'profile', 'courses-design', 'courses-engineering', 'courses-business', 'courses-data', 'student-analytics', 'library', 'messages', 'checkout'];
        if (studentViews.includes(this.activeView)) {
          if (text.includes('dashboard') || text.includes('home')) {
            this.navigate('student-dash');
            return;
          } else if (text.includes('courses') || text.includes('catalog')) {
            this.navigate('courses');
            return;
          } else if (text.includes('assignments')) {
            this.navigate('assign');
            return;
          } else if (text.includes('grades') || text.includes('results') || text.includes('leaderboard') || text.includes('ranking')) {
            this.navigate('leaderboard');
            return;
          } else if (text.includes('quiz') || text.includes('weekly tests')) {
            this.navigate('tests');
            return;
          } else if (text.includes('schedule')) {
            this.showToast('Schedule module coming soon!', 'info');
            return;
          } else if (text.includes('opportunities')) {
            this.navigate('opportunities');
            return;
          } else if (text.includes('analytics')) {
            this.navigate('student-analytics');
            return;
          } else if (text.includes('library')) {
            this.navigate('library');
            return;
          } else if (text.includes('messages')) {
            this.navigate('messages');
            return;
          } else if (text.includes('mentors')) {
            this.navigate('mentors');
            return;
          } else if (text.includes('help center') || text.includes('help')) {
            this.showToast('Opening Help Center resources...', 'info');
            return;
          } else if (text.includes('logout') || text.includes('exit')) {
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('currentUser');
            this.navigate('gateway');
            return;
          } else if (text.includes('premium') || text.includes('gold') || text.includes('membership') || text.includes('upgrade')) {
            this.navigate('premium');
            return;
          }
        }

        const recruiterViews = ['recruiter-dash', 'talent', 'kanban', 'job-create', 'ad-campaign', 'scheduler', 'verify-queue', 'doc-verify', 'jobboard', 'postings', 'recruiter-analytics', 'saved-drafts', 'payment'];
        if (recruiterViews.includes(this.activeView)) {
          if (text.includes('dashboard') || text.includes('command center')) {
            this.navigate('recruiter-dash');
            return;
          } else if (text.includes('job board')) {
            this.navigate('jobboard');
            return;
          } else if (text.includes('talent') || text.includes('candidate') || text.includes('database')) {
            this.navigate('talent');
            return;
          } else if (text.includes('postings')) {
            this.navigate('postings');
            return;
          } else if (text.includes('kanban') || text.includes('applicant')) {
            this.navigate('kanban');
            return;
          } else if (text.includes('creator') || text.includes('job editor') || text.includes('job creator') || text.includes('new job posting') || text.includes('post new job')) {
            this.navigate('job-create');
            return;
          } else if (text.includes('ad campaign') || text.includes('advertisement') || text.includes('campaigns')) {
            this.navigate('ad-campaign');
            return;
          } else if (text.includes('scheduler') || text.includes('interview')) {
            this.navigate('scheduler');
            return;
          } else if (text.includes('analytics')) {
            this.navigate('recruiter-analytics');
            return;
          } else if (text.includes('verification') || text.includes('queue')) {
            this.navigate('verify-queue');
            return;
          } else if (text.includes('save draft') || text.includes('saved drafts') || text.includes('drafts')) {
            this.navigate('saved-drafts');
            return;
          } else if (text.includes('payment') || text.includes('billing')) {
            this.navigate('payment');
            return;
          } else if (text.includes('logout') || text.includes('exit')) {
            this.navigate('gateway');
            return;
          }
        }

        // Routing Rules matching flowchart transitions
        if (this.activeView === 'splash') {
          this.navigate('onboarding');
        }

        else if (this.activeView === 'onboarding') {
          this.navigate('gateway');
        }

        else if (this.activeView === 'gateway') {
          if (text.includes('student') || id.includes('student') || text.includes('candidate') || text.includes('get started')) {
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('currentUser', JSON.stringify({
              email: "student@example.com",
              username: "student",
              role: "student",
              skills: ["React", "JavaScript", "UI Design", "Figma", "Python", "SQL", "Software Engineering"]
            }));
            this.navigate('student-dash', true, 'left');
          } else if (text.includes('recruiter') || text.includes('company') || id.includes('recruiter') || text.includes('enter console')) {
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('currentUser', JSON.stringify({
              email: "recruiter@example.com",
              username: "recruiter",
              role: "recruiter"
            }));
            this.navigate('recruiter-dash', true, 'right');
          }
        }

        else if (this.activeView === 'register') {
          // Add transition handling from registration
          if (text.includes('back') || id.includes('back')) {
            this.navigate('gateway', true, 'right');
          } else if (text.includes('sign in') || text.includes('login') || id === 'signinlink') {
            this.navigate('login', true, 'left');
          }
        }

        else if (this.activeView === 'login') {
          if (text.includes('sign up')) {
            this.navigate('register', true, 'right');
          } else {
            // Get inputs from login iframe
            try {
              const doc = this.iframe.contentDocument || this.iframe.contentWindow.document;
              const emailInput = doc.getElementById('email');
              const passwordInput = doc.getElementById('password');
              if (emailInput && passwordInput) {
                const email = emailInput.value.trim();
                const password = passwordInput.value.trim();
                if (email && password) {
                  this.showLoader();
                  fetch('http://localhost:8080/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                  })
                    .then(res => res.json())
                    .then(data => {
                      this.hideLoader();
                      if (data.success && data.user) {
                        localStorage.setItem('isLoggedIn', 'true');
                        localStorage.setItem('hasAccount', 'true');
                        localStorage.setItem('currentUser', JSON.stringify({
                          email: data.user.email,
                          token: 'mock_token',
                          role: data.user.role || 'student',
                          username: data.user.username,
                          companyName: data.user.companyName || ''
                        }));
                        this.showToast(`Logged in successfully. Welcome back, ${data.user.username}!`, 'success');

                        // Route based on role
                        if (data.user.role === 'recruiter' || data.user.role === 'company') {
                          this.navigate('recruiter-dash');
                        } else if (data.user.role === 'admin') {
                          window.location.href = '/admin/index.html';
                        } else {
                          // Check for pending quick apply action (only for students)
                          const pending = localStorage.getItem('pendingQuickApply');
                          if (pending) {
                            localStorage.removeItem('pendingQuickApply');
                            try {
                              const pData = JSON.parse(pending);
                              if (pData.type === 'job') {
                                this.navigate('opportunities');
                                this.showToast("Application submitted successfully!", "success");
                                if (pData.link && pData.link !== '#' && (pData.link.startsWith('http://') || pData.link.startsWith('https://'))) {
                                  window.open(pData.link, '_blank');
                                }
                              } else if (pData.link) {
                                window.open(pData.link, '_blank');
                                this.navigate('student-dash');
                                this.showToast("Course opened in a new tab.", "success");
                              } else {
                                this.navigate('student-dash');
                              }
                            } catch (e) {
                              this.navigate('student-dash');
                            }
                          } else {
                            this.navigate('student-dash');
                          }
                        }
                      } else {
                        this.showToast(data.error || "Invalid credentials", "error");
                      }
                    })
                    .catch(err => {
                      this.hideLoader();
                      console.error("Login API call failed, falling back to mock student:", err);
                      localStorage.setItem('isLoggedIn', 'true');
                      localStorage.setItem('hasAccount', 'true');
                      localStorage.setItem('currentUser', JSON.stringify({
                        email: email,
                        token: 'mock_token',
                        role: 'student',
                        username: email.split('@')[0]
                      }));
                      this.navigate('student-dash');
                    });
                }
              }
            } catch (err) {
              console.warn("Could not read login inputs:", err);
            }
          }
        }

        else if (this.activeView === 'mfa') {
          this.navigate('student-dash');
        }

        else if (this.activeView === 'student-dash') {
          if (text.includes('test') || text.includes('exam') || text.includes('quiz') || id.includes('test')) {
            this.navigate('tests');
          } else if (text.includes('catalog') || text.includes('course') || text.includes('learning')) {
            this.navigate('courses');
          } else if (text.includes('assignment')) {
            this.navigate('assign');
          } else if (text.includes('leaderboard') || text.includes('ranking')) {
            this.navigate('leaderboard');
          } else if (text.includes('showcase') || text.includes('success')) {
            this.navigate('showcase');
          } else if (text.includes('premium') || text.includes('gold') || text.includes('membership') || text.includes('upgrade')) {
            this.navigate('premium');
          } else if (text.includes('logout') || text.includes('exit')) {
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('currentUser');
            this.navigate('gateway');
          }
        }

        else if (this.activeView === 'tests') {
          if (text.includes('guidelines') || text.includes('start') || text.includes('rules') || text.includes('view questions')) {
            this.navigate('player');
          } else if (text.includes('back') || id.includes('back')) {
            this.navigate('student-dash');
          }
        }

        else if (this.activeView === 'guidelines') {
          if (text.includes('launch') || text.includes('start') || text.includes('player')) {
            this.navigate('player');
          } else if (text.includes('back') || id.includes('back')) {
            this.navigate('tests');
          }
        }

        else if (this.activeView === 'player') {
          if (text.includes('submit') || text.includes('finish') || id.includes('submit')) {
            this.showToast("Assessment proctor scorecard updated. Trust score verified.", "success");
            // Do not redirect to dashboard, stay on player results review scorecard
          }
        }

        else if (this.activeView === 'courses') {
          if (text.includes('browse design')) {
            this.navigate('courses-design');
          } else if (text.includes('browse eng')) {
            this.navigate('courses-engineering');
          } else if (text.includes('browse business')) {
            this.navigate('courses-business');
          } else if (text.includes('browse data')) {
            this.navigate('courses-data');
          } else if (text.includes('advanced') || className.includes('course-card')) {
            this.navigate('video');
          } else if (text.includes('back') || id.includes('back')) {
            this.navigate('student-dash');
          }
        }

        else if (this.activeView === 'video') {
          if (text.includes('back') || id.includes('back') || className.includes('back')) {
            this.navigate('courses');
          }
        }

        else if (this.activeView === 'assign') {
          if (text.includes('parser') || className.includes('assign-card')) {
            this.navigate('submit');
          } else if (text.includes('back') || id.includes('back')) {
            this.navigate('student-dash');
          }
        }

        else if (this.activeView === 'submit') {
          if (text.includes('submit') || id.includes('submit')) {
            this.showToast("Assignments file submitted successfully.", "success");
            this.navigate('assign');
          } else if (text.includes('back') || id.includes('back')) {
            this.navigate('assign');
          }
        }

        else if (this.activeView === 'leaderboard' || this.activeView === 'showcase' || this.activeView === 'premium' || this.activeView === 'profile') {
          if (text.includes('back') || id.includes('back') || className.includes('back') || text.includes('dashboard')) {
            this.navigate('student-dash');
          }
        }

        else if (this.activeView === 'recruiter-dash') {
          // Inner tabs or buttons inside Recruiter command center
          if (text.includes('talent') || text.includes('candidate') || text.includes('database')) {
            this.navigate('talent');
          } else if (text.includes('kanban') || text.includes('applicant')) {
            this.navigate('kanban');
          } else if (text.includes('creator') || text.includes('job editor')) {
            this.navigate('job-create');
          } else if (text.includes('ad campaign') || text.includes('advertisement')) {
            this.navigate('ad-campaign');
          } else if (text.includes('scheduler') || text.includes('interview')) {
            this.navigate('scheduler');
          } else if (text.includes('verification') || text.includes('queue')) {
            this.navigate('verify-queue');
          } else if (text.includes('exit') || text.includes('logout')) {
            this.navigate('gateway');
          }
        }

        else if (this.activeView === 'talent' || this.activeView === 'kanban') {
          if (className.includes('kanban-item') || text.includes('sterling') || text.includes('jenkins')) {
            this.navigate('doc-verify');
          } else if (text.includes('back') || id.includes('back')) {
            this.navigate('recruiter-dash');
          }
        }

        else if (this.activeView === 'job-create' || this.activeView === 'ad-campaign' || this.activeView === 'scheduler' || this.activeView === 'verify-queue') {
          if (text.includes('back') || id.includes('back')) {
            this.navigate('recruiter-dash');
          }
        }

        else if (this.activeView === 'doc-verify') {
          if (text.includes('back') || id.includes('back')) {
            this.navigate('recruiter-dash');
          }
        }
      });
    } catch (err) {
      console.warn("Iframe click tracking blocked due to cross-origin boundary rules: ", err);
    }
  },

  initAIChat() {
    const aiBtn = document.getElementById('floatingAIAgentBtn');
    const aiChat = document.getElementById('floatingAIChatWindow');
    const closeBtn = document.getElementById('closeAIChatBtn');
    const sendBtn = document.getElementById('sendAIChatBtn');
    const input = document.getElementById('aiChatInput');
    const messagesContainer = document.getElementById('aiChatMessages');
    const typingIndicator = document.getElementById('aiTypingIndicator');

    if (!aiBtn || !aiChat) return;

    aiBtn.addEventListener('click', () => {
      aiChat.classList.toggle('hidden');
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    });

    closeBtn.addEventListener('click', () => {
      aiChat.classList.add('hidden');
    });

    const triggerAIChatResponse = () => {
      const val = input.value.trim();
      if (!val) return;

      // Append user message
      const userBubble = document.createElement('div');
      userBubble.className = "flex flex-col items-end space-y-1 w-10/12 ml-auto";
      userBubble.innerHTML = `
        <div class="bg-primary text-white p-2.5 rounded-2xl rounded-tr-none text-[11px] leading-relaxed shadow-sm">
          ${val}
        </div>
      `;
      messagesContainer.appendChild(userBubble);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
      input.value = '';

      // Show typing indicator
      typingIndicator.classList.remove('hidden');
      messagesContainer.scrollTop = messagesContainer.scrollHeight;

      setTimeout(async () => {
        typingIndicator.classList.add('hidden');

        let replyText = "";
        const activeView = this.activeView;

        const screenTopics = {
          'onboarding': {
            name: 'Onboarding & Skills Setup',
            info: 'The Onboarding screen guides you through setting up your profile, selecting your primary role, and choosing your skills (e.g. Design, Frontend, Machine Learning) to customize your dashboard.',
            keywords: ['onboarding', 'skills', 'assessment', 'setup', 'welcome', 'start']
          },
          'gateway': {
            name: 'Gateway Role Selection',
            info: 'The Gateway page allows you to select your path. Choose between the Student Portal (to learn, take tests, and apply for jobs) or the Recruiter Console (to track applicants and manage campaigns).',
            keywords: ['gateway', 'role', 'selection', 'student', 'recruiter', 'portal', 'console']
          },
          'register': {
            name: 'Student Registration Wizard',
            info: 'The Registration Wizard helps you create a new account, enter your academic details, verify your email using a secure OTP code, and build your initial profile.',
            keywords: ['register', 'signup', 'create account', 'otp', 'email', 'verification']
          },
          'login': {
            name: 'Login Screen',
            info: 'The Login page allows registered users to securely sign in using their credentials. If MFA is enabled, you will be redirected to the multi-factor authentication step.',
            keywords: ['login', 'signin', 'credentials', 'password', 'email']
          },
          'mfa': {
            name: 'Multi-Factor Authentication (MFA)',
            info: 'The Multi-Factor Authentication page adds an extra layer of security. Enter the temporary verification code sent to your authenticator app or email to log in.',
            keywords: ['mfa', 'security', 'otp', 'code', 'authentication', 'factor']
          },
          'student-dash': {
            name: 'Student Dashboard',
            info: 'The Student Dashboard shows your overall academic progress, weekly milestones, calendar schedule, recent activities, and shortcuts to courses or tests. You can also view your current active streak here.',
            keywords: ['dashboard', 'home', 'main', 'progress', 'streak', 'milestone', 'welcome']
          },
          'recruiter-dash': {
            name: 'Recruiter Command Center',
            info: 'The Recruiter Dashboard provides an overview of hiring activity, candidate pipelines, interview schedules, ad campaigns, and quick stats on candidate matching.',
            keywords: ['recruiter', 'command center', 'hiring', 'dashboard', 'pipeline', 'statistics']
          },
          'courses': {
            name: 'Courses Catalog',
            info: 'The Course Catalog lists all available curriculum areas (Design, Engineering, Business, Data). You can select a course path, view its details, and quickly apply to register in PKR.',
            keywords: ['course', 'curriculum', 'learn', 'subject', 'class', 'design', 'engineering', 'business', 'data']
          },
          'guidelines': {
            name: 'Test Integrity & Guidelines',
            info: 'The Test Guidelines page displays security rules for proctored exams, including tab defocus restrictions and trust score penalty terms.',
            keywords: ['guideline', 'integrity', 'rules', 'instructions', 'proctoring', 'policy']
          },
          'player': {
            name: 'Anti-Cheat Test Player',
            info: 'The Test Player hosts the timed proctored assessment. It logs activities such as tab switching or resizing to ensure exam integrity.',
            keywords: ['player', 'exam player', 'timer', 'questions', 'proctored', 'anti-cheat']
          },
          'video': {
            name: 'Video Player Classroom',
            info: 'The Video Player Classroom lets you watch course lectures in high quality. You can follow along with timestamps, access lecture resources, and take notes.',
            keywords: ['video', 'player', 'lecture', 'watch', 'classroom', 'lesson']
          },
          'assign': {
            name: 'Assignments Dashboard',
            info: 'The Assignments Dashboard lists your course assignments divided by status (Remaining, Pending Evaluation, and Graded). You can submit a Git repository link to turn in your work here.',
            keywords: ['assignment', 'grade', 'evaluation', 'submit', 'git', 'homework', 'task']
          },
          'submit': {
            name: 'Assignment Submission Portal',
            info: 'The Assignment Submission page allows you to submit your project files and links (like GitHub repositories) for evaluation. Make sure to double-check files before submitting.',
            keywords: ['submit', 'submission', 'upload', 'github', 'repository', 'deliver']
          },
          'leaderboard': {
            name: 'Grades & Leaderboard',
            info: 'The Leaderboard shows the global academic rankings of all students based on their score ratings, badges, and trust score. Work hard to climb to the top of the leader ranks!',
            keywords: ['grade', 'leaderboard', 'rank', 'ranking', 'score', 'trust', 'points']
          },
          'showcase': {
            name: 'Success Showcase',
            info: 'The Success Showcase features stories of students who secured top jobs through the portal, detailing their learning paths, projects, and interview tips.',
            keywords: ['showcase', 'success', 'story', 'placement', 'hired', 'alumni']
          },
          'premium': {
            name: 'Premium Membership Hub',
            info: 'The Premium Membership page displays details about the Gold Elite tier, including advanced AI features, unlimited mentor bookings, priority job applications, and fee waivers.',
            keywords: ['premium', 'membership', 'gold', 'elite', 'upgrade', 'pricing', 'subscribe']
          },
          'talent': {
            name: 'Talent Candidate Search',
            info: 'The Talent Search screen allows recruiters to filter and search candidates based on skills, academic rating, group division, and trust scores to find the perfect match.',
            keywords: ['talent', 'search', 'candidate', 'filter', 'recruiting', 'find']
          },
          'kanban': {
            name: 'Applicant Tracking Board (Kanban)',
            info: 'The Kanban board displays candidates in columns representing stages of the recruitment funnel (Applied, Shortlisted, Interviewing, Offered). Recruiters can drag items to update status.',
            keywords: ['kanban', 'board', 'applicant', 'tracking', 'stages', 'drag', 'funnel']
          },
          'job-create': {
            name: 'Job Creator & Editor',
            info: 'The Job Creator lets recruiters draft and publish new job listings, specifying job descriptions, requirements, locations, salaries, and application fees in PKR.',
            keywords: ['job-create', 'creator', 'editor', 'publish', 'posting', 'description']
          },
          'ad-campaign': {
            name: 'Ad Campaign Creator',
            info: 'The Ad Campaign Creator allows companies to design and sponsor ads across the student portal, with live previews showing how the ad appears on different devices.',
            keywords: ['campaign', 'ad', 'advertisement', 'sponsor', 'preview', 'marketing']
          },
          'ad-store': {
            name: 'Ad System Store',
            info: 'The Ad Store lets recruiters purchase advertising credits, view pricing tiers, and browse history of active and completed marketing campaigns.',
            keywords: ['store', 'ads', 'credits', 'pricing', 'purchase', 'campaigns']
          },
          'scheduler': {
            name: 'Interview Scheduler',
            info: 'The Interview Scheduler helps recruiters sync calendars, propose time slots, and schedule live video interviews with selected candidates.',
            keywords: ['scheduler', 'interview', 'calendar', 'sync', 'slot', 'meeting']
          },
          'jobboard': {
            name: 'Recruiter Job Board',
            info: 'The Recruiter Job Board shows all active, closed, and draft job postings. Recruiters can promote listings, view details, compare candidates, or delete job postings.',
            keywords: ['jobboard', 'job board', 'listings', 'delete', 'promote', 'compare']
          },
          'postings': {
            name: 'Active Postings Management',
            info: 'The Active Postings page allows you to view details of active job posts, candidate matching percentages, candidate count, and click to view applicants.',
            keywords: ['postings', 'active postings', 'matching', 'post', 'manage']
          },
          'saved-drafts': {
            name: 'Saved Drafts Dashboard',
            info: 'The Saved Drafts Dashboard displays your unpublished job postings and email template drafts. You can edit them to publish or discard them.',
            keywords: ['drafts', 'save draft', 'saved drafts', 'unpublished', 'templates']
          },
          'payment': {
            name: 'Payment & Billing Dashboard',
            info: 'The Payment & Billing Dashboard displays pricing tiers for promoting jobs, active marketing credits, transaction history, and EasyPaisa/JazzCash methods.',
            keywords: ['payment', 'payments', 'billing', 'credits', 'pricing', 'wallet', 'easypaisa', 'jazzcash']
          },
          'recruiter-analytics': {
            name: 'Recruiter Performance Analytics',
            info: 'The Recruiter Performance Analytics dashboard displays hiring funnel rates, conversion metrics, department breakdowns, and weekly stats.',
            keywords: ['analytics', 'metrics', 'performance', 'chart', 'graph', 'conversion', 'funnel']
          },
          'verify-queue': {
            name: 'Company Verification Queue',
            info: 'The Admin Queue page displays pending company registrations and document uploads requiring verification from the portal administrators.',
            keywords: ['queue', 'verify-queue', 'verification', 'admin', 'pending', 'company']
          },
          'doc-verify': {
            name: 'Document Verification Viewer',
            info: 'The Document Verification Viewer provides a side-by-side view of uploaded company documents and credentials for quick admin approval or rejection.',
            keywords: ['doc-verify', 'document', 'viewer', 'credentials', 'approval', 'admin']
          },
          'mentors': {
            name: 'Mentors Booking',
            info: 'The Mentors screen lets you schedule one-on-one sessions with senior industry professionals (like Sarah Jenkins). You can select 30/60/90 minute slot durations and confirm bookings.',
            keywords: ['mentor', 'booking', 'schedule', 'sarah', 'slot', 'call', 'meeting']
          },
          'opportunities': {
            name: 'Job Opportunities Board',
            info: 'The Opportunities screen lists curated job postings with quick apply features. You can browse listings, view job descriptions, and apply directly. Application fees are dynamically converted to PKR.',
            keywords: ['job', 'internship', 'opportunity', 'apply', 'career', 'hiring', 'salary', 'company']
          },
          'profile': {
            name: 'Student Profile Viewer',
            info: 'The Student Profile shows your public CV page, including education, personal skills, interests, badges, trust scores, and dynamic academic stats.',
            keywords: ['profile', 'cv', 'resume', 'skills', 'education', 'interests', 'user']
          },
          'courses-design': {
            name: 'Design Course Catalog',
            info: 'The Design Curriculum section lists specialized courses in UI/UX Design, Typography, Interaction Design, and Visual Branding, complete with mock PKR pricing.',
            keywords: ['design', 'ui', 'ux', 'typography', 'interaction', 'branding']
          },
          'courses-engineering': {
            name: 'Engineering Course Catalog',
            info: 'The Engineering Curriculum section lists technical courses in Web Development, Software Engineering, DevOps, and Database Architectures.',
            keywords: ['engineering', 'software', 'developer', 'web', 'devops', 'databases']
          },
          'courses-business': {
            name: 'Business Course Catalog',
            info: 'The Business Curriculum section lists management courses in Entrepreneurship, Project Management, Marketing, and Financial Analyst paths.',
            keywords: ['business', 'management', 'entrepreneurship', 'marketing', 'finance']
          },
          'courses-data': {
            name: 'Data Science Course Catalog',
            info: 'The Data Science Curriculum section lists courses in Python Programming, Machine Learning, Data Analytics, and Big Data Technologies.',
            keywords: ['data', 'science', 'python', 'machine learning', 'analytics', 'statistics']
          },
          'tests': {
            name: 'Weekly Tests Hub / Schedule',
            info: 'The Tests Hub/Schedule lists your upcoming academic assessments, cognitive tests, and scheduled interviews. You can read integrity rules and launch the timed proctored exam from here.',
            keywords: ['test', 'exam', 'quiz', 'proctor', 'schedule', 'rules', 'cheat']
          },
          'analytics': {
            name: 'Performance Analytics',
            info: 'The Performance Analytics dashboard displays your dynamic learning metrics in real time, including your average test score, course completion rate, assignment grade, streak logs, and acquired skills.',
            keywords: ['analytics', 'performance', 'metrics', 'chart', 'data', 'stat', 'graph', 'log']
          },
          'library': {
            name: 'Resource Library',
            info: 'The Curated Resource Library contains Cheat Sheets, Roadmaps, E-books, and Handbooks. You can search resources, bookmark them, request custom curation, and download guides directly to your computer.',
            keywords: ['library', 'download', 'pdf', 'book', 'cheat', 'sheet', 'roadmap', 'resource', 'guide']
          },
          'messages': {
            name: 'Inbox Messages',
            info: 'The Inbox Messages screen allows you to communicate directly with mentors and hiring teams. You can view conversations, check online status, send attachments, and chat with this AI Agent!',
            keywords: ['message', 'chat', 'inbox', 'agent', 'bot', 'talk', 'conversation']
          },
          'checkout': {
            name: 'Checkout & Billing',
            info: 'The Checkout page processes your course registrations or job applications in PKR (1 USD = 280 PKR). It integrates EasyPaisa and JazzCash mobile wallet methods without any card express options.',
            keywords: ['checkout', 'billing', 'pay', 'easypaisa', 'jazzcash', 'rs', 'rupee', 'pkr']
          },
          'student-analytics': {
            name: 'Performance Analytics',
            info: 'The Performance Analytics dashboard displays your dynamic learning metrics in real time, including your average test score, course completion rate, assignment grade, streak logs, and acquired skills.',
            keywords: ['analytics', 'performance', 'metrics', 'chart', 'data', 'stat', 'graph', 'log']
          },
          'amb-hub': {
            name: 'Ambassador Hub',
            info: 'The Ambassador Hub dashboard displays your referral statistics, current monthly earnings, pending bonuses, active streaks, and options to share your referral link or view tasks.',
            keywords: ['ambassador', 'referral', 'bonus', 'earnings', 'link', 'rewards', 'hub']
          },
          'amb-referral': {
            name: 'Referral Center',
            info: 'The Referral Center shows your recent referrals and their status (Active, Pending, Joined). You can track referral invites and copy your referral link here.',
            keywords: ['referral', 'invite', 'joined', 'friend', 'status', 'link', 'track']
          },
          'amb-missions': {
            name: 'Missions & Tasks',
            info: 'The Ambassador Missions & Tasks page lists available tasks you can complete to earn bonuses, such as sharing on LinkedIn, referring friends, or completing learning streaks.',
            keywords: ['mission', 'task', 'complete', 'share', 'linkedin', 'points', 'bonus']
          },
          'amb-leaderboard': {
            name: 'Leaderboard & Rewards',
            info: 'The Ambassador Leaderboard lists top ambassadors and their rankings. You can also view available rewards and claim your cash bonuses here.',
            keywords: ['leaderboard', 'rank', 'reward', 'points', 'earnings', 'claim', 'bonus']
          }
        };

        const viewData = screenTopics[activeView] || { name: 'Current Screen', info: 'You are currently on the ' + activeView + ' screen.', keywords: [] };

        try {
          const response = await fetch('http://localhost:8080/api/ai-chat', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              message: val,
              activeScreen: activeView,
              screenName: viewData.name,
              screenInfo: viewData.info
            })
          });

          if (!response.ok) throw new Error("API request failed");
          const data = await response.json();
          if (data && data.success && data.reply) {
            replyText = data.reply;
          } else {
            throw new Error("Invalid response schema");
          }
        } catch (err) {
          console.warn("AI Chat API failed, using static fallback:", err);
          const isAskingAboutOtherScreen = Object.keys(screenTopics).some(key => {
            if (key === activeView) return false;
            const keywords = screenTopics[key].keywords;
            return keywords.some(kw => val.toLowerCase().includes(kw));
          });

          if (isAskingAboutOtherScreen) {
            replyText = `I apologize, but I am restricted to answering questions only about your currently active screen: ${viewData.name}. I cannot provide details or answer questions regarding other sections of the portal. Please switch to that screen if you wish to ask questions about it!`;
          } else {
            const hasMatchedCurrentKeywords = viewData.keywords.some(kw => val.toLowerCase().includes(kw)) || val.toLowerCase().includes('help') || val.toLowerCase().includes('what') || val.toLowerCase().includes('page') || val.toLowerCase().includes('screen');

            if (hasMatchedCurrentKeywords) {
              replyText = `[AI Agent Response for ${viewData.name}]: Here is some information about your current screen:\n\n${viewData.info}`;
            } else {
              replyText = `I am your screen-specific AI Agent. I see you are currently on the ${viewData.name} screen. You can ask me anything about this page. (I cannot answer questions about other screens of the portal).`;
            }
          }
        }

        typingIndicator.classList.add('hidden');

        // Sanitize double asterisks from response text
        if (replyText) {
          replyText = replyText.replace(/\*\*/g, '');
        }

        const replyBubble = document.createElement('div');
        replyBubble.className = "flex gap-2 w-10/12";
        replyBubble.innerHTML = `
          <img src="assets/ai_agent_avatar.png" class="w-6 h-6 rounded-full object-cover border border-white flex-shrink-0" alt=""/>
          <div class="bg-white/70 p-2.5 rounded-2xl rounded-tl-none text-[11px] text-purple-950 leading-relaxed shadow-sm border border-glass-border">
            ${replyText}
          </div>
        `;
        messagesContainer.appendChild(replyBubble);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }, 1000);
    };

    sendBtn.addEventListener('click', triggerAIChatResponse);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') triggerAIChatResponse();
    });
  }
};

// Start portal engine
App.init();

// Export App globally so iframes can access it
window.App = App;
