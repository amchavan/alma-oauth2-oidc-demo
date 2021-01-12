/**
 * Configuration class for the interceptor, provides the list of
 * URLs that require a Bearer authentication header with our identity token
 * in order to grant access.
 *
 * amchavan, 19-Mar-2020
 */
export abstract class OidcAuthInterceptorConfig {
    securedURLs: string[] = [];
}
