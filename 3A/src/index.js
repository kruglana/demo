import express from 'express';
import cors from 'cors';
import Promise from 'bluebird';
import fetch from 'isomorphic-fetch'

const pcUrl = 'https://gist.githubusercontent.com/isuvorov/ce6b8d87983611482aac89f6d7bc0037/raw/pc.json';

const app = express();
var bodyParser = require('body-parser');
var router = express.Router();

app.use(bodyParser.json());
app.use(cors());

let pc = {};
fetch(pcUrl)
  .then(async (res) => {
    pc = await res.json();
    console.log(pc);
  })
  .catch(err => {
    console.log('ERROR', err);
  });

app.get(/^(?:task3A\/)?(.*?)(?:\/)?$/, async function(req, res) {
  let path = req.params[0];
  var paths = path.split('\/');

  if(paths[2] == 'volumes'){
    //count menory
    let result = {};
    var hdd = pc.hdd;
    const array = [];
    for(var i=0;i<hdd.length;i++){
      if (array.indexOf(hdd[i].volume) == -1){
             array.push(hdd[i].volume);
         let res= hdd[i].volume;

         result[res] = result[res] || 0;
         result[res] += hdd[i].size;
      }
      else {
         let res= hdd[i].volume;
         result[res] += hdd[i].size;
      }
    }
    for(var key in result){
      result[key] += "B";
    }
    res.status(200).json(result);
  }
  else {
    var step = pc;
    var prevStep = {};

    for(var l=2;l<paths.length;l++) {
      prevStep = paths[l];
      step = step[prevStep];

      if(((paths[l] == 'hdd')&(paths[l+1] === 'length'))||
         (step === undefined)||(((paths[l]=='length')&(l>2)))) {
        res.status(404).send('Not Found');
        break;
      }
    }
    res.status(200).json(step);
  }
});

app.listen(3000, () => {
  console.log('Your app listening on port 3000!');
});
