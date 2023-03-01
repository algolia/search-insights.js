import type { FetchMock } from 'jest-fetch-mock';

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
      (fetch as FetchMock).mockClear();
      insights = new AlgoliaInsights([['init', 'app123', 'key123']]);
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
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining(additionalParams.headers),
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
});
