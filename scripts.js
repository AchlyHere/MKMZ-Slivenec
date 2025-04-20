document.addEventListener('DOMContentLoaded', function () {
    fetch('meetings.json')
        .then(response => response.json())
        .then(data => {
            const meetings = data.schuzky;
            const meetingsContainer = document.getElementById('meetings-container');

            if (!meetings || meetings.length === 0) {
                const noMeetingsMessage = document.createElement('p');
                noMeetingsMessage.textContent = 'Žádné další naplánované schůzky';
                noMeetingsMessage.classList.add('no-meetings-message');
                meetingsContainer.appendChild(noMeetingsMessage);
                return;
            }

            const today = new Date();
            let hasFutureMeetings = false;

            meetings.forEach(meeting => {
                const meetingDiv = document.createElement('div');
                meetingDiv.classList.add('meeting');

                const nameHeader = document.createElement('h2');
                nameHeader.textContent = meeting.name;
                meetingDiv.appendChild(nameHeader);

                if (meeting.dates && meeting.dates.length > 0) {
                    let hasValidDates = false;
                    const datesContainer = document.createElement('div'); // Create a container for dates

                    meeting.dates.forEach(date => {
                        const meetingDate = new Date(date);

                        if (meetingDate >= today) {
                            hasFutureMeetings = true;
                            hasValidDates = true;

                            const formattedDate = meetingDate.toLocaleDateString('cs-CZ', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            });
                            const dateParagraph = document.createElement('p');
                            dateParagraph.textContent = formattedDate;
                            datesContainer.appendChild(dateParagraph); // Append dates to the container
                        }
                    });

                    if (hasValidDates) {
                        meetingDiv.appendChild(datesContainer); // Append dates container to the meetingDiv
                         const addressParagraph = document.createElement('p');
                        addressParagraph.textContent = 'Adresa: ' + meeting.address;
                        addressParagraph.style.marginTop = '10px'; // Add margin
                        meetingDiv.appendChild(addressParagraph);

                        const gpsParagraph = document.createElement('p');
                        gpsParagraph.textContent = `GPS: ${meeting.gpsCoordinates.latitude}, ${meeting.gpsCoordinates.longitude}`;
                        gpsParagraph.style.marginTop = '5px'; // Add margin
                        meetingDiv.appendChild(gpsParagraph);
                    }
                     if (!hasValidDates) {
                             const noDatesMessage = document.createElement('p');
                            noDatesMessage.textContent = 'Žádné termíny';
                            meetingDiv.appendChild(noDatesMessage);
                         }

                } else {
                    const noDatesMessage = document.createElement('p');
                    noDatesMessage.textContent = 'Žádné termíny';
                    meetingDiv.appendChild(noDatesMessage);
                }

                meetingsContainer.appendChild(meetingDiv);
            });

            if (!hasFutureMeetings) {
                const noMeetingsMessage = document.createElement('p');
                noMeetingsMessage.textContent = 'Žádné další naplánované schůzky';
                noMeetingsMessage.classList.add('no-meetings-message');
                meetingsContainer.appendChild(noMeetingsMessage);
            }
        })
        .catch(error => {
            console.error('Error fetching meetings:', error);
            const meetingsContainer = document.getElementById('meetings-container');
            const errorMessage = document.createElement('p');
            errorMessage.textContent = 'Nepodařilo se načíst schůzky.';
            errorMessage.classList.add('no-meetings-message');
            meetingsContainer.appendChild(errorMessage);
        });
});
