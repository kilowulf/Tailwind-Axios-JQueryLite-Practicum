/* Disable Add Log button until logs are displayed */
// Get the button
const addLogBtn = document.querySelector('#addLog');
// Disable the button
addLogBtn.disabled = true;

/** Make UVU ID visible only after course selection has been made **/
// Get references to the form elements
const courseSelect = document.getElementById('course');
const studentIdInput = document.getElementById('uvuId');

// Hide the student ID input field by default
studentIdInput.classList.add('.hidden');

// Add an event listener to the course select form
courseSelect.addEventListener('change', function () {
  // Check if a course has been selected
  if (courseSelect.value !== '') {
    // Show the student ID input field
    studentIdInput.classList.remove('hidden');
  } else {
    // Hide the student ID input field
    studentIdInput.classList.add('hidden');
  }
});

/*Dynamic display of data from fetch request */
// Dynamically display data within form>select elements
const select = document.getElementById('course');

axios
  .get(
    'https://jsonserverpazgcu-umxz--3000.local-credentialless.webcontainer.io/api/v1/courses'
  )
  .then((response) => {
    response.data.forEach((course) => {
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
$('.log-entries li , .log-entries').click(function () {
  $(this).find('pre').toggleClass('active');
});

/* UVU Id Validation /
/ Ensure uvuId input checks input for strings no longer than 8 and returns error codes for violations*/
const input = document.getElementById('uvuId');
input.value = 'Enter a valid UVU ID eg. 10234567';

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
    axios
      .get(
        'https://jsonserverpazgcu-umxz--3000.local-credentialless.webcontainer.io/api/v1/logs?coursId=${courseId}&uvuId=${event.target.value}'
      )
      .then((response) => {
        if (response.status === 200) {
          // Enable the add log button
          addLogBtn.disabled = false;
          // Clear any previous log entries
          $('.log-entries').empty();
          // Dynamically display log entries
          response.data.forEach((log) => {
            const date = new Date(log.date);
            const dateStr = date.toLocaleDateString();
            const logEntry = (
              <li>
                {' '}
                <div>${dateStr}</div> <pre>${log.entry}</pre>{' '}
              </li>
            );
            $('.log-entries').append(logEntry);
          });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }
});
