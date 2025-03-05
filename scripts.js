document.addEventListener('DOMContentLoaded', function () {
    // Existing code for meetings
    const meetings = [
        { date: '' },
        { date: '' },
        { date: '' }
    ];
  
    const meetingsContainer = document.getElementById('meetings-container');
  
    if (meetings.length === 0 || meetings.every(meeting => meeting.date === '')) {
        const noMeetingsMessage = document.createElement('p');
        noMeetingsMessage.textContent = 'Žádné další naplánované schůzky';
        noMeetingsMessage.classList.add('no-meetings-message');
        meetingsContainer.appendChild(noMeetingsMessage);
    } else {
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
  
    // New code for hamburger menu
    const toggleBtn = document.querySelector('.toggle-btn');
    const leftSection = document.querySelector('.left-section');
  
    if (toggleBtn && leftSection) {
      toggleBtn.addEventListener('click', function() {
        leftSection.classList.toggle('open');
      });
  
      // Close menu when clicking outside
      document.addEventListener('click', function(event) {
        const isClickInsideMenu = leftSection.contains(event.target);
        const isClickOnToggleBtn = toggleBtn.contains(event.target);
        
        if (!isClickInsideMenu && !isClickOnToggleBtn && leftSection.classList.contains('open')) {
          leftSection.classList.remove('open');
        }
      });
    }
  });
  