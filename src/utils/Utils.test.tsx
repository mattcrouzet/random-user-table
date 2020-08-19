import {compareFn, serialize, getScrollableParent, getNewWidths, shouldLoadMoreData, loadUsers, insertDataIntoSortedArray} from './Utils';

describe('Utils', () => {
  describe('getScrollableParent', () => {
    it('should return null', () => {
      expect(getScrollableParent()).toBeNull();
    });
    it('should return itself', () => {
      const domElement = {scrollHeight: 200, clientHeight: 100} as HTMLElement;
      expect(getScrollableParent(domElement)).toBe(domElement);
    });
    it('should return its parent', () => {
      const parent = {scrollHeight: 200, clientHeight: 100} as HTMLElement;
      const child = {parentNode: parent};
      expect(getScrollableParent(child as any)).toBe(parent);
    });
  });

  describe('compareFn', () => {
    const a = {prop1: 'a', prop2: 'b'};
    const b = {prop1: 'b', prop2: 'a'};

    it('should return 0', () => {
      expect(compareFn()(a, b)).toBe(0);
    });

    it('should return 1', () => {
      expect(compareFn('prop2')(a, b)).toBe(1);
      expect(compareFn('prop1')(b, a)).toBe(1);
    });

    it('should return -1', () => {
      expect(compareFn('prop2')(b, a)).toBe(-1);
      expect(compareFn('prop1')(a, b)).toBe(-1);
    });
  });

  describe('serialize', () => {
    it('should return an empty array', () => {
      expect(serialize().length).toBe(0);
    });

    it('should return a serialized user', () => {
      const userFromApi = {
        gender: 'male',
        name: {first: 'FirstName', last: 'LastName'},
        location: {city: 'city'},
        email: 'email@email.com'
      };
      const expectedUser = {
        gender: 'male',
        firstName: 'FirstName',
        lastName: 'LastName',
        city: 'city',
        email: 'email@email.com'
      };
      expect(serialize([userFromApi])).toEqual([expectedUser]);
    });
  });

  describe('getNewWidths', () => {
    it('should return modify the first element of the array', () => {
      const initialWidths = [100, 100];
      const updatedWidths = getNewWidths(initialWidths, 0, 200);
      expect(initialWidths.length).toBe(updatedWidths.length);
      expect(updatedWidths[0]).not.toBe(initialWidths[0]);
      expect(updatedWidths[1]).toBe(initialWidths[1]);
      expect(updatedWidths[0]).toBe(200);
    });
  });

  describe('shouldLoadMoreData', () => {
    const container = {
      offsetHeight: 1000,
      offsetTop: 0
    } as HTMLElement;
    const table = {
      getBoundingClientRect: () => ({bottom: 1000})
    } as HTMLElement;

    it('should return true', () => {
      expect(shouldLoadMoreData(container, table, (new Date().getTime()) - 200)).toBe(true);
      expect(shouldLoadMoreData(null, table, (new Date().getTime()) - 200)).toBe(true);
    });
    it('should return false if lastLoad is too recent', () => {
      expect(shouldLoadMoreData(container, table, new Date().getTime())).toBe(false);
    });
    it('should return false if the table bottom is too far from the container bottom', () => {
      expect(shouldLoadMoreData(container, {getBoundingClientRect: () => ({bottom: 0})} as HTMLElement, (new Date().getTime()) - 200)).toBe(false);
    });
    it('should return false if the table is null', () => {
      expect(shouldLoadMoreData(container, null, (new Date().getTime()) - 200)).toBe(false);
    });
  });

  describe('loadUsers', () => {
    it('should fetch 1 users', async () => {
      (fetch as any) = jest.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve({
            results: [{
              gender: 'male',
              name: {first: 'FirstName', last: 'LastName'},
              location: {city: 'city'},
              email: 'email@email.com'
            }]
          })
        })
      );
      expect((await loadUsers(1)).length).toBe(1);
    });
    it('should return an empty array if fetch failed', async () => {
      (fetch as any) = jest.fn(() => Promise.reject());
      expect(await loadUsers(1)).toEqual([]);
    });
  });

  describe('insertDataIntoSortedArray', () => {
    it('should return the array of inserted value sorted', () => {
      expect(insertDataIntoSortedArray([], [{a: 2}, {a: 1}], 'a')).toEqual([{a: 1}, {a: 2}]);
    });
    it('should return the array of inserted value sorted by the property b', () => {
      expect(insertDataIntoSortedArray([], [{a: 1, b: 2}, {a: 2, b: 1}], 'b')).toEqual([{a: 2, b: 1}, {a: 1, b: 2}]);
    });
    it('should insert the value at the beginning', () => {
      expect(insertDataIntoSortedArray([{a: 2}], [{a: 1}], 'a')).toEqual([{a: 1}, {a: 2}]);
    });
    it('should insert the value at the end', () => {
      expect(insertDataIntoSortedArray([{a: 1}], [{a: 2}], 'a')).toEqual([{a: 1}, {a: 2}]);
    });
    it('should insert the value in the middle', () => {
      expect(insertDataIntoSortedArray([{a: 1}, {a: 3}], [{a: 2}], 'a')).toEqual([{a: 1}, {a: 2}, {a: 3}]);
    });
    it('should return the current sorted array', () => {
      expect(insertDataIntoSortedArray([{a: 1}], [], 'a')).toEqual([{a: 1}]);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});