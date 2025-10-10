document.addEventListener("DOMContentLoaded", () => {
  const correctPassword = "091008";

  // Pages
  const loginPage = document.getElementById("loginPage");
  const listPage = document.getElementById("listPage");
  const viewPage = document.getElementById("viewPage");

  // Login elements
  const passwordInput = document.getElementById("passwordInput");
  const loginBtn = document.getElementById("loginBtn");
  const loginError = document.getElementById("loginError");

  // Diary elements
  const diaryList = document.getElementById("diaryList");
  const diaryTitle = document.getElementById("diaryTitle");
  const diaryContent = document.getElementById("diaryContent");
  const logoutBtn = document.getElementById("logoutBtn");
  const backBtn = document.getElementById("backBtn");

  let diaries = [1];

  // Prepare audio 
  const audio = new Audio("audio/mySong.mp3");
  audio.loop = true; // audio akan repeat


  // ✅ Handle login click (works across all devices)
  const handleLogin = () => {
    const password = passwordInput.value.trim();
    if (password === correctPassword) {
      loginPage.classList.add("hidden");
      listPage.classList.remove("hidden");
      loadDiaries();
    } else {
      loginError.textContent = "Incorrect password. Try again.";
    }
  };

  loginBtn.addEventListener("click", handleLogin);
  loginBtn.addEventListener("touchstart", handleLogin); // mobile tap fix

  // ✅ Load diary list from JSON
  function loadDiaries() {
    fetch("diary.json")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load diary.json");
        return res.json();
      })
      .then((data) => {
        diaries = data.diaries;
        diaryList.innerHTML = "";
        diaries.forEach((entry, index) => {
          const li = document.createElement("li");
          li.textContent = entry.title;
          li.addEventListener("click", () => openDiary(index));
          diaryList.appendChild(li);
        });
      })
      .catch((err) => {
        diaryList.innerHTML = <li style="color:red;">Error loading diaries 😢/li>;
        console.error(err);
      });
  }

  // ✅ View diary details
  function openDiary(index) {
    const entry = diaries[index];
    if (!entry) return;
    listPage.classList.add("hidden");
    viewPage.classList.remove("hidden");
    diaryTitle.textContent = entry.title;
    diaryContent.textContent = entry.content;
  }

  // ✅ Back to list
  backBtn.addEventListener("click", () => {
    viewPage.classList.add("hidden");
    listPage.classList.remove("hidden");
  });

  // ✅ Logout
  logoutBtn.addEventListener("click", () => {
    listPage.classList.add("hidden");
    viewPage.classList.add("hidden");
    loginPage.classList.remove("hidden");
    passwordInput.value = "";
    loginError.textContent = "";
  });
});
