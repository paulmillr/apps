<script setup lang="ts">
defineProps<{
  isFirstPage: boolean;
  isLastPage: boolean;
  loadingPage: boolean;
  currentPage: number;
  disabled: boolean;
}>();

const emit = defineEmits(['openPage']);

const openPage = async (page: string) => {
  await emit('openPage', page);
};
</script>

<template>
  <div class="pagination">
    <button
      @click="() => openPage('first')"
      :class="['btn', 'btn-dark', 'btn-pag', { disabled: isFirstPage || disabled }]"
      :disabled="isFirstPage || loadingPage || disabled"
    >
      First
    </button>
    <button
      @click="() => openPage('prev')"
      :class="[
        'btn',
        'btn-dark',
        'btn-pag',
        'btn-pag-arrow',
        { disabled: isFirstPage || disabled },
      ]"
      :disabled="isFirstPage || loadingPage || disabled"
    >
      <i class="bi bi-chevron-left"></i>
    </button>
    <span
      :class="['btn', 'btn-dark', 'btn-pag', { disabled: (isFirstPage && isLastPage) || disabled }]"
    >
      <span v-if="loadingPage" class="pages">
        <span>Page</span>
        <span v-if="loadingPage" class="spinner"></span>
      </span>
      <span v-else> Page {{ currentPage }} </span>
    </span>
    <button
      @click="() => openPage('next')"
      :class="['btn', 'btn-dark', 'btn-pag', 'btn-pag-arrow', { disabled: isLastPage || disabled }]"
      :disabled="isLastPage || loadingPage || disabled"
    >
      <i class="bi bi-chevron-right"></i>
    </button>
    <button
      @click="() => openPage('last')"
      :class="['btn', 'btn-dark', 'btn-pag', { disabled: isLastPage || disabled }]"
      :disabled="isLastPage || loadingPage || disabled"
    >
      Last
    </button>
  </div>
</template>

<style scoped>
.pagination {
  text-align: right;
}

@media (min-width: 576px) {
  .pagination {
    text-align: right;
  }
}

.btn-pag {
  margin-left: 4px;
}

.btn-pag:first-child {
  margin-left: 0;
}

.btn-pag-arrow {
  padding-left: 8px;
  padding-right: 8px;
}

.pages {
  display: inline-flex;
  align-items: center;
}

.spinner {
  border: 1px solid #fff;
  border-bottom-color: transparent;
  margin-left: 5px;
}
</style>
