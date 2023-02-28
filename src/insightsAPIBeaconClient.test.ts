import type { FetchMock } from 'jest-fetch-mock';

import type {
  InsightsApiEvent,
  InsightsAdditionalEventParams,
} from './insightsAPIBeaconClient';
import { InsightsApiBeaconClient } from './insightsAPIBeaconClient';

const getItemMock = jest.spyOn(Object.getPrototypeOf(localStorage), 'getItem');
const setItemMock = jest.spyOn(Object.getPrototypeOf(localStorage), 'setItem');
const consoleErrorSpy = jest.spyOn(console, 'error');

const clientOpts = { applicationId: 'app123', apiKey: 'key123' };

const testEvent: InsightsApiEvent = {
  timestamp: 1674450900226,
  userToken: 'test-token',
  eventType: 'click',
  eventName: 'Object Clicked',
  index: 'test-index',
  queryID: 'test-query',
  objectIDs: ['1'],
  positions: [1],
};

describe('InsightsApiBeaconClient', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  afterAll(() => {
    jest.restoreAllMocks();
  });

  test('it works', () => {
    const beacon = new InsightsApiBeaconClient(clientOpts);

    beacon.send(testEvent);

    expect(getItemMock).toHaveBeenCalledWith('alg:beacon:events');
    expect(setItemMock).toHaveBeenCalled();

    const lastSetItemCall =
      setItemMock.mock.calls[setItemMock.mock.calls.length - 1];
    expect(lastSetItemCall[0]).toEqual('alg:beacon:events');

    const lastSetItemCallData = JSON.parse(lastSetItemCall[1] as any)[0];

    expect(lastSetItemCallData.sent).toBeDefined();
    expect(lastSetItemCallData.event).toMatchObject(testEvent);

    expect(fetch).toHaveBeenCalledTimes(1);
  });

  test('it uses credentials from the constructor by default', () => {
    const beacon = new InsightsApiBeaconClient(clientOpts);
    beacon.send(testEvent);

    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          'X-Algolia-Application-Id': clientOpts.applicationId,
          'X-Algolia-API-Key': clientOpts.apiKey,
        }),
      })
    );
  });

  test('it overrides credentials if specified as additionalParams', () => {
    const beacon = new InsightsApiBeaconClient(clientOpts);
    const additionalParams: InsightsAdditionalEventParams = {
      headers: {
        'X-Algolia-Application-Id': 'overrideApp123',
        'X-Algolia-API-Key': 'overrideKey123',
      },
    };

    beacon.send({ ...testEvent, additionalParams });
    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining(additionalParams.headers),
      })
    );

    // Custom credentials are removed from the event payload
    const lastSetItemCall =
      setItemMock.mock.calls[setItemMock.mock.calls.length - 1];
    const lastSetItemCallData = JSON.parse(lastSetItemCall[1] as any)[0];
    expect(lastSetItemCallData.event.appId).toBeUndefined();
    expect(lastSetItemCallData.event.apiKey).toBeUndefined();

    // Subsequent calls should use the original credentials
    beacon.send(testEvent);
    expect(fetch).toHaveBeenLastCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          'X-Algolia-Application-Id': clientOpts.applicationId,
          'X-Algolia-API-Key': clientOpts.apiKey,
        }),
      })
    );
  });

  test('captures fetch error', () => {
    (fetch as FetchMock).mockReject(new Error('failure'));

    const beacon = new InsightsApiBeaconClient(clientOpts);

    beacon.send(testEvent);
  });

  test('captures localStorage.setItem error', () => {
    consoleErrorSpy.mockImplementation();
    setItemMock.mockImplementationOnce(() => {
      throw new Error('pretend QuotaExceededError');
    });

    const beacon = new InsightsApiBeaconClient(clientOpts);

    beacon.send(testEvent);
  });
});
