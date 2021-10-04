// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.

const uri = 'api/TodoItems';
let todos = [];
function getToDoItems() {
    document.getElementById('editForm').style.display = 'none';
    fetch(uri)
        .then(response => response.json())
        .then(data => _displayToDoItems(data))
        .catch(error => console.error('Unable to get to-do items.', error));
}

function addToDoItem() {
    const addNameTextbox = document.getElementById('add-name');
    const item = {
        isComplete: false,
        description: addNameTextbox.value.trim()
    };
    fetch(uri, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
    })
        .then(response => response.json())
        .then(() => {
            getToDoItems();
            addNameTextbox.value = '';
        })
        .catch(error => console.error('Unable to add to-do item.', error));
}

function deleteToDoItem(id) {
    var result = confirm("Are you sure to delete the to-do item?");
    if (result) {
        fetch(`${uri}/${id}`, {
            method: 'DELETE'
        })
            .then(() => getToDoItems())
            .catch(error => console.error('Unable to delete to-do item.', error));
    }
}

function displayEditForm(id) {
    const item = todos.find(item => item.id === id);

    document.getElementById('edit-description').value = item.description;
    document.getElementById('edit-id').value = item.id;
    document.getElementById('edit-isComplete').checked = item.isComplete;
    document.getElementById('editForm').style.display = 'block';
}

function updateToDoItem() {
    const itemId = document.getElementById('edit-id').value;
    const item = {
        id: parseInt(itemId, 10),
        isComplete: document.getElementById('edit-isComplete').checked,
        description: document.getElementById('edit-description').value.trim()
    };
    fetch(`${uri}/${itemId}`, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
    })
        .then(() => getToDoItems())
        .catch(error => console.error('Unable to update to-do item.', error));
    document.getElementById('edit-isComplete').checked = false
    document.getElementById('editForm').style.display = 'none';
    return false;
}

function _displayCount(itemCount) {
    const name = (itemCount === 1) ? 'task to-do' : 'task to-dos';
    document.getElementById('counter').innerText = `${itemCount} ${name}`;
}

function _displayToDoItems(data) {
    const tBody = document.getElementById('todos');
    tBody.innerHTML = '';
    _displayCount(data.length);
    const button = document.createElement('button');
    data.forEach(item => {
        addTableRow(tBody, item, button); 
    });
    todos = data;
}

function addTableRow(tBody, item, button) {
    let statusLabel = document.createElement('label');
    let status = (item.isComplete) ? 'Completed' : 'Pending';
    statusLabel.innerHTML = status;

    let editButton = button.cloneNode(false);
    editButton.innerText = 'Edit';
    editButton.classList.add('text-center', 'btn', 'btn-warning', 'btn-sm', 'btn-block');
    editButton.setAttribute('onclick', `displayEditForm(${item.id})`);

    let deleteButton = button.cloneNode(false);
    deleteButton.innerText = 'Delete';
    deleteButton.classList.add('btn', 'btn-danger', 'btn-sm', 'btn-block');
    deleteButton.setAttribute('onclick', `deleteToDoItem(${item.id})`);

    let tr = tBody.insertRow();
    tr.classList.add('mainbody');
    let td1 = tr.insertCell(0);
    td1.appendChild(statusLabel);
    let td2 = tr.insertCell(1);
    let textNode = document.createTextNode(item.description);
    td2.appendChild(textNode);
    let td3 = tr.insertCell(2);
    td3.appendChild(editButton);
    let td4 = tr.insertCell(3);
    td4.appendChild(deleteButton);
}
