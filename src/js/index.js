import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import ImgApiService from './img-servise';
import {createGallery} from './create-markup';
import renderGallery from './rendergallery';

const refs = {
  form: document.querySelector('.search-form'),
  buttonSearch: document.querySelector('button[type="submit"]'),
  buttonMore: document.querySelector('button[type="button"]'),
  galleryEl: document.querySelector('.gallery'),
  pElement: document.querySelector('.notification-text'),
  };

//Создаем экземпляри классов поискового сервиса и галереи изображений
const imgService = new ImgApiService();
let galleryImg = new SimpleLightbox('.gallery a');


refs.buttonMore.classList.add('visually-hidden');

//события для кнопок
refs.form.addEventListener('submit', (e) =>{
  e.preventDefault();
  onSearch();}
  );
refs.buttonMore.addEventListener('click', onSearch);

//Асинх. функция 
async function onSearch(){
    const searchQuery = refs.form.elements[0].value.trim();
    
    // Если запрос пустой или последняя страница при таком же запросе, то код не работает
    if (searchQuery === ''){
      Notiflix.Notify.info('Enter search data, please!');
      return;
    };

    if ((searchQuery === imgService.query)&(imgService.status === "end")){
      return;
    };

   
    refs.buttonSearch.disabled = true;
    refs.buttonMore.classList.add('visually-hidden');

    
    const answer = await imgService.fetchImages(searchQuery);
    const totalHits = answer.totalHits;

    //Если информации по запросу нет, виходим
    if (totalHits === 0){
      if ( imgService.query !== ""){useByttons()}else{refs.buttonSearch.disabled = false;};
      return Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    };

   
    if(imgService.isnewquerty){ 
      Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
    };
    
    const gallery = await createGallery(answer.hits);
    renderGallery(refs.galleryEl, gallery, imgService.isnewquerty);
    
    galleryImg.refresh();
    useByttons();
};

function useByttons(){
  refs.buttonSearch.disabled = false;
   
  if (imgService.status === "end"){
    refs.buttonMore.classList.add('visually-hidden');
    refs.pElement.classList.remove('visually-hidden');
    }else{
      refs.buttonMore.classList.remove('visually-hidden');
    refs.pElement.classList.add('visually-hidden');
    };
};