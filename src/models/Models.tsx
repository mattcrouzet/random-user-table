/**
 * Model of a user name
 */
export interface ApiUserName {
  /** First name of the user */
  first: string;

  /** First name of the user */
  last: string;
}

/**
 * Model of a user location
 */
export interface ApiUserLocation {
  /** City of the user */
  city: string;
}

/**
 * Model of user from the application
 */
export interface ApiUser {
  /** Name of a user */
  name: ApiUserName;

  /** Location of a user */
  location: ApiUserLocation;
  
  /** email of a user */
  email: string;

  /** gender of a user */
  gender: string;
}

/**
 * Model of user for the application
 */
export interface AppUser {
  /** First name of the user */
  firstName: string;

  /** First name of the user */
  lastName: string;

  /** email of a user */
  email: string;

  /** City of the user */
  city: string;

  /** gender of a user */
  gender: string;
}
