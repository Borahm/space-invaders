function init() {

  const grid = document.querySelector('.grid') // target the grid element
  document.addEventListener('keydown', handleKeyDown) // listening for key press

  // * Game stats

  let score = 0
  let lifeCounter = 3
  let wave = 0
  let gameIsRunning = false

  // * Grid

  const width = 20 // define the width
  const cellCount = width * width // define the number of cell on the grid
  const cells = [] // empty array to store our divs that we create

  // * Player and ship clases
  const playerShipClass = 'player-ship'
  const alienShipsClass = 'alien-ships'
  const playerLaserClass = 'player-laser'
  const alienLaserClass = 'alien-laser'
  const explosionClass = 'explosion'
  // const musicAudio = document.querySelector('#music')
  const shootAudio = document.querySelector('#shoot')
  const explosionAudio = document.querySelector('#explosion')
/*   const gameStartAudio = document.querySelector('#game-starts')
  const gameEndsAudio = document.querySelector('#game-ends')
  const gameOverAudio = document.querySelector('#game-over')
 */
  // * HTML elements
  const gameLifes = document.getElementById('game-lifes')
  const startButton = document.getElementById('start-button')
  const resetButton = document.getElementById('reset-button')
  const gameScore = document.getElementById('game-score')
  const gameWave = document.getElementById('game-wave')
  
  // * Intervals 
  
  // * Laser interval for player

  const playerLaserIntervalTime = 10 * 1
  let playerLaserMoving = false
  let playerLaserCurrentPosition
  let playerLaserInterval

  // * Laser interval for alien ships

  let alienLaserInterval
  const alienLaserIntervalTime = 100 * 1
  let alienLaserCurrentPosition
  let alienLaserCount = 0

  // * Randomized shooting
  let alienRandomShootInterval

  // * Interval for alien ship moving
  let alienShipInterval
  let alienShipIntervalTime = 500 * 1 

  // * Current alien ship that is shooting
 
  let lastScore
  let lastlifeCounter
  let lastWave

  // * Start + Current positions of the player, alien and rocket
  const playerShipStartPosition = 390 
  let playerShipCurrentPosition

  const alienShipsStartPosition = [66,67,68,69,70,71,72,73,85,86,87,88,89,90,91,92,93,94]
  let alienShipsCurrentPosition


  // * Make a grid and show ships etc.

  createGrid() // pass function the starting position of the cat
  addPlayerShip(playerShipStartPosition) 
  addAlienShips(alienShipsStartPosition)
  
  startButton.addEventListener('click', startGame)
  resetButton.addEventListener('click', resetGame)

  function createGrid() {
    for (let i = 0; i < cellCount; i++) { // for loop to run for every cell, in this case we want 100 cells
      const cell = document.createElement('div') // create the div
      // cell.innerText = i // inner text of the div to be its index
      grid.appendChild(cell) // make the cell a child of the grid element we grabbed above
      cells.push(cell) // add the newly created div into our empty array
    }
  }


  function startGame() {
    gameIsRunning = true
    startButton.disabled = true
    resetButton.disabled = false

    wave = 0
    score = 0
    lifeCounter = 3
    gameWave.innerText = wave
    gameScore.innerText = score
    gameLifes.innerText = lifeCounter
    alienShipIntervalTime = 10 * 1

    alienShipsCurrentPosition = [66,67,68,69,70,71,72,73,85,86,87,88,89,90,91,92,93,94]
    playerShipCurrentPosition = 390

    moveAlienShipInterval(alienShipsCurrentPosition)
    alienRandomShoot(alienShipsCurrentPosition)
  }
  
  function resetGame() {
    
    clearInterval(playerLaserInterval)
    clearInterval(alienRandomShootInterval)
    clearInterval(alienLaserInterval)
    clearInterval(alienShipInterval)

    removeAlienShips(alienShipsCurrentPosition)
    removePlayerShip(playerShipCurrentPosition)
    removeAlienLaser(alienLaserCurrentPosition)

    gameIsRunning = false
    startButton.disabled = false
    resetButton.disabled = true
    alienLaserCount = 0
    
    wave = 0
    score = 0
    lifeCounter = 3
    gameWave.innerText = wave
    gameScore.innerText = score
    gameLifes.innerText = lifeCounter
    alienShipIntervalTime = 500 * 1



    alienShipsCurrentPosition = [66,67,68,69,70,71,72,73,85,86,87,88,89,90,91,92,93,94]
    playerShipCurrentPosition = 390

    

    
    addAlienShips(alienShipsCurrentPosition)
    addPlayerShip(playerShipCurrentPosition)    

  }


  function gameEnds() {

    clearInterval(playerLaserInterval)
    clearInterval(alienRandomShootInterval)
    clearInterval(alienLaserInterval)
    clearInterval(alienShipInterval)

    removeAlienShips(alienShipsCurrentPosition)
    removePlayerShip(playerShipCurrentPosition)
    removeAlienLaser(alienLaserCurrentPosition)
    removeLaser(playerLaserCurrentPosition)

    gameIsRunning = true
    startButton.disabled = true
    resetButton.disabled = false
    alienLaserCount = 0

    lastWave = wave + 1
    lastScore = score
    lastlifeCounter = lifeCounter
    gameWave.innerText = wave
    alienShipIntervalTime - (10 * wave)

    wave = lastWave
    score = lastScore
    lifeCounter = lastlifeCounter

    gameWave.innerText = wave
    gameScore.innerText = score
    gameLifes.innerText = lifeCounter

    alienShipsCurrentPosition = [66,67,68,69,70,71,72,73,85,86,87,88,89,90,91,92,93,94]
    playerShipCurrentPosition = 390

    addAlienShips(alienShipsCurrentPosition)
    addPlayerShip(playerShipCurrentPosition)    

    moveAlienShipInterval(alienShipsCurrentPosition)
    alienRandomShoot(alienShipsCurrentPosition)
  
    // alert(`You won with ${score} points!`)
  }

  function gameOver () {
    // alert(`Game over with ${score} points!`)
  }
  // * Add playerShip to grid
  function addPlayerShip(position) {
    cells[position].classList.add(playerShipClass) 
  }

  // * Remove playerShip to grid
  function removePlayerShip(position) {
    cells[position].classList.remove(playerShipClass)
  }

  // * Add alienShips to grid

  function addAlienShips(position) { 
    position.forEach(element => {
      cells[element].classList.add(alienShipsClass)
    })
  }
  
  // * Remove alienShips from grid
  function removeAlienShips(position) { 
    position.forEach(element => {
      cells[element].classList.remove(alienShipsClass) 
    })
  }

  // * Move alienShips

  function movingAlienShips (alienShipsCurrentPosition,value) {
    alienShipsCurrentPosition.forEach((number, index) => alienShipsCurrentPosition[index] = number - value)
  }

  function moveAlienShipInterval(alienShipsCurrentPosition) {
    
    let direction = 'left'
    let cameFrom = 'right'
    let lastRow = false

    alienShipInterval = setInterval(() => { 
      removeAlienShips(alienShipsCurrentPosition)
    
      if (lastRow === true) {
        resetGame() 
        gameOver()
      } else if (alienShipsCurrentPosition.length === 0) {
        gameEnds()     
      } else if (gameIsRunning === true && direction === 'left') {
        movingAlienShips(alienShipsCurrentPosition,width/width)
        addAlienShips(alienShipsCurrentPosition)
      } else if (gameIsRunning === true && direction === 'right') {
        movingAlienShips(alienShipsCurrentPosition,-width/width)
        addAlienShips(alienShipsCurrentPosition)
      } else if (gameIsRunning === true && direction === 'down' && cameFrom === 'right') {
        movingAlienShips(alienShipsCurrentPosition,-width)
        addAlienShips(alienShipsCurrentPosition)
        direction = 'right'
      } else if (gameIsRunning === true && direction === 'down' && cameFrom === 'left') {
        movingAlienShips(alienShipsCurrentPosition,-width)
        addAlienShips(alienShipsCurrentPosition)
        direction = 'left'
      } 

      for (let i = 0; i < alienShipsCurrentPosition.length; i++) {  
        
        if (alienShipsCurrentPosition[i] % width === 0 && direction !== 'right') {
          direction = 'down'
          cameFrom = 'right'

        } else if (alienShipsCurrentPosition[i] % width === width - 1 && direction !== 'left') {
          direction = 'down'
          cameFrom = 'left'
        } else if (alienShipsCurrentPosition[i] >= cellCount - width) {
          lastRow = true
        }
      }
    }, alienShipIntervalTime)
  }

  function addExplosion(position) {
    cells[position].classList.add(explosionClass)
  }

  function removeExplosion(position) {
    setTimeout(() => {
      cells[position].classList.remove(explosionClass)
    }, 200)
  }

  function addLaser(playerLaserCurrentPosition) {
    cells[playerLaserCurrentPosition].classList.add(playerLaserClass)
  }

  function removeLaser(playerLaserCurrentPosition) {
    cells[playerLaserCurrentPosition].classList.remove(playerLaserClass)
  }

  function addAlienLaser(alienLaserCurrentPosition) {
    cells[alienLaserCurrentPosition].classList.add(alienLaserClass)
  }

  function removeAlienLaser(alienLaserCurrentPosition) {
    cells[alienLaserCurrentPosition].classList.remove(alienLaserClass)
  }


  // * Shoot laser by player 

  function playerShootLaser (playerLaserCurrentPosition) {
 
    playerLaserInterval = setInterval(() => {
      playerLaserMoving = true
      removeLaser(playerLaserCurrentPosition)
      playerLaserCurrentPosition -= width
      removeLaser(playerLaserCurrentPosition)

      //* Player laser hits an alien ship

      if (alienShipsCurrentPosition.find(element => element === playerLaserCurrentPosition)) { 
        cells[playerLaserCurrentPosition].classList.remove(alienShipsClass)
        addExplosion(playerLaserCurrentPosition)
        removeExplosion(playerLaserCurrentPosition)
        playerLaserMoving = false 
        explosionAudio.src = 'sounds/explosion.wav'
        explosionAudio.play()
        alienShipsCurrentPosition.splice(alienShipsCurrentPosition.findIndex(element => element === playerLaserCurrentPosition),1) // Remove the alien ship from the array 
        alienShipIntervalTime -= 5
        score += 100
        gameScore.innerText = score
        removeLaser(playerLaserCurrentPosition)
        clearInterval(playerLaserInterval) // Stop the interval

      } else if (playerLaserCurrentPosition <= width) { 
        playerLaserMoving = false     
        removeLaser(playerLaserCurrentPosition)
        clearInterval(playerLaserInterval)
        
      } else { // keep moving
        addLaser(playerLaserCurrentPosition)
      }

      //* Player laser hits an alien laser

       /* else if (alienLaserCurrentPosition.find(element => element === playerLaserCurrentPosition)) { 
        playerLaserMoving = false 
        explosionAudio.src = 'sounds/explosion.wav'
        explosionAudio.play()
        alienLaserCurrentPosition.splice(alienLaserCurrentPosition.findIndex(element => element === playerLaserCurrentPosition),1)
        removeLaser(playerLaserCurrentPosition)
        addExplosion(playerLaserCurrentPosition)
        removeLaser(playerLaserCurrentPosition)
        cells[alienLaserCurrentPosition.findIndex(element => element === playerLaserCurrentPosition)].classList.remove(alienLaserClass)
        clearInterval(playerLaserInterval)
      
      } */
    },playerLaserIntervalTime)
  }
 
  function alienRandomShoot(position) {
  
    alienRandomShootInterval = setInterval(() => {
      if (alienLaserCount < 1 ) {
        alienShootLaser(position)
        alienLaserCount += 1
      } 
    },(100 * Math.floor(Math.random() * 9)))

  }

  function alienShootLaser (position) {
    const currentAlienShipShooter = position[Math.floor(Math.random() * position.length)]   
    alienLaserCurrentPosition = currentAlienShipShooter   
    alienLaserInterval = setInterval(() => {
      removeAlienLaser(alienLaserCurrentPosition)
      alienLaserCurrentPosition += width
      addAlienLaser(alienLaserCurrentPosition)
    
      //* Alien laser hits player ship

      if (alienLaserCurrentPosition === playerShipCurrentPosition) { //Hit player ship
        removeAlienLaser(alienLaserCurrentPosition)
        addExplosion(alienLaserCurrentPosition)
        removeExplosion(alienLaserCurrentPosition)
        
        explosionAudio.src = 'sounds/explosion.wav'
        explosionAudio.play()
        lifeCounter -= 1
        alienLaserCount -= 1
        gameLifes.innerText = lifeCounter
        
        if (lifeCounter === 0) {
          resetGame()  
          gameOver()
        }
        clearInterval(alienLaserInterval)       

        
      } else if (alienLaserCurrentPosition >= 380 && alienLaserCurrentPosition !== playerShipCurrentPosition) { 
        
        alienLaserCount -= 1
        removeAlienLaser(alienLaserCurrentPosition)
        clearInterval(alienLaserInterval)

      } else if (alienLaserCurrentPosition <= 400) { // keep moving
        removeAlienLaser(alienLaserCurrentPosition)
        
        cells[alienLaserCurrentPosition].classList.add(alienLaserClass)
      } 

      /* else if (alienLaserCurrentPosition === playerLaserCurrentPosition) { 
        console.log('laser hit laser')
          
        explosionAudio.src = 'sounds/explosion.wav'
        explosionAudio.play()
        removeAlienLaser(alienLaserCurrentPosition)
        removeLaser(playerLaserCurrentPosition)
        addExplosion(playerLaserCurrentPosition)
        removeExplosion(playerLaserCurrentPosition)
        
        clearInterval(alienLaserInterval)

        // * Missed player ship
        
      } */
    },alienLaserIntervalTime)
  
  }

  // * Move player Ship
  function handleKeyDown(event) {
    const key = event.keyCode // store the event.keyCode in a variable to save us repeatedly typing it out
    const left = 37
    const right = 39
    const space = 32
    
    if (key === right && playerShipCurrentPosition % width !== width - 1 && gameIsRunning) { // if the right arrow is pressed and the cat is not on the right edge
      removePlayerShip(playerShipCurrentPosition) 
      playerShipCurrentPosition++
      addPlayerShip(playerShipCurrentPosition)
    } else if (key === left && playerShipCurrentPosition % width !== 0 && gameIsRunning) { // if the left arrow is pressed and the cat is not on the left edge
      removePlayerShip(playerShipCurrentPosition) 
      playerShipCurrentPosition-- // redefine cat position index to be previous position minus 1
      addPlayerShip(playerShipCurrentPosition)
    } else if (key === space && playerLaserMoving === false && gameIsRunning === true) {
      // shootAudio.src = 'sounds/shoot.wav'
      // shootAudio.play()
      console.log('shoot');
      playerShootLaser(playerShipCurrentPosition) 
    } 
  }
}

window.addEventListener('DOMContentLoaded', init)