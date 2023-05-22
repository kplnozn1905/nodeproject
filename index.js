'use strict';
const express = require('express');
const bodyParser=require("body-parser");
const cors = require('cors');
const app = express();
const port = 3000;
const path=require('path');
const mqtt = require('mqtt');
const client  = mqtt.connect('mqtt://91.121.93.94:1883');
const mongoose=require('mongoose');
const User=require('./models/User');
const msg="on1";
var tempe;
var humdt;
var datas;

app.set('view engine','ejs');
app.use(express.static('public'));

mongoose.connection.on('open', ()=>{
  console.log("MongoDB Connected!!!");
});
mongoose.connection.on('error',(err)=>{
  console.log("MongoDB error *XXXXX*",err);
})
client.on('connect', function () {
  mongoose.connect('mongodb://127.0.0.1:27017/tempp',{ useNewUrlParser: true, useUnifiedTopology: true });

  client.publish('ledfan', msg);
  client.subscribe('temperature', function (err) {});
  //client.subscribe('temperature_fahrenheit', function (err) {});
  client.subscribe('humidity', function (err) {});
  
  
})



client.on('message', function (topic, message) {
    // message is Buffer
    console.log(topic.toString()+":"+message.toString())
    let data=message.toString();
    data =JSON.parse(data);
    let values=parseInt(message.toString());
    var topic1=topic.toString();
    const user=new User({
      title: topic1,
      value: values
  });
  
  console.log(user);
  if(topic1=="temperature"){
    tempe=values;
  }
  else{humdt=values; }
  user.save();
  
})
User.find({title:"temperature"},{publishedAt:1,value:1,_id:0}).sort({ _id: -1 }).limit(5).then(data=>{
  console.log(data); 
  datas=data;
}).catch((err)=>{
  console.log(err);
})

app.get('/',(req,res)=> {

   
  res.render('index',{temp:tempe,humd:humdt,data:datas});

})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

