<script setup lang="ts">
import type { Option } from './components/base/BaseSelect.vue';
import GeoSelect from './components/common/GeoSelect.vue';
import { computed, reactive, watch } from 'vue';

interface GeoForm {
  country: Option | null;
  region: Option | null;
  city: Option | null;
}

const form = reactive<GeoForm>({
  country: null,
  region: null,
  city: null,
});

const countryCode = computed(() => form.country?.value as string);
const regionCode = computed(() => form.region?.value as string);

watch(
  () => form.country,
  () => (form.region = null)
);

watch(
  () => form.region,
  () => (form.city = null)
);
</script>

<template>
  <main class="geo">
    <h1 class="geo__header">Тестовое задание</h1>

    <form class="geo__form">
      <geo-select v-model="form.country" label="Страна" type="country" />

      <geo-select
        v-model="form.region"
        label="Регион"
        :disabled="!countryCode"
        :country="countryCode"
        type="region"
      />

      <geo-select
        v-model="form.city"
        label="Город"
        :disabled="!countryCode || !regionCode"
        type="city"
        :country="countryCode"
        :region="regionCode"
      />
    </form>

    <div class="geo__result">
      <h4>Результат</h4>

      <template v-for="(field, key) in form" :key="key">
        <div class="geo__result-field">
          <strong>{{ key }}: </strong>
          <span>{{ field ? `${field?.label}(${field?.value})` : 'не определено' }}</span>
        </div>
      </template>
    </div>
  </main>
</template>

<style lang="scss" scoped>
.geo {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 24px;

  &__form {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 16px;

    @media screen and (min-width: 600px) {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  &__result {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 8px;
    font-size: 20px;
  }

  &__result-field {
    font-size: 16px;
  }
}
</style>
