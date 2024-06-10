document.addEventListener("DOMContentLoaded", function () {
    fetch('events.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(events => {
            const calendarContainer = document.getElementById("calendar");

            events.forEach(event => {
                const eventElement = document.createElement("div");
                eventElement.className = "event";
                eventElement.innerHTML = `<h2>${event.title}</h2><p>${event.date}</p><p>${event.location}</p>`;
                calendarContainer.appendChild(eventElement);
            });
        })
        .catch(error => {
            console.error('Error fetching events:', error);
        });
});