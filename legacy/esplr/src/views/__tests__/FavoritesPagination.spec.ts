import { FavoritesPagination } from '@/views/FavoritesPagination';
import { Web3Provider } from 'micro-eth-signer/net';
import { jsonrpc } from 'micro-ftch';
import { describe, expect, it, vi } from 'vitest';
import { removeTxnsListItemsDuplicates, sortTxnsListItemsByTimestamp } from '@/utils/utils';

import firstNextReminder from './pagination-mock/first-page-next-reminder.json';
import firstNoNextReminder from './pagination-mock/first-page-no-next-reminder.json';
import nextFromRemindersNoReminders from './pagination-mock/next-page-from-reminders-no-reminders.json';
import nextFromRemindersNextReminder from './pagination-mock/next-page-from-reminders-next-reminder.json';
import nextFromRemindersPrevReminder from './pagination-mock/next-page-from-reminders-prev-reminder.json';
import nextFromRemindersPrevReminderPageSize from './pagination-mock/next-page-from-reminders-prev-reminder-page-size.json';
import nextFromRemindersPrevReminderMoreThanPageSize from './pagination-mock/next-page-from-reminders-prev-reminder-more-than-page-size.json';
import nextFromScratchNoReminders from './pagination-mock/next-page-from-scratch-no-reminders.json';
import nextPartlyFromRemindersNoReminders from './pagination-mock/next-page-partly-from-reminders-no-reminders.json';
import nextPartlyFromRemindersNextReminder from './pagination-mock/next-page-partly-from-reminders-next-reminder.json';
import nextPartlyFromRemindersPrevReminderPageSize from './pagination-mock/next-page-partly-from-reminders-prev-reminder-page-size.json';
import nextPartlyFromRemindersPrevReminderMoreThanPageSize from './pagination-mock/next-page-partly-from-reminders-prev-reminder-more-than-page-size.json';
import nextPartlyFromRemindersPrevReminder from './pagination-mock/next-page-partly-from-reminders-prev-reminder.json';

import lastNoPrevReminder from './pagination-mock/last-page-no-prev-reminder.json';
import lastPrevReminder from './pagination-mock/last-page-prev-reminder.json';
import prevFromRemindersNoReminders from './pagination-mock/prev-page-from-reminders-no-reminders.json';
import prevFromRemindersPrevReminder from './pagination-mock/prev-page-from-reminders-prev-reminder.json';
import prevFromRemindersNextReminder from './pagination-mock/prev-page-from-reminders-next-reminder.json';
import prevFromRemindersNextReminderPageSize from './pagination-mock/prev-page-from-reminders-next-reminder-page-size.json';
import prevFromRemindersNextReminderPageSizeMoreThanPageSize from './pagination-mock/prev-page-from-reminders-next-reminder-page-size-more-than-page-size.json';
import prevFromScratchNoReminders from './pagination-mock/prev-page-from-scratch-no-reminders.json';
import prevPartlyFromRemindersNoReminders from './pagination-mock/prev-page-partly-from-reminders-no-reminders.json';
import prevPartlyFromRemindersPrevReminder from './pagination-mock/prev-page-partly-from-reminders-prev-reminder.json';
import prevPartlyFromRemindersNextReminder from './pagination-mock/prev-page-partly-from-reminders-next-reminder.json';

import firstSeveralNoNextReminder from './pagination-mock/several-addresses/first-page-no-next-reminder.json';
import firstSeveralNextReminder from './pagination-mock/several-addresses/first-page-next-reminder.json';
import lastSeveralNoNextReminder from './pagination-mock/several-addresses/last-page-no-next-reminder.json';
import lasatSeveralNextReminder from './pagination-mock/several-addresses/last-page-next-reminder.json';

const RPC_URL = 'http://localhost:6900';
const SHOW_TXNS_LIMIT = 5; // mock data from files is supposed to have 5 txns per page, just for testing purposes
const prov = new Web3Provider(jsonrpc(fetch.bind(window), RPC_URL));
const address = '0x1234567890123456789012345678901234567890';

const pagination = FavoritesPagination.getInstance(
  prov,
  SHOW_TXNS_LIMIT,
  undefined, // cache
  true // _testEnv
  // mockGetLatestTxns,
);

const setupPaginationTest = async (mockJson: unknown) => {
  pagination.clear();
  const mockTxns = vi.fn().mockResolvedValue(mockJson);
  return await mockTxns();
};

describe('---------', () => {
  it('---------', () => {});
});
describe('', () => {
  it('↓ Testing with single address ↓', () => {});
});
describe('---------', () => {
  it('---------', () => {});
});

describe('First page', () => {
  it('Load with no reminders', async () => {
    const testData = await setupPaginationTest(firstNoNextReminder);
    const firstPage = await pagination.showFirstPage([address], testData);

    expect(pagination.prevPageReminder).toEqual([]);
    expect(pagination.currentPageTxns).toEqual(firstPage);
    expect(pagination.currentPageTxns).toEqual(testData);
    expect(pagination.nextPageReminder).toEqual([]);

    expect(pagination.firstPage).toEqual(true);
    expect(pagination.lastPage).toEqual(false);
    expect(pagination.page).toEqual(1);
  });

  it('Load with reminders', async () => {
    const testData = await setupPaginationTest(firstNextReminder);

    const firstPage = await pagination.showFirstPage([address], testData);
    const newReminder = testData.slice(SHOW_TXNS_LIMIT);

    expect(pagination.prevPageReminder).toEqual([]);
    expect(pagination.currentPageTxns).toEqual(firstPage);

    expect(newReminder.length).toBeGreaterThan(0);
    expect(pagination.nextPageReminder).toEqual(newReminder);

    expect(pagination.firstPage).toEqual(true);
    expect(pagination.lastPage).toEqual(false);
    expect(pagination.page).toEqual(1);
  });
});

describe('Next page', () => {
  it('Load full from reminder, no new reminders', async () => {
    const testData = await setupPaginationTest(nextFromRemindersNoReminders);

    pagination.currentPageTxns = testData.currentPageTxns;
    pagination.nextPageReminder = testData.nextPageReminder;

    await pagination.showNextPage([address]);
    expect(pagination.prevPageReminder).toEqual([]);
    expect(pagination.currentPageTxns).toEqual(testData.nextPageReminder);
    expect(pagination.nextPageReminder).toEqual([]);

    expect(pagination.firstPage).toEqual(false);
    expect(pagination.lastPage).toEqual(false);
    expect(pagination.page).toEqual(2);
  });

  it('Load full from reminder, only next reminder', async () => {
    const testData = await setupPaginationTest(nextFromRemindersNextReminder);

    pagination.currentPageTxns = testData.currentPageTxns;
    pagination.nextPageReminder = testData.nextPageReminder;

    await pagination.showNextPage([address]);
    expect(pagination.prevPageReminder).toEqual([]);
    expect(pagination.currentPageTxns).toEqual(testData.nextPageReminder.slice(0, SHOW_TXNS_LIMIT));
    expect(pagination.nextPageReminder).toEqual(testData.nextPageReminder.slice(SHOW_TXNS_LIMIT));

    expect(pagination.firstPage).toEqual(false);
    expect(pagination.lastPage).toEqual(false);
    expect(pagination.page).toEqual(2);
  });

  it('Load full from reminder, prev reminder short length', async () => {
    const testData = await setupPaginationTest(nextFromRemindersPrevReminder);

    pagination.currentPageTxns = testData.currentPageTxns;
    pagination.nextPageReminder = testData.nextPageReminder;

    await pagination.showNextPage([address]);
    expect(pagination.prevPageReminder).toEqual(testData.expectedPrevReminder);
    expect(pagination.currentPageTxns).toEqual(testData.nextPageReminder);
    expect(pagination.nextPageReminder).toEqual([]);

    expect(pagination.firstPage).toEqual(false);
    expect(pagination.lastPage).toEqual(false);
    expect(pagination.page).toEqual(2);
  });

  it('Load full from reminder, prev reminder length = page size', async () => {
    const testData = await setupPaginationTest(nextFromRemindersPrevReminderPageSize);

    pagination.prevPageReminder = testData.prevPageReminder;
    pagination.currentPageTxns = testData.currentPageTxns;
    pagination.nextPageReminder = testData.nextPageReminder;

    await pagination.showNextPage([address]);
    expect(pagination.prevPageReminder).toEqual(testData.expectedPrevReminder);
    expect(pagination.currentPageTxns).toEqual(testData.nextPageReminder);
    expect(pagination.nextPageReminder).toEqual([]);

    expect(pagination.firstPage).toEqual(false);
    expect(pagination.lastPage).toEqual(false);
    expect(pagination.page).toEqual(2);
  });

  it('Load full from reminder, prev reminder length > page size', async () => {
    const testData = await setupPaginationTest(nextFromRemindersPrevReminderMoreThanPageSize);

    pagination.prevPageReminder = testData.prevPageReminder;
    pagination.currentPageTxns = testData.currentPageTxns;
    pagination.nextPageReminder = testData.nextPageReminder;

    await pagination.showNextPage([address]);
    expect(pagination.prevPageReminder).toEqual(testData.expectedPrevReminder);
    expect(pagination.currentPageTxns).toEqual(testData.nextPageReminder);
    expect(pagination.nextPageReminder).toEqual([]);

    expect(pagination.firstPage).toEqual(false);
    expect(pagination.lastPage).toEqual(false);
    expect(pagination.page).toEqual(2);
  });

  it('Load next from scratch, no reminders', async () => {
    const testData = await setupPaginationTest(nextFromScratchNoReminders);

    const dataToLoad = testData.dataToLoad;
    pagination.currentPageTxns = testData.currentPageTxns;

    await pagination.showNextPage([address], [dataToLoad]);
    expect(pagination.prevPageReminder).toEqual([]);
    expect(pagination.currentPageTxns).toEqual(dataToLoad);
    expect(pagination.nextPageReminder).toEqual([]);

    expect(pagination.firstPage).toEqual(false);
    expect(pagination.lastPage).toEqual(false);
    expect(pagination.page).toEqual(2);
  });

  it('Load partly from reminder, get rest, no new reminders', async () => {
    const testData = await setupPaginationTest(nextPartlyFromRemindersNoReminders);

    const dataToLoad = testData.dataToLoad;
    pagination.currentPageTxns = testData.currentPageTxns;
    pagination.nextPageReminder = testData.nextPageReminder;
    const expectedCurrentPageTxns = testData.nextPageReminder.concat(dataToLoad);

    await pagination.showNextPage([address], [dataToLoad]);
    expect(pagination.prevPageReminder).toEqual([]);
    expect(expectedCurrentPageTxns.length).toBe(SHOW_TXNS_LIMIT);
    expect(pagination.currentPageTxns).toEqual(expectedCurrentPageTxns);
    expect(pagination.nextPageReminder).toEqual([]);

    expect(pagination.firstPage).toEqual(false);
    expect(pagination.lastPage).toEqual(false);
    expect(pagination.page).toEqual(2);
  });

  it('Load partly from reminder, get rest, only next reminder', async () => {
    const testData = await setupPaginationTest(nextPartlyFromRemindersNextReminder);

    const dataToLoad = testData.dataToLoad;
    pagination.currentPageTxns = testData.currentPageTxns;
    pagination.nextPageReminder = testData.nextPageReminder;
    const expectedCurrentPageTxns = testData.nextPageReminder
      .concat(dataToLoad)
      .slice(0, SHOW_TXNS_LIMIT);

    await pagination.showNextPage([address], [dataToLoad]);
    expect(pagination.prevPageReminder).toEqual([]);
    expect(expectedCurrentPageTxns.length).toBe(SHOW_TXNS_LIMIT);
    expect(pagination.currentPageTxns).toEqual(expectedCurrentPageTxns);
    expect(pagination.nextPageReminder).toEqual(testData.expectedNextReminder);

    expect(pagination.firstPage).toEqual(false);
    expect(pagination.lastPage).toEqual(false);
    expect(pagination.page).toEqual(2);
  });

  it('Load partly from reminder, get rest, prev remider short length', async () => {
    const testData = await setupPaginationTest(nextPartlyFromRemindersPrevReminder);

    const dataToLoad = testData.dataToLoad;
    pagination.currentPageTxns = testData.currentPageTxns;
    pagination.nextPageReminder = testData.nextPageReminder;
    const expectedCurrentPageTxns = testData.nextPageReminder.concat(dataToLoad);

    await pagination.showNextPage([address], [dataToLoad]);
    expect(pagination.prevPageReminder).toEqual(testData.expectedPrevReminder);
    expect(expectedCurrentPageTxns.length).toBe(SHOW_TXNS_LIMIT);
    expect(pagination.currentPageTxns).toEqual(expectedCurrentPageTxns);
    expect(pagination.nextPageReminder).toEqual([]);

    expect(pagination.firstPage).toEqual(false);
    expect(pagination.lastPage).toEqual(false);
    expect(pagination.page).toEqual(2);
  });

  it('Load partly from reminder, get rest, prev remider length = page size', async () => {
    const testData = await setupPaginationTest(nextPartlyFromRemindersPrevReminderPageSize);

    const dataToLoad = testData.dataToLoad;
    pagination.currentPageTxns = testData.currentPageTxns;
    pagination.nextPageReminder = testData.nextPageReminder;
    const expectedCurrentPageTxns = testData.nextPageReminder.concat(dataToLoad);

    await pagination.showNextPage([address], [dataToLoad]);
    expect(pagination.prevPageReminder).toEqual(testData.expectedPrevReminder);
    expect(expectedCurrentPageTxns.length).toBe(SHOW_TXNS_LIMIT);
    expect(pagination.currentPageTxns).toEqual(expectedCurrentPageTxns);
    expect(pagination.nextPageReminder).toEqual([]);

    expect(pagination.firstPage).toEqual(false);
    expect(pagination.lastPage).toEqual(false);
    expect(pagination.page).toEqual(2);
  });

  it('Load partly from reminder, get rest, prev remider length > page size', async () => {
    const testData = await setupPaginationTest(nextPartlyFromRemindersPrevReminderMoreThanPageSize);

    const dataToLoad = testData.dataToLoad;
    pagination.currentPageTxns = testData.currentPageTxns;
    pagination.nextPageReminder = testData.nextPageReminder;
    pagination.prevPageReminder = testData.prevPageReminder;
    const expectedCurrentPageTxns = testData.nextPageReminder.concat(dataToLoad);

    await pagination.showNextPage([address], [dataToLoad]);
    expect(pagination.prevPageReminder).toEqual(testData.expectedPrevReminder);
    expect(expectedCurrentPageTxns.length).toBe(SHOW_TXNS_LIMIT);
    expect(pagination.currentPageTxns).toEqual(expectedCurrentPageTxns);
    expect(pagination.nextPageReminder).toEqual([]);

    expect(pagination.firstPage).toEqual(false);
    expect(pagination.lastPage).toEqual(false);
    expect(pagination.page).toEqual(2);
  });

  it('If current page is last, return current page txns', async () => {
    const testData = await setupPaginationTest(firstNoNextReminder);
    const lastPage = await pagination.showLastPage([address], [testData]);

    expect(pagination.lastPage).toEqual(true);
    expect(pagination.prevPageReminder).toEqual([]);
    expect(pagination.currentPageTxns).toEqual(lastPage);
    expect(pagination.currentPageTxns).toEqual(testData);
    expect(pagination.nextPageReminder).toEqual([]);

    const nextPage = await pagination.showNextPage([address]);
    expect(pagination.lastPage).toEqual(true);
    expect(nextPage).toEqual(lastPage);
    expect(nextPage).toEqual(testData);
    expect(pagination.prevPageReminder).toEqual([]);
    expect(pagination.currentPageTxns).toEqual(testData);
    expect(pagination.nextPageReminder).toEqual([]);

    expect(pagination.firstPage).toEqual(false);
    expect(pagination.lastPage).toEqual(true);
    expect(pagination.page).toEqual(-1);
  });
});

describe('---------', () => {
  it('---------', () => {});
});

describe('Last page', () => {
  it('Load with no reminders', async () => {
    const testData = await setupPaginationTest(lastNoPrevReminder);
    const lastPage = await pagination.showLastPage([address], [testData]);

    expect(pagination.prevPageReminder).toEqual([]);
    expect(pagination.currentPageTxns).toEqual(lastPage);
    expect(pagination.currentPageTxns).toEqual(testData);
    expect(pagination.nextPageReminder).toEqual([]);

    expect(pagination.lastPage).toEqual(true);
    expect(pagination.firstPage).toEqual(false);
    expect(pagination.page).toEqual(-1);
  });

  it('Load with reminders', async () => {
    const testData = await setupPaginationTest(lastPrevReminder);

    const lastPage = await pagination.showLastPage([address], [testData]);
    const startPosition = testData.length - SHOW_TXNS_LIMIT;
    const newReminder = testData.slice(0, startPosition);
    const currentTxns = testData.slice(startPosition);

    expect(pagination.prevPageReminder).toEqual(newReminder);
    expect(pagination.currentPageTxns).toEqual(lastPage);
    expect(pagination.currentPageTxns).toEqual(currentTxns);
    expect(pagination.nextPageReminder).toEqual([]);

    expect(pagination.lastPage).toEqual(true);
    expect(pagination.firstPage).toEqual(false);
    expect(pagination.page).toEqual(-1);
  });
});

describe('Prev page', () => {
  it('Load full from reminder, no new reminders', async () => {
    const testData = await setupPaginationTest(prevFromRemindersNoReminders);

    pagination.currentPageTxns = testData.currentPageTxns;
    pagination.prevPageReminder = testData.prevPageReminder;
    pagination.page = -1;

    await pagination.showPrevPage([address]);
    expect(pagination.prevPageReminder).toEqual([]);
    expect(pagination.currentPageTxns).toEqual(testData.prevPageReminder);
    expect(pagination.nextPageReminder).toEqual([]);

    expect(pagination.lastPage).toEqual(false);
    expect(pagination.firstPage).toEqual(false);
    expect(pagination.page).toEqual(-2);
  });

  it('Load full from reminder, only prev reminder', async () => {
    const testData = await setupPaginationTest(prevFromRemindersPrevReminder);

    pagination.currentPageTxns = testData.currentPageTxns;
    pagination.prevPageReminder = testData.prevPageReminder;
    pagination.page = -1;

    const startPosition = testData.prevPageReminder.length - SHOW_TXNS_LIMIT;
    await pagination.showPrevPage([address]);
    expect(pagination.prevPageReminder).toEqual(testData.prevPageReminder.slice(0, startPosition));
    expect(pagination.currentPageTxns).toEqual(testData.prevPageReminder.slice(startPosition));
    expect(pagination.nextPageReminder).toEqual([]);

    expect(pagination.lastPage).toEqual(false);
    expect(pagination.firstPage).toEqual(false);
    expect(pagination.page).toEqual(-2);
  });

  it('Load full from reminder, next reminder short length', async () => {
    const testData = await setupPaginationTest(prevFromRemindersNextReminder);

    pagination.currentPageTxns = testData.currentPageTxns;
    pagination.prevPageReminder = testData.prevPageReminder;
    pagination.page = -1;

    await pagination.showPrevPage([address]);
    expect(pagination.prevPageReminder).toEqual([]);
    expect(pagination.currentPageTxns).toEqual(testData.prevPageReminder);
    expect(pagination.nextPageReminder).toEqual(testData.expectedNextReminder);

    expect(pagination.lastPage).toEqual(false);
    expect(pagination.firstPage).toEqual(false);
    expect(pagination.page).toEqual(-2);
  });

  it('Load full from reminder, next reminder length = page size', async () => {
    const testData = await setupPaginationTest(prevFromRemindersNextReminderPageSize);

    pagination.currentPageTxns = testData.currentPageTxns;
    pagination.prevPageReminder = testData.prevPageReminder;
    pagination.page = -1;

    await pagination.showPrevPage([address]);
    expect(pagination.prevPageReminder).toEqual([]);
    expect(pagination.currentPageTxns).toEqual(testData.prevPageReminder);
    expect(pagination.nextPageReminder).toEqual(testData.currentPageTxns);

    expect(pagination.lastPage).toEqual(false);
    expect(pagination.firstPage).toEqual(false);
    expect(pagination.page).toEqual(-2);
  });

  it('Load full from reminder, next reminder length > page size', async () => {
    const testData = await setupPaginationTest(
      prevFromRemindersNextReminderPageSizeMoreThanPageSize
    );

    pagination.currentPageTxns = testData.currentPageTxns;
    pagination.prevPageReminder = testData.prevPageReminder;
    pagination.nextPageReminder = testData.nextPageReminder;
    pagination.page = -1;

    await pagination.showPrevPage([address]);
    expect(pagination.prevPageReminder).toEqual([]);
    expect(pagination.currentPageTxns).toEqual(testData.prevPageReminder);
    expect(pagination.nextPageReminder).toEqual(
      testData.currentPageTxns.concat(testData.nextPageReminder)
    );

    expect(pagination.lastPage).toEqual(false);
    expect(pagination.firstPage).toEqual(false);
    expect(pagination.page).toEqual(-2);
  });

  it('Load prev from scratch, no reminders', async () => {
    const testData = await setupPaginationTest(prevFromScratchNoReminders);

    const dataToLoad = testData.dataToLoad;
    pagination.currentPageTxns = testData.currentPageTxns;
    pagination.page = -1;

    await pagination.showPrevPage([address], [dataToLoad]);
    expect(pagination.prevPageReminder).toEqual([]);
    expect(pagination.currentPageTxns).toEqual(dataToLoad);
    expect(pagination.nextPageReminder).toEqual([]);

    expect(pagination.lastPage).toEqual(false);
    expect(pagination.firstPage).toEqual(false);
    expect(pagination.page).toEqual(-2);
  });

  it('Load partly from reminder, get rest, no new reminders', async () => {
    const testData = await setupPaginationTest(prevPartlyFromRemindersNoReminders);

    const dataToLoad = testData.dataToLoad;
    pagination.currentPageTxns = testData.currentPageTxns;
    pagination.prevPageReminder = testData.prevPageReminder;
    pagination.page = -1;

    await pagination.showPrevPage([address], [dataToLoad]);

    expect(pagination.prevPageReminder).toEqual([]);
    expect(pagination.currentPageTxns).toEqual(dataToLoad.concat(testData.prevPageReminder));
    expect(pagination.nextPageReminder).toEqual([]);

    expect(pagination.lastPage).toEqual(false);
    expect(pagination.firstPage).toEqual(false);
    expect(pagination.page).toEqual(-2);
  });

  it('Load partly from reminder, get rest, only prev reminder', async () => {
    const testData = await setupPaginationTest(prevPartlyFromRemindersPrevReminder);
    const dataToLoad = testData.dataToLoad;

    pagination.currentPageTxns = testData.currentPageTxns;
    pagination.prevPageReminder = testData.prevPageReminder;
    pagination.page = -1;

    await pagination.showPrevPage([address], [dataToLoad]);
    const result = dataToLoad.concat(testData.prevPageReminder);
    const startPosition = result.length - SHOW_TXNS_LIMIT;

    expect(pagination.prevPageReminder).toEqual(testData.expectedPrevReminder);
    expect(pagination.currentPageTxns).toEqual(result.slice(startPosition));
    expect(pagination.nextPageReminder).toEqual([]);

    expect(pagination.lastPage).toEqual(false);
    expect(pagination.firstPage).toEqual(false);
    expect(pagination.page).toEqual(-2);
  });

  it('Load partly from reminder, get rest, next remider short length', async () => {
    const testData = await setupPaginationTest(prevPartlyFromRemindersNextReminder);

    const dataToLoad = testData.dataToLoad;
    pagination.currentPageTxns = testData.currentPageTxns;
    pagination.prevPageReminder = testData.prevPageReminder;
    pagination.page = -1;

    await pagination.showPrevPage([address], [dataToLoad]);
    expect(pagination.prevPageReminder).toEqual([]);
    expect(pagination.currentPageTxns).toEqual(dataToLoad.concat(testData.prevPageReminder));
    expect(pagination.nextPageReminder).toEqual(testData.expectedNextReminder);

    expect(pagination.lastPage).toEqual(false);
    expect(pagination.firstPage).toEqual(false);
    expect(pagination.page).toEqual(-2);
  });
});

describe('---------', () => {
  it('---------', () => {});
});
describe('', () => {
  it('↓ Testing with several addresses ↓', () => {});
});
describe('---------', () => {
  it('---------', () => {});
});

describe('First page several', () => {
  it('Load with no reminders', async () => {
    const testData = await setupPaginationTest(firstSeveralNoNextReminder);
    const firstPage = await pagination.showFirstPage([address], testData);

    const expectedResult = sortTxnsListItemsByTimestamp(
      removeTxnsListItemsDuplicates(testData)
    ).slice(0, SHOW_TXNS_LIMIT);

    expect(pagination.prevPageReminder).toEqual([]);
    expect(pagination.currentPageTxns).toEqual(firstPage);
    expect(pagination.currentPageTxns).toEqual(expectedResult);
    expect(pagination.nextPageReminder).toEqual([]);

    expect(pagination.lastPage).toEqual(false);
    expect(pagination.firstPage).toEqual(true);
    expect(pagination.page).toEqual(1);
  });

  it('Load with next reminder', async () => {
    const testData = await setupPaginationTest(firstSeveralNextReminder);

    const { dataToLoad, expectedNextReminder } = testData;
    const firstPage = await pagination.showFirstPage([address], dataToLoad);
    const expectedResult = sortTxnsListItemsByTimestamp(
      removeTxnsListItemsDuplicates(dataToLoad)
    ).slice(0, SHOW_TXNS_LIMIT);

    expect(pagination.prevPageReminder).toEqual([]);
    expect(pagination.currentPageTxns).toEqual(firstPage);
    expect(pagination.currentPageTxns).toEqual(expectedResult);
    expect(pagination.nextPageReminder).toEqual(expectedNextReminder);

    expect(pagination.lastPage).toEqual(false);
    expect(pagination.firstPage).toEqual(true);
    expect(pagination.page).toEqual(1);
  });
});

describe('---------', () => {
  it('---------', () => {});
});

describe('Last page several', () => {
  it('Load with no reminders', async () => {
    const testData = await setupPaginationTest(lastSeveralNoNextReminder);
    const lastPage = await pagination.showLastPage([address], [testData]);

    const fullList = sortTxnsListItemsByTimestamp(removeTxnsListItemsDuplicates(testData));
    const resultStartPos = fullList.length - SHOW_TXNS_LIMIT;
    const expectedResult = fullList.slice(resultStartPos);

    expect(pagination.prevPageReminder).toEqual([]);
    expect(pagination.currentPageTxns).toEqual(lastPage);
    expect(pagination.currentPageTxns).toEqual(expectedResult);
    expect(pagination.nextPageReminder).toEqual([]);

    expect(pagination.firstPage).toEqual(false);
    expect(pagination.lastPage).toEqual(true);
    expect(pagination.page).toEqual(-1);
  });

  it('Load with prev reminders', async () => {
    const testData = await setupPaginationTest(lasatSeveralNextReminder);

    const { dataToLoad, expectedPrevReminder } = testData;
    const lastPage = await pagination.showLastPage([address], [dataToLoad]);

    const fullList = sortTxnsListItemsByTimestamp(removeTxnsListItemsDuplicates(dataToLoad));
    const resultStartPos = fullList.length - SHOW_TXNS_LIMIT;
    const expectedResult = fullList.slice(resultStartPos);

    expect(pagination.prevPageReminder).toEqual(expectedPrevReminder);
    expect(pagination.currentPageTxns).toEqual(lastPage);
    expect(pagination.currentPageTxns).toEqual(expectedResult);
    expect(pagination.nextPageReminder).toEqual([]);

    expect(pagination.firstPage).toEqual(false);
    expect(pagination.lastPage).toEqual(true);
    expect(pagination.page).toEqual(-1);
  });
});
