document.title = "Netflix Clone";

const titles = [
  {
    id: "night-protocol",
    title: "Night Protocol",
    kicker: "N SERIES",
    description:
      "A systems analyst finds the city security feed predicting crimes hours before they happen, and now everyone wants the evidence gone.",
    year: 2026,
    maturity: "TV-MA",
    runtime: "8 Episodes",
    match: 98,
    genres: ["Sci-Fi", "Thriller", "Mystery"],
    tags: ["Trending", "Popular", "Only on Netflix"]
  },
  {
    id: "velvet-city",
    title: "Velvet City",
    kicker: "N FILM",
    description:
      "A night courier gets trapped in a debt network where every favor is a crime and every turn has a witness.",
    year: 2025,
    maturity: "R",
    runtime: "2h 06m",
    match: 96,
    genres: ["Crime", "Drama", "Thriller"],
    tags: ["Trending", "Popular"]
  },
  {
    id: "solar-hearts",
    title: "Solar Hearts",
    kicker: "N SERIES",
    description:
      "Two orbital engineers fall in love while rebuilding a drifting station near a zone no one is meant to map.",
    year: 2026,
    maturity: "TV-14",
    runtime: "10 Episodes",
    match: 94,
    genres: ["Romance", "Drama", "Sci-Fi"],
    tags: ["New", "Only on Netflix"]
  },
  {
    id: "paper-thunder",
    title: "Paper Thunder",
    kicker: "N FILM",
    description:
      "A parkour smuggler races across a floodlit megacity to deliver a file that could erase a private army.",
    year: 2024,
    maturity: "PG-13",
    runtime: "1h 58m",
    match: 95,
    genres: ["Action", "Adventure", "Thriller"],
    tags: ["Action", "Trending"]
  },
  {
    id: "hollow-harbor",
    title: "Hollow Harbor",
    kicker: "N SERIES",
    description:
      "A coastal town loses one hour each night, and the few people who remember it keep finding impossible evidence.",
    year: 2025,
    maturity: "TV-MA",
    runtime: "6 Episodes",
    match: 93,
    genres: ["Mystery", "Drama", "Horror"],
    tags: ["Popular"]
  },
  {
    id: "iron-coast",
    title: "Iron Coast",
    kicker: "N SERIES",
    description:
      "A former shipyard investigator returns to the docks as a weapons ring turns the waterfront into a war zone.",
    year: 2025,
    maturity: "TV-MA",
    runtime: "7 Episodes",
    match: 97,
    genres: ["Action", "Crime", "Thriller"],
    tags: ["Trending", "Action", "Only on Netflix"]
  },
  {
    id: "ghost-district",
    title: "Ghost District",
    kicker: "N FILM",
    description:
      "A developer inherits a condemned block where every apartment records the final minutes of its last resident.",
    year: 2025,
    maturity: "R",
    runtime: "1h 49m",
    match: 95,
    genres: ["Horror", "Mystery", "Thriller"],
    tags: ["Trending"]
  },
  {
    id: "midnight-arcade",
    title: "Midnight Arcade",
    kicker: "N SERIES",
    description:
      "A repair crew discovers an arcade that keeps turning random visitors into accidental heroes.",
    year: 2025,
    maturity: "TV-14",
    runtime: "9 Episodes",
    match: 93,
    genres: ["Comedy", "Adventure", "Sci-Fi"],
    tags: ["Popular", "New"]
  },
  {
    id: "last-signal",
    title: "Last Signal",
    kicker: "N SERIES",
    description:
      "A satellite operator follows a repeating distress call that seems to come from tomorrow, not deep space.",
    year: 2026,
    maturity: "TV-MA",
    runtime: "8 Episodes",
    match: 97,
    genres: ["Sci-Fi", "Mystery", "Action"],
    tags: ["New", "Trending", "Only on Netflix"]
  },
  {
    id: "afterglow-run",
    title: "Afterglow Run",
    kicker: "N FILM",
    description:
      "A getaway driver and a whistleblower race through the city after a contract job becomes a full manhunt.",
    year: 2026,
    maturity: "R",
    runtime: "1h 52m",
    match: 96,
    genres: ["Crime", "Action", "Thriller"],
    tags: ["Action", "New", "Trending"]
  },
  {
    id: "blue-harbor",
    title: "Blue Harbor",
    kicker: "N FILM",
    description:
      "A retired sailor returns home to rebuild the harbor diner that once held his entire family together.",
    year: 2024,
    maturity: "PG-13",
    runtime: "2h 03m",
    match: 90,
    genres: ["Drama", "Family", "Romance"],
    tags: ["Popular"]
  },
  {
    id: "tiny-titans-club",
    title: "Tiny Titans Club",
    kicker: "N FILM",
    description:
      "A group of kids and one nervous robot build a neighborhood rescue squad before the summer fair opens.",
    year: 2024,
    maturity: "G",
    runtime: "1h 37m",
    match: 90,
    genres: ["Family", "Animation", "Adventure"],
    tags: ["Popular", "New"]
  }
];

titles.forEach(title => {
  title.backdrop = `https://picsum.photos/seed/${title.id}-backdrop/1920/1080`;
  title.thumbnail = `https://picsum.photos/seed/${title.id}-thumbnail/640/360`;
  title.trailerQuery = `${title.title} official trailer`;
});

const rowConfig = [
  {
    title: "Trending Now",
    filter: item => item.tags.includes("Trending")
  },
  {
    title: "Popular on Netflix",
    filter: item => item.tags.includes("Popular")
  },
  {
    title: "New Releases",
    filter: item => item.tags.includes("New")
  },
  {
    title: "Only on Netflix",
    filter: item => item.tags.includes("Only on Netflix")
  },
  {
    title: "Action Movies",
    filter: item => item.genres.includes("Action")
  },
  {
    title: "Sci-Fi and Mystery",
    filter: item => item.genres.includes("Sci-Fi") || item.genres.includes("Mystery")
  },
  {
    title: "Because you watched thrillers",
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