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
    // First, clear the table
    clearTable();
    // Then, fetch the pokemon data and add it to the table
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
        <td><button class="delete-button">Delete</button><span class="pokemon-id">${parsedPokemonData._id}</span></td>
        <td><button id="edit-button-${parsedPokemonData.name}" class="edit-button">Edit</button><span class="pokemon-name">${parsedPokemonData.name}</span><input id="edit-form-${parsedPokemonData.name}" class="edit-form" type="text" value=${parsedPokemonData.name}></input><button id="save-button-${parsedPokemonData.name}" class="save-button">Save</button></td>
        <td><button id="edit-button-${parsedPokemonData.pokedex}" class="edit-button">Edit</button><span class="pokedex-number">${parsedPokemonData.pokedex}</span><input id="edit-form-${parsedPokemonData.pokedex}" class="edit-form" type="text" value=${parsedPokemonData.pokedex}></input><button id="save-button-${parsedPokemonData.pokedex}" class="save-button">Save</button></td>
        <td><button id="edit-button-${parsedPokemonData.evolves_from}" class="edit-button">Edit</button><span class="evolution">${parsedPokemonData.evolves_from}</span><input id="edit-form-${parsedPokemonData.evolves_from}" class="edit-form" type="text" value=${parsedPokemonData.evolves_from}></input><button id="save-button-${parsedPokemonData.evolves_from}" class="save-button">Save</button></td>
        <td><button id="edit-button-${parsedPokemonData.image}" class="edit-button">Edit</button><img src=${parsedPokemonData.image}></img><input id="edit-form-${parsedPokemonData.image}" class="edit-form" type="text" value=${parsedPokemonData.image}></input><button id="save-button-${parsedPokemonData.image}" class="save-button">Save</button></td>
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
              <td><button class="delete-button">Delete</button><span class="pokemon-id">${index._id}</span></td>
              <td><button id="edit-button-${index.name}" class="edit-button">Edit</button><span class="pokemon-name">${index.name}</span><input id="edit-form-${index.name}" class="edit-form" type="text" value=${index.name}></input><button id="save-button-${index.name}" class="save-button">Save</button></td>
              <td><button id="edit-button-${index.pokedex}" class="edit-button">Edit</button><span class="pokedex-number">${index.pokedex}</span><input id="edit-form-${index.pokedex}" class="edit-form" type="text" value=${index.pokedex}></input><button id="save-button-${index.pokedex}" class="save-button">Save</button></td>
              <td><button id="edit-button-${index.evolves_from}" class="edit-button">Edit</button><span class="evolution">${index.evolves_from}</span><input id="edit-form-${index.evolves_from}" class="edit-form" type="text" value=${index.evolves_from}></input><button id="save-button-${index.evolves_from}" class="save-button">Save</button></td>
              <td><button id="edit-button-${index.image}" class="edit-button">Edit</button><img src=${index.image}></img><input id="edit-form-${index.image}" class="edit-form" type="text" value=${index.image}></input><button id="save-button-${index.image}" class="save-button">Save</button></td>
            </tr>`);
          });
      }
    })
    .catch(error => console.log('Error ==> ' + error));
  };

  // When you click on the dynamically generated edit buttons, hide the edit button,
  // hide the html text, show the form with the same text, and show the save button
  $(document).on('click', '.edit-button', function () {
    let currentText = $(this).parent().children()[1];
    let currentEditForm = $(this).parent().children()[2];
    let currentSaveButton = $(this).parent().children()[3];
    $(this).toggle();
    $(currentText).toggle();
    $(currentEditForm).toggle();
    $(currentSaveButton).toggle();
  });

  // When you click on the dynamically generated save buttons, hide the save button,
  // hide the form, show the html text, show the edit buttons, and send the new data
  // to the mutably site, then finally obtain and display the new data
  $(document).on('click', '.save-button', function () {
    let currentText = $(this).parent().children()[1];
    let currentEditForm = $(this).parent().children()[2];
    let currentEditButton = $(this).parent().children()[0];
    let formDataName = $(this).parent().parent().children()[1].childNodes[2].value;
    let formDataPokedex = $(this).parent().parent().children()[2].childNodes[2].value;
    let formDataEvolution = $(this).parent().parent().children()[3].childNodes[2].value;
    let formDataImage = $(this).parent().parent().children()[4].childNodes[2].value;
    let pokemonID = $(this).parent().siblings().children()[1].innerText;
    fetch(`http://mutably.herokuapp.com/pokemon/${pokemonID}`, {
      method: 'put',
      body: JSON.stringify({
        name: formDataName,
        pokedex: formDataPokedex,
        evolves_from: formDataEvolution,
        image: formDataImage,
      }),
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    })
    .then(responseToUpdate => {
      console.log(responseToUpdate);
      clearTable();
      getAllPokemon();
      $(this).toggle();
      $(currentText).toggle();
      $(currentEditForm).toggle();
      $(currentEditButton).toggle();
    })
    .catch(error => console.log('Error ==> ' + error));
  });

  // When you click on the dynamically created delete buttons, send a fetch with method delete
  // to the mutably site, then reload the table with the new data
  $(document).on('click', '.delete-button', function () {
    let pokemonID = $(this).siblings()[0].innerText;
    fetch(`http://mutably.herokuapp.com/pokemon/${pokemonID}`, { method: 'delete' })
    .then(responseToDelete => {
      console.log(responseToDelete);
      clearTable();
      getAllPokemon();
    })
    .catch(error => console.log('Error ==> ' + error));
  });
});
