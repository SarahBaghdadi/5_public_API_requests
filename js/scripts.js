let people = [];
let gallery = document.querySelector('#gallery');
let searching = false;

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

//Generate HTML
function generateHTML(person) {
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

// Format phone numbers
function phone(number) {
    let numberCleaned = number.replaceAll((/[^\d]/g), '');
    let numberFormatted = numberCleaned.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    return numberFormatted;
}

// Format dates
function date(number) {
    let year = number.substring(0,4);
    let month = number.substring(5,7);
    let day = number.substring(8,10);
    return `${month}/${day}/${year}`;
}

// Get names from array
function getNames(array, prop) {
    let names = [];
    array.forEach(item => names.push(item[prop]));
    return names;
}


// Listen for card clicks and create Modal
gallery.addEventListener('click', (e) => {
    let card = e.target.closest('.card');
    if (card) {
        let name = card.querySelector('h3').textContent;
        let array;
        if (searching) {
            array = searchResults;
        } else {
            array = people;
        }
        let index = getNames(array, 'name').indexOf(name);
        let person = array[index];
        let modal = new Modal(person);
        gallery.insertAdjacentHTML('beforeend', modal.html);
        modalNav();
    }
})

// Listen for close modal clicks and close modal
gallery.addEventListener('click', (e) => {
    if (e.target.closest('#modal-close-btn'))
    closeModal();
});

// Advance modal function
function advanceModal(person) {
    closeModal();
    let modal = new Modal(person);
    gallery.insertAdjacentHTML('beforeend', modal.html); 
    modalNav();
}

// Close modal function
function closeModal(){
    document.querySelector('.modal-container').remove();
}

// Add navigation to modal
function modalNav() {
    const modalButtons = document.querySelector('.modal-btn-container');
    modalButtons.addEventListener('click', (e) => {

        // Next modal
        const next = document.querySelector('#modal-next');
        if (e.target === next) {
            let modalContainer = document.querySelector('.modal-container')
            let name = modalContainer.querySelector('h3').textContent;
            let array;
            if (searching) {
                array = searchResults;
            } else {
                array = people;
            }
            let index = getNames(array, 'name').indexOf(name) + 1;
            let person = array[index];
            closeModal();
            let modal = new Modal(person);
            gallery.insertAdjacentHTML('beforeend', modal.html);
            modalNav();
        }

        // Previous modal
        const prev = document.querySelector('#modal-prev');
        if (e.target === prev) {
            let modalContainer = document.querySelector('.modal-container')
            let name = modalContainer.querySelector('h3').textContent;
            let array;
            if (searching) {
                array = searchResults;
            } else {
                array = people;
            }
            let index = getNames(array, 'name').indexOf(name) - 1;
            let person = array[index];
            closeModal();
            let modal = new Modal(person);
            gallery.insertAdjacentHTML('beforeend', modal.html);
            modalNav();
        }
    })
};

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
    searching = true;
    const search = document.querySelector('#search-input').value; // Search input element
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





// Try new system

let arr = [0,1,2,3,4,5,6,7,8,9];

let resultsArr = [0,4,6,9];


function navigate (array, item) {
    let currentItem = array.indexOf(item);
    //console.log(`Starts at ${currentItem}`);
    currentItem = array.indexOf(item) + 1;
    //console.log(`Ends at ${currentItem}`)
    //console.log(`New item is ${array[currentItem]}`)
}

navigate(arr, 4);
navigate(resultsArr, 4);

let objects = [
    {'tree': 'walnut'},
    {'tree': 'maple'},
    {'tree': 'ash'}
];




