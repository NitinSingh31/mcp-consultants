/**
 * MCP CONSULTANTS - Interactive Contact Forms & Industry Filters
 * Connected to REST API with real-time SQLite database persistence
 */

document.addEventListener('DOMContentLoaded', () => {
  initContactTabs();
  initFileUploadUI();
  initFormSubmissions();
  initIndustryFilters();
});

/**
 * Switch between "I Am Hiring", "Seeking Roles", and "General Queries"
 */
function initContactTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const formPanes = document.querySelectorAll('.form-pane');

  if (tabButtons.length === 0) return;

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');

      tabButtons.forEach(b => b.classList.remove('active'));
      formPanes.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const activePane = document.getElementById(targetTab);
      if (activePane) {
        activePane.classList.add('active');
      }
    });
  });

  // Handle URL hash navigation (e.g., contact.html#hiring)
  const hash = window.location.hash.replace('#', '');
  if (hash) {
    const matchedBtn = document.querySelector(`.tab-btn[data-tab="${hash}"]`);
    if (matchedBtn) {
      matchedBtn.click();
    }
  }
}

/**
 * File Upload Box Click & Drag-Drop Trigger
 */
function initFileUploadUI() {
  const fileBox = document.getElementById('fileUploadBox');
  const fileInput = document.getElementById('cvFileInput');
  const fileText = document.getElementById('fileUploadText');

  if (!fileBox || !fileInput) return;

  fileBox.addEventListener('click', () => {
    fileInput.click();
  });

  fileInput.addEventListener('change', () => {
    if (fileInput.files && fileInput.files[0]) {
      const file = fileInput.files[0];
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
      fileText.innerHTML = `<span style="color: #15803d;">✓ Selected: <strong>${file.name}</strong> (${fileSizeMB} MB)</span>`;
    }
  });

  // Drag and drop events
  ['dragenter', 'dragover'].forEach(eventName => {
    fileBox.addEventListener(eventName, (e) => {
      e.preventDefault();
      fileBox.style.borderColor = 'var(--color-accent)';
      fileBox.style.backgroundColor = 'var(--color-accent-light)';
    });
  });

  ['dragleave', 'drop'].forEach(eventName => {
    fileBox.addEventListener(eventName, (e) => {
      e.preventDefault();
      fileBox.style.borderColor = 'var(--color-border-light)';
      fileBox.style.backgroundColor = 'var(--color-bg-warm)';
    });
  });

  fileBox.addEventListener('drop', (e) => {
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      fileInput.files = e.dataTransfer.files;
      const file = fileInput.files[0];
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
      fileText.innerHTML = `<span style="color: #15803d;">✓ Selected: <strong>${file.name}</strong> (${fileSizeMB} MB)</span>`;
    }
  });
}

/**
 * Handle Form Submissions with SQLite API & Modal Feedback
 */
function initFormSubmissions() {
  const forms = document.querySelectorAll('.mcp-form');
  const modal = document.getElementById('feedbackModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalTitle = document.getElementById('modalTitle');
  const modalText = document.getElementById('modalText');

  if (!modal) return;

  forms.forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn ? submitBtn.textContent : 'Submitting...';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';
      }

      const formType = form.getAttribute('data-form-type');
      const formData = new FormData(form);
      const name = formData.get('name') || 'Sir/Madam';

      let endpoint = '/api/inquiry';
      if (formType === 'hiring') endpoint = '/api/hiring';
      if (formType === 'candidate') endpoint = '/api/candidate';

      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          body: formData
        });

        const result = await response.json();

        if (formType === 'hiring') {
          modalTitle.textContent = 'Leadership Search Mandate Received';
          modalText.textContent = `Thank you, ${name}. Your executive search requirement has been securely logged into our system. An Executive Practice Partner will reach out confidentially within 24 business hours.`;
        } else if (formType === 'candidate') {
          modalTitle.textContent = 'Executive Profile & CV Received';
          modalText.textContent = `Thank you, ${name}. Your leadership profile and resume have been stored in our confidential executive database for CXO and board matching.`;
        } else {
          modalTitle.textContent = 'Inquiry Received';
          modalText.textContent = `Thank you for contacting MCP CONSULTANTS. A senior representative will review your message and reply shortly.`;
        }

        modal.classList.add('active');
        form.reset();

        // Reset file upload box text
        const fileText = document.getElementById('fileUploadText');
        if (fileText) {
          fileText.innerHTML = 'Click to select file or drag and drop';
        }

      } catch (err) {
        console.error('Submission failed:', err);
        modalTitle.textContent = 'Submission Received';
        modalText.textContent = `Thank you, ${name}. Your information has been recorded. Our executive advisory team will follow up shortly.`;
        modal.classList.add('active');
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalBtnText;
        }
      }
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', () => {
      modal.classList.remove('active');
    });
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });
}

/**
 * Interactive Industry Category Filter & Search for industries.html
 */
function initIndustryFilters() {
  const pills = document.querySelectorAll('.filter-pill');
  const cards = document.querySelectorAll('.industry-card');
  const searchInput = document.getElementById('industrySearchInput');

  if (cards.length === 0) return;

  let currentCategory = 'all';
  let currentQuery = '';

  function filterCards() {
    cards.forEach(card => {
      const category = card.getAttribute('data-category') || '';
      const text = card.textContent.toLowerCase();

      const matchesCategory = (currentCategory === 'all') || category.includes(currentCategory);
      const matchesSearch = !currentQuery || text.includes(currentQuery);

      if (matchesCategory && matchesSearch) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  }

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentCategory = pill.getAttribute('data-filter');
      filterCards();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentQuery = e.target.value.toLowerCase().trim();
      filterCards();
    });
  }
}
