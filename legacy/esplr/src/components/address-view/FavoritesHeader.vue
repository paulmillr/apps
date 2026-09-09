<script setup lang="ts">
import type { TokenBalance, FavoriteAddress } from '@/types';
import { formatTimestampLocalWithoutYear } from '@/utils/utils';
import TokensList from '@/components/address-view/TokensList.vue';
import FavoritesList from '@/components/address-view/FavoritesList.vue';
import { useAppStore } from '@/stores/app';

const emit = defineEmits(['updateData', 'deleteFavorite']);
const appStore = useAppStore();

const props = defineProps<{
  favorites: FavoriteAddress[];
  sumUnspentTxns: bigint;
  sumBalance: bigint;
  tokens: TokenBalance[];
  loadingTokens: boolean;
  lastUpdateTimestamp: number;
  sumUnspentEthUsd: number;
  loadingUnspent: boolean;
  tokensError: boolean;
  tokensPricesError: boolean;
  unspentPriceError: boolean;
  unspentError: boolean;
  noAddresses: boolean;
}>();

const handleUpdateData = () => {
  const addresses = props.favorites.map((fav: FavoriteAddress) => fav.address);
  emit('updateData', addresses);
};

const handleDeleteFavorite = (address: string) => {
  emit('deleteFavorite', address);
};
</script>

<template>
  <div class="header">
    <div class="sub-header">
      <b>Favorite Addresses</b>
      <div class="update-btn-wrapper">
        <span class="last-update">
          {{ lastUpdateTimestamp > 0 ? formatTimestampLocalWithoutYear(lastUpdateTimestamp) : '' }}
        </span>
        <button @click="handleUpdateData" class="btn btn-dark update-btn">
          <i class="bi bi-arrow-clockwise"></i> Update
        </button>
      </div>
    </div>
    <FavoritesList
      v-if="favorites.length"
      :favorites="favorites"
      @deleteFavorite="handleDeleteFavorite"
    />
  </div>

  <div v-if="noAddresses" class="warning">
    <i class="bi bi-exclamation-triangle"></i>
    Add some addresses to your favorites to see the info.
  </div>

  <div><b>Transactions Sent (non contracts):</b> {{ unspentError ? 0 : sumUnspentTxns }}</div>
  <div v-if="appStore.otsApiError || unspentError" class="warning txns-sent-warning">
    <i class="bi bi-exclamation-triangle"></i>
    Check the addresses values. Erigon OTS namespace is disabled or Ethereum node has limitations or
    Erigon error has occurred. Check Erigon or node logs.
  </div>

  <TokensList
    :tokens="tokens"
    :loadingTokens="loadingTokens"
    :unspentEth="sumBalance"
    :unspentEthUsd="sumUnspentEthUsd"
    :loadingUnspent="loadingUnspent"
    :tokensError="tokensError"
    :tokensPricesError="tokensPricesError"
    :unspentPriceError="unspentPriceError"
    :unspentError="unspentError"
  />
</template>

<style scoped>
.header {
  margin-top: 20px;
  margin-bottom: 2px;
  font-weight: normal;
}

.sub-header {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  gap: 5px;
}

@media (min-width: 485px) {
  .sub-header {
    flex-direction: row;
  }
}

.update-btn-wrapper {
  display: flex;
  flex-direction: row-reverse;
}

@media (min-width: 485px) {
  .update-btn-wrapper {
    text-align: right;
    display: block;
  }
}

.last-update {
  font-size: 17px;
  margin-left: 7px;
  margin-top: 1px;
}

@media (min-width: 485px) {
  .last-update {
    margin-top: 0;
    margin-left: 0;
    margin-right: 7px;
  }
}

.txns-sent-warning {
  margin-top: -5px;
  font-size: 17px;
}
</style>
