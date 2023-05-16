var axios = require('axios');
var express=require('express')
var app=express()
var cors = require('cors')
app.use(cors())



app.post('/postitems', async (req, res) => {
try {
    data = req.body.title
    var abc = await Response(data)
    res.send(abc)
    }
    catch (err) {
    console.log(err)
    }
    })


    var config = {
            method: 'post',
            url: 'https://api.openai.com/v1/chat/completions',
            headers: { 
              'Authorization': 'Bearer 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', 
              'Content-Type': 'application/json'
            },
            data : data
          };
        
          axios(config)
          .then(async function (response) {
             resultdata.push(JSON.stringify(response.data))
            res.send(resultdata)
          })
          .catch(function (error) {
            console.log(error);
          });  
    
    app.listen(8081)