const url = 'http://localhost:5001/jacobs-api/us-central1/users/';

let users = [];
let seletedUser;

const userTable = document.getElementById("userTable");
const allUsersSection = document.getElementById("allUsersSection");
const editSection = document.getElementById("editSection");
const deleteUserButton = document.getElementById("deleteUserButton");

const userNameField = document.getElementById("userNameField");
const userEmailField = document.getElementById("userEmailField");
const createUserButton = document.getElementById("createUserButton");
const errorMessage = document.getElementById("errorMessage");



getUsers();
createUserButton.addEventListener("click", createUser);
deleteUserButton.addEventListener("click", deleteUser);

// Kollar att vi har data och användare.
const showEditSection = (userId) => {
    if(!userId) {
        throw new Error ("no id present") 
    }
    // Vi har användare.
    seletedUser = userId;
    allUsersSection.style.display = "none";
    editSection.style.display = "block";

}
//visa upp användarna i block-element.
const showTableSection = () => {
    seletedUser = null;
    allUsersSection.style.display = "block";
    editSection.style.display = "none";
}
// Tar bort användare. Om vi har en användare filtrerar vi listan och visar upp den påc nytt.
// Om vi har en användare tar vi dess id och tar bort användaren och fångar upp om något fel finns.
async function deleteUser() {
    try {
        const userToDelete = seletedUser; 
        const response = await fetch(url + userToDelete, { method: "DELETE"});

    if (response.ok) {
        users = users.filter(user => user.id !== userToDelete)
        renderTable();
        showTableSection();
    }
    else{
        throw new Error(response.statusText);
      }

    } catch (err) {
        throw err;
    }
}
// Skapar användare där värdet av det som användaren skriver in i fältet.
async function createUser() {
    const newUser = {firstName: userNameField.value, email: userEmailField.value }
    
    // Kollar att inputfällten inte är tomma. Om något fällt är det skickas ett meddelande tillbaka till användaren.
    if(!newUser.firstName || !validateEmail(newUser.email)) {
        return showValidationMessage();
    }
    try {   
        const response = await fetch(url, { method: "POST", body: JSON.stringify(newUser)});

    if (response.ok) {
        users.push(newUser); 
        renderTable();
        clearForm();
    }
    else{
        throw new Error(response.statusText);
      }

    } catch (err) {
        throw err;
    }
}
// Meddelandet som visas om något av inputfällten är tomma och meddelande visas upp.
function showValidationMessage() {
    errorMessage.style.display = "block";
    errorMessage.innerHTML = "Both email and user name is required. Email needs to be a valid email-address.";
}
// När namn och emil lagts till blir fällten tomma.
function clearForm(){
    userNameField.value = '';
    userEmailField.value = '';
    errorMessage.style.display = "none";
    errorMessage.innerHTML = "";

}
// Kollar att email:en är gilltlig innehåller @.
function validateEmail(email) {
    if(!email || !email.includes("@")) {
        return false;
    }
    else return true;
}
// Visar upp alla användare.
async function getUsers() {
    try {
        const response = await fetch(url);

    if (response.ok) {
        users = await response.json();
        renderTable();
    }
    else{
        throw new Error(response.statusText);
      }

    } catch (err) {
        throw err;
    }
}
const renderTable = async () => {
    let tablerow = "";

    // loopar igenom som användarna  och visar upp email firstName i Firebase och visas upp i HTML sidan.
    users.forEach(user => {
       tablerow +=
       `<tr id=${user.id} onclick="showEditSection(this.id)">
           <td>${user.firstName}</td>
           <td>${user.email}</td>
       </tr>`;
    })
    userTable.innerHTML = tablerow;
}

