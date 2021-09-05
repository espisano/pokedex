const $listContainer = document.querySelector('#list-container');

function getPokemonList(limit = 20, offset = 0) {
  const URL = 'https://pokeapi.co/api/v2/';
  fetch(`${URL}pokemon?limit=${limit}&offset=${offset}`)
    .then((response) => response.json())
    .then((data) => {
      const { count: totalPokemons, results: pokemons } = data;
      pokemonsList(pokemons);
      const amountPages = calculatePagination(totalPokemons, limit);
      //pagination(amountPages);
    });
}

function calculatePagination(totalPokemons, limit) {
  const amountPages = totalPokemons / limit;
  return Math.ceil(amountPages);
}

function pokemonsList(pokemons) {
  $listContainer.textContent = 'Pokemon List';
  pokemons.forEach((pokemon) => {
    const pokemonUrl = pokemon.url;
    const $list = document.createElement('a');
    $list.setAttribute('data-url', `${pokemonUrl}`);
    $list.classList.add('list-group-item', 'list-group-item-action');
    $list.textContent = pokemon.name;
    $listContainer.appendChild($list);
  });
}

function pagination(amountPages) {
  const $pagination = document.querySelector('#pagination');
  const $previousItemContainer = document.createElement('li');
  $previousItemContainer.classList.add('page-item');
  const $previousItem = document.createElement('a');
  $previousItem.classList.add('page-link');
  $previousItem.setAttribute('href', '#');
  $previousItem.textContent = 'Previous';
  $pagination.appendChild($previousItemContainer);
  $pagination.appendChild($previousItem);
  for (let i = 0; i < amountPages; i += 1) {
    const $itemContainer = document.createElement('li');
    $itemContainer.classList.add('page-item');
    const $item = document.createElement('a');
    $item.classList.add('page-link');
    $item.setAttribute('href', '#');
    $item.textContent = i + 1;
    $item.setAttribute('data-page', i);
    $pagination.appendChild($itemContainer);
    $pagination.appendChild($item);
  }
  const $nextItemContainer = document.createElement('li');
  $nextItemContainer.classList.add('page-item');
  const $nextItem = document.createElement('a');
  $nextItem.classList.add('page-link');
  $nextItem.setAttribute('href', '#');
  $nextItem.textContent = 'Next';
  $pagination.appendChild($nextItemContainer);
  $pagination.appendChild($nextItem);
}

function handlePaginator() {
  const $pagination = document.querySelector('.pagination');
  $pagination.onclick = (e) => {
    const $element = e.target;
    const $active = $pagination.querySelector('.selected');
    if ($active) {
      $active.classList.remove('selected');
    }
    $element.classList.add('selected');
    const offsetMultiplicator = $element.dataset.page;
    const offset = 20 * offsetMultiplicator;
    getPokemonList(20, offset);
  };
}

function handleEvent() {
  $listContainer.onclick = (e) => {
    const $element = e.target;
    const $active = $listContainer.querySelector('.selected');
    if ($element === $listContainer) {
      () => {}; 
    } else {
      if ($active) {
        $active.classList.remove('selected');
      }

      $element.classList.add('selected');
      getPokemonPicture();
      getPokemonName();
      getPokemonSize();
      getPokemonType();
      getPokemonNumber();
    }
  };
}

function getPokemonInfo() {
  const $pokemonUrl = $listContainer.querySelector('.selected');
  const pokemonUrl = $pokemonUrl.dataset.url;
  return fetch(`${pokemonUrl}`)
    .then((response) => response.json());
}

async function getPokemonPicture() {
  const pokemonInfo = await getPokemonInfo();
  const picture = pokemonInfo.sprites.other['official-artwork'].front_default;
  const $mainScreen = document.querySelector('#main-screen');
  $mainScreen.style.backgroundImage = `url('${picture}')`;
}

async function getPokemonName() {
  const pokemonInfo = await getPokemonInfo();
  const { name } = pokemonInfo;
  const $nameScreen = document.querySelector('#name-screen');
  $nameScreen.textContent = `${name}`;
}

async function getPokemonSize() {
  const pokemonSize = await getPokemonInfo();
  const { weight, height } = pokemonSize;
  const $aboutScreen = document.querySelector('#about-screen');
  $aboutScreen.textContent = `Height:${height} Weight: ${weight}`;
}

async function getPokemonType() {
  const pokemonType = await getPokemonInfo();
  const { name } = pokemonType.types[0].type;
  const $typeScreen = document.querySelector('#type-screen');
  $typeScreen.textContent = `${name}`;
}

async function getPokemonNumber() {
  const pokemonNumber = await getPokemonInfo();
  const { id } = pokemonNumber;
  const $idScreen = document.querySelector('#id-screen');
  $idScreen.textContent = `#${id}`;
}

handleEvent();
getPokemonList();
handlePaginator();
pagination(54);
