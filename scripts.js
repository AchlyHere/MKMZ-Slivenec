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

  // Pole schůzek s daty a popisy
  const meetings = [
      { date: '' },
      { date: '' },
      { date: '' }
  ];

  const meetingsContainer = document.getElementById('meetings-container');

  // Kontrola, zda jsou naplánovány nějaké schůzky
  if (meetings.length === 0 || meetings.every(meeting => meeting.date === '')) {
    // Zobrazení zprávy, pokud nejsou naplánovány žádné další schůzky
    const noMeetingsMessage = document.createElement('p');
    noMeetingsMessage.textContent = 'Žádné další naplánované schůzky';
    noMeetingsMessage.classList.add('no-meetings-message');
    meetingsContainer.appendChild(noMeetingsMessage);
  } else {
    // Vytvoření HTML elementů pro každou schůzku
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