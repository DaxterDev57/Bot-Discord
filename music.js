import ytdl from 'ytdl-core';
import distubeClient from './app.js';

const playMusic = (message) => {
    let args = message.content.split(' '); // Split the message into the URL part

    if (args.length !== 2) {
        message.reply('Lien manquant ou message invalide');
        return;
    }

    const url = args[1].toString(); // Get the URL
    

    if (!ytdl.validateURL(url)) {
        message.reply("Lien YouTube non valide");
        return;
    }

    const voiceChannel = message.member.voice.channel; // Récupérer le channel vocal

    if (!voiceChannel) {
        message.reply("Vous devez être dans un canal vocal pour jouer de la musique.");
        return;
    }

    const queue = distubeClient.getQueue(message.guild.id); // Vérifier si une queue existe

    if (queue && queue.stopped) {
        // Si la queue a été arrêtée, demande de recommencer une nouvelle queue
        message.reply("La queue a été arrêtée. Reconnectez-vous au canal vocal pour démarrer une nouvelle chanson.");
        return;
    }
    
    distubeClient.play(voiceChannel, url, { 
        textChannel: message.channel // Cela suffit, Distube s'occupe du reste
    });

    message.channel.send(`Ajout dans la file d'attente !`);
          
    distubeClient.on('error', (error) => {
        console.error(error);
    });
}

export default playMusic;