<script setup lang="ts">
defineProps<{
  label: string;
  checked: boolean;
}>();

const emit = defineEmits(['onChange']);

const onChange = (event: Event) => {
  emit('onChange', event);
};
</script>

<template>
  <div class="custom-checkbox">
    <label>
      <input id="checkbox" @change="onChange" :checked="checked" type="checkbox" />
      <span :class="['checkmark', { checked: checked }]"></span>
      <span for="checkbox"> {{ label }} </span>
    </label>
  </div>
</template>

<style scoped>
.custom-checkbox {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  margin-right: 2px;
  line-height: 1;
}

@media (min-width: 375px) {
  .custom-checkbox {
    margin-right: 5px;
  }
}

/* Hide the default checkbox */
.custom-checkbox input[type='checkbox'] {
  display: none;
}

/* Style the custom checkbox */
.custom-checkbox .checkmark {
  width: 18px;
  height: 18px;
  background: var(--ash-grey-lighter);
  border-radius: 5px;
  display: inline-block;
  position: relative;
  margin-right: 3px;
}

@media (prefers-color-scheme: dark) {
  .custom-checkbox .checkmark {
    background: var(--ash-grey);
  }
}

@media (min-width: 375px) {
  .custom-checkbox .checkmark {
    margin-right: 5px;
  }
}

.custom-checkbox label {
  display: flex;
  align-items: center;
  user-select: none;
}

.custom-checkbox label:hover {
  cursor: pointer;
}

/* Indicate hover state for the custom checkbox */
.custom-checkbox:hover .checkmark {
  background: #323741;
  transition: background 0.2s;
}

/* Style the checkmark when checkbox is checked */
.custom-checkbox input[type='checkbox']:checked + .checkmark.checked {
  background: #0092bf;
  transition: none;
}

.custom-checkbox .checkmark:after {
  content: '';
  position: absolute;
  display: none;
  left: 6px;
  top: 3px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

/* Show the checkmark when checkbox is checked */
.custom-checkbox input[type='checkbox']:checked + .checkmark.checked:after {
  display: block;
}
</style>
