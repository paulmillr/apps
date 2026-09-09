<script setup lang="ts">
import { formatTimestampLocal, shortenTx8 } from '@/utils/utils';
import type { TxInfoExtended } from '@/types';

defineProps<{
  txns: TxInfoExtended[];
}>();
</script>

<template>
  <div>
    <h4 class="blocks-header">Transactions</h4>
    <div class="latest-transactions">
      <div class="block" v-for="txn in txns" :key="txn.hash">
        <div>
          <div class="text-line block-box-wrapper">
            <div class="block-box"><i class="bi bi-file-earmark-text"></i></div>
            <RouterLink class="link" :to="`/tx/${txn.hash}`">
              {{ shortenTx8(txn.hash) }}
            </RouterLink>
          </div>
          <div class="text-line">
            <small>{{ formatTimestampLocal(txn.blockData.timestamp) }}</small>
          </div>
        </div>
        <div class="from-to">
          <div class="text-line">
            <b class="from-to-label">From</b>&nbsp;
            <RouterLink v-if="txn.from?.length" class="link" :to="`address/${txn.from}`">
              {{ shortenTx8(txn.from) }}
            </RouterLink>
            <span v-else>-</span>
          </div>
          <div class="text-line">
            <b class="from-to-label">To</b>&nbsp;
            <RouterLink v-if="txn.to?.length" class="link" :to="`address/${txn.to}`">
              {{ shortenTx8(txn.to) }}
            </RouterLink>
            <span v-else>-</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.blocks-header {
  margin-top: 20px;
  margin-bottom: 12px;
}

.latest-transactions {
  border: 1px solid var(--ash-grey);
  border-radius: var(--std-radius);
  padding: 12px;
}

.block {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  border-bottom: 1px solid var(--ash-grey);
  padding-bottom: 12px;
  margin-bottom: 12px;
}

@media (min-width: 375px) {
  .block {
    flex-direction: row;
    align-items: center;
  }
}

.block:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.block-box-wrapper {
  display: flex;
  gap: 5px;
  align-items: center;
}

.block-box {
  width: 27px;
  height: 26px;
  background-color: var(--beige);
  border-radius: var(--std-radius);
  text-align: center;
  vertical-align: middle;
  line-height: 27px;
}

@media (prefers-color-scheme: dark) {
  .block-box {
    background-color: var(--ash-grey);
  }
}

.text-line {
  line-height: 1.3;
}

.from-to {
  min-width: 160px;
  margin-left: 3px;
}

.from-to-label {
  font-size: 18px;
}
</style>
