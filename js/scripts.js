let people = [];
let gallery = document.querySelector('#gallery');

// Create array of people, call generate HTML on each person
fetch('https://randomuser.me/api/?results=12')
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
        this.html = 
        `<div class="modal-container">
            <div class="modal">
                <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                <div class="modal-info-container">
                    <img class="modal-img" src="${person.image}" alt="profile picture">
                    <h3 id="name" class="modal-name cap">${person.firstName} ${person.lastName}</h3>
                    <p class="modal-text">${person.email}</p>
                    <p class="modal-text cap">${person.city}</p>
                    <hr>
                    <p class="modal-text">${person.cell}</p>
                    <p class="modal-text">${person.address}</p>
                    <p class="modal-text">Birthday: ${person.birthday}</p>
                </div>
            </div>
            <div class="modal-btn-container">
                <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                <button type="button" id="modal-next" class="modal-next btn">Next</button>
            </div>
        </div>`
    }
}

// Listen for card clicks and create Modal
gallery.addEventListener('click', (e) => {
    let parentCard = e.target.closest('.card');
    if (parentCard){
        let cardIndex = parentCard.id.substring(4);
    let modal = new Modal(people[cardIndex]);
    gallery.insertAdjacentHTML('beforeend', modal.html);
    }
})

// Listen for close modal clicks and close modal

gallery.addEventListener('click', (e) => {
    if (e.target.closest('#modal-close-btn'))
    document.querySelector('.modal-container').remove();
});


