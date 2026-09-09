<script setup lang="ts">
import type { TransactionListItem } from '@/types';
import { shortenAddr } from '@/utils/utils';

const props = defineProps<{
  txn: TransactionListItem;
  isDetailsTab: boolean;
  address: string;
}>();

const matchPageAddress = (address: string) => {
  return props.address.toLowerCase() === address?.toLowerCase();
};
</script>

<template>
  <div class="txn-details">
    <div class="txn-from-to">
      <div v-if="matchPageAddress(txn.from)">
        <span
          :class="[
            'txn-type-label',
            'txn-type-label-sent',
            { 'txn-type-label-details': isDetailsTab },
          ]"
        >
          <i class="bi bi-dash-circle-fill" style="height: 27px"></i>&nbsp;
          <span>sent</span>
        </span>
      </div>
      <div v-if="matchPageAddress(txn.to)">
        <span
          :class="[
            'txn-type-label',
            'txn-type-label-received',
            { 'txn-type-label-details': isDetailsTab },
          ]"
        >
          <i class="bi bi-plus-circle-fill"></i>&nbsp;
          <span>received</span>
        </span>
      </div>

      <div v-if="!matchPageAddress(txn.from)" class="txn-from-to-item">
        <b class="txn-from-to-label">From</b>
        <RouterLink v-if="txn.from?.length" class="link" :to="`/address/${txn.from}`">
          {{ shortenAddr(txn.from) }}
        </RouterLink>
        <span v-else>-</span>
      </div>
      <div v-if="!matchPageAddress(txn.to)" class="txn-from-to-item">
        <b class="txn-from-to-label">To</b>
        <RouterLink v-if="txn.to?.length" class="link" :to="`/address/${txn.to}`">
          {{ shortenAddr(txn.to) }}
        </RouterLink>
        <span v-else>-</span>
      </div>
    </div>

    <div class="txn-value">
      {{ `${txn.value} ${txn.symbol}` }}
    </div>
  </div>
</template>

<style scoped>
.txn-details {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
}

@media (min-width: 576px) {
  .txn-details {
    flex-direction: row;
  }
}

.txn-from-to {
  display: flex;
  flex-direction: column;
}

@media (min-width: 425px) {
  .txn-from-to {
    flex-direction: row;
  }
}

@media (min-width: 576px) {
  .txn-details {
    flex-direction: row;
  }
}

.txn-from-to-item {
  display: flex;
  align-items: flex-start;
  width: 170px;
}

.txn-from-to-label {
  display: inline-block;
  font-size: 18px;
  margin-right: 5px;
}

.txn-value {
  text-align: left;
  word-break: break-word;
}

@media (min-width: 576px) {
  .txn-value {
    text-align: right;
  }
}

.txn-type-label {
  display: flex;
  align-items: center;
  min-width: 102px;
}

.txn-type-label-details {
  min-width: 170px;
}

.txn-type-label-received {
  color: rgb(49 192 49);
}

.txn-type-label-sent {
  color: #ff4040;
}
</style>
