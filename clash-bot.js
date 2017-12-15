/*addding to server:
https://discordapp.com/oauth2/authorize?client_id=380885450002530312&scope=bot&permissions=0
*/

/*
TODO: 
- make all admins able to use all admin commands (√)
- admin ability: reset a single player's score (√)
- cancel feature using .createReactionCollector(√)


error checking (inputs are numbers, within range, etc.) (√)
Bots can't play (√)
User must be one of the players (√)
reset feature (√)

people outside the server can't be in a game (idk if it's necessary, you can only mention people in server anyway)

*/
var Discord = require("discord.js");
var fs = require("fs");
var bot = new Discord.Client();
var tosendconfirm=false;
var tosendcancel = false;

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
games=[]
var sortedPlayersArray = [];
var bans=[];
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
function remove(array, element) {
	const index = array.indexOf(element);

	if (index !== -1) {
		array.splice(index, 1);
	}
}
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
var resultsArray=[];
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
			players[results[1][0].id].score -= 5
		} else if (results[0][1] < results[1][1]){
			players[results[1][0].id].score += 5
			players[results[0][0].id].score -= 5
		}
	}
}
function undoRank(results) {
	// really simple thing
	// takes array: [ [user0,score0], [user1, score1] ]
	console.log("undoing rank for: ");
	console.log(results);
	if (!players[results[0][0].id] || !players[results[1][0].id]) {
	}else{
		
		if (results[0][1] == results[1][1]) {

		} else {
			players[results[0][0].id].score -= (parseInt(results[0][1]) - parseInt(results[1][1])) * 2;
			players[results[1][0].id].score += (parseInt(results[0][1]) - parseInt(results[1][1])) * 2;
			if (results[0][1] < results[1][1]) {
				players[results[0][0].id].score += 5
				players[results[1][0].id].score -= 5
			} else if (results[0][1] > results[1][1]) {
				players[results[1][0].id].score += 5
				players[results[0][0].id].score -= 5
			}
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
				description: "This bot lets you record the score in games (up to 5 points) against your opponent.",
				fields:[
					{
						name: "Core commands",
						value: "• `!elo @opponent yourscore:opponentscore`\n (e.g. !elo <@232215051052908545> 2:1)\n\n • `!elo rankings` – to view rankings"
					},
					{
						name: "Moderator commands",
						value: "• `!elo reset` – reset all scores and display final results\n•`!elo ban @user` – prevent user from participating\n•`!elo unban @user`\n•`!elo resetuser @user` – remove user from rankings"
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
			if (/*message.author.id == "232215051052908545" || message.author.id == "291118393099157505"*/message.member.roles.find("name", "Admin")) {
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
			var toPin=true;
			players = {

			}
			games={

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
		
		if (mentionsArray.length == 1 &&mentionsArray[0].id!=message.author.id/*&& (mentionsArray[1].id == message.author.id||mentionsArray[0].id==message.author.id)/* && message.channel.members[mentionsArray[0].id] && message.channel.members[mentionsArray[1].id]*/){
			if (command.startsWith("ban") && (/*message.author.id == "232215051052908545" || message.author.id == "291118393099157505"*/message.member.roles.find("name", "Admin"))){
				bans.push(mentionsArray[0]);
				message.channel.send(new Discord.RichEmbed({
					color: 16711680,
					title: "User banned",
					thumbnail: {
						url: "https://vignette.wikia.nocookie.net/clashroyale/images/a/ab/Angry_Face.png"
					},
					description: `<@${mentionsArray[0].id}> has been a naughty child.`,
					footer: {
						text: "This can be cancelled by an admin with !elo unban @user. "
					}
				}));
			} else if (command.startsWith("unban") && (/*message.author.id == "232215051052908545" || message.author.id == "291118393099157505"*/message.member.roles.find("name", "Admin"))) {
				remove(bans, (mentionsArray[0]));
				message.channel.send(new Discord.RichEmbed({
					color: 16711680,
					title: "User unbanned",
					description: `<@${mentionsArray[0].id}> has been forgiven for their heinous crimes.`,
					footer: {
						// text: "This can be cancelled by one of the players by pressing the 🚫 reaction below. "
					}
				}));
			} else if (command.startsWith("resetuser") && (/*message.author.id == "232215051052908545" || message.author.id == "291118393099157505"*/message.member.roles.find("name", "Admin"))) {
				remove(bans, (mentionsArray[0]));
				message.channel.send(new Discord.RichEmbed({
					color: 16711680,
					title: "User reset",
					thumbnail: {
						url: "https://vignette.wikia.nocookie.net/clashroyale/images/a/ab/Angry_Face.png"
					},
					description: `<@${mentionsArray[0].id}>'s score has been reset`,
					footer: {
						// text: "This can be cancelled by one of the players by pressing the 🚫 reaction below. "
					}
					
				}));
				delete players[mentionsArray[0].id];
			}else{
				if(bans.includes(message.author)){
					message.channel.send(new Discord.RichEmbed({
						color: 16711680,
						title: "You're banned",
						description: `<@${message.author.id}> cannot set scores.`,
						footer: {
							// text: "This can be cancelled by one of the players by pressing the 🚫 reaction below. "
						}
					}));
				}else{
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
				resultsArray = [
					[message.author, scoresArray[0]],[mentionsArray[0], scoresArray[1]]
				];
				// console.log("ok")
				if (resultsArray[0][1] >= 0 && resultsArray[1][1] >= 0 && resultsArray[0][1] <= 5 && resultsArray[1][1] <= 5 /*resultsArray[0][1] + resultsArray[1][1]<=3*/){
					// console.log("yes3")
					if (message.member.roles.find("name", "Admin") || message.member.roles.find("name", "2Fresh-PRO")) {
						updateRank(resultsArray);
						message.channel.send(new Discord.RichEmbed(
							{
								color: 3447003,
								title: "Scores updated!",
								description: `${resultsArray[0][0]}: ${players[resultsArray[0][0].id].score}\n${resultsArray[1][0]}: ${players[resultsArray[1][0].id].score}`,
								footer:{
									text: "This can be cancelled by one of the players or an admin by pressing the 🚫 reaction below. "
								}
							}
						));
						tosendcancel=true;
					}else{
						message.channel.send(new Discord.RichEmbed(
							{
								color: 16763904,
								title: "Score pending",
								description: `**Game:** \n${resultsArray[0][0]} vs. ${resultsArray[0][0]}\n Score: ${resultsArray[0][1]}:${resultsArray[1][1]}`,
								footer: {
									text: "This must be confirmed by a pro player or admin by pressing the ✅ reaction below. \nThis can be cancelled by one of the players or an admin by pressing the 🚫 reaction below. "
								}
							}
						));
						tosendconfirm=true;
						tosendcancel=true;
					}
				}else{
					// error: not a bo3 game
					message.channel.send(new Discord.RichEmbed({
						color: 3447003,
						title: "Something went wrong.",
						description: `Maybe you formatted the message wrong, or mentioned the wrong players. Try again.\n Note: Only games up to 5 points each are allowed.`,
						footer: {
							// text: "This can be cancelled by one of the players by pressing the 🚫 reaction below. "
						}
					}));
				}
			
		} else {
			// console.log("na")
		}}
		// reactions can be the confirmation
	}
	}
	}
	if(tosendcancel&&message.author.id==bot.user.id){
		
		message.react("🚫")
		games[message.id] = resultsArray;
		tosendcancel=false;
		// updateRank([[results[0][0],results[1][1]],[[results[1][0],results[0][1]]]);
	} 
	if (tosendconfirm && message.author.id == bot.user.id) {

		message.react("✅")
		games[message.id] = resultsArray;
		tosendconfirm = false;
		// updateRank([[results[0][0],results[1][1]],[[results[1][0],results[0][1]]]);
	} 
	if(message.author.id==bot.user.id){
		if(toPin){
			message.pin();
		}
	}	
});
bot.on("messageReactionAdd",function(messageReaction, user){
		// console.log("reacted")
		// console.log(`games object is:`);
		// console.log(games);
		// console.log(messageReaction)
	if (games[messageReaction.message.id] && messageReaction.emoji == "🚫" && !bans.includes(messageReaction.message.author)){
			// console.log(games);
		if (games[messageReaction.message.id][0][0].id==user.id||games[messageReaction.message.id][1][0].id==user.id) {
				

				messageReaction.message.channel.send(new Discord.RichEmbed({
					color: 16711680,
					title: "Game cancelled",
					description: `Game was:\n <@${games[messageReaction.message.id][0][0].id}> vs. <@${games[messageReaction.message.id][1][0].id}> with score \`${games[messageReaction.message.id][0][1]}\` to \`${games[messageReaction.message.id][1][1]}\`\n\nCancelled by ${user}`,
					
				}));
				games[messageReaction.message.id]=false;
		} else if (messageReaction.message.member.roles.find("name", "Admin")){
			undoRank(games[messageReaction.message.id])
			messageReaction.message.channel.send(new Discord.RichEmbed({
				color: 16711680,
				title: "Game cancelled",
				description: `Game was:\n <@${games[messageReaction.message.id][0][0].id}> vs. <@${games[messageReaction.message.id][1][0].id}> with score \`${games[messageReaction.message.id][0][1]}\` to \`${games[messageReaction.message.id][1][1]}\`\n\nCancelled by ${user}`,

			}));
		}
	} else if (games[messageReaction.message.id] && messageReaction.emoji == "✅" && !bans.includes(messageReaction.message.author)) {
		// console.log(games);
		console.log("ok")
		if (messageReaction.message.member.roles.find("name", "Admin") || messageReaction.message.member.roles.find("name", "2Fresh-PRO")) {
			console.log('yes')
			updateRank(games[messageReaction.message.id])

			message.channel.send(new Discord.RichEmbed(
				{
					color: 3447003,
					title: "Game confirmed and scores updated!",
					description: `${games[messageReaction.message.id][0][0]}: ${games[messageReaction.message.id][resultsArray[0][0].id].score}\n${games[messageReaction.message.id][1][0]}: ${games[messageReaction.message.id][resultsArray[1][0].id].score}\nConfirmed by Cancelled by ${user}`,
				}
			));
			games[messageReaction.message.id] = false;
		}
	}
	
});
bot.login(process.env.BOT_TOKEN);
