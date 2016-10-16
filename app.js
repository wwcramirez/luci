var restify = require('restify');
var builder = require('botbuilder');
var request = require('request');

//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
  
// Create chat bot
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

//=========================================================
// Bots Dialogs
//=========================================================

var welcomeIntent = new builder.IntentDialog();
var presentationIntent = new builder.IntentDialog();
var finishIntent = new builder.IntentDialog();
var menuIntent = new builder.IntentDialog();

var defaultCount = 0;

bot.dialog('/', welcomeIntent);
bot.dialog('/menu', menuIntent);
bot.dialog('/presention', presentationIntent);
bot.dialog('/goodbye', finishIntent);

//--------------------------Welcome-----------------------------
welcomeIntent.matches(/^Hello|Hi|Hey/i, [
    function (session, args, next) {
    	if(session.userData.name) {
    		next();
    	} else {
    		builder.Prompts.text(session, 'Hey! What is your name?');
    	}
    },
    function (session, results) {
        if(!session.userData.name) {
            session.userData.name = results.response;
        } 
        
            session.send('Nice to meet you %s  ', session.userData.name); 
            session.beginDialog('/presention');  
    }
]);

welcomeIntent.matches(/What\'s|What is your name?/i, 
    function (session) {
       //session.send('My name is LUCI, it stands for Lexical Understanding Capable Intelligence.');
       session.beginDialog('/presention');
    }
);

welcomeIntent.onDefault([
    function (session, args, next) {
        defaultCount++;
        session.send('I don\'t quite get you.');
        session.send('This is what can I do: ');
        if (count > 2){
            session.beginDialog('/goodbye');
        } 
    }
]);
//-------------------------------------------------------------------

//--------------------------Presentation-----------------------------
presentationIntent.onBegin(
    function(session) {
        session.send('My name is LUCI, it stands for Lexical Understanding Capable Intelligence.');
        //session.send('How can I help you?');
        session.beginDialog('/menu');
    }
);
//-------------------------------------------------------------------

//-----------------------------Menu----------------------------------
menuIntent.onBegin([
    function(session, next) {
        session.send('How can I help you today?', session.userData.name);
        builder.Prompts.choice(session, ["News","Lottery","Horoscopes"]);
        next();
    }, 
    function(session, results) {
       if(results.response === "News") {
           builder.Prompts.choice(session, ["Latests","Trending"]);
           next();
       } else {

       }
    },
    function (session, results) {
        //TODO request to API here
    }
]);
//-------------------------------------------------------------------

//--------------------------Goodbye-----------------------------
finishIntent.matches(/bye?/i, [
    function (session) {
    	session.userData = {};
    	session.send('Goodbye!');
        session.endDialog();
    }
]);

finishIntent.onDefault([
    function (session, args, next) {
        session.send('I\'m getting bored %s, maybe we should say goodbye', session.userData.name);
    }
]);