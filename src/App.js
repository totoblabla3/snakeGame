import React, { Component } from 'react';
import './App.css';
import { Snake, Food } from "./components/uiKit";

const UP = 'UP'
const DOWN = 'DOWN'
const RIGHT = 'RIGHT'
const LEFT = 'LEFT'
 
const MAP_SIZE = 500
const SPEED = 200

const getRandomCoordinates = () => {
  let max = MAP_SIZE / 5;
  let x = Math.floor((Math.random() * (max)) / 5) * 5;
  let y = Math.floor((Math.random() * (max)) / 5) * 5;
  return [x, y]
}

const EntryState = {
  snake: {
    direction: RIGHT,
    speed: SPEED,
    oldLength: [
      [0, 0],
      [0, 0],
    ],
    length: [
      [0, 0],
      [5, 0],
    ],
  },
  items: {
    food: getRandomCoordinates()
  }
}

const copyObj = (obj) => {
  return JSON.parse(JSON.stringify(obj))
}

export class App extends Component {

  state = copyObj(EntryState)

  componentDidMount() {
    alert("Начать игру")
    setInterval(() => this._mouveSnake(), this.state.snake.speed)
    document.onkeydown = this._onKeyDown
  }

  componentDidUpdate() {
    this._checkBorder()
    this._checkSnakeCollapse()
    this._eatFood()
  }

  _checkBorder() {
    const { snake: { length } } = this.state
    const head = length[length.length - 1]
    if (
      (head[0] >= MAP_SIZE / 5) ||
      (head[1] >= MAP_SIZE / 5) ||
      (head[0] < 0) ||
      (head[1] < 0)
    ) {
      this._gameOver()
    }
  }

  _checkSnakeCollapse() {
    let length = [...this.state.snake.length]
    const head = length[length.length - 1]
    length.pop()
    length.forEach((item) => {
      if (item[0] === head[0] && item[1] === head[1]) {
        this._gameOver()
      }
    })
  }

  _eatFood() {
    const { items: { food } } = this.state
    let length = [...this.state.snake.length]
    let oldLength = [...this.state.snake.oldLength]
    const head = length[length.length - 1]

    if (food[0] === head[0] && food[1] === head[1]) {
      length.unshift(oldLength[0])
      oldLength.unshift(oldLength[0])
      this.setState({
        items: { food: getRandomCoordinates() },
        snake: { ...this.state.snake, length: length, oldLength:oldLength }
      })
    }
  }

  _onKeyDown = (e) => {
    e = e || window.event
    const { snake: { direction } } = this.state
    let newDirection

    switch (e.keyCode) {
      case 38: {
        newDirection = direction !== DOWN ? (UP) : (DOWN)
        break
      }
      case 40: {
        newDirection = direction !== UP ? (DOWN) : (UP)
        break
      }
      case 39: {
        newDirection = direction !== LEFT ? (RIGHT) : (LEFT)
        break
      }
      case 37: {
        newDirection = direction !== RIGHT ? (LEFT) : (RIGHT)
        break
      }
      default: { newDirection = direction }
    }
    this.setState({ snake: { ...this.state.snake, direction: newDirection } })
  }

  _mouveSnake() {
    const { snake: { direction, length } } = this.state
    let newLength = [...this.state.snake.length]
    let head = length[length.length - 1]

    switch (direction) {
      case UP: {
        head = [head[0], head[1] - 5]
        break
      }
      case DOWN: {
        head = [head[0], head[1] + 5]
        break
      }
      case RIGHT: {
        head = [head[0] + 5, head[1]]
        break
      }
      case LEFT: {
        head = [head[0] - 5, head[1]]
        break
      }
    }

    newLength.push(head)
    newLength.shift()

    this.setState({
      snake:
      {
        ...this.state.snake,
        length: newLength,
        oldLength: length
      }
    })
  }


  _gameOver() {
    alert(`Ты проиграл\n Счет: ${this.state.snake.length.length}`)
    this.setState(copyObj(EntryState))
  }

  render() {
    const {
      snake: { 
        length, 
        oldLength, 
        speed 
      },
      items: { food }
    } = this.state

    return (
      <div className="App">
        <div
          className="Map"
          style={{ width: `${MAP_SIZE}px`, height: `${MAP_SIZE}px` }}
        >
          <Snake speed={speed} oldLength={oldLength} length={length} />
          <Food food={food} />
        </div>
      </div>
    )
  }
}

