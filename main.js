'use strict';

/**
 * Mara Li portfolio index
 * Static-first HTML enhancement with a local fallback and an optional API seam.
 */

const API_ENDPOINT = '';
const API_KEY = '';

const portfolio = {
  profile: {
    name: 'Mara Li',
    role: 'Independent product designer',
    location: 'Glasgow',
    availability: 'Available from September',
    independentSince: '2018',
    email: 'mara@domain.com'
  },
  projects: [
    {
      id: 'cedar',
      title: 'Cedar',
      sector: 'Regional rail ticketing tools',
      year: '2024',
      outcome: 'A clearer route through complex journeys and timetable decisions.',
      role: 'Product direction, interaction design'
    },
    {
      id: 'northline',
      title: 'Northline',
      sector: 'Insurance claims workspace',
      year: '2023',
      outcome: 'A calmer workspace for claims teams moving from intake to resolution.',
      role: 'Research synthesis, systems design'
    },
    {
      id: 'common-ground',
      title: 'Common Ground',
      sector: 'Public-library membership service',
      year: '2022',
      outcome: 'A more legible membership journey for visitors and library teams.',
      role: 'Service design, prototyping'
    }
  ],
  notes: [
    { id: 'queue', title: 'What a queue tells you', date: '04.24' },
    { id: 'handover', title: 'Designing for the handover', date: '11.23' }
  ]
};

const sources = [
  { id: 'project-cedar-role', number: '01', title: 'Cedar', field: 'role' },
  { id: 'project-cedar-outcome', number: '01', title: 'Cedar', field: 'outcome' },
  { id: 'project-northline-role', number: '02', title: 'Northline', field: 'role' },
  { id: 'project-northline-outcome', number: '02', title: 'Northline', field: 'outcome' },
  { id: 'project-common-ground-role', number: '03', title: 'Common Ground', field: 'role' },
  { id: 'project-common-ground-outcome', number: '03', title: 'Common Ground', field: 'outcome' },
  { id: 'profile-statement', number: 'Profile', title: 'Profile', field: 'practice' },
  { id: 'profile-location', number: 'Profile', title: 'Profile', field: 'location' },
  { id: 'profile-availability', number: 'Profile', title: 'Profile', field: 'availability' },
  { id: 'profile-independent', number: 'Profile', title: 'Profile', field: 'experience' },
  { id: 'profile-services', number: 'Profile', title: 'Profile', field: 'services' },
  { id: 'profile-contact', number: 'Profile', title: 'Profile', field: 'contact' },
  { id: 'note-queue', number: 'Note', title: 'What a queue tells you', field: 'note' },
  { id: 'note-handover', number: 'Note', title: 'Designing for the handover', field: 'note' }
];

const sourceById = new Map(sources.map((source) => [source.id, source]));
const appState = {
  theme: 'light',
  chatOpen: false,
  isLoading: false,
  hasAsked: false,
  highlightedSourceId: null,
  lastFocusedElement: null,
  closeTimer: null
};

const root = document.documentElement;
const chat = document.getElementById('portfolio-chat');
const chatScrim = document.getElementById('chat-scrim');
const chatBody = document.getElementById('chat-body');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const chatTranscript = document.getElementById('chat-transcript');
const chatPrompts = document.getElementById('chat-prompts');
const chatStatus = document.getElementById('chat-status');

function getStoredTheme() {
  try {
    const storedTheme = window.localStorage.getItem('mara-theme');
    if (storedTheme === 'light' || storedTheme === 'dark') return storedTheme;
  } catch (error) {
    // Private browsing can block localStorage; system preference remains available.
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme, persist = true) {
  appState.theme = theme;
  root.dataset.theme = theme;

  document.querySelectorAll('[data-theme-option]').forEach((button) => {
    const isSelected = button.dataset.themeOption === theme;
    button.classList.toggle('is-selected', isSelected);
    button.setAttribute('aria-pressed', String(isSelected));
  });

  if (persist) {
    try {
      window.localStorage.setItem('mara-theme', theme);
    } catch (error) {
      // Theme still applies for the current session when storage is unavailable.
    }
  }
}

function bindThemeControls() {
  document.querySelectorAll('[data-theme-option]').forEach((button) => {
    button.addEventListener('click', () => applyTheme(button.dataset.themeOption));
  });

  applyTheme(getStoredTheme(), false);
}

function bindNavigation() {
  const links = [...document.querySelectorAll('[data-nav-target]')];
  const sections = [...document.querySelectorAll('[data-nav-section]')];

  if (!('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver((entries) => {
    const visibleEntry = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visibleEntry) return;
    links.forEach((link) => link.classList.toggle('is-active', link.dataset.navTarget === visibleEntry.target.id));
  }, { rootMargin: '-25% 0px -60% 0px', threshold: [0.01, 0.2, 0.6] });

  sections.forEach((section) => observer.observe(section));
}

function bindImageFallbacks() {
  document.querySelectorAll('.project-artifact img').forEach((image) => {
    image.addEventListener('error', () => {
      const artifact = image.closest('.project-artifact');
      if (artifact) artifact.classList.add('is-broken');
    });
  });
}

function openChat() {
  if (appState.chatOpen) {
    chatInput.focus();
    return;
  }

  window.clearTimeout(appState.closeTimer);
  appState.lastFocusedElement = document.activeElement;
  appState.chatOpen = true;
  document.body.classList.add('chat-is-open');
  chat.hidden = false;
  chatScrim.hidden = false;

  document.querySelectorAll('[data-chat-open]').forEach((button) => {
    button.setAttribute('aria-expanded', 'true');
  });

  window.requestAnimationFrame(() => {
    chat.classList.add('is-open');
    chatInput.focus();
  });
}

function closeChat() {
  if (!appState.chatOpen) return;

  appState.chatOpen = false;
  document.body.classList.remove('chat-is-open');
  chat.classList.remove('is-open');
  chatScrim.hidden = true;

  document.querySelectorAll('[data-chat-open]').forEach((button) => {
    button.setAttribute('aria-expanded', 'false');
  });

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const closeDelay = reducedMotion ? 0 : 200;
  appState.closeTimer = window.setTimeout(() => {
    chat.hidden = true;
    if (appState.lastFocusedElement && typeof appState.lastFocusedElement.focus === 'function') {
      appState.lastFocusedElement.focus();
    }
  }, closeDelay);
}

function bindChatVisibility() {
  document.querySelectorAll('[data-chat-open]').forEach((button) => button.addEventListener('click', openChat));
  document.querySelectorAll('[data-chat-close]').forEach((button) => button.addEventListener('click', closeChat));
  chatScrim.addEventListener('click', closeChat);
}

function normalizeQuery(value) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function citationIds(...ids) {
  return ids.filter((id) => sourceById.has(id));
}

function fallbackAnswer(query) {
  const normalized = normalizeQuery(query);
  const includesAny = (terms) => terms.some((term) => normalized.includes(term));

  if (includesAny(['cedar', 'rail', 'ticketing', 'timetable'])) {
    return {
      answer: 'On Cedar, Mara led product direction and interaction design for regional rail ticketing tools. The work focused on making complex journeys and timetable decisions easier to understand.',
      citations: citationIds('project-cedar-role', 'project-cedar-outcome')
    };
  }

  if (includesAny(['northline', 'insurance', 'claims'])) {
    return {
      answer: 'Northline was an insurance claims workspace. Mara contributed research synthesis and systems design to make the path from intake to resolution calmer for claims teams.',
      citations: citationIds('project-northline-role', 'project-northline-outcome')
    };
  }

  if (includesAny(['common ground', 'library', 'membership'])) {
    return {
      answer: 'Common Ground explored a public-library membership service. Mara worked across service design and prototyping to make the membership journey more legible for visitors and library teams.',
      citations: citationIds('project-common-ground-role', 'project-common-ground-outcome')
    };
  }

  if (includesAny(['available', 'availability', 'when', 'september', 'start', 'book'])) {
    return {
      answer: 'Mara is available from September. For a specific engagement, email her with the context, timing, and who needs to be in the room.',
      citations: citationIds('profile-availability', 'profile-contact')
    };
  }

  if (includesAny(['skill', 'skills', 'service', 'process', 'team', 'teams', 'work with', 'research', 'system', 'direction'])) {
    return {
      answer: 'Mara works across product direction, research synthesis, and interaction systems. She can join short engagements, embedded teams, or advisory work, and stays involved through the detail of delivery.',
      citations: citationIds('profile-services', 'profile-statement')
    };
  }

  if (includesAny(['contact', 'email', 'linkedin', 'reach', 'hire', 'project'])) {
    return {
      answer: 'You can reach Mara at mara@domain.com or through LinkedIn. Include the project context, timing, and who needs to be involved.',
      citations: citationIds('profile-contact')
    };
  }

  return {
    answer: "I can't find that in the portfolio index. Try a project title, or email Mara for a specific answer.",
    citations: []
  };
}

async function requestPortfolioAnswer(query) {
  // In production, set these values through a server-side proxy or build-time configuration.
  // Never expose a provider API key in a public frontend bundle.
  if (API_ENDPOINT && API_KEY) {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        query,
        sources: portfolio
      })
    });

    if (!response.ok) throw new Error('portfolio-index-unavailable');

    const payload = await response.json();
    if (!payload || typeof payload.answer !== 'string') throw new Error('portfolio-index-invalid-response');

    return {
      answer: payload.answer,
      citations: Array.isArray(payload.citations) ? citationIds(...payload.citations) : []
    };
  }

  return fallbackAnswer(query);
}

function scrollChatToEnd() {
  window.requestAnimationFrame(() => {
    chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: 'smooth' });
  });
}

function createMessage(role, text, citations = []) {
  const message = document.createElement('article');
  message.className = `chat-message chat-message--${role}`;

  const roleLabel = document.createElement('p');
  roleLabel.className = 'chat-message-role';
  roleLabel.textContent = role === 'user' ? 'You' : 'Portfolio index';

  const messageText = document.createElement('p');
  messageText.textContent = text;
  message.append(roleLabel, messageText);

  if (citations.length > 0) {
    const citationList = document.createElement('div');
    citationList.className = 'chat-citations';
    citationList.setAttribute('aria-label', 'Sources');

    citations.forEach((sourceId) => {
      const source = sourceById.get(sourceId);
      if (!source) return;

      const citation = document.createElement('a');
      citation.className = 'chat-citation';
      citation.href = `#${source.id}`;
      citation.dataset.sourceTarget = source.id;
      citation.textContent = `${source.number} — ${source.title} / ${source.field}`;
      citationList.appendChild(citation);
    });

    message.appendChild(citationList);
  }

  chatTranscript.appendChild(message);
}

function setChatStatus(text = '', visible = false) {
  chatStatus.textContent = text;
  chatStatus.hidden = !visible;
}

function bindPromptButtons() {
  document.querySelectorAll('[data-prompt]').forEach((button) => {
    button.addEventListener('click', () => {
      chatInput.value = button.dataset.prompt;
      chatInput.focus();
    });
  });
}

async function handleChatSubmit(event) {
  event.preventDefault();
  const query = chatInput.value.trim();
  if (!query || appState.isLoading) return;

  appState.hasAsked = true;
  appState.isLoading = true;
  chatPrompts.hidden = true;
  createMessage('user', query);
  chatInput.value = '';
  setChatStatus('Searching the portfolio index…', true);
  scrollChatToEnd();

  try {
    const result = await requestPortfolioAnswer(query);
    createMessage('assistant', result.answer, result.citations);
  } catch (error) {
    createMessage('assistant', 'The portfolio index is unavailable right now. You can still read the case studies or email Mara.', citationIds('profile-contact'));
  } finally {
    appState.isLoading = false;
    setChatStatus('', false);
    scrollChatToEnd();
  }
}

function highlightSource(sourceId) {
  const matches = [...document.querySelectorAll('[data-source-id]')].filter((element) => element.dataset.sourceId === sourceId);
  if (matches.length === 0) return;

  document.querySelectorAll('.is-highlighted').forEach((element) => element.classList.remove('is-highlighted'));
  const row = matches[0].closest('.project-row, .note-row, .contact-closure');
  const highlightTargets = row ? [row, matches[0]] : [matches[0]];
  highlightTargets.forEach((element) => element.classList.add('is-highlighted'));
  appState.highlightedSourceId = sourceId;

  const target = row || matches[0];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'center' });

  window.setTimeout(() => {
    highlightTargets.forEach((element) => element.classList.remove('is-highlighted'));
    if (appState.highlightedSourceId === sourceId) appState.highlightedSourceId = null;
  }, 1800);
}

function bindSourceCitations() {
  document.addEventListener('click', (event) => {
    const citation = event.target.closest('[data-source-target]');
    if (!citation) return;
    event.preventDefault();
    const sourceId = citation.dataset.sourceTarget;
    closeChat();
    window.setTimeout(() => highlightSource(sourceId), 210);
  });
}

function getFocusableElements() {
  return [...chat.querySelectorAll('button:not([disabled]), a[href], input:not([disabled])')]
    .filter((element) => !element.closest('[hidden]'));
}

function bindKeyboardShortcuts() {
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && appState.chatOpen) {
      event.preventDefault();
      closeChat();
      return;
    }

    if (event.key === '/' && appState.chatOpen && document.activeElement !== chatInput) {
      event.preventDefault();
      chatInput.focus();
      return;
    }

    if (event.key !== 'Tab' || !appState.chatOpen) return;
    const focusable = getFocusableElements();
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
}

function init() {
  bindThemeControls();
  bindNavigation();
  bindImageFallbacks();
  bindChatVisibility();
  bindPromptButtons();
  bindSourceCitations();
  bindKeyboardShortcuts();
  chatForm.addEventListener('submit', handleChatSubmit);
}

init();
