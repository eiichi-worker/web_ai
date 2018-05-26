/**
 * プレーヤーのベースクラス
 */
export class PrayerBase {
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
