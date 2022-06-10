const N = 4;
const M = 4;
let redScore = 0;
let blueScore = 0;
let endGame = 0;
let turn = 'R';
let selectedLines = [];

const hoverClasses = { R: 'hover-red', B: 'hover-blue' };
const bgClasses = { R: 'bg-red', B: 'bg-blue' };

const playersTurnText = (turn) => `It's ${turn === 'R' ? 'Red' : 'Blue'}'s turn`;
const playersWinText = (turn) => `won ${turn === 'R' ? 'Red' : 'Blue'}`;

const isLineSelected = (line) => line.classList.contains(bgClasses.R) || line.classList.contains(bgClasses.B);

const createGameGrid = () => {
	const gameGridContainer = document.getElementsByClassName('game-grid-container')[0];

	const rows = Array(N).fill(0).map((_, i) => i);
	const cols = Array(M).fill(0).map((_, i) => i);

	rows.forEach((row) => {
		cols.forEach((col) => {
			const dot = document.createElement('div');
			dot.setAttribute('class', 'dot');

			const hLine = document.createElement('div');
			hLine.setAttribute('class', `line-horizontal ${hoverClasses[turn]}`);
			hLine.setAttribute('id', `h-${row}-${col}`);
			hLine.addEventListener('click', handleLineClick);

			gameGridContainer.appendChild(dot);
			if (col < M - 1) gameGridContainer.appendChild(hLine);
		});

		if (row < N - 1) {
			cols.forEach((col) => {
				const vLine = document.createElement('div');
				vLine.setAttribute('class', `line-vertical ${hoverClasses[turn]}`);
				vLine.setAttribute('id', `v-${row}-${col}`);
				vLine.addEventListener('click', handleLineClick);

				const box = document.createElement('div');
				box.setAttribute('class', 'box');
				box.setAttribute('id', `box-${row}-${col}`);

				gameGridContainer.appendChild(vLine);
				if (col < M - 1) gameGridContainer.appendChild(box);
			});
		}
	});

	document.getElementById('game-status').innerHTML = playersTurnText(turn);
};

const changeTurn = () => {
	const nextTurn = turn === 'R' ? 'B' : 'R';

	const lines = document.querySelectorAll('.line-vertical, .line-horizontal');

	lines.forEach((l) => {
		//if line was not already selected, change it's hover color according to the next turn
		if (!isLineSelected(l)) {
			l.classList.replace(hoverClasses[turn], hoverClasses[nextTurn]);
		}
	});
	turn = nextTurn;
};

const handleLineClick = (e) => {
	if (endGame >= 9) {
		return;
	}
	if (endGame < 9) {
		const lineId = e.target.id;

		const selectedLine = document.getElementById(lineId);

		if (isLineSelected(selectedLine)) {
			//if line was already selected, return
			return;
		}

		selectedLines = [ ...selectedLines, lineId ];

		colorLine(selectedLine);

		// we must check for everytime one line is being selected and colored that if they are making a square or not

		const boxes = document.querySelectorAll('.box');
		const boxesCheck = [];
		boxes.forEach((b) => {
			let arr = b.id.split('');

			boxesCheck.push([
				`h-${arr[4]}-${arr[6]}`,
				`h-${Number(arr[4]) + 1}-${arr[6]}`,
				`v-${arr[4]}-${arr[6]}`,
				`v-${arr[4]}-${Number(arr[6]) + 1}`
			]);
		});

		boxes.forEach((b, i) => {
			let counter = 0;

			boxesCheck[i].forEach((x) => {
				if (isLineSelected(document.getElementById(x))) {
					counter++;
				}
			});
			if (!isLineSelected(b) && counter == 4) {
				b.classList.add(bgClasses[turn]);
				if (bgClasses[turn] === 'bg-red') {
					redScore++;
				} else {
					blueScore++;
				}
				endGame++;
				changeTurn();
			}
		});
	}
	//when maximum number of boxes are colored we stop changing turn  and will show the victorious player
	if (endGame == 9) {
		if (blueScore > redScore) {
			document.getElementById('game-status').innerHTML = playersWinText('B');
		} else {
			document.getElementById('game-status').innerHTML = playersWinText('R');
		}
		return;
	}
	changeTurn();
	document.getElementById('game-status').innerHTML = playersTurnText(turn);
};

const colorLine = (selectedLine) => {
	selectedLine.classList.remove(hoverClasses[turn]);
	selectedLine.classList.add(bgClasses[turn]);
};

createGameGrid();
