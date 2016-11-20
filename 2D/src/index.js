  import express from 'express';
  import cors from 'cors';

  function getHexRGBColor(color)
  {
    var result;

    color = color.replace(/\s/,"");
    var aRGB = color.match(/^rgb\((\d{1,3}[%]?),(\d{1,3}[%]?),(\d{1,3}[%]?)\)$/i);
    var hex = color.match(/[\dabcdef]/i);

    var tmp_color= color.match(/[^\da-f]+/i);
    if(tmp_color!=null){
          return('Invalid color');
    }

    if(aRGB)
    {
      color = '';
      for (var i=1;  i<=3; i++){
        color += Math.round((aRGB[i][aRGB[i].length-1]=="%"?2.55:1)*parseInt(aRGB[i])).toString(16).replace(/^(.)$/,'0$1');
      }
      result = color;
    }
    else if(hex){
      switch(color.length){
        case 3:
          color =  color.replace(/^#?([\dabcdef])([\dabcdef])([\dabcdef])$/i, '$1$1$2$2$3$3');
          console.log('hex = ', color);
          result = color.toLowerCase();
          break;
        case 6:
          //color = color.replace(/([\dabcdef])([\dabcdef])([\dabcdef])([\dabcdef])([\dabcdef])/i, '$1$2$3$4$5$6');;
          result = color.toLowerCase();
          break;
        case 5:
          color =  color.replace(/([\dabcdef])([\dabcdef])([\dabcdef])([\dabcdef])([\dabcdef])/i, '$1$2$3$4'+'0'+'$5');
          console.log('res5 = ', color);
          result = color.toLowerCase();
          break;
        default :
            return('Invalid color');
        }
    }
    else{
      return('Invalid color');
    }

    return ('#' + result);
  }

  const app = express();
  app.use(cors());

  app.get('/taskMy2Dkruglana', (req, res) =>{
    try{
    const color = req.query.color;
    const res_color = getHexRGBColor(color);
    console.log('color = ', res_color);
    res.send(res_color);
  } catch(err){
      res.send('Invalid color');
    }
  });

  app.listen(3000, () => {
    console.log('Your app listening on port 3000!');
  });
