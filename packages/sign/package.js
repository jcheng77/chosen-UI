Package.describe({
  summary: 'sign',
  version: '0.0.1',
  name: 'wechat:sign'
});

Package.onUse(function(api) {
  api.versionsFrom('1.0.1');

  api.addFiles('sign.js', 'server');

  api.export('Wechat');
});

Npm.depends({
  'jssha': "1.5.0"
});