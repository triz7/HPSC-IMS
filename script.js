function redirectToRequest() {
  const checkboxes = document.querySelectorAll(".item-checkbox:checked");

  if (checkboxes.length === 0) {
    alert("Please select at least one item before requesting.");
    return;
  }

  const selectedItems = [];

  checkboxes.forEach((checkbox) => {
    const row = checkbox.closest("tr");
    const partNo = row.cells[0].textContent;
    const partDesc = row.cells[1].textContent;

    selectedItems.push({ partNo, partDesc });
  });

  localStorage.setItem("selectedItems", JSON.stringify(selectedItems));
  window.location.href = "request.html";
}

function searchTable() {
  var input, filter, table, tr, td, i, j, txtValue;
  input = document.getElementById("searchInput");
  filter = input.value.toUpperCase();
  table = document.getElementById("inventoryTable");
  tr = table.getElementsByTagName("tr");

  for (i = 1; i < tr.length; i++) {
    tr[i].style.display = "none";
    td = tr[i].getElementsByTagName("td");
    for (j = 0; j < td.length; j++) {
      if (td[j]) {
        txtValue = td[j].textContent || td[j].innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
          break;
        }
      }
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname.endsWith("add.html")) {
    document.getElementById("part-number").value = "";
    document.getElementById("description").value = "";
    document.getElementById("commodity").value = "";
    document.getElementById("quantity").value = "";
    document.getElementById("location").value = "";
  }
});

function showSuccessMessage(event) {
  event.preventDefault();
  alert("REQUEST SUCCESSFUL!");
  localStorage.removeItem("selectedItems");
}

function updateButtonText(element, color) {
  var dropdownButton = element.closest(".dropdown").querySelector(".dropbtn");
  dropdownButton.textContent = element.textContent;
  dropdownButton.style.backgroundColor = color;
}

function importFile(event) {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = function (event) {
    const data = event.target.result;
    if (file.name.endsWith(".csv")) {
      parseCSV(data);
    } else {
      const workbook = XLSX.read(data, { type: "binary" });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
      populateTable(jsonData);
    }
  };

  if (file.name.endsWith(".csv")) {
    reader.readAsText(file);
  } else {
    reader.readAsBinaryString(file);
  }
}

function parseCSV(data) {
  const lines = data.split("\n");
  const result = [];
  for (let i = 0; i < lines.length; i++) {
    const row = lines[i].split(",");
    result.push(row);
  }
  populateTable(result);
}

function populateTable(data) {
  const tableBody = document.querySelector("#inventoryTable tbody");
  tableBody.innerHTML = "";

  data.slice(1).forEach((row) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
            <td>${row[0] || ""}</td>
            <td>${row[1] || ""}</td>
            <td>${row[2] || ""}</td>
            <td>${row[3] || ""}</td>
            <td>${row[4] || ""}</td>
            <td>
                <div class="dropdown">
                    <button class="dropbtn">${row[5] || "PENDING"}</button>
                    <div class="dropdown-content">
                        <a href="#" onclick="updateButtonText(this, '#28A745')">COMPLETED</a>
                        <a href="#" onclick="updateButtonText(this, '#DC3545')">PENDING</a>
                    </div>
                </div>
            </td>
            <td>
                <div class="cl-actions">
                    <button class="modify-btn">Modify</button>
                    <button class="history-btn">History</button>
                </div>
            </td>
        `;
    tableBody.appendChild(tr);
  });
}

function redirectToAddPage() {
  window.location.href = "add.html";
}

function redirectToModifyPage() {
  window.location.href = "modify.html";
}

function redirectToHistoryPage() {
  window.location.href = "history.html";
}

function redirectToAddUserPage() {
  window.location.href = "supadmin_add_user.html";
}

function redirectToModifyUserPage() {
  window.location.href = "supadmin_modify_user.html";
}

function selectAllCheckboxes(select) {
  const checkboxes = document.querySelectorAll(".item-checkbox");
  checkboxes.forEach((checkbox) => {
    checkbox.checked = select;
  });
}

function togglePassword(passwordId, checkboxId) {
  const passwordField = document.getElementById(passwordId);
  const checkbox = document.getElementById(checkboxId);
  if (checkbox.checked) {
    passwordField.type = "text";
  } else {
    passwordField.type = "password";
  }
}
