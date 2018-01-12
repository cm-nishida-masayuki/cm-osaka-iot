'use strict';
var Alexa = require('alexa-sdk');

var APP_ID = undefined;

var SKILL_NAME = "Check final leaving of office.";
var GET_FACT_MESSAGE = "最終退出者として登録するお名前を教えてください";
var HELP_MESSAGE = "終わりたい時は「おしまい」と言ってください。どうしますか？";
var HELP_REPROMPT = "どうしますか？";
var STOP_MESSAGE = "さようなら";

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
        var speechOutput = GET_FACT_MESSAGE ;
        this.emit(':ask', speechOutput, SKILL_NAME);
        this.emit('EmployeeIntent');
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
        this.emit(':tell', message);
        console.log(message);
    }
};
