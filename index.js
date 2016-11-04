var config = {
  firefoxProfileDir: process.env.firefox_profile_dir,
  outDir: process.env.outdir || __dirname
};
var Promise = require('bluebird');

module.exports = Promise.resolve().then(() => {
    if (!config.firefoxProfileDir)
      throw 'Missing ENV: firefox_profile_dir'; 
  }).then(() => new(require('firefox-profile'))({
    profileDirectory: config.firefoxProfileDir
  }))
  .then(fp => new Promise(function(resolve, reject) {
    fp.setAcceptUntrustedCerts(true);
    fp.setAssumeUntrustedCertIssuer(true);
    fp.setPreference('security.default_personal_cert','Select Automatically');
    fp.encoded(function(firefoxProfile) {
      Promise.promisify(require('mkdirp'))(config.outDir)
        .then(() => Promise.promisify(require('fs').writeFile)(
          require('path').join(config.outDir,'firefox-profile.js'),
          'module.exports="'+firefoxProfile+'";'
        )).then(resolve).catch(console.log);
    });
  }));
