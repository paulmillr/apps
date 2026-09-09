<script setup lang="ts">
import { watchEffect, ref, computed } from 'vue';
import { shortenTx, handleClickCopyIcon } from '@/utils/utils';
import type { TransactionListItem } from '@/types';
import TransactionListItemFromTo from '@/components/address-view/TransactionListItemFromTo.vue';

const props = defineProps<{
  transactions: TransactionListItem[];
  address: string;
  isDetailsTab: boolean;
}>();
const txns = ref<TransactionListItem[]>([] as TransactionListItem[]);

const isFirstTxnValue = computed(() => {
  return Number(txns.value[0].value) > 0;
});

watchEffect(() => {
  txns.value = props.transactions;
});
</script>

<template>
  <div class="txn">
    <div class="txn-first-line">
      <div>
        <span class="block-number">#{{ txns[0].blockNumber }}</span>
        <span class="txn-date only-desktop"> {{ txns[0].date }}</span>
        <span v-if="txns[0].method.length > 1" class="label method-label only-desktop">{{
          txns[0].method
        }}</span>
      </div>
      <span class="txn-hash">
        <RouterLink class="link txn-hash-link" :to="`/tx/${txns[0].hash}`">
          {{ shortenTx(txns[0].hash) }}
        </RouterLink>
        <i
          @click="(e: Event) => handleClickCopyIcon(e, txns[0].hash)"
          class="txn-hash-copy-icon bi bi-copy"
        ></i>
      </span>
    </div>
    <div class="txn-second-line only-mobile">
      <span class="txn-date"> {{ txns[0].date }}</span>
      <span class="label method-label">{{ txns[0].method }}</span>
    </div>
    <div
      :class="[
        'txns-list',
        {
          'txns-list_no-scroll': txns.length === 1 || (txns.length === 2 && !isFirstTxnValue),
        },
      ]"
    >
      <!-- FIRST TXN -->
      <TransactionListItemFromTo
        :isDetailsTab="isDetailsTab"
        :address="address"
        :txn="txns[0]"
        v-if="isFirstTxnValue || txns.length === 1"
      />
      <!-- REST TXNS -->
      <TransactionListItemFromTo
        v-for="(txn, i) in txns.slice(1)"
        :isDetailsTab="isDetailsTab"
        :address="address"
        :txn="txn"
        :key="i"
      />
    </div>
  </div>
</template>

<style scoped>
.txn {
  border-bottom: 1px solid var(--ash-grey);
  padding-bottom: 20px;
  margin-bottom: 13px;
}

@media (min-width: 576px) {
  .txn {
    padding-bottom: 12px;
    margin-bottom: 12px;
  }
}

.txn:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.txn-hash-data {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-bottom: 5px;
}

@media (min-width: 576px) {
  .txn-hash-data {
    flex-direction: row;
  }
}

.txn-hash {
  display: flex;
  align-items: center;
}

.block-number {
  color: var(--ash-grey-lighter);
  margin-right: 5px;
  word-break: break-word;
}

@media (prefers-color-scheme: dark) {
  .block-number {
    color: var(--ash-grey-lightest);
  }
}

.txn-hash-link {
  margin-right: 5px;
}

.txn-hash-copy-icon {
  font-size: 16px;
  cursor: pointer;
  font-style: normal;
}

.txns-list {
  max-height: 170px;
  overflow-y: scroll;
  padding: 6px;
  margin-top: 5px;
  border: 1px solid var(--ash-grey);
  border-radius: var(--std-radius);
}

.txns-list_no-scroll {
  overflow-y: hidden;
}

.txn-details {
  padding: 5px 0;
  border-bottom: 1px solid var(--ash-grey);
}

.txn-details:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.txn-details:first-child {
  padding-top: 0;
}

@media (min-width: 576px) {
  .txns-list {
    border: none;
    padding: 0;
  }

  .txn-details {
    border-bottom: none;
    padding: 0;
  }
}

.method-label {
  padding: 1px 5px;
}

.txn-date {
  font-size: 16px;
}

@media (min-width: 375px) {
  .method-label {
    padding: 1px 8px;
  }
  .txn-date {
    font-size: 19px;
  }
}

@media (min-width: 576px) {
  .method-label {
    margin-left: 10px;
  }
}

.txn-first-line {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.txn-second-line {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.only-desktop {
  display: none;
}

@media (min-width: 576px) {
  .txn-first-line {
    flex-direction: row;
    width: 100%;
  }

  .only-desktop {
    display: inline-block;
  }

  .only-mobile {
    display: none;
  }
}
</style>
