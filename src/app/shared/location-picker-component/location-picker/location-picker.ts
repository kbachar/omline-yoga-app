import { AfterViewInit, Component, DestroyRef, ElementRef, inject, model, signal, ViewChild } from '@angular/core';
import { Location } from '../../location-data';
import { environment } from '../../../../environments/environment';
import { GoogleMapsLoader } from '../google-maps-loader';

@Component({
  selector: 'app-location-picker',
  imports: [],
  templateUrl: './location-picker.html',
  styleUrl: './location-picker.css',
})
export class LocationPicker implements AfterViewInit {
  private readonly mapsLoader = inject(GoogleMapsLoader);
  private readonly destroyRef = inject(DestroyRef);
  readonly loadError = signal('');

  @ViewChild('autocompleteContainer')
  container!: ElementRef<HTMLDivElement>;

  location = model<Location | null>(null);

  async ngAfterViewInit() {

    let placesLibrary: google.maps.PlacesLibrary;
    try {
      placesLibrary = await this.mapsLoader.loadPlaces(environment.mapsApiKey);
    } catch (error) {
      console.error('Unable to load Google Places:', error);
      if (!this.destroyRef.destroyed) {
        this.loadError.set('Unable to load location search. Check the Maps API configuration.');
      }
      return;
    }
    if (this.destroyRef.destroyed) {
      return;
    }
    const autocomplete = new placesLibrary.PlaceAutocompleteElement();

    this.container.nativeElement.appendChild(autocomplete);
    autocomplete.addEventListener('gmp-error', () => {
      console.error('Google Places autocomplete request failed.');
      this.loadError.set('Location search is unavailable. Check the Maps API configuration.');
    });

    autocomplete.addEventListener('gmp-select', async (event: any) => {

      const place = event.placePrediction.toPlace();

      await place.fetchFields({
        fields: [
          'formattedAddress',
          'location',
          'addressComponents',
          'id'
        ]
      });

      console.log('Selected address:', place.formattedAddress);
      console.log('Latitude:', place.location?.lat());
      console.log('Longitude:', place.location?.lng());
    });
  }
}
