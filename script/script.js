// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCV-Rm08q2gvLKb8mfZLSQUObyAVLfn9Pg",
    authDomain: "lct-education.firebaseapp.com",
    projectId: "lct-education",
    storageBucket: "lct-education.appspot.com",
    messagingSenderId: "374072913221",
    appId: "1:374072913221:web:a253795cf95a1dda82a22c",
    measurementId: "G-XMHZBWN6MH"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();
const database = firebase.database();

// Elements
const fileInput = document.getElementById('fileInput');
const uploadBtn = document.getElementById('uploadBtn');
const assignmentsList = document.getElementById('assignmentsList');

// Upload assignment
uploadBtn.addEventListener('click', () => {
    const file = fileInput.files[0];
    if (!file) return alert('Please select a file first.');

    const storageRef = storage.ref('assignments/' + file.name);
    const uploadTask = storageRef.put(file);

    uploadTask.on('state_changed', 
        snapshot => {
            // Progress logic if needed
        }, 
        error => {
            console.error('Upload failed:', error);
        }, 
        () => {
            uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
                const assignmentKey = database.ref('assignments').push().key;
                const assignmentData = {
                    url: downloadURL,
                    name: file.name,
                };
                database.ref('assignments/' + assignmentKey).set(assignmentData);
                displayAssignment(assignmentKey, assignmentData);
            });
        }
    );
});

// Display assignments
function displayAssignment(key, data) {
    const assignmentItem = document.createElement('div');
    assignmentItem.className = 'assignment-item';
    assignmentItem.innerHTML = `
        <span>${data.name}</span>
        <button class="delete-btn" data-key="${key}">Delete</button>
    `;
    assignmentsList.appendChild(assignmentItem);
}

// Fetch assignments on load
database.ref('assignments').on('value', snapshot => {
    assignmentsList.innerHTML = '';
    snapshot.forEach(childSnapshot => {
        const key = childSnapshot.key;
        const data = childSnapshot.val();
        displayAssignment(key, data);
    });
});

// Delete assignment
assignmentsList.addEventListener('click', event => {
    if (event.target.classList.contains('delete-btn')) {
        const key = event.target.getAttribute('data-key');
        database.ref('assignments/' + key).remove();
        storage.ref('assignments/' + key).delete().then(() => {
            event.target.parentElement.remove();
        }).catch(error => {
            console.error('Delete failed:', error);
        });
    }
});