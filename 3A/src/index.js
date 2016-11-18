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
    console.log('Чтото пошло не так:', err);
  });

let paths = [];
app.get(/^(?:task3A\/)?(.*?)(?:\/)?$/, async function(req, res) {
    let path = req.params[0];
    var paths = path.split('\/');
    var ex1 = pc;
    var valu = {};
    console.log(paths.length);

    if(paths[2] == 'volumes'){
        //count
        var hdd = pc.hdd;
        console.log("length = ",hdd.length);
        let keys= [];
        let map = [];
        keys[0] = hdd[0].volume;
        map[0] = hdd[0].size;
        for(var i=1;i<hdd.length;i++){
          var j;
          for(j=keys.length-1; j>=0; j-- )
          {
            if(keys[j]==hdd[i].volume){
              map[j] = map[j] + hdd[i].size;
              break;
            }
          }
          if(j<0){
            var t = map.length;
            keys[t]= hdd[i].volume;
            map[t] = hdd[i].size;
          }
        }
          var answerr1="";
        for(var i=0;i<keys.length;i++){
          if(i>0){
            answerr1 += ",";
          }
          answerr1 += "\"" + keys[i] + "\"" + ":" + "\"" + map[i] +"\"";
        }
        console.log("   =>  ", answerr1);
        var jssponO = JSON.stringify(answerr1);
        var revert = JSON.parse(jssponO);
        console.log("   =>  ", revert);
        res.status(200).json(revert);
    }
    else {
      for(var i=2;i<paths.length;i++) {
          valu = paths[i];
          ex1 = ex1[valu];
          if(ex1 === undefined) {
            var answered = '- Status 404' +'\n' +'Not found'
            res.status(404).send(answered);
          }
        }
      console.log(valu , "   =>  ", ex1);
      res.status(200).json(ex1);
    }

    });

app.listen(3000, () => {
  console.log('Your app listening on port 3000!');
});
