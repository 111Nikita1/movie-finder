const API_KEY = '692c5c66'
const form = document.querySelector('#searchForm');
const input = document.querySelector('#movieInput');
const result = document.querySelector('#results');
const loading = document.querySelector('#loading');
const errorInput = document.querySelector('#errorInput');
const modal = document.querySelector('#modal');
const modalBody = document.querySelector('#modalBody');
const modalClose = document.querySelector('#modalClose');
form.addEventListener('submit', function (event) {
    event.preventDefault();
    const title = input.value.trim();
    if (!title) {
        errorInput.style.display = 'block';
        return;
    }
    searchMovies(title);
    input.value = '';
    errorInput.style.display = 'none';
})
async function searchMovies(title) {
    loading.style.display = 'block';
    errorInput.style.display = 'none';
    result.innerHTML = '';
    try {
        const response = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${title}`);
        const data = await response.json();
        if (!response.ok || data.Response === 'False') {
            throw new Error('Фильмы не найдены');
        }
        render(data.Search);
    } catch (error) {
        errorInput.textContent = error.message || 'Произошла ошибка при поиске';
        errorInput.style.display = 'block';
    } finally {
        loading.style.display = 'none';
    }
}
async function showDetails(imdbID) {
    loading.style.display = 'block';
    try {
        const response = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${imdbID}`);
        const data = await response.json();
        if (!response.ok || data.Response === 'False') {
            throw new Error('Сервер ответил: ' + response.status);
        }
        renderInfo(data);
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    } catch (error) {
        console.log(error);
    } finally {
        loading.style.display = 'none';
    }
}
function renderInfo (dataDetails) {
    modalBody.innerHTML = '';
    const div = document.createElement('div');
    const poster = document.createElement('img');
    poster.src = dataDetails.Poster !== 'N/A' ? dataDetails.Poster : 'https://pno-ns.ru/images/2023/01/28/no-img.png';
    const pTitle = document.createElement('p');
    pTitle.textContent = dataDetails.Title;
    const pYear = document.createElement('p');
    pYear.textContent = dataDetails.Year;
    div.appendChild(poster);
    div.appendChild(pTitle);
    div.appendChild(pYear);
    const rows = [
        ['Режиссёр', dataDetails.Director],
        ['Актёры',   dataDetails.Actors],
        ['Жанр',     dataDetails.Genre],
        ['Длительность', dataDetails.Runtime],
        ['Рейтинг',  dataDetails.imdbRating],
    ];
    rows.forEach(([label, value]) => {
        const p = document.createElement('p');
        p.textContent = `${label}: ${value}`;
        div.appendChild(p);
    })
    const pPlot = document.createElement('p');
    pPlot.textContent = dataDetails.Plot;
    div.appendChild(pPlot);
    modalBody.appendChild(div);
}
function render (dataTitle) {
    result.innerHTML = '';
    dataTitle.forEach(film => {
        const buttonCard = document.createElement('button');
        const pTitle = document.createElement('p');
        const pYear = document.createElement('p');
        const poster = document.createElement('img');
        
        pTitle.textContent = film.Title;
        pYear.textContent = film.Year;
        poster.src = film.Poster !== 'N/A' ? film.Poster : 'https://pno-ns.ru/images/2023/01/28/no-img.png';
        buttonCard.dataset.id = film.imdbID;
        buttonCard.addEventListener('click', function () {
            showDetails(film.imdbID);
        })
        buttonCard.appendChild(poster);
        buttonCard.appendChild(pTitle);
        buttonCard.appendChild(pYear);
        result.appendChild(buttonCard);
    })
    loading.style.display = 'none';
}
modalClose.addEventListener('click', function () {
    modal.style.display = 'none'
    document.body.style.overflow = '';
})