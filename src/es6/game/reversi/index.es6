/**
 * 
 */
class GameMaster {
  constructor() {
    this.game = new Reversi()
    this.playerType = {
      "プレイヤー(手動)": new PrayerHuman(),
      "クロネコ(AI)": new PrayerAiRandom(),
      // "チャトラ(AI)": new PrayerAiPowerType(),
    }
    this.ui = new UserInterface(this.game, this.playerType, 'reversi_gui')
  }

  run() {
    console.log('開始')
    // UI準備
    this.ui.makeReversiTable()
  }
}

/**
 * UIとのつなぎ込み
 */
class UserInterface {
  constructor(game, playerType, targetId) {
    this.game = game
    this.playerType = playerType
    this.targetId = targetId
    this.stone = ['　', '⚫', '⚪']
    this.player = []
    this.aiSleep = 1000

    // プレイヤー選択
    for (let i of [1, 2]) {
      var selectBox = document.getElementById("player_select_" + i)

      for (var player in this.playerType) {
        var o = document.createElement("option")
        o.innerText = player
        selectBox.appendChild(o)
      }

      this.player[i] = selectBox.value
      selectBox.addEventListener('change', this.changePlayerSelect(this, this.game), true)
    }

    // Sleep
    var buttonSleep = document.getElementById("ai_sleep")
    buttonSleep.value = this.aiSleep
    buttonSleep.addEventListener('change', this.changeSleep(this, this.game), true)

    // スキップボタン
    var buttonSkip = document.getElementById("button_pass")
    buttonSkip.addEventListener('click', this.clickSkip(this, this.game), true)

  }

  makeReversiTable() {
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

  updateBord() {
    let data = this.game.bord

    for (var i = 0; i < data.length; i++) {
      for (var j = 0; j < data[0].length; j++) {
        var id = i + '_' + j
        var target = document.getElementById(id)
        target.style.background = 'white'
        target.innerText = this.stone[data[i][j]]
      }
    }
  }

  updateInfo() {
    // ターン数
    document.getElementById('turn_count').innerText = 'ターン数：' + this.game.getTurnCount()

    // 今のターン
    var target = document.getElementById('turn')
    target.innerText = 'ターン：' + this.stone[this.game.getTurn()]

    // ProgressBar
    var count1 = this.game.getCountStone(this.game.bord, 1)
    var count2 = this.game.getCountStone(this.game.bord, 2)
    // console.log(count1)
    // console.log(count2)
    document.getElementById('count_1').innerText = this.stone[1] + '：' + count1
    document.getElementById('count_2').innerText = this.stone[2] + '：' + count2

    document.getElementById('progress_1').style.width = (count1 / (count1 + count2) * 100) + '%'
    document.getElementById('progress_2').style.width = (count2 / (count1 + count2) * 100) + '%'

    // 置ける場所を表示
    console.table(this.game.getCanPutPoint(this.game.bord, this.game.turn))
    var canPutPoint = this.game.getCanPutPoint(this.game.bord, this.game.turn)
    for (var index in canPutPoint) {
      var id = canPutPoint[index][0] + '_' + canPutPoint[index][1]
      document.getElementById(id).style.background = '#CCFFCC'
    }
  }

  clickBord(ui, game) {
    return function(event) {
      var target = event.target
      var stone = target.innerText
      var id = target.id
      var rowIndex = id.split('_')[0]
      var colIndex = id.split('_')[1]

      // 自動操作判定
      if (ui.playerType[ui.player[game.getTurn()]].isInputAuto) {
        console.log("自動操作のターンです")
        return
      }

      // console.log("押した" +rowIndex +columnIndex)
      console.log('Click: [' + rowIndex + '][' + colIndex + ']=' + stone)
      if (stone == 0) {
        if (game.setStone(rowIndex, colIndex, game.getTurn())) {
          target.innerText = ui.stone[game.bord[rowIndex][colIndex]]
          ui.updateBord()
          ui.updateInfo()

          // aiのTurn処理
          ui.aiTurn()
        }

      }
    }
  }

  clickSkip(ui, game) {
    return function(event) {
      game.skipTurn()
      ui.updateBord()
      ui.updateInfo()
    }
  }

  async aiTurn() {
    // var rivalName = document.getElementById("player_select_2").value
    var aiPlayer = this.playerType[this.player[this.game.getTurn()]]

    if (!aiPlayer.isInputAuto) {
      console.log(this.player[this.game.getTurn()] + "は自動操作ではありません")
      return false
    }

    console.log(this.player[this.game.getTurn()] + "は自動操作です")
    await this.sleep(this.aiSleep);

    var putPoint = aiPlayer.selectPutPoint(this.game)
    console.log(putPoint)

    // 置く
    var target = document.getElementById(putPoint[0] + "_" + putPoint[1])
    this.game.setStone(putPoint[0], putPoint[1], this.game.getTurn()) // おいて次のターン
    target.innerText = this.stone[this.game.bord[putPoint[0]][putPoint[1]]]

    this.updateBord()
    this.updateInfo()

    // おいた場所に印をつける
    target.style.background = "#FFBBFF"

    // 次のターンが自動操作なら再実行
    if (this.playerType[this.player[this.game.getTurn()]].isInputAuto) {
      this.aiTurn()
    }

  }

  changePlayerSelect(ui, game) {
    return function(event) {
      var playerId = this.id.match(/([0-9])$/)[0]
      ui.player[playerId] = this.value
      console.log("Player" + playerId + "：" + ui.player[playerId])

      // 切り替えタイミングが自分のターンなら実行
      if (playerId == game.getTurn() && ui.playerType[ui.player[game.getTurn()]].isInputAuto) {
        console.log("自動操作開始です")
        ui.aiTurn()
      }
    }
  }

  mouseoverBord(ui, game) {
    return function(event) {
      var stone = event.target.innerText
      var id = event.target.id
      var rowIndex = id.split('_')[0]
      var colIndex = id.split('_')[1]
      // console.log("押した" +rowIndex +columnIndex)
      // console.log('mouseover: [' + rowIndex + '][' + colIndex + ']=' + stone)

      event.target.style.border = 'solid thick'
    }
  }

  mouseoutBord(ui, game) {
    return function(event) {
      var stone = event.target.innerText
      var id = event.target.id
      var rowIndex = id.split('_')[0]
      var colIndex = id.split('_')[1]
      // console.log("押した" +rowIndex +columnIndex)
      // console.log('mouseout: [' + rowIndex + '][' + colIndex + ']=' + stone)

      event.target.style.border = 'solid thin'
    }
  }

  changeSleep(ui, game) {
    return function(event) {
      ui.aiSleep = this.value
      console.log("aiSleep" + ui.aiSleep)
    }
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * Reversiのコア
 */
class Reversi {
  constructor() {
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

  setStone(rowIndex, colIndex, stoneId) {
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

  getTurneOverPointAllDirections(rowIndex, colIndex, stoneId) {
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
  getTurneOverPointUnidirectional(tergetRowIndex, tergetColIndex, directionRow, directionCol, tergetStoneId) {
    let nowRowIndex = Number(tergetRowIndex) + Number(directionRow)
    let nowColIndex = Number(tergetColIndex) + Number(directionCol)
    let stoneStack = []

    // 置こうとしている場所に既に石がないか確認
    if (!this.isOnBord(tergetRowIndex, tergetColIndex) || this.bord[tergetRowIndex][tergetColIndex] != 0) {
      return []
    }

    // 指定方向に同じ色の石があるまで途中の石をスタックしていく
    while (this.isOnBord(nowRowIndex, nowColIndex)) {
      var nowStoneId = this.bord[nowRowIndex][nowColIndex]
      // console.log('getTurneOverPoint:terget[' + tergetRowIndex + '][' + tergetColIndex + ']=' + tergetStoneId + ' now[' + nowRowIndex + '][' + nowColIndex + ']=' + nowStoneId)
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

  /**
   * 置ける場所を返す
   */
  getCanPutPoint(bord, stoneId) {
    let stoneStack = []
    for (var rowIndex in bord) {
      for (var colIndex in bord[rowIndex]) {
        // console.log(bord[rowIndex][colIndex] + ':' + stoneId)
        if (0 < this.getTurneOverPointAllDirections(rowIndex, colIndex, stoneId).length) {
          stoneStack.push([rowIndex, colIndex])
        }
      }
    }

    return stoneStack
  }

  isOnBord(rowIndex, colIndex) {
    // console.log(rowIndex)
    // console.log(colIndex)
    // console.log(this.bord.length)
    // console.log(this.bord[0].length)
    return (0 <= rowIndex && rowIndex < this.bord.length) && (0 <= colIndex && colIndex < this.bord[0].length)
  }

  skipTurn() {
    if (0 == this.getCanPutPoint(this.bord, this.getTurn()).length) {
      this.changeTurn()
    }
  }

  changeTurn() {
    this.turnCount++
      this.turn = this.turn == 1 ? 2 : 1
  }

  getTurn() {
    return this.turn
  }

  getTurnCount() {
    return this.turnCount
  }

  getRivalStoneId() {
    return this.turn == 1 ? 2 : 1
  }

  getCountStone(bord, stoneId) {
    var count = 0
    for (var rowIndex in bord) {
      for (var colIndex in bord[rowIndex]) {
        // console.log(bord[rowIndex][colIndex] + ':' + stoneId)
        count += (bord[rowIndex][colIndex] == stoneId) ? 1 : 0
      }
    }
    return count
  }

}

/**
 * プレーヤーのベースクラス
 */
class PrayerBase {
  constructor(stoneId) {
    this.name = ''
    this.stoneId = stoneId
    this.isInputAuto = false
  }

  setName(name) {
    this.name = name
  }

  getName() {
    return this.name
  }

  getStoneId() {
    return this.stoneId
  }

  selectPutPoint(game) {}
}

class PrayerHuman extends PrayerBase {
  constructor(stoneId) {
    super(stoneId)
    this.name = 'プレイヤー'
  }
}

class PrayerAiRandom extends PrayerBase {
  constructor(stoneId) {
    super(stoneId)
    this.name = 'ランダム君（AI）'
    this.isInputAuto = true
  }
  selectPutPoint(game) {
    var point = game.getCanPutPoint(game.bord, game.getTurn())
    return point[Math.floor(Math.random() * point.length)]
  }
}

// class PrayerAiPowerType extends PrayerBase {
//   constructor(stoneId) {
//     super(stoneId)
//     this.name = 'パワー系（AI）'
//     this.isInputAuto = true
//   }
//   selectPutPoint(game) {
//     var point = game.getCanPutPoint(game.bord, game.getTurn())
//     return point[Math.floor(Math.random() * point.length)]
//   }
// }

let gm = new GameMaster()
gm.run()
