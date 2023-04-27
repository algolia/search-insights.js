import type { FetchMock } from 'jest-fetch-mock';

import type {
  InsightsApiEvent,
  InsightsAdditionalEventParams,
} from './insightsAPIBeaconClient';
import { InsightsApiBeaconClient } from './insightsAPIBeaconClient';
import { Storage } from './storage';

jest.mock('./storage');

function getLastSetItemData() {
  const lastSetItemCall = (
    Storage.set as jest.MockedFunction<typeof Storage.set>
  ).mock.lastCall;
  return lastSetItemCall ? JSON.parse(lastSetItemCall[1])[0] : {};
}

type ClientOptions = ConstructorParameters<typeof InsightsApiBeaconClient>[0];

const clientOpts: ClientOptions = {
  appId: 'app123',
  apiKey: 'key123',
};

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

    const lastSetItemCallData = getLastSetItemData();

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

    const lastSetItemCallData = getLastSetItemData();

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
          'X-Algolia-Application-Id': clientOpts.appId,
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
    const lastSetItemCallData = getLastSetItemData();

    expect(lastSetItemCallData.event.appId).toBeUndefined();
    expect(lastSetItemCallData.event.apiKey).toBeUndefined();

    // Subsequent calls should use the original credentials
    beacon.send(testEvent);
    expect(fetch).toHaveBeenLastCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          'X-Algolia-Application-Id': clientOpts.appId,
          'X-Algolia-API-Key': clientOpts.apiKey,
        }),
      })
    );
  });

  test('it allows credentials to only be specified as additionalParams', () => {
    const beacon = new InsightsApiBeaconClient();
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
  });

  test('errors if credentials are missing from constructor and additionalParams', () => {
    const beacon = new InsightsApiBeaconClient();

    expect(() => beacon.send(testEvent)).toThrow();
  });

  test('repeatedly tries to send events if they were unsuccessfully sent previously', async () => {
    (fetch as FetchMock).mockResponses(
      [
        'Internal Server Error',
        {
          status: 500,
        },
      ],
      [
        'Service Unavailable',
        {
          status: 503,
        },
      ],
      [
        '',
        {
          status: 204,
        },
      ]
    );

    const beacon = new InsightsApiBeaconClient(clientOpts);
    beacon.send(testEvent);

    expect(getLastSetItemData().sent).toEqual(false);

    await beacon.flushAndPurgeEvents();

    expect(getLastSetItemData().sent).toEqual(false);

    await beacon.flushAndPurgeEvents();

    expect(fetch as FetchMock).toHaveBeenCalledTimes(3);
    expect(getLastSetItemData().sent).toEqual(true);
  });

  describe('endpoint', () => {
    test('non-region specific by default', () => {
      const beacon = new InsightsApiBeaconClient(clientOpts);
      beacon.send(testEvent);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringMatching('https://insights.algolia.io'),
        expect.any(Object)
      );
    });

    test('de region specific', () => {
      const beacon = new InsightsApiBeaconClient({
        ...clientOpts,
        region: 'de',
      });
      beacon.send(testEvent);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringMatching('https://insights.de.algolia.io'),
        expect.any(Object)
      );
    });

    test('us region specific', () => {
      const beacon = new InsightsApiBeaconClient({
        ...clientOpts,
        region: 'us',
      });
      beacon.send(testEvent);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringMatching('https://insights.us.algolia.io'),
        expect.any(Object)
      );
    });

    test('custom host overrides region', () => {
      const beacon = new InsightsApiBeaconClient({
        ...clientOpts,
        region: 'us',
        host: 'https://example.com',
      });
      beacon.send(testEvent);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringMatching('https://example.com'),
        expect.any(Object)
      );
    });
  });

  describe('setOptions', () => {
    test('updates credentials', () => {
      const beacon = new InsightsApiBeaconClient();

      expect(() => beacon.send(testEvent)).toThrow();

      beacon.setOptions(clientOpts);
      beacon.flushAndPurgeEvents();

      expect(fetch).toHaveBeenCalledWith(
        expect.stringMatching('https://insights.algolia.io'),
        expect.any(Object)
      );
    });

    test('updates endpoint', () => {
      const beacon = new InsightsApiBeaconClient(clientOpts);

      beacon.setOptions({
        region: 'us',
      });
      beacon.send(testEvent);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringMatching('https://insights.us.algolia.io'),
        expect.any(Object)
      );

      beacon.setOptions({
        host: 'https://example.com',
      });
      beacon.send(testEvent);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringMatching('https://example.com'),
        expect.any(Object)
      );
    });

    test('unsets credentials', () => {
      const beacon = new InsightsApiBeaconClient(clientOpts);

      beacon.setOptions({
        appId: undefined,
        apiKey: undefined,
      });
      expect(() => beacon.send(testEvent)).toThrow();
    });

    test('unsets endpoint', () => {
      const beacon = new InsightsApiBeaconClient({
        ...clientOpts,
        region: 'us',
        host: 'https://example.com',
      });

      beacon.setOptions({
        host: undefined,
      });
      beacon.send(testEvent);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringMatching('https://insights.us.algolia.io'),
        expect.any(Object)
      );

      beacon.setOptions({
        region: undefined,
      });
      beacon.send(testEvent);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringMatching('https://insights.algolia.io'),
        expect.any(Object)
      );
    });
  });
});
