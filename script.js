// ====== Password Setup ======
const CORRECT_PASSWORD = "091008";

// ====== Page Elements ======
const loginPage = document.getElementById("loginPage");
const listPage = document.getElementById("listPage");
const viewPage = document.getElementById("viewPage");

const loginBtn = document.getElementById("loginBtn");
const passwordInput = document.getElementById("passwordInput");
const loginError = document.getElementById("loginError");
const logoutBtn = document.getElementById("logoutBtn");
const backBtn = document.getElementById("backBtn");

const diaryList = document.getElementById("diaryList");
const diaryTitle = document.getElementById("diaryTitle");
const diaryContent = document.getElementById("diaryContent");

let diaries = []; // will load from diary.json

// ====== Load Diary Data from JSON ======
async function loadDiaries() {
  try {
    const response = await fetch("diary.json");
    if (!response.ok) throw new Error("Failed to load diary data");
    diaries = await response.json();
  } catch (error) {
    console.error("Error loading diaries:", error);
  }
}

// ====== Handle Login ======
loginBtn.addEventListener("click", async () => {
  if (passwordInput.value === CORRECT_PASSWORD) {
    await loadDiaries(); // load diaries only after correct password
    loginPage.classList.add("hidden");
    listPage.classList.remove("hidden");
    showDiaryList();
  } else {
    loginError.textContent = "Wrong password. Try again.";
  }
});

// ====== Show Diary List ======
function showDiaryList() {
  diaryList.innerHTML = "";
  diaries.forEach((diary, index) => {
    const li = document.createElement("li");
    li.textContent = diary.title;
    li.addEventListener("click", () => openDiary(index));
    diaryList.appendChild(li);
  });
}

// ====== Open Diary ======
function openDiary(index) {
  listPage.classList.add("hidden");
  viewPage.classList.remove("hidden");

  diaryTitle.textContent = diaries[index].title;
  diaryContent.textContent = diaries[index].content;
}

// ====== Back to Diary List ======
backBtn.addEventListener("click", () => {
  viewPage.classList.add("hidden");
  listPage.classList.remove("hidden");
});

// ====== Log Out ======
logoutBtn.addEventListener("click", () => {
  listPage.classList.add("hidden");
  loginPage.classList.remove("hidden");
  passwordInput.value = "";
});
