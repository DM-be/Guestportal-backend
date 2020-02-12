export const environment = {
  portal: process.env.PORTAL,
  ise_ip: process.env.ISE_IP,
  ise_login_url: `https://${this.ise_ip}:8443/portal/PortalSetup.action?portal=${this.portal}`,
  ise_api_url: `https://${this.ise_ip}:9060/ers/config`,
  mongo_ip_port: process.env.MONGO_IP_PORT || 'localhost:27020',
  allowed_origins:  process.env.ALLOWED_ORIGINS || 'localhost:4200'
};


/*
 mongo_ip_port: 'localhost:27020'

export const environment = {
  production: false,
  portal: '27041710-2e58-11e9-98fb-0050568775a3',
  ise_login_url: `https://10.0.20.2:8443/portal/PortalSetup.action?portal=${this.portal}`,
  ise_api_url: "https://10.0.20.2:9060/ers/config",
  allowed_origins: 'localhost:4200'
};




*/

