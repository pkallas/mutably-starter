console.log('Sanity Check: JS is working!');

$(document).ready(function () {
  const htmlElements = {
    seeAllPokemon: $('#see-all-pokemon'),
    seeOnePokemon: $('#searchForPokemonSubmit'),
    listGroup: $('.list-group'),
    pokemonTable: $('#pokemon-table'),
  };
  htmlElements.seeAllPokemon.click(function () {
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
        console.log(formattedPokemonData);
        console.log('This is happening');
      }
    })
    .catch(error => console.log('Oh no: ' + error));
  });
});
