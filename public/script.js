console.log('Sanity Check: JS is working!');

$(document).ready(function () {
  // Declare all htmlElements that will be targeted
  const htmlElements = {
    seeAllPokemon: $('#see-all-pokemon'),
    seeOnePokemon: $('#searchForPokemonSubmit'),
    listGroup: $('.list-group'),
    pokemonTable: $('#pokemon-table'),
  };
  // Add a click event listener to the see-all-pokemon button
  htmlElements.seeAllPokemon.click(function () {
    // Check to see if the data has already been fetched
    if (htmlElements.pokemonTable.find('td').length > 0) {
      return;
    };
    // If not, fetch the pokemon data and add it to the table
    fetch('http://mutably.herokuapp.com/pokemon')
    .then(pokemonData => pokemonData.json())
    .then(parsedPokemonData => {
      for (var index in parsedPokemonData) {
        let allPokemonData = parsedPokemonData[index];
        allPokemonData.forEach(index => {
          htmlElements.pokemonTable.append(`<tr id=${index.name}>
            <td>${index.name}</td>
            <td>${index.pokedex}</td>
            <td>${index.evolves_from}</td>
            <td>${index.image}</td>
          </tr>`);
        });
      }
    })
    .catch(error => console.log('Oh no: ' + error));
  });

  // Add a click event listener for searchForPokemonSubmit button
  htmlElements.seeOnePokemon.click(function () {
    // First, prevent the form from posting data
    event.preventDefault();
    // Then, empty the table if there is data
    clearTable();
    // Next, obtain the form data
    let formData = $('form').serializeArray();
    // Next, fetch the pokemon data, and add the data that matches the submitted name to the table
    fetch('http://mutably.herokuapp.com/pokemon')
    .then(pokemonData => pokemonData.json())
    .then(parsedPokemonData => {
      for (var index in parsedPokemonData) {
        let allPokemonData = parsedPokemonData[index];
        let filteredPokemonData = allPokemonData.filter(index => index.name === formData[0].value);
        htmlElements.pokemonTable.append(`<tr id=${filteredPokemonData[0].name}>
          <td>${filteredPokemonData[0].name}</td>
          <td>${filteredPokemonData[0].pokedex}</td>
          <td>${filteredPokemonData[0].evolves_from}</td>
          <td>${filteredPokemonData[0].image}</td>
        </tr>`);
      }
    })
    .catch(error => console.log('Oh no: ' + error));
  });

  // Create a function that clears the table data
  function clearTable() {
    htmlElements.pokemonTable.empty();
  };
});
