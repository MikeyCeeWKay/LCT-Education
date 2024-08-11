import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

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

const resetPasswordBtn = document.getElementById('resetPasswordBtn');
const resetEmailInput = document.getElementById('resetEmail');

resetPasswordBtn.addEventListener('click', () => {
    const email = resetEmailInput.value;

    sendPasswordResetEmail(auth, email)
        .then(() => {
            alert('Password reset email sent!');
        })
        .catch((error) => {
            alert('Error: ' + error.message);
        });
});
