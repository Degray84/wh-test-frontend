<template>
  <div
    ref="baseSelect"
    class="base-select"
    :class="{ 'base-select--disabled': disabled, 'base-select--loading': loading }"
  >
    <div class="base-select__label">{{ label }}</div>

    <div class="base-select__wrapper">
      <div class="base-select__input">
        <span
          v-if="!searching && modelValue"
          class="base-select__selected"
          @click.stop="searching = true"
        >
          {{ modelValue?.label }}
        </span>

        <input
          v-else
          v-model="search"
          :placeholder="placeholder || 'Введи значение'"
          autocomplete="on"
          aria-autocomplete="list"
          aria-haspopup="listbox"
          autocapitalize="off"
          :aria-expanded="expanded"
          role="combobox"
          spellcheck="false"
          :disabled="disabled"
          @click="expanded = true"
        />

        <span v-if="loading" class="base-select__icon">
          <span class="base-select__rotating"></span>
        </span>
        <span v-else-if="!disabled" role="button" class="base-select__icon" @click="clear">
          <span class="base-select__close">✕</span>
        </span>

        <span class="base-select__icon" @click="expanded = true">
          <span
            class="base-select__arrow"
            :class="{ 'base-select__arrow--expanded': expanded }"
          ></span>
        </span>
      </div>

      <div v-if="expanded && optionList.length" class="base-select__dropdown">
        <div
          v-for="option in optionList"
          :key="option.value"
          class="base-select__option"
          @click="selectOption(option)"
        >
          {{ option.label }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import throttle from 'lodash/throttle';

export interface Option {
  value: string | number;
  label: string;
}

export type RemoteMethod = (search: string) => Promise<Option[]>;

interface Props {
  modelValue: Option | null;
  remoteMethod: RemoteMethod;
  options?: Option[];
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  loading?: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: 'update:model-value', option: Option | null): void;
}>();

const baseSelect = ref<Element>();
const search = ref<string | null>(null);
const searching = ref<boolean>(true);
const optionList = ref<Option[]>([]);
const expanded = ref(false);

const searchRemote = throttle(async (search: string) => {
  optionList.value = await props.remoteMethod(search);
}, 1500);

const clear = async () => {
  emit('update:model-value', null);
  search.value = null;
  searchRemote('');
};

const selectOption = (option: Option) => {
  emit('update:model-value', option);
  expanded.value = false;
  searching.value = false;
};

const handleClickOutside = (event: Event) => {
  if (baseSelect.value && !baseSelect.value.contains(event.target as Node)) {
    expanded.value = false;
    searching.value = false;
  }
};

watch(
  () => props.modelValue,
  value => {
    if (!value && !props.disabled) {
      searchRemote('');
    }
  }
);

watch(
  () => props.disabled,
  isDisabled => {
    if (!isDisabled) {
      searchRemote('');
    } else {
      search.value = null;
      expanded.value = false;
    }
  },
  {
    immediate: true,
  }
);

watch(search, async () => {
  if (search.value) {
    expanded.value = true;
    searchRemote(search.value);
  } else {
    searchRemote('');
  }
});

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style lang="scss" scoped>
.base-select {
  width: 100%;
  position: relative;

  &__wrapper {
    position: relative;
  }

  &__input {
    position: relative;
    padding: 0 12px;
    width: 100%;
    height: 36px;
    border: 1px solid lightgray;
    border-radius: 8px;
    display: flex;
    align-items: center;
    overflow: hidden;

    input {
      border: none;
      line-height: 28px;
      width: 100%;
      border: none;
      text-decoration: none;
      background-color: transparent;
      outline: none;
      color: darkslategray;
      font-size: 16px;

      &::placeholder {
        font-size: 14px;
      }
    }
  }

  &--disabled &__input {
    background-color: lightgray;
  }

  &__label {
    padding-bottom: 4px;
    font-size: 14px;
    color: darkslategray;
  }

  &__icon {
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  &__arrow {
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 8px solid lightgray;
    transition:
      transform 0.4s,
      border-top 0.4s;

    &:hover {
      border-top: 8px solid black;
    }

    &--expanded {
      transform: rotate(180deg);
    }
  }

  &__close {
    color: gray;
    transition: color 0.4s;

    &:hover {
      color: black;
    }
  }

  &__rotating {
    width: 14px;
    height: 14px;
    border: 2px solid lightgray;
    border-radius: 50%;
    border-top-color: transparent;
    animation: rotate 0.7s linear infinite;
  }

  &__dropdown {
    position: absolute;
    padding: 4px 0;
    z-index: 1;
    top: 40px;
    left: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
    width: 100%;
    max-height: 200px;
    overflow-y: auto;
    border: 1px solid lightgray;
    border-radius: 8px;
    background-color: white;
    color: darkslategray;
    cursor: pointer;
  }

  &__option {
    padding: 8px 12px;

    &:hover {
      background-color: #eee;
    }
  }

  .base-select__selected {
    width: 100%;
    cursor: pointer;
    transition: color 0.2s;

    &:hover {
      color: darkgreen;
    }
  }
}

@keyframes rotate {
  to {
    transform: rotate(360deg);
  }
}
</style>
