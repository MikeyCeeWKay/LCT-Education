import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-storage.js";
import { getDatabase, ref as dbRef, set, remove, onValue } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

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
const storage = getStorage(app);
const database = getDatabase(app);

function sanitizeFileName(fileName) {
    return fileName.replace(/[.#$[\]]/g, '_');
}

document.getElementById('fileInput').addEventListener('change', (event) => {
    const fileName = event.target.files[0]?.name || 'No file selected';
    document.getElementById('fileName').textContent = fileName;
});

document.getElementById('uploadBtn').addEventListener('click', () => {
    const file = document.getElementById('fileInput').files[0];
    if (file) {
        const sanitizedFileName = sanitizeFileName(file.name);
        const storageRef = ref(storage, 'assignments/' + sanitizedFileName);
        uploadBytes(storageRef, file).then((snapshot) => {
            getDownloadURL(snapshot.ref).then((url) => {
                const assignmentRef = dbRef(database, 'assignments/' + sanitizedFileName);
                set(assignmentRef, {
                    name: file.name,
                    url: url,
                    timestamp: Date.now()
                });
            });
        });
    }
});

function loadAssignments() {
    const assignmentsRef = dbRef(database, 'assignments');
    onValue(assignmentsRef, (snapshot) => {
        const assignmentsList = document.getElementById('assignmentsList');
        assignmentsList.innerHTML = '';
        const data = snapshot.val();
        if (data) {
            const sortedAssignments = Object.keys(data)
                .map(key => ({ id: key, ...data[key] }))
                .sort((a, b) => b.timestamp - a.timestamp);

            sortedAssignments.forEach(assignment => {
                const listItem = document.createElement('div');
                listItem.classList.add('assignment-item');
                listItem.innerHTML = `
                    <a href="${assignment.url}" target="_blank">${assignment.name}</a>
                    <button class="delete-btn" onclick="deleteAssignment('${assignment.id}')">Delete</button>`;
                assignmentsList.appendChild(listItem);
            });
        }
    });
}
window.deleteAssignment = (key) => {
    const assignmentRef = dbRef(database, 'assignments/' + key);
    const storageRef = ref(storage, 'assignments/' + key);
    deleteObject(storageRef).then(() => {
        remove(assignmentRef);
    });
};

loadAssignments();