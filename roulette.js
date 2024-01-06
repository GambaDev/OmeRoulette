class RouletteBetting {
    constructor() {
        this.bets = [];
        this.houseLose = 0;
    }

    placeBet(name, numbers, oddEven, color, betAmount) {
        numbers = numbers.split(',').map(num => parseInt(num, 10));
        betAmount = parseInt(betAmount, 10);
        this.bets.push({ name, numbers, oddEven, color, betAmount });
        this.updateCurrentBetsDisplay();
    }

    calculateWinnings(winningNumber) {
        winningNumber = parseInt(winningNumber, 10);

        // Adjust for the method that returns 37 instead of 0
        if (winningNumber === 37) {
            winningNumber = 0;
        }

        let totalPayout = 0;
        const winners = [];

        this.bets.forEach(bet => {
            const { name, numbers, oddEven, color, betAmount } = bet;

            let isWinning = false;
            if (numbers.includes(winningNumber)) {
                const payoutRatio = this.getPayoutRatio(numbers.length);
                const winnings = betAmount * payoutRatio + betAmount; // Include original bet
                winners.push({ name, winnings });
                totalPayout += winnings;
                isWinning = true;
            } else if (oddEven && ((winningNumber % 2 === 0 && oddEven === 'even') || (winningNumber % 2 !== 0 && oddEven === 'odd'))) {
                const winnings = betAmount * 2; // Even/Odd payout ratio is 2
                winners.push({ name, winnings });
                totalPayout += winnings;
                isWinning = true;
            } else if (color && this.isColorMatch(color, winningNumber)) {
                const winnings = betAmount * 2; // Color payout ratio is 2
                winners.push({ name, winnings });
                totalPayout += winnings;
                isWinning = true;
            }
        });

        this.houseLose += (this.totalBetAmount() - totalPayout);
        this.bets = []; // Clear current bets
        this.updateWinningBetsDisplay(winners);
        this.updateHouseLoseDisplay();
        this.updateCurrentBetsDisplay(); // Clear display of current bets
    }

    getPayoutRatio(numNumbers) {
        switch (numNumbers) {
            case 1: return 35;
            case 2: return 17;
            case 3: return 11;
            case 4: return 8;
            default: return 0;
        }
    }

    totalBetAmount() {
        return this.bets.reduce((acc, bet) => acc + bet.betAmount, 0);
    }

    isColorMatch(color, winningNumber) {
        const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
        const isRed = redNumbers.includes(winningNumber);

        if (color === 'red') {
            return isRed;
        } else if (color === 'black') {
            return !isRed;
        }

        return false;
    }

    updateCurrentBetsDisplay() {
        const display = document.getElementById('currentBets');
        display.innerHTML = this.bets.map(bet => {
            const { name, numbers, oddEven, color, betAmount } = bet;
            return `${name}: ${numbers.join(', ')} ${oddEven ? `(${oddEven})` : ''} ${color ? `(${color})` : ''} - $${betAmount}`;
        }).join('<br>');
    }

    updateWinningBetsDisplay(winners) {
        const display = document.getElementById('winningBets');
        display.innerHTML = winners.map(winner => `${winner.name} wins $${winner.winnings}`).join('<br>');
    }

    updateHouseLoseDisplay() {
        const display = document.getElementById('houseLose');
        display.textContent = this.houseLose;
    }
}

const roulette = new RouletteBetting();

function placeBet() {
    const name = document.getElementById('nameInput').value;
    const numbers = document.getElementById('numbersInput').value;
    const oddEven = document.getElementById('oddEvenInput').value;
    const color = document.getElementById('colorInput').value;
    const betAmount = document.getElementById('betAmountInput').value;

    roulette.placeBet(name, numbers, oddEven, color, betAmount);
    clearInputFields();
}

function calculateWinnings() {
    const winningNumber = document.getElementById('winInput').value;
    roulette.calculateWinnings(winningNumber);
    clearInputFields();
}

function clearBets() {
    roulette.bets = [];
    clearInputFields();
    roulette.updateCurrentBetsDisplay();
}

function clearInputFields() {
    document.getElementById('nameInput').value = '';
    document.getElementById('numbersInput').value = '';
    document.getElementById('oddEvenInput').value = '';
    document.getElementById('colorInput').value = '';
    document.getElementById('betAmountInput').value = '';
    document.getElementById('winInput').value = '';
}
