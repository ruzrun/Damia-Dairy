// --- Password and Secrets ---
const CORRECT_PASSWORD = "091008";
const AUTHOR_NAME = "Secret Admirer";

// --- Elements ---
const loginSection = document.getElementById("loginSection");
const diarySection = document.getElementById("diarySection");
const diaryList = document.getElementById("diaryList");
const diaryContent = document.getElementById("diaryContent");
const authorName = document.getElementById("authorName");

// --- Login Function ---
function login() {
  const inputPassword = document.getElementById("passwordInput").value.trim();

  if (inputPassword === CORRECT_PASSWORD) {
    loginSection.style.display = "none";
    diarySection.style.display = "block";
    authorName.textContent = AUTHOR_NAME;
    loadDiary();
  } else {
    alert("Wrong password. Try again.");
  }
}

// --- Logout Function ---
function logout() {
  diarySection.style.display = "none";
  diaryList.innerHTML = "";
  diaryContent.innerHTML = "";
  loginSection.style.display = "block";
}

// --- Load Diary JSON ---
async function loadDiary() {
  try {
    const response = await fetch("diary.json");
    if (!response.ok) throw new Error("Failed to load diary");
    const diaries = await response.json();
    displayDiaryList(diaries);
  } catch (err) {
    console.error("Error loading diary:", err);
    diaryList.innerHTML = <p style="color:red;">Failed to load diary entries.</p>;
  }
}

// --- Display Diary List ---
function displayDiaryList(diaries) {
  diaryList.innerHTML = ""; // Clear old content

  diaries.forEach((entry, index) => {
    const listItem = document.createElement("button");
    listItem.textContent = entry.title;
    listItem.className = "diary-item";
    listItem.onclick = () => showDiary(entry);
    diaryList.appendChild(listItem);
  });
}

// --- Show Selected Diary ---
function showDiary(entry) {
  diaryContent.innerHTML = `
    <h2>${entry.title}</h2>
    <p><em>${entry.date}</em></p>
    <p>${entry.content}</p>
    <button onclick="closeDiary()">Back to list</button>
  `;
}

// --- Back to list ---
function closeDiary() {
  diaryContent.innerHTML = "";
}
