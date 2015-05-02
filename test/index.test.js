"use strict";

var test = require("tape");
var request = require("..");

var http = require("http");
var server = http.createServer(function (req, res) {

  var d = "";

  if (req.method === "GET") {

    res.writeHead(200);
    res.write(JSON.stringify({meth: "GET", mess: "cool"}));
    res.end();
  } else if (req.method === "POST") {


    req.on("data", function (ch) {
      d += ch;
    });
    req.on("end", function () {
      res.writeHead(302);
      res.write(JSON.stringify({meth: "POST", mess: "wow", data: d}));
      res.end();
    });

  } else if (req.method === "DELETE") {

    res.write(JSON.stringify({meth: "DELETE", mess: "no"}));
    res.end();
  } else if (req.method === "PUT") {

    res.write(JSON.stringify({meth: "PUT", mess: "woo"}));
    res.end();
  }
});

server.listen(7777, function () {

  test("GET request", function (t) {

    var opts = {
      method: "GET",
      uri: "http://0.0.0.0:7777"
    };

    request(opts, function (e, res) {

      var returned = res.body;
      t.equals(res.statusCode, 200, "200 returned");
      t.equals(returned.meth, "GET");
      t.equals(returned.mess, "cool");
      t.end();
    });


  });

  test("POST request", function (t) {

    var opts = {
      method: "POST",
      uri: "http://0.0.0.0:7777",
      body: {name: "wil"}
    };

    request(opts, function (e, res) {

      var returned = res.body;
      t.equals(res.statusCode, 302, "302 returned");
      t.equals(returned.meth, "POST");
      t.equals(returned.mess, "wow");
      t.equals(JSON.parse(returned.data).name, "wil");
      t.end();
    });
  });

  test("POST without body", function (t) {

    var opts = {
      method: "POST",
      uri: "http://0.0.0.0:7777"
    };

    request(opts, function (e, res) {

      var returned = res.body;
      t.equals(returned.meth, "POST");
      t.equals(returned.mess, "wow");
      t.end();
    });
  });

  test("PUT request", function (t) {

    var opts = {
      method: "PUT",
      uri: "http://0.0.0.0:7777",
      body: {name: "wil"}
    };

    request(opts, function (e, res) {

      var returned = res.body;
      t.equals(returned.meth, "PUT");
      t.equals(returned.mess, "woo");
      t.end();
    });
  });

  test("DELETE request", function (t) {

    var opts = {
      method: "DELETE",
      uri: "http://0.0.0.0:7777"
    };

    request(opts, function (e, res) {

      var returned = res.body;
      t.equals(returned.meth, "DELETE");
      t.equals(returned.mess, "no");
      t.end();
    });

    t.on("end", server.close.bind(server));
  });

  test("invalid request", function (t) {

    var opts = {
      method: "GOT",
      uri: "aoeu"
    };

    request(opts, function (e) {

      t.ok(e, "error returnend");
      t.end();
    });
  });

  test("invalid opts", function (t) {

    var opts = {
      methd: "GOT",
      uri: "aoeu"
    };

    request(opts, function (e) {

      t.ok(e, "error returnend");
      t.end();
    });
  });

});
