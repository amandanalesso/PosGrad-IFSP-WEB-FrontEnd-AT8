document.addEventListener('DOMContentLoaded', function() {
    const apiBaseUrl = "https://swapi.dev/api/";

    const containers = {
        characters: document.getElementById('characters-container'),
        planets: document.getElementById('planets-container'),
        starships: document.getElementById('starships-container')
    };

    const buttons = {
        prev: {
            characters: document.getElementById('prev-characters'),
            planets: document.getElementById('prev-planets'),
            starships: document.getElementById('prev-starships')
        },
        next: {
            characters: document.getElementById('next-characters'),
            planets: document.getElementById('next-planets'),
            starships: document.getElementById('next-starships')
        }
    };

    let data = {
        characters: [],
        planets: [],
        starships: []
    };

    let offsets = {
        characters: 0,
        planets: 0,
        starships: 0
    };

    const limit = 4;

    async function fetchData(endpoint) {
        const response = await fetch(apiBaseUrl + endpoint);
        const data = await response.json();
        return data.results;
    }

    function createCard(name) {
        return `
            <div class="card">
                <h2 class="text-lg font-semibold text-white text-center">${name}</h2>
            </div>
        `;
    }

    function populateContainer(container, items, offset) {
        const cardsToDisplay = items.slice(offset, offset + limit);
        container.innerHTML = cardsToDisplay.map(item => createCard(item.name)).join('');
    }

    async function loadData() {
        data.characters = await fetchData('people/');
        data.planets = await fetchData('planets/');
        data.starships = await fetchData('starships/');

        populateContainer(containers.characters, data.characters, offsets.characters);
        populateContainer(containers.planets, data.planets, offsets.planets);
        populateContainer(containers.starships, data.starships, offsets.starships);
    }

    function updateContainer(container, items, offset) {
        populateContainer(container, items, offset);
    }

    function scrollContainer(container, type, direction) {
        const totalItems = data[type].length;
        if (direction === 'next') {
            offsets[type] = Math.min(offsets[type] + limit, totalItems - limit);
        } else {
            offsets[type] = Math.max(offsets[type] - limit, 0);
        }
        updateContainer(container, data[type], offsets[type]);
    }

    buttons.prev.characters.addEventListener('click', () => scrollContainer(containers.characters, 'characters', 'prev'));
    buttons.next.characters.addEventListener('click', () => scrollContainer(containers.characters, 'characters', 'next'));
    buttons.prev.planets.addEventListener('click', () => scrollContainer(containers.planets, 'planets', 'prev'));
    buttons.next.planets.addEventListener('click', () => scrollContainer(containers.planets, 'planets', 'next'));
    buttons.prev.starships.addEventListener('click', () => scrollContainer(containers.starships, 'starships', 'prev'));
    buttons.next.starships.addEventListener('click', () => scrollContainer(containers.starships, 'starships', 'next'));

    loadData();
});
