<script setup lang="ts">
import type { BlockInfo } from 'node_modules/micro-eth-signer/net/archive';
import { formatTimestampLocal } from '@/utils/utils';

defineProps<{
  blocks: BlockInfo[];
}>();
</script>

<template>
  <div>
    <h4 class="blocks-header">Blocks</h4>
    <div class="latest-blocks">
      <div class="block" v-for="block in blocks" :key="block.number">
        <div class="block-number">
          <div>
            <div class="text-line block-box-wrapper">
              <div class="block-box"><i class="bi bi-box"></i></div>
              <RouterLink class="link" :to="`/block/${block.number}`">
                {{ block.number }}
              </RouterLink>
            </div>
            <div class="text-line">
              <small>{{ formatTimestampLocal(block.timestamp) }}</small>
            </div>
          </div>
        </div>
        <div class="txns text-line">{{ block.transactions.length }} txs</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.blocks-header {
  margin-top: 20px;
  margin-bottom: 12px;
}

.latest-blocks {
  border: 1px solid var(--ash-grey);
  border-radius: var(--std-radius);
  padding: 12px;
}

.block {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--ash-grey);
  padding-bottom: 12px;
  margin-bottom: 12px;
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
  word-break: break-word;
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

.block-number {
  display: flex;
  gap: 5px;
  align-items: center;
}

.txns {
  width: 100px;
  text-align: right;
  word-break: break-word;
}

.text-line {
  line-height: 1.3;
}
</style>
