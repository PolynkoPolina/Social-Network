const container = document.querySelector(".group-friends");
const friendElements = document.querySelectorAll('.group-friend');
const searchInput = document.querySelector('.search-input');

export function renderFriends(filter = "", container, friendElements) {
    let friendsDict = {};

    friendElements.forEach(el => {
        const name = el.querySelector('.friend-username')?.textContent.trim();

        if (!name) return;

        if (!name.toLowerCase().includes(filter.toLowerCase())) return;

        const letter = name[0].toUpperCase();

        if (!friendsDict[letter]) {
            friendsDict[letter] = [];
        }

        friendsDict[letter].push(el);
    });

    container.innerHTML = "";

    Object.keys(friendsDict).sort().forEach(letterKey => {

        const groupWrapper = document.createElement("div");
        groupWrapper.classList.add("letter-group");

        const letter = document.createElement("p");
        letter.textContent = letterKey;

        const hr = document.createElement("hr");

        groupWrapper.appendChild(letter);
        groupWrapper.appendChild(hr);

        friendsDict[letterKey].forEach(el => {
            groupWrapper.appendChild(el);
        });

        container.appendChild(groupWrapper);
    });
}


renderFriends("", container, friendElements);


searchInput.addEventListener("input", (e) => {
    renderFriends(e.target.value, container, friendElements);
});