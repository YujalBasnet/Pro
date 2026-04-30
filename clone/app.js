document.title = "Netflix Clone";

const TOTAL_TITLES = 300;

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
  const tags = ["Only on Netflix", isSeries ? "TV" : "Movie"];
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
    kicker: isSeries ? "N SERIES" : "N FILM",
    description: `${pick(descriptionStarts, rand)} ${pick(descriptionMiddles, rand)} ${pick(descriptionEnds, rand)}`,
    year,
    maturity,
    runtime,
    match,
    genres,
    tags
  };
}

const titles = Array.from({ length: TOTAL_TITLES }, (_, index) => makeTitle(index));

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

const rowConfig = [
  {
    title: "Top 10 TV Shows",
    filter: item => item.tags.includes("TV") && item.tags.includes("Trending")
  },
  {
    title: "Top 10 Movies",
    filter: item => item.tags.includes("Movie") && item.tags.includes("Trending")
  },
  {
    title: "Popular on Netflix",
    filter: item => item.tags.includes("Popular")
  },
  {
    title: "New on Netflix",
    filter: item => item.tags.includes("New")
  },
  {
    title: "Only on Netflix",
    filter: item => item.tags.includes("Only on Netflix")
  },
  {
    title: "Action Movies",
    filter: item => item.tags.includes("Movie") && item.genres.includes("Action")
  },
  {
    title: "TV Dramas",
    filter: item => item.tags.includes("TV") && item.genres.includes("Drama")
  },
  {
    title: "Sci-Fi and Mystery",
    filter:
      item =>
        (item.tags.includes("TV") || item.tags.includes("Movie")) &&
        (item.genres.includes("Sci-Fi") || item.genres.includes("Mystery"))
  },
  {
    title: "Because you watched thrillers",
    filter: item => item.genres.includes("Thriller")
  },
  {
    title: "Thrillers",
    filter: item => item.genres.includes("Thriller")
  }
];

const state = {
  query: "",
  heroId: titles[0].id
};

const byId = new Map(titles.map(item => [item.id, item]));

const elements = {
  header: document.getElementById("siteHeader"),
  menuToggle: document.getElementById("menuToggle"),
  nav: document.getElementById("primaryNav"),
  searchToggle: document.getElementById("searchToggle"),
  searchbar: document.getElementById("searchbar"),
  searchInput: document.getElementById("searchInput"),
  billboard: document.getElementById("billboard"),
  heroKicker: document.getElementById("heroKicker"),
  heroTitle: document.getElementById("heroTitle"),
  heroDescription: document.getElementById("heroDescription"),
  heroMatch: document.getElementById("heroMatch"),
  heroYear: document.getElementById("heroYear"),
  heroMaturity: document.getElementById("heroMaturity"),
  heroRuntime: document.getElementById("heroRuntime"),
  heroBadge: document.getElementById("heroBadge"),
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

function getHero() {
  return byId.get(state.heroId) ?? titles[0];
}

function matchesQuery(item) {
  const query = state.query.trim().toLowerCase();

  if (!query) {
    return true;
  }

  const haystack = [
    item.title,
    item.description,
    item.kicker,
    String(item.year),
    item.maturity,
    item.runtime,
    item.genres.join(" "),
    item.tags.join(" ")
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(query);
}

function setHero(heroId) {
  state.heroId = heroId;
  renderHero();
}

function renderHero() {
  const hero = getHero();

  elements.heroKicker.textContent = hero.kicker;
  elements.heroTitle.textContent = hero.title;
  elements.heroDescription.textContent = hero.description;
  elements.heroMatch.textContent = `${hero.match}% Match`;
  elements.heroYear.textContent = String(hero.year);
  elements.heroMaturity.textContent = hero.maturity;
  elements.heroRuntime.textContent = hero.runtime;
  elements.heroBadge.textContent = hero.maturity;
  elements.billboard.style.setProperty("--billboard-image", `url("${hero.backdrop}")`);
}

function createCard(item) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "card";
  button.setAttribute("aria-label", `Show ${item.title}`);

  const image = document.createElement("img");
  image.src = item.thumbnail;
  image.alt = `${item.title} cover`;
  image.loading = "lazy";
  image.decoding = "async";

  const overlay = document.createElement("div");
  overlay.className = "card__overlay";
  overlay.textContent = item.title;

  button.append(image, overlay);

  button.addEventListener("click", () => {
    setHero(item.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  return button;
}

function renderRows() {
  elements.rowsContainer.replaceChildren();

  const filtered = titles.filter(matchesQuery);

  if (!filtered.length) {
    const empty = document.createElement("p");
    empty.className = "empty";
    empty.textContent = "No titles match your search.";
    elements.rowsContainer.appendChild(empty);
    return;
  }

  rowConfig.forEach(row => {
    const items = filtered.filter(row.filter);

    if (!items.length) {
      return;
    }

    const section = document.createElement("section");
    section.className = "row";

    const heading = document.createElement("h2");
    heading.className = "row__title";
    heading.textContent = row.title;

    const track = document.createElement("div");
    track.className = "row__track";

    items.forEach(item => {
      track.appendChild(createCard(item));
    });

    section.append(heading, track);
    elements.rowsContainer.appendChild(section);
  });
}

function toggleSearch() {
  const isHidden = elements.searchbar.hidden;
  elements.searchbar.hidden = !isHidden;

  if (isHidden) {
    elements.searchInput.focus();
  } else {
    elements.searchInput.blur();
  }
}

function setMenuOpen(isOpen) {
  elements.header.classList.toggle("is-open", isOpen);
  elements.menuToggle.setAttribute("aria-expanded", String(isOpen));
}

function getTrailerUrl(item) {
  const query = encodeURIComponent(item.trailerQuery);
  return `https://www.youtube.com/results?search_query=${query}`;
}

function openModal(item) {
  elements.modalTitle.textContent = item.title;
  elements.modalMeta.textContent = `${item.match}% Match  ${item.year}  ${item.maturity}  ${item.runtime}`;
  elements.modalDescription.textContent = item.description;
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
}

elements.searchToggle.addEventListener("click", toggleSearch);

elements.searchInput.addEventListener("input", event => {
  state.query = event.target.value;
  renderRows();
});

elements.menuToggle.addEventListener("click", () => {
  const nextState = !elements.header.classList.contains("is-open");
  setMenuOpen(nextState);
});

elements.playButton.addEventListener("click", () => {
  openModal(getHero());
});

elements.infoButton.addEventListener("click", () => {
  openModal(getHero());
});

elements.modalClose.addEventListener("click", closeModal);

elements.infoModal.addEventListener("click", event => {
  if (event.target instanceof HTMLElement && event.target.dataset.closeModal === "true") {
    closeModal();
  }
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
});

document.addEventListener("keydown", event => {
  if (event.key !== "Escape") {
    return;
  }

  if (!elements.infoModal.hidden) {
    closeModal();
    return;
  }

  if (!elements.searchbar.hidden) {
    elements.searchbar.hidden = true;
  }

  setMenuOpen(false);
});

render();