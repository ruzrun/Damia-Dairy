// ========== CONFIG ==========
const PASSWORD = "091008"; // your secret number password
const USERNAME = "Secret Admirer"; // optional use later (for design maybe)
const DIARY_URL = "https://raw.githubusercontent.com/ruzrun/Damia-Dairy/main/diary.json";
// Example: "https://raw.githubusercontent.com/warun123/DamiaDiary/main/diary.json"

// ========== LOGIN FUNCTION ==========
function login() {
  const input = document.getElementById("passwordInput").value.trim();
  if (input === PASSWORD) {
    document.getElementById("loginSection").style.display = "none";
    document.getElementById("diarySection").style.display = "block";
    loadDiaryList(); // Load diary after login success
  } else {
    alert("Wrong password 😅");
  }
}

// ========== LOGOUT ==========
function logout() {
  document.getElementById("loginSection").style.display = "block";
  document.getElementById("diarySection").style.display = "none";
  document.getElementById("diaryList").innerHTML = "";
  document.getElementById("diaryContent").innerHTML = "";
  document.getElementById("passwordInput").value = "";
}

// ========== LOAD DIARY LIST FROM JSON ==========
async function loadDiaryList() {
  try {
    const response = await fetch(DIARY_URL);
    if (!response.ok) throw new Error("Failed to load diary.json");
    const diaries = await response.json();

    const listContainer = document.getElementById("diaryList");
    listContainer.innerHTML = "";

    diaries.forEach((entry, index) => {
      const item = document.createElement("button");
      item.className = "diary-item";
      item.textContent = entry.title;
      item.onclick = () => showDiary(entry);
      listContainer.appendChild(item);
    });

  } catch (err) {
    console.error(err);
    alert("Failed to load diary. Check your repo name or file link.");
  }
}

// ========== SHOW DIARY CONTENT ==========
function showDiary(entry) {
  const contentBox = document.getElementById("diaryContent");
  contentBox.innerHTML = `
    <h2>${entry.title}</h2>
    <p class="date">${entry.date}</p>
    <p class="text">${entry.content}</p>
  `;
}
