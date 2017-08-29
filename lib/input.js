/**
 * Input client
 */

'use strict';

/**
 * Module dependencies.
 */

var LogStream = require('./log_stream').LogStream;
var middleware = require('./middleware');
var utils = require('./utils');

/**
 * Initialize a new `Input` client.
 */

function Input(jenkins) {
  this.jenkins = jenkins;
}

/**
 * Object meta
 */

Input.meta = {};

/**
 * Submit input
 */

Input.prototype.submit = function(opts, callback) {
  this.jenkins._log(['debug', 'input', 'submit'], opts);

  var req = { name: 'input.submit' };

  utils.options(req, opts);

  try {
    var folder = utils.FolderPath(opts.name);

    if (folder.isEmpty()) throw new Error('name required');
    if (!opts.number) throw new Error('number required');
    req.path = '{folder}/{number}/input/{input}/proceedEmpty';
    req.params = {
      folder: folder.path(),
      number: opts.number,
      input: opts.input
    };
  } catch (err) {
    return callback(this.jenkins._err(err, req));
  }

  return this.jenkins._post(
    req,
    middleware.notFound(opts.name + ' ' + opts.number),
    middleware.require302('failed to submit: ' + opts.name),
    middleware.empty,
    callback
  );
};


/**
 * Module exports.
 */

exports.Input = Input;
