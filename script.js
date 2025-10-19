document.addEventListener("DOMContentLoaded", () => {
  const correctPassword = "091008";

  // Pages
  const loginPage = document.getElementById("loginPage");
  const listPage = document.getElementById("listPage");
  const viewPage = document.getElementById("viewPage");

  // Login elements
  const passwordInput = document.getElementById("passwordInput");
  const togglePasswordBtn = document.getElementById("togglePasswordBtn");
  const loginBtn = document.getElementById("loginBtn");
  const loginError = document.getElementById("loginError");

  // Diary elements
  const diaryList = document.getElementById("diaryList");
  const diaryTitle = document.getElementById("diaryTitle");
  const diaryContent = document.getElementById("diaryContent");
  const logoutBtn = document.getElementById("logoutBtn");
  const backBtn = document.getElementById("backBtn");

  let diaries = [];

  // Prepare audio
  const audio = new Audio("audio/audio.mp3");
  audio.loop = true; // audio akan repeat

  // Toggle password visibility
  togglePasswordBtn.addEventListener("click", () => {
    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      togglePasswordBtn.textContent = "Hide";
    } else {
      passwordInput.type = "password";
      togglePasswordBtn.textContent = "Show";
    }
  });

  // ✅ Handle login click (works across all devices)
  const handleLogin = () => {
    const password = passwordInput.value.trim();
    if (password === correctPassword) {
      loginPage.classList.add("hidden");
      listPage.classList.remove("hidden");
      loadDiaries();
      audio.play(); // Play audio after successful login

      // Display current date with day of the week
      const now = new Date();
      const options = { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' };
      const formattedDate = now.toLocaleDateString('en-US', options); // e.g., "Sunday, 19 Oct 2025"
      document.getElementById("currentDate").textContent = formattedDate;
    } else {
      loginError.textContent = "Password Salah. Masukkan Tarikh Birthday.";
    }
  };

  loginBtn.addEventListener("click", handleLogin);
  loginBtn.addEventListener("touchstart", handleLogin); // mobile tap fix

  async function logVisit(note) {
  try {
    await fetch("https://script.google.com/macros/s/AKfycbwK1nKprehPduuTM1hIaNwIX4tLUywHL-GAJjZL4DAs7KjCHWtl9SKBFnxjxrvhH1_ZJA/exec", {
      method: "POST",
      body: JSON.stringify({ message: note }),
      headers: { "Content-Type": "application/json" },
      mode: "no-cors" // untuk elak CORS error
    });
  } catch (err) {
    console.error("Log failed:", err);
  }
}

  // ✅ Load diary list from JSON
  function loadDiaries() {
    fetch("diary.json")
      .then((res) => {
        console.log('Fetch status:', res.status);  // Logs 200, 404, etc.
        console.log('Fetch URL:', res.url);  // Shows the full path it's trying
        if (!res.ok) throw new Error("Failed to load diary.json - Status: " + res.status);
        return res.json();
      })
      .then((data) => {
        console.log('Loaded data:', data);  // Logs the JSON if successful
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
        diaryList.innerHTML = '<li style="color:black;">Sorry.. Tak Dapat Nak Access</li>';
        console.error('Fetch error:', err.message);  // Logs the real error
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
    document.getElementById("diaryDate").textContent = entry.date ? entry.date : ''; // Load date from JSON; empty if missing
  }

  // ✅ Back to list
  backBtn.addEventListener("click", () => {
    viewPage.classList.add("hidden");
    listPage.classList.remove("hidden");
  });

 // jika di bukak google sheet detect 
    logVisit("Opened");
  
  // ✅ Logout 76
  logoutBtn.addEventListener("click", () => {
    listPage.classList.add("hidden");
    viewPage.classList.add("hidden");
    loginPage.classList.remove("hidden");
    passwordInput.value = "";
    loginError.textContent = "";
    audio.pause(); // Pause audio on logout
    audio.currentTime = 0; // Reset audio
  });
});
