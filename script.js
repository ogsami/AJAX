function searchDrink() {
    const drinksuInput = document.getElementById('drinkInput').value;
    const resultContainer = document.getElementById('result');

    if (!drinksuInput) {
        alert('Please enter a drink');
        return;
    }


    const apiUrl = 'www.thecocktaildb.com/api/json/v1/1/search.php?s=margarita'


    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            // Process and display data as needed
            console.log(data);
            resultContainer.innerHTML = JSON.stringify(data, null, 2);
        })
        .catch(error => {
            console.error('Error fetching drink data:', error.message);
            resultContainer.innerHTML = 'Error fetching drink data. Please try again.';
        });
}
