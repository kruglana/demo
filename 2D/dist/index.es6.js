import express from 'express';
import cors from 'cors';

var app = express();
app.use(cors());

app.get('/taskMy', function (req, res) {
  var summary = (+req.query.a || 0) + (+req.query.b || 0);
  res.send(summary.toString());
});

app.listen(3000, function () {
  console.log('Your app listening on port 3000!');
});
//# sourceMappingURL=index.es6.js.map
