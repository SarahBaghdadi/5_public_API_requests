// With information provided from The Random User Generator API, send a single request to the API, and use the response data to display 12 users, along with some basic information for each:
// Image
// First and Last Name
// Email
// City or location
// Refer to the mockups and the comments in the index.html file for an example of what info should be displayed on the page and how it should be styled.


for (let i = 0; i < 12; i++) {
    fetch('https://randomuser.me/api/')
    .then(response => response.json())
    .then(data => generatePerson(data.results[0]))
    .then(results => generateHTML(results))
}

function generatePerson(data) {
    const person = new Person(data);
    return person;
};

function generateHTML(person){
    let html = `<div class="card">
        <div class="card-img-container">
            <img class="card-img" src="${person.image}" alt="profile picture">
        </div>
        <div class="card-info-container">
            <h3 id="name" class="card-name cap">${person.firstName} ${person.lastName}</h3>
            <p class="card-text">${person.email}</p>
            <p class="card-text cap">${person.city}, ${person.state}</p>
        </div>
    </div>`
    document.querySelector('#gallery').insertAdjacentHTML('beforeend', html);
}

class Person {
    constructor(data) {
        this.image = data.picture.large;
        this.firstName = data.name.first;
        this.lastName = data.name.last;
        this.email = data.email;
        this.city = data.location.city;
        this.state = data.location.state;
    }
};

