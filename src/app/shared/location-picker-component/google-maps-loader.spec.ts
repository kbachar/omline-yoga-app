import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { GoogleMapsLoader } from './google-maps-loader';

describe('GoogleMapsLoader', () => {
  afterEach(() => {
    document.querySelectorAll('script[src^="https://maps.googleapis.com/maps/api/js"]').forEach(script => script.remove());
    delete (window as Window & { omlineMapsReady?: () => void }).omlineMapsReady;
    vi.unstubAllGlobals();
  });

  it('reports a missing key without adding a script', async () => {
    const loader = TestBed.inject(GoogleMapsLoader);

    await expect(loader.loadPlaces('')).rejects.toThrow('Google Maps API key is not configured.');
    expect(document.querySelector('script[src^="https://maps.googleapis.com/maps/api/js"]')).toBeNull();
  });

  it('loads one script for concurrent requests and imports the places library', async () => {
    const loader = TestBed.inject(GoogleMapsLoader);
    const first = loader.loadPlaces('test-key');
    const second = loader.loadPlaces('test-key');
    const scripts = document.querySelectorAll<HTMLScriptElement>('script[src^="https://maps.googleapis.com/maps/api/js"]');
    expect(scripts.length).toBe(1);
    expect(new URL(scripts[0].src).searchParams.get('key')).toBe('test-key');

    const library = { PlaceAutocompleteElement: class {} };
    const importLibrary = vi.fn().mockResolvedValue(library);
    vi.stubGlobal('google', { maps: { importLibrary } });
    const callback = (window as Window & { omlineMapsReady?: () => void }).omlineMapsReady;
    expect(callback).toBeTypeOf('function');
    callback?.();

    await expect(first).resolves.toBe(library);
    await expect(second).resolves.toBe(library);
    expect(importLibrary).toHaveBeenCalledOnce();
    expect(importLibrary).toHaveBeenCalledWith('places');
  });

  it('reports script failures and permits a retry', async () => {
    const loader = TestBed.inject(GoogleMapsLoader);
    const first = loader.loadPlaces('test-key');
    const script = document.querySelector<HTMLScriptElement>('script[src^="https://maps.googleapis.com/maps/api/js"]');
    expect(script).not.toBeNull();
    script!.dispatchEvent(new Event('error'));
    await expect(first).rejects.toThrow('Failed to load the Google Maps JavaScript API.');

    const retry = loader.loadPlaces('test-key');
    const retryScript = document.querySelector<HTMLScriptElement>('script[src^="https://maps.googleapis.com/maps/api/js"]');
    expect(retryScript).not.toBeNull();
    retryScript!.dispatchEvent(new Event('error'));
    await expect(retry).rejects.toThrow('Failed to load the Google Maps JavaScript API.');
  });
});
