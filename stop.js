import distubeClient from './app.js';

const stop = (message) => {
    // Récupérer la connexion vocale de la guilde
    const queue = distubeClient.getQueue(message.guild.id);
    
    if (!queue) {
        return message.channel.send("Je ne joue pas de musique.");
    }

    // Arrêter la musique (si elle est en cours)
    queue.stop();
    return message.channel.send("J'ai arrêté la musique.");
}

export default stop;