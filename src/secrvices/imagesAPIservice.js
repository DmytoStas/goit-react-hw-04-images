import axios from 'axios';

export default class ImagesAPIService {
  FETCH_URL = 'https://pixabay.com/api/';
  API_KEY = '36145663-8013b2e066e1601ccab665a97';
  itemsPerPage = 12;

  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.receivedItemsCount = 0;
  }

  makeURL() {
    return `${this.FETCH_URL}?key=${this.API_KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${this.itemsPerPage}&page=${this.page}`;
  }

  async fetch() {
    const fetchResponce = await axios.get(this.makeURL());
    const { data } = fetchResponce;

    this.incrementPage();

    return data;
  }

  async fetchOnSubmit() {
    this.resetPage();
    try {
      const data = await this.fetch();
      this.receivedItemsCount = data.totalHits;

      return data;
    } catch (e) {
      throw new Error();
    }
  }

  async loadMore() {
    try {
      if (Math.ceil(this.receivedItemsCount / 12) < this.page) {
        throw new Error();
      }

      const data = await this.fetch();

      return data;
    } catch (e) {
      throw new Error();
    }
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  getItemsPerPage() {
    return this.itemsPerPage;
  }

  getReceivedItemsCount() {
    return this.receivedItemsCount;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    if (newQuery.includes(' ')) {
      this.searchQuery = newQuery.replaceAll(' ', '+');
    } else {
      this.searchQuery = newQuery;
    }
  }
}
