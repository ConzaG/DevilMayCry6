import Phaser from 'phaser';

export default class GameWinScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameWinScene' });
    }

    create() {
       /*  // Effettua la richiesta GET per ottenere la classifica dei giocatori
        fetch('https://localhost:44381/api/player/', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer 0CfwyLR1IUJxv1y4KhkCq5uYOmOaigiKdReEjWUfEkiAXo664L9y30oDmomQHaiDYdVFZuCO1LdBSXUQox87bgU7Mty5UlRWoj77ktBbtV6WtUFlAcYGTxqZfml74LUj3Pj1ut72GafzmXG3ub8PffeDEhh0idlVXGpg',
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            // Ordina i giocatori in base allo score in ordine decrescente
            data.sort((a, b) => b.ScorePoints - a.ScorePoints);

            // Prendi solo i primi 5 giocatori
            const topPlayers = data.slice(0, 5);

            // Mostra la classifica dei primi 5 giocatori
            const text = topPlayers.map((player, index) => `${index + 1}. ${player.Username}: ${player.ScorePoints}`).join('\n');
            this.add.text(100, 100, text, { font: '24px Arial', fill: '#ffffff' });
        })
        .catch(error => console.error('Error fetching top players:', error));
    }

    update() {
        // Inserisci il player corrente con il relativo score nell'API
        const currentPlayer = {
            Id: 0, // Id del giocatore corrente, da sostituire con il reale Id del giocatore
            Username: 'NomeGiocatore', // Username del giocatore corrente, da sostituire con il reale Username
            ScorePoints: 1000 // Punteggio del giocatore corrente, da sostituire con il reale punteggio
        };

        // Effettua la richiesta PUT per aggiornare i dati del giocatore corrente
        fetch('https://localhost:44381/api/player/', {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer 0CfwyLR1IUJxv1y4KhkCq5uYOmOaigiKdReEjWUfEkiAXo664L9y30oDmomQHaiDYdVFZuCO1LdBSXUQox87bgU7Mty5UlRWoj77ktBbtV6WtUFlAcYGTxqZfml74LUj3Pj1ut72GafzmXG3ub8PffeDEhh0idlVXGpg',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(currentPlayer)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to update player data');
            }
        })
        .catch(error => console.error('Error updating player data:', error));
        */

        this.add.text(this.cameras.main.width / 2, 100, 'HAI VINTO', { fontSize: '32px', fill: 'green' }).setOrigin(0.5);

    } 
}
