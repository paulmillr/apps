<script setup lang="ts">
import { inject, onMounted, type Ref, ref } from 'vue';
import { useRoute } from 'vue-router';
import { Web3Provider } from 'micro-eth-signer/net';
import { hexToNumber } from 'micro-eth-signer/utils';
import type { OtsSearchTransaction, TransactionListItem } from '@/types';
import TransactionsList from '@/components/address-view/TransactionsList.vue';
import { txnsWithBlockDetailsToTxnsList } from '@/utils/utils';
import { DetailsPagination } from '@/views/DetailsPagination';

const route = useRoute();

const provider = inject<Ref<Web3Provider>>('provider');
if (!provider) throw new Error('Provider not found!');
const prov = provider.value;

const SHOW_TXNS_LIMIT = 25;
const detailsPagination = DetailsPagination.getInstance(prov, SHOW_TXNS_LIMIT);

const transactionsList = ref<TransactionListItem[][]>([]);
const isFirstPage = ref(true);
const isLastPage = ref(false);
const currentPage = ref(1);
const loadingTxns = ref(false);
const warning = ref('');
const loadingPage = ref(false);

const blockNumber = ref('');
const totalTransactionsCount = ref(0);

onMounted(async () => {
  const online = window.navigator.onLine;
  if (!online) return showOfflineNotice();

  setLoadingTxns(true);
  blockNumber.value = route.params.block as string;
  const block = await prov.call('eth_getBlockByNumber', blockNumber.value, true);
  const transactions = getBlockTransactionsList(block);
  totalTransactionsCount.value = transactions.length;

  detailsPagination.updateTransactions(transactions);
  transactionsList.value = detailsPagination.showFirstPage();
  updatePagesState(detailsPagination);
  setLoadingTxns(false);
});

const updatePagesState = (pagination: DetailsPagination) => {
  isFirstPage.value = pagination.firstPage;
  isLastPage.value = pagination.lastPage;
  currentPage.value = pagination.page;
};

const setLoadingTxns = (loading: boolean) => {
  loadingTxns.value = loading;
};

// TODO: add block type here
const getBlockTransactionsList = (block: any): TransactionListItem[][] => {
  const blockTimestamp = hexToNumber(block.timestamp);
  const transactions = block.transactions.map((txn: OtsSearchTransaction) => {
    let blockData = { timestamp: blockTimestamp };
    return { txn, blockData };
  });
  return txnsWithBlockDetailsToTxnsList(transactions.reverse());
};

const showOfflineNotice = () => {
  warning.value = 'No internet connection. Please check your network settings.';
  setTimeout(() => {
    warning.value = '';
  }, 7000);
};

const openPage = async (page: string) => {
  if (loadingPage.value) return;
  loadingPage.value = true;

  let newList: TransactionListItem[][] = [];
  const paginate = detailsPagination;

  if (page === 'next') {
    newList = await paginate.showNextPage();
  }
  if (page === 'prev') {
    newList = await paginate.showPrevPage();
  }
  if (page === 'first') {
    newList = await paginate.showFirstPage();
  }
  if (page === 'last') {
    newList = await paginate.showLastPage();
  }

  transactionsList.value = newList;
  updatePagesState(paginate);
  loadingPage.value = false;
};
</script>

<template>
  <div>
    <i class="bi bi-box"></i> Transactions for block
    <RouterLink class="link" :to="`/block/${blockNumber}`">#{{ blockNumber }}</RouterLink>
  </div>

  <TransactionsList
    :loadingTxns="loadingTxns"
    :address="''"
    :transactions="transactionsList"
    :isFirstPage="isFirstPage"
    :isLastPage="isLastPage"
    :currentPage="currentPage"
    :warning="warning"
    :loadingPage="loadingPage"
    :paginationOn="false"
    @openPage="openPage"
    :firstTabText="`In total ${totalTransactionsCount} txs found.`"
  />
</template>
