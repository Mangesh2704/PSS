  // ================= GLOBAL DATA =================
let step = 0;
let userData = { 
  name: "",
  phone: "",
  interest: "General Inquiry"
};

// ================= TOGGLE =================
function toggleChat() {
  let box = document.getElementById("chatBox");
  box.style.display = box.style.display === "flex" ? "none" : "flex";
}

// ================= ENTER KEY =================
function handleKey(e) {
  if (e.key === "Enter") sendMessage();
}

// ================= QUICK REPLY =================
function quickReply(text) {
  document.getElementById("userInput").value = text;
  sendMessage();
}

// ================= SEND MESSAGE =================
function sendMessage() {
  let input = document.getElementById("userInput");
  let msg = input.value.trim();
  if (!msg) return;

  addMessage(msg, "user");
  input.value = "";

  showTyping();

  setTimeout(() => {
    botReply(msg.toLowerCase());
  }, 3000 + Math.random() * 1000); // realistic delay
}

// ================= ADD MESSAGE =================
function addMessage(text, sender) {
  let chat = document.getElementById("chatBody");

  let msg = document.createElement("div");
  msg.className = sender === "user" ? "user-msg" : "bot-msg";
  msg.innerHTML = text;

  chat.appendChild(msg);
  chat.scrollTop = chat.scrollHeight;
}

// ================= TYPING =================
function showTyping() {
  let chat = document.getElementById("chatBody");

  let typing = document.createElement("div");
  typing.className = "typing";
  typing.id = "typing";

  typing.innerHTML = "<span></span><span></span><span></span>";

  chat.appendChild(typing);
  chat.scrollTop = chat.scrollHeight;
}

function removeTyping() {
  let typing = document.getElementById("typing");
  if (typing) {
    typing.style.opacity = "0";
    setTimeout(() => typing.remove(), 200);
  }
}

// ================= SEND TO GOOGLE (SHEETS + EMAIL) =================
function sendToGoogleSheets() {
  let chatMessages = document.querySelectorAll("#chatBody .bot-msg, #chatBody .user-msg");
  let fullConversation = "";

  chatMessages.forEach(msg => {
    fullConversation += (msg.classList.contains("user-msg") ? "User: " : "Bot: ") + msg.innerText + "\n";
  });

  // Current - Advanced Version
  fetch("https://script.google.com/macros/s/AKfycbxsHCpsT1ooW8yI98vDznOPnZNBlm58YkZJdCA8L3N4nUvtlA55baue_N6vA9GM0I5S/exec", { // Replace with Web App URL
    /* 

    // Moderate Version
    https://script.google.com/macros/s/AKfycbwMZNy28hAjmkV2EGy3gRxkBZas844xw2nL79ZikvcflPkSfLzCxDlR4RZ3-DrZUgYg/exec
   
   // Basic Version

   https://script.google.com/macros/s/AKfycbwA-CSSrQoKgwMlvNiOkPPPoeHOQYr9Z4WnHP42S2H9jKFdq43iSojVD6va_EFDO3Tc/exec
    */

    method: "POST",
    body: JSON.stringify({
      name: userData.name || "N/A",
      phone: userData.phone || "N/A",
      interest: userData.interest || "General Inquiry",
      message: fullConversation
    })
  })
  .then(res => res.text())
  .then(res => console.log("Success:", res))
  .catch(err => console.error("Error:", err));
}

// ================= BOT LOGIC =================
function botReply(msg) {

  removeTyping();
  let reply = "";

  // ===== TRACK INTEREST =====
  if (msg.includes("cctv") || msg.includes("camera")) {
    userData.interest = "CCTV Systems";
  } 
  else if (msg.includes("fire")) {
    userData.interest = "Fire Alarm Systems";
  } 
  else if (msg.includes("access")) {
    userData.interest = "Access Control";
  }

  // ===== LEAD FLOW =====
  if (step === 1) {
    userData.name = msg;
    step = 2;
    addMessage("Great 👍 Please share your phone number so our expert can contact you.", "bot");
    return;
  }

  if (step === 2) {
    userData.phone = msg;
    step = 0;

    addMessage(
      `✅ Thank you ${userData.name}!<br>
      Our security expert will contact you shortly on <b>${userData.phone}</b>.<br><br>
      We’ve saved your request successfully 🔐`,
      "bot"
    );

    // 🔥 SEND DATA (Sheets + Email)
    sendToGoogleSheets();

    return;
  }

  // ===== SMART RESPONSES =====

  if (msg.includes("cctv") || msg.includes("camera")) {
    reply = `📹 <b>CCTV Surveillance Systems</b><br><br>
    • HD & IP Cameras<br>
    • Night Vision Support<br>
    • Mobile Live View<br>
    • 24/7 Recording<br><br>
    Perfect for homes, offices & shops.<br><br>
    👉 Want a quick quote?`;
  }

  else if (msg.includes("fire")) {
    reply = `🔥 <b>Fire Alarm & Detection Systems</b><br><br>
    • Smoke & Heat Sensors<br>
    • Instant Alerts<br>
    • Safety Compliance<br><br>
    Protect your property & people from fire hazards.`;
  }

  else if (msg.includes("access")) {
    reply = `🚪 <b>Access Control Systems</b><br><br>
    • Biometric Access<br>
    • RFID Card Systems<br>
    • Door Automation<br><br>
    Ideal for offices & restricted areas.`;
  }

  else if (msg.includes("price") || msg.includes("quote") || msg.includes("cost")) {
    reply = `💰 Pricing depends on your requirement.<br><br>
    Let me get a quick quote for you.<br><br>
    👉 What is your name?`;
    step = 1;
  }

  else if (msg.includes("contact")) {
    reply = `📞 <b>Contact Us</b><br><br>
    Phone: +91 98199 80899<br>
    Email: info@parassecurity.com<br><br>
    📍 Vile Parle East, Mumbai`;
  }

  else if (msg.includes("service")) {
    reply = `🛠 <b>Our Services</b><br><br>
    • CCTV Installation<br>
    • Fire Alarm Systems<br>
    • Smart Home Automation<br>
    • Access Control<br>
    • 24/7 Monitoring`;
  }

  else if (msg.includes("hello") || msg.includes("hi")) {
    reply = `Hello 👋<br><br>
    Welcome to <b>Paras Security Systems</b> 🔐<br><br>
    How can I assist you today?`;
  }

  else {
    reply = `I can help you with:<br><br>
    📹 CCTV Systems<br>
    🔥 Fire Alarm Systems<br>
    🚪 Access Control<br>
    💰 Pricing & Quotes<br><br>
    Just tell me what you're looking for 😊`;
  }

  addMessage(reply, "bot");
}