"use strict";


var hyperquest = require("hyperquest");


function request (opts, cb) {

  var d = "";
  var returned = {};

  if (!opts.method || !opts.uri) {
    return cb("usage: request(opts, cb)");
  }

  var r = hyperquest(opts, function (e, re) {

    if (e) {
      return cb("error sending request");
    }
    re.on("data", function (ch) {

      d += ch;
    });
    re.on("end", function () {

      returned.body = JSON.parse(d);
      return cb(null, returned);
    });

  });

  r.on("response", function (re) {

    returned.headers = re.headers;
    returned.statusCode = re.statusCode;
  });
  if (opts.method === "PUT" || opts.method === "POST") {

    if (opts.body) {
      r.write(JSON.stringify(opts.body));
    }
    r.end();
  }


}

module.exports = request;
