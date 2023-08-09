/* eslint-disable no-param-reassign */
import { createClient } from '../client';
import { API_BASE_URL } from '../config';

const client = createClient(API_BASE_URL);

export interface IResponse<T = null> {
  data: T;
  metadata: any;
}

export interface ICountry {
  code: string;
  currencyCodes: string[];
  name: string;
  wikiDataId: string;
}

export interface IRegion {
  countryCode: string;
  fipsCode: string;
  isoCode: string;
  name: string;
  wikiDataId: string;
}

export interface ICity {
  id: number;
  wikiDataId: string;
  type: string;
  city: string;
  name: string;
  latitude: number;
  longitude: number;
  population: number;
}

export interface RegionParams {
  countryCode: ICountry['code'];
}

export interface CityParams {
  countryCode: ICountry['code'];
  regionCode: IRegion['isoCode'];
}

export default class Geo {
  static getCountries(namePrefix: string) {
    return client.get<IResponse<ICountry[]>>('geo/countries', {
      params: { namePrefix, languageCode: 'RU' },
    });
  }

  static getRegions(namePrefix: string, { countryCode }: RegionParams) {
    return client.get<IResponse<IRegion[]>>(`geo/countries/${countryCode}/regions`, {
      params: { namePrefix, languageCode: 'RU' },
    });
  }

  static getCities(namePrefix: string, { countryCode, regionCode }: CityParams) {
    return client.get<IResponse<ICity[]>>(
      `geo/countries/${countryCode}/regions/${regionCode}/cities`,
      {
        params: { namePrefix, languageCode: 'RU' },
      }
    );
  }
}
