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
var rankMessage=``;
players={
	
}
games={
	
}
var sortedPlayersArray = [];

function sortPlayers() {
	// convert players to array[]
	var playersArray = Object.keys(players).map(function (key) {
		return [key, players[key]];
	});
	playersArray.sort(function (a, b) {
		return b[1].score-a[1].score
	});
		sortedPlayersArray = playersArray

	return playersArray
};
function updateRankMessage(){
	rankMessage="";
	for (var i =0; i<sortedPlayersArray.length;i++) {
		var x = i;
		var j=x+1
		if (sortedPlayersArray[i][1].score == sortedPlayersArray[0][1].score){
			sortedPlayersArray[i][1].special = "🏅"
		}else{
			sortedPlayersArray[i][1].special = ""
		}
		if(j!=1){
			var count=1
			while (j!=1&&count<sortedPlayersArray.length) {
				if (sortedPlayersArray[x][1].score == sortedPlayersArray[x - count][1].score){
					count++;
					
				}else{
					break;
				}
				j--;
			}
		} 
		rankMessage += `**${j}.** ${sortedPlayersArray[i][1].special} <@${sortedPlayersArray[i][0]}>: \`${sortedPlayersArray[i][1].score}\`\n`;
	}
} 
function updateRank(results){
	// really simple thing
	// takes array: [ [user0,score0], [user1, score1] ]
	console.log("updating rank for: ");
	console.log(results);
	if (!players[results[0][0].id]){
		players[results[0][0].id]={score:1000}
	}
	if (!players[results[1][0].id]) {
		players[results[1][0].id] = {score: 1000}
	}
	if (results[0][1] == results[1][1]){

	}else{
		players[results[0][0].id].score += (parseInt(results[0][1]) - parseInt(results[1][1]))*2;
		players[results[1][0].id].score -= (parseInt(results[0][1]) - parseInt(results[1][1]))*2;
		if (results[0][1] > results[1][1]){
			players[results[0][0].id].score += 5
			players[results[0][0].id].score -= 5
		} else if (results[0][1] < results[1][1]){
			players[results[1][0].id].score += 5
			players[results[1][1].id].score -= 5
		}
	}
}

bot.on("ready", function(){
	// bot.user.setAvatar("https://vignette.wikia.nocookie.net/clashroyale/images/7/76/Gg.png/revision/latest?cb=20160719200117");
	// bot.user.setPresence({ game: { name: '!elo about', type: 0 } });
	bot.user.setGame("!elo about")
})
bot.on("message", function (message) {
	// if(message.content=="bleep"){
	// 	message.channel.sendMessage("bloop");
	// }
	var prefix="!elo";
	var command;
	if (message.content.toLowerCase().startsWith(prefix) && !message.author.bot && message.channel.id =="387023805140303872"){
		command=message.content.slice(prefix.length+1).toLowerCase();
	

	switch (command) {
		case "about":
			message.channel.send(new Discord.RichEmbed({
				color: 3447003,
				thumbnail: {
					url: bot.user.avatarURL
				},
				title: "Clash Royale Elo Bot",
				description: "This is an elo rankings bot coded by <@232215051052908545>.\n Prefix is `!elo`. Try `!elo help` for commands.",
				
			}));

			break;
		case "help":
			message.channel.send(new Discord.RichEmbed({
				color: 3447003,
				thumbnail:{
					url:bot.user.avatarURL
				},
				title: "Clash Royale Elo Bot: Help",
				description: "This bot lets you record the score in best-of-3 games against your opponent.",
				fields:[
					{
						name: "Core commands",
						value: "• `!elo @you @opponent yourscore:opponentscore`\n (e.g. !elo <@232215051052908545> <@312027665408196628> 2:1)\n\n • `!elo rankings`"
					},
					{
						name: "Moderator commands",
						value: "• `!elo reset`"
					},
					{
						name: "Other commands",
						value: "• `!elo about`\n• `!elo help`"
					}
				]
			}));
			break;
		case "rankings":
			sortPlayers();
			updateRankMessage();
			
			message.channel.send(new Discord.RichEmbed({
					color: 3447003,
					thumbnail: {
						url: "http://vignette1.wikia.nocookie.net/clashroyale/images/7/7c/LegendTrophy.png/revision/latest?cb=20160305151655"
					},
					title: "Clan Rankings",
					description: rankMessage,
					
				})

			);
			break;
		case "reset":
			if (message.author.id == "232215051052908545" || message.author.id == "291118393099157505") {
			// console.log("yes1")
			sortPlayers();
			updateRankMessage();
			message.channel.send(new Discord.RichEmbed({
				thumbnail: {
					url: "http://vignette1.wikia.nocookie.net/clashroyale/images/7/7c/LegendTrophy.png/revision/latest?cb=20160305151655"
				},
				color: 3447003,
				title: "Clan Rankings have been reset.",
				description: `Final rank: \n${rankMessage}`,

			})

			);

			players = {

			}
		} else {
			// console.log("no")
		}
		break;
		default:
		
			break;
	}
	var mentionsArray=[];
	mentionsArray=message.mentions.users.array();
		var usersArray = message.channel.members.array()
		// if (usersArray.includes(mentionsArray[0].id.toString)){
		// 	console.log(true);
		// }else{
		// 	console.log(false)
		// }
		// console.log(mentionsArray[0].id)
		// console.log(mentionsArray)
		
		if (mentionsArray.length == 1 /*&& (mentionsArray[1].id == message.author.id||mentionsArray[0].id==message.author.id)/* && message.channel.members[mentionsArray[0].id] && message.channel.members[mentionsArray[1].id]*/){
			// console.log("yes2")
			var anyIsBot=false;
			for(var i in mentionsArray){
				if(mentionsArray[i].bot){
					anyIsBot=true;
					// console.log('bot')
				}
			}
		if(!anyIsBot){
			var scores=command.split(" ");
			// scores = command.slice(mentionsArray[0].id.length+mentionsArray[1].id.length+8);
			var scoresArray=scores[1].split(":");
			scoresArray=[parseInt(scoresArray[0]), parseInt(scoresArray[1])]
			// [ [user1,score1], [user2, score2] ]
			var resultsArray = [
				[message.member, scoresArray[0]],[mentionsArray[0], scoresArray[1]]
			];
			// console.log("ok")
			if (resultsArray[0][1] >= 0 && resultsArray[1][1] >= 0 && resultsArray[0][1] + resultsArray[1][1]<=3){
				// console.log("yes3")
				updateRank(resultsArray);
				message.channel.send(new Discord.RichEmbed(
					{
						color: 3447003,
						title: "Scores updated!",
						description: `${resultsArray[0][0]}:ƒs ${players[resultsArray[0][0].id].score}\n${resultsArray[1][0]}: ${players[resultsArray[1][0].id].score}`,
						footer:{
							// text: "This can be cancelled by one of the players by pressing the 🚫 reaction below. "
						}
					}
				));
				toSendEmbed=true;
				games[message.id]=resultsArray;
			}else{
				// error: not a bo3 game
				message.channel.send(new Discord.RichEmbed({
					color: 3447003,
					title: "Something went wrong.",
					description: `Maybe you formatted the message wrong, or mentioned the wrong players. Try again.`,
					footer: {
						// text: "This can be cancelled by one of the players by pressing the 🚫 reaction below. "
					}
				}));
			}

		} else {
			// console.log("na")
		}
		// reactions can be the confirmation

	}
	}
	// if(toSendEmbed&&message.author.id==bot.user.id){
		
	// 	message.react("🚫")

	// 	toSendEmbed=false;
	// 	// updateRank([[results[0][0],results[1][1]],[[results[1][0],results[0][1]]]);
	// } 	
});

bot.login(process.env.BOT_TOKEN);
