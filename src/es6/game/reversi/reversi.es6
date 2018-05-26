/**
 * Reversiのコア
 */
export class Reversi {
  constructor() {
    this.initializationGame()
  }

  initializationGame() {
    this.turn = 1
    this.turnCount = 1
    this.bord = [...Array(8)].map(() => Array(8).fill(0))

    // 初期配置
    this.bord[3][3] = 2
    this.bord[4][4] = 2
    this.bord[3][4] = 1
    this.bord[4][3] = 1

    console.table(this.bord)
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

  /**
   * 空の場所を返す
   */
  getEmptyPoint(bord) {
    let stoneStack = []
    for (var rowIndex in bord) {
      for (var colIndex in bord[rowIndex]) {
        // console.log(bord[rowIndex][colIndex] + ':' + stoneId)
        if (0 == bord[rowIndex][colIndex]) {
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

  isGameEnd(){
    var tmpPutPoint = []
    .concat(this.getCanPutPoint(this.bord, 1))
    .concat(this.getCanPutPoint(this.bord, 2))


    return tmpPutPoint.length == 0
  }

  skipTurn() {
    if (this.isGameEnd()) {
      return false
    }

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
