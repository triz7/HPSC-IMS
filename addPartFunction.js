// Import necessary Firebase modules
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAU3oR7woy5R07JJhYIbMFLF55KRPZQ_UU",
  authDomain: "hpsc-ims-175e6.firebaseapp.com",
  projectId: "hpsc-ims-175e6",
  storageBucket: "hpsc-ims-175e6.appspot.com",
  messagingSenderId: "118415885557",
  appId: "1:118415885557:web:f75a65df130632f09cb1bc",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
async function loadParts() {
  const tableBody = document.getElementById("inventoryTableBody");

  try {
    // Fetch data from Firestore
    const querySnapshot = await getDocs(
      collection(firestore, "inventoryParts")
    );

    // Clear existing rows
    tableBody.innerHTML = "";

    // Add rows to table
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${data.partNumber}</td>
        <td>${data.description}</td>
        <td>${data.commodity}</td>
        <td>${data.quantity}</td>
        <td>${data.location}</td>
        <td>
          <div class="dropdown">
            <button class="dropbtn">${data.repStatus || "PENDING"}</button>
            <div class="dropdown-content">
              <a href="#" onclick="updateButtonText(this, '#28A745')">COMPLETED</a>
              <a href="#" onclick="updateButtonText(this, '#DC3545')">PENDING</a>
            </div>
          </div>
        </td>
        <td>
          <div class="cl-actions">
            <button class="modify-btn" onclick="redirectToModifyPage()">Modify</button>
            <button class="history-btn" onclick="redirectToHistoryPage()">History</button>
          </div>
        </td>
      `;
      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error("Error fetching documents: ", error);
  }
}

// Load parts when the page loads
document.addEventListener("DOMContentLoaded", loadParts);

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("addPartForm");
  if (form) {
    form.addEventListener("submit", async function (event) {
      event.preventDefault();

      // Retrieve values from form fields
      const partNumber = document.getElementById("part-number").value;
      const description = document.getElementById("description").value;
      const commodity = document.getElementById("commodity").value;
      const quantity = parseInt(document.getElementById("quantity").value, 10);
      const location = document.getElementById("location").value;

      try {
        // Add the part data to Firestore
        const docRef = await addDoc(collection(firestore, "inventoryParts"), {
          partNumber: partNumber,
          description: description,
          commodity: commodity,
          quantity: quantity,
          location: location,
        });

        console.log("Document written with ID: ", docRef.id);
        alert("Part added successfully!");

        window.location.href = "admin_parts.html";

        // Optionally clear the form fields
        form.reset();
      } catch (error) {
        console.error("Error adding document: ", error);
        alert(`Error: ${error.message}`);
      }
    });
  } else {
    console.error("Form with id 'addPartForm' not found.");
  }
});
