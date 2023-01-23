// TODO: Wire up the app's behavior here.

/* Disable Add Log button until logs are displayed */
// Get the button
const addLogBtn = document.querySelector('#addLog');
// Disable the button
addLogBtn.disabled = true;

/**  Make UVU ID visible only after course selection has been made **/
// Get references to the form elements
const courseSelect = document.getElementById('course');
const studentIdInput = document.getElementById('uvuId');

// Hide the student ID input field by default
studentIdInput.style.display = 'none';

// Add an event listener to the course select form
courseSelect.addEventListener('change', function () {
  // Check if a course has been selected
  if (courseSelect.value !== '') {
    // Show the student ID input field
    studentIdInput.style.display = 'block';
  } else {
    // Hide the student ID input field
    studentIdInput.style.display = 'none';
  }
});

/*Dynamic display of data from fetch request */
// Dynamically display data within form>select elements
const select = document.getElementById('course');

fetch(
  'https://jsonservere5wv4m-jam2--3000.local-credentialless.webcontainer.io/api/v1/courses'
)
  .then((response) => response.json())
  .then((data) => {
    // Create an option element for each course
    data.forEach((course) => {
      const option = document.createElement('option');
      // set values and content to the appropriate course attributes
      option.value = course.id;
      option.textContent = course.display;
      select.appendChild(option);
    });
    select.options[0].selected = false;
  })
  .catch((error) => {
    console.error('Error fetching courses:', error);
  });

/* Make the paragragh data within the <pre> tags only visible on click of when clicked */
const logEntries = document.querySelectorAll('.log-entries li , .log-entries');

logEntries.forEach((logEntry) => {
  logEntry.addEventListener('click', () => {
    const text = logEntry.querySelector('pre');
    text.classList.toggle('active');
    text.style.display = text.style.display === 'none' ? 'block' : 'none';
  });
});

/* UVU Id Validation */
/* Ensure uvuId input checks input for strings no longer than 8 and returns error codes for violations*/
const input = document.getElementById('uvuId');
input.value = 'Enter a valid UVU ID        eg. 10234567';

input.addEventListener('input', (event) => {
  // Ensure character length never exceeds 8
  if (event.target.value.length > 8) {
    event.target.value = event.target.value.substring(0, 8);
  }
  // Only allow numbers, no letters or other characters
  if (!/^\d+$/.test(event.target.value)) {
    event.target.value = event.target.value.replace(/[^\d]/g, '');
  }
  console.log(courseSelect.value);
  // When character length reaches 8 and it's only digits, fire off an AJAX request
  if (event.target.value.length === 8) {
    // capture passed courseId and uvuId
    const courseId = courseSelect.value;
    console.log(`couseId is ${courseId}`);
    const uvuId = event.target.value;
    console.log(`uvuId is ${uvuId}`);
    fetch(
      `https://jsonservere5wv4m-jam2--3000.local-credentialless.webcontainer.io/api/v1/logs?coursId=${courseId}&uvuId=${uvuId}`
    )
      .then((response) => {
        if (response.status === 200 || response.status === 304) {
          return response.json();
        } else {
          throw new Error('Invalid UVU ID');
        }
      })
      .then((data) => {
        // check if object is empty
        if (Object.keys(data).length === 0) {
          throw new Error('Invalid UVU ID');
          // check if the courseId passed in input matches the courseID in response
          // ensures response data reflects only records where a course log has been made under
          // the appropriate uvuId
        } else if (data.find((obj) => obj.courseId === courseId)) {
          // Display results
          console.log(data[0]);
          // Get the log entries container
          const logEntries = document.querySelector('.log-entries');
          // Clear the container before appending new entries
          logEntries.innerHTML = '';
          // Iterate over the log data
          data.forEach((log) => {
            // set h3 header
            const uvuIdDisplay = document.querySelector('#uvuIdDisplay');
            // Update the innerHTML to show the chosen UVU ID
            uvuIdDisplay.innerHTML = `Student Logs for ${log.uvuId}`;
            // Create a new list item
            const logItem = document.createElement('li');
            // Create the log date element
            const logDate = document.createElement('div');
            logDate.innerHTML = `<small>${log.date}</small>`;
            // Create the log text element
            const logText = document.createElement('pre');
            logText.innerHTML = `<p>${log.text}</p>`;
            // Append the date and text elements to the list item
            logItem.appendChild(logDate);
            logItem.appendChild(logText);
            // Append the list item to the log entries container
            logEntries.appendChild(logItem);
          });
          addLogBtn.disabled = false;

          // display only log dates with on click event to view text entries list-items
          const logEntriesLi = document.querySelectorAll('.log-entries li');
          logEntriesLi.forEach((logEntry) => {
            logEntry.addEventListener('click', () => {
              // text is queried from the <pre> -preformatted tag
              const text = logEntry.querySelector('pre');
              text.style.display =
                text.style.display === 'none' ? 'block' : 'none';
            });
          });

          console.log(data);
        } else {
          throw new Error(
            `No Course Logs could be found for ${courseId} Course under the uvuid ${uvuId}`
          );
        }
      })
      .catch((error) => {
        // Appropriately guide the user
        // Create a Div to set our warning within
        const errorDiv = document.createElement('div');
        errorDiv.classList.add('error-message');
        errorDiv.innerText = error.message;
        // Append the error message to the body of the document
        document.body.appendChild(errorDiv);
        // Remove the error message after 5 seconds
        setTimeout(() => {
          errorDiv.remove();
        }, 5000);
      });
  }
});

// NOTE: The TODOs are listed in index.html
