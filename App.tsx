import * as React from 'react';

class App extends React.Component<any, any> {
	
	game: Game;
	
	constructor() {
		super();
		this.game = new Game(this.refreshState.bind(this), {cols: 70, rows: 50});
		this.state = {
			gameState: this.game.gameState
		}
	}
	
	handleCellClick(e, coords: BoardCoords) {
		console.log('clicked coords:', coords);
		let clickedCell = this.state.gameState.board[coords.row][coords.col];
		if (clickedCell == 0) this.state.gameState.board[coords.row][coords.col] += 1;
		else if (clickedCell == 1) this.state.gameState.board[coords.row][coords.col] -= 1;
		else if (clickedCell == 2) this.state.gameState.board[coords.row][coords.col] = 0;
		this.refreshState();
	}
	
	refreshState() {
		this.setState({gameState: this.state.gameState})
	}
	
	clearBoard() {
		this.game.initBoard({cols: 70, rows: 50});
		this.refreshState();
	}
	
	render() {
		return (
			<div id="page-wrapper">
				<h1>ReactJS - Game of <span id="highlight">Life</span></h1>
				<GameBoard
					columns={70}
					rows={50}
					game={this.state.gameState}
					handleCellClick={(e, coords) => this.handleCellClick(e, coords)} />
				<div id="controls">
					<span className="button" onClick={(e) => this.game.run()}>Run</span>
					<span className="button">Pause</span>
					<span className="button" onClick={(e) => this.clearBoard()}>Clear</span>
				</div>
			</div>
		)
	}
}

class GameBoard extends React.Component<any, any> {
	gameState;
	
	constructor(props) {
		super(props);
		this.gameState = this.props.game;
	}
	
	getCellState(coords: BoardCoords) {
		let cellState = this.gameState.board[coords.row][coords.col];
		let className = '';
		if (cellState == 1) className = 'young';
		if (cellState == 2) className = 'alive';
		return className;
	}
	
	getRow(rowNum: number, columns: number) {
		let row = [];
		for (let i = 0; i < columns; i++) {
			let cellCoords: BoardCoords = {row: rowNum, col: i};
			row.push(
				<td 
					className={this.getCellState(cellCoords)} 
					key={i}
					onClick={(e) => this.props.handleCellClick(e, cellCoords)}>
				</td>
			);
		}
		return row;
	}
	
	generateBoard() {
		let columns = this.props.columns;
		let rows = this.props.rows;
		let tableContents = [];
		for (let i = 0; i < rows; i++) {
			tableContents.push(
				<tr key={i}>{this.getRow(i, columns)}</tr>
				);
		}
		return <table><tbody>{tableContents}</tbody></table>
	}
	
	render() {
		return this.generateBoard();
	}
}

class Game {
	
	refreshState;
	
	gameState = {
		board: []
	}
	
	constructor(refreshState, colsRows: {cols: number, rows: number}) {
		this.refreshState = refreshState;
		this.initBoard(colsRows);
	}
	
	initBoard(colsRows: {cols: number, rows: number}, starter?) {
		/*	Board is a 2d array, selection is board[rowNum][colNum]
			Cell values: 0 = dead, 1 = young, 2 = alive
			[
				[0, 1, 2, 1, 0, 0...],	<-- row 0
				[0, 0, 1, 0, 0, 0...],	<-- row 1
				...
			]
		*/
		let board = [];
		for (let row = 0; row < colsRows.rows; row++) {
			let nextRow = []
			for (let col = 0; col < colsRows.cols; col++) {
				let cellState: number;
				if (starter == null) cellState = 0;
				else if (starter == 'random') cellState = Math.floor(Math.random()*3);
				nextRow.push(cellState);
			}
			board.push(nextRow);
		}
		this.gameState.board = board;
		console.log(board, board.length);
	}
	
	run() {
		let board = this.gameState.board;
		for (let row = 0; row < board.length; row++) {
			for (let col = 0; col < board[row].length; col++) {
				let currentCell: BoardCoords = {row: row, col: col};
				let currentCellState = board[row][col];
				let livingNeighbors: number = this.findCellNeighbors(currentCell);
				
				// Living cells
				if (currentCellState > 0) {
					if (livingNeighbors < 2) board[row][col] = 0;  // Cell dies
					if (livingNeighbors == 2 || livingNeighbors == 3) { // Cell survives
						if (currentCellState == 1) board[row][col] += 1;  // Cell ages
					}
					if (livingNeighbors > 3) board[row][col] = 0; // Cell dies
				}
				// Dead cells
				else {
					if (livingNeighbors == 3) board[row][col] = 1; // Cell comes to life
				}
			}
		}
		this.refreshState();
		//this.run();
	}
	
	findCellNeighbors(cell: BoardCoords): number {
		let board = this.gameState.board;
		let boardRows = board.length;
		let boardCols = board[0].length;
		let numLivingNeighbors = 0;
		
		// Check state of each cell starting at top left of current cell
		for (let row = cell.row-1; row <= cell.row+1; row++) {
			let rowToCheck = row;
			if (row < 0) rowToCheck = boardRows-1;
			else if (row > boardRows-1) rowToCheck = 0;
			for (let col = cell.col-1; col <= cell.col+1; col++) {
				let colToCheck = col;
				if (col < 0) colToCheck = boardCols-1;
				else if (col > boardCols-1) colToCheck = 0;
				let cellToCheck: BoardCoords = {row: rowToCheck, col: colToCheck};
				let cellToCheckState = board[rowToCheck][colToCheck];
				let isSelf: boolean = (cellToCheck.row == cell.row) && (cellToCheck.col == cell.col);
				if (cellToCheckState > 0 && !isSelf) numLivingNeighbors++;
			}
		}
		
		return numLivingNeighbors;
	}
	
}

interface BoardCoords {
	row: number;
	col: number;
}

export default App;