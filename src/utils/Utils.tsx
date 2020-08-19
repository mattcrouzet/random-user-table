import {ApiUser, AppUser} from '../models/Models';

/**
 * Returns a comparison function
 * @param property 
 */
export function compareFn(property?: string) {
  return (a: any, b: any) => {
    return property ? (a[property] > b[property] ? 1 : -1) : 0;
  }
} 

/**
 * Serialize a list of `UserFromApi` to a list of `AppUser`
 * @param usersFromApi list of users received from the API
 */
export function serialize(usersFromApi: ApiUser[] = []): AppUser[] {
  return usersFromApi.map((user) => ({
    firstName: user.name.first,
    lastName: user.name.last,
    email: user.email,
    city: user.location.city,
    gender: user.gender
  }));
};

/**
 * Returns the first scrollable parent of `domElement`
 * @param domElement 
 */
export function getScrollableParent(domElement?: HTMLElement | null): HTMLElement | null {
  if (!domElement) {
    return null;
  } else if (domElement.scrollHeight > domElement.clientHeight) {
    return domElement;
  } else {
    return getScrollableParent(domElement.parentNode as (HTMLElement | null));
  }
}

/**
 * Returns the updated array
 * @param widths List of current width
 * @param i index of width that needs to be updated
 * @param width new value of width
 */
export function getNewWidths(widths: number[], i: number, width: number) {
  const updatedWidths = widths.slice();
  updatedWidths[i] = width;
  return updatedWidths;
}

/** 
 * Check if it should ask for new data
 * @param container node
 * @param table node
 */
export function shouldLoadMoreData(container: HTMLElement | null, table: HTMLElement | null, lastLoad: number): boolean {
  const now = new Date().getTime();
  const bottomTable = table ? table.getBoundingClientRect().bottom : 0;
  const bottomContainer = container ? container.offsetHeight + container.offsetTop : window.innerHeight;
  return (lastLoad + 50 < now && bottomTable - 2000 < bottomContainer && bottomTable > 0);
}

/**
  * Call the API to load new users
  * @param users already loaded
  * @param nbUser number of users to request
  */
export async function loadUsers(nbUser: number): Promise<AppUser[]> {
  try {
    const call = fetch(`https://randomuser.me/api/?results=${nbUser}&nat=gb`);
    const response = await (await call).json();
    const usersFromApi: ApiUser[] = response.results
    return serialize(usersFromApi);
  } catch {
    return [];
  }
}

/**
 * Insert data in a sorted array
 * @param sortedArray Array of sorted data
 * @param dataToInsert Data to insert inside `sortedArray`
 * @param property of the data to compare for the insertion
 */
export function insertDataIntoSortedArray(sortedArray: any[], dataToInsert: any[], property: string): any[] {
  const fn = compareFn(property);
  return dataToInsert.reduce((acc, d) => {
    let i = acc.length;
    while (i > 0 && fn(acc[i - 1], d) > 0) {
      acc[i] = acc[i -1];
      i--;
    }
    acc[i] = d;
    return acc;
  }, sortedArray);
}
