import { AlgoliaInsights } from './insights';
import type { InsightsAdditionalEventParams } from './insightsAPIBeaconClient';

describe('insights', () => {
  describe('uses custom credentials', () => {
    const additionalParams: InsightsAdditionalEventParams = {
      headers: {
        'X-Algolia-Application-Id': 'overrideApp123',
        'X-Algolia-API-Key': 'overrideKey123',
      },
    };

    function assert<
      TFunction extends keyof Omit<AlgoliaInsights, 'initialized'>
    >(
      methodName: TFunction,
      payload: Parameters<AlgoliaInsights[TFunction]>[0]
    ) {
      const insights = new AlgoliaInsights([['init', 'app123', 'key123']]);
      insights.setUserToken('usertoken123');

      // @ts-expect-error
      insights[methodName](payload, additionalParams);

      expect(fetch).toHaveBeenLastCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining(additionalParams.headers),
        })
      );
    }

    it('when passed to `sendEvents`', () => {
      assert<'sendEvents'>('sendEvents', [
        {
          eventName: 'Hit Clicked',
          eventType: 'click',
          index: 'index1',
          objectIDs: ['12345'],
          positions: [1],
        },
      ]);
    });

    it('when passed to `clickedObjectIDsAfterSearch`', () => {
      assert<'clickedObjectIDsAfterSearch'>('clickedObjectIDsAfterSearch', {
        eventName: 'Hit Clicked',
        index: 'index1',
        objectIDs: ['12345'],
        positions: [1],
        queryID: 'queryID1',
      });
    });

    it('when passed to `clickedObjectIDs`', () => {
      assert<'clickedObjectIDs'>('clickedObjectIDs', {
        eventName: 'Hit Clicked',
        index: 'index1',
        objectIDs: ['12345'],
      });
    });

    it('when passed to `clickedFilters`', () => {
      assert<'clickedFilters'>('clickedFilters', {
        eventName: 'Filters Clicked',
        index: 'index1',
        filters: ['brand:Apple'],
      });
    });

    it('when passed to `convertedObjectIDsAfterSearch`', () => {
      assert<'convertedObjectIDsAfterSearch'>('convertedObjectIDsAfterSearch', {
        eventName: 'Hit Converted',
        index: 'index1',
        objectIDs: ['12345'],
        queryID: 'queryID1',
      });
    });

    it('when passed to `convertedObjectIDs`', () => {
      assert<'convertedObjectIDs'>('convertedObjectIDs', {
        eventName: 'Hit Converted',
        index: 'index1',
        objectIDs: ['12345'],
      });
    });

    it('when passed to `convertedFilters`', () => {
      assert<'convertedFilters'>('convertedFilters', {
        eventName: 'Filters Converted',
        index: 'index1',
        filters: ['brand:Apple'],
      });
    });

    it('when passed to `viewedObjectIDs`', () => {
      assert<'viewedObjectIDs'>('viewedObjectIDs', {
        eventName: 'Hits Viewed',
        index: 'index1',
        objectIDs: ['12345', '67890'],
      });
    });

    it('when passed to `viewedFilters`', () => {
      assert<'viewedFilters'>('viewedFilters', {
        eventName: 'Filters Viewed',
        index: 'index1',
        filters: ['brand:Apple'],
      });
    });
  });
});
