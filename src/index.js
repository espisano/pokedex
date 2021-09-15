const $listContainer = document.querySelector('#list-container');
const $limitPokemons = 20;

function getPokemonsData(limit = $limitPokemons, offset = 0) {
  const URL = 'https://pokeapi.co/api/v2/';
  return fetch(`${URL}pokemon?limit=${limit}&offset=${offset}`)
    .then((response) => response.json())
    .then((response) => Object.assign(response, { pokemonLimit: `${limit}` }))
    .then((response) => Object.assign(response, { pokemonOffset: `${offset}` }));
}

async function initializePokedex() {
  const data = await getPokemonsData();
  const {
    count: totalPokemons, results: pokemons, pokemonLimit: limit, pokemonOffset: offset 
  } = data;
  const amountPages = calculatePagination(totalPokemons, limit);
  pokemonsList(pokemons);
  pagination(amountPages);
}

async function updatePokedex(limit = $limitPokemons, offset = 0) {
  const data = await getPokemonsData(limit, offset);
  const { results: pokemons } = data;
  pokemonsList(pokemons);
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
  const $pagination = document.querySelector('.pagination');
  const $previousItemContainer = document.createElement('li');
  $previousItemContainer.classList.add('page-item');
  $previousItemContainer.id = ('previous-button-disable');
  const $previousItem = document.createElement('a');
  $previousItem.id = ('previous-button');
  $previousItem.classList.add('page-link');
  $previousItem.setAttribute('href', '#');
  $previousItem.textContent = 'Previous';
  $pagination.appendChild($previousItemContainer);
  $previousItemContainer.appendChild($previousItem);
  for (let i = 0; i < amountPages; i += 1) {
    const $itemContainer = document.createElement('li');
    $itemContainer.classList.add('page-item');
    const $item = document.createElement('a');
    $item.classList.add('page-link');
    $item.classList.add('numeration');
    $item.setAttribute('href', '#');
    $item.textContent = i + 1;
    // eslint-disable-next-line prefer-template
    $item.id = 'ID' + (i + 1);
    $item.setAttribute('data-page', i);
    $pagination.appendChild($itemContainer);
    $itemContainer.appendChild($item);
  }
  const $nextItemContainer = document.createElement('li');
  $nextItemContainer.classList.add('page-item');
  const $nextItem = document.createElement('a');
  $nextItem.classList.add('page-link');
  $nextItem.id = ('next-button');
  $nextItemContainer.id = ('next-button-disable');
  $nextItem.setAttribute('href', '#');
  $nextItem.textContent = 'Next';
  $pagination.appendChild($nextItemContainer);
  $nextItemContainer.appendChild($nextItem);
}

function handlePaginator() {
  const $pagination = document.querySelector('.pagination');

  $pagination.onclick = (e) => {
    const $element = e.target;
    const $previousButton = document.querySelector('#previous-button');
    const $nextButton = document.querySelector('#next-button');
    const $previousButtonDisabled = document.querySelector('#previous-button-disable');
    const $nextButtonDisabled = document.querySelector('#next-button-disable');
    const $asd = document.querySelector('li');
    const $active = $pagination.querySelector('.selected');
    const $totalPages = document.querySelectorAll('.numeration');
    const lastPage = $totalPages.length - 1;
    if ($element === $pagination
      || $element === $previousButtonDisabled
      || $element === $asd
      || $element === $nextButtonDisabled) {
      () => {};
    } else if ($element === $previousButton) {
      previousPage($active, $totalPages);
      console.log($element);
    } else if ($element === $nextButton) {
      nextPage($active, $totalPages, lastPage);
    } else {
      goToNumber($element, $active, $totalPages, lastPage);
    }
  };
}

function previousPage($active, $totalPages) {
  if ($active === $totalPages[0]) {
    disablePaginatorItem();
  } else {
    const offsetMultiplicator = $active.dataset.page - 1;
    const offset = $limitPokemons * offsetMultiplicator;
    const newSelect = 'ID' + $active.dataset.page;
    $active.classList.remove('selected');
    const $newSelect = document.querySelector(`#${newSelect}`);
    $newSelect.classList.add('selected');
    updatePokedex(limit = $limitPokemons, offset);
  }
}

function nextPage($active, $totalPages, lastPage) {
  if ($active === $totalPages[lastPage]) {
    disablePaginatorItem();
  } else {
    const offsetMultiplicator = Number($active.dataset.page) + 1;
    const offset = $limitPokemons * offsetMultiplicator;
    const numberNewSelect = Number($active.dataset.page) + 2;
    const newSelect = 'ID' + numberNewSelect;
    $active.classList.remove('selected');
    const $newSelect = document.querySelector(`#${newSelect}`);
    $newSelect.classList.add('selected');
    updatePokedex(limit = $limitPokemons, offset);
  }
}

function goToNumber($element, $active, $totalPages, lastPage) {
  if ($active === $totalPages[0] || $active === $totalPages[lastPage]) {
    () => {};
  } if ($active) {
    $active.classList.remove('selected');
  }

  $element.classList.add('selected');
  const offsetMultiplicator = $element.dataset.page;
  const offset = $limitPokemons * offsetMultiplicator;
  updatePokedex(limit = $limitPokemons, offset);
  disablePaginatorItem();
}

function handleEvent() {
  $listContainer.onclick = (e) => {
    const $element = e.target;
    const $active = $listContainer.querySelector('.selected');
    if ($element === $listContainer) {
      console.log($element);
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
      console.log($element);
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
handlePaginator();
initializePokedex();

function disablePaginatorItem() {
  const $active = document.querySelector('.selected');
  const $previousButtonContainer = document.querySelector('#previous-button-disable');
  const $nextButtonContainer = document.querySelector('#next-button-disable');
  const $previousButton = document.querySelector('#previous-button');
  const $nextButton = document.querySelector('#next-button');
  const $totalPages = document.querySelectorAll('.numeration');
  const lastPage = $totalPages.length - 1;
  if ($active === $totalPages[0]) {
    $previousButtonContainer.classList.add('disabled');
    $previousButton.setAttribute('tabindex', '-1');
    $previousButton.setAttribute('aria-disabled', 'true');
    $nextButtonContainer.classList.remove('disabled');
    $nextButton.setAttribute('tabindex', '');
  } else if ($active === $totalPages[lastPage]) {
    $nextButtonContainer.classList.add('disabled');
    $nextButton.setAttribute('tabindex', '-1');
    $nextButton.setAttribute('aria-disabled', 'true');
    $previousButtonContainer.classList.remove('disabled');
    $previousButton.setAttribute('tabindex', '');
  } else {
    $previousButtonContainer.classList.remove('disabled');
    $nextButtonContainer.classList.remove('disabled');
    $previousButton.setAttribute('tabindex', '');
    $nextButton.setAttribute('tabindex', '');
  }
}
