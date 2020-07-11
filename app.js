'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const access_token = 'EAAleLQOPIZAEBAP0y8uoAnRRpQWRDstG2oMpHpBAI0WVdzGvEeaMSttDJhMYJRMlk2dQVZASLkhsZBzHo1QLDoF4ut3bRXXmq2cxgZB6lzD3UuIrDbeLQpAl2NZAOvrzSLyqfK22q4rEIP99ZB1R4VI6odWLLKaedHezIUeADfQgZDZD'
const app = express();

app.set('port', 5000);
app.use(bodyParser.json());

app.get('/', function (req, response) {
  response.send('Hola mundo');
})

app.get('/webhook', function(req, response) {
  if (req.query['hub.verify_token'] === 'botpizza_token') {
    response.send(req.query['hub.challenge'])
  } else {
    response.send('Bot Pizza no tienes permisos.')
  }
})

function handleMessage(event){
  const senderId = event.sender.id;
  const messageText = event.message.text;
  const messageData = {
    recipient: {
      id: senderId
    },
    message: {
      text: messageText
    }
  }
  callSendApi(messageData)
}

function callSendApi(response) {
  request({
    "uri":"https://graph.facebook.com/me/messages/",
    "qs": {
      "access_token": access_token
    },
    "method": "POST",
    "json": response
  },
  function(err){
    if (err) {
      console.log("Hay un error")
    } else {
      console.log("Mensaje enviado")
    }
  }
  )
}

app.post('/webhook',  (req, res) => {
  const webhook_event = req.body.entry[0];
  if (webhook_event.messaging) {
    webhook_event.messaging.forEach(event => {
      handleMessage(event);
    })
  }
  res.status(200).send('EVENT_RECEIVED');
});

app.listen(app.get('port'), function() {
  console.log('Nuestro servidor esta funcionando en el puerto', app.get('port'));
})
