document.addEventListener('DOMContentLoaded', function () {
    // Získání referencí na potřebné HTML elementy
    const hamburger = document.getElementById('hamburger');
    const leftSection = document.querySelector('.left-section');
    const rightSection = document.querySelector('.right-section');

    // Přidání event listeneru pro kliknutí na hamburger ikonu
    hamburger.addEventListener('click', function() {
        // Přepínání CSS tříd pro změnu vzhledu a stavu menu
        hamburger.classList.toggle('open');
        leftSection.classList.toggle('collapsed');
        rightSection.classList.toggle('expanded');
    });

    // Načítání schůzek z meetings.json
    fetch('meetings.json')
        .then(response => response.json())
        .then(data => {
            const meetingsContainer = document.getElementById('meetings-container');
            const now = new Date();

            // Filtrace budoucích schůzek
            const futureMeetings = data.schuzky.map(meeting => {
                const futureDates = meeting.dates.filter(date => new Date(date) > now);
                return { name: meeting.name, address: meeting.address, dates: futureDates };
            }).filter(meeting => meeting.dates.length > 0);

            if (futureMeetings.length === 0) {
                // Zobrazení zprávy, pokud nejsou žádné budoucí schůzky
                const noMeetingsMessage = document.createElement('p');
                noMeetingsMessage.textContent = 'Žádné další naplánované schůzky';
                noMeetingsMessage.classList.add('no-meetings-message');
                meetingsContainer.appendChild(noMeetingsMessage);
            } else {
                // Vytvoření HTML elementů pro každou schůzku
                futureMeetings.forEach(meeting => {
                    const meetingDiv = document.createElement('div');
                    meetingDiv.classList.add('meeting');

                    const title = document.createElement('h2');
                    title.textContent = meeting.name;
                    meetingDiv.appendChild(title);

                    const address = document.createElement('p');
                    address.textContent = `Adresa: ${meeting.address}`;
                    meetingDiv.appendChild(address);

                    const datesList = document.createElement('ul');
                    meeting.dates.forEach(date => {
                        const listItem = document.createElement('li');
                        listItem.textContent = new Date(date).toLocaleString('cs-CZ');
                        datesList.appendChild(listItem);
                    });
                    meetingDiv.appendChild(datesList);

                    meetingsContainer.appendChild(meetingDiv);
                });
            }
        })
        .catch(error => console.error('Error loading meetings:', error));
});
