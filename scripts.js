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
                return; // Stop processing if there are no meetings
            }

            let hasFutureMeetings = false;
            const today = new Date();

            meetings.forEach(meeting => {
                if (meeting.dates && meeting.dates.length > 0) {
                    meeting.dates.forEach(date => {
                        const meetingDate = new Date(date);

                        if (meetingDate >= today) {  // Display only future meetings
                            hasFutureMeetings = true; // Set flag if there is a future meeting

                            const meetingDiv = document.createElement('div');
                            meetingDiv.classList.add('meeting');

                            const nameHeader = document.createElement('h2');
                            nameHeader.textContent = meeting.name;
                            meetingDiv.appendChild(nameHeader);

                            const formattedDate = meetingDate.toLocaleDateString('cs-CZ', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            });
                            const dateParagraph = document.createElement('p');
                            dateParagraph.textContent = formattedDate;
                            meetingDiv.appendChild(dateParagraph);

                            meetingsContainer.appendChild(meetingDiv);
                        }
                    });
                }
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
