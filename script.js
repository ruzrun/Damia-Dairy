document.addEventListener("DOMContentLoaded", () => {
  const correctPassword = "091008";
  let entered = "";

  // Pages
  const loginPage = document.getElementById("loginPage");
  const listPage = document.getElementById("listPage");
  const viewPage = document.getElementById("viewPage");

  const passwordDisplay = document.getElementById("passwordDisplay");
  const loginError = document.getElementById("loginError");

  const diaryList = document.getElementById("diaryList");
  const diaryTitle = document.getElementById("diaryTitle");
  const diaryContent = document.getElementById("diaryContent");
  const logoutBtn = document.getElementById("logoutBtn");
  const backBtn = document.getElementById("backBtn");

  let diaries = [];

  // 🎵 Audio setup
  const audio = new Audio("audio/audio.mp3"); // Put your file in /audio/mySong.mp3
  audio.loop = true;
  audio.volume = 0;

  // Fade-in effect for music
  function fadeInAudio() {
    let fadeInterval = setInterval(() => {
      if (audio.volume < 1) {
        audio.volume = Math.min(1, audio.volume + 0.05);
      } else {
        clearInterval(fadeInterval);
      }
    }, 200);
  }

  // Update password dots
  function updateDisplay() {
    passwordDisplay.textContent = entered
      .split("")
      .map(() => "•")
      .join(" ") + "•".repeat(6 - entered.length);
  }

  // Handle keypad presses
  document.querySelectorAll(".key").forEach((btn) => {
    btn.addEventListener("click", () => {
      const value = btn.textContent.trim();

      if (btn.classList.contains("clear")) {
        entered = "";
        loginError.textContent = "";
      } else if (btn.classList.contains("enter")) {
        checkPassword();
      } else if (entered.length < 6) {
        entered += value;
      }
      updateDisplay();
    });
  });

  // ✅ Check password and play audio on success
  function checkPassword() {
    if (entered === correctPassword) {
      loginPage.classList.add("hidden");
      listPage.classList.remove("hidden");
      loadDiaries();

      // Start playing the music
      audio.currentTime = 0;
      audio.play()
        .then(() => fadeInAudio())
        .catch((err) => console.error("Autoplay blocked:", err));
    } else {
      loginError.textContent = "Incorrect password ❌";
      entered = "";
      updateDisplay();
    }
  }

  // Load diary entries
  function loadDiaries() {
    fetch("diary.json")
      .then((res) => res.json())
      .then((data) => {
        diaries = Array.isArray(data) ? data : data.diaries;
        diaryList.innerHTML = "";
        diaries.forEach((entry, i) => {
          const li = document.createElement("li");
          li.textContent = entry.title;
          li.addEventListener("click", () => openDiary(i));
          diaryList.appendChild(li);
        });
      })
      .catch(() => {
        diaryList.innerHTML = "<li> Unable to load diary </li>";
      });
  }

  function openDiary(index) {
    const entry = diaries[index];
    if (!entry) return;
    listPage.classList.add("hidden");
    viewPage.classList.remove("hidden");
    diaryTitle.textContent = entry.title;
    diaryContent.textContent = entry.content;
  }

  backBtn.addEventListener("click", () => {
    viewPage.classList.add("hidden");
    listPage.classList.remove("hidden");
  });

  logoutBtn.addEventListener("click", () => {
    listPage.classList.add("hidden");
    loginPage.classList.remove("hidden");
    entered = "";
    updateDisplay();
    audio.pause();
  });

  updateDisplay();
});
