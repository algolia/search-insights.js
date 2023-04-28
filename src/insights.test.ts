import 'jest-fetch-mock';

import type { AaQueue } from './aaShim';
import { AlgoliaInsights } from './insights';
import type { InsightsAdditionalEventParams } from './insightsAPIBeaconClient';

describe('insights', () => {
  describe('applies custom credentials', () => {
    let insights: AlgoliaInsights;
    const additionalParams: InsightsAdditionalEventParams = {
      headers: {
        'X-Algolia-Application-Id': 'overrideApp123',
        'X-Algolia-API-Key': 'overrideKey123',
      },
    };

    beforeEach(() => {
      fetchMock.mockClear();
      insights = new AlgoliaInsights([
        [
          'init',
          { appId: 'app123', apiKey: 'key123', host: 'https://example.com' },
        ],
      ]);
      insights.setUserToken('usertoken123');
    });

    it('when passed to `sendEvents`', () => {
      insights.sendEvents(
        [
          {
            eventName: 'Hit Clicked',
            eventType: 'click',
            index: 'index1',
            objectIDs: ['12345'],
            positions: [1],
          },
        ],
        additionalParams
      );

      expect(fetch).toHaveBeenLastCalledWith(
        expect.stringMatching('https://example.com'),
        expect.objectContaining({
          headers: expect.objectContaining(additionalParams.headers),
          body: expect.stringContaining('"userToken":"usertoken123"'),
        })
      );
    });

    it('when userToken is removed', () => {
      insights.removeUserToken();
      insights.sendEvents(
        [
          {
            eventName: 'Hit Clicked',
            eventType: 'click',
            index: 'index1',
            objectIDs: ['12345'],
            positions: [1],
          },
        ],
        additionalParams
      );

      expect(fetch).toHaveBeenLastCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining(additionalParams.headers),
          body: expect.not.stringContaining('"userToken"'),
        })
      );
    });

    it('when passed to `clickedObjectIDsAfterSearch`', () => {
      insights.clickedObjectIDsAfterSearch(
        {
          eventName: 'Hit Clicked',
          index: 'index1',
          objectIDs: ['12345'],
          positions: [1],
          queryID: 'queryID1',
        },
        additionalParams
      );

      expect(fetch).toHaveBeenLastCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining(additionalParams.headers),
        })
      );
    });

    it('when passed to `clickedObjectIDs`', () => {
      insights.clickedObjectIDs(
        {
          eventName: 'Hit Clicked',
          index: 'index1',
          objectIDs: ['12345'],
        },
        additionalParams
      );

      expect(fetch).toHaveBeenLastCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining(additionalParams.headers),
        })
      );
    });

    it('when passed to `clickedFilters`', () => {
      insights.clickedFilters(
        {
          eventName: 'Filters Clicked',
          index: 'index1',
          filters: ['brand:Apple'],
        },
        additionalParams
      );

      expect(fetch).toHaveBeenLastCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining(additionalParams.headers),
        })
      );
    });

    it('when passed to `convertedObjectIDsAfterSearch`', () => {
      insights.convertedObjectIDsAfterSearch(
        {
          eventName: 'Hit Converted',
          index: 'index1',
          objectIDs: ['12345'],
          queryID: 'queryID1',
        },
        additionalParams
      );

      expect(fetch).toHaveBeenLastCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining(additionalParams.headers),
        })
      );
    });

    it('when passed to `convertedObjectIDs`', () => {
      insights.convertedObjectIDs(
        {
          eventName: 'Hit Converted',
          index: 'index1',
          objectIDs: ['12345'],
        },
        additionalParams
      );

      expect(fetch).toHaveBeenLastCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining(additionalParams.headers),
        })
      );
    });

    it('when passed to `convertedFilters`', () => {
      insights.convertedFilters(
        {
          eventName: 'Filters Converted',
          index: 'index1',
          filters: ['brand:Apple'],
        },
        additionalParams
      );

      expect(fetch).toHaveBeenLastCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining(additionalParams.headers),
        })
      );
    });

    it('when passed to `viewedObjectIDs`', () => {
      insights.viewedObjectIDs(
        {
          eventName: 'Hits Viewed',
          index: 'index1',
          objectIDs: ['12345', '67890'],
        },
        additionalParams
      );

      expect(fetch).toHaveBeenLastCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining(additionalParams.headers),
        })
      );
    });

    it('when passed to `viewedFilters`', () => {
      insights.viewedFilters(
        {
          eventName: 'Filters Viewed',
          index: 'index1',
          filters: ['brand:Apple'],
        },
        additionalParams
      );

      expect(fetch).toHaveBeenLastCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining(additionalParams.headers),
        })
      );
    });
  });

  describe('using legacy aa', () => {
    beforeEach(() => {
      fetchMock.mockClear();
    });

    it('initalizes using an init found in aa.queue', () => {
      const aa: AaQueue = {
        queue: [
          [
            'init',
            { appId: 'app123', apiKey: 'key123', userToken: 'usertoken123' },
          ],
        ],
      };
      const insights = new AlgoliaInsights([], aa);
      expect(insights.initialized).toEqual(true);
      expect(insights.getUserToken()).toEqual('usertoken123');
    });

    it('processes events for aa then insights', () => {
      const aa: AaQueue = {
        queue: [
          [
            'init',
            {
              appId: 'app123',
              apiKey: 'key123',
              userToken: 'usertoken123',
              region: 'de',
            },
          ],
        ],
      };
      const ua = 'custom user agent';
      const insights = new AlgoliaInsights([], aa);

      aa.queue.push(['addAlgoliaAgent', ua]);

      insights.sendEvents(
        [
          {
            eventName: 'Hit Clicked',
            eventType: 'click',
            index: 'index1',
            objectIDs: ['12345'],
            positions: [1],
          },
        ],
        {}
      );

      expect(fetch).toHaveBeenLastCalledWith(
        expect.stringMatching('https://insights.de.algolia.io'),
        expect.objectContaining({
          headers: expect.objectContaining({
            'X-Algolia-Agent': expect.stringContaining(ua),
          }),
        })
      );
    });
  });
});
