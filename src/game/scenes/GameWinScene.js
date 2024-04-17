import Phaser from "phaser";
import Style from "../entities/Style";

export default class GameWinScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameWinScene' });
    }

    init(data){
        this.username = data.username;
        this.score = data.score;
    }

    create() {
        this.createTable();
        const text1 = this.add.text(this.cameras.main.width / 2, 100, 'YOU WON', { fontSize: '32px', fill: 'green' }).setOrigin(0.5);

        const text2 = this.add.text(this.cameras.main.width / 2, 150, `${this.username}: ${this.score} points`, { fontSize: '24px', fill: 'white' }).setOrigin(0.5);
        if (this.username === undefined && this.score === undefined) {
            text1.visible = false;
            text2.visible = false;
        }

        //pulsante per ricominciare il gioco
        const restartButton = this.add.text(1400, 500, 'Turn Home', { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
        restartButton.setInteractive(); 
        restartButton.on('pointerdown', () => {
            // Al click del pulsante, ricarica la pagina
            window.location.reload();
        });
    }

   
    update() {
        // In questa funzione si può mettere solo la logica per l'interfaccia grafica, evitando chiamate API
    } 

    createTable() {
        // Creazione di una tabella grafica
        const center = this.cameras.main.width / 2;
        const tableWidth = 400;
        const tableHeight = 700;
        const tableX = center - tableWidth / 2;
        const tableY = 200;
    
        const table = this.add.graphics();
        table.fillStyle(0xffffff, 1);
        table.fillRect(tableX, tableY, tableWidth, tableHeight);
    
        // Header della tabella
        const headerStyle = { fontSize: '18px', fill: '#000000' };
        const headerY = tableY + 20;
        this.add.text(center - 150, headerY, 'Username', headerStyle);
        this.add.text(center + 50 , headerY, 'Score', headerStyle);
    
        // Linea sotto l'header
        table.lineStyle(1, 0x000000); // Linea nera
        table.beginPath();
        table.moveTo(tableX, headerY + 30);
        table.lineTo(tableX + tableWidth, headerY + 30);
        table.stroke();
    
        // Effettua la richiesta POST per aggiornare i dati del giocatore
        this.updatePlayerData()
            .then(() => {
                // Dopo aver effettuato la richiesta POST, recupera i dati dei giocatori e riempi la tabella
                return this.fetchTopPlayers();
            })
            .then(topPlayers => {
                // Ordina i giocatori per punteggio decrescente
                topPlayers.sort((a, b) => b.ScorePoints - a.ScorePoints);
    
                let y = tableY + 70;
                topPlayers.slice(0, 20).forEach((player, index) => {
                    this.add.text(center - 150, y, player.Username, { fontSize: '16px', fill: '#000000' });
                    this.add.text(center + 50, y, player.ScorePoints.toString(), { fontSize: '16px', fill: '#000000' });
                    y += 30;
                });
            })
            .catch(error => console.error('Error fetching top players:', error));
    }
    

    fetchTopPlayers() {
        return fetch('https://localhost:44381/api/player/', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer 0CfwyLR1IUJxv1y4KhkCq5uYOmOaigiKdReEjWUfEkiAXo664L9y30oDmomQHaiDYdVFZuCO1LdBSXUQox87bgU7Mty5UlRWoj77ktBbtV6WtUFlAcYGTxqZfml74LUj3Pj1ut72GafzmXG3ub8PffeDEhh0idlVXGpg',
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch top players');
            }
            return response.json();
        });
    }
    
    updatePlayerData() {
        const currentPlayer = {
            Username: this.username,
            ScorePoints: this.score
        };
    
        // Restituisci una promessa che si risolve quando la richiesta POST è completata con successo
        return fetch('https://localhost:44381/api/player/', {
            method: 'POST',
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
        });
    }
    
}