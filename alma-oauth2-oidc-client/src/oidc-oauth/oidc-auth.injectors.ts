import {InjectionToken} from '@angular/core';

/**
 * Define injection tokens to be used around the application
 *
 * amchavan, 12-Mar-2020
 */

/**
 * USER_IDENTITY object includes resource owner information as returned by the Identity Provider:
 *
 * {
 *  "sub":"amchavan",
 *  "givenName":"Maurizio",
 *  "lastName":"Chavan",
 *  "mail":"amchavan6010@noname.domain.org",
 *  "roles":["MASTER/USER"],
 *  "preferred_username":"amchavan",
 *  ...
 * }
 */
export const USER_IDENTITY = new InjectionToken<object>('Resource owner information, from Identity Provider');
