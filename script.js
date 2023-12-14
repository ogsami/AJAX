document.getElementById('drinkInput').addEventListener('keyup', function (event) {
    if (event.key === 'Enter') {
        searchDrink();
    }
});

function searchDrink() {
    
    const drinksuInput = document.getElementById('drinkInput').value.toLowerCase();
    const resultContainer = document.getElementById('result');
    

    // Check if the search bar is empty
    if (!drinksuInput.trim()) {
        // If empty, fetch a random drink
        fetchRandomDrink(resultContainer);
        return;
    }

    const apiUrl = `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${drinksuInput}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const drinks = data.drinks;

            if (!drinks || drinks.length === 0) {
                resultContainer.innerHTML = 'No results found for the specified drink.';
                return;
            }

            // Find the first drink with the exact name match
            const drink = drinks.find(d => d.strDrink.toLowerCase() === drinksuInput);

            if (!drink) {
                resultContainer.innerHTML = 'No exact match found for the specified drink.';
                return;
            }

            // Extract and display the instructions, ingredients, measurements, and pictures
            const instructions = drink.strInstructions;
            const ingredients = [];
            const measurements = [];
            const pictures = [];

            // Loop through ingredients and measurements
            for (let i = 1; i <= 15; i++) {
                const ingredient = drink[`strIngredient${i}`];
                const measure = drink[`strMeasure${i}`];

                if (ingredient && measure) {
                    ingredients.push(ingredient);
                    measurements.push(measure);
                } else {
                    // Stop if there are no more ingredients
                    break;
                }
            }

            // Display the results
            resultContainer.innerHTML = `
                <h2>${drink.strDrink}</h2>
                <p>${instructions}</p>
                <h3>Ingredients:</h3>
                <ul>
                    ${ingredients.map((ingredient, index) => `<li>${ingredient} - ${measurements[index]}</li>`).join('')}
                </ul>
                <img src="${drink.strDrinkThumb}" alt="${drink.strDrink}" width="200">
                <i id = mitta>(1oz = ~0,3 dl)</i>
            `;

            // Show the #mitta element
            document.getElementById('mitta').style.display = 'block';
        })
        .catch(error => {
            console.error('Error fetching drink data:', error.message);
            resultContainer.innerHTML = 'Error fetching drink data. Please try again.';
        });


}


// Random drinkki

function fetchRandomDrink(resultContainer) {
    const apiUrl = 'https://www.thecocktaildb.com/api/json/v1/1/random.php';

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const drink = data.drinks[0];

            // Display the random drink
            resultContainer.innerHTML = `
                <div id="result-content">
                    <h2>${drink.strDrink}</h2>
                    <p>${drink.strInstructions}</p>
                    <h3>Ingredients:</h3>
                    <ul>
                        ${getIngredientsList(drink)}
                    </ul>
                    <img src="${drink.strDrinkThumb}" alt="${drink.strDrink}" width="200">
                    <i id = mitta>(1oz = ~0,3 dl)</i>

                </div>
            `;

            // Show the #mitta element
            document.getElementById('mitta').style.display = 'block';
        })
        .catch(error => {
            console.error('Error fetching random drink data:', error.message);
            resultContainer.innerHTML = 'Error fetching random drink data. Please try again.';
        });
}

function getIngredientsList(drink) {
    const ingredients = [];
    for (let i = 1; i <= 15; i++) {
        const ingredient = drink[`strIngredient${i}`];
        const measure = drink[`strMeasure${i}`];

        if (ingredient && measure) {
            ingredients.push(`<li>${ingredient} - ${measure}</li>`);
        } else {
            break;
        }
    }
    return ingredients.join('');
}
