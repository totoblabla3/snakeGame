import React, { Component } from 'react';
import './App.css';
import { Snake, Food } from "./components/uiKit";
import { useSwipeable } from 'react-swipeable';

const UP = 'UP'
const DOWN = 'DOWN'
const RIGHT = 'RIGHT'
const LEFT = 'LEFT'
const SPACE = 'SPACE'

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
    pause: false,
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
  game_cycle = undefined

  componentDidMount() {
    document.onkeydown = this.handleKeyDown

    if (process.env.REACT_APP_DEV) return
    alert("Start the game?")
    this._play()
  }

  componentDidUpdate() {
    this._checkBorder()
    this._checkSnakeCollapse()
    this._eatFood()
  }


  _pause() {
    clearInterval(this.game_cycle)
    this.game_cycle = undefined
    this.setState({ pause: true })
  }

  _play() {
    this.game_cycle = setInterval(
      () => this._moveSnake(),
      this.state.snake.speed
    )
    this.setState({ pause: false })
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

  handleKeyDown = (e) => {
    e = e || window.event

    if (e.keyCode === 32) {
      this.state.pause ? this._play() : this._pause()
    }

    switch (e.keyCode) {
      case 38: {
        this.updateStack(UP)
        break
      }
      case 40: {
        this.updateStack(DOWN)
        break
      }
      case 39: {
        this.updateStack(RIGHT)
        break
      }
      case 37: {
        this.updateStack(LEFT)
        break
      }
      default: { }
    }
  }

  updateStack(direction) {
    if (this.state.pause) return

    let { directions_stack } = this.state.snake
    const stack = new DirectionsStack(directions_stack)
    const last_direction = stack.getLast()

    switch (direction) {
      case UP: {
        if (last_direction !== DOWN && last_direction !== UP) stack.push(UP)
        break
      }
      case DOWN: {
        if (last_direction !== UP && last_direction !== DOWN) stack.push(DOWN)
        break
      }
      case RIGHT: {
        if (last_direction !== LEFT && last_direction !== RIGHT) stack.push(RIGHT)
        break
      }
      case LEFT: {
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

  getScore() {
    return this.state.snake.length.length - 2
  }

  _gameOver() {
    alert(`Game over\n Score: ${this.getScore()}`)
    this.setState(copyObj(EntryState))
  }

  render() {
    const {
      pause,
      snake: {
        length,
        oldLength,
        speed
      },
      items: { food }
    } = this.state

    return (
      <SwipeHandlerWrapper onSwipe={(d) => this.updateStack(d)}>
        <div className="App">
          <div className="wrapper">
            <div className="header">
              <div className="score">Score: {this.getScore()}</div>
              <div className="pause">
                {pause
                  ? <div onClick={() => this._play()}>play</div>
                  : <div onClick={() => this._pause()}>pause</div>
                }
              </div>
            </div>
            <div className="Map">
              <Snake speed={speed} oldLength={oldLength} length={length} />
              <Food food={food} />
            </div>
          </div>
        </div>
      </SwipeHandlerWrapper>
    )
  }
}

const SwipeHandlerWrapper = ({ children, onSwipe }) => {
  const handlers = useSwipeable({
    onSwipedUp: () => onSwipe(UP),
    onSwipedDown: () => onSwipe(DOWN),
    onSwipedLeft: () => onSwipe(LEFT),
    onSwipedRight: () => onSwipe(RIGHT),
  });

  return <div {...handlers} className="wrapper">{children}</div>
}
