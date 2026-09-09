import type { TransactionListItem } from '@/types';
import {
  getLatestTxnsWithBlockDetails,
  getTransactionsAfterWithBlockDetails,
  getTransactionsBeforeWithBlockDetails,
} from '@/utils/network';
import { txnsWithBlockDetailsToTxnsList } from '@/utils/utils';
import { Web3Provider } from 'micro-eth-signer/net';

export class Pagination {
  private static instance: Pagination;

  // for testing purposes, to be able to mock the function
  // private getLatestTxnsWithBlockDetails: typeof getLatestTxnsWithBlockDetails

  private prov: Web3Provider;
  private pageSize: number;

  nextPageReminder: TransactionListItem[][] = [];
  prevPageReminder: TransactionListItem[][] = [];
  currentPageTxns: TransactionListItem[][] = [];

  // needed for checking if we on the first or last page
  firstTxnHash: string = '';
  lastTxnHash: string = '';

  firstPage: boolean = false;
  lastPage: boolean = false;
  page: number = 1;

  private constructor(
    prov: Web3Provider,
    pageSize: number
    // getLatestTxns = getLatestTxnsWithBlockDetails,
  ) {
    this.prov = prov;
    this.pageSize = pageSize;
    // this.getLatestTxnsWithBlockDetails = getLatestTxns
  }

  static getInstance(
    prov: Web3Provider,
    pageSize: number
    // getLatestTxns = getLatestTxnsWithBlockDetails,
  ): Pagination {
    if (!Pagination.instance) {
      Pagination.instance = new Pagination(prov, pageSize);
    }
    return Pagination.instance;
  }

  clear(): void {
    this.nextPageReminder = [];
    this.prevPageReminder = [];
    this.currentPageTxns = [];
    this.firstTxnHash = '';
    this.lastTxnHash = '';
    this.firstPage = false;
    this.lastPage = false;
  }

  private async checkIsFirstPage(address: string): Promise<boolean> {
    if (this.firstTxnHash === this.currentPageTxns[0][0].hash) {
      return true;
    }

    if (this.currentPageTxns.length < this.pageSize) {
      return true;
    }

    if (this.currentPageTxns.length === this.pageSize && this.prevPageReminder.length === 0) {
      return !(await this.hasMoreTxnsAfter(address));
    }

    return false;
  }

  private hasMoreTxnsAfter = async (address: string): Promise<boolean> => {
    const firstTxnBlock = parseInt(this.currentPageTxns[0][0].blockNumber);
    const txnsCountToLoad = 1;
    const moreTxns = await getTransactionsAfterWithBlockDetails(
      this.prov,
      address,
      firstTxnBlock,
      txnsCountToLoad
    );
    return moreTxns.length > 0;
  };

  private hasMoreTxnsBefore = async (address: string): Promise<boolean> => {
    const lastTxnBlock = parseInt(
      this.currentPageTxns[this.currentPageTxns.length - 1][0].blockNumber
    );
    const txnsCountToLoad = 1;
    const moreTxns = await getTransactionsBeforeWithBlockDetails(
      this.prov,
      address,
      lastTxnBlock,
      txnsCountToLoad
    );
    return moreTxns.length > 0;
  };

  private async checkIsLastPage(address: string): Promise<boolean> {
    if (this.lastTxnHash === this.currentPageTxns[this.currentPageTxns.length - 1][0].hash) {
      return true;
    }

    if (this.currentPageTxns.length < this.pageSize) {
      return true;
    }

    if (!window.navigator.onLine) {
      return true;
    }

    if (this.currentPageTxns.length === this.pageSize && this.nextPageReminder.length === 0) {
      return !(await this.hasMoreTxnsBefore(address));
    }

    return false;
  }

  async showFirstPage(
    address: string,
    data: TransactionListItem[][] | null = null
  ): Promise<TransactionListItem[][]> {
    this.clear();

    let fullList: TransactionListItem[][] = [];
    if (data && data.length) {
      fullList = data;
    } else {
      fullList = txnsWithBlockDetailsToTxnsList(
        await getLatestTxnsWithBlockDetails(this.prov, address, this.pageSize)
      );
    }

    this.prevPageReminder = [];
    this.currentPageTxns = fullList.slice(0, this.pageSize);
    this.nextPageReminder = fullList.slice(this.pageSize);

    this.firstTxnHash = this.currentPageTxns[0][0].hash;

    // TODO: remove this, temporary solution for fixing tests
    // if (data) {
    //   return this.currentPageTxns
    // }

    this.firstPage = true;
    this.lastPage = await this.checkIsLastPage(address);
    this.page = 1;

    return this.currentPageTxns;
  }

  async showLastPage(
    address: string,
    _testData: TransactionListItem[][] | null = null
  ): Promise<TransactionListItem[][]> {
    this.clear();

    const fullList =
      _testData ??
      txnsWithBlockDetailsToTxnsList(
        await getTransactionsAfterWithBlockDetails(this.prov, address, 0, this.pageSize)
      );

    const resultStartPos = fullList.length - this.pageSize;

    this.nextPageReminder = [];
    if (resultStartPos > 0) {
      this.currentPageTxns = fullList.slice(resultStartPos);
      this.prevPageReminder = fullList.slice(0, resultStartPos);
    } else {
      this.currentPageTxns = fullList;
      this.prevPageReminder = [];
    }

    this.lastTxnHash = this.currentPageTxns[this.currentPageTxns.length - 1][0].hash;

    // TODO: remove this, temporary solution for fixing tests
    // if (_testData) {
    //   return this.currentPageTxns
    // }

    this.firstPage = await this.checkIsFirstPage(address);
    this.lastPage = true;
    this.page = -1;

    return this.currentPageTxns;
  }

  async showNextPage(
    address: string,
    _testData: TransactionListItem[][] | null = null
  ): Promise<TransactionListItem[][]> {
    if (this.lastPage) {
      this.nextPageReminder = [];
      return this.currentPageTxns;
    }

    let resultTxns: TransactionListItem[][] = [];
    const currentNextReminder = structuredClone(this.nextPageReminder);

    /* 1. New txns loading is not needed, all persisted in the reminder */

    // new page consists fully from nextPageReminder
    if (currentNextReminder.length >= this.pageSize) {
      resultTxns = currentNextReminder.slice(0, this.pageSize);
      this.nextPageReminder = currentNextReminder.slice(this.pageSize);
      this.prevPageReminder = this.getPrevPageReminderOnShowNextPage(resultTxns);
      this.currentPageTxns = resultTxns; // set new currentPageTxns only after calling getPrevPageReminderOnShowNextPage
      return resultTxns;
    }

    /* 2. Loading new txns to get a full list */

    const lackTxnsCount = this.pageSize - currentNextReminder.length;
    const block = parseInt(this.currentPageTxns[this.currentPageTxns.length - 1][0].blockNumber);
    const newTxns =
      _testData ??
      txnsWithBlockDetailsToTxnsList(
        await getTransactionsBeforeWithBlockDetails(this.prov, address, block, lackTxnsCount)
      );

    const fullList = currentNextReminder.concat(newTxns);
    resultTxns = fullList.slice(0, this.pageSize);

    this.nextPageReminder = fullList.slice(this.pageSize);
    this.prevPageReminder = this.getPrevPageReminderOnShowNextPage(resultTxns);
    this.currentPageTxns = resultTxns; // set new currentPageTxns only after calling getPrevPageReminderOnShowNextPage

    // TODO: remove this, temporary solution for fixing tests
    if (_testData) {
      return this.currentPageTxns;
    }

    this.firstPage = false;
    this.lastPage = await this.checkIsLastPage(address);
    this.page++;

    return this.currentPageTxns;
  }

  private getPrevPageReminderOnShowNextPage(
    newPageTxns: TransactionListItem[][]
  ): TransactionListItem[][] {
    const firstTxnResult = newPageTxns[0];
    const newPrevPageReminder = this.currentPageTxns.filter((txns) => {
      return txns[0].blockNumber === firstTxnResult[0].blockNumber;
    });
    if (
      this.prevPageReminder.length &&
      newPrevPageReminder.length &&
      this.prevPageReminder[0][0].blockNumber === newPrevPageReminder[0][0].blockNumber
    ) {
      return this.prevPageReminder.concat(newPrevPageReminder);
    } else {
      return newPrevPageReminder;
    }
  }

  async showPrevPage(address: string): Promise<TransactionListItem[][]> {
    if (this.firstPage) {
      this.prevPageReminder = [];
      return this.currentPageTxns;
    }

    let resultTxns: TransactionListItem[][] = [];
    const currentBeforeReminder = structuredClone(this.prevPageReminder);

    /* 1. New txns loading is not needed, all persisted in the reminder */

    // new page consists fully from prevPageReminder
    if (currentBeforeReminder.length >= this.pageSize) {
      const resultStartPos = currentBeforeReminder.length - this.pageSize;
      resultTxns = currentBeforeReminder.slice(resultStartPos);
      this.prevPageReminder = currentBeforeReminder.slice(0, resultStartPos);
      this.nextPageReminder = this.getNextPageReminderOnShowPrevPage(resultTxns);
      this.currentPageTxns = resultTxns; // set new currentPageTxns only after calling getNextPageReminderOnShowPrevPage
      return resultTxns;
    }

    /* 2. Loading new txns to get a full list */

    const lackTxnsCount = this.pageSize - currentBeforeReminder.length;
    const block = parseInt(this.currentPageTxns[0][0].blockNumber);
    const newTxns = txnsWithBlockDetailsToTxnsList(
      await getTransactionsAfterWithBlockDetails(this.prov, address, block, lackTxnsCount)
    );

    const fullList = newTxns.concat(currentBeforeReminder);
    const resultStartPos = fullList.length - this.pageSize;
    if (resultStartPos > 0) {
      resultTxns = fullList.slice(resultStartPos);
      this.prevPageReminder = fullList.slice(0, resultStartPos);
    } else {
      resultTxns = fullList;
      this.prevPageReminder = [];
    }

    this.nextPageReminder = this.getNextPageReminderOnShowPrevPage(resultTxns);
    this.currentPageTxns = resultTxns; // set new currentPageTxns only after calling getNextPageReminderOnShowPrevPage

    this.firstPage = await this.checkIsFirstPage(address);
    this.lastPage = false;
    this.page--;

    return resultTxns;
  }

  private getNextPageReminderOnShowPrevPage(
    newPageTxns: TransactionListItem[][]
  ): TransactionListItem[][] {
    const lastTxnResult = newPageTxns[newPageTxns.length - 1];
    const newNextPageReminder = this.currentPageTxns.filter((txns) => {
      return txns[0].blockNumber === lastTxnResult[0].blockNumber;
    });
    if (
      this.nextPageReminder.length &&
      newNextPageReminder.length &&
      this.nextPageReminder[0][0].blockNumber === newNextPageReminder[0][0].blockNumber
    ) {
      return newNextPageReminder.concat(this.nextPageReminder);
    } else {
      return newNextPageReminder;
    }
  }
}
