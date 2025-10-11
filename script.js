document.addEventListener("DOMContentLoaded", () => {
  const correctPassword = "091008";

  // Pages
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

  let diaries = [];

  // 🎵 Prepare background audio
  const audio = new Audio("audio/mySong.mp3");
  audio.loop = true;
  audio.volume = 0; // start silent for fade in

  // 🎵 Fade In Function
  function fadeInAudio() {
    let fade = setInterval(() => {
      if (audio.volume < 1) {
        audio.volume = Math.min(1, audio.volume + 0.1);
      } else {
        clearInterval(fade);
      }
    }, 200);
  }

  // 🎵 Fade Out Function
  function fadeOutAudio(callback) {
    let fade = setInterval(() => {
      if (audio.volume > 0.1) {
        audio.volume = Math.max(0, audio.volume - 0.1);
      } else {
        clearInterval(fade);
        audio.pause();
        audio.currentTime = 0;
        if (callback) callback();
      }
    }, 200);
  }

  // ✅ Handle login click
  const handleLogin = () => {
    const password = passwordInput.value.trim();

    if (password === correctPassword) {
      loginPage.classList.add("hidden");
      listPage.classList.remove("hidden");
      loadDiaries();

      // 🎵 Try to play the song
      audio.play().then(fadeInAudio).catch(() => {
        console.log("Autoplay blocked — waiting for user tap");
        document.body.addEventListener("click", () => {
          audio.play();
          fadeInAudio();
        }, { once: true });
      });
    } else {
      loginError.textContent = "Incorrect password. Try again.";
    }
  };

  // 🔘 Create login button dynamically (if not in HTML)
  let loginBtn = document.getElementById("loginBtn");
  if (!loginBtn) {
    loginBtn = document.createElement("button");
    loginBtn.id = "loginBtn";
    loginBtn.textContent = "Login";
    loginPage.appendChild(loginBtn);
  }

  loginBtn.addEventListener("click", handleLogin);
  loginBtn.addEventListener("touchstart", handleLogin);

  // ✅ Load diary list
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
        diaryList.innerHTML = <li style="color:red;">Error loading diaries 😢</li>;
        console.error(err);
      });
  }

  // ✅ Open diary view
  function openDiary(index) {
    const entry = diaries[index];
    if (!entry) return;
    listPage.classList.add("hidden");
    viewPage.classList.remove("hidden");
    diaryTitle.textContent = entry.title;
    diaryContent.textContent = entry.content;
  }

  // ✅ Back button
  backBtn.addEventListener("click", () => {
    viewPage.classList.add("hidden");
    listPage.classList.remove("hidden");
  });

  // ✅ Logout with fade-out
  logoutBtn.addEventListener("click", () => {
    listPage.classList.add("hidden");
    viewPage.classList.add("hidden");
    loginPage.classList.remove("hidden");
    passwordInput.value = "";
    loginError.textContent = "";

    fadeOutAudio();
  });
});
