<script setup lang="ts">
import { formatTimestampLocalWithoutYear, formatUsdPrice } from '@/utils/utils';
import type { BlockInfo } from 'node_modules/micro-eth-signer/net/archive';
import { useSettingsStore } from '@/stores/settings';

const settingsStore = useSettingsStore();

defineProps<{
  gasPriceGwei: string;
  maxPriorityFeeGwei: string;
  block: BlockInfo | undefined;
  ethPrice: number;
}>();
</script>

<template>
  <div class="blockchain-info">
    <div class="blockchain-info__block">
      <div v-if="settingsStore.showUsdPrices">
        <b>Ether price</b><br />
        {{ formatUsdPrice(ethPrice) }}
      </div>
      <div v-else>
        <b>Latest Block</b><br />
        <RouterLink v-if="block && block.number" class="link" :to="`/block/${block.number}`">
          {{ block.number }}
        </RouterLink>
        <span v-if="block && block.timestamp">
          at {{ formatTimestampLocalWithoutYear(block.timestamp) }}
        </span>
      </div>
    </div>
    <div class="blockchain-info__block">
      <b>Gas Price</b><br />
      {{ gasPriceGwei }} Gwei
    </div>
    <div class="blockchain-info__block">
      <b>Priority Fee</b><br />
      {{ maxPriorityFeeGwei }} Gwei
    </div>
  </div>
</template>

<style scoped>
.blockchain-info {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  border: 1px solid var(--ash-grey);
  border-radius: var(--std-radius);
  padding: 12px;
  gap: 5px;
}

@media (min-width: 475px) {
  .blockchain-info {
    flex-direction: row;
    gap: 0;
  }
}

.blockchain-info__block {
  word-break: break-word;
}

@media (min-width: 475px) {
  .blockchain-info__block {
    width: 50%;

    border-right: 1px solid var(--ash-grey);
    padding: 0 12px;
  }
}

.blockchain-info__block:first-child {
  padding-left: 0;
}

.blockchain-info__block:last-child {
  border-right: none;
}
</style>
