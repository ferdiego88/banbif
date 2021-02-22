export const environment = {
  production: false,
  appPage: "/SitePages/app.aspx/",
  proxyTenant: "http://localhost:4200",
  proxyUrl: "http://localhost:6969",
  webRelativeUrl: "/banmin/fdt/hipot",
  sitePared: "pared",
  urlForDownloadTest: 'http://bif1mssapp10',

  getRutaBase() {
    return "http://bif1mssapp10/banmin/fdt/hipot";
  },
  getRutaBaseApp() {
    let rutaBase = "";

    if (this.production) {
      rutaBase =
        environment.proxyTenant +
        environment.webRelativeUrl +
        environment.appPage;
    } else {
      rutaBase = environment.proxyTenant + "/";
    }

    return rutaBase;
  }
};
