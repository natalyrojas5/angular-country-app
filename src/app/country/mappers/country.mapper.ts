import { Country } from '../interfaces/country.interface';
import { RESTCountry } from '../interfaces/rest-countries.interface';

export class CountryMapper {
  static mapRestCountryToCountry(resCountry: RESTCountry): Country {
    return {
      capital: resCountry.capital?.join(',') ?? 'No capital',
      cca2: resCountry.cca2,
      flag: resCountry.flag,
      flagSvg: resCountry.flags.svg,
      name: resCountry.translations['spa'].common ?? 'No Name',
      population: resCountry.population,

      region: resCountry.region,
      subRegion: resCountry.subregion,
    };
  }

  static mapRestCountryArrayToContryArray(
    resCountry: RESTCountry[]
  ): Country[] {
    return resCountry.map(this.mapRestCountryToCountry);
  }
}
