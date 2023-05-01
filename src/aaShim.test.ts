/* eslint-disable no-new */
import { version } from '../package.json';

import { AaShim } from './aaShim';
import { AlgoliaInsights } from './insights';

jest.mock('./insights');

describe('aaShim', () => {
  const insights = new AlgoliaInsights();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('init', () => {
    new AaShim(insights, {
      queue: [
        [
          'init',
          { appId: 'app123', apiKey: 'key123', userToken: 'usertoken123' },
        ],
      ],
    });
    expect(insights.init).toHaveBeenCalledWith(
      expect.objectContaining({ appId: 'app123', apiKey: 'key123' })
    );
    expect(insights.setUserToken).toHaveBeenCalledWith('usertoken123');
  });

  it('addAlgoliaAgent', () => {
    new AaShim(insights, {
      queue: [['addAlgoliaAgent', 'some-ua']],
    });
    expect(insights.addAlgoliaAgent).toHaveBeenCalledWith('some-ua');
  });

  it('setUserToken', () => {
    new AaShim(insights, {
      queue: [['setUserToken', 'usertoken456']],
    });
    expect(insights.setUserToken).toHaveBeenCalledWith('usertoken456');
  });

  it('getUserToken', () => {
    const cb = jest.fn();
    new AaShim(insights, {
      queue: [['getUserToken', {}, cb]],
    });
    expect(insights.getUserToken).toHaveBeenCalledWith(cb);
  });

  it('onUserTokenChange', () => {
    (
      insights.getUserToken as jest.MockedFunction<typeof insights.getUserToken>
    ).mockImplementationOnce(() => 'usertoken123');
    const cb = jest.fn();
    new AaShim(insights, {
      queue: [['onUserTokenChange', cb, { immediate: true }]],
    });
    expect(insights.on).toHaveBeenCalledWith('userToken:changed', cb);
    expect(insights.getUserToken).toHaveBeenCalled();
    expect(cb).toHaveBeenCalledWith('usertoken123');
  });

  it.each([
    ['clickedObjectIDsAfterSearch'],
    ['clickedObjectIDs'],
    ['clickedFilters'],
    ['convertedObjectIDsAfterSearch'],
    ['convertedObjectIDs'],
    ['convertedFilters'],
    ['viewedObjectIDs'],
    ['viewedFilters'],
  ])('%s', (fn) => {
    const params = {
      eventName: 'hit-clicked',
      index: 0,
      queryID: 'query-id',
      objectIDs: ['object-id'],
      positions: [1],
    };
    const params2 = {
      eventName: 'hit-clicked',
      index: 1,
      queryID: 'query-id',
      objectIDs: ['object-id'],
      positions: [2],
    };
    new AaShim(insights, {
      queue: [[fn, params, params2]],
    });
    expect(insights[fn]).toHaveBeenCalledWith(params);
    expect(insights[fn]).toHaveBeenCalledWith(params2);
  });

  it('getVersion', () => {
    const cb = jest.fn();
    new AaShim(insights, {
      queue: [['getVersion', cb]],
    });
    expect(cb).toHaveBeenCalledWith(version);
  });
});
