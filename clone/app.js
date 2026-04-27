document.title = "Netflix Clone";

const titles = [
  {
    id: "stranger-things",
    title: "Stranger Things",
    kicker: "N SERIES",
    description:
      "In Hawkins, a missing boy, a secret lab, and a girl with impossible powers pull a small town into a deadly parallel world.",
    year: 2016,
    maturity: "TV-14",
    runtime: "4 Seasons",
    match: 98,
    genres: ["Sci-Fi", "Horror", "Drama"],
    tags: ["Trending", "Popular", "Only on Netflix", "TV"]
  },
  {
    id: "wednesday",
    title: "Wednesday",
    kicker: "N SERIES",
    description:
      "At Nevermore Academy, Wednesday Addams investigates a supernatural murder spree while surviving teenage chaos her own way.",
    year: 2022,
    maturity: "TV-14",
    runtime: "2 Seasons",
    match: 96,
    genres: ["Mystery", "Fantasy", "Comedy"],
    tags: ["Trending", "Popular", "Only on Netflix", "TV"]
  },
  {
    id: "squid-game",
    title: "Squid Game",
    kicker: "N SERIES",
    description:
      "Hundreds of desperate players compete in deadly childhood games where the winner takes everything and losers leave for good.",
    year: 2021,
    maturity: "TV-MA",
    runtime: "2 Seasons",
    match: 94,
    genres: ["Thriller", "Drama", "Mystery"],
    tags: ["Trending", "Popular", "Only on Netflix", "TV"]
  },
  {
    id: "money-heist",
    title: "Money Heist",
    kicker: "N SERIES",
    description:
      "A mastermind known as The Professor recruits specialists for a heist that grows into a global resistance symbol.",
    year: 2017,
    maturity: "TV-MA",
    runtime: "5 Parts",
    match: 95,
    genres: ["Crime", "Thriller", "Drama"],
    tags: ["Popular", "Only on Netflix", "TV"]
  },
  {
    id: "bridgerton",
    title: "Bridgerton",
    kicker: "N SERIES",
    description:
      "Ambition, romance, and reputation collide in Regency London as the ton follows every whispered scandal.",
    year: 2020,
    maturity: "TV-MA",
    runtime: "3 Seasons",
    match: 93,
    genres: ["Drama", "Romance"],
    tags: ["Popular", "Only on Netflix", "TV"]
  },
  {
    id: "the-crown",
    title: "The Crown",
    kicker: "N SERIES",
    description:
      "The reign of Queen Elizabeth II unfolds through political conflict, private heartbreak, and public duty.",
    year: 2016,
    maturity: "TV-MA",
    runtime: "6 Seasons",
    match: 97,
    genres: ["Drama", "History"],
    tags: ["Popular", "Only on Netflix", "TV"]
  },
  {
    id: "black-mirror",
    title: "Black Mirror",
    kicker: "N SERIES",
    description:
      "A sharp anthology where modern technology bends human behavior into dark and often unsettling consequences.",
    year: 2011,
    maturity: "TV-MA",
    runtime: "6 Seasons",
    match: 95,
    genres: ["Sci-Fi", "Thriller", "Drama"],
    tags: ["Popular", "Only on Netflix", "TV"]
  },
  {
    id: "the-queens-gambit",
    title: "The Queen's Gambit",
    kicker: "N SERIES",
    description:
      "A chess prodigy fights addiction, pressure, and the elite of the chess world while redefining the game.",
    year: 2020,
    maturity: "TV-MA",
    runtime: "Limited Series",
    match: 93,
    genres: ["Drama"],
    tags: ["Popular", "Only on Netflix", "TV"]
  },
  {
    id: "ozark",
    title: "Ozark",
    kicker: "N SERIES",
    description:
      "A financial adviser moves his family to the Ozarks to launder money and quickly discovers survival has new rules.",
    year: 2017,
    maturity: "TV-MA",
    runtime: "4 Seasons",
    match: 97,
    genres: ["Crime", "Thriller", "Drama"],
    tags: ["Popular", "Only on Netflix", "TV"]
  },
  {
    id: "three-body-problem",
    title: "3 Body Problem",
    kicker: "N SERIES",
    description:
      "Scientists around the world face a coordinated collapse of known physics as a cosmic countdown begins.",
    year: 2024,
    maturity: "TV-MA",
    runtime: "Season 1",
    match: 96,
    genres: ["Sci-Fi", "Mystery", "Drama"],
    tags: ["New", "Trending", "Only on Netflix", "TV"]
  },
  {
    id: "red-notice",
    title: "Red Notice",
    kicker: "N FILM",
    description:
      "An FBI profiler is forced into an uneasy alliance with an art thief to catch the world's most wanted con artist.",
    year: 2021,
    maturity: "PG-13",
    runtime: "1h 58m",
    match: 90,
    genres: ["Action", "Comedy", "Crime"],
    tags: ["Popular", "Only on Netflix", "Movie", "Action"]
  },
  {
    id: "extraction-2",
    title: "Extraction 2",
    kicker: "N FILM",
    description:
      "Tyler Rake returns for another impossible mission, this time pulling a family out of a heavily fortified prison system.",
    year: 2023,
    maturity: "R",
    runtime: "2h 03m",
    match: 90,
    genres: ["Action", "Thriller"],
    tags: ["Popular", "Only on Netflix", "Movie", "Action"]
  },
  {
    id: "glass-onion",
    title: "Glass Onion: A Knives Out Mystery",
    kicker: "N FILM",
    description:
      "Detective Benoit Blanc travels to a private island retreat where a murder game turns into the real thing.",
    year: 2022,
    maturity: "PG-13",
    runtime: "2h 19m",
    match: 92,
    genres: ["Mystery", "Comedy", "Crime"],
    tags: ["Popular", "Only on Netflix", "Movie"]
  },
  {
    id: "the-gray-man",
    title: "The Gray Man",
    kicker: "N FILM",
    description:
      "A CIA operative uncovers agency secrets and becomes the top target of a relentless former colleague.",
    year: 2022,
    maturity: "PG-13",
    runtime: "2h 09m",
    match: 91,
    genres: ["Action", "Thriller"],
    tags: ["Popular", "Only on Netflix", "Movie", "Action"]
  },
  {
    id: "leave-the-world-behind",
    title: "Leave the World Behind",
    kicker: "N FILM",
    description:
      "A family getaway unravels as a mysterious blackout spreads and trust collapses between strangers sharing one house.",
    year: 2023,
    maturity: "R",
    runtime: "2h 21m",
    match: 94,
    genres: ["Thriller", "Drama", "Mystery"],
    tags: ["Trending", "Only on Netflix", "Movie"]
  },
  {
    id: "bird-box",
    title: "Bird Box",
    kicker: "N FILM",
    description:
      "A mother and two children attempt a blindfolded journey through a world where seeing means certain death.",
    year: 2018,
    maturity: "R",
    runtime: "2h 04m",
    match: 90,
    genres: ["Horror", "Thriller", "Drama"],
    tags: ["Popular", "Only on Netflix", "Movie"]
  },
  {
    id: "damsel",
    title: "Damsel",
    kicker: "N FILM",
    description:
      "A dutiful princess discovers her royal marriage was a trap and must battle a dragon to survive.",
    year: 2024,
    maturity: "PG-13",
    runtime: "1h 50m",
    match: 93,
    genres: ["Fantasy", "Action", "Adventure"],
    tags: ["New", "Trending", "Only on Netflix", "Movie", "Action"]
  },
  {
    id: "rebel-moon-part-one",
    title: "Rebel Moon - Part One: A Child of Fire",
    kicker: "N FILM",
    description:
      "A mysterious outsider recruits unlikely fighters to defend a peaceful colony from an empire's brutal campaign.",
    year: 2023,
    maturity: "PG-13",
    runtime: "2h 14m",
    match: 92,
    genres: ["Sci-Fi", "Action", "Adventure"],
    tags: ["Trending", "Only on Netflix", "Movie", "Action"]
  }
];

titles.forEach(title => {
  title.backdrop = `https://picsum.photos/seed/${title.id}-backdrop/1920/1080`;
  title.thumbnail = `https://picsum.photos/seed/${title.id}-thumbnail/640/360`;
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