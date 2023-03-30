import { Storage } from './storage';

const setItemMock = jest.spyOn(Object.getPrototypeOf(localStorage), 'setItem');
const consoleErrorSpy = jest.spyOn(console, 'error');

describe('Storage', () => {
  test('set string', () => {
    const item = 'test';
    Storage.set('test', item);
    expect(Storage.get('test')).toEqual(item);
  });

  test('set object', () => {
    const item = { event: 'test' };
    Storage.set('test', item);
    expect(Storage.get('test')).toEqual(item);
  });

  test('set array', () => {
    const item = [{ event: 'test' }];
    Storage.set('test', item);
    expect(Storage.get('test')).toEqual(item);
  });

  test('captures localStorage.setItem error', () => {
    consoleErrorSpy.mockImplementation();
    setItemMock.mockImplementationOnce(() => {
      throw new Error('pretend QuotaExceededError');
    });
    Storage.set('test', 'test');
    expect(consoleErrorSpy).toHaveBeenCalled();
  });
});
