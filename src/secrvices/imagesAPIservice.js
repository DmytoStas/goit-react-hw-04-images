import axios from 'axios';

const FETCH_URL = 'https://pixabay.com/api/';
const API_KEY = '36145663-8013b2e066e1601ccab665a97';

export default async function fetchImagesAPIService(query, page, itemsPerPage) {
  const { data } = await axios.get(
    `${FETCH_URL}?key=${API_KEY}&q=${prettyQuery(
      query
    )}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${itemsPerPage}&page=${page}`
  );
  return data;
}

function prettyQuery(newQuery) {
  if (newQuery.includes(' ')) {
    return newQuery.replaceAll(' ', '+');
  } else {
    return newQuery;
  }
}
