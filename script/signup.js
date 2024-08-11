import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getDatabase, ref as dbRef, set } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

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
const database = getDatabase(app);

const signupBtn = document.getElementById("signupBtn");

document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        signupBtn.click();
    }
});

signupBtn.addEventListener('click', () => {
    const name = document.getElementById('nameInput').value;
    const email = document.getElementById('emailInput').value;
    const password = document.getElementById('passwordInput').value;

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            const userRef = dbRef(database, 'users/' + user.uid);
            set(userRef, {
                name: name,
                email: email
            });
            window.location.href = "login.html";
        })
        .catch((error) => {
            document.getElementById('signupError').textContent = error.message;
        });
});
