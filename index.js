var axios = require('axios');
var express=require('express')
var app=express()
var resultdata=[];
app.post('/getdata',(req,res)=>
{
  var data = JSON.stringify({
    "model": "gpt-3.5-turbo",
    "messages": [
      {
        "role": "user",
        "content": "india flag has how many colors?"
      }]
  });
  
  
  let obj = JSON.parse(data);
  console.log(obj.messages)
  
  var config = {
    method: 'post',
    url: 'https://api.openai.com/v1/chat/completions',
    headers: { 
      'Authorization': 'Bearer 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', 
      'Content-Type': 'application/json'
    },
    data : data
  };
  console.log()
  axios(config)
  .then(function (response) {
    console.log(JSON.stringify(response.data));
    resultdata.push(response.data)
  })
  .catch(function (error) {
    console.log(error);
  });
  console.log("ok")
  console.log(resultdata)
  res.send(resultdata)
})
app.listen(8080)