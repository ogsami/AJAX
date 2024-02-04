// täs ootetaa jos painaa entterii nii ajetaa searchDrink funktio
document.getElementById('drinkInput').addEventListener('keyup', function (event) {
    if (event.key === 'Enter') {
        searchDrink();
    }
});

// ja täs sama homma jos painaa nappii
document.getElementById('searchButton').addEventListener('click', searchDrink);

// alkuu tuli useempi ingredient osuma vaikka niis oli Null etc. joten otetaa niist vaa ne mis on jotai järkevää
function getIngredientsList(drink) {
    const ingredients = [];
    for (let i = 1; i <= 15; i++) {
        const ingredient = drink[`strIngredient${i}`];
        const measure = drink[`strMeasure${i}`];

        if (ingredient) {
            // ja huomasin että jos aineksen määrää ei ollut nii se jäi pois joten korjattiinpa sekin
            const ingredientText = measure ? `${ingredient} - ${measure}` : ingredient;
            ingredients.push(`<li>${ingredientText}</li>`);
        } else {
            break;
        }
    }
    return ingredients.join('');
}



function searchDrink() {
    const drinksuInput = document.getElementById('drinkInput').value.toLowerCase();
    const resultContainer = document.getElementById('result');

    // jos hakuun ei oo kirjotettu mitää nii haetaa random juoma
    if (!drinksuInput.trim()) {
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

            // haetaa api tuloksen seasta tarkka osuma, alkuun tuli monta samantyylistä
            const drink = drinks.find(d => d.strDrink.toLowerCase() === drinksuInput);

            if (!drink) {
                resultContainer.innerHTML = 'No exact match found for the specified drink.';
                return;
            }

            // ja sieltä haetaa tiedot mitä haluun
            const instructions = drink.strInstructions;

            // näytetää tulokset sivulla, tää oli jotenki helpompi laittaa tänne javascriptin sekaa
            resultContainer.innerHTML = `
                <h2>${drink.strDrink}</h2>
                <p>${instructions}</p>
                <h3>Ingredients:</h3>
                <ul>
                    ${getIngredientsList(drink)}
                </ul>
                <img src="${drink.strDrinkThumb}" alt="${drink.strDrink}" width="200">
                <i id="mitta">(1oz = ~0,3 dl)</i>
            `;

            // näytetää mitta info vaan kun tulee tulos
            document.getElementById('mitta').style.display = 'block';
        })
        .catch(error => {
            console.error('Error fetching drink data:', error.message);
            resultContainer.innerHTML = 'Error fetching drink data. Please try again.';
            // ja täs taas piilotetaa se
            document.getElementById('mitta').style.display = 'none';
        });
}

// Random drinkki

function fetchRandomDrink(resultContainer) {
    const apiUrl = 'https://www.thecocktaildb.com/api/json/v1/1/random.php';

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const drink = data.drinks[0];

            // ja näytetää random drinkin ohjeet samallai
            resultContainer.innerHTML = `
                <div id="result-content">
                    <h2>${drink.strDrink}</h2>
                    <p>${drink.strInstructions}</p>
                    <h3>Ingredients:</h3>
                    <ul>
                        ${getIngredientsList(drink)}
                    </ul>
                    <img src="${drink.strDrinkThumb}" alt="${drink.strDrink}" width="200">
                    <i id="mitta">(1oz = ~0,3 dl)</i>
                </div>
            `;

            document.getElementById('mitta').style.display = 'block';
        })
        .catch(error => {
            console.error('Error fetching random drink data:', error.message);
            resultContainer.innerHTML = 'Error fetching random drink data. Please try again.';
            document.getElementById('mitta').style.display = 'none';
        });
}




