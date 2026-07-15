// DOM Element References matching your HTML IDs exactly
const stateInput = document.getElementById('state-input');
const fetchAlertsBtn = document.getElementById('fetch-alerts');
const alertsDisplay = document.getElementById('alerts-display');
const errorMessage = document.getElementById('error-message');

// Event Listener matching your click execution flow
if (fetchAlertsBtn) {
  fetchAlertsBtn.addEventListener('click', () => {
    const state = stateInput ? stateInput.value.trim() : '';
    fetchWeatherAlerts(state);
    clearInput();
  });
}

/**
 * Step 1 & 4: Fetch alerts based on the given U.S. state abbreviation
 */
function fetchWeatherAlerts(state) {
  // Clear out preexisting error text and reset classes before making the fetch call
  if (errorMessage) {
    errorMessage.textContent = '';
    errorMessage.classList.add('hidden');
  }

  // Force uppercase alignment for API compatibility
  const stateUpper = state.toUpperCase();
  clearUI();

  // FIX: This template literal now matches the exact endpoint string expected by the test
  return fetch(`https://api.weather.gov/alerts/active?area=${stateUpper}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`API Error: State code '${stateUpper}' not found or service down.`);
      }
      return response.json();
    })
    .then(data => {
      console.log(data); // Console log testing hook requested in Step 1
      displayAlerts(data);
    })
    .catch(errorObject => {
      console.log(errorObject.message); // Console log catch requirement requested in Step 4
      displayError(errorObject);
    });
}

/**
 * Step 2: Extract attributes dynamically and populate the UI layout
 */
function displayAlerts(data) {
  if (!alertsDisplay) return;

  const features = data.features || [];
  const count = features.length;
  
  // Extract the title property directly from the API response object to match 'Weather Alerts: 2'
  const apiTitle = data.title || 'Current watches, warnings, and advisories';

  // Create the summary text block using the required string format
  const summaryHeader = document.createElement('h2');
  summaryHeader.id = 'alerts-summary';
  summaryHeader.textContent = `${apiTitle}: ${count}`;
  alertsDisplay.append(summaryHeader);

  // Generate list of alert headlines safely
  const alertsList = document.createElement('ul');
  alertsList.id = 'alerts-list';

  features.forEach(alert => {
    const headlineText = alert.properties?.headline || 'No headline text supplied';
    const li = document.createElement('li');
    li.textContent = headlineText;
    alertsList.append(li);
  });

  alertsDisplay.append(alertsList);
}

/**
 * Step 3: Input processing and general cleanup adjustments
 */
function clearInput() {
  if (stateInput) {
    stateInput.value = '';
  }
}

function clearUI() {
  if (alertsDisplay) {
    alertsDisplay.innerHTML = '';
  }
}

/**
 * Step 4: Visual processing of system failures
 */
function displayError(errorObject) {
  clearUI();
  if (errorMessage) {
    errorMessage.textContent = errorObject.message;
    errorMessage.classList.remove('hidden');
  }
}

// Module export architecture configuration for direct Jest validation matching
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { 
    fetchWeatherAlerts, 
    displayAlerts, 
    displayError, 
    clearInput 
  };
}
