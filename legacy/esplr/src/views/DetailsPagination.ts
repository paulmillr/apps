import type { TransactionListItem } from '@/types';
import { Web3Provider } from 'micro-eth-signer/net';

export class DetailsPagination {
  private static instance: DetailsPagination;

  private prov: Web3Provider;
  private pageSize: number;
  page: number = 1;
  private pageCount: number = 0;
  private allTxns: TransactionListItem[][] = [];
  private currentTxns: TransactionListItem[][] = [];
  firstPage: boolean = false;
  lastPage: boolean = false;

  private constructor(prov: Web3Provider, pageSize: number) {
    this.prov = prov;
    this.pageSize = pageSize;
  }

  static getInstance(prov: Web3Provider, pageSize: number): DetailsPagination {
    if (!DetailsPagination.instance) {
      DetailsPagination.instance = new DetailsPagination(prov, pageSize);
    }
    return DetailsPagination.instance;
  }

  updateTransactions(txns: TransactionListItem[][]): void {
    this.allTxns = txns;
    this.pageCount = Math.ceil(this.allTxns.length / this.pageSize);
  }

  isFirstPage(): boolean {
    return this.page === 1;
  }
  isLastPage(): boolean {
    return this.page === this.pageCount;
  }

  showFirstPage(): TransactionListItem[][] {
    this.page = 1;
    this.firstPage = this.isFirstPage();
    this.lastPage = this.isLastPage();
    this.currentTxns = this.allTxns.slice(0, this.pageSize);
    return this.currentTxns;
  }

  showNextPage(): TransactionListItem[][] {
    if (this.page == this.pageCount) return this.currentTxns;
    this.page++;
    const start = (this.page - 1) * this.pageSize;
    const end = this.page * this.pageSize;
    this.currentTxns = this.allTxns.slice(start, end);
    this.firstPage = this.isFirstPage();
    this.lastPage = this.isLastPage();
    return this.currentTxns;
  }

  showPrevPage(): TransactionListItem[][] {
    if (this.page == 1) return this.currentTxns;
    this.page--;
    const start = (this.page - 1) * this.pageSize;
    const end = this.page * this.pageSize;
    this.currentTxns = this.allTxns.slice(start, end);
    this.firstPage = this.isFirstPage();
    this.lastPage = this.isLastPage();
    return this.currentTxns;
  }

  showLastPage(): TransactionListItem[][] {
    this.page = this.pageCount;
    this.firstPage = this.isFirstPage();
    this.lastPage = this.isLastPage();
    const start = (this.page - 1) * this.pageSize;
    this.currentTxns = this.allTxns.slice(start);
    return this.currentTxns;
  }
}
