
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

document.getElementById('register-form').addEventListener('submit', function (e) {
  e.preventDefault();  // Stop the default form submit

  const form = this;
  const username = form.querySelector('input[placeholder="Username"]').value;
  const email = form.querySelector('input[placeholder="Email"]').value;
  const password = form.querySelector('input[placeholder="Password"]').value;

  // Save to Firebase
  firebase.database().ref('users/' + username).set({
    username,
    email,
    password
  }).then(() => {
    alert("✔ Registered Successfully. Data saved to Firebase.");

    // ✅ Now trigger FormSubmit
    form.submit();  // This sends the form data to your email via FormSubmit
  }).catch((error) => {
    alert("❌ Firebase Error: " + error.message);
  });
});


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
