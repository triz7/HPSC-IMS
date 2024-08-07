import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  deleteUser as firebaseDeleteUser,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import {
  getFirestore,
  collection,
  getDocs,
  deleteDoc,
  doc,
  setDoc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAU3oR7woy5R07JJhYIbMFLF55KRPZQ_UU",
  authDomain: "hpsc-ims-175e6.firebaseapp.com",
  projectId: "hpsc-ims-175e6",
  storageBucket: "hpsc-ims-175e6.appspot.com",
  messagingSenderId: "118415885557",
  appId: "1:118415885557:web:f75a65df130632f09cb1bc",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

document.addEventListener("DOMContentLoaded", async () => {
  loadUserData();
});

async function populateModifyUserForm() {
  const modifyUserId = localStorage.getItem("modifyUserId");

  if (modifyUserId) {
    try {
      const userDocRef = doc(firestore, "users", modifyUserId);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        alert(userData.email);
        document.getElementById("email").value = userData.email;
        document.getElementById("username").value = userData.username;
        document.getElementById("user-role").value = userData.userRole;
      } else {
        console.error("No such user!");
        alert("User not found.");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      alert(`Error: ${error.message}`);
    }
  } else {
    console.error("No user ID found in localStorage.");
    alert("No user ID found.");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("addUserForm");
  if (form) {
    form.addEventListener("submit", async function (event) {
      event.preventDefault();

      const email = document.getElementById("email").value;
      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;
      const cpassword = document.getElementById("cpassword").value;
      const userRole = document.getElementById("user-role").value;

      if (password !== cpassword) {
        alert("Passwords do not match!");
        return;
      }

      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;

        // Add user to Firestore
        await setDoc(doc(firestore, "users", user.uid), {
          email: email,
          username: username,
          userRole: userRole,
        });

        console.log("User created and added to Firestore:", user);
        alert("User created and added successfully!");

        window.location.href = "supadmin_usermanagement.html";
      } catch (error) {
        console.error("Error creating user:", error.code, error.message);
        alert(`Error: ${error.message}`);
      }
    });
  } else {
    console.error("Form with id 'addUserForm' not found.");
  }
});

async function loadUserData() {
  const usersCollection = collection(firestore, "users");
  const userSnapshot = await getDocs(usersCollection);
  const userList = userSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  const tableBody = document.querySelector("#inventoryTable tbody");
  tableBody.innerHTML = "";

  userList.forEach((user) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${user.email}</td>
      <td>${user.username}</td>
      <td>${user.userRole}</td>
      <td></td>
      <td>
        <div class="cl-actions">
          <button class="modify-btn" onclick="redirectToModifyUserPage('${user.id}')">Modify</button>
          <button class="delete-btn" onclick="deleteUser('${user.id}')">Delete</button>
        </div>
      </td>
    `;
    tableBody.appendChild(tr);
  });
}

async function deleteUser(userId) {
  try {
    // Get the user's email
    const userDocRef = doc(firestore, "users", userId);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      const userData = userDoc.data();
      const email = userData.email;

      // Delete the user from Firestore
      await deleteDoc(userDocRef);

      // Delete the user from Firebase Authentication
      const userRecord = await getAuth().getUserByEmail(email);
      await firebaseDeleteUser(userRecord.uid);

      alert("User deleted successfully!");
      loadUserData(); // Refresh user data
    } else {
      console.error("No such user in Firestore!");
      alert("User not found in Firestore.");
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    alert(`Error: ${error.message}`);
  }
}

function redirectToModifyUserPage(userId) {
  localStorage.setItem("modifyUserId", userId);
  window.location.href = "supadmin_modify_user.html";
}

function redirectToAddUserPage() {
  window.location.href = "supadmin_add_user.html";
}

// Function to handle search
function searchTable() {
  const input = document.getElementById("searchInput");
  const filter = input.value.toUpperCase();
  const table = document.getElementById("inventoryTable");
  const tr = table.getElementsByTagName("tr");

  for (let i = 1; i < tr.length; i++) {
    tr[i].style.display = "none";
    const td = tr[i].getElementsByTagName("td");
    for (let j = 0; j < td.length; j++) {
      const txtValue = td[j].textContent || td[j].innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
        break;
      }
    }
  }
}

// Function to toggle password visibility
window.togglePassword = function (passwordId, checkboxId) {
  const passwordField = document.getElementById(passwordId);
  const checkbox = document.getElementById(checkboxId);
  if (checkbox.checked) {
    passwordField.type = "text";
  } else {
    passwordField.type = "password";
  }
};

// Expose redirect functions to global scope
window.redirectToAddUserPage = redirectToAddUserPage;
window.redirectToModifyUserPage = function (userId) {
  redirectToModifyUserPage(userId);
  populateModifyUserForm();
};
window.deleteUser = deleteUser;
window.showSuccessMessage = showSuccessMessage;
