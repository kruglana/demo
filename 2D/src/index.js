//Краткое описание задачи
//Распознать цвет и привести его к #abcdef виду
//Полное описание задачи
//Довольно часто, разработчиком приходится работать с цветами.
//Существуем множество цветовых систем и форматов их записи.
//Клиент выполняет GET запрос с параметром Query:
//?color= и присылает цвета в разных форматах.
//Задача: привести все цвета к виду HEX виду в нижнем регистре: #123abc.
//В случае если в color находится некорректный цвет, Invalid color
//Подробнее про цвета и способы их представления можно почитать тут:
//http://www.w3schools.com/colors/colors_picker.asp

  import express from 'express';
  import cors from 'cors';

  function getHexHLSColor(color)
  {
		var h= parseInt(color[1]);
		var s= parseInt(color[2].replace(/[%]/i,''));
		var l= parseInt(color[3].replace(/[%]/i,''));

    if(h>360 || s>100 || l>100)
      return 'Invalid color';

    var r, g, b, m, c, x;

        if (!isFinite(h)) h = 0
        if (!isFinite(s)) s = 0
        if (!isFinite(l)) l = 0

        h /= 60
        if (h < 0) h = 6 - (-h % 6)
        h %= 6

        s = Math.max(0, Math.min(1, s / 100))
        l = Math.max(0, Math.min(1, l / 100))

        c = (1 - Math.abs((2 * l) - 1)) * s
        x = c * (1 - Math.abs((h % 2) - 1))

        if (h < 1) {
            r = c
            g = x
            b = 0
        } else if (h < 2) {
            r = x
            g = c
            b = 0
        } else if (h < 3) {
            r = 0
            g = c
            b = x
        } else if (h < 4) {
            r = 0
            g = x
            b = c
        } else if (h < 5) {
            r = x
            g = 0
            b = c
        } else {
            r = c
            g = 0
            b = x
        }

        m = l - c / 2
        r = Math.round((r + m) * 255)
        g = Math.round((g + m) * 255)
        b = Math.round((b + m) * 255)

      return getHexRGBColor([0,r,g,b]);
  }

  function getHexRGBColor(aRGB)
  {
    var result;
    result = '';
    for (var i=1;  i<=3; i++){
      var digital = parseInt(aRGB[i]);
      if(digital>255){
        result = 'Invalid color';
        break;
      }
      result += Math.round((aRGB[i][aRGB[i].length-1]=="%"?2.55:1)*digital).toString(16).replace(/^(.)$/,'0$1');
    }
    return result;
  }

function getHexHexColor(color)
{
  var result;
  color = color.replace(/#/,"");
  switch(color.length){
    case 3:
      color =  color.replace(/^([\dabcdef])([\dabcdef])([\dabcdef])$/i, '$1$1$2$2$3$3');
      result = color.toLowerCase();
      break;
    case 6:
      result = color.toLowerCase();
      break;
    case 5:
      color =  color.replace(/([\dabcdef])([\dabcdef])([\dabcdef])([\dabcdef])([\dabcdef])/i, '$1$2$3$4'+'0'+'$5');
      result = color.toLowerCase();
      break;
    default :
        result = 'Invalid color';
    }
    return result;
}

  function getHexColor(color)
  {
    var result;

    color = color.replace(/\s/g,"");
    color = color.replace(/([%]20)/g,"");
    var aRGB = color.match(/^rgb\((\d{1,3}[%]?),(\d{1,3}[%]?),(\d{1,3}[%]?)\)$/i);
    var aHSL = color.match(/^hsl\((\d{1,3}),(\d{1,3}[%]),(\d{1,3}[%])\)$/i);
    var hex = color.match(/[\dabcdef]/i);

    var tmp_color= color.match(/[^\da-f#]/i);

    if(tmp_color!=null && (!aRGB) && (!aHSL)){
          return('Invalid color');
    }

    if(aRGB){
        result = getHexRGBColor(aRGB);
    }
    else if(aHSL){
       result = getHexHLSColor(aHSL);
    }
    else if(hex){
      result = getHexHexColor(color);
    }
    else{
      return('Invalid color');
    }

    if(result=='Invalid color') return result;

    return ('#' + result);
  }

  const app = express();
  app.use(cors());

  app.get('/taskMy2D', (req, res) =>{
    try{
    const color = req.query.color;
    const res_color = getHexColor(color);
    res.send(res_color);
  } catch(err){
      res.send('Invalid color');
    }
  });

  app.listen(3000, () => {
    console.log('Your app listening on port 3000!');
  });
