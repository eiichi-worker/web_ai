import {PrayerBase} from "./base"

export class PrayerAiRandom extends PrayerBase {
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
