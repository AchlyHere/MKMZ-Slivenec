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

            // Najít nejbližší budoucí schůzku
            let closestMeeting = null;
            let closestDate = null;

            data.schuzky.forEach(meeting => {
                meeting.dates.forEach(date => {
                    const meetingDate = new Date(date);
                    if (meetingDate > now && (closestDate === null || meetingDate < closestDate)) {
                        closestMeeting = { name: meeting.name, address: meeting.address, date: meetingDate };
                        closestDate = meetingDate;
                    }
                });
            });

            meetingsContainer.innerHTML = ''; // Vymazání všech předchozích schůzek

            if (closestMeeting) {
                const meetingDiv = document.createElement('div');
                meetingDiv.classList.add('meeting');

                const title = document.createElement('h2');
                title.textContent = closestMeeting.name;
                meetingDiv.appendChild(title);

                const address = document.createElement('p');
                address.textContent = `Adresa: ${closestMeeting.address}`;
                meetingDiv.appendChild(address);

                const date = document.createElement('p');
                date.textContent = `Datum: ${closestMeeting.date.toLocaleString('cs-CZ')}`;
                meetingDiv.appendChild(date);

                meetingsContainer.appendChild(meetingDiv);
            } else {
                // Zobrazení zprávy, pokud nejsou žádné budoucí schůzky
                const noMeetingsMessage = document.createElement('p');
                noMeetingsMessage.textContent = 'Žádné další naplánované schůzky';
                noMeetingsMessage.classList.add('no-meetings-message');
                meetingsContainer.appendChild(noMeetingsMessage);
            }
        })
        .catch(error => console.error('Error loading meetings:', error));
});
