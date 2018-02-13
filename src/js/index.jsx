//need these to use react
import React from 'react';
import ReactDOM from 'react-dom';


//this can be a simple function if component only does a render()
function Square (props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}


class Board extends React.Component {
  constructor(props) { //needed a constructor to have class variables(?)
    super(props);

    //class-scope variables need a "this."
    this.colNum = 4;
    this.rowNum = 4;
    this.sliceNum = 4;
  }

  renderSquare(i, j, k) { //builds the jsx for an individual square
    var keyName = i.toString() + j.toString() + k.toString();
    return (
      <Square
        key = {keyName} //need a key to keep track of this square later
        value={this.props.squares[i][j][k]}
        onClick={() => this.props.onClick(i,j,k)} 
      /> 
    );
  }

  squaresInRow(j, k) { //builds row out of squares
    var squares = [];

    for (let i = 0; i < this.colNum; i++) {
      squares.push(this.renderSquare(i, j, k));
    }
    return squares;
  }

  rowsInSlice(k) {  //builds slice out of rows
    var rows = [];
    var keyName = "";

    for (let j = 0; j < this.rowNum; j++) {
      keyName = j.toString() + k.toString();
      rows.push(
        <div className="slice-row" key={keyName}>
         {this.squaresInRow(j, k)}
        </div>
      )
    }
    return rows;
  }

  slicesInBoard() { //builds 3d board out of slices
    var slices = [];

    for (let k = 0; k < this.sliceNum; k++) {
      slices.push(
        <div className="board-slice" key={k}>
          {this.rowsInSlice(k)}
        </div>
      )
    }
    return slices;
  }

  render() {
    return (
      <div>
        {this.slicesInBoard()}
      </div>
    );
  }
}


//main game class
class Game extends React.Component {
  constructor() {
    super();
    this.state = {
      history: [{
        // squares: [Array(4).fill(Array(4).fill(Array(4).fill(null)))] //squares[0][0][0]
        squares: [
          [[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null]],
          [[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null]],
          [[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null]],
          [[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null]]
        ]
      }],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Move #' + move :
        'Game start';
      return (
        <li key={move}>
          <a href="#" onClick={() => this.jumpTo(move)}>{desc}</a>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i, j, k) => this.handleClick(i, j, k)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  handleClick(i, j, k) {
    const history = this.state.history; //grab full set of past states
    const current = history[history.length - 1]; //current state is last in history
    const squares = current.squares.slice(); //make a copy of squares

    if (calculateWinner(squares) || squares[i][j][k]) { //if game over or square previously clicked
      return;
    }

    squares[i][j][k] = this.state.xIsNext ? 'X' : 'O'; //alternates x & o

    this.setState({ //updates state
      history: history.concat([{ //adds current state after click to history
        squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }
}


//checks for an end-game condition
function calculateWinner(squares) {
  var winner;

  winner = checkHorizontal(squares);
  if (winner) { return winner.winningPlayer; }

  return null;
}

function checkHorizontal(squares) {
  var winningLine;

  for (let z = 0; z < 4; z++) {
    for (let y = 0; y < 4; y++) {
      if (squares[0][y][z] &&
        squares[0][y][z] == squares[1][y][z] &&
        squares[0][y][z] == squares[2][y][z] &&
        squares[0][y][z] == squares[3][y][z]) 
        { 
          winningLine = {
            winningPlayer: squares[0][y][z],
            point0: squares[0][y][z],
            point1: squares[1][y][z],
            point2: squares[2][y][z],
            point3: squares[3][y][z]
          }
        }
    }
  }
  return winningLine;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
