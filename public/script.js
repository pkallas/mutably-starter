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
    if (htmlElements.pokemonTable.find('td').length === 5) {
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
    // After the fetch is completed, clear the search form
    fetch(`http://mutably.herokuapp.com/pokemon/${formData[0].value}`)
    .then(pokemonData => pokemonData.json())
    .then(parsedPokemonData => {
      htmlElements.pokemonTable.append(`<tr id=${parsedPokemonData._id}>
        <td>${parsedPokemonData._id}</td>
        <td>${parsedPokemonData.name}<input id="edit-form-${parsedPokemonData.name}" class="edit-form" type="text" value=${parsedPokemonData.name}></input><button id="edit-button-${parsedPokemonData.name}" class="edit-button">Edit</button><button id="save-button-${parsedPokemonData.name}" class="save-button">Save</button><button class="delete-button">Delete</button></td>
        <td>${parsedPokemonData.pokedex}<input id="edit-form-${parsedPokemonData.pokedex}" class="edit-form" type="text" value=${parsedPokemonData.pokedex}></input><button id="edit-button-${parsedPokemonData.pokedex}" class="edit-button">Edit</button><button id="save-button-${parsedPokemonData.pokedex}" class="save-button">Save</button><button class="delete-button">Delete</button></td>
        <td>${parsedPokemonData.evolves_from}<input id="edit-form-${parsedPokemonData.evolves_from}" class="edit-form" type="text" value=${parsedPokemonData.evolves_from}></input><button id="edit-button-${parsedPokemonData.evolves_from}" class="edit-button">Edit</button><button id="save-button-${parsedPokemonData.evolves_from}" class="save-button">Save</button><button class="delete-button">Delete</button></td>
        <td><img src=${parsedPokemonData.image}></img></td>
      </tr>`);
      $('form')[0].reset();
    })
    .catch(error => {
      htmlElements.pokemonTable.append(`<tr id=no-such-pokemon>
      <td>That Pokemon doesn't exist. Try again</td>
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
      // Next, get the updated list of Pokemon
      console.log(responseToCreation);
      getAllPokemon();
      // Finally, clear the forms that were filled out
      $('form')[1].reset();
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
            htmlElements.pokemonTable.append(`<tr id=${index._id}>
              <td>${index._id}</td>
              <td>${index.name}<input id="edit-form-${index.name}" class="edit-form" type="text" value=${index.name}></input><button id="edit-button-${index.name}" class="edit-button">Edit</button><button id="save-button-${index.name}" class="save-button">Save</button><button class="delete-button">Delete</button></td>
              <td>${index.pokedex}<input id="edit-form-${index.pokedex}" class="edit-form" type="text" value=${index.pokedex}></input><button id="edit-button-${index.pokedex}" class="edit-button">Edit</button><button id="save-button-${index.pokedex}" class="save-button">Save</button><button class="delete-button">Delete</button></td>
              <td>${index.evolves_from}<input id="edit-form-${index.evolves_from}" class="edit-form" type="text" value=${index.evolves_from}></input><button id="edit-button-${index.evolves_from}" class="edit-button">Edit</button><button id="save-button-${index.evolves_from}" class="save-button">Save</button><button class="delete-button">Delete</button></td>
              <td><img src=${index.image}></img></td>
            </tr>`);
          });
      }
    })
    .catch(error => console.log('Error ==> ' + error));
  };

  // Create a function to edit information for a pokemon
  // function editPokemon() {
  //   let editForm = $('.edit-form')
  //   fetch(`http://mutably.herokuapp.com/pokemon/${formData[0].value}`, {
  //     method: 'put',
  //     body: JSON.stringify({
  //       name: ,
  //       pokedex: ,
  //       evolves_from: ,
  //     }),
  //     headers: new Headers({
  //       'Content-Type': 'application/json'
  //     })
  //   })
  // }
});
