const mainBlock = document.getElementById("friendsMain");
const sectionBlock = document.getElementById("section");
const sectionTitle = document.getElementById("sectionTitle");
const sectionList = document.getElementById("sectionList");
const sectionSentinel = document.getElementById("loadSentinel");
const backMainButtons = document.querySelectorAll(".back-main");
const sectionButtons = document.querySelectorAll("[data-section-link]");

const friendsMain = document.getElementById("friendsButtonMain");
const friendsRequests = document.getElementById("friendsButtonRequests");
const friendsRecommendations = document.getElementById("friendsButtonRecommendations");
const allFriends = document.getElementById("allFriendsButton");



sectionBlock.classList.add("disabled")

const sectionTitles = {
  requests: "Запити",
  recommendations: "Рекомендації",
  friends: "Всі Друзі",
};

const sections = {
  requests: friendsRequests,
  recommendations: friendsRecommendations,
  friends: allFriends,
  main: friendsMain,
};


let currentSection = "";
let currentPage = 1;
let hasNextPage = false;
let isLoading = false;


sectionButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    await openSection(button.dataset.sectionLink);
  });
});


async function openSection(section) {
  currentSection = section;
  currentPage = 1;
  hasNextPage = false;
  sectionTitle.textContent = sectionTitles[section];
  sectionList.innerHTML = "";
  mainBlock.classList.add('disabled');
  sectionBlock.classList.remove('disabled');
  friendsMain.classList.remove('chosen')
 
  Object.values(sections).forEach(el => {
    if (el) el.classList.remove('chosen');
  });
  

  const active = sections[section];
  if (active) {
    active.classList.add('chosen');
  }

  await loadSectionPage(section, currentPage);
}


async function loadSectionPage(section, page) {
  isLoading = true;
  const response = await fetch(`/friends/${section}/?page=${page}`, {
    headers: { "X-Requested-With": "XMLHttpRequest" },
  });
  const data = await response.json();
  sectionList.insertAdjacentHTML("beforeend", data.html);
  connectFriendActionButtons(sectionList);
  hasNextPage = data.has_next_page;
  isLoading = false;
  console.log("scroll", sectionBlock.scrollHeight, sectionBlock.clientHeight);
}


const observer = new IntersectionObserver(
  async (entries) => {
    if (entries[0].isIntersecting && hasNextPage && isLoading == false) {
      currentPage++;
      await loadSectionPage(currentSection, currentPage);
    }
  },
  {
    rootMargin: "50px",
  }
);

observer.observe(sectionSentinel);

backMainButtons.forEach((button) => {
  button.addEventListener("click", () => {
    openMain();
  });
});

function openMain() {
  sectionBlock.classList.add('disabled');
  sectionList.innerHTML = "";
  currentSection = "";
  hasNextPage = false;
  mainBlock.classList.remove('disabled');
   Object.values(sections).forEach(el => {
    if (el) el.classList.remove('chosen');
  });
  friendsMain.classList.add('chosen');
}