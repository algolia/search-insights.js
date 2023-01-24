/**
 * Create UUID according to
 * https://www.ietf.org/rfc/rfc4122.txt.
 *
 * @returns Generated UUID.
 */
export const createUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.floor(Math.random() * 16);
    const v = c === 'x' ? r : (r % 4) + 8;
    return v.toString(16);
  });
};
