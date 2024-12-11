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
      <h2>Record Details</h2>
      <pre>${JSON.stringify(result, null, 2)}</pre>
    `;
  }
});
