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
            const groupedMeetings = {};

            // Group meetings by name
            meetings.forEach(meeting => {
                if (!groupedMeetings[meeting.name]) {
                    groupedMeetings[meeting.name] = [];
                }
                meeting.dates.forEach(date => {
                    const meetingDate = new Date(date);
                    if (meetingDate >= today) {
                        groupedMeetings[meeting.name].push(meetingDate);
                    }
                });
            });

            // Display grouped meetings
            let hasFutureMeetings = false;
            for (const name in groupedMeetings) {
                if (groupedMeetings.hasOwnProperty(name)) {
                    const meetingDates = groupedMeetings[name];

                    if (meetingDates.length > 0) {
                        hasFutureMeetings = true; // Set flag if there is a future meeting

                        const meetingDiv = document.createElement('div');
                        meetingDiv.classList.add('meeting');

                        const nameHeader = document.createElement('h2');
                        nameHeader.textContent = name;
                        meetingDiv.appendChild(nameHeader);

                        meetingDates.forEach(meetingDate => {
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
                        });

                        meetingsContainer.appendChild(meetingDiv);
                    }
                }
            }

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
