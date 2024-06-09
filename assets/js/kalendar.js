document.addEventListener("DOMContentLoaded", function () {
    fetch('events.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const events = data.response; // Assuming the JSON structure includes 'response' field
            const calendarContainer = document.getElementById("events-container");

            events.forEach(event => {
                const eventElement = document.createElement("div");
                eventElement.className = "event";
                eventElement.innerHTML = `
                    <h2>${event.název}</h2>
                    <p>${event.datum}</p>
                    <p>${event.místo}</p>
                    <p>${event.popis}</p>
                `;
                calendarContainer.appendChild(eventElement);
            });
        })
        .catch(error => {
            console.error('Error fetching events:', error);
        });
});