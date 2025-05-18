import { Client, Events, GatewayIntentBits } from "discord.js";
import { DisTube } from "distube";
import { YtDlpPlugin } from "@distube/yt-dlp";
import "dotenv/config";
import ffmpeg from "ffmpeg-static";
import path from "path";
import { fileURLToPath } from "url";

const token = process.env.DISCORD_TOKEN;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Créer une nouvelle instance du client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates,
    ],
});

// Initialiser DisTube
const distubeClient = new DisTube(client, {
    emitNewSongOnly: true,
    emitAddSongWhenCreatingQueue: false,
    emitAddListWhenCreatingQueue: false,
    plugins: [
        new YtDlpPlugin({
            update: false,
            cookiesFromBrowser: {
                browser: "chrome",
                instance: "Default", // Profil Chrome exact
                container: "PROFILE", // Obligatoire pour Windows
                keyring: "basictext",
                // Chemin explicite pour Windows
                path: "C:/Users/nicob/AppData/Local/Google/Chrome/User Data",
            },
        }),
    ],
    nsfw: true,
    ffmpeg: ffmpeg,
});

// Événement prêt
client.once(Events.ClientReady, (readyClient) => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

// Gestion des commandes
client.on("messageCreate", async (message) => {
    if (message.author.bot) return; // Ignorer les messages des bots

    const args = message.content.split(" ");
    const command = args[0].toLowerCase();

    if (command === "!play") {
        const query = args.slice(1).join(" ");
        if (!query) {
            return message.reply(
                "Veuillez fournir un lien ou une recherche valide."
            );
        }

        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) {
            return message.reply(
                "Vous devez être dans un canal vocal pour jouer de la musique."
            );
        }

        try {
            await distubeClient.play(voiceChannel, query, {
                textChannel: message.channel,
                member: message.member,
            });
            message.channel.send(`Ajout dans la file d'attente : ${query}`);
        } catch (error) {
            console.error(error);
            message.channel.send(
                "Une erreur est survenue lors de la lecture de la musique."
            );
        }
    } else if (command === "!disconnect") {
        const queue = distubeClient.getQueue(message.guild.id);

        if (!queue) {
            return message.channel.send(
                "Je ne suis pas connecté à un salon vocal."
            );
        }
        queue.stop();
        queue.voice.connection.destroy(); // Déconnecter du salon vocal
        return message.channel.send(
            "Musique arrêtée, déconnexion du salon vocal"
        );
    } else if (command === "!stop") {
        const queue = distubeClient.getQueue(message.guild);
        if (queue) {
            queue.stop();
            message.channel.send("La musique a été arrêtée.");
        } else {
            message.channel.send("Aucune musique en cours de lecture.");
        }
    }
});

distubeClient.on("error", (error) => {
    console.error("Erreur DisTube :", error);
});

distubeClient.on("debug", (message) => {
    console.log("Debug DisTube :", message);
});

// Connexion à Discord
client.login(token);
