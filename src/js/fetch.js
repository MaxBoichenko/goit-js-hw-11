import axios from 'axios';

export class Pixabay {
  #URL = 'https://pixabay.com/api/';
  #KEY = '31542452-7ed7dccea9488ffb3b28232e1';

  constructor() {
    this.page = null;
    this.per_page = 40;
    this.searchInput = null;
  }

  fetchPhotos() {
    const searchParams = new URLSearchParams({
      key: this.#KEY,
      q: this.searchInput,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
      page: this.page,
      per_page: this.per_page,
    });

    return axios.get(`${this.#URL}?${searchParams}`);
  }
}
