/**
 * 
 */
class GameMaster {
  constructor () {
    this.game = new Reversi()
    this.ui = new UserInterface(this.game, 'reversi-gui')
  }

  run () {
    console.log('開始')
    // UI準備
    this.ui.makeReversiTable()
  }
}

/**
 * UIとのつなぎ込み
 */
class UserInterface {
  constructor (game, targetId) {
    this.game = game
    this.targetId = targetId
    this.stone = ['　', '⚫', '⚪']
  }

  makeReversiTable () {
    let target = document.getElementById(this.targetId)
    let table = document.createElement('table')
    let data = this.game.bord

    // table.width = "100%"
    // console.log(this.bord.length)

    for (var i = 0; i < data.length; i++) {
      var tmpRow = document.createElement('tr')
      for (var j = 0; j < data[0].length; j++) {
        var tmpCell = document.createElement('td')
        tmpCell.width = '5rem'
        tmpCell.height = '5rem'
        tmpCell.innerText = this.stone[data[i][j]]
        // tmpCell.onclick = this.clickBord(i,j)
        tmpCell.id = i + '_' + j
        tmpCell.addEventListener('click', this.clickBord(this, this.game), true)
        tmpCell.addEventListener('mouseover', this.mouseoverBord(this, this.game), true)
        tmpCell.addEventListener('mouseout', this.mouseoutBord(this, this.game), true)
        tmpRow.appendChild(tmpCell)
      }
      table.appendChild(tmpRow)
    }

    target.appendChild(table)
    this.updateInfo()
  }

  updateBord () {
    let data = this.game.bord

    for (var i = 0; i < data.length; i++) {
      for (var j = 0; j < data[0].length; j++) {
        var id = i + '_' + j
        var target = document.getElementById(id)

        target.innerText = this.stone[data[i][j]]
      }
    }
  }

  updateInfo () {
    // ターン数
    document.getElementById('turn_count').innerText = 'ターン数：' + this.game.getTurnCount()

    // 今のターン
    var target = document.getElementById('turn')
    target.innerText = 'ターン：' + this.stone[this.game.getTurn()]

    // ProgressBar
    var count1 = this.game.getCountStone(this.game.bord, 1)
    var count2 = this.game.getCountStone(this.game.bord, 2)
    console.log(count1)
    console.log(count2)
    document.getElementById('count_1').innerText = this.stone[1] + '：' + count1
    document.getElementById('count_2').innerText = this.stone[2] + '：' + count2

    document.getElementById('progress_1').style.width = (count1 / (count1 + count2) * 100) + '%'
    document.getElementById('progress_2').style.width = (count2 / (count1 + count2) * 100) + '%'
  }

  clickBord (ui, game) {
    return function (event) {
      var target = event.target
      var stone = target.innerText
      var id = target.id
      var rowIndex = id.split('_')[0]
      var colIndex = id.split('_')[1]
      // console.log("押した" +rowIndex +columnIndex)
      console.log('Click: [' + rowIndex + '][' + colIndex + ']=' + stone)
      if (stone == 0) {
        game.setStone(rowIndex, colIndex, game.getTurn())
        target.innerText = ui.stone[game.bord[rowIndex][colIndex]]
        ui.updateBord()
        ui.updateInfo()
      }
    }
  }

  mouseoverBord (ui, game) {
    return function (event) {
      var stone = event.target.innerText
      var id = event.target.id
      var rowIndex = id.split('_')[0]
      var colIndex = id.split('_')[1]
      // console.log("押した" +rowIndex +columnIndex)
      console.log('mouseover: [' + rowIndex + '][' + colIndex + ']=' + stone)

      event.target.style.border = 'solid thick'
    }
  }

  mouseoutBord (ui, game) {
    return function (event) {
      var stone = event.target.innerText
      var id = event.target.id
      var rowIndex = id.split('_')[0]
      var colIndex = id.split('_')[1]
      // console.log("押した" +rowIndex +columnIndex)
      console.log('mouseout: [' + rowIndex + '][' + colIndex + ']=' + stone)

      event.target.style.border = 'solid thin'
    }
  }
}

/**
 * Reversiのコア
 */
class Reversi {
  constructor () {
    this.turn = 1
    this.turnCount = 1
    this.bord = [...Array(8)].map(() => Array(8).fill(0))

    this.bord[3][3] = 2
    this.bord[4][4] = 2
    this.bord[3][4] = 1
    this.bord[4][3] = 1

    console.table(this.bord)

  // var canvas = document.getElementById(CANVAS_ID)
  // if (canvas.getContext) {
  //   var context = canvas.getContext('2d')
  //   context.beginPath()
  //   context.fillRect(20, 20, 80, 40)
  // }
  }

  setStone (rowIndex, colIndex, stoneId) {
    console.table(this.bord)
    if (this.bord[rowIndex][colIndex] != 0) {
      return false
    }

    let turneOverPointList = this.getTurneOverPointAllDirections(rowIndex, colIndex, stoneId)
    console.table(turneOverPointList)
    if (0 < turneOverPointList.length) {
      // 置く
      this.bord[rowIndex][colIndex] = stoneId
      // ひっくり返す
      for (let point of turneOverPointList) {
        this.bord[point[0]][point[1]] = stoneId
      }

      this.changeTurn()
      return true
    }
  }

  getTurneOverPointAllDirections (rowIndex, colIndex, stoneId) {
    return []
      .concat(this.getTurneOverPointUnidirectional(rowIndex, colIndex, -1, 0, stoneId)) // ↑
      .concat(this.getTurneOverPointUnidirectional(rowIndex, colIndex, 1, 0, stoneId)) // ↓
      .concat(this.getTurneOverPointUnidirectional(rowIndex, colIndex, 0, 1, stoneId)) // →
      .concat(this.getTurneOverPointUnidirectional(rowIndex, colIndex, 0, -1, stoneId)) // ←
      .concat(this.getTurneOverPointUnidirectional(rowIndex, colIndex, -1, 1, stoneId)) // ↑→
      .concat(this.getTurneOverPointUnidirectional(rowIndex, colIndex, -1, -1, stoneId)) // ↑←
      .concat(this.getTurneOverPointUnidirectional(rowIndex, colIndex, 1, 1, stoneId)) // ↓→
      .concat(this.getTurneOverPointUnidirectional(rowIndex, colIndex, 1, -1, stoneId)) // ↓←
  }

  /**
   * 指定方向にひっくり返せる石の座標を返す
   * @param tergetRowIndex 
   * @param tergetColIndex 
   * @param directionRow 
   * @param directionCol 
   * @param tergetStoneId 
   */
  getTurneOverPointUnidirectional (tergetRowIndex, tergetColIndex, directionRow, directionCol, tergetStoneId) {
    let nowRowIndex = Number(tergetRowIndex) + Number(directionRow)
    let nowColIndex = Number(tergetColIndex) + Number(directionCol)
    let stoneStack = []

    while (this.isOnBord(nowRowIndex, nowColIndex)) {
      var nowStoneId = this.bord[nowRowIndex][nowColIndex]
      console.log('getTurneOverPoint:terget[' + tergetRowIndex + '][' + tergetColIndex + ']=' + tergetStoneId + ' now[' + nowRowIndex + '][' + nowColIndex + ']=' + nowStoneId)
      if (nowStoneId == 0) {
        // 隣が空白
        return []
      } else if (tergetStoneId == nowStoneId) {
        // 同じ色なら終わり
        return stoneStack
      } else {
        // そうでなければスタック
        stoneStack.push([nowRowIndex, nowColIndex])
      }

      // 隣に移動
      nowRowIndex += Number(directionRow)
      nowColIndex += Number(directionCol)

    // console.table(stoneStack)
    }

    return []
  }

  isOnBord (rowIndex, colIndex) {
    console.log(rowIndex)
    console.log(colIndex)
    console.log(this.bord.length)
    console.log(this.bord[0].length)
    return (0 <= rowIndex && rowIndex < this.bord.length) && (0 <= colIndex && colIndex < this.bord[0].length)
  }

  changeTurn () {
    this.turnCount++
    this.turn = this.turn == 1 ? 2 : 1
  }

  getTurn () {
    return this.turn
  }

  getTurnCount () {
    return this.turnCount
  }

  getRivalStoneId () {
    return this.turn == 1 ? 2 : 1
  }

  getCountStone (bord, stoneId) {
    var count = 0
    for (var rowIndex in bord) {
      for (var colIndex in bord[rowIndex]) {
        console.log(bord[rowIndex][colIndex] + ':' + stoneId)
        count += (bord[rowIndex][colIndex] == stoneId) ? 1 : 0
      }
    }
    return count
  }

}

let gm = new GameMaster()
gm.run()
