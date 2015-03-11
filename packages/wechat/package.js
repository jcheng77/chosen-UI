Package.describe({
  summary: 'wechat support: oauth, signature, message etc',
  version: '0.0.1',
  name: 'wechat:utils'
});

Package.onUse(function(api) {
  api.versionsFrom('1.0.1');
  
  api.use('oauth2', ['client', 'server']);
  api.use('oauth', ['client', 'server']);
  api.use('http', ['server']);
  api.use('templating', 'client');
  api.use('underscore', 'server');
  api.use('random', 'client');
  api.use('service-configuration', ['client', 'server']);
  api.use('accounts-base', ['client', 'server']);
  // Export Accounts (etc) to packages using this one.
  api.imply('accounts-base', ['client', 'server']);
  api.use('accounts-oauth', ['client', 'server']);

  api.addFiles('common.js', ['client', 'server']);
  api.addFiles('client.js', 'client');
  api.addFiles('server.js', 'server');

  api.export('Wechat');
});

Npm.depends({
  'jssha': "1.5.0"
});