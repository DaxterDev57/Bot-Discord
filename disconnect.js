import distubeClient from './app.js';

const disconnect = (message) => {
    // Récupérer la connexion vocale de la guilde
    const queue = distubeClient.getQueue(message.guild.id);
    
    if (!queue) {
        return message.channel.send("Je ne suis pas connecté à un salon vocal.");
    }
    queue.stop();
    queue.voice.connection.destroy(); // Déconnecter du salon vocal
    return message.channel.send("J'ai arrêté la musique et me suis déconnecté du salon vocal");
}

export default disconnect;