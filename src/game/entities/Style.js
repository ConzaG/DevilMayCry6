// Style.js
export default class Style {
    constructor() {
        this.grade = 'E';
        this.killsWithSword = 0;
        this.killsWithLaser = 0;
        this.score = 0;
    }

    increaseGrade() {
        // Aggiorna il grado in base al numero di uccisioni
        if (this.killsWithSword >= 25 && this.killsWithLaser >= 25) {
            this.grade = 'SS'; // Grado SS con almeno 5 uccisioni con spada e 5 con laser
        } else if (this.killsWithSword >= 20 && this.killsWithLaser >= 20) {
            this.grade = 'S'; // Grado S con almeno 3 uccisioni con spada e 3 con laser
        } else if (this.killsWithSword >= 15 && this.killsWithLaser >= 15) {
            this.grade = 'A'; // Grado A con almeno 2 uccisioni con spada e 2 con laser
        } else if (this.killsWithSword >= 10 && this.killsWithLaser >= 10) {
            this.grade = 'B'; // Grado B con almeno 1 uccisione con spada e 1 con laser
        } else if (this.killsWithSword >= 5 || this.killsWithLaser >= 5) {
            this.grade = 'C'; // Grado C con almeno 1 uccisione con spada o laser
        } else {
            this.grade = 'D'; // Grado D senza uccisioni
        }
    }

    addKill(weapon) {
        // Aggiorna il contatore delle uccisioni in base all'arma utilizzata
        if (weapon === 'sword') {
            this.killsWithSword++;
            this.score +=10
        } else if (weapon === 'laser') {
            this.killsWithLaser++;
            this.score +=5
        }
        // Aggiorna il grado di stile
        this.increaseGrade();
    }
    
}
