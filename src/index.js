import './sass/main.scss';
import Notiflix from 'notiflix';
import axios from 'axios';


const searchBlock = document.querySelector('.search-block');
const searchInput = document.querySelector('#search-input');
const searchForm = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const buttonLoad = document.querySelector('.load-more');
const buttonUp = document.querySelector('.button-up');
let perPage = 40;
let page = 0;
let inputValue = searchInput.value;

buttonLoad.style.display = 'none';
buttonUp.style.display = 'none';

async function fetchImages(inputValue, page) {
  const searchParams = new URLSearchParams({
    key:'24937750-2ed08653801c0d28e5986ff83',
    q:inputValue,
    image_type:'photo',
    orientation:'horizontal',
    safesearch:true,
    page:page,
    per_page: perPage
  });
  try {
    const response = await axios.get(
      `https://pixabay.com/api/?${searchParams}`,
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

const clearGallery = elems => {
  [...elems.children].forEach(elem => elem.remove())
}
async function loadGallery(event) {
  event.preventDefault();
  clearGallery(gallery);
  buttonLoad.style.display = 'none';
  page = 1;
  inputValue = searchInput.value;
  fetchImages(inputValue, page)
    .then(inputValue => {
      let allPages = Math.ceil(inputValue.totalHits / perPage);
      if (inputValue.hits.length > 0) {
        Notiflix.Notify.success(`Hooray! We found ${inputValue.totalHits} images.`);
        createGallery(inputValue);
        buttonUp.style.display = 'block';
        buttonUp.addEventListener('click', () => {
          searchBlock.scrollIntoView({
            behavior: 'smooth',
          });
        });
        if (page < allPages) {
          buttonLoad.style.display = 'block';
        } else {
          buttonLoad.style.display = 'none';
          Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
        }
      } else {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.',
        );
        clearGallery(gallery);
      }
    })
    .catch(error => console.log(error));
}
searchForm.addEventListener('submit', loadGallery);

function createGallery(inputValue) {
  const markup = inputValue.hits
    .map(hit => {
      return `<div class="photo-card">
  <img src="${hit.webformatURL}" alt="${hit.tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      <br>${hit.likes}</br>
    </p>
    <p class="info-item">
      <b>Views</b>
      <br>${hit.views}</br>
    </p>
    <p class="info-item">
      <b>Comments</b>
      <br>${hit.comments}</br>
    </p>
    <p class="info-item">
      <b>Downloads</b>
      <br>${hit.downloads}</br>
    </p>
  </div>
</div>`;
    })
    .join('');
  gallery.insertAdjacentHTML('beforeend', markup);
}




buttonLoad.addEventListener('click', () => {
    inputValue = searchInput.value;
    page += 1;
    fetchImages(inputValue, page).then(inputValue => {
      let allPages = Math.ceil(inputValue.totalHits / perPage);
      createGallery(inputValue);

      //smooth scroll
      const { height: cardHeight } = document
        .querySelector('.gallery')
        .firstElementChild.getBoundingClientRect();

      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });

      if (page >= allPages) {
        buttonLoad.style.display = 'none';
        Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
      }
    });
  },
);