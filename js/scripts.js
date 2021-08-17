/*
Treehouse Techdegree:
FSJS Project 5 - Public API Requests
==============================================
*/

// Global variables
let people = [];
let currentArray = people;
let gallery = document.querySelector('#gallery');


/* GET DATA AND INITIAL HTML
=================================
*/

// Create array of people, call generate HTML on each person
fetch('https://randomuser.me/api/?results=12&nat=US')
    .then(response => response.json())
    .then(data => 
        data.results.forEach((element) => {
            let person = new Person(element); 
            people.push(person); 
            generateHTML(person);
        })
    )

// Person object 
class Person {
    constructor(data) {
        this.image = data.picture.large;
        this.name = `${data.name.first} ${data.name.last}`;
        this.email = data.email;
        this.city = data.location.city;
        this.state = data.location.state;
        this.cell = data.cell;
        this.birthday = data.dob.date;
        this.address = `${data.location.street.number} ${data.location.street.name} <br> ${data.location.city}, ${data.location.state} ${data.location.postcode} <br> ${data.location.country}`
    }
}

//Generate HTML function
const generateHTML = (person) => {
    let html = 
    `<div class="card">
        <div class="card-img-container">
            <img class="card-img" src="${person.image}" alt="profile picture">
        </div>
        <div class="card-info-container">
            <h3 id="${person.name.replace(/\s/g, '')}" class="card-name cap">${person.name}</h3>
            <p class="card-text">${person.email}</p>
            <p class="card-text cap">${person.city}, ${person.state}</p>
        </div>
    </div>`;
    gallery.insertAdjacentHTML('beforeend', html);
}


/* CREATE AND CLOSE MODALS
============================
*/

// Modal object
class Modal {
    constructor(person) {
        this.phone = phone(person.cell);
        this.date = date(person.birthday);
        this.html = 
        `<div class="modal-container">
            <div class="modal">
                <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                <div class="modal-info-container">
                    <img class="modal-img" src="${person.image}" alt="profile picture">
                    <h3 id="name" class="modal-name cap">${person.name}</h3>
                    <p class="modal-text">${person.email}</p>
                    <p class="modal-text cap">${person.city}</p>
                    <hr>
                    <p class="modal-text">${this.phone}</p>
                    <p class="modal-text">${person.address}</p>
                    <p class="modal-text">Birthday: ${this.date}</p>
                </div>
            </div>
            <div class="modal-btn-container">
                <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                <button type="button" id="modal-next" class="modal-next btn">Next</button>
            </div>
        </div>`;
    }
}

// Create Modal function 
const createModal = (person) => {
    let modal = new Modal(person);
    gallery.insertAdjacentHTML('beforeend', modal.html);
    modalNav();
}

// Listen for card clicks and create Modal
gallery.addEventListener('click', (e) => {
    let card = e.target.closest('.card');
    if (card) {
        let name = card.querySelector('h3').textContent;
        let index = getIndex(name);
        createModal(currentArray[index]);
    }
})

// Close modal function
const closeModal = () => {
    document.querySelector('.modal-container').remove();
}

// Listen for close clicks and close modal
gallery.addEventListener('click', (e) => {
    if (e.target.closest('#modal-close-btn'))
    closeModal();
});


/* MODAL NAVIGATION - 
Advance forwards or backwards in current array of people, either search results or entire directory, via modals.
==============================================
*/

// Advance modal function
const advanceModal = (person) => {
    closeModal();
    createModal(person);
}

// Add navigation to modal
const modalNav = () => {

    // Select elements 
    const modalContainer = document.querySelector('.modal-container');
    const modalButtons = document.querySelector('.modal-btn-container');
    const next = document.querySelector('#modal-next');
    const prev = document.querySelector('#modal-prev');

    // Event listener gets name from HTML, gets the index of that person in the current array 
    modalButtons.addEventListener('click', (e) => {
        let name = modalContainer.querySelector('h3').textContent;
        let index = getIndex(name);

        // If next button, increment index, or go from last number to first number
        if (e.target === next) {
            let limit = currentArray.length - 1;
            if (index === limit) {
                index = 0; 
            } else {
                index ++;
            }
        }

        // If previous button, decrement index, or go from first number to last number
        if (e.target === prev) {    
            let limit = 0;
            if (index === limit) {
                index = currentArray.length - 1;
            } else {
                index --
            }
        }

        // Close modal and create new modal from new index
        closeModal();
        createModal(currentArray[index]);
    })
};


/* SEARCH
============================
*/

// Add search HTML to DOM
const searchContainer = document.querySelector('.search-container');
const searchHTML = 
`<form action="#" method="get">
    <input type="search" id="search-input" class="search-input" placeholder="Search...">
    <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
</form>`;
searchContainer.insertAdjacentHTML('beforeend', searchHTML);

// Search function - builds new array called searchResults and sets currentArray to searchResults
const simpleSearch = (data) => {
    const search = document.querySelector('#search-input').value;
    searchResults = [];
    for (let i = 0; i < data.length; i++){
        let fullName = `${data[i].name}`;
        let searchParamaters = search.length != 0 && fullName.toLowerCase().includes(search.toLowerCase());
        if (searchParamaters) {
            searchResults.push(data[i]);
        } else if (search.length === 0) {
            searchResults = people;
        }
    }
    currentArray = searchResults;
    return searchResults;
}

// Call search on click
searchContainer.addEventListener('click', (e) => {
    const submit = document.querySelector('#search-submit');
    if (e.target === submit ){
        document.querySelectorAll('.card').forEach(item => item.remove());
        simpleSearch(people).forEach( (item) => {
            generateHTML(item);
        });    
    }
});


/* Helper functions
============================
*/

// Format phone numbers
const phone = (number) => {
    let numberCleaned = number.replaceAll((/[^\d]/g), '');
    let numberFormatted = numberCleaned.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    return numberFormatted;
}

// Format dates
const date = (number) => {
    let year = number.substring(0,4);
    let month = number.substring(5,7);
    let day = number.substring(8,10);
    return `${month}/${day}/${year}`;
}

// Get index from name
const getIndex = (name) => {

    // Flatten array
    let flatArray = (array, prop) => {
        flatArray = [];
        array.forEach(item => flatArray.push(item[prop]));
        return flatArray;
    }
    flatArray(currentArray, 'name');

    // Get and return index of name
    let currentIndex = flatArray.indexOf(name);
    return (currentIndex);
}