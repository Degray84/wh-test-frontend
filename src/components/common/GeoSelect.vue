<template>
  <base-select
    v-model="value"
    :label="label"
    :disabled="disabled"
    :loading="loading"
    :remote-method="typeMap[props.type]"
    :placeholder="disabled ? 'Заполни предыдущее значение' : 'Введи значение'"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import BaseSelect, { type Option, type RemoteMethod } from '../base/BaseSelect.vue';
import Geo, { type ICity, type ICountry, type IRegion } from '../../api/http/geo';

type GeoTypes = 'country' | 'region' | 'city';

const props = defineProps<{
  type: GeoTypes;
  label?: string;
  country?: string;
  region?: string;
  disabled?: boolean;
}>();

const value = ref();
const loading = ref(false);

const mapGeoData = <T extends ICountry | IRegion | ICity>(
  data: T[],
  sourceValue: keyof T,
  sourceLabel: keyof T
) => {
  return (
    data?.map(
      ({ [sourceValue]: value, [sourceLabel]: label }) =>
        ({
          value,
          label,
        }) as Option
    ) || []
  );
};

const getCountries: RemoteMethod = async (search: string) => {
  loading.value = true;

  return Geo.getCountries(search)
    .then(({ data }) => mapGeoData<ICountry>(data.data, 'code', 'name'))
    .finally(() => {
      loading.value = false;
    });
};

const getRegions: RemoteMethod = async (search: string) => {
  if (!props.country) return [];
  loading.value = true;

  return Geo.getRegions(search, { countryCode: props.country })
    .then(({ data }) => mapGeoData<IRegion>(data.data, 'isoCode', 'name'))
    .finally(() => {
      loading.value = false;
    });
};

const getCities: RemoteMethod = async (search: string) => {
  if (!props.country || !props.region) return [];

  return Geo.getCities(search, {
    countryCode: props.country,
    regionCode: props.region,
  })
    .then(({ data }) => mapGeoData<ICity>(data.data, 'id', 'name'))
    .finally(() => {
      loading.value = false;
    });
};

const typeMap: Record<GeoTypes, RemoteMethod> = {
  country: getCountries,
  region: getRegions,
  city: getCities,
};
</script>
