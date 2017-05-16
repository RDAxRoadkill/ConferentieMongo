'use strict';

/* jshint node: true */

var fs         = require('fs');
var os         = require('os');
var nodemailer = require('nodemailer');
var rimraf     = require('rimraf');
var config     = require('../config');
var dropbox    = require('../lib/dropbox-sync');
var mysql      = require('../lib/mysql-backup');
var tarball    = require('../lib/tarball');
var transport  = nodemailer.createTransport('sendmail');

// This is the FILE name of the backup file
var backupFilename  = config.dropbox.mysql_prefix + 'backup-' + Date.now();

// This is the absolute file path to save the file to on Dropbox
var dropboxFilename = ['', config.server, config.dropbox.mysql_folder, backupFilename].join('/');

// Connect to Dropbox with our credentials
try {
  dropbox.connect({
    key: config.dropbox.key,
    secret: config.dropbox.secret
  });
} catch (err) {
  failWithDropboxError(err);
}

// Connect to MySQL with our credentials
try {
  mysql.connect({
    host: config.mysql.hostname,
    user: config.mysql.username,
    password: config.mysql.password
  });
} catch (err) {
  failWithMySQLError(err);
}

// Generate a MYSQL backup
mysql.backup(backupFilename, function (err, pathname, stats) {
  if (err) {
    return failWithMySQLError(err);
  }

  tarball.create(pathname, '/tmp/' + backupFilename + '.tar.gz', function (code) {
    rimraf.sync(pathname);

    dropbox.send('/tmp/' + backupFilename + '.tar.gz', dropboxFilename, function (err, response) {
      fs.unlinkSync('/tmp/' + backupFilename + '.tar.gz');

      if (err) {
        failWithDropboxError(err);
      } else {
        console.log(response);
        console.log('The MySQL backup has been completed successfully.\n');
        console.log('Backed up %d from %d databases.\n', stats.tables, stats.databases);
        console.log('The backup file has been saved to your Dropbox: %s', '');
      }
    });
  });
});

function failWithMySQLError (err) {
  console.error('The MySQL backup job has encountered a fatal error and could not continue.\n');
  console.error('We were unable to create the MySQL backup.\n');
  console.error(err);

  process.exit(1);
};

function failWithDropboxError (err) {
  console.error('The MySQL backup job has encountered a fatal error and could not continue.\n');
  console.error('We were unable to sync the MySQL backup to Dropbox.\n')
  console.error(err);

  process.exit(1);
};