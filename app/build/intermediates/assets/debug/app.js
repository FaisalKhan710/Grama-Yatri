// ===== DATA =====

const stops = [
  { name: "Gubbi",        km: 0  },
  { name: "Kyathasandra", km: 7  },
  { name: "Koratagere X", km: 14 },
  { name: "Madhure",      km: 22 },
  { name: "Huliyar",      km: 31 },
  { name: "Sira",         km: 39 },
  { name: "Tiptur",       km: 47 },
  { name: "Kunigal",      km: 54 },
  { name: "Tumkur",       km: 62 },
];

const users = [
  { name: "Ravi",    stop: 0, color: "#E8591A" },
  { name: "Lakshmi", stop: 2, color: "#1A6B3A" },
  { name: "Suresh",  stop: 4, color: "#1A5FA0" },
  { name: "Geetha",  stop: 6, color: "#6B4E37" },
];

// ===== STATE =====

let busStop = 2;       // index of current bus position
let currentUser = 0;   // index of active user
const stopRef = db.ref("currentBusStop");
let pingCooldown = false;

// ===== ETA LOGIC =====

/**
 * Returns ETA label and type for the current user based on bus position.
 * Average travel time between adjacent stops = 8 minutes.
 */
function etaForUser() {
  const userStop = users[currentUser].stop;

  if (busStop > userStop)  return { label: "Passed",    type: "passed"   };
  if (busStop === userStop) return { label: "Here!",     type: "arriving" };

  const mins = (busStop < userStop ? userStop - busStop : busStop - userStop) * 8;

  if (mins <= 15) return { label: "~" + mins + " min", type: "arriving" };
  if (mins <= 30) return { label: "~" + mins + " min", type: "soon"     };
  return              { label: "~" + mins + " min", type: "later"    };
}

// ===== RENDER STEPPER =====

function renderStepper() {
  const container = document.getElementById("stepper");
  const userStop  = users[currentUser].stop;

  container.innerHTML = stops.map((stop, i) => {
    let dotClass  = "";
    let lineClass = "";
    let busChip   = "";
    let reporterTag = "";
    let etaChip   = "";

    // Dot and line states
    if (i < busStop)       { dotClass = "passed"; lineClass = "passed"; }
    else if (i === busStop){ dotClass = "has-bus"; lineClass = "active"; }

    // Bus location chip + reporter
    if (i === busStop) {
      busChip     = `<span class="bus-here-chip">🚌 Bus here</span>`;
      reporterTag = `<div class="reporter-chip">👤 Reported by ${users[currentUser].name}</div>`;
    }

    // ETA chip for this user's stop
    if (i === userStop) {
      const e = etaForUser();
      etaChip = `<span class="eta-chip ${e.type}">${e.label}</span>`;
    }

    const isActive = (i === userStop);
    const isPassed = (i < busStop && i < userStop);

    return `
      <div class="stop-item ${isActive ? "active" : ""} ${isPassed ? "passed" : ""}"
           onclick="selectUserStop(${i})">
        <div class="stop-left">
          <div class="stop-dot ${dotClass}"></div>
          ${i < stops.length - 1
            ? `<div class="stop-line ${lineClass}"></div>`
            : ""}
        </div>
        <div class="stop-right">
          <div class="stop-name">
            ${stop.name} ${busChip} ${etaChip}
          </div>
          <div class="stop-sub">${stop.km} km from Gubbi</div>
          ${reporterTag}
        </div>
      </div>`;
  }).join("");

  document.getElementById("busStopLabel").textContent =
    "Bus at " + stops[busStop].name;
}

// ===== RENDER USER CHIPS =====

function renderUsers() {
  const row = document.getElementById("userRow");

  row.innerHTML = users.map((u, i) => `
    <div class="user-chip ${i === currentUser ? "active" : ""}"
         onclick="switchUser(${i})">
      <div class="user-avatar" style="background:${u.color}">
        ${u.name[0]}
      </div>
      ${u.name} · Stop ${u.stop + 1}
    </div>`).join("");

  document.getElementById("userName").textContent =
    users[currentUser].name + " ▾";
}

// ===== USER ACTIONS =====

function switchUser(i) {
  currentUser = i;
  renderStepper();
  renderUsers();
  showToast("Switched to " + users[i].name + " at " + stops[users[i].stop].name);
}

function selectUserStop(i) {
  users[currentUser].stop = i;
  renderStepper();
  renderUsers();
}

// ===== BUS PING =====

function ping(type) {
  if (pingCooldown) {
    showToast("Please wait before pinging again");
    return;
  }

  pingCooldown = true;
  const btn = document.getElementById("btn-" + type);
  btn.classList.add("pinged");

  if (type === "onbus") {
    busStop = users[currentUser].stop;
    document.getElementById("pingSuccessText").textContent =
      "Ping sent! Bus is at " + stops[busStop].name + ". ETA updated for all.";
  } else {
    busStop = Math.max(0, users[currentUser].stop - 1);
    document.getElementById("pingSuccessText").textContent =
      "Bus just passed " + stops[users[currentUser].stop].name +
      "! Passengers ahead notified.";
  }
  stopRef.set({
      stop: busStop,
      reporter: users[currentUser].name,
      type: type,
      timestamp: Date.now()
  });

  document.getElementById("pingSuccess").classList.remove("hidden");
  renderStepper();
  showToast("✅ Ping reported by " + users[currentUser].name);

  // Simulate bus moving forward after 6 seconds
  setTimeout(() => {
    if (busStop < stops.length - 1) {
      busStop++;
      renderStepper();
      showToast("🚌 Bus moved to " + stops[busStop].name);
    }
    btn.classList.remove("pinged");
    document.getElementById("pingSuccess").classList.add("hidden");
    pingCooldown = false;
  }, 6000);
}

// ===== ALERT BANNER =====

function dismissAlert() {
  document.getElementById("alertBanner").classList.add("hidden");
}

// ===== ALERT MODAL =====

function openAlertModal() {
  document.getElementById("alertModal").classList.add("show");
}

function closeAlertModal() {
  document.getElementById("alertModal").classList.remove("show");
}

function submitAlert() {
  const type = document.getElementById("alertType").value;
  const msg  = document.getElementById("alertMsg").value;

  closeAlertModal();

  // Update banner
  document.getElementById("alertBanner").classList.remove("hidden");
  document.getElementById("alertTitle").textContent = type;
  document.getElementById("alertDesc").textContent  =
    msg || "User reported issue on Route 47B.";
  document.getElementById("alertReporter").textContent =
    "Reported by " + users[currentUser].name + " · just now";

  showToast("⚠️ Alert posted to all passengers");

  // Reset form
  document.getElementById("alertMsg").value = "";
}

// ===== TOAST =====

function showToast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2500);
}

// ===== INIT =====

renderStepper();
renderUsers();
stopRef.on("value", (snapshot) => {

    const data = snapshot.val();

    if (data) {

        busStop = data.stop;

        console.log("Updated by:", data.reporter);

        renderStepper();
        renderUsers();
    }

});
