/**
 * Configuration class for the interceptor, provides the list of
 * URLs that require a Bearer authentication header with our identity token
 * in order to grant access.
 *
 * The list may include URL fragments, as the interceptor checks for string inclusion.
 * For instance, if 'secured' is the only member of the URL list, a request sent
 * to http://.../proposal-server/service/api/secured/proposal/1832191 will include
 * the Bearer authentication header, while a request sent to
 * http://.../proposal-server/service/api/stats will not.
 *
 * An empty list implies that the Bearer authentication header is never sent.
 *
 * amchavan, 19-Mar-2020
 */
export abstract class OidcAuthInterceptorConfig {
    securedURLs: string[] = [];
}
