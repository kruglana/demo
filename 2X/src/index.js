  import express from 'express';
  import cors from 'cors';

  const app = express();
  app.use(cors());

  app.get('/taskMy2X', (req, res) =>{
    try{
    var array = [ "1","18","243","3240","43254","577368",
      "7706988","102876480","1373243544",
      "18330699168","244686773808","3266193870720","43598688377184",
      "581975750199168","7768485393179328","103697388221736960","1384201395738071424",
      "18476969736848122368","246639261965462754048"];

    const i = req.query.i;

    const digit = parseInt(i);
    res.send(array[digit].toString());

  } catch(err){
      res.send('Invalid digit');
    }
  });

  app.listen(3000, () => {
    console.log('Your app listening on port 3000!');
  });
