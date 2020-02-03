export const environment = {
  production: false,
  portal: '27041710-2e58-11e9-98fb-0050568775a3',
  ise_login_url: `https://10.0.20.2:8443/portal/PortalSetup.action?portal=${this.portal}`,
  ise_api_url: "https://10.0.20.2:9060/ers/config",
  allowed_origins: 'localhost:4200'
};
