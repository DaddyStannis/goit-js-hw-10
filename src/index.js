import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;
const refs = {
  searchBox: document.getElementById('search-box'),
  countrieList: document.querySelector('.country-list'),
  countrieInfo: document.querySelector('.country-info'),
};

refs.searchBox.addEventListener(
  'input',
  debounce(event => {
    const value = event.target.value.trim();

    if (value === '') {
      clearCountriesData();
      return;
    }

    fetchCountries(value)
      .then(countries => {
        clearCountriesData();

        if (countries.length == 0) {
          Notiflix.Notify.failure('Oops, there is no country with that name');
        } else if (countries.length >= 10) {
          Notiflix.Notify.info(
            'Too many matches found. Please enter a more specific name.'
          );
        } else if (countries.length == 1) {
          printCountries(countries, true);
          let languages = Object.values(countries[0].languages).join(', ');
          printCountrieInfo(
            countries[0].capital[0],
            countries[0].population,
            languages
          );
        } else {
          printCountries(countries);
        }
      })
      .catch(error => {
        console.log(error);
      });
  }, DEBOUNCE_DELAY)
);

function printCountries(countries, accent = false) {
  const markup = countries.reduce((accumulator, country) => {
    return (
      accumulator +
      `<li class="country">
        <img class="country-flag" src="${country.flags.svg}" alt="Flag of ${
        country.name.official
      }" />
        <p class="country-name ${accent ? 'country-name-accent' : ''}">${
        country.name.official
      }</p>
      </li>`
    );
  }, '');
  refs.countrieList.innerHTML = markup;
}

function printCountrieInfo(capital, population, languages) {
  const markup = `<p class="country-info-key">
        Capital: <span class="country-info-value">${
          !capital ? '' : capital // Antarctic has no capital!
        }</span>
      </p>
      <p class="country-info-key">
        Population: <span class="country-info-value">${population}</span>
      </p>
      <p class="country-info-key">
        Languages: <span class="country-info-value">${languages}</span>
      </p>`;
  refs.countrieInfo.innerHTML = markup;
}

function clearCountriesData() {
  refs.countrieList.innerHTML = '';
  refs.countrieInfo.innerHTML = '';
}
