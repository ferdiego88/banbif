export const environment = {
  production: true,
  /*webRelativeUrl: '/sites/yanbalappsdesa/productosnuevos',
  proxyUrl: 'https://uniqueyanbal.sharepoint.com',
  cdnUrl: 'https://uniqueyanbal.sharepoint.com/sites/corporacion/cdn',
  paredUrl: 'https://uniqueyanbal.sharepoint.com/sites/yanbalappsdesa/productosnuevos/pared/',
*/
  appPage: '/SitePages/app.aspx/',
  cdnUrl: 'https://quicorp.sharepoint.com/sites/externoperu/creacion-materiales',
  paredUrl: 'https://quicorp.sharepoint.com/sites/externoperu/creacion-materiales',
  proxyTenant: 'https://quicorp.sharepoint.com',
  proxyUrl: 'https://quicorp.sharepoint.com',
  webRelativeUrl: '/sites/externoperu/creacion-materiales',
  sitePared: 'pared',
  urlForDownloadTest: 'https://quicorp.sharepoint.com',

  getRutaBase() {
    return environment.proxyTenant + environment.webRelativeUrl;
  },
  getRutaBaseApp() {
    let rutaBase = '';
    // debugger;
    if (this.production) {
      rutaBase =
        environment.proxyTenant +
        environment.webRelativeUrl +
        environment.appPage;
    } else {
      rutaBase = environment.proxyTenant + '/';
    }

    return rutaBase;
  },
  getRutaParedApp() {
    let rutaBase = '';

    if (this.production) {
      rutaBase = environment.paredUrl;
    } else {
      rutaBase =
        environment.proxyUrl +
        environment.webRelativeUrl +
        '/' +
        environment.sitePared;
    }

    return rutaBase;
  },
};
