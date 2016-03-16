#!/usr/bin/env node

(function () {

  'use strict';


  // DATABASE

  var Cloudant = require('cloudant');

  var CLOUDANT_USERNAME = process.env.CLOUDANT_USERNAME;
  var CLOUDANT_TEST_USERNAME = process.env.CLOUDANT_TEST_USERNAME;
  var CLOUDANT_TEST_PASSWORD = process.env.CLOUDANT_TEST_PASSWORD;

  var cloudant = Cloudant({
    account: CLOUDANT_USERNAME,
    username: CLOUDANT_TEST_USERNAME,
    password: CLOUDANT_TEST_PASSWORD,
  });

  var db = cloudant.db.use('punch');
  var punchDataDoc = 'punch-data';


  // REQUIREMENTS

  var fs = require('fs');
  var open = require('open');
  var Promise = require('bluebird');
  var pkg = require(__dirname + '/package.json');
  var program = require('commander');


  // Always save data to punchfile
  var punchDataFile = __dirname + '/punch.json.js';


  // ARGUMENTS

  program
    .version(pkg.version)
    .description(pkg.description)
    .arguments('punch [type] [note] [time]')
    .option('-v, --verbose', 'Turn on verbose messages', false)
    .action(go);

  program.parse(process.argv);


  // INITIALIZATION

  var veteran;

  function go (type, note, time) {
    switch (type) {
      case 'open':
        openDataFile();
        break;
      case 'read':
        readDatabase();
        break;
      default:
        createRecord(type, note, time)
          .then(writeToFile)
          .then(writeToDatabase)
          .catch(function (reason) {
            throw ('- ' +reason);
          });
        break;
    }

    veteran = true;
  }

  if (!veteran) {
    console.warn('Punch: No arguments provided!');
    program.outputHelp();
  }


  // PUNCH TIME OPERATIONS

  function createRecord(type, note, time) {
    return new Promise(function (res, rej) {

      var now = new Date();

      var record = {

        type: type || null,
        note: note || null,

        timestamp: now.valueOf(),
        datestring: now.toString(),

        // Probably overkill
        //date: {
          //yr: now.getFullYear(),
          //mh: now.getMonth(),
          //dy: now.getDate(),
          //hr: now.getHours(),
          //me: now.getMinutes(),
          //sd: now.getSeconds()
        //}

      };

      if (program.verbose) {
        console.log(record);
      }

      console.log(record.datestring);

      res(record);
    });
  }

  function openDataFile () {
    open(punchDataFile);
  }

  function writeToFile (record) {
    return new Promise (function (resolve, reject) {
      fs.appendFile(punchDataFile, JSON.stringify(record) + '\n', function (err) {
        if (err) {
          return reject(err);
        }

        console.log('Time punched to local file');
        resolve(record);
      });
    });
  }

  function readDatabase () {
    console.log('readDatabase');

    db.get(punchDataDoc, {revs_info: true}, function (err, doc) {
      if (err) {
        throw 'Could not read remote database';
      }

      console.log(JSON.stringify(doc.entries));
    });
  }

  function writeToDatabase (record) {
    return new Promise(function (resolve, reject) {

      db.get(punchDataDoc, {revs_info: true}, function (err, doc) {
        if (err) {
          return reject('Could not read remote database');
        }

        doc.entries[record.timestamp] = record;

        db.insert(doc, doc.id, function (err, doc) {
          if (err) {
            return reject('Could not write remote database');
          }

          console.log('Time punched to remote database');
          resolve(record);
        });
      });
    });
  }

})();
