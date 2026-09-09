<script setup lang="ts">
import type { FavoriteAddress } from '@/types';
import { fromWeiToEth, shortenFavAddr, handleClickCopyIcon } from '@/utils/utils';

const emit = defineEmits(['deleteFavorite']);

defineProps<{
  favorites: FavoriteAddress[];
}>();

const handleDeleteFavorite = (address: string) => {
  emit('deleteFavorite', address);
};
</script>

<template>
  <div class="favorite-addresses">
    <div v-for="fav in favorites" :key="fav.address" class="favorite-address">
      <span class="fav-addr-info">
        <RouterLink class="link fav-addr" :to="`/address/${fav.address}`">
          {{ shortenFavAddr(fav.address) }}
        </RouterLink>
        <i
          @click="(e: Event) => handleClickCopyIcon(e, fav.address)"
          class="txn-hash-copy-icon bi bi-copy"
        ></i>
        <!-- <span v-if="fav.type === 'contract'">(contract)</span> -->
      </span>
      <span class="balance-trash">
        <span v-if="fav.unspent"> {{ fromWeiToEth(fav.unspent.balance, 18) }} ETH </span>
        <span @click="() => handleDeleteFavorite(fav.address)" class="delete-icon">
          <i class="bi bi-trash"></i>
        </span>
      </span>
      <span class="delete-from-list">
        <span
          @click="() => handleDeleteFavorite(fav.address)"
          class="btn btn-dark delete-btn delete-icon"
        >
          Delete from list <i class="bi bi-trash"></i>
        </span>
      </span>
    </div>
  </div>
</template>

<style scoped>
.favorite-addresses {
  border: 1px solid var(--ash-grey);
  border-radius: var(--std-radius);
  padding: 4px 12px;
  margin-top: 6px;
  margin-bottom: 12px;
}

.favorite-address {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: flex-start;
  border-bottom: 1px solid var(--ash-grey);
  padding-bottom: 4px;
  margin-bottom: 4px;
}

@media (min-width: 768px) {
  .favorite-address {
    flex-direction: row;
  }
}

.favorite-address:last-child {
  border-bottom: none;
  padding-bottom: 0;
  margin-bottom: 0;
}

.fav-addr-info {
  display: flex;
  align-items: center;
  gap: 5px;
}

.fav-addr {
  min-width: 215px;
}

.txn-hash-copy-icon {
  font-size: 16px;
  cursor: pointer;
  font-style: normal;
}

.balance-trash {
  display: flex;
  align-items: flex-start;
  word-break: break-word;
  gap: 7px;
}

.balance-trash .delete-icon {
  display: none;
}

.delete-from-list {
  margin-bottom: 6px;
}

@media (min-width: 768px) {
  .balance-trash {
    text-align: right;
  }

  .balance-trash .delete-icon {
    display: inline;
  }

  .delete-from-list {
    display: none;
  }
}

.delete-icon {
  cursor: pointer;
  color: var(--red-darker);
}

.delete-icon i {
  font-style: normal;
}

.delete-btn {
  cursor: pointer;
  color: var(--btn-red);
}

@media (prefers-color-scheme: dark) {
  .delete-btn {
    color: var(--btn-red-darker);
  }
}
</style>
