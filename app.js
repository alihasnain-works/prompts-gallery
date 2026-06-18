// ===========================================================
// APP.JS — Website ka "engine"
// Yeh file prompts-data.js se data leti hai aur cards
// khud-ba-khud HTML mein render karti hai.
// Naya prompt add karne ke liye sirf prompts-data.js edit karein,
// yeh file touch karne ki zaroorat nahi.
// ===========================================================

const CARDS_PER_PAGE = 20; // ek baar mein kitne cards dikhaye jayein

let currentSearchTerm = "";
let visibleCount = CARDS_PER_PAGE;

const cardsContainer = document.getElementById("cards-container");
const searchInput = document.getElementById("search-input");
const resultsCount = document.getElementById("results-count");
const noResults = document.getElementById("no-results");
const loadMoreWrap = document.getElementById("load-more-wrap");
const loadMoreBtn = document.getElementById("load-more-btn");

// Ek single prompt card ka HTML banata hai
function createCard(prompt) {
  const article = document.createElement("article");
  article.className = "card";

  article.innerHTML = `
    <img src="${prompt.image}" alt="Prompt ${prompt.id}" loading="lazy">
    <div class="prompt-header">
      <h3>Prompt ${prompt.id}</h3>
      <div class="toggle-btn" onclick="togglePrompt(this)"></div>
    </div>
    <p class="prompt-text">${prompt.text}</p>
    <button class="btn copy-btn" onclick="copyPrompt(this)">Copy Prompt</button>
  `;

  return article;
}

// Filter logic: search term ko prompt text aur number se match karta hai
function getFilteredPrompts() {
  if (!currentSearchTerm) return promptsData;
  const term = currentSearchTerm.toLowerCase();
  return promptsData.filter(p =>
    p.text.toLowerCase().includes(term) ||
    String(p.id).includes(term)
  );
}

// Cards ko render karta hai (search + load-more dono ke liye)
function renderCards() {
  const filtered = getFilteredPrompts();
  const toShow = filtered.slice(0, visibleCount);

  cardsContainer.innerHTML = "";
  toShow.forEach(prompt => {
    cardsContainer.appendChild(createCard(prompt));
  });

  // No results message
  if (filtered.length === 0) {
    noResults.classList.add("show");
  } else {
    noResults.classList.remove("show");
  }

  // Results count text
  if (currentSearchTerm) {
    resultsCount.textContent = `${filtered.length} result${filtered.length !== 1 ? "s" : ""} mil gaye`;
    resultsCount.style.display = "block";
  } else {
    resultsCount.style.display = "none";
  }

  // Load more button: tab dikhana jab filtered list mein abhi bhi cards bachi hon
  if (visibleCount < filtered.length) {
    loadMoreWrap.style.display = "block";
  } else {
    loadMoreWrap.style.display = "none";
  }
}

// Search input par har keystroke pe filter
searchInput.addEventListener("input", (e) => {
  currentSearchTerm = e.target.value.trim();
  visibleCount = CARDS_PER_PAGE; // naya search shuru hote hi count reset
  renderCards();
});

// Load more button click
loadMoreBtn.addEventListener("click", () => {
  visibleCount += CARDS_PER_PAGE;
  renderCards();
});

// ===========================================================
// COPY PROMPT — clipboard mein prompt text copy karta hai
// ===========================================================
function copyPrompt(button) {
  const text = button.parentElement.querySelector(".prompt-text").innerText;
  navigator.clipboard.writeText(text).then(() => {
    button.innerText = "Copied! ✅";
    setTimeout(() => (button.innerText = "Copy Prompt"), 2000);
  });
}

// ===========================================================
// TOGGLE PROMPT — prompt text show/hide karta hai
// ===========================================================
function togglePrompt(button) {
  const promptText = button.parentElement.nextElementSibling;
  promptText.classList.toggle("show");
  button.classList.toggle("active");
}

// Initial render jab page load ho
renderCards();
