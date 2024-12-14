const nameInput = document.getElementById('name');
const nameList = document.getElementById('name-list');
const resultDiv = document.getElementById('result');

// Fetch matching names as the user types
nameInput.addEventListener('input', async () => {
  const query = nameInput.value;
  if (!query) {
    nameList.innerHTML = '';
    return;
  }

  const response = await fetch(`/api/autocomplete?query=${encodeURIComponent(query)}`);
  const suggestions = await response.json();

  if (suggestions.error) {
    console.error(suggestions.error);
    nameList.innerHTML = '';
  } else {
    nameList.innerHTML = suggestions
      .map((name) => `<option value="${name}"></option>`)
      .join('');
  }
});

// Handle form submission
document.getElementById('search-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const name = nameInput.value;
  const response = await fetch(`/api/search?name=${encodeURIComponent(name)}`);
  const result = await response.json();

  if (result.error) {
    resultDiv.textContent = result.error;
  } else {
    resultDiv.innerHTML = `
      <div class="record-container">
        <h2>Result</h2>
        <div class="record-content">
          <div class="record-summary">
            <div class="record-field">
                <span>${result.name || '-'}</span>
            </div>
            <div class="record-field">
                <strong>$ </strong> <span>${result.price || '-'}</span>
            </div>
            <div class="record-field">
                <label>Quantity:</label>
                <span>${result.quantity || '-'} </span
                <strong><span>${result.unit || '-'} </span></strong>
            </div>
            <div class="record-field">
                <label>Unit Price:</label>
                <span>${result.unit_price || '-'}</span>
                <span>${result.unit || '-'}</span>
            </div>
            <div class="record-field">
                <label>Merchandizer:</label>
                <span>${result.Merchandizer || '-'}</span>
            </div>
            <div class="record-field">
                <label>Date:</label>
                <span>${result.date || '-'}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }
});
