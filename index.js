"use strict";


var hyperquest = require("hyperquest");


function request (opts, cb) {

  var d = "";

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

      return cb(null, JSON.parse(d));
    });

  });

  if (opts.method === "PUT" || opts.method === "POST") {

    if (opts.body) {
      r.write(JSON.stringify(opts.body));
    }
    r.end();
  }


}

module.exports = request;
