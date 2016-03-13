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
	
	refreshState() {
		this.setState({gameState: this.state.gameState})
	}
	
	render() {
		return (
			<div id="page-wrapper">
				<h1>ReactJS - Game of Life</h1>
				<GameBoard
					columns={70}
					rows={50}
					game={this.state.gameState} />
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
			row.push(
				<td className={this.getCellState({row: rowNum, col: i})} key={i}></td>
			)
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
	
	refreshState: () => void;
	
	gameState = {
		board: []
	}
	
	constructor(refreshState: () => void, colsRows: {cols: number, rows: number}) {
		this.refreshState = refreshState;
		this.initBoard(colsRows, true);
	}
	
	initBoard(colsRows: {cols: number, rows: number}, random?: boolean) {
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
				if (random == null) cellState = 0;
				else if (random == true) cellState = Math.floor(Math.random()*3);
				nextRow.push(cellState);
			}
			board.push(nextRow);
		}
		this.gameState.board = board;
		console.log(board, board.length);
	}
}

interface BoardCoords {
	row: number;
	col: number;
}

export default App;