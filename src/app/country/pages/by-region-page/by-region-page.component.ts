import { Component, inject, linkedSignal } from '@angular/core';
import { CountryListComponent } from '../../components/country-list/country-list.component';
import { Region } from '../../interfaces/region.type';
import { rxResource } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';
import { CountryService } from '../../services/country.service';
import { ActivatedRoute, Router } from '@angular/router';

const validateQueryParam = (queryParams: string): Region => {
  queryParams = queryParams.toLocaleLowerCase();

  const validRegion: Record<string, Region> = {
    africa: 'Africa',
    americas: 'Americas',
    asia: 'Asia',
    europe: 'Europe',
    oceania: 'Oceania',
    antarctic: 'Antarctic',
  };

  return validRegion[queryParams] ?? 'Americas';
};

@Component({
  selector: 'app-by-region-page',
  imports: [CountryListComponent],
  templateUrl: './by-region-page.component.html',
})
export class ByRegionPageComponent {
  public regions: Region[] = [
    'Africa',
    'Americas',
    'Asia',
    'Europe',
    'Oceania',
    'Antarctic',
  ];

  countryService = inject(CountryService);

  activateRoute = inject(ActivatedRoute);
  router = inject(Router);

  queryParams = this.activateRoute.snapshot.queryParamMap.get('region') ?? '';
  selectedRegion = linkedSignal<Region>(() =>
    validateQueryParam(this.queryParams)
  );

  regionResource = rxResource({
    request: () => ({
      region: this.selectedRegion(),
    }),
    loader: ({ request }) => {
      if (!request.region) return of([]);

      this.router.navigate(['/country/by-region'], {
        queryParams: {
          region: request.region,
        },
      });
      return this.countryService.searchByRegion(request.region);
    },
  });
  selectRegion = (region: Region) => {
    this.selectedRegion.set(region);
  };
}
