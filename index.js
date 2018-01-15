'use strict';
var Alexa = require('alexa-sdk');
var AWS = require('aws-sdk');
var moment = require('moment-timezone');
moment.tz.setDefault("Asia/Tokyo");

var APP_ID = undefined;
var HELP_MESSAGE = "終わりたい時は「おしまい」と言ってください。どうしますか？";
var HELP_REPROMPT = "どうしますか？";
var STOP_MESSAGE = "さようなら";

var s3 = new AWS.S3();
var dstBucket = process.env.S3_BUCKET_NAME;

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.APP_ID = process.env.ALEXA_APPLICATION_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
    'LaunchRequest': function () {
        this.emit('GetNewFactIntent');
    },
    'GetNewFactIntent': function () {
        if (this.event.request.dialogState !== 'COMPLETED'){
            this.emit(':delegate');
        } else {
            this.emit('EmployeeIntent');
        }
    },
    'AMAZON.HelpIntent': function () {
        var speechOutput = HELP_MESSAGE;
        var reprompt = HELP_REPROMPT;
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', STOP_MESSAGE);
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', STOP_MESSAGE);
    },
    'EmployeeIntent': function () {
        var employee = this.event.request.intent.slots.Employee.value;
        var message = employee + 'さん、お疲れ様でした';
        var now = moment();
        var dstKey = now.format("YYYY/MM/DD/HH-mm-ss");
        var data = {
          date: now.format(),
          employee
        };
        var self = this;

        var params = {
          Bucket: dstBucket,
          Key: dstKey,
          Body: JSON.stringify(data),
          ContentType: 'application/json'
        };

        s3.putObject(params, function(err) {
          if(err){
            console.log(err);
          }else{
            console.log(params);
            self.emit(':tell', message);
          }
        });
    }
};
