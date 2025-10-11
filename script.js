document.addEventListener("DOMContentLoaded", () => {
  const correctPassword = "091008";

  // Pages (may be null if IDs differ)
  const loginPage = document.getElementById("loginPage");
  const listPage = document.getElementById("listPage");
  const viewPage = document.getElementById("viewPage");

  // Login elements
  const passwordInput = document.getElementById("passwordInput");
  const loginError = document.getElementById("loginError");

  // Diary elements
  const diaryList = document.getElementById("diaryList");
  const diaryTitle = document.getElementById("diaryTitle");
  const diaryContent = document.getElementById("diaryContent");
  const logoutBtn = document.getElementById("logoutBtn");
  const backBtn = document.getElementById("backBtn");

  // Safety checks for required elements
  if (!passwordInput || !loginPage || !listPage || !viewPage || !diaryList || !diaryTitle || !diaryContent) {
    console.error("One or more required DOM elements are missing. Check your HTML IDs.");
    return;
  }

  let diaries = [];

  // Audio setup (optional)
  const audio = new Audio("audio/audio.mp3");
  audio.loop = true;
  audio.volume = 0;

  // Fade helpers
  function fadeInAudio() {
    let fade = setInterval(() => {
      if (audio.volume < 1) audio.volume = Math.min(1, audio.volume + 0.1);
      else clearInterval(fade);
    }, 200);
  }
  function fadeOutAudio(callback) {
    let fade = setInterval(() => {
      if (audio.volume > 0.1) audio.volume = Math.max(0, audio.volume - 0.1);
      else {
        clearInterval(fade);
        audio.pause();
        audio.currentTime = 0;
        if (callback) callback();
      }
    }, 200);
  }

  // Login handler
  const handleLogin = () => {
    const password = (passwordInput.value || "").trim();
    if (password === correctPassword) {
      loginPage.classList.add("hidden");
      listPage.classList.remove("hidden");
      console.log("Password correct — loading diaries...");
      loadDiaries();

      // play audio with autoplay-safe fallback
      audio.play().then(fadeInAudio).catch(() => {
        console.log("Autoplay blocked; waiting for user interaction to start audio.");
        document.body.addEventListener("click", () => { audio.play().then(fadeInAudio).catch(()=>{}); }, { once: true });
      });
    } else {
      loginError.textContent = "Incorrect password. Try again.";
    }
  };

  // Ensure login button exists or create if missing
  let loginBtn = document.getElementById("loginBtn");
  if (!loginBtn) {
    loginBtn = document.createElement("button");
    loginBtn.id = "loginBtn";
    loginBtn.textContent = "Login";
    // place after password input (if present)
    passwordInput.insertAdjacentElement("afterend", loginBtn);
  }
  loginBtn.addEventListener("click", handleLogin);
  loginBtn.addEventListener("touchstart", handleLogin);

  // Load diaries robustly (supports array or object with "diaries")
  function loadDiaries() {
    fetch("diary.json")
      .then((res) => {
        if (!res.ok) throw new Error(Failed to load diary.json (status ${res.status}));
        return res.json();
      })
      .then((data) => {
        // Accept both: raw array OR object { diaries: [...] }
        const loaded = Array.isArray(data) ? data : (Array.isArray(data.diaries) ? data.diaries : []);
        diaries = loaded;
        console.log("Diaries loaded:", diaries.length, "entries");
        diaryList.innerHTML = "";
        if (diaries.length === 0) {
          diaryList.innerHTML = "<li>No diary entries yet.</li>";
          return;
        }
        diaries.forEach((entry, index) => {
          const li = document.createElement("li");
          li.textContent = entry.title || Entry ${index+1};
          li.className = "diary-item";
          li.addEventListener("click", () => openDiary(index));
          diaryList.appendChild(li);
        });
      })
      .catch((err) => {
        diaryList.innerHTML = <li style="color:red;">Error loading diaries 😢</li>;
        console.error("Error fetching/parsing diary.json:", err);
      });
  }

  // Open diary entry
  function openDiary(index) {
    const entry = diaries[index];
    if (!entry) {
      console.warn("No entry at index", index);
      return;
    }
    listPage.classList.add("hidden");
    viewPage.classList.remove("hidden");
    diaryTitle.textContent = entry.title || "Untitled";
    diaryContent.textContent = entry.content || "";
  }

  // Back button guard
  if (backBtn) backBtn.addEventListener("click", () => {
    viewPage.classList.add("hidden");
    listPage.classList.remove("hidden");
  });

  // Logout guard
  if (logoutBtn) logoutBtn.addEventListener("click", () => {
    listPage.classList.add("hidden");
    viewPage.classList.add("hidden");
    loginPage.classList.remove("hidden");
    passwordInput.value = "";
    loginError.textContent = "";
    fadeOutAudio();
  });

});
