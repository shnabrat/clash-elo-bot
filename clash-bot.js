/*addding to server:
https://discordapp.com/oauth2/authorize?client_id=380885450002530312&scope=bot&permissions=0
*/

/*
TODO: error checking (inputs are numbers, within range, etc.) (√)
Bots can't play (√)
User must be one of the players (√)
reset feature (√)
cancel feature using .createReactionCollector()

people outside the server can't be in a game (idk)

*/
var Discord = require("discord.js");
var fs = require("fs");
var bot = new Discord.Client();
var toSendEmbed=false;
/*
users array is like

players{
	"player's id here": {
		"score: ""player's score here"
	}
}
*/


bot.on("message", function (message) {
	if(message.content=="bleep"){
		message.channel.sendMessage("bloop");
	 }
	
});

bot.login(process.env.BOT_TOKEN);
