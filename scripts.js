 document.addEventListener('DOMContentLoaded', function () {
  // Array of meetings with their dates and descriptions
  const meetings = [
      { date: '' },
      { date: '' },
      { date: '' }
  ];

  const meetingsContainer = document.getElementById('meetings-container');

  if (meetings.length === 0 || meetings.every(meeting => meeting.date === '')) {
      // Show the message if there are no more meetings planned
      const noMeetingsMessage = document.createElement('p');
      noMeetingsMessage.textContent = 'Žádné další naplánované schůzky';
      noMeetingsMessage.classList.add('no-meetings-message');
      meetingsContainer.appendChild(noMeetingsMessage);
  } else {
      // Loop through meetings array and create HTML elements for each meeting
      meetings.forEach(meeting => {
          if (meeting.date) {
              const meetingDiv = document.createElement('div');
              meetingDiv.classList.add('meeting');

              const dateHeader = document.createElement('h2');
              dateHeader.textContent = meeting.date;

              const descriptionParagraph = document.createElement('p');
              descriptionParagraph.textContent = meeting.description;

              meetingDiv.appendChild(dateHeader);
              meetingDiv.appendChild(descriptionParagraph);

              meetingsContainer.appendChild(meetingDiv);
          }
      });
  }
});