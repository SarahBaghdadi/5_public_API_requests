fetch('https://randomuser.me/api/?results=12')
    .then(response => response.json())
    .then(data => data.results
        .forEach((element) => {let person = new Person(element); person.generateHTML()})
    )

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

    generateHTML(){
        let html = `<div class="card">
            <div class="card-img-container">
                <img class="card-img" src="${this.image}" alt="profile picture">
            </div>
            <div class="card-info-container">
                <h3 id="name" class="card-name cap">${this.firstName} ${this.lastName}</h3>
                <p class="card-text">${this.email}</p>
                <p class="card-text cap">${this.city}, ${this.state}</p>
            </div>
        </div>`;
        document.querySelector('#gallery').insertAdjacentHTML('beforeend', html);
    }

    generateModal() { 
        let modal = `
        <div class="modal-container">
            <div class="modal">
                <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                <div class="modal-info-container">
                    <img class="modal-img" src="${this.image}" alt="profile picture">
                    <h3 id="name" class="modal-name cap">${this.firstName} ${this.lastName}</h3>
                    <p class="modal-text">${this.email}</p>
                    <p class="modal-text cap">${this.city}</p>
                    <hr>
                    <p class="modal-text">${this.cell}</p>
                    <p class="modal-text">${this.address}</p>
                    <p class="modal-text">Birthday: ${this.birthday}</p>
                </div>
            </div>

            // IMPORTANT: Below is only for exceeds tasks 
            <div class="modal-btn-container">
                <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                <button type="button" id="modal-next" class="modal-next btn">Next</button>
            </div>
        </div>`;
    }
}
