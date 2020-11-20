export const environment = {
  production: true,
  /*webRelativeUrl: '/sites/yanbalappsdesa/productosnuevos',
  proxyUrl: 'https://uniqueyanbal.sharepoint.com',
  cdnUrl: 'https://uniqueyanbal.sharepoint.com/sites/corporacion/cdn',
  paredUrl: 'https://uniqueyanbal.sharepo int.com/sites/yanbalappsdesa/productosnuevos/pared/',
*/
  appPage: '/SitePages/app.aspx/',
  cdnUrl: 'http://bif1mssapp10/banmin/fdt/hipot',
  paredUrl: 'http://bif1mssapp10/banmin/fdt/hipot',
  proxyTenant: 'http://bif1mssapp10',
  proxyUrl: 'http://bif1mssapp10',
  webRelativeUrl: '/banmin/fdt/hipot',
  sitePared: 'pared',
  urlForDownloadTest: 'http://bif1mssapp10',

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
