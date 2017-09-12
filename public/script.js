console.log('Sanity Check: JS is working!');

$(document).ready(function () {
  // Declare all htmlElements that will be targeted
  const htmlElements = {
    seeAllPokemon: $('#see-all-pokemon'),
    seeOnePokemon: $('#searchForPokemonSubmit'),
    listGroup: $('.list-group'),
    pokemonTable: $('#pokemon-table'),
    createNewPokemon: $('#createNewPokemonSubmit'),
  };
  // Add a click event listener to the see-all-pokemon button
  htmlElements.seeAllPokemon.click(function () {
    // Check to see if a user has searched for one pokemonTable
    if (htmlElements.pokemonTable.find('td').length === 4) {
      // If yes, clear the table to skip over the next check
      clearTable();
    };
    // Check to see if the data has already been fetched
    if (htmlElements.pokemonTable.find('td').length > 0) {
      return;
    };
    // If not, fetch the pokemon data and add it to the table
    getAllPokemon();
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
    // After the fetch is completed, clear all forms
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
    .catch(error => {
      htmlElements.pokemonTable.append(`<tr id=no-such-pokemon>
      <td>That Pokemon doesn't exist. Try again</td>
      <td>That Pokemon doesn't exist. Try again</td>
      <td>That Pokemon doesn't exist. Try again</td>
      <td>That Pokemon doesn't exist. Try again</td>
      </tr>`);
      console.log('Error ==> ' + error);
    });
  });

  // Add a click event listener to createNewPokemonSubmit button
  htmlElements.createNewPokemon.click(function () {
    // First, prevent the form from posting data
    event.preventDefault();
    // Then, empty the table if there is data
    clearTable();
    // Next, obtain the form data
    let formData = $('form').serializeArray();
    console.log(formData[1].value);
    console.log(formData[2].value);
    console.log(formData[3].value);
    console.log(formData[4].value);
    // Next, use fetch to post the data to http://mutably.herokuapp.com/pokemon
    fetch('http://mutably.herokuapp.com/pokemon', {
      method: 'post',
      body: JSON.stringify({
        name: formData[1].value,
        pokedex: formData[2].value,
        evolves_from: formData[3].value,
        image: formData[4].value,
      }),
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    })
    .then(responseToCreation => {
      console.log(responseToCreation);
      getAllPokemon();
    });
  });

  // Create a function that clears the table data
  function clearTable() {
    htmlElements.pokemonTable.empty();
  };

  // Create a function to get all Pokemon
  function getAllPokemon() {
    fetch('http://mutably.herokuapp.com/pokemon')
    .then(pokemonData => pokemonData.json())
    .then(parsedPokemonData => {
      for (var index in parsedPokemonData) {
        let allPokemonData = parsedPokemonData[index];
        allPokemonData.forEach(index => {
          fetch(index.image, { mode: 'no-cors', header: { 'Access-Control-Allow-Origin': '*', }, })
          .then(response => response.blob())
          .then(imageBlob => $('img').attr({ src: URL.createObjectURL(imageBlob), }))
          .then(parsedImage => {
            htmlElements.pokemonTable.append(`<tr id=${index.name}>
              <td>${index.name}</td>
              <td>${index.pokedex}</td>
              <td>${index.evolves_from}</td>
              <td>${parsedImage}</td>
            </tr>`);
          })
          .catch(error => console.log('Oh no: ' + error));
        });
      }
    })
    .catch(error => console.log('Oh no: ' + error));
  };

  // Create a function to empty the forms
  function clearAllForms() {
    $('form').serializeArray().forEach(index => index.value = '');
  };
});
