import Phaser from "phaser";

export default class Chest extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, items, gameScene) {
        super(scene, x, y, 'chest');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.items = items;
        this.isOpen = false;
        this.modal = null; // Inizializza la modale come null
        this.player = scene.player;

        // Imposta le dimensioni della cassa
        this.setScale(2);

        // Abilita le interazioni con il giocatore
        this.setInteractive();
        this.on('pointerdown', this.openChest, this);

        this.gameScene = gameScene;
        
        this.canShowModal = true;

    }

    openChest() {
        if (!this.isOpen) {
            // Imposta la cassa come aperta
            this.isOpen = true;

            // Mostra la modale con gli item trovati
            this.showModal();
        }
    }

    showModal() {
        if (!this.canShowModal) {
            return; // Esce se non è possibile mostrare la modale
        }
        
        if (this.isOpen && !this.modal) {
            const foundItems = this.getRandomItems();
            const item = foundItems[0]; // Prendi il primo oggetto trovato
            const itemNames = item.name;
            const itemDescription = item.description;
            const itemEmoji = item.emoji;
    
            // Mostra la modale con gli item trovati
            this.modal = this.gameScene.add.rectangle(this.gameScene.cameras.main.centerX, this.gameScene.cameras.main.centerY, 300, 200, 0xffffff);
            this.modal.setOrigin(0.5);
            this.modal.setStrokeStyle(4, 0x000000);
            this.modal.setScrollFactor(0);
    
            this.text = this.gameScene.add.text(this.gameScene.cameras.main.centerX, this.gameScene.cameras.main.centerY - 60, `${itemNames}`, {
                fontSize: '34px',
                fill: '#000000',
                fontWeight: 'bold' // Aggiungi la proprietà fontWeight per rendere il testo in grassetto
            });
            this.description = this.gameScene.add.text(this.gameScene.cameras.main.centerX, this.gameScene.cameras.main.centerY + 40, `${itemDescription}`, { fontSize: '12px', fill: '#000000' });
            this.emoji = this.gameScene.add.text(this.gameScene.cameras.main.centerX, this.gameScene.cameras.main.centerY, `${itemEmoji}`, { fontSize: '40px', fill: '#000000' });
    
            this.description.setOrigin(0.5);
            this.description.setScrollFactor(0);
            this.text.setOrigin(0.5);
            this.text.setScrollFactor(0);
            this.emoji.setOrigin(0.5);
            this.emoji.setScrollFactor(0);
    
    
            // Applica l'effetto dell'oggetto trovato
            this.applyItemEffect(item);
    
            this.showModalTimer = this.gameScene.time.delayedCall(120000, this.enableShowModal, [], this);
    
        } else if (!this.isOpen && this.modal) {
            // Chiudi il modal solo se è aperto
            this.modal.setVisible(false);
            this.description.destroy();
            this.text.destroy();
            this.emoji.destroy();
            this.modal = null;
            
            // Distruggi la cassa quando il giocatore esce dalla modale
            this.setVisible(false);
            this.canShowModal = false;
            // Metti un timer di 2 minuti che porta canShowModal a true
            this.gameScene.time.delayedCall(120000, () => {
                this.canShowModal = true;
                this.setVisible(true);

            }, [], this);
            this.emit('modalClosed');
        }
    }
    
    



    getRandomItems() {
        const randomIndex = Phaser.Math.Between(0, this.items.length - 1);
        return [this.items[randomIndex]];
    }

    applyItemEffect(item) {
        switch (item.type) {
            case 'healing':
                // Aumenta la vita del giocatore in base all'amount dell'item
                this.player.health += item.amount;
                // Assicurati che la vita non superi 100
                this.player.health = Math.min(this.player.health, 100);
                break;
            default:
                console.log(`Tipo di oggetto non valido: ${item.type}`);
        }
    }


}
