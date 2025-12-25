/**
 * Portfolio Website JavaScript
 * 
 * How to add new content:
 * - Projects: Edit data/projects.json with new project objects
 * - Skills: Edit data/skills.json with new skill objects
 * - Blog posts: Edit data/posts.json with new post objects
 * 
 * Note: Serve files via local static server (e.g., `npx http-server` or `python -m http.server`)
 * because fetch of local files may be blocked when opening index.html directly.
 */

// ==========================================================================
// Configuration & Constants
// ==========================================================================

const CONFIG = {
  dataFiles: {
    projects: './data/projects.json',
    skills: './data/skills.json',
    posts: './data/posts.json',
    experience: './data/experience.json',
    education: './data/education.json'
  },
  animation: {
    observerOptions: {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    },
    staggerDelay: 100
  },
  form: {
    submitDelay: 2000 // Simulate network delay
  },
  keyboard: {
    contactShortcut: 'KeyC',
    escapeKey: 'Escape'
  }
};

// ==========================================================================
// Utility Functions
// ==========================================================================

/**
 * Safely load JSON data with error handling
 * @param {string} path - Path to JSON file
 * @returns {Promise<Object|null>} Parsed JSON data or null if error
 */
async function loadJSON(path) {
  try {
    const response = await fetch(`${path}?v=${Date.now()}`, { cache: 'no-store' });
    if (!response.ok) {
      console.warn(`Failed to load ${path}: ${response.status}`);
      return null;
    }
    return await response.json();
  } catch (error) {
    console.warn(`Error loading ${path}:`, error);
    return null;
  }
}

/**
 * Create DOM element from HTML string
 * @param {string} htmlString - HTML string
 * @returns {Element} DOM element
 */
function createElement(htmlString) {
  const template = document.createElement('template');
  template.innerHTML = htmlString.trim();
  return template.content.firstChild;
}

/**
 * Debounce function to limit function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function to limit function calls
 * @param {Function} func - Function to throttle
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Throttled function
 */
function throttle(func, delay) {
  let timeoutId;
  let lastExecTime = 0;
  return function (...args) {
    const currentTime = Date.now();
    
    if (currentTime - lastExecTime > delay) {
      func.apply(this, args);
      lastExecTime = currentTime;
    } else {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
        lastExecTime = Date.now();
      }, delay - (currentTime - lastExecTime));
    }
  };
}

// ==========================================================================
// Theme Management
// ==========================================================================

class ThemeManager {
  constructor() {
    this.themeToggle = document.querySelector('.theme-toggle');
    this.themeIcon = document.querySelector('.theme-toggle__icon');
    this.body = document.body;
    
    this.init();
  }
  
  init() {
    // Get saved theme or default to dark
    const savedTheme = localStorage.getItem('theme') || 'dark';
    this.setTheme(savedTheme);
    
    // Add event listener
    this.themeToggle?.addEventListener('click', () => this.toggleTheme());
  }
  
  setTheme(theme) {
    this.body.className = `${theme}-theme`;
    this.updateIcon(theme);
    localStorage.setItem('theme', theme);
  }
  
  toggleTheme() {
    const currentTheme = this.body.classList.contains('dark-theme') ? 'dark' : 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  }
  
  updateIcon(theme) {
    if (this.themeIcon) {
      this.themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
  }
}

// ==========================================================================
// Navigation Management
// ==========================================================================

class NavigationManager {
  constructor() {
    this.nav = document.querySelector('.nav');
    this.navToggle = document.querySelector('.nav__toggle');
    this.navMenu = document.querySelector('.nav__menu');
    this.navLinks = document.querySelectorAll('.nav__link');
    this.sections = document.querySelectorAll('section[id]');
    
    this.init();
  }
  
  init() {
    this.setupEventListeners();
    this.setupIntersectionObserver();
    this.setupSmoothScroll();
  }
  
  setupEventListeners() {
    // Mobile menu toggle
    this.navToggle?.addEventListener('click', () => this.toggleMobileMenu());
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!this.nav.contains(e.target) && this.navMenu?.classList.contains('open')) {
        this.closeMobileMenu();
      }
    });
    
    // Navigation links
    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href.startsWith('#')) {
          e.preventDefault();
          this.scrollToSection(href.slice(1));
          this.closeMobileMenu();
        }
      });
    });
  }
  
  setupIntersectionObserver() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.setActiveNavLink(entry.target.id);
          }
        });
      },
      { threshold: 0.2, rootMargin: '-80px 0px -80px 0px' }
    );
    
    this.sections.forEach(section => observer.observe(section));
  }
  
  setupSmoothScroll() {
    // Fallback for browsers without smooth scroll support
    if (!('scrollBehavior' in document.documentElement.style)) {
      this.navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
          const href = link.getAttribute('href');
          if (href.startsWith('#')) {
            e.preventDefault();
            this.smoothScrollTo(href.slice(1));
          }
        });
      });
    }
  }
  
  toggleMobileMenu() {
    this.navMenu?.classList.toggle('open');
    const isOpen = this.navMenu?.classList.contains('open');
    this.navToggle?.setAttribute('aria-expanded', isOpen);
  }
  
  closeMobileMenu() {
    this.navMenu?.classList.remove('open');
    this.navToggle?.setAttribute('aria-expanded', 'false');
  }
  
  setActiveNavLink(sectionId) {
    this.navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === `#${sectionId}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
  
  scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
      const headerHeight = document.querySelector('.header')?.offsetHeight || 80;
      const targetPosition = section.offsetTop - headerHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  }
  
  smoothScrollTo(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
      const headerHeight = document.querySelector('.header')?.offsetHeight || 80;
      const targetPosition = section.offsetTop - headerHeight;
      const startPosition = window.pageYOffset;
      const distance = targetPosition - startPosition;
      const duration = 800;
      let start = null;
      
      function animation(currentTime) {
        if (start === null) start = currentTime;
        const timeElapsed = currentTime - start;
        const run = ease(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
      }
      
      function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
      }
      
      requestAnimationFrame(animation);
    }
  }
}
// Tabs Controller for Experience/Education
class ExpEduTabs {
  constructor() {
    this.tabExperience = document.getElementById('tab-experience');
    this.tabEducation = document.getElementById('tab-education');
    this.panelExperience = document.getElementById('panel-experience');
    this.panelEducation = document.getElementById('panel-education');
    this.init();
  }

  init() {
    if (!this.tabExperience || !this.tabEducation) return;
    this.tabExperience.addEventListener('click', () => this.activate('experience'));
    this.tabEducation.addEventListener('click', () => this.activate('education'));
  }

  activate(which) {
    const expActive = which === 'experience';
    this.tabExperience.classList.toggle('active', expActive);
    this.tabEducation.classList.toggle('active', !expActive);
    this.tabExperience.setAttribute('aria-selected', String(expActive));
    this.tabEducation.setAttribute('aria-selected', String(!expActive));
    this.panelExperience.classList.toggle('hidden', !expActive);
    this.panelEducation.classList.toggle('hidden', expActive);
  }
}

// ==========================================================================
// Animation Manager
// ==========================================================================

class AnimationManager {
  constructor() {
    this.observedElements = new Set();
    this.observer = null;
    this.init();
  }
  
  init() {
    this.setupIntersectionObserver();
    this.observeElements();
  }
  
  setupIntersectionObserver() {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting && !entry.target.classList.contains('visible')) {
            // Add staggered animation delay
            setTimeout(() => {
              entry.target.classList.add('visible');
            }, index * CONFIG.animation.staggerDelay);
          }
        });
      },
      CONFIG.animation.observerOptions
    );
  }
  
  observeElements() {
    const elements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .project-card, .skill-card, .blog-card');
    elements.forEach(el => {
      if (!this.observedElements.has(el)) {
        this.observer.observe(el);
        this.observedElements.add(el);
      }
    });
  }
  
  // Re-observe new elements after dynamic content is added
  refresh() {
    this.observeElements();
  }
}

// ==========================================================================
// Skills Section
// ==========================================================================

class SkillsManager {
  constructor() {
    this.skillsGrid = document.querySelector('.skills__grid');
    this.filterContainer = document.querySelector('.skills__filter');
    this.skills = [];
    this.categories = new Set(['all']);
    
    this.init();
  }
  
  async init() {
    // If required containers are not on the page, skip initializing
    if (!this.skillsGrid || !this.filterContainer) {
      return;
    }
    const skillsData = await loadJSON(CONFIG.dataFiles.skills);
    if (skillsData && skillsData.skills) {
      this.skills = skillsData.skills;
      this.extractCategories();
      this.renderFilters();
      this.renderSkills();
      this.setupEventListeners();
    } else {
      this.renderEmptyState();
    }
  }
  
  extractCategories() {
    this.skills.forEach(skill => {
      this.categories.add(skill.category.toLowerCase());
    });
  }
  
  renderFilters() {
    const filtersFragment = document.createDocumentFragment();
    
    this.categories.forEach(category => {
      const button = createElement(`
        <button class="skills__filter-btn ${category === 'all' ? 'active' : ''}" 
                role="tab" 
                aria-selected="${category === 'all'}" 
                data-filter="${category}">
          ${this.capitalizeFirst(category)}
        </button>
      `);
      filtersFragment.appendChild(button);
    });
    
    // Clear existing filters except the "All" button
    const allButton = this.filterContainer.querySelector('[data-filter="all"]');
    this.filterContainer.innerHTML = '';
    this.filterContainer.appendChild(allButton);
    this.filterContainer.appendChild(filtersFragment);
  }
  
  renderSkills() {
    const skillsFragment = document.createDocumentFragment();
    
    this.skills.forEach(skill => {
      const skillCard = this.createSkillCard(skill);
      skillsFragment.appendChild(skillCard);
    });
    
    this.skillsGrid.appendChild(skillsFragment);
    
    // Trigger progress bar animations
    setTimeout(() => this.animateProgressBars(), 500);
  }
  
  createSkillCard(skill) {
    const card = createElement(`
      <div class="skill-card fade-in" data-category="${skill.category.toLowerCase()}">
        <div class="skill-card__header">
          <div class="skill-card__icon">${skill.icon || '🔧'}</div>
          <div>
            <h3 class="skill-card__name">${skill.name}</h3>
            <p class="skill-card__category">${skill.category}</p>
          </div>
        </div>
        <div class="skill-card__progress">
          <div class="skill-card__progress-bar">
            <div class="skill-card__progress-fill" data-level="${skill.level}"></div>
          </div>
          <div class="skill-card__level">${skill.level}%</div>
        </div>
      </div>
    `);
    
    return card;
  }
  
  setupEventListeners() {
    this.filterContainer.addEventListener('click', (e) => {
      if (e.target.classList.contains('skills__filter-btn')) {
        const filter = e.target.dataset.filter;
        this.filterSkills(filter);
        this.updateActiveFilter(e.target);
      }
    });
  }
  
  filterSkills(category) {
    const skillCards = this.skillsGrid.querySelectorAll('.skill-card');
    
    skillCards.forEach(card => {
      const cardCategory = card.dataset.category;
      const shouldShow = category === 'all' || cardCategory === category;
      
      if (shouldShow) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  }
  
  updateActiveFilter(activeButton) {
    this.filterContainer.querySelectorAll('.skills__filter-btn').forEach(btn => {
      btn.classList.remove('active');
      btn.setAttribute('aria-selected', 'false');
    });
    
    activeButton.classList.add('active');
    activeButton.setAttribute('aria-selected', 'true');
  }
  
  animateProgressBars() {
    const progressBars = this.skillsGrid.querySelectorAll('.skill-card__progress-fill');
    progressBars.forEach(bar => {
      const level = bar.dataset.level;
      bar.style.width = `${level}%`;
    });
  }
  
  renderEmptyState() {
    this.skillsGrid.innerHTML = `
      <div class="empty-state">
        <p>Skills data not available. Please check data/skills.json</p>
      </div>
    `;
  }
  
  capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}

// ========================================================================== 
// Projects Section
// ========================================================================== 

class ProjectsManager {
  constructor() {
    this.projectsGrid = document.querySelector('.projects__grid');
    this.projectsMore = document.getElementById('projects-more');
    this.moreBtn = document.getElementById('projects-more-btn');
    this.modal = document.getElementById('project-modal');
    this.modalContent = this.modal ? this.modal.querySelector('.modal__content') : null;
    this.projects = [];
    this.INITIAL_COUNT = 6; // 2 rows x 3 columns on large screens
    this.restProjects = [];
    // Page context flags (still supported for projects.html)
    const params = new URLSearchParams(window.location.search);
    this.offset = parseInt(params.get('offset') || '0', 10) || 0;
    this.showAll = params.get('showAll') === '1';
    
    this.init();
  }
  
  async init() {
    const projectsData = await loadJSON(CONFIG.dataFiles.projects);
    if (projectsData && projectsData.projects) {
      this.projects = projectsData.projects;
      this.renderProjects();
      this.setupEventListeners();
      this.setupLazyLoading();
    } else {
      this.renderEmptyState();
    }
  }
  
  renderProjects() {
    // Dedicated projects page: render from offset or all
    if (this.offset > 0 || this.showAll) {
      const items = this.projects.slice(this.offset);
      const frag = document.createDocumentFragment();
      items.forEach(project => frag.appendChild(this.createProjectCard(project)));
      this.projectsGrid.appendChild(frag);
      this.moreBtn?.classList.add('is-hidden');
      return;
    }

    // Index page: show initial set
    const initial = this.projects.slice(0, this.INITIAL_COUNT);
    this.restProjects = this.projects.slice(this.INITIAL_COUNT);
    const firstFrag = document.createDocumentFragment();
    initial.forEach(project => firstFrag.appendChild(this.createProjectCard(project)));
    this.projectsGrid.appendChild(firstFrag);

    // Show More button only if there are more
    const hasMore = this.restProjects.length > 0;
    if (!hasMore) {
      this.moreBtn?.classList.add('is-hidden');
    }
  }
  
  createProjectCard(project) {
    const techTags = project.technologies.map(tech => 
      `<span class="tech-tag">${tech}</span>`
    ).join('');
    
    const card = createElement(`
      <article class="project-card fade-in" data-project-id="${project.id}" tabindex="0" aria-label="View ${project.title} details">
        <div class="project-card__content">
          <h3 class="project-card__title">${project.title}</h3>
          <p class="project-card__description">${project.description}</p>
          <div class="project-card__tech">
            ${techTags}
          </div>
          <div class="project-card__actions">
            ${project.liveUrl ? `<a href="${project.liveUrl}" class="project-card__link project-card__link--primary" target="_blank" rel="noopener">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="m9 18 6-6-6-6"/>
              </svg>
              Live Demo
            </a>` : ''}
            ${project.repoUrl ? `<a href="${project.repoUrl}" class="project-card__link project-card__link--secondary" target="_blank" rel="noopener">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              Code
            </a>` : ''}
            <button class="project-card__link project-card__link--secondary" data-project-id="${project.id}">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
              Details
            </button>
          </div>
        </div>
      </article>
    `);
    
    return card;
  }
  
  setupEventListeners() {
    // Project details modal: click anywhere on card except action links
    this.projectsGrid.addEventListener('click', (e) => {
      const actionLink = e.target.closest('.project-card__actions a');
      if (actionLink) return; // let Live Demo / Code work normally

      const card = e.target.closest('.project-card');
      if (card && card.dataset.projectId) {
        this.openProjectModal(card.dataset.projectId);
        return;
      }

      // Fallback: existing Details button behavior
      if (e.target.matches('[data-project-id]') || e.target.closest('[data-project-id]')) {
        const button = e.target.matches('[data-project-id]') ? e.target : e.target.closest('[data-project-id]');
        const projectId = button.dataset.projectId;
        this.openProjectModal(projectId);
      }
    });

    // Keyboard accessibility: Enter on focused card opens details
    this.projectsGrid.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const card = e.target.closest('.project-card');
        const actionLinkFocused = e.target.closest('.project-card__actions a');
        if (card && card.dataset.projectId && !actionLinkFocused) {
          this.openProjectModal(card.dataset.projectId);
        }
      }
    });
    
    // Modal close events (overlay click or close button, including icon children)
    this.modal?.addEventListener('click', (e) => {
      const isOverlay = e.target.classList.contains('modal__overlay');
      const isClose = !!(e.target.closest && e.target.closest('.modal__close'));
      if (isOverlay || isClose) {
        this.closeModal();
      }
    });
    
    // Keyboard events
    document.addEventListener('keydown', (e) => {
      if (e.code === CONFIG.keyboard.escapeKey && this.modal?.classList.contains('open')) {
        this.closeModal();
      }
    });

    // More button opens a modal gallery with remaining projects
    this.moreBtn?.addEventListener('click', () => {
      this.openMoreGalleryModal();
    });
  }

  openMoreGalleryModal() {
    if (!this.modal) return;
    const modalTitle = this.modal.querySelector('.modal__title');
    const modalBody = this.modal.querySelector('.modal__body');
    if (!modalTitle || !modalBody) return;

    // Set modal title and prepare gallery container
    modalTitle.textContent = 'More Projects';
    modalBody.innerHTML = '';
    const gallery = document.createElement('div');
    gallery.className = 'modal__galleryGrid';

    // Ensure restProjects is populated
    if (this.restProjects.length === 0 && Array.isArray(this.projects) && this.projects.length > this.INITIAL_COUNT) {
      this.restProjects = this.projects.slice(this.INITIAL_COUNT);
    }

    const frag = document.createDocumentFragment();
    this.restProjects.forEach(project => frag.appendChild(this.createProjectCard(project)));
    gallery.appendChild(frag);
    modalBody.appendChild(gallery);

    // Ensure cards are visible without waiting for AnimationManager
    requestAnimationFrame(() => {
      gallery.querySelectorAll('.project-card, .fade-in').forEach(el => el.classList.add('visible'));
    });

    // Make modal wider for gallery view
    this.modalContent?.classList.add('modal__content--wide');

    // Open modal
    this.modal.classList.add('open');
    this.modal.setAttribute('aria-hidden', 'false');
    const closeButton = this.modal.querySelector('.modal__close');
    closeButton?.focus();
  }

  createProjectDetailCard(project) {
    const techs = Array.isArray(project.technologies) ? project.technologies : [];
    const techTags = techs.map(tech => `<span class="tech-tag">${tech}</span>`).join('');
    const featureItems = Array.isArray(project.features) ? project.features : [];
    const featuresList = featureItems.length ? `
      <div class="project-detail__features">
        <strong>Key Features:</strong>
        <ul class="project-detail__features-list">
          ${featureItems.map(f => `<li>${f}</li>`).join('')}
        </ul>
      </div>
    ` : '';
    const img = project.thumbnail ? `<img class="project-detail__image" src="${project.thumbnail}" alt="${project.title}">` : '';
    return createElement(`
      <article class="project-card project-detail fade-in">
        ${img}
        <div class="project-card__content">
          <h3 class="project-card__title">${project.title}</h3>
          <p class="project-card__description">${project.fullDescription || project.description}</p>
          <div class="project-card__tech">${techTags}</div>
          ${featuresList}
          <div class="project-card__actions">
            ${project.liveUrl ? `<a href="${project.liveUrl}" class="project-card__link project-card__link--primary" target="_blank" rel="noopener">Live Demo</a>` : ''}
            ${project.repoUrl ? `<a href="${project.repoUrl}" class="project-card__link project-card__link--secondary" target="_blank" rel="noopener">Code</a>` : ''}
          </div>
        </div>
      </article>
    `);
  }
  
  setupLazyLoading() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
            }
            imageObserver.unobserve(img);
          }
        });
      });
      
      const lazyImages = this.projectsGrid.querySelectorAll('img[data-src]');
      lazyImages.forEach(img => imageObserver.observe(img));
    }
  }
  
  openProjectModal(projectId) {
    const project = this.projects.find(p => p.id === projectId);
    if (!project) return;
    
    const modalTitle = this.modal.querySelector('.modal__title');
    const modalBody = this.modal.querySelector('.modal__body');
    
    modalTitle.textContent = project.title;
    const techs = Array.isArray(project.technologies) ? project.technologies : [];
    const features = Array.isArray(project.features) ? project.features : [];
    const imgHTML = project.thumbnail ? `<img src="${project.thumbnail}" alt="${project.title}" style="width: 100%; border-radius: 8px; margin-bottom: 1rem;">` : '';
    modalBody.innerHTML = `
      ${imgHTML}
      <p style="margin-bottom: 1rem; line-height: 1.6;">${project.fullDescription || project.description}</p>
      ${techs.length ? `
      <div style=\"margin-bottom: 1rem;\">
        <strong>Technologies:</strong>
        <div style=\"display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.5rem;\">
          ${techs.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
        </div>
      </div>` : ''}
      ${features.length ? `
        <div style=\"margin-bottom: 1rem;\">
          <strong>Key Features:</strong>
          <ul style=\"margin-top: 0.5rem; padding-left: 1.5rem;\">
            ${features.map(feature => `<li style="margin-bottom: 0.25rem;">${feature}</li>`).join('')}
          </ul>
        </div>
      ` : ''}
      <div style="display: flex; gap: 1rem; margin-top: 1.5rem;">
        ${project.liveUrl ? `<a href="${project.liveUrl}" class="btn btn--primary" target="_blank" rel="noopener">Live Demo</a>` : ''}
        ${project.repoUrl ? `<a href="${project.repoUrl}" class="btn btn--secondary" target="_blank" rel="noopener">View Code</a>` : ''}
      </div>
    `;
    
    this.modal.classList.add('open');
    this.modal.setAttribute('aria-hidden', 'false');
    
    // Focus management
    const closeButton = this.modal.querySelector('.modal__close');
    closeButton?.focus();
  }
  
  closeModal() {
    if (!this.modal) return;
    this.modal.classList.remove('open');
    this.modal.setAttribute('aria-hidden', 'true');
    const modalBody = this.modal.querySelector('.modal__body');
    if (modalBody) modalBody.innerHTML = '';
    // Remove wide mode if applied for gallery
    this.modalContent?.classList.remove('modal__content--wide');
  }
  
  renderEmptyState() {
    this.projectsGrid.innerHTML = `
      <div class="empty-state">
        <p>Projects data not available. Please check data/projects.json</p>
      </div>
    `;
  }
}

// ==========================================================================
// Blog Section
// ==========================================================================

class BlogManager {
  constructor() {
    this.blogGrid = document.querySelector('.blog__grid');
    this.posts = [];
    
    this.init();
  }
  
  async init() {
    const postsData = await loadJSON(CONFIG.dataFiles.posts);
    if (postsData && postsData.posts) {
      this.posts = postsData.posts;
      this.renderPosts();
    } else {
      this.renderEmptyState();
    }
  }
  
  renderPosts() {
    const postsFragment = document.createDocumentFragment();
    
    this.posts.forEach(post => {
      const blogCard = this.createBlogCard(post);
      postsFragment.appendChild(blogCard);
    });
    
    this.blogGrid.appendChild(postsFragment);
  }
  
  createBlogCard(post) {
    const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    const card = createElement(`
      <article class="blog-card fade-in">
        <time class="blog-card__date" datetime="${post.date}">${formattedDate}</time>
        <h3 class="blog-card__title">${post.title}</h3>
        <p class="blog-card__excerpt">${post.excerpt}</p>
      </article>
    `);
    
    // Add click handler for external links or modal content
    card.addEventListener('click', () => {
      if (post.externalUrl) {
        window.open(post.externalUrl, '_blank', 'noopener');
      } else if (post.contentPath) {
        this.loadPostContent(post);
      }
    });
    
    return card;
  }
  
  async loadPostContent(post) {
    try {
      const response = await fetch(post.contentPath);
      const content = await response.text();
      
      // Simple markdown-like rendering
      const htmlContent = content
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
        .replace(/\*(.*)\*/gim, '<em>$1</em>')
        .replace(/\n\n/gim, '</p><p>')
        .replace(/^(?!<h|<\/)/gim, '<p>')
        .replace(/$/gim, '</p>');
      
      this.showPostModal(post.title, htmlContent);
    } catch (error) {
      console.warn('Failed to load post content:', error);
    }
  }
  
  showPostModal(title, content) {
    const modal = document.getElementById('project-modal');
    const modalTitle = modal.querySelector('.modal__title');
    const modalBody = modal.querySelector('.modal__body');
    
    modalTitle.textContent = title;
    modalBody.innerHTML = content;
    
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
  }
  
  renderEmptyState() {
    this.blogGrid.innerHTML = `
      <div class="empty-state">
        <p>Blog posts not available. Please check data/posts.json</p>
      </div>
    `;
  }
}

// ==========================================================================
// Experience Section
// ==========================================================================

class ExperienceManager {
  constructor() {
    this.timeline = document.querySelector('.experience__timeline');
    this.experiences = [];
    this.init();
  }

  async init() {
    if (!this.timeline) return;
    const expData = await loadJSON(CONFIG.dataFiles.experience);
    if (expData && Array.isArray(expData.experience)) {
      this.experiences = expData.experience;
      this.renderExperience();
    } else {
      this.renderEmptyState();
    }
  }

  renderExperience() {
    this.timeline.innerHTML = '';
    const fragment = document.createDocumentFragment();
    this.experiences.forEach(item => {
      const tags = (item.highlights || []).map(h => `<li>${h}</li>`).join('');
      const card = createElement(`
        <div class="experience__item glass fade-in">
          <div class="experience__item-header">
            <h3 class="experience__role">${item.role}</h3>
            <span class="experience__company">${item.company}</span>
            <span class="experience__duration">${item.period}</span>
          </div>
          <ul class="experience__highlights">
            ${tags}
          </ul>
        </div>
      `);
      fragment.appendChild(card);
    });
    this.timeline.appendChild(fragment);
  }

  renderEmptyState() {
    this.timeline.innerHTML = `
      <div class="empty-state">
        <p>Experience data not available. Please check data/experience.json</p>
      </div>
    `;
  }
}

// ==========================================================================
// Education Section
// ==========================================================================

class EducationManager {
  constructor() {
    this.timeline = document.querySelector('.education__timeline');
    this.education = [];
    this.init();
  }

  async init() {
    if (!this.timeline) return;
    const eduData = await loadJSON(CONFIG.dataFiles.education);
    if (eduData && Array.isArray(eduData.education)) {
      this.education = eduData.education;
      this.renderEducation();
    } else {
      this.renderEmptyState();
    }
  }

  renderEducation() {
    this.timeline.innerHTML = '';
    const fragment = document.createDocumentFragment();
    this.education.forEach(item => {
      const highlights = (item.highlights || []).map(h => `<li>${h}</li>`).join('');
      const card = createElement(`
        <div class="education__item glass fade-in">
          <div class="education__item-header">
            <h3 class="education__degree">${item.degree}</h3>
            <span class="education__school">${item.school}</span>
            <span class="education__duration">${item.period}</span>
          </div>
          <ul class="education__highlights">
            ${highlights}
          </ul>
        </div>
      `);
      fragment.appendChild(card);
    });
    this.timeline.appendChild(fragment);
  }

  renderEmptyState() {
    this.timeline.innerHTML = `
      <div class="empty-state">
        <p>Education data not available. Please check data/education.json</p>
      </div>
    `;
  }
}

// ==========================================================================
// Contact Form
// ==========================================================================

class ContactForm {
  constructor() {
    this.form = document.querySelector('.contact__form');
    this.inputs = this.form?.querySelectorAll('.form__input, .form__textarea');
    this.submitButton = this.form?.querySelector('button[type="submit"]');
    this.statusElement = this.form?.querySelector('#form-status');
    
    this.init();
  }
  
  init() {
    if (!this.form) return;
    
    this.setupEventListeners();
    this.setupValidation();
  }
  
  setupEventListeners() {
  // Remove custom submit handler for Formspree integration
    
    // Real-time validation
    this.inputs?.forEach(input => {
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('input', () => this.clearFieldError(input));
    });
  }
  
  setupValidation() {
    // Custom validation messages
    this.inputs?.forEach(input => {
      input.addEventListener('invalid', (e) => {
        e.preventDefault();
        this.showFieldError(input, this.getValidationMessage(input));
      });
    });
  }
  
  async handleSubmit(e) {
    e.preventDefault();
    
    if (!this.validateForm()) return;
    
    this.setSubmitState(true);
    
    try {
      // Simulate API call
      await this.simulateSubmit();
      this.showStatus('Message sent successfully! I\'ll get back to you soon.', 'success');
      this.form.reset();
    } catch (error) {
      this.showStatus('Failed to send message. Please try again or contact me directly.', 'error');
    } finally {
      this.setSubmitState(false);
    }
  }
  
  validateForm() {
    let isValid = true;
    
    this.inputs?.forEach(input => {
      if (!this.validateField(input)) {
        isValid = false;
      }
    });
    
    return isValid;
  }
  
  validateField(input) {
    const value = input.value.trim();
    const type = input.type;
    const name = input.name;
    
    // Clear previous errors
    this.clearFieldError(input);
    
    // Required validation
    if (input.hasAttribute('required') && !value) {
      this.showFieldError(input, `${this.getFieldLabel(input)} is required.`);
      return false;
    }
    
    // Email validation
    if (type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        this.showFieldError(input, 'Please enter a valid email address.');
        return false;
      }
    }
    
    // Minimum length validation
    if (name === 'message' && value.length < 10) {
      this.showFieldError(input, 'Message must be at least 10 characters long.');
      return false;
    }
    
    return true;
  }
  
  showFieldError(input, message) {
    const errorElement = input.parentNode.querySelector('.form__error');
    if (errorElement) {
      errorElement.textContent = message;
      input.classList.add('error');
      input.setAttribute('aria-invalid', 'true');
    }
  }
  
  clearFieldError(input) {
    const errorElement = input.parentNode.querySelector('.form__error');
    if (errorElement) {
      errorElement.textContent = '';
      input.classList.remove('error');
      input.removeAttribute('aria-invalid');
    }
  }
  
  getFieldLabel(input) {
    const label = input.parentNode.querySelector('.form__label');
    return label ? label.textContent.replace('*', '').trim() : input.name;
  }
  
  getValidationMessage(input) {
    if (input.validity.valueMissing) {
      return `${this.getFieldLabel(input)} is required.`;
    }
    if (input.validity.typeMismatch) {
      return `Please enter a valid ${input.type}.`;
    }
    if (input.validity.tooShort) {
      return `${this.getFieldLabel(input)} must be at least ${input.minLength} characters.`;
    }
    return 'Please fill out this field correctly.';
  }
  
  setSubmitState(loading) {
    if (loading) {
      this.submitButton?.classList.add('btn--loading');
      this.submitButton?.setAttribute('disabled', 'true');
    } else {
      this.submitButton?.classList.remove('btn--loading');
      this.submitButton?.removeAttribute('disabled');
    }
  }
  
  showStatus(message, type) {
    if (this.statusElement) {
      this.statusElement.textContent = message;
      this.statusElement.className = `form__status form__status--${type} visible`;
      
      setTimeout(() => {
        this.statusElement.classList.remove('visible');
      }, 5000);
    }
  }
  
  async simulateSubmit() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate 90% success rate
        if (Math.random() > 0.1) {
          resolve();
        } else {
          reject(new Error('Network error'));
        }
      }, CONFIG.form.submitDelay);
    });
  }
}

// ==========================================================================
// About Section Manager
// ==========================================================================

class AboutManager {
  constructor() {
    this.progressBars = [];
    this.aboutSection = document.getElementById('about');
    this.aboutSkillsContainer = document.getElementById('about-skills');
    this.animated = false;
    
    this.init();
  }
  
  async init() {
    if (!this.aboutSection) return;
    // Render skills list dynamically if container exists
    if (this.aboutSkillsContainer) {
      await this.renderSkillsFromJSON();
    }
    // Refresh progress bar references after potential render
    this.progressBars = document.querySelectorAll('.about__skills .skill-progress-fill');
    this.setupIntersectionObserver();
  }
  
  setupIntersectionObserver() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !this.animated) {
            this.animateProgressBars();
            this.animated = true;
          }
        });
      },
      { threshold: 0.3 }
    );
    
    observer.observe(this.aboutSection);
  }
  
  animateProgressBars() {
    this.progressBars.forEach((bar, index) => {
      setTimeout(() => {
        const width = bar.dataset.width;
        bar.style.width = `${width}%`;
      }, index * 200);
    });
  }

  async renderSkillsFromJSON() {
    try {
      const skillsData = await loadJSON(CONFIG.dataFiles.skills);
      if (!skillsData || !Array.isArray(skillsData.skills)) return;

      const items = skillsData.skills.map((skill) => this.createSkillProgressItem(skill)).join('');
      this.aboutSkillsContainer.innerHTML = items;
    } catch (e) {
      console.warn('Failed to render About skills from JSON:', e);
    }
  }

  createSkillProgressItem(skill) {
    const name = skill.name || 'Skill';
    const level = Number(skill.level ?? 0);
    const gradient = this.getRandomGradient();

    return `
      <div class="skill-progress-item">
        <div class="skill-progress-header">
          <span class="skill-name">${this.escapeHTML(name)}</span>
          <span class="skill-percentage">${level}%</span>
        </div>
        <div class="skill-progress-bar">
          <div class="skill-progress-fill" data-width="${level}" style="background: ${gradient};"></div>
        </div>
      </div>
    `;
  }

  getFillClass(name, category) {
    const key = (name || '').toLowerCase().replace(/[^a-z0-9]+/g, '');
    const cat = (category || '').toLowerCase();
    const map = {
      react: 'fill--react',
      reactjs: 'fill--react',
      node: 'fill--node',
      nodejs: 'fill--node',
      python: 'fill--python',
      aws: 'fill--aws',
      cloud: 'fill--aws',
      awscloud: 'fill--aws',
      mysql: 'fill--mysql',
      mongodb: 'fill--mongodb'
    };
    if (map[key]) return map[key];
    if (cat.includes('frontend')) return 'fill--react';
    if (cat.includes('backend')) return 'fill--node';
    if (cat.includes('database')) return 'fill--mysql';
    if (cat.includes('cloud')) return 'fill--aws';
    return 'fill--default';
  }

  getRandomGradient() {
    const palette = [
      'linear-gradient(90deg, #00d4ff, #0099cc)',
      'linear-gradient(90deg, #68a063, #4d7c47)',
      'linear-gradient(90deg, #ffd43b, #ff9900)',
      'linear-gradient(90deg, #ff6464, #d7263d)',
      'linear-gradient(90deg, #a855f7, #ec4899)',
      'linear-gradient(90deg, #10b981, #059669)',
      'linear-gradient(90deg, #06b6d4, #3b82f6)',
      'linear-gradient(90deg, #f59e0b, #ef4444)',
      'linear-gradient(90deg, #22c55e, #84cc16)',
      'linear-gradient(90deg, #14b8a6, #06b6d4)'
    ];
    const idx = Math.floor(Math.random() * palette.length);
    return palette[idx];
  }

  escapeHTML(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}

// ==========================================================================
// Scroll to Top
// ==========================================================================

class ScrollToTop {
  constructor() {
    this.button = document.querySelector('.scroll-to-top');
    this.init();
  }
  
  init() {
    if (!this.button) return;
    
    this.setupEventListeners();
    this.handleScroll();
  }
  
  setupEventListeners() {
    window.addEventListener('scroll', throttle(() => this.handleScroll(), 100));
    this.button.addEventListener('click', () => this.scrollToTop());
  }
  
  handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 300) {
      this.button?.classList.add('visible');
    } else {
      this.button?.classList.remove('visible');
    }
  }
  
  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}

// ==========================================================================
// Keyboard Shortcuts
// ==========================================================================

class KeyboardShortcuts {
  constructor() {
    this.init();
  }
  
  init() {
    document.addEventListener('keydown', (e) => this.handleKeyDown(e));
  }
  
  handleKeyDown(e) {
    // Contact shortcut (C key)
    if (e.code === CONFIG.keyboard.contactShortcut && !e.ctrlKey && !e.altKey && !e.metaKey) {
      const activeElement = document.activeElement;
      const isInputFocused = activeElement && (
        activeElement.tagName === 'INPUT' || 
        activeElement.tagName === 'TEXTAREA' || 
        activeElement.contentEditable === 'true'
      );
      
      if (!isInputFocused) {
        e.preventDefault();
        const contactSection = document.getElementById('contact');
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: 'smooth' });
          setTimeout(() => {
            const firstInput = contactSection.querySelector('.form__input');
            firstInput?.focus();
          }, 500);
        }
      }
    }
  }
}

// ==========================================================================
// Performance Monitor
// ==========================================================================

class PerformanceMonitor {
  constructor() {
    this.metrics = {};
    this.init();
  }
  
  init() {
    this.measurePageLoad();
    this.setupPerformanceObserver();
  }
  
  measurePageLoad() {
    window.addEventListener('load', () => {
      const perfData = performance.getEntriesByType('navigation')[0];
      this.metrics.loadTime = perfData.loadEventEnd - perfData.loadEventStart;
      this.metrics.domContentLoaded = perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart;
      
      console.log('Performance Metrics:', this.metrics);
    });
  }
  
  setupPerformanceObserver() {
    if ('PerformanceObserver' in window) {
      // Observe Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          this.metrics.lcp = entry.startTime;
        }
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      
      // Observe First Input Delay
      const fidObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          this.metrics.fid = entry.processingStart - entry.startTime;
        }
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
    }
  }
}

// ==========================================================================
// Main Application
// ==========================================================================

class PortfolioApp {
  constructor() {
    this.components = {};
    this.init();
  }
  
  async init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
    } else {
      this.initializeComponents();
    }
  }
  
  initializeComponents() {
    try {
      // Initialize all components
      this.components.theme = new ThemeManager();
      this.components.navigation = new NavigationManager();
      this.components.animation = new AnimationManager();
      this.components.about = new AboutManager();
      this.components.experience = new ExperienceManager();
      this.components.education = new EducationManager();
      this.components.skills = new SkillsManager();
      this.components.projects = new ProjectsManager();
      this.components.blog = new BlogManager();
      this.components.tabs = new ExpEduTabs();
      this.components.contact = new ContactForm();
      this.components.scrollToTop = new ScrollToTop();
      this.components.keyboard = new KeyboardShortcuts();
      this.components.performance = new PerformanceMonitor();
      
      // Refresh animations after all content is loaded
      setTimeout(() => {
        this.components.animation.refresh();
      }, 1000);
      
      console.log('Portfolio app initialized successfully');
    } catch (error) {
      console.error('Error initializing portfolio app:', error);
    }
  }
}

// Resume Preview Button functionality
document.addEventListener('DOMContentLoaded', function() {
  const previewBtn = document.getElementById('resume-preview-btn');
  if (previewBtn) {
    previewBtn.addEventListener('click', function() {
  window.open('./assets/resume.pdf', '_blank');
    });
  }
});

// Initialize the application
const app = new PortfolioApp();


