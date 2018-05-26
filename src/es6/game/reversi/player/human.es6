import {PrayerBase} from "./base"

export class PrayerHuman extends PrayerBase {
  constructor(stoneId) {
    super(stoneId)
    this.name = 'プレイヤー'
  }
}
