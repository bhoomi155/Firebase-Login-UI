const firebaseConfig = {
  apiKey: "AIzaSyDJS_3tY3LcUZNwNRzugdMNKYmjGjfzelo",
  authDomain: "login-authentication-6561a.firebaseapp.com",
  databaseURL: "https://login-authentication-6561a-default-rtdb.firebaseio.com",
  projectId: "login-authentication-6561a",
  storageBucket: "login-authentication-6561a.firebasestorage.app",
  messagingSenderId: "528810056205",
  appId: "1:528810056205:web:f632116e488185cb439344"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// EmailJS init - apna Public Key daalo (emailjs.com dashboard se milega)
emailjs.init("YOUR_PUBLIC_KEY");

// ---------- REGISTER ----------
document.getElementById('register-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const form = this;
  const username = form.querySelector('input[placeholder="Username"]').value;
  const email = form.querySelector('input[placeholder="Email"]').value;
  const password = form.querySelector('input[placeholder="Password"]').value;

  firebase.database().ref('users/' + username).set({
    username,
    email,
    password
  }).then(() => {
    alert("✔ Registered Successfully. Data saved to Firebase.");
    form.submit();
  }).catch((error) => {
    alert("❌ Firebase Error: " + error.message);
  });
});

// ---------- LOGIN ----------
document.getElementById('login-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const username = document.querySelector('#login-form input[placeholder="Username"]').value;
  const password = document.querySelector('#login-form input[placeholder="Password"]').value;

  database.ref('users/' + username).get().then((snapshot) => {
    if (snapshot.exists()) {
      const userData = snapshot.val();
      if (userData.password === password) {
        alert("Login Successful 🎉");
      } else {
        alert("Incorrect password ❌");
      }
    } else {
      alert("User not found ❌");
    }
  }).catch((error) => {
    alert("Login Failed ❌: " + error.message);
  });
});

// ---------- FORGOT PASSWORD ----------
const container = document.querySelector('.container');
const forgotLink = document.getElementById('forgot-password-link');
const step1 = document.getElementById('forgot-step1-form');
const step2 = document.getElementById('forgot-step2-form');
const backToLogin1 = document.getElementById('back-to-login-1');
const backToLogin2 = document.getElementById('back-to-login-2');

let currentUsername = "";

function showForgotBox() {
  container.classList.add('show-forgot');
  step1.style.display = 'block';
  step2.style.display = 'none';
}

function showLoginBox() {
  container.classList.remove('show-forgot');
}

forgotLink.addEventListener('click', (e) => {
  e.preventDefault();
  showForgotBox();
});

backToLogin1.addEventListener('click', (e) => {
  e.preventDefault();
  showLoginBox();
});

backToLogin2.addEventListener('click', (e) => {
  e.preventDefault();
  showLoginBox();
});

// STEP 1: Send OTP to registered email
step1.addEventListener('submit', function (e) {
  e.preventDefault();
  const username = document.getElementById('forgot-username').value;
  currentUsername = username;

  database.ref('users/' + username).get().then((snapshot) => {
    if (!snapshot.exists()) {
      alert("User not found ❌");
      return;
    }
    const userData = snapshot.val();
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = Date.now() + 10 * 60 * 1000; // 10 minutes valid

    database.ref('users/' + username + '/resetOtp').set({ otp, expiry }).then(() => {
      emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", {
        to_email: userData.email,
        otp_code: otp
      }).then(() => {
        alert("OTP sent to your email 📧");
        step1.style.display = 'none';
        step2.style.display = 'block';
      }).catch((err) => alert("Email error: " + err.text));
    });
  }).catch((error) => alert("Error: " + error.message));
});

// STEP 2: Verify OTP and set new password
step2.addEventListener('submit', function (e) {
  e.preventDefault();
  const enteredOtp = document.getElementById('otp-input').value;
  const newPassword = document.getElementById('new-password').value;

  database.ref('users/' + currentUsername + '/resetOtp').get().then((snapshot) => {
    if (!snapshot.exists()) {
      alert("OTP expired or invalid, request again ❌");
      return;
    }
    const { otp, expiry } = snapshot.val();

    if (Date.now() > expiry) {
      alert("OTP expired, request a new one ⏰");
      return;
    }
    if (enteredOtp !== otp) {
      alert("Incorrect OTP ❌");
      return;
    }

    database.ref('users/' + currentUsername).update({ password: newPassword }).then(() => {
      database.ref('users/' + currentUsername + '/resetOtp').remove();
      alert("Password reset successful ✔ Please login with new password");
      showLoginBox();
    });
  }).catch((error) => alert("Error: " + error.message));
});

// ---------- TOGGLE LOGIN/REGISTER PANELS ----------
const registerBtn = document.querySelector('.register-btn');
const loginBtn = document.querySelector('.login-btn');

registerBtn.addEventListener('click', () => {
  container.classList.add('active');
  container.classList.remove('show-forgot');
});

loginBtn.addEventListener('click', () => {
  container.classList.remove('active');
  container.classList.remove('show-forgot');
});