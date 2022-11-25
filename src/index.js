// Стили
import './css/common.css';
import './css/style.css';
//Библиотеки
import Notiflix from 'notiflix';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
//Части кода
import { Pixabay } from './js/fetch';

import { refs } from './js/refs';
const { inputSearchEl, searchFormEl, btnLoadMoreEl, galleryEl } = refs;

import templates from './templates/cards.hbs';
// ==============================================================
searchFormEl.addEventListener('submit', onClickSubmit);
btnLoadMoreEl.addEventListener('click', onClickLoadMore);

const lightbox = new SimpleLightbox('.gallery a', {
  captionDelay: 250,
});

const pixabay = new Pixabay();

async function onClickSubmit(event) {
  event.preventDefault();

  btnLoadMoreEl.classList.add('is-hidden');

  pixabay.searchInput = event.target.elements.searchQuery.value.trim();
  pixabay.page = 1;

  if (pixabay.searchInput === '') {
    galleryEl.innerHTML = '';

    Notiflix.Notify.failure('Введите что-то пожалуйста.');
    return;
  }

  try {
    const { data } = await pixabay.fetchPhotos();

    if (data.hits.length === 0) {
      galleryEl.innerHTML = '';

      Notiflix.Notify.failure('По вашему запросу ничего не найдено :<');
      return;
    }

    if (data.totalHits > pixabay.per_page) {
      btnLoadMoreEl.classList.remove('is-hidden');
    }

    galleryEl.innerHTML = templates(data.hits);
    Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
    lightbox.refresh();
  } catch (error) {
    console.log(error);
  }
}
async function onClickLoadMore() {
  pixabay.page += 1;

  try {
    const { data } = await pixabay.fetchPhotos();

    if (pixabay.page === Math.ceil(data.totalHits / pixabay.per_page)) {
      btnLoadMoreEl.classList.add('is-hidden');
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    }

    galleryEl.insertAdjacentHTML('beforeend', templates(data.hits));
    lightbox.refresh();
    scrollDown();
  } catch (error) {
    console.log(error);
  }
}

function scrollDown() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
