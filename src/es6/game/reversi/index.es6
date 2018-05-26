// Gameクラス
import {Reversi} from "./reversi"
// UIクラス
import {UserInterface} from "./user-interface"
// Playerクラス
import {PrayerHuman} from "./player/human"
import {PrayerAiRandom} from "./player/ai-random"
import {PrayerAiMin} from "./player/ai-min"
import {PrayerAiPowerType} from "./player/ai-power-type"


/**
 * ゲームの管理クラス
 */
class GameMaster {
  constructor() {
    this.game = new Reversi()
    this.playerType = {
      "プレイヤー(手動)": new PrayerHuman(),
      "クロネコ(AI)": new PrayerAiRandom(),
      "チビネコ(AI)": new PrayerAiMin(),
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

// ゲーム開始
let gm = new GameMaster()
gm.run()
