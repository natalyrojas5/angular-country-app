import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, delay, map, of, tap, throwError } from 'rxjs';
import { RESTCountry } from '../interfaces/rest-countries.interface';
import { Country } from '../interfaces/country.interface';
import { CountryMapper } from '../mappers/country.mapper';
import { Region } from '../interfaces/region.type';

const API_URL = 'https://restcountries.com/v3.1';

@Injectable({
  providedIn: 'root',
})
export class CountryService {
  private http = inject(HttpClient);
  private queryCacheCapital = new Map<string, Country[]>();
  private queryCacheCountry = new Map<string, Country[]>();
  private queryCacheRegion = new Map<Region, Country[]>();

  searchByCapital(query: string): Observable<Country[]> {
    query = query.toLocaleLowerCase();

    if (this.queryCacheCapital.has(query)) {
      return of(this.queryCacheCapital.get(query) ?? []);
    }

    return this.http.get<RESTCountry[]>(`${API_URL}/capital/${query}`).pipe(
      map((resp) => CountryMapper.mapRestCountryArrayToContryArray(resp)),
      tap((countries) => this.queryCacheCapital.set(query, countries)),
      catchError((err) => {
        console.log(err);
        return throwError(
          () => new Error('No se pudo obtener países con ese query')
        );
      })
    );
  }

  searchByCountry(query: string) {
    query = query.toLocaleLowerCase();

    if (this.queryCacheCountry.has(query)) {
      return of(this.queryCacheCountry.get(query) ?? []);
    }

    return this.http.get<RESTCountry[]>(`${API_URL}/name/${query}`).pipe(
      map((resp) => CountryMapper.mapRestCountryArrayToContryArray(resp)),
      tap((countries) => this.queryCacheCountry.set(query, countries)),
      delay(300),
      catchError((err) => {
        console.log(err);
        return throwError(
          () => new Error('No se pudo obtener países con ese query')
        );
      })
    );
  }

  searchByRegion(region: Region) {
    if (this.queryCacheRegion.has(region)) {
      return of(this.queryCacheRegion.get(region) ?? []);
    }

    return this.http.get<RESTCountry[]>(`${API_URL}/region/${region}`).pipe(
      map((resp) => CountryMapper.mapRestCountryArrayToContryArray(resp)),
      tap((countries) => this.queryCacheRegion.set(region, countries)),
      catchError((err) => {
        console.log(err);
        return throwError(
          () => new Error('No se pudo obtener países con ese query')
        );
      })
    );
  }

  searchCountryByAlphaCode(code: string) {
    const url = `${API_URL}/alpha/${code}`;

    return this.http.get<RESTCountry[]>(url).pipe(
      map((resp) => CountryMapper.mapRestCountryArrayToContryArray(resp)),
      map((countries) => countries.at(0)),
      catchError((err) => {
        console.log(err);
        return throwError(
          () => new Error('No se pudo obtener países con ese código')
        );
      })
    );
  }
}
