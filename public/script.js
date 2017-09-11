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
    // If not, fetch the data and add it to the table
    fetch('http://mutably.herokuapp.com/pokemon')
    .then(pokemonData => pokemonData.json())
    .then(formattedPokemonData => {
      for (var index in formattedPokemonData) {
        let allPokemonData = formattedPokemonData[index];
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
});
