import {PrayerBase} from "./base"

export class PrayerAiPowerType extends PrayerBase {
  constructor(stoneId) {
    super(stoneId)
    this.name = 'パワー系（AI）'
    this.isInputAuto = true
  }
  selectPutPoint(game) {
    // TODO 実装
  }
}