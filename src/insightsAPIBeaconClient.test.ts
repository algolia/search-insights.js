import type { FetchMock } from 'jest-fetch-mock';

import type {
  InsightsApiEvent,
  InsightsAdditionalEventParams,
} from './insightsAPIBeaconClient';
import { InsightsApiBeaconClient } from './insightsAPIBeaconClient';
import { Storage } from './storage';

jest.mock('./storage');

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
    (fetch as FetchMock).mockClear();
  });
  afterAll(() => {
    jest.restoreAllMocks();
    (fetch as FetchMock).mockRestore();
  });

  test('it works', () => {
    const beacon = new InsightsApiBeaconClient(clientOpts);

    beacon.send(testEvent);

    expect(Storage.get).toHaveBeenCalledWith('alg:beacon:events');
    expect(Storage.set).toHaveBeenLastCalledWith(
      'alg:beacon:events',
      expect.any(String)
    );

    const lastSetItemCall = (
      Storage.set as jest.MockedFunction<typeof Storage.set>
    ).mock.lastCall!;

    const lastSetItemCallData = JSON.parse(lastSetItemCall[1])[0];

    expect(lastSetItemCallData.sent).toBeDefined();
    expect(lastSetItemCallData.event).toMatchObject(testEvent);

    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        body: expect.stringContaining(JSON.stringify({ events: [testEvent] })),
      })
    );
  });

  test('it works without a userToken', () => {
    const beacon = new InsightsApiBeaconClient(clientOpts);
    const testEventWithoutUserToken = {
      ...testEvent,
    };
    delete testEventWithoutUserToken.userToken;
    beacon.send(testEventWithoutUserToken);

    expect(Storage.get).toHaveBeenCalledWith('alg:beacon:events');
    expect(Storage.set).toHaveBeenLastCalledWith(
      'alg:beacon:events',
      expect.any(String)
    );

    const lastSetItemCall = (
      Storage.set as jest.MockedFunction<typeof Storage.set>
    ).mock.lastCall!;

    const lastSetItemCallData = JSON.parse(lastSetItemCall[1])[0];

    expect(lastSetItemCallData.sent).toBeDefined();
    expect(lastSetItemCallData.event).toMatchObject(testEventWithoutUserToken);

    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        body: expect.stringContaining(
          JSON.stringify({ events: [testEventWithoutUserToken] })
        ),
      })
    );
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

    beacon.send(testEvent, additionalParams);
    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining(additionalParams.headers),
      })
    );

    // Custom credentials are removed from the event payload
    const lastSetItemCall = (
      Storage.set as jest.MockedFunction<typeof Storage.set>
    ).mock.lastCall!;
    const lastSetItemCallData = JSON.parse(lastSetItemCall[1])[0];

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
});
