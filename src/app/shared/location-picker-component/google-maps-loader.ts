import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';

type MapsWindow = Window & { omlineMapsReady?: () => void };

@Injectable({ providedIn: 'root' })
export class GoogleMapsLoader {
  private readonly document = inject(DOCUMENT);
  private loading?: Promise<google.maps.PlacesLibrary>;

  loadPlaces(apiKey: string): Promise<google.maps.PlacesLibrary> {
    if (typeof google !== 'undefined' && google.maps?.importLibrary) {
      return google.maps.importLibrary('places');
    }

    if (!apiKey.trim()) {
      return Promise.reject(new Error('Google Maps API key is not configured.'));
    }

    if (!this.loading) {
      this.loading = this.loadScript(apiKey).catch((error: unknown) => {
        this.loading = undefined;
        throw error;
      });
    }
    return this.loading;
  }

  private loadScript(apiKey: string): Promise<google.maps.PlacesLibrary> {
    const window = this.document.defaultView as MapsWindow | null;
    if (!window) {
      return Promise.reject(new Error('Google Maps requires a browser.'));
    }

    return new Promise((resolve, reject) => {
      const script = this.document.createElement('script');
      const params = new URLSearchParams({
        key: apiKey,
        loading: 'async',
        callback: 'omlineMapsReady',
      });
      script.src = `https://maps.googleapis.com/maps/api/js?${params}`;
      script.async = true;

      window.omlineMapsReady = () => {
        delete window.omlineMapsReady;
        if (typeof google === 'undefined' || !google.maps?.importLibrary) {
          script.remove();
          reject(new Error('Google Maps loaded without its JavaScript API.'));
          return;
        }
        google.maps.importLibrary('places').then(resolve, reject);
      };
      script.onerror = () => {
        delete window.omlineMapsReady;
        script.remove();
        reject(new Error('Failed to load the Google Maps JavaScript API.'));
      };
      this.document.head.appendChild(script);
    });
  }
}
