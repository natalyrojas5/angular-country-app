import { Component, inject, linkedSignal, signal } from '@angular/core';
import { SearchInputComponent } from '../../components/search-input/search-input.component';
import { CountryListComponent } from '../../components/country-list/country-list.component';
import { CountryService } from '../../services/country.service';
import { of } from 'rxjs';

import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-by-capital-page',
  standalone: true,
  imports: [SearchInputComponent, CountryListComponent],
  templateUrl: './by-capital-page.component.html',
})
export class ByCapitalPageComponent {
  countryService = inject(CountryService);

  activateRoute = inject(ActivatedRoute);
  router = inject(Router);

  queryParams = this.activateRoute.snapshot.queryParamMap.get('query') ?? '';
  query = linkedSignal(() => this.queryParams);

  countryResource = rxResource({
    request: () => ({
      query: this.query(),
    }),
    loader: ({ request }) => {
      if (!request.query) return of([]);

      this.router.navigate(['/country/by-capital'], {
        queryParams: {
          query: request.query,
        },
      });

      return this.countryService.searchByCapital(request.query);
    },
  });

  /*
  isLoading = signal(false);
  isError = signal<string | null>(null);
  countries = signal<Country[]>([]);
  onSearch(query: string) {
    if (this.isLoading()) return;

    this.isLoading.set(true);
    this.isError.set(null);

    this.countryService.searchByCapital(query).subscribe({
      next: (countries) => {
        this.isLoading.set(false);
        this.countries.set(countries);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.countries.set([]);
        this.isError.set(`No se encontró un país con esa capital: ${query}`);
      },
    });
  }
  */
}
