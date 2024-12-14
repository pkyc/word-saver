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
                <label>Name:</label>
                <span>${result.name || '-'}</span>
            </div>
            <div class="record-field">
                <label>Price:</label>
                <span>${result.price || '-'}</span>
            </div>
            <div class="record-field">
                <label>Quantity:</label>
                <span>${result.quantity || '-'}</span>
            </div>
            <div class="record-field">
                <label>Unit:</label>
                <span>${result.unit || '-'}</span>
            </div>
            <div class="record-field">
                <label>Unit Price:</label>
                <span>${result.unit_price || '-'}</span>
            </div>
            <div class="record-field">
                <label>Merchandizer:</label>
                <span>${result.Merchandizer || '-'}</span>
            </div>
            <div class="record-field">
                <label>Date:</label>
                <span>${result.date || '-'}</span>
            </div>
            
            <div class="record-field">
                <label>Status:</label>
                <span class="status-${result.status?.toLowerCase()}">${result.status || '-'}</span>
            </div>
            <div class="record-field">
                <label>Created:</label>
                <span>${result.createdAt ? new Date(result.createdAt).toLocaleDateString() : '-'}</span>
            </div>
            <div class="record-field">
                <label>Last Updated:</label>
                <span>${result.updatedAt ? new Date(result.updatedAt).toLocaleDateString() : '-'}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }
});
