var restify = require('restify');
var builder = require('botbuilder');
var request = require('request');
var cfrApi = require('./cfrApi');
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
bot.dialog('/news', newsIntent);
bot.dialog('/presention', presentationIntent);
bot.dialog('/goodbye', finishIntent);

//--------------------------Welcome-----------------------------
welcomeIntent.matches(/^Hello|Hi|Hey|Hola/i, [
    function (session, args, next) {
    	if(session.userData.name) {
    		next();
    	} else {
    		builder.Prompts.text(session, '¡Hola! ¿Cuál es tu nombre?');
    	}
    },
    function (session, results) {
        if(!session.userData.name) {
            session.userData.name = results.response;
            session.send('Mucho gusto %s.', session.userData.name); 
        } else {
            session.send('Bienvenido nuevamente %s  ', session.userData.name);
        }
        session.beginDialog('/presention');  
    }
]);

welcomeIntent.matches(/¿Cuál es tu nombre?/i, 
    function (session) {
       session.beginDialog('/presention');
    }
);

welcomeIntent.onDefault([
    function (session, args, next) {
        defaultCount++;
        session.send('No sé a qué te refieres.');
        if (defaultCount > 2){
            session.beginDialog('/menu');
        } 
    }
]);
//-------------------------------------------------------------------

//--------------------------Presentation-----------------------------
presentationIntent.onBegin(
    function(session) {
        session.send('Mi nombre es LUCI, significa Lexical Understanding Capable Intelligence por sus siglas en inglés.');
        //session.send('How can I help you?');
        session.beginDialog('/menu');
    }
);
//-------------------------------------------------------------------

//-----------------------------Menu----------------------------------
bot.dialog('/menu', [

    function (session) {
        session.send('¿Cómo te puedo ayudar hoy?');
        builder.Prompts.choice(session,'Interés:', [
            "Noticias",
            "Lotería" ,
            "Horóscopos" 
        ]);
    } ,
    function (session, results) {

       if(results.response.entity === "Noticias") {

           builder.Prompts.choice(session,'Categorías:', ["Recientes","Más Vistas"]);  

       } else if (results.response.entity == "Lottery") {
           //TODO Lottery
       } else {
           //TODO Horoscopes
       }
    },
    function (session, results) {
        //TODO request to API here
        if(results.response.entity === "Recientes") {
            //Latest
            cfrApi.fetchLatest(function(result){
                session.send(result.title + '\n' + result.url);
                
            });
       } else {
            //Trending
            cfrApi.fetchTrending(function(result){
                session.send(result.title + '\n' + result.url);
                
            });
        }
    }
]);
//-------------------------------------------------------------------

//--------------------------Goodbye----------------------------------
finishIntent.matches(/adiós|adios|bye?/i, [
    function (session) {
    	session.userData = {};
    	session.send('¡Nos vemos luego!');
        session.endDialog();
    }
]);

finishIntent.onDefault([
    function (session, args, next) {
        session.send('I\'m getting bored %s, maybe we should say goodbye', session.userData.name);
    }
]);