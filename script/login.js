import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyCV-Rm08q2gvLKb8mfZLSQUObyAVLfn9Pg",
    authDomain: "lct-education.firebaseapp.com",
    projectId: "lct-education",
    storageBucket: "lct-education.appspot.com",
    messagingSenderId: "374072913221",
    appId: "1:374072913221:web:a253795cf95a1dda82a22c",
    measurementId: "G-XMHZBWN6MH",
    databaseURL: "https://lct-education-default-rtdb.asia-southeast1.firebasedatabase.app"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const loginBtn = document.getElementById('loginBtn');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const forgotPasswordLink = document.getElementById('forgotPasswordLink');

document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        loginBtn.click();
    }
});

loginBtn.addEventListener('click', (event) => {
    event.preventDefault();
    const email = document.getElementById('emailInput').value;
    const password = document.getElementById('passwordInput').value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            window.location.href = "../index.html";
        })
        .catch((error) => {
            document.getElementById('loginError').textContent = error.message;
            forgotPasswordLink.classList.remove('hidden');
        });
});

forgotPasswordLink.addEventListener('click', () => {
    window.location.href = '../src/forgot-password.html';
});
