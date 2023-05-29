import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
    databaseURL: "https://addtocart-11035-default-rtdb.europe-west1.firebasedatabase.app/"
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const shoppinglistInDB = ref(database, "items");

const inputFieldEl = document.getElementById("input1");
const addButtonEl = document.getElementById("b1");
const savebutton = document.getElementById("list");

/*
In Firebase, the onValue function is used to listen for real-time updates to a specific location or node in the Firebase Realtime Database. It allows you to attach a callback function that will be invoked whenever the data at the specified location changes.
*/


/*In Firebase, a snapshot is an object that represents a specific point in time view of the data stored in the Firebase Realtime Database. It contains the data at a particular database location at the moment the snapshot was taken.

When you read or listen to data from the database, Firebase provides you with a snapshot object that encapsulates the retrieved data and additional metadata. This snapshot allows you to access and work with the data in a convenient way.

A snapshot object typically has the following properties and methods:

val(): This method returns the actual JavaScript object representing the data at the specified location in the database. You can use snapshot.val() to extract the data and perform operations on it.
*/

onValue(shoppinglistInDB, function(snapshot) {
    if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val()); 
        /* above line converts the snapshot.val(object) to array*/
    
        clearShoppingListEl();
        
        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i];
            let currentItemID = currentItem[0];
            let currentItemValue = currentItem[1];
            
            appendItemToShoppingListEl(currentItem);
        }    
    } else {
        savebutton.innerHTML = "No items here... yet";
    }
});

addButtonEl.addEventListener("click", function() {
    let inputValue = inputFieldEl.value;

    push(shoppinglistInDB, inputValue);
    clearInputFieldEl();
});

function clearShoppingListEl() {
    savebutton.innerHTML = "";
}

function clearInputFieldEl() {
    inputFieldEl.value = "";
}

function appendItemToShoppingListEl(item) {
    let itemID = item[0];
    let itemValue = item[1];
    
    let newEl = document.createElement("li");
    
    newEl.textContent = itemValue;
    savebutton.appendChild(newEl);
    newEl.addEventListener("click", function() {
        let exactLocationOfItemInDB = ref(database, `items/${itemID}`);
        
        remove(exactLocationOfItemInDB);
    });
}
