document.title = "Streamflix";

const TMDB_API_KEY = "";
const TMDB_BASE = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/";

const HERO_ROTATE_MS = 12000;
const SEARCH_DEBOUNCE_MS = 300;
const MOCK_TOTAL_TITLES = 280;
const TODAY = new Date().toISOString().slice(0, 10);

const rowDefinitions = [
  {
    id: "top-tv",
    title: "Top 10 TV Shows Today",
    endpoint: "/trending/tv/week",
    mediaType: "tv",
    limit: 10,
    rank: true
  },
  {
    id: "top-movies",
    title: "Top 10 Movies Today",
    endpoint: "/trending/movie/week",
    mediaType: "movie",
    limit: 10,
    rank: true
  },
  {
    id: "trending",
    title: "Trending Now",
    endpoint: "/trending/all/week",
    mediaType: "all",
    limit: 24
  },
  {
    id: "popular-movies",
    title: "Popular Movies",
    endpoint: "/movie/popular",
    mediaType: "movie",
    limit: 24
  },
  {
    id: "popular-tv",
    title: "Popular TV Shows",
    endpoint: "/tv/popular",
    mediaType: "tv",
    limit: 24
  },
  {
    id: "new-releases",
    title: "New Releases",
    endpoint: "/discover/movie",
    mediaType: "movie",
    params: {
      sort_by: "release_date.desc",
      "release_date.lte": TODAY
    },
    limit: 24
  },
  {
    id: "action",
    title: "Action Thrillers",
    endpoint: "/discover/movie",
    mediaType: "movie",
    params: {
      with_genres: "28,53"
    },
    limit: 24
  },
  {
    id: "sci-fi",
    title: "Sci-Fi and Fantasy",
    endpoint: "/discover/movie",
    mediaType: "movie",
    params: {
      with_genres: "878,14"
    },
    limit: 24
  },
  {
    id: "comedies",
    title: "Comedies",
    endpoint: "/discover/movie",
    mediaType: "movie",
    params: {
      with_genres: "35"
    },
    limit: 24
  },
  {
    id: "romance",
    title: "Romance",
    endpoint: "/discover/movie",
    mediaType: "movie",
    params: {
      with_genres: "10749"
    },
    limit: 24
  }
];

const titleAdjectives = [
  "Midnight",
  "Silent",
  "Crimson",
  "Hidden",
  "Last",
  "Lost",
  "Neon",
  "Golden",
  "Wild",
  "Cold",
  "Dark",
  "Brave",
  "Eternal",
  "Fallen",
  "Iron",
  "Velvet",
  "Radiant",
  "Rogue",
  "Storm",
  "Broken",
  "Shadow",
  "Future",
  "Ancient",
  "Sacred",
  "Untamed",
  "Electric",
  "Lunar",
  "Solar",
  "Obsidian",
  "Emerald"
];

const titleNouns = [
  "City",
  "Empire",
  "Voyage",
  "Signal",
  "Crown",
  "Forest",
  "Wave",
  "Frontier",
  "Legend",
  "Crew",
  "Protocol",
  "Archive",
  "River",
  "Blade",
  "Circle",
  "Rift",
  "Heist",
  "Rescue",
  "Mystery",
  "Road",
  "Sky",
  "Harbor",
  "Range",
  "Unit",
  "Code",
  "Circuit",
  "Valley",
  "Tide",
  "Maze",
  "House"
];

const titleSuffixes = [
  "Chronicles",
  "Files",
  "Legacy",
  "Rising",
  "Reckoning",
  "Division",
  "Awakening",
  "Aftermath",
  "Genesis",
  "Zero",
  "Part II",
  "Protocol"
];

const descriptionStarts = [
  "A reluctant hero",
  "Two rivals",
  "A brilliant detective",
  "A former agent",
  "A small-town nurse",
  "A group of friends",
  "An exiled captain",
  "A street racer",
  "A scientist",
  "A musician",
  "An outsider",
  "A seasoned pilot"
];

const descriptionMiddles = [
  "uncovers a conspiracy",
  "is pulled into a covert mission",
  "must protect a secret",
  "chases a ghost from the past",
  "faces an impossible deadline",
  "discovers a hidden world",
  "navigates a fragile alliance",
  "fights to clear a name",
  "crosses a dangerous border",
  "is forced to trust a rival"
];

const descriptionEnds = [
  "before everything collapses.",
  "while the city watches.",
  "as the stakes rise.",
  "and nothing is what it seems.",
  "with the clock ticking.",
  "in a fight for survival.",
  "when the truth finally lands.",
  "as the world shifts again.",
  "under the pressure of fame.",
  "with nowhere left to hide."
];

const tvGenres = [
  "Drama",
  "Mystery",
  "Sci-Fi",
  "Thriller",
  "Crime",
  "Comedy",
  "Fantasy",
  "History",
  "Romance",
  "Horror"
];

const movieGenres = [
  "Action",
  "Adventure",
  "Thriller",
  "Drama",
  "Mystery",
  "Comedy",
  "Sci-Fi",
  "Fantasy",
  "Crime",
  "Horror"
];

const mockRowConfig = [
  {
    id: "top-tv",
    title: "Top 10 TV Shows Today",
    limit: 10,
    rank: true,
    filter: item => item.tags.includes("TV") && item.tags.includes("Trending")
  },
  {
    id: "top-movies",
    title: "Top 10 Movies Today",
    limit: 10,
    rank: true,
    filter: item => item.tags.includes("Movie") && item.tags.includes("Trending")
  },
  {
    id: "popular",
    title: "Popular on Streamflix",
    filter: item => item.tags.includes("Popular")
  },
  {
    id: "new",
    title: "New Releases",
    filter: item => item.tags.includes("New")
  },
  {
    id: "originals",
    title: "Only on Streamflix",
    filter: item => item.tags.includes("Only on Streamflix")
  },
  {
    id: "action",
    title: "Action Thrillers",
    filter: item => item.tags.includes("Movie") && item.genres.includes("Action")
  },
  {
    id: "tv-dramas",
    title: "TV Dramas",
    filter: item => item.tags.includes("TV") && item.genres.includes("Drama")
  },
  {
    id: "sci-fi",
    title: "Sci-Fi and Mystery",
    filter:
      item =>
        (item.tags.includes("TV") || item.tags.includes("Movie")) &&
        (item.genres.includes("Sci-Fi") || item.genres.includes("Mystery"))
  },
  {
    id: "thrillers",
    title: "Because you watched thrillers",
    filter: item => item.genres.includes("Thriller")
  }
];

const state = {
  query: "",
  searchOpen: false,
  heroId: null,
  rows: [],
  allTitles: new Map(),
  searchResults: [],
  heroCycle: [],
  genreMaps: null
};

let heroIndex = 0;
let heroTimer = null;
let searchTimer = null;

const elements = {
  header: document.getElementById("siteHeader"),
  menuToggle: document.getElementById("menuToggle"),
  nav: document.getElementById("primaryNav"),
  searchToggle: document.getElementById("searchToggle"),
  searchClose: document.getElementById("searchClose"),
  searchbar: document.getElementById("searchbar"),
  searchInput: document.getElementById("searchInput"),
  searchResults: document.getElementById("searchResults"),
  dataNotice: document.getElementById("dataNotice"),
  notifToggle: document.getElementById("notifToggle"),
  notifMenu: document.getElementById("notifMenu"),
  profileToggle: document.getElementById("profileToggle"),
  profileMenu: document.getElementById("profileMenu"),
  billboard: document.getElementById("billboard"),
  heroKicker: document.getElementById("heroKicker"),
  heroTitle: document.getElementById("heroTitle"),
  heroDescription: document.getElementById("heroDescription"),
  heroMatch: document.getElementById("heroMatch"),
  heroYear: document.getElementById("heroYear"),
  heroMaturity: document.getElementById("heroMaturity"),
  heroRuntime: document.getElementById("heroRuntime"),
  heroBadge: document.getElementById("heroBadge"),
  heroPrev: document.getElementById("heroPrev"),
  heroNext: document.getElementById("heroNext"),
  playButton: document.getElementById("playButton"),
  infoButton: document.getElementById("infoButton"),
  rowsContainer: document.getElementById("rowsContainer"),
  infoModal: document.getElementById("infoModal"),
  modalClose: document.getElementById("modalClose"),
  modalTitle: document.getElementById("modalTitle"),
  modalMeta: document.getElementById("modalMeta"),
  modalDescription: document.getElementById("modalDescription"),
  modalTrailer: document.getElementById("modalTrailer")
};

function hasTmdbKey() {
  return Boolean(TMDB_API_KEY && TMDB_API_KEY.trim());
}

function showNotice(message) {
  if (!elements.dataNotice) {
    return;
  }
  elements.dataNotice.textContent = message || "";
  elements.dataNotice.hidden = !message;
}

function mulberry32(seed) {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashString(value) {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function pick(list, rand) {
  return list[Math.floor(rand() * list.length)];
}

function pickUnique(list, count, rand) {
  const copy = [...list];
  const result = [];
  while (result.length < count && copy.length) {
    const index = Math.floor(rand() * copy.length);
    result.push(copy.splice(index, 1)[0]);
  }
  return result;
}

function escapeXml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function makeSvgDataUri(options) {
  const {
    width,
    height,
    title,
    kicker,
    subtitle,
    hue,
    hue2,
    accent,
    titleScale = 0.18,
    kickerScale = 0.06,
    subtitleScale = 0.07
  } = options;

  const titleSize = Math.round(height * titleScale);
  const kickerSize = Math.round(height * kickerScale);
  const subtitleSize = Math.round(height * subtitleScale);
  const safeTitle = escapeXml(title);
  const safeKicker = escapeXml(kicker);
  const safeSubtitle = escapeXml(subtitle);

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="hsl(${hue}, 70%, 18%)" />
      <stop offset="100%" stop-color="hsl(${hue2}, 68%, 28%)" />
    </linearGradient>
    <linearGradient id="glow" x1="1" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="hsla(${accent}, 75%, 55%, 0.75)" />
      <stop offset="100%" stop-color="hsla(${accent}, 80%, 35%, 0)" />
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#bg)" />
  <rect width="100%" height="100%" fill="url(#glow)" opacity="0.45" />
  <rect width="100%" height="100%" fill="rgba(0,0,0,0.26)" />
  <text x="6%" y="20%" fill="rgba(255,255,255,0.75)" font-family="Arial, sans-serif" font-size="${kickerSize}" letter-spacing="2">${safeKicker}</text>
  <text x="6%" y="52%" fill="#ffffff" font-family="Arial, sans-serif" font-size="${titleSize}" font-weight="700">${safeTitle}</text>
  <text x="6%" y="72%" fill="rgba(255,255,255,0.78)" font-family="Arial, sans-serif" font-size="${subtitleSize}">${safeSubtitle}</text>
</svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function makeTitle(index) {
  const rand = mulberry32(index + 1);
  const isSeries = rand() > 0.45;
  const adjective = pick(titleAdjectives, rand);
  const noun = pick(titleNouns, rand);
  const suffix = rand() > 0.7 ? pick(titleSuffixes, rand) : "";
  const withArticle = rand() > 0.6 ? "The " : "";
  const title = `${withArticle}${adjective} ${noun}${suffix ? ` ${suffix}` : ""}`;
  const year = 1998 + Math.floor(rand() * 29);
  const match = 82 + Math.floor(rand() * 18);
  const maturity = isSeries
    ? pick(["TV-MA", "TV-14", "TV-PG"], rand)
    : pick(["PG-13", "R", "PG"], rand);
  const runtime = isSeries
    ? (() => {
        if (rand() > 0.88) {
          return "Limited Series";
        }
        const seasons = 1 + Math.floor(rand() * 6);
        return seasons === 1 ? "Season 1" : `${seasons} Seasons`;
      })()
    : (() => {
        const hours = 1 + Math.floor(rand() * 2);
        const minutes = 20 + Math.floor(rand() * 40);
        return `${hours}h ${String(minutes).padStart(2, "0")}m`;
      })();
  const genres = pickUnique(isSeries ? tvGenres : movieGenres, rand() > 0.66 ? 3 : 2, rand);
  const tags = ["Only on Streamflix", isSeries ? "TV" : "Movie"];
  if (index % 4 === 0) {
    tags.push("Trending");
  }
  if (index % 3 === 0) {
    tags.push("Popular");
  }
  if (index % 7 === 0 || year >= 2024) {
    tags.push("New");
  }

  return {
    id: `title-${String(index + 1).padStart(3, "0")}`,
    title,
    kicker: isSeries ? "S SERIES" : "S FILM",
    description: `${pick(descriptionStarts, rand)} ${pick(descriptionMiddles, rand)} ${pick(descriptionEnds, rand)}`,
    year,
    maturity,
    runtime,
    match,
    genres,
    tags,
    mediaType: isSeries ? "tv" : "movie"
  };
}

function buildMockTitles(total) {
  const titles = Array.from({ length: total }, (_, index) => makeTitle(index));

  titles.forEach(title => {
    const seed = hashString(title.id);
    const rand = mulberry32(seed);
    const hue = Math.floor(rand() * 360);
    const hue2 = (hue + 30 + Math.floor(rand() * 60)) % 360;
    const accent = (hue + 170) % 360;
    const subtitle = `${title.genres[0]} / ${title.genres[1] ?? title.genres[0]}`;

    title.backdrop = makeSvgDataUri({
      width: 1920,
      height: 1080,
      title: title.title,
      kicker: title.kicker,
      subtitle: `${subtitle} / ${title.runtime}`,
      hue,
      hue2,
      accent,
      titleScale: 0.12,
      kickerScale: 0.045,
      subtitleScale: 0.06
    });

    title.thumbnail = makeSvgDataUri({
      width: 640,
      height: 360,
      title: title.title,
      kicker: title.kicker,
      subtitle,
      hue,
      hue2,
      accent,
      titleScale: 0.18,
      kickerScale: 0.06,
      subtitleScale: 0.07
    });

    title.trailerQuery = `${title.title} official trailer`;
  });

  return titles;
}

function buildUrl(endpoint, params = {}) {
  const url = new URL(`${TMDB_BASE}${endpoint}`);
  url.searchParams.set("api_key", TMDB_API_KEY);
  url.searchParams.set("language", "en-US");
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, String(value));
  });
  return url.toString();
}

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Request failed (${response.status})`);
  }
  return response.json();
}

async function fetchGenres() {
  const [movieData, tvData] = await Promise.all([
    fetchJson(buildUrl("/genre/movie/list")),
    fetchJson(buildUrl("/genre/tv/list"))
  ]);

  const toMap = data =>
    (data.genres || []).reduce((map, genre) => {
      map[genre.id] = genre.name;
      return map;
    }, {});

  return {
    movie: toMap(movieData),
    tv: toMap(tvData)
  };
}

function buildImageUrl(size, path) {
  return `${TMDB_IMAGE_BASE}${size}${path}`;
}

function getYear(dateString) {
  if (!dateString) {
    return "";
  }
  return dateString.slice(0, 4);
}

function buildFallbackImages(item) {
  const seed = hashString(item.id);
  const rand = mulberry32(seed);
  const hue = Math.floor(rand() * 360);
  const hue2 = (hue + 30 + Math.floor(rand() * 60)) % 360;
  const accent = (hue + 170) % 360;
  const subtitle = item.genres.length ? item.genres.slice(0, 2).join(" / ") : item.runtime;
  const kicker = item.kicker || (item.mediaType === "tv" ? "S SERIES" : "S FILM");

  return {
    backdrop: makeSvgDataUri({
      width: 1920,
      height: 1080,
      title: item.title,
      kicker,
      subtitle: `${subtitle} / ${item.runtime}`,
      hue,
      hue2,
      accent,
      titleScale: 0.12,
      kickerScale: 0.045,
      subtitleScale: 0.06
    }),
    thumbnail: makeSvgDataUri({
      width: 640,
      height: 360,
      title: item.title,
      kicker,
      subtitle,
      hue,
      hue2,
      accent,
      titleScale: 0.18,
      kickerScale: 0.06,
      subtitleScale: 0.07
    })
  };
}

function normalizeTmdbItem(item, fallbackType, genreMaps) {
  let mediaType = item.media_type || fallbackType || "movie";
  if (mediaType === "all") {
    mediaType = item.media_type && item.media_type !== "person" ? item.media_type : "movie";
  }
  if (mediaType === "person") {
    return null;
  }

  const title = item.title || item.name || "Untitled";
  const year = getYear(item.release_date || item.first_air_date);
  const genres = (item.genre_ids || [])
    .map(id => (mediaType === "tv" ? genreMaps.tv[id] : genreMaps.movie[id]))
    .filter(Boolean);
  const match = Math.max(70, Math.round((item.vote_average || 6.5) * 10));
  const maturity = item.adult ? "TV-MA" : "PG-13";
  const runtime = mediaType === "tv" ? "Series" : "Movie";
  const kicker = mediaType === "tv" ? "S SERIES" : "S FILM";

  const entry = {
    id: `tmdb-${mediaType}-${item.id}`,
    title,
    description: item.overview || "No description available.",
    year,
    match,
    maturity,
    runtime,
    genres,
    kicker,
    mediaType,
    backdrop: item.backdrop_path
      ? buildImageUrl("w1280", item.backdrop_path)
      : item.poster_path
        ? buildImageUrl("w780", item.poster_path)
        : "",
    thumbnail: item.backdrop_path
      ? buildImageUrl("w780", item.backdrop_path)
      : item.poster_path
        ? buildImageUrl("w500", item.poster_path)
        : "",
    trailerQuery: `${title} official trailer`
  };

  if (!entry.backdrop || !entry.thumbnail) {
    const fallback = buildFallbackImages(entry);
    entry.backdrop = entry.backdrop || fallback.backdrop;
    entry.thumbnail = entry.thumbnail || fallback.thumbnail;
  }

  return entry;
}

function buildMetaLine(item) {
  const parts = [];
  if (item.match) {
    parts.push(`${item.match}% Match`);
  }
  if (item.year) {
    parts.push(item.year);
  }
  if (item.maturity) {
    parts.push(item.maturity);
  }
  if (item.runtime) {
    parts.push(item.runtime);
  }
  if (item.genres && item.genres.length) {
    parts.push(item.genres[0]);
  }
  return parts.join(" | ");
}

function setRows(rows) {
  state.rows = rows.filter(row => row.items && row.items.length);
  state.allTitles = new Map();

  state.rows.forEach(row => {
    row.items.forEach(item => {
      if (item) {
        state.allTitles.set(item.id, item);
      }
    });
  });

  const heroRow = state.rows.find(row => row.id === "trending") || state.rows[0];
  state.heroCycle = heroRow ? heroRow.items.slice(0, 8) : [];
  state.heroId = state.heroCycle[0]?.id || heroRow?.items[0]?.id || null;
  heroIndex = 0;
}

function getHero() {
  if (state.heroId && state.allTitles.has(state.heroId)) {
    return state.allTitles.get(state.heroId);
  }
  return state.rows[0]?.items[0] || null;
}

function setHero(heroId, skipRestart = false) {
  state.heroId = heroId;
  const index = state.heroCycle.findIndex(item => item.id === heroId);
  if (index >= 0) {
    heroIndex = index;
  }
  renderHero();
  if (!skipRestart) {
    startHeroRotation();
  }
}

function renderHero() {
  const hero = getHero();

  if (!hero) {
    elements.heroKicker.textContent = "S SERIES";
    elements.heroTitle.textContent = "Add a TMDB API key";
    elements.heroDescription.textContent = "Set your TMDB API key in app.js to load real titles.";
    elements.heroMatch.textContent = "";
    elements.heroYear.textContent = "";
    elements.heroMaturity.textContent = "";
    elements.heroRuntime.textContent = "";
    elements.heroBadge.textContent = "";
    elements.billboard.style.setProperty("--billboard-image", "none");
    return;
  }

  elements.heroKicker.textContent = hero.kicker;
  elements.heroTitle.textContent = hero.title;
  elements.heroDescription.textContent = hero.description;
  elements.heroMatch.textContent = hero.match ? `${hero.match}% Match` : "";
  elements.heroYear.textContent = hero.year ? String(hero.year) : "";
  elements.heroMaturity.textContent = hero.maturity || "";
  elements.heroRuntime.textContent = hero.runtime || "";
  elements.heroBadge.textContent = hero.maturity || "";
  elements.billboard.style.setProperty("--billboard-image", `url("${hero.backdrop}")`);
}

function createNavButton(direction, label) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = `row__nav row__nav--${direction}`;
  button.setAttribute("aria-label", label);
  button.innerHTML =
    direction === "prev"
      ? '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><polyline points="15 6 9 12 15 18" stroke-width="2" fill="none"></polyline></svg>'
      : '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><polyline points="9 6 15 12 9 18" stroke-width="2" fill="none"></polyline></svg>';
  return button;
}

function updateRowNav(section) {
  const track = section.querySelector(".row__track");
  const prev = section.querySelector(".row__nav--prev");
  const next = section.querySelector(".row__nav--next");
  if (!track || !prev || !next) {
    return;
  }

  const maxScroll = track.scrollWidth - track.clientWidth;
  prev.disabled = track.scrollLeft <= 0;
  next.disabled = track.scrollLeft >= maxScroll - 2;
}

function scrollRow(track, direction) {
  const amount = track.clientWidth * 0.8;
  track.scrollBy({ left: direction * amount, behavior: "smooth" });
}

function createCard(item, options = {}) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "card";
  if (options.rank) {
    button.classList.add("card--ranked");
  }
  if (typeof options.index === "number") {
    button.style.setProperty("--delay", `${options.index * 0.02}s`);
  }
  button.setAttribute("aria-label", `Show ${item.title}`);

  const image = document.createElement("img");
  image.src = item.thumbnail;
  image.alt = `${item.title} cover`;
  image.loading = "lazy";
  image.decoding = "async";

  const details = document.createElement("div");
  details.className = "card__details";

  const title = document.createElement("div");
  title.textContent = item.title;

  const meta = document.createElement("div");
  meta.className = "card__meta";
  meta.textContent = buildMetaLine(item);

  details.append(title, meta);

  if (options.rank) {
    const badge = document.createElement("span");
    badge.className = "card__badge";
    badge.textContent = "Top 10";

    const rank = document.createElement("span");
    rank.className = "card__rank";
    rank.textContent = String(options.rank);

    button.append(badge, rank);
  }

  button.append(image, details);

  button.addEventListener("click", () => {
    setHero(item.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  return button;
}

function createRowSection(row) {
  const section = document.createElement("section");
  section.className = "row";

  const heading = document.createElement("h2");
  heading.className = "row__title";
  heading.textContent = row.title;

  const track = document.createElement("div");
  track.className = "row__track";

  row.items.forEach((item, index) => {
    track.appendChild(createCard(item, { rank: row.rank ? index + 1 : null, index }));
  });

  const prev = createNavButton("prev", `Scroll ${row.title} left`);
  const next = createNavButton("next", `Scroll ${row.title} right`);

  prev.addEventListener("click", () => scrollRow(track, -1));
  next.addEventListener("click", () => scrollRow(track, 1));
  track.addEventListener("scroll", () => updateRowNav(section), { passive: true });

  section.append(heading, prev, next, track);
  requestAnimationFrame(() => updateRowNav(section));

  return section;
}

function renderRows() {
  elements.rowsContainer.replaceChildren();

  if (!state.rows.length) {
    const empty = document.createElement("p");
    empty.className = "empty";
    empty.textContent = "No rows available yet.";
    elements.rowsContainer.appendChild(empty);
    return;
  }

  state.rows.forEach(row => {
    if (row.items.length) {
      elements.rowsContainer.appendChild(createRowSection(row));
    }
  });
}

function renderSearchResults() {
  elements.searchResults.replaceChildren();

  if (!state.searchOpen) {
    return;
  }

  if (state.query.trim().length < 2) {
    const empty = document.createElement("p");
    empty.className = "empty";
    empty.textContent = "Type at least 2 characters to search.";
    elements.searchResults.appendChild(empty);
    return;
  }

  if (!state.searchResults.length) {
    const empty = document.createElement("p");
    empty.className = "empty";
    empty.textContent = "No titles match your search.";
    elements.searchResults.appendChild(empty);
    return;
  }

  const row = {
    title: "Search results",
    items: state.searchResults,
    rank: false
  };

  elements.searchResults.appendChild(createRowSection(row));
}

function matchesQuery(item, query) {
  const haystack = [
    item.title,
    item.description,
    item.kicker,
    String(item.year || ""),
    item.maturity,
    item.runtime,
    item.genres.join(" ")
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(query.toLowerCase());
}

function setSearchOpen(isOpen) {
  state.searchOpen = isOpen;
  elements.searchbar.hidden = !isOpen;
  document.body.classList.toggle("search-open", isOpen);
  elements.searchToggle.setAttribute("aria-expanded", String(isOpen));

  if (isOpen) {
    elements.searchInput.focus();
    renderSearchResults();
    return;
  }

  elements.searchInput.value = "";
  state.query = "";
  state.searchResults = [];
  renderSearchResults();
}

function scheduleSearch() {
  clearTimeout(searchTimer);
  searchTimer = window.setTimeout(() => {
    runSearch();
  }, SEARCH_DEBOUNCE_MS);
}

async function runSearch() {
  const query = state.query.trim();

  if (query.length < 2) {
    state.searchResults = [];
    renderSearchResults();
    return;
  }

  if (!hasTmdbKey()) {
    state.searchResults = Array.from(state.allTitles.values())
      .filter(item => matchesQuery(item, query))
      .slice(0, 24);
    renderSearchResults();
    return;
  }

  try {
    const data = await fetchJson(
      buildUrl("/search/multi", {
        query,
        include_adult: "false"
      })
    );
    const results = (data.results || [])
      .filter(item => item.media_type !== "person")
      .map(item => normalizeTmdbItem(item, item.media_type, state.genreMaps || { movie: {}, tv: {} }))
      .filter(Boolean)
      .slice(0, 24);

    state.searchResults = results;
    renderSearchResults();
  } catch (error) {
    console.error(error);
    state.searchResults = [];
    renderSearchResults();
  }
}

function setMenuOpen(isOpen) {
  elements.header.classList.toggle("is-open", isOpen);
  elements.menuToggle.setAttribute("aria-expanded", String(isOpen));
}

function setPopupMenu(toggle, menu, isOpen) {
  menu.hidden = !isOpen;
  toggle.setAttribute("aria-expanded", String(isOpen));
}

function closeMenus() {
  setPopupMenu(elements.notifToggle, elements.notifMenu, false);
  setPopupMenu(elements.profileToggle, elements.profileMenu, false);
}

function getTrailerUrl(item) {
  const query = encodeURIComponent(item.trailerQuery || `${item.title} official trailer`);
  return `https://www.youtube.com/results?search_query=${query}`;
}

function openModal(item) {
  elements.modalTitle.textContent = item.title;
  elements.modalMeta.textContent = buildMetaLine(item);
  elements.modalDescription.textContent = item.description || "No description available.";
  elements.modalTrailer.href = getTrailerUrl(item);

  elements.infoModal.hidden = false;
  elements.infoModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function closeModal() {
  elements.infoModal.hidden = true;
  elements.infoModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

function render() {
  renderHero();
  renderRows();
  renderSearchResults();
  startHeroRotation();
}

function stopHeroRotation() {
  if (heroTimer) {
    window.clearInterval(heroTimer);
    heroTimer = null;
  }
}

function startHeroRotation() {
  stopHeroRotation();
  if (!state.heroCycle.length) {
    return;
  }
  heroTimer = window.setInterval(() => {
    cycleHero(1);
  }, HERO_ROTATE_MS);
}

function cycleHero(direction) {
  if (!state.heroCycle.length) {
    return;
  }
  heroIndex = (heroIndex + direction + state.heroCycle.length) % state.heroCycle.length;
  setHero(state.heroCycle[heroIndex].id, true);
}

async function fetchRow(row, genreMaps) {
  const data = await fetchJson(buildUrl(row.endpoint, row.params || {}));
  const results = (data.results || [])
    .filter(item => item.media_type !== "person")
    .map(item => normalizeTmdbItem(item, row.mediaType, genreMaps))
    .filter(Boolean);

  return {
    ...row,
    items: results.slice(0, row.limit || results.length)
  };
}

async function loadTmdbRows() {
  const genreMaps = await fetchGenres();
  state.genreMaps = genreMaps;

  const rows = await Promise.all(rowDefinitions.map(row => fetchRow(row, genreMaps)));
  setRows(rows);
}

function loadMockRows() {
  const titles = buildMockTitles(MOCK_TOTAL_TITLES);
  const rows = mockRowConfig
    .map(row => {
      const limit = row.limit || 24;
      return {
        id: row.id,
        title: row.title,
        rank: row.rank,
        items: titles.filter(row.filter).slice(0, limit)
      };
    })
    .filter(row => row.items.length);

  setRows(rows);
}

async function init() {
  if (!hasTmdbKey()) {
    showNotice("Add your TMDB API key in app.js to load real titles.");
    loadMockRows();
    render();
    return;
  }

  try {
    showNotice("");
    await loadTmdbRows();
  } catch (error) {
    console.error(error);
    showNotice("TMDB request failed. Showing mock catalog instead.");
    loadMockRows();
  }

  render();
}

elements.searchToggle.addEventListener("click", () => {
  setSearchOpen(!state.searchOpen);
});

elements.searchClose.addEventListener("click", () => {
  setSearchOpen(false);
});

elements.searchInput.addEventListener("input", event => {
  state.query = event.target.value;
  scheduleSearch();
});

elements.menuToggle.addEventListener("click", () => {
  const nextState = !elements.header.classList.contains("is-open");
  setMenuOpen(nextState);
});

elements.notifToggle.addEventListener("click", event => {
  event.stopPropagation();
  const isOpen = elements.notifMenu.hidden;
  closeMenus();
  setPopupMenu(elements.notifToggle, elements.notifMenu, isOpen);
});

elements.profileToggle.addEventListener("click", event => {
  event.stopPropagation();
  const isOpen = elements.profileMenu.hidden;
  closeMenus();
  setPopupMenu(elements.profileToggle, elements.profileMenu, isOpen);
});

elements.playButton.addEventListener("click", () => {
  const hero = getHero();
  if (hero) {
    openModal(hero);
  }
});

elements.infoButton.addEventListener("click", () => {
  const hero = getHero();
  if (hero) {
    openModal(hero);
  }
});

elements.heroPrev.addEventListener("click", () => {
  cycleHero(-1);
  startHeroRotation();
});

elements.heroNext.addEventListener("click", () => {
  cycleHero(1);
  startHeroRotation();
});

elements.billboard.addEventListener("mouseenter", stopHeroRotation);
elements.billboard.addEventListener("mouseleave", startHeroRotation);

elements.modalClose.addEventListener("click", closeModal);

elements.infoModal.addEventListener("click", event => {
  if (event.target instanceof HTMLElement && event.target.dataset.closeModal === "true") {
    closeModal();
  }
});

document.addEventListener("click", event => {
  if (event.target instanceof HTMLElement && event.target.closest(".menu-wrap")) {
    return;
  }
  closeMenus();
});

window.addEventListener(
  "scroll",
  () => {
    elements.header.classList.toggle("is-scrolled", window.scrollY > 10);
  },
  { passive: true }
);

window.addEventListener("resize", () => {
  if (window.innerWidth > 980) {
    setMenuOpen(false);
  }
  closeMenus();
});

document.addEventListener("keydown", event => {
  if (event.key !== "Escape") {
    return;
  }

  if (!elements.infoModal.hidden) {
    closeModal();
    return;
  }

  if (state.searchOpen) {
    setSearchOpen(false);
  }

  closeMenus();
  setMenuOpen(false);
});

init();
