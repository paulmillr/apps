<script setup lang="ts">
import type { TransactionListItem } from '@/types';
defineProps<{ favoriteAddresses: string[]; favoriteTxns: TransactionListItem[][] }>();
</script>

<template>
  <div>
    <h4 class="fav-addr-header">
      <i class="bi bi-star-fill"></i>
      <RouterLink class="link" to="/favorites">
        <span>Favorite addresses</span>
      </RouterLink>
    </h4>

    <ul class="favorites-list">
      <li v-for="addr in favoriteAddresses.slice(0, 5)" :key="addr">
        <RouterLink class="link" :to="`/address/${addr}`">{{ addr }}</RouterLink>
      </li>
      <span v-if="favoriteAddresses.length > 5">...</span>
    </ul>

    <div class="fav-addr">
      <div class="block" v-for="txn in favoriteTxns" :key="txn[0].hash">
        <div class="txn-info-first-part">
          <div class="txn-info">
            <div class="text-line block-box-wrapper">
              <div class="block-box"><i class="bi bi-file-earmark-text"></i></div>
              <RouterLink class="link" :to="`/tx/${txn[0].hash}`">
                {{ txn[0].hash.slice(0, 8) }}...
              </RouterLink>
            </div>
            <div class="text-line">
              <small>{{ txn[0].date }}</small>
            </div>
          </div>
          <div class="from-to">
            <div class="text-line">
              <b class="from-to-label">From</b>&nbsp;
              <RouterLink v-if="txn[0].from?.length" class="link" :to="`address/${txn[0].from}`">
                {{ txn[0].from.slice(0, 8) }}...
              </RouterLink>
              <span v-else>-</span>
            </div>
            <div class="text-line">
              <b class="from-to-label">To</b>&nbsp;
              <RouterLink v-if="txn[0].to?.length" class="link" :to="`address/${txn[0].to}`">
                {{ txn[0].to.slice(0, 8) }}...
              </RouterLink>
              <span v-else>-</span>
            </div>
          </div>
        </div>
        <div class="eth">{{ txn[0].value }}</div>
      </div>
      <div class="block">
        <RouterLink class="link" to="/favorites">
          <span>See all transactions</span>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.txn-info-first-part {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-direction: column;
}

@media (min-width: 375px) {
  .txn-info-first-part {
    flex-direction: row;
    align-items: center;
    gap: 10px;
  }
}

.fav-addr-header {
  margin-top: 20px;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.fav-addr {
  border: 1px solid var(--ash-grey);
  border-radius: var(--std-radius);
  padding: 12px;
}

.favorites-list {
  margin-top: 10px;
  margin-bottom: 10px;
  word-break: break-word;
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

.txn-info {
  display: block;
  width: 145px;
  min-width: 145px;
}

.from-to {
  min-width: 170px;
  text-align: left;
}

@media (min-width: 400px) {
  .from-to {
    text-align: right;
  }
}

@media (min-width: 685px) {
  .from-to {
    text-align: left;
  }
}

.from-to-label {
  font-size: 18px;
}

.block {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  border-bottom: 1px solid var(--ash-grey);
  padding-bottom: 12px;
  margin-bottom: 12px;
}

@media (min-width: 685px) {
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

.eth {
  word-break: break-word;
}

@media (min-width: 400px) {
  .eth {
    text-align: right;
  }
}

@media (min-width: 685px) {
  .eth {
    width: 300px;
  }
}
</style>
