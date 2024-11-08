class ZombieGame {
    constructor() {
        this.gameArea = document.getElementById('game-area');
        this.lawnMower = document.getElementById('lawn-mower');
        this.scoreElement = document.getElementById('score');
        
        this.score = 0;
        this.zombies = [];
        
        this.lawnMowerSpeed = 5;
        this.zombieSpeed = 1;
        
        this.setupControls();
        this.startZombieSpawner();
        this.gameLoop();
    }

    setupControls() {
        // Tastatursteuerung
        document.addEventListener('keydown', (e) => {
            const x = this.lawnMower.offsetLeft;
            const y = this.lawnMower.offsetTop;
            
            switch(e.key) {
                case 'ArrowUp':
                    this.moveLawnMower(x, y - this.lawnMowerSpeed);
                    break;
                case 'ArrowDown':
                    this.moveLawnMower(x, y + this.lawnMowerSpeed);
                    break;
                case 'ArrowLeft':
                    this.moveLawnMower(x - this.lawnMowerSpeed, y);
                    break;
                case 'ArrowRight':
                    this.moveLawnMower(x + this.lawnMowerSpeed, y);
                    break;
            }
        });

        // Touch/Maus-Steuerung
        this.gameArea.addEventListener('mousemove', (e) => {
            const rect = this.gameArea.getBoundingClientRect();
            const x = e.clientX - rect.left - this.lawnMower.offsetWidth / 2;
            const y = e.clientY - rect.top - this.lawnMower.offsetHeight / 2;
            this.moveLawnMower(x, y);
        });
    }

    moveLawnMower(x, y) {
        const maxX = this.gameArea.clientWidth - this.lawnMower.offsetWidth;
        const maxY = this.gameArea.clientHeight - this.lawnMower.offsetHeight;
        
        this.lawnMower.style.left = `${Math.max(0, Math.min(x, maxX))}px`;
        this.lawnMower.style.top = `${Math.max(0, Math.min(y, maxY))}px`;
    }

    spawnZombie() {
        const zombie = document.createElement('div');
        zombie.classList.add('zombie');
        
        // Zufälliger Spawn am Rand des Spielfelds
        const spawnSide = Math.floor(Math.random() * 4);
        let x, y;
        
        switch(spawnSide) {
            case 0: // Links
                x = -50;
                y = Math.random() * this.gameArea.clientHeight;
                break;
            case 1: // Rechts
                x = this.gameArea.clientWidth;
                y = Math.random() * this.gameArea.clientHeight;
                break;
            case 2: // Oben
                x = Math.random() * this.gameArea.clientWidth;
                y = -50;
                break;
            case 3: // Unten
                x = Math.random() * this.gameArea.clientWidth;
                y = this.gameArea.clientHeight;
                break;
        }
        
        zombie.style.left = `${x}px`;
        zombie.style.top = `${y}px`;
        
        this.gameArea.appendChild(zombie);
        this.zombies.push(zombie);
    }

    startZombieSpawner() {
        setInterval(() => this.spawnZombie(), 2000);
    }

    gameLoop() {
        this.zombies.forEach((zombie, index) => {
            const lawnMowerRect = this.lawnMower.getBoundingClientRect();
            const zombieRect = zombie.getBoundingClientRect();
            
            // Zombie bewegt sich zum Rasenmäher
            const angle = Math.atan2(
                lawnMowerRect.top - zombieRect.top,
                lawnMowerRect.left - zombieRect.left
            );
            
            zombie.style.left = `${zombieRect.left + Math.cos(angle) * this.zombieSpeed}px`;
            zombie.style.top = `${zombieRect.top + Math.sin(angle) * this.zombieSpeed}px`;
            
            // Kollisionserkennung
            if (this.checkCollision(lawnMowerRect, zombieRect)) {
                this.gameArea.removeChild(zombie);
                this.zombies.splice(index, 1);
                this.score += 10;
                this.scoreElement.textContent = `Punkte: ${this.score}`;
            }
        });
        
        requestAnimationFrame(() => this.gameLoop());
    }

    checkCollision(rect1, rect2) {
        return !(rect1.right < rect2.left || 
                 rect1.left > rect2.right || 
                 rect1.bottom < rect2.top || 
                 rect1.top > rect2.bottom);
    }
}

// Spiel initialisieren
document.addEventListener('DOMContentLoaded', () => {
    new ZombieGame();
});