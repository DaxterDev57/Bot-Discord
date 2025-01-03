// Récupérer les modules nécessaires
import { Client, Events, GatewayIntentBits } from 'discord.js';
import { DisTube } from 'distube';
import { YtDlpPlugin } from '@distube/yt-dlp';
import playMusic  from "./music.js"
import disconnect from './disconnect.js';
import stop from './stop.js';
import 'dotenv/config';

const token = process.env.DISCORD_TOKEN;

// Créer une nouvelle instance du client
const client = new Client({ 
	intents: [
		GatewayIntentBits.Guilds, // Intention de base
        GatewayIntentBits.GuildMessages, // Intention pour les messages du serveur
        GatewayIntentBits.MessageContent, // Accès au contenu des messages
        GatewayIntentBits.GuildMembers,  // Intention pour les membres du serveur
        GatewayIntentBits.GuildVoiceStates, // Si tu interagis avec la voix (ex: jouer de la musique) 
	] 
});

client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

const distubeClient = new DisTube(client, {
	plugins: [new YtDlpPlugin({ update: false })],
});

// Jouer le lien Youtube
client.on('messageCreate', message => {
	if(message.author.bot) return; // Ignorer les messages des bots
	// if(message.channel.name !== "🤖bip-boup") return; // Vérifier qu'on est bien dans bip-boup
	if(message.content.trim().startsWith('!play')) {
		playMusic(message);
	} else if (message.content === "!disconnect") {
		disconnect(message);
	} else if (message.content === "!stop"){
		stop(message);
	}
})

// Se connecter à Discord via le token
client.login(token);

export default distubeClient;
