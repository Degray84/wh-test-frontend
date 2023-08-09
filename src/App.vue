<script setup lang="ts">
import type { Option } from './components/base/BaseSelect.vue';
import GeoSelect from './components/common/GeoSelect.vue';
import { computed, ref, watch } from 'vue';

const country = ref<Option | null>(null);
const region = ref<Option | null>(null);
const city = ref<Option | null>(null);
const countryCode = computed(() => country.value?.value as string);
const regionCode = computed(() => region.value?.value as string);

watch(country, () => (region.value = null));
watch(region, () => (city.value = null));
</script>

<template>
  <main class="geo">
    <geo-select v-model="country" label="Страна" type="country" />
    <geo-select
      v-model="region"
      label="Регион"
      :disabled="!countryCode"
      :country="countryCode"
      type="region"
    />
    <geo-select
      v-model="city"
      label="Населенный пункт"
      :disabled="!countryCode || !regionCode"
      type="city"
      :country="countryCode"
      :region="regionCode"
    />
  </main>
</template>

<style>
.geo {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 16px;

  @media screen and (min-width: 600px) {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
