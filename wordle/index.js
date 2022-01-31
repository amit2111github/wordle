let box = document.getElementById('box')
let keyboard = document.getElementById('keyboard')
const makeBoard = () => {
  for (let i = 0; i < 6; i++) {
    let row = document.createElement('div')
    row.className = 'row'
    for (let j = 0; j < 5; j++) {
      let col = document.createElement('div')
      col.className = 'tile'
      row.appendChild(col)
    }
    box.appendChild(row)
  }
}
const keys = ['qwertyuiop', 'asdfghjkl', 'zxccvbnm']
const makeKeyBoard = () => {
  for (let key of keys) {
    let row = document.createElement('div')
    row.className = 'keyboardrow'
    for (let char of key) {
      let button = document.createElement('button')
      button.textContent = char
      button.value = char
      button.className = 'button'
      row.appendChild(button)
    }
    keyboard.appendChild(row)
  }
  let enter = document.createElement('button')
  enter.textContent = 'enter'
  enter.value = 'enter'
  enter.className = 'button'
  enter.style.width = '60px'
  keyboard.lastChild.prepend(enter)
  let backspace = document.createElement('button')

  backspace.innerHTML = `<svg
      xmlns='http://www.w3.org/2000/svg'
      height='14'
      viewBox='0 0 24 24'
      width='24'
    >
      <path
        fill='var(--color-tone-1)'
        d='M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.9.89 1.59.89h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H7.07L2.4 12l4.66-7H22v14zm-11.59-2L14 13.41 17.59 17 19 15.59 15.41 12 19 8.41 17.59 7 14 10.59 10.41 7 9 8.41 12.59 12 9 15.59z'
      ></path>
    </svg>`
  backspace.value = 'backspace'
  backspace.style.fontSize = '12px'
  backspace.className = 'button'

  keyboard.lastChild.appendChild(backspace)
}
makeBoard()
makeKeyBoard()
const dict = ['apple', 'mango', 'click', 'float', 'shark', 'legal']
const validWords = [dict[Math.floor(Math.random() * dict.length)]]
let attempts = []
let curIndex = 0
window.addEventListener('keydown', (event) => {
  let { key } = event
  handleEvent(key)
})
const changeBoard = (key, attempts) => {
  let currentRow = box.childNodes[curIndex]
  if (attempts[curIndex] && attempts[curIndex].length == 5) return
  appendLetter(key, currentRow, attempts)
}
const appendLetter = (key, currentRow, attempts) => {
  let currentTile = currentRow.firstChild
  for (let i = 0; i < 5; i++) {
    if (!currentTile.textContent) {
      if (!attempts[curIndex]) attempts[curIndex] = key
      else attempts[curIndex] += key
      currentTile.textContent = key.toUpperCase()
      return
    }
    currentTile = currentTile.nextSibling
  }
}
const showPartialResult = (index, attempts) => {
  console.log(attempts[index], attempts)
  if (!attempts[index] || attempts[index].length < 5) {
    alert('few attempts')
    return
  }

  const row = box.childNodes[index]
  for (let i = 0; i < 5; i++) {
    let isPerfect = false,
      isPresent = false
    for (let word of validWords) {
      if (word[i] === attempts[index][i]) isPerfect = true
      if (word.includes(attempts[index][i])) isPresent = true
    }
    if (isPerfect) {
      row.childNodes[i].style.backgroundColor = '#6aaa64'
      row.childNodes[i].style.color = '#fff'
      row.childNodes[i].style.border = '1px solid #538d4e'
    } else if (isPresent) {
      row.childNodes[i].style.backgroundColor = '#c9b458'
      row.childNodes[i].style.color = '#fff'
      row.childNodes[i].style.border = '1px solid #b59f3b'
    } else {
      row.childNodes[i].style.backgroundColor = '#787C7E'
      row.childNodes[i].style.color = '#fff'
      row.childNodes[i].style.border = '1px solid #939598'
    }
  }
  if (attempts[index] === validWords[0]) {
    setTimeout(() => {
      alert('MAGNIFICIENT')
      curIndex = 0
      endGame()
    }, 10)
  }
  curIndex++
  if (curIndex > 5) {
    setTimeout(() => {
      alert('You LOOSE')
      alert(`Answer was ${validWords[0]}`)
      endGame()
    }, 10)
  }
}
const endGame = () => {
  attempts = []
  window.location.reload()
}
const deleteCharacter = (attempts) => {
  if (!attempts[curIndex] || attempts[curIndex].length <= 0) {
    alert('No Character to delete')
    return
  }
  let row = box.childNodes[curIndex]
  let currentTile = row.firstChild
  for (let i = 0; i < 5; i++) {
    if (currentTile.textContent) {
      currentTile = currentTile.nextSibling
    } else {
      break
    }
  }
  if (currentTile === null) currentTile = row.childNodes[4]
  else currentTile = currentTile.previousSibling
  currentTile.textContent = undefined
  let word = attempts[curIndex]
  attempts[curIndex] = word.substring(0, word.length - 1)
}

window.addEventListener('click', (event) => {
  if (event.target.className === 'button') {
    handleEvent(event.target.value)
  }
})

const handleEvent = (key) => {
  key = key.toLocaleLowerCase()
  if (key === 'ctrl' || key === 'alt' || key === 'shift') return
  if (key === 'backspace') {
    deleteCharacter(attempts)
  }
  if (key === 'enter') {
    showPartialResult(curIndex, attempts)
  }
  if (key >= 'a' && key <= 'z' && key.length == 1) {
    changeBoard(key, attempts)
  }
}
