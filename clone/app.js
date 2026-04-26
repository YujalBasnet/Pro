document.title = 'StreamFlix | Netflix Clone';

const movies = [
  {
    id: 'night-protocol',
    title: 'Night Protocol',
    badge: 'Featured',
    score: 98,
    mood: 'Pulse-pounding',
    type: 'Series',
    year: 2026,
    runtime: '8 episodes',
    rating: 'TV-MA',
    genres: ['Sci-Fi', 'Thriller', 'Mystery'],
    summary: 'A systems analyst finds the nightly security feed predicting crimes hours before they happen, and the city wants the evidence erased.',
    tagline: 'The future is watching back.',
    trending: true,
    featured: true,
    colors: ['#0f1028', '#4338ca', '#14b8a6']
  },
  {
    id: 'velvet-city',
    title: 'Velvet City',
    badge: 'Top 10',
    score: 96,
    mood: 'Sharp and stylish',
    type: 'Film',
    year: 2025,
    runtime: '2h 06m',
    rating: 'R',
    genres: ['Crime', 'Drama', 'Thriller'],
    summary: 'A night courier gets pulled into a cleaner network where every favor is a debt and every debt is a crime scene.',
    tagline: 'Some cities are built on secrets.',
    trending: true,
    featured: false,
    colors: ['#190b1d', '#7c2d12', '#f43f5e']
  },
  {
    id: 'solar-hearts',
    title: 'Solar Hearts',
    badge: 'New',
    score: 94,
    mood: 'Lush and hopeful',
    type: 'Series',
    year: 2026,
    runtime: '10 episodes',
    rating: 'TV-14',
    genres: ['Romance', 'Drama', 'Sci-Fi'],
    summary: 'Two orbital engineers fall in love while rebuilding a station that keeps drifting toward a hidden blackout zone.',
    tagline: 'Love does not obey gravity.',
    trending: false,
    featured: false,
    colors: ['#2b1055', '#ec4899', '#f59e0b']
  },
  {
    id: 'paper-thunder',
    title: 'Paper Thunder',
    badge: 'Action',
    score: 95,
    mood: 'Fast and loud',
    type: 'Film',
    year: 2024,
    runtime: '1h 58m',
    rating: 'PG-13',
    genres: ['Action', 'Adventure', 'Thriller'],
    summary: 'A parkour smuggler races across a floodlit megacity to deliver a file that can collapse a private army.',
    tagline: 'Run faster than the fallout.',
    trending: true,
    featured: false,
    colors: ['#0f172a', '#ef4444', '#f97316']
  },
  {
    id: 'hollow-harbor',
    title: 'Hollow Harbor',
    badge: 'Mystery',
    score: 93,
    mood: 'Moody and eerie',
    type: 'Series',
    year: 2025,
    runtime: '6 episodes',
    rating: 'TV-MA',
    genres: ['Mystery', 'Drama', 'Horror'],
    summary: 'A coastal town loses one hour every night, and the people who remember it start finding bodies where the tide should be.',
    tagline: 'The water keeps the secret.',
    trending: true,
    featured: false,
    colors: ['#0f172a', '#334155', '#22c55e']
  },
  {
    id: 'golden-hour-lane',
    title: 'Golden Hour Lane',
    badge: 'Feel Good',
    score: 91,
    mood: 'Warm and breezy',
    type: 'Film',
    year: 2024,
    runtime: '1h 44m',
    rating: 'PG',
    genres: ['Comedy', 'Romance', 'Family'],
    summary: 'A burnt-out wedding photographer and a bakery owner collide while trying to save a neighborhood block party.',
    tagline: 'Small moments. Big chemistry.',
    trending: false,
    featured: false,
    colors: ['#78350f', '#f59e0b', '#fb7185']
  },
  {
    id: 'iron-coast',
    title: 'Iron Coast',
    badge: 'Limited Series',
    score: 97,
    mood: 'Hard-edged',
    type: 'Series',
    year: 2025,
    runtime: '7 episodes',
    rating: 'TV-MA',
    genres: ['Action', 'Crime', 'Thriller'],
    summary: 'A former shipyard investigator returns to the waterfront after a weapons ring turns the docks into a battlefield.',
    tagline: 'The harbor never forgets.',
    trending: true,
    featured: false,
    colors: ['#111827', '#dc2626', '#2563eb']
  },
  {
    id: 'tiny-titans-club',
    title: 'Tiny Titans Club',
    badge: 'Family',
    score: 90,
    mood: 'Playful and bright',
    type: 'Film',
    year: 2024,
    runtime: '1h 37m',
    rating: 'G',
    genres: ['Family', 'Animation', 'Adventure'],
    summary: 'A group of kids and a very nervous robot build a neighborhood rescue squad before the summer fair begins.',
    tagline: 'Small heroes. Huge fun.',
    trending: false,
    featured: false,
    colors: ['#1d4ed8', '#06b6d4', '#facc15']
  },
  {
    id: 'parallel-hearts',
    title: 'Parallel Hearts',
    badge: 'Romance',
    score: 92,
    mood: 'Tender and strange',
    type: 'Film',
    year: 2025,
    runtime: '2h 01m',
    rating: 'PG-13',
    genres: ['Sci-Fi', 'Romance', 'Drama'],
    summary: 'Two versions of the same musician keep meeting in different timelines and leave notes for each other in the margins of reality.',
    tagline: 'Some love stories echo.',
    trending: false,
    featured: false,
    colors: ['#1e1b4b', '#8b5cf6', '#f472b6']
  },
  {
    id: 'static-bloom',
    title: 'Static Bloom',
    badge: 'Doc',
    score: 89,
    mood: 'Thoughtful',
    type: 'Documentary',
    year: 2024,
    runtime: '1h 18m',
    rating: 'PG',
    genres: ['Documentary', 'History', 'Drama'],
    summary: 'A broadcast engineer traces the rise and fall of a forgotten station that quietly shaped an entire generation.',
    tagline: 'Signals can outlive empires.',
    trending: false,
    featured: false,
    colors: ['#0f172a', '#475569', '#22c55e']
  },
  {
    id: 'midnight-arcade',
    title: 'Midnight Arcade',
    badge: 'Comedy',
    score: 93,
    mood: 'Quick and clever',
    type: 'Series',
    year: 2025,
    runtime: '9 episodes',
    rating: 'TV-14',
    genres: ['Comedy', 'Adventure', 'Sci-Fi'],
    summary: 'A repair crew discovers a secret arcade that keeps turning random customers into accidental heroes.',
    tagline: 'Every game has a second level.',
    trending: true,
    featured: false,
    colors: ['#111827', '#06b6d4', '#f97316']
  },
  {
    id: 'ghost-district',
    title: 'Ghost District',
    badge: 'Dark',
    score: 95,
    mood: 'Chilling',
    type: 'Film',
    year: 2025,
    runtime: '1h 49m',
    rating: 'R',
    genres: ['Horror', 'Mystery', 'Thriller'],
    summary: 'A developer inherits a condemned block where every apartment records the final minutes of its last resident.',
    tagline: 'The walls are still listening.',
    trending: true,
    featured: false,
    colors: ['#09090b', '#312e81', '#4f46e5']
  },
  {
    id: 'last-signal',
    title: 'Last Signal',
    badge: 'Tech Thriller',
    score: 97,
    mood: 'Suspenseful',
    type: 'Series',
    year: 2026,
    runtime: '8 episodes',
    rating: 'TV-MA',
    genres: ['Sci-Fi', 'Mystery', 'Action'],
    summary: 'A satellite operator follows a repeating distress call that seems to come from tomorrow instead of deep space.',
    tagline: 'The message arrives before the sender.',
    trending: true,
    featured: false,
    colors: ['#020617', '#2563eb', '#14b8a6']
  },
  {
    id: 'blue-harbor',
    title: 'Blue Harbor',
    badge: 'Drama',
    score: 90,
    mood: 'Reflective',
    type: 'Film',
    year: 2024,
    runtime: '2h 03m',
    rating: 'PG-13',
    genres: ['Drama', 'Family', 'Romance'],
    summary: 'A retired sailor returns home to rebuild the harbor diner that once held his entire family together.',
    tagline: 'Home is a place you rebuild.',
    trending: false,
    featured: false,
    colors: ['#0f172a', '#2563eb', '#0ea5e9']
  },
  {
    id: 'canvas-of-wolves',
    title: 'Canvas of Wolves',
    badge: 'Fantasy',
    score: 94,
    mood: 'Mythic',
    type: 'Film',
    year: 2025,
    runtime: '2h 08m',
    rating: 'PG-13',
    genres: ['Fantasy', 'Adventure', 'Drama'],
    summary: 'A painter follows a pack of wolves into a hidden valley where every mural changes the shape of the sky.',
    tagline: 'The legend is unfinished.',
    trending: false,
    featured: false,
    colors: ['#111827', '#7c3aed', '#22c55e']
  },
  {
    id: 'afterglow-run',
    title: 'Afterglow Run',
    badge: 'Thriller',
    score: 96,
    mood: 'Relentless',
    type: 'Film',
    year: 2026,
    runtime: '1h 52m',
    rating: 'R',
    genres: ['Crime', 'Action', 'Thriller'],
    summary: 'A getaway driver and a whistleblower race through the city after a contract job collapses into a manhunt.',
    tagline: 'Outrun the night.',
    trending: true,
    featured: false,
    colors: ['#111827', '#f43f5e', '#f59e0b']
  }
];

movies.forEach(movie => {
  movie.poster = `https://picsum.photos/seed/${movie.id}-poster/600/900`;
  movie.backdrop = `https://picsum.photos/seed/${movie.id}-backdrop/1280/720`;
  movie.trailerQuery = `${movie.title} official trailer`;
});

const railDefinitions = [
  {
    title: 'All Matches',
    subtitle: 'Everything that fits your current filter.',
    filter: () => true
  },
  {
    title: 'Trending Now',
    subtitle: 'The buzziest titles on the shelf.',
    filter: movie => movie.trending
  },
  {
    title: 'Sci-Fi Futures',
    subtitle: 'Signals, systems, and strange worlds.',
    filter: movie => movie.genres.includes('Sci-Fi')
  },
  {
    title: 'Crime & Mystery',
    subtitle: 'Locked rooms, sharp turns, and hidden motives.',
    filter: movie => movie.genres.some(genre => ['Crime', 'Mystery', 'Thriller', 'Horror'].includes(genre))
  },
  {
    title: 'Feel-Good Watchlist',
    subtitle: 'Warm stories with easy replay value.',
    filter: movie => movie.genres.some(genre => ['Comedy', 'Romance', 'Family'].includes(genre))
  },
  {
    title: 'Animated & Fantasy',
    subtitle: 'Worlds that lean bright and strange.',
    filter: movie => movie.genres.some(genre => ['Animation', 'Fantasy', 'Adventure'].includes(genre))
  },
  {
    title: 'Docs & Real Stories',
    subtitle: 'True stories with sharper edges.',
    filter: movie => movie.genres.includes('Documentary')
  },
  {
    title: 'High-Voltage Action',
    subtitle: 'Fast cuts, big stakes, and late-night momentum.',
    filter: movie => movie.genres.some(genre => ['Action', 'Thriller'].includes(genre))
  }
];

const genreOrder = [
  'All',
  'Action',
  'Adventure',
  'Animation',
  'Comedy',
  'Crime',
  'Documentary',
  'Drama',
  'Family',
  'Fantasy',
  'History',
  'Horror',
  'Mystery',
  'Romance',
  'Sci-Fi',
  'Thriller'
];

const elements = {
  topbar: document.querySelector('.topbar'),
  menuButton: document.querySelector('.topbar__menu'),
  navLinks: Array.from(document.querySelectorAll('.nav__link')),
  searchInput: document.getElementById('searchInput'),
  genreFilters: document.getElementById('genreFilters'),
  railList: document.getElementById('railList'),
  resultsCount: document.getElementById('resultsCount'),
  heroSection: document.querySelector('.hero'),
  heroTitle: document.getElementById('heroTitle'),
  heroSummary: document.getElementById('heroSummary'),
  heroMeta: document.getElementById('heroMeta'),
  heroStats: document.getElementById('heroStats'),
  heroPoster: document.getElementById('heroPoster'),
  heroPosterImage: document.getElementById('heroPosterImage'),
  heroKicker: document.getElementById('heroKicker'),
  heroPosterTitle: document.getElementById('heroPosterTitle'),
  heroPosterTag: document.getElementById('heroPosterTag'),
  heroPlay: document.getElementById('heroPlay'),
  heroList: document.getElementById('heroList'),
  heroSpotlight: document.getElementById('heroSpotlight'),
  trailerModal: document.getElementById('trailerModal'),
  trailerDialog: document.getElementById('trailerDialog'),
  trailerFrame: document.getElementById('trailerFrame'),
  trailerTitle: document.getElementById('trailerTitle'),
  trailerClose: document.getElementById('trailerClose')
};

const STORAGE_KEY = 'streamflix.my-list';
const movieById = new Map(movies.map(movie => [movie.id, movie]));
const defaultHero = movies.find(movie => movie.featured) ?? movies[0];
const state = {
  query: '',
  genre: 'All',
  heroId: defaultHero.id,
  myList: new Set(readSavedList())
};

elements.searchInput.value = '';

function readSavedList() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(movieId => movieById.has(movieId));
  } catch {
    return [];
  }
}

function saveList() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...state.myList]));
  } catch {
    // Ignore storage failures in restricted browser contexts.
  }
}

function createPill(text, className = 'pill') {
  const pill = document.createElement('span');
  pill.className = className;
  pill.textContent = text;
  return pill;
}

function buildPills(values, className = 'pill') {
  return values.filter(Boolean).map(value => createPill(String(value), className));
}

function compareMovies(a, b) {
  return b.score - a.score || a.title.localeCompare(b.title);
}

function setPalette(element, colors, prefix) {
  if (!element || !Array.isArray(colors) || colors.length === 0) {
    return;
  }

  const [first, second, third] = colors;
  element.style.setProperty(`--${prefix}-a`, first);
  element.style.setProperty(`--${prefix}-b`, second);
  element.style.setProperty(`--${prefix}-c`, third ?? second);
}

function matchesFilters(movie) {
  const trimmedQuery = state.query.trim().toLowerCase();
  const matchesGenre = state.genre === 'All' || movie.genres.includes(state.genre);

  if (!matchesGenre) {
    return false;
  }

  if (!trimmedQuery) {
    return true;
  }

  const haystack = [
    movie.title,
    movie.summary,
    movie.tagline,
    movie.mood,
    movie.type,
    movie.rating,
    movie.runtime,
    movie.year,
    movie.genres.join(' ')
  ]
    .join(' ')
    .toLowerCase();

  return haystack.includes(trimmedQuery);
}

function getHeroMovie() {
  return movieById.get(state.heroId) ?? defaultHero;
}

function setHero(movieId, options = {}) {
  const { scrollToHero = true } = options;

  state.heroId = movieId;
  render();

  if (scrollToHero) {
    document.getElementById('home').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function buildTrailerEmbedUrl(movie) {
  if (!movie) {
    return '';
  }

  if (movie.trailerUrl) {
    return movie.trailerUrl;
  }

  const searchTerm = encodeURIComponent(movie.trailerQuery ?? `${movie.title} official trailer`);
  return `https://www.youtube.com/embed?autoplay=1&rel=0&modestbranding=1&playsinline=1&listType=search&list=${searchTerm}`;
}

function isTrailerOpen() {
  return Boolean(elements.trailerModal) && !elements.trailerModal.hidden;
}

function openTrailer(movieId) {
  const movie = movieById.get(movieId);

  if (!movie || !elements.trailerModal || !elements.trailerFrame || !elements.trailerTitle) {
    return;
  }

  elements.trailerTitle.textContent = `${movie.title} - Trailer`;
  elements.trailerFrame.src = buildTrailerEmbedUrl(movie);
  elements.trailerModal.hidden = false;
  elements.trailerModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('is-modal-open');
}

function closeTrailer() {
  if (!elements.trailerModal || !elements.trailerFrame) {
    return;
  }

  elements.trailerModal.hidden = true;
  elements.trailerModal.setAttribute('aria-hidden', 'true');
  elements.trailerFrame.src = '';
  document.body.classList.remove('is-modal-open');
}

function toggleList(movieId) {
  if (state.myList.has(movieId)) {
    state.myList.delete(movieId);
  } else {
    state.myList.add(movieId);
  }

  saveList();
  render();
}

function resetFilters() {
  state.query = '';
  state.genre = 'All';
  elements.searchInput.value = '';
  render();
  elements.searchInput.focus();
}

function setMenuOpen(isOpen) {
  elements.topbar.classList.toggle('is-open', isOpen);
  elements.menuButton.setAttribute('aria-expanded', String(isOpen));
  elements.menuButton.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
}

function syncTopbarScrollState() {
  elements.topbar.classList.toggle('is-scrolled', window.scrollY > 18);
}

function renderGenres() {
  elements.genreFilters.replaceChildren();

  const availableGenres = genreOrder.filter(genre => genre === 'All' || movies.some(movie => movie.genres.includes(genre)));

  availableGenres.forEach(genre => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'chip';
    button.textContent = genre;
    button.setAttribute('aria-pressed', String(state.genre === genre));

    if (state.genre === genre) {
      button.classList.add('is-active');
    }

    button.addEventListener('click', () => {
      state.genre = genre;
      render();
    });

    elements.genreFilters.appendChild(button);
  });
}

function renderHero() {
  const hero = getHeroMovie();
  const saved = state.myList.has(hero.id);

  elements.heroTitle.textContent = hero.title;
  elements.heroSummary.textContent = hero.summary;
  elements.heroKicker.textContent = hero.badge;
  elements.heroPosterTitle.textContent = hero.title;
  elements.heroPosterTag.textContent = hero.tagline;
  setPalette(elements.heroPoster, hero.colors, 'hero');
  setPalette(elements.heroSection, hero.colors, 'hero-bg');

  if (elements.heroPosterImage) {
    elements.heroPosterImage.src = hero.poster;
    elements.heroPosterImage.alt = `${hero.title} poster`;
  }

  elements.heroMeta.replaceChildren(...buildPills([hero.type, hero.year, hero.rating, hero.runtime]));
  elements.heroStats.replaceChildren(
    ...buildPills([
      `${hero.score}% Match`,
      hero.mood,
      hero.trending ? 'Trending now' : 'Curated pick',
      saved ? 'Saved to My List' : 'Ready to save'
    ])
  );

  elements.heroList.textContent = saved ? 'Remove from My List' : 'My List';
  elements.heroList.classList.toggle('is-saved', saved);
}

function renderSpotlight() {
  const hero = getHeroMovie();
  const relatedGenres = new Set(hero.genres);
  const related = movies
    .filter(movie => movie.id !== hero.id && movie.genres.some(genre => relatedGenres.has(genre)))
    .sort(compareMovies);
  const fallback = movies.filter(movie => movie.id !== hero.id).sort(compareMovies);
  const spotlightMovies = [];
  const seen = new Set();

  [...related, ...fallback].forEach(movie => {
    if (spotlightMovies.length >= 3) {
      return;
    }

    if (seen.has(movie.id)) {
      return;
    }

    seen.add(movie.id);
    spotlightMovies.push(movie);
  });

  elements.heroSpotlight.replaceChildren();

  spotlightMovies.forEach(movie => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'spotlight-card';
    button.setAttribute('aria-label', `Play ${movie.title} trailer`);
    button.addEventListener('click', () => {
      setHero(movie.id, { scrollToHero: false });
      openTrailer(movie.id);
    });

    const art = document.createElement('span');
    art.className = 'spotlight-card__art';
    setPalette(art, movie.colors, 'card');

    const poster = document.createElement('img');
    poster.className = 'spotlight-card__image';
    poster.src = movie.poster;
    poster.alt = `${movie.title} poster`;
    poster.loading = 'lazy';
    poster.decoding = 'async';
    art.appendChild(poster);

    const copy = document.createElement('span');
    copy.className = 'spotlight-card__copy';

    const title = document.createElement('strong');
    title.textContent = movie.title;

    const meta = document.createElement('span');
    meta.textContent = `${movie.type} / ${movie.year}`;

    const genres = document.createElement('span');
    genres.textContent = movie.genres.slice(0, 2).join(' / ');

    copy.append(title, meta, genres);
    button.append(art, copy);
    elements.heroSpotlight.appendChild(button);
  });
}

function createTitleCard(movie) {
  const card = document.createElement('button');
  card.type = 'button';
  card.className = 'title-card';
  card.setAttribute('aria-label', `Play ${movie.title} trailer`);

  if (movie.id === state.heroId) {
    card.classList.add('is-active');
  }

  card.addEventListener('click', () => {
    setHero(movie.id, { scrollToHero: false });
    openTrailer(movie.id);
  });

  const art = document.createElement('div');
  art.className = 'title-card__art';
  setPalette(art, movie.colors, 'card');

  const poster = document.createElement('img');
  poster.className = 'title-card__image';
  poster.src = movie.poster;
  poster.alt = `${movie.title} poster`;
  poster.loading = 'lazy';
  poster.decoding = 'async';

  const badge = document.createElement('span');
  badge.className = 'title-card__label';
  badge.textContent = movie.badge;

  const saved = document.createElement('span');
  saved.className = 'title-card__saved';
  saved.textContent = state.myList.has(movie.id) ? 'Saved' : `${movie.score}% Match`;

  art.append(poster, badge, saved);

  const body = document.createElement('div');
  body.className = 'title-card__body';

  const meta = document.createElement('div');
  meta.className = 'title-card__meta';
  meta.append(...buildPills([movie.type, movie.year, movie.runtime], 'pill'));

  const title = document.createElement('h3');
  title.className = 'title-card__title';
  title.textContent = movie.title;

  const genres = document.createElement('div');
  genres.className = 'title-card__genres';
  genres.append(...movie.genres.slice(0, 3).map(genre => createPill(genre, 'genre-pill')));

  body.append(meta, title, genres);
  card.append(art, body);

  return card;
}

function renderRails(filteredMovies) {
  const visibleRails = railDefinitions
    .map(rail => ({
      ...rail,
      items: filteredMovies.filter(rail.filter).sort(compareMovies)
    }))
    .filter(rail => rail.items.length > 0);

  elements.railList.replaceChildren();

  if (!filteredMovies.length) {
    const empty = document.createElement('section');
    empty.className = 'empty-state';

    const title = document.createElement('h3');
    title.className = 'empty-state__title';
    title.textContent = 'No titles match this filter.';

    const copy = document.createElement('p');
    copy.textContent = 'Try clearing the search, choosing a broader genre, or returning to all titles.';

    const actions = document.createElement('div');
    actions.className = 'empty-state__actions';

    const resetButton = document.createElement('button');
    resetButton.type = 'button';
    resetButton.className = 'btn btn--primary';
    resetButton.textContent = 'Reset filters';
    resetButton.addEventListener('click', resetFilters);

    actions.append(resetButton);
    empty.append(title, copy, actions);
    elements.railList.appendChild(empty);
    return 0;
  }

  visibleRails.forEach(rail => {
    const section = document.createElement('section');
    section.className = 'rail';

    const head = document.createElement('div');
    head.className = 'rail__head';

    const titleWrap = document.createElement('div');

    const title = document.createElement('h3');
    title.className = 'rail__title';
    title.textContent = rail.title;

    const subtitle = document.createElement('p');
    subtitle.className = 'rail__subtitle';
    subtitle.textContent = rail.subtitle;

    titleWrap.append(title, subtitle);
    head.append(titleWrap);

    const track = document.createElement('div');
    track.className = 'rail__track';

    rail.items.slice(0, 10).forEach(movie => {
      track.appendChild(createTitleCard(movie));
    });

    section.append(head, track);
    elements.railList.appendChild(section);
  });

  return visibleRails.length;
}

function renderResultsCount(filteredMovies, railCount) {
  const trimmedQuery = state.query.trim();
  const genreNote = state.genre === 'All' ? '' : ` in ${state.genre}`;
  const railNote = railCount === 1 ? 'rail' : 'rails';

  if (!filteredMovies.length) {
    elements.resultsCount.textContent = `No titles match${trimmedQuery ? ` "${trimmedQuery}"` : ''}${genreNote}.`;
    return;
  }

  elements.resultsCount.textContent = `${filteredMovies.length} title${filteredMovies.length === 1 ? '' : 's'} across ${railCount} ${railNote}${trimmedQuery ? ` for "${trimmedQuery}"` : ''}${genreNote}.`;
}

function render() {
  const filteredMovies = movies.filter(matchesFilters);
  renderGenres();
  renderHero();
  renderSpotlight();
  const railCount = renderRails(filteredMovies);
  renderResultsCount(filteredMovies, railCount);
}

elements.searchInput.addEventListener('input', event => {
  state.query = event.target.value;
  render();
});

elements.searchInput.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    event.preventDefault();
    state.query = '';
    elements.searchInput.value = '';
    render();
  }
});

elements.heroPlay.addEventListener('click', () => {
  openTrailer(getHeroMovie().id);
});

elements.heroPoster.setAttribute('role', 'button');
elements.heroPoster.setAttribute('tabindex', '0');
elements.heroPoster.setAttribute('aria-label', 'Play featured trailer');

elements.heroPoster.addEventListener('click', () => {
  openTrailer(getHeroMovie().id);
});

elements.heroPoster.addEventListener('keydown', event => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    openTrailer(getHeroMovie().id);
  }
});

elements.heroList.addEventListener('click', () => {
  toggleList(getHeroMovie().id);
});

elements.menuButton.addEventListener('click', () => {
  setMenuOpen(!elements.topbar.classList.contains('is-open'));
});

elements.navLinks.forEach(link => {
  link.addEventListener('click', () => {
    elements.navLinks.forEach(navLink => navLink.classList.remove('is-active'));
    link.classList.add('is-active');
    setMenuOpen(false);
  });
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 980) {
    setMenuOpen(false);
  }
});

window.addEventListener('scroll', syncTopbarScrollState, { passive: true });

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    if (isTrailerOpen()) {
      closeTrailer();
      return;
    }

    setMenuOpen(false);
  }
});

elements.trailerClose.addEventListener('click', closeTrailer);

elements.trailerModal.addEventListener('click', event => {
  if (event.target === elements.trailerModal) {
    closeTrailer();
  }
});

syncTopbarScrollState();
render();
