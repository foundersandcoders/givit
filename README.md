# givit
make HTTP requests - built ontop of hyperquest

```
var request = require("givit");

var opts = {
  method: "GET",
  uri: "http://www.skurp.wurp"
};

request(opts, function (e, r) {

  if (r.statusCode === 200) {
    console.log("Woop de doop:", r.body);
  }
});
```
