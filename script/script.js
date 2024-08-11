import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-storage.js";
import { getDatabase, ref as dbRef, set, remove } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyCV-Rm08q2gvLKb8mfZLSQUObyAVLfn9Pg",
    authDomain: "lct-education.firebaseapp.com",
    projectId: "lct-education",
    storageBucket: "lct-education.appspot.com",
    messagingSenderId: "374072913221",
    appId: "1:374072913221:web:a253795cf95a1dda82a22c",
    measurementId: "G-XMHZBWN6MH"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const database = getDatabase(app);

const fileInput = document.getElementById('fileInput');
const uploadBtn = document.getElementById('uploadBtn');
const assignmentsList = document.getElementById('assignmentsList');

uploadBtn.addEventListener('click', () => {
    const file = fileInput.files[0];
    if (file) {
        const storageRef = ref(storage, 'assignments/' + file.name);
        uploadBytes(storageRef, file).then((snapshot) => {
            getDownloadURL(snapshot.ref).then((url) => {
                const assignmentRef = dbRef(database, 'assignments/' + file.name);
                set(assignmentRef, {
                    name: file.name,
                    url: url
                });
            });
        });
    }
});

function loadAssignments() {
    const assignmentsRef = dbRef(database, 'assignments');
    onValue(assignmentsRef, (snapshot) => {
        const assignmentsList = document.getElementById('assignmentsList');
        assignmentsList.innerHTML = ''; // Clear the list
        const data = snapshot.val();
        for (let key in data) {
            const assignment = data[key];
            const listItem = document.createElement('div');
            listItem.innerHTML = `<a href="${assignment.url}" target="_blank">${assignment.name}</a> 
                <button onclick="deleteAssignment('${key}')">Delete</button>`;
            assignmentsList.appendChild(listItem);
        }
    });
}

window.deleteAssignment = (key) => {
    const assignmentRef = dbRef(database, 'assignments/' + key);
    const storageRef = ref(storage, 'assignments/' + key);
    deleteObject(storageRef).then(() => {
        remove(assignmentRef);
    });
}

loadAssignments();
