let people = [];
let gallery = document.querySelector('#gallery');

// Create array of people, call generate HTML on each person
fetch('https://randomuser.me/api/?results=12&nat=US')
    .then(response => response.json())
    .then(data => 
        data.results.forEach((element, index) => {
            let person = new Person(element); 
            people.push(person); 
            person.index = index;
            generateHTML(person);
        })
    )

// Person object
class Person {
    constructor(data) {
        this.image = data.picture.large;
        this.firstName = data.name.first;
        this.lastName = data.name.last;
        this.email = data.email;
        this.city = data.location.city;
        this.state = data.location.state;
        this.cell = data.cell;
        this.birthday = data.dob.date;
        this.address = `${data.location.street.number} ${data.location.street.name} <br> ${data.location.city}, ${data.location.state} ${data.location.postcode} <br> ${data.location.country}`
    }
}

//Generate HTML
function generateHTML(person) {
    let html = 
    `<div class="card" id="card${person.index}">
        <div class="card-img-container">
            <img class="card-img" src="${person.image}" alt="profile picture">
        </div>
        <div class="card-info-container">
            <h3 id="${person.firstName}${person.lastName}" class="card-name cap">${person.firstName} ${person.lastName}</h3>
            <p class="card-text">${person.email}</p>
            <p class="card-text cap">${person.city}, ${person.state}</p>
        </div>
    </div>`;
    gallery.insertAdjacentHTML('beforeend', html);
}

// Modal object
class Modal {
    constructor(person) {
        this.phone = phone(person.cell);
        this.date = date(person.birthday);
        this.html = 
        `<div class="modal-container">
            <div class="modal" id="modal${person.index}">
                <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                <div class="modal-info-container">
                    <img class="modal-img" src="${person.image}" alt="profile picture">
                    <h3 id="name" class="modal-name cap">${person.firstName} ${person.lastName}</h3>
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

// Listen for card clicks and create Modal
gallery.addEventListener('click', (e) => {
    let card = e.target.closest('.card');
    if (card){
        let index = card.id.substring(4);
        let modal = new Modal(people[index]);
        gallery.insertAdjacentHTML('beforeend', modal.html);
        modalNav();
    }
})

function modalNav() {
    const modalButtons = document.querySelector('.modal-btn-container');
    modalButtons.addEventListener('click', (e) => {
        let index = parseInt(document.querySelector('.modal').id.substr(5));
        
        const next = document.querySelector('#modal-next');
        if (e.target === next) {
            advanceModal(index + 1); 
        }

        const prev = document.querySelector('#modal-prev');
        if (e.target === prev) {
            advanceModal(index - 1); 
        }
    })
};

function advanceModal(index) {
    let modal = new Modal(people[index]);
    closeModal();
    gallery.insertAdjacentHTML('beforeend', modal.html); 
    modalNav();
}

function closeModal(){
    document.querySelector('.modal-container').remove();
}

// Listen for close modal clicks and close modal
gallery.addEventListener('click', (e) => {
    if (e.target.closest('#modal-close-btn'))
    closeModal();
});

// Phone numbers
function phone(number) {
    let numberCleaned = number.replaceAll((/[^\d]/g), '');
    let numberFormatted = numberCleaned.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    return numberFormatted;
}

// Dates
function date(number) {
    let year = number.substring(0,4);
    let month = number.substring(5,7);
    let day = number.substring(8,10);
    return `${month}/${day}/${year}`;
}

// Add search box to DOM
const searchContainer = document.querySelector('.search-container');
const searchHTML = 
`<form action="#" method="get">
    <input type="search" id="search-input" class="search-input" placeholder="Search...">
    <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
</form>`;
searchContainer.insertAdjacentHTML('beforeend', searchHTML);

// Search function
function simpleSearch(data) {
    const search = document.querySelector('#search-input').value; // Search input element
    let searchResults = [];
    for (let i = 0; i < data.length; i++){
        let fullName = `${data[i].firstName} ${data[i].lastName}`;
        let searchParamaters = search.length != 0 && fullName.toLowerCase().includes(search.toLowerCase());
        if (searchParamaters) {
            searchResults.push(data[i]);
        }
    }
    return searchResults;
}

// Call search on click
searchContainer.addEventListener('click', (e) => {
    const submit = document.querySelector('#search-submit');
    if (e.target === submit ){
        console.log('click');
        simpleSearch(people);
    }
});





