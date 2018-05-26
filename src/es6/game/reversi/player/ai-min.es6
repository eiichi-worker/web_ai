import { PrayerBase } from "./base"

export class PrayerAiMin extends PrayerBase {
  constructor(stoneId) {
    super(stoneId)
    this.name = '少なく取る（AI）'
    this.isInputAuto = true
  }
  selectPutPoint(game) {
    var point = shuffleArray(game.getCanPutPoint(game.bord, game.getTurn()))

    console.log("AIデバッグ：name=" + this.name)
    console.table(point)

    var minIndex = 0
    var minCount = Infinity
    for (var i in point) {
      var count = game.getTurneOverPointAllDirections(point[i][0], point[i][1], game.getTurn()).length
      console.log("AIデバッグ：name=" + this.name + " Minを探す：" + i + " 取れる数：" + count)
      if (count < minCount) {
        minIndex = i
        minCount = count
      }
    }
    console.log("AIデバッグ：name=" + this.name + " Min確定：" + minIndex + " 取れる数：" + minCount)

    return point[minIndex]
  }

  shuffleArray(ary) {
    var i = ary.length;
    while (i) {
      var j = Math.floor(Math.random() * i);
      var t = ary[--i];
      ary[i] = ary[j];
      ary[j] = t;
    }
    return ary;
  }
}
