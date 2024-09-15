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

class DirectionsStack {
  constructor(
    array,
  ) {
    this.array = array
  }

  push(direction) {
    if (this.array.length < 3) this.array.push(direction)
  }

  getArray() {
    return this.array
  }

  getCurrent() {
    return this.array[0]
  }

  getLast() {
    return this.array[this.array.length - 1]
  }

  next() {
    const next = this.array.at(1)
    if (next) {
      this.array.splice(0, 1)
      return next
    } else {
      return this.array[0]
    }
  }
}

const EntryState = {
  snake: {
    directions_stack: [RIGHT],
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
    setInterval(() => this._moveSnake(), this.state.snake.speed)
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
        snake: { ...this.state.snake, length: length, oldLength: oldLength }
      })
    }
  }

  _onKeyDown = (e) => {
    e = e || window.event
    let { directions_stack } = this.state.snake

    const stack = new DirectionsStack(directions_stack)
    const last_direction = stack.getLast()

    switch (e.keyCode) {
      case 38: {
        if (last_direction !== DOWN && last_direction !== UP) stack.push(UP)
        break
      }
      case 40: {
        if (last_direction !== UP && last_direction !== DOWN) stack.push(DOWN)
        break
      }
      case 39: {
        if (last_direction !== LEFT && last_direction !== RIGHT) stack.push(RIGHT)
        break
      }
      case 37: {
        if (last_direction !== RIGHT && last_direction !== LEFT) stack.push(LEFT)
        break
      }
      default: { }
    }

    this.setState({
      snake: {
        ...this.state.snake,
        directions_stack: stack.getArray()
      }
    })
  }

  _moveSnake() {
    const { directions_stack, length } = this.state.snake
    const stack = new DirectionsStack(directions_stack)
    let newLength = [...this.state.snake.length]
    let head = length[length.length - 1]

    switch (stack.next()) {
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
      default: { }
    }

    newLength.push(head)
    newLength.shift()

    this.setState({
      snake:
      {
        ...this.state.snake,
        length: newLength,
        oldLength: length,
        directions_stack: stack.getArray()
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

