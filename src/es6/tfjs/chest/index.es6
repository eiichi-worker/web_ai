import * as posenet from '@tensorflow-models/posenet';
const imageScaleFactor = 0.5;
const outputStride = 16;
const flipHorizontal = false;

async function estimatePoseOnImage(imageElement) {
  // load the posenet model from a checkpoint
  const net = await posenet.load();

  const pose = await net.estimateSinglePose(imageElement, imageScaleFactor, flipHorizontal, outputStride);

  return pose;
}

let sourceImagePathList = [
  "/img/tfjs/chest/35f5c00a64fd177334421cc03e445f6b_s.jpg",
  "/img/tfjs/chest/5cdab56b32b5695685f908355823d55d_s.jpg",
  "/img/tfjs/chest/3901b1c53f0d4abd671575b945d01e2b_s.jpg",
  "/img/tfjs/chest/boy_doughnut.jpg",
  "http://farm5.staticflickr.com/4101/5449803333_848a6d7456_z.jpg",
]
let poses = []

const imageElement = document.getElementById('source_img');
imageElement.src = sourceImagePathList[2]

imageElement.onload = async function() {
  // 画面に表示する
  var protImg = document.getElementById("plot_img")
  protImg.width = imageElement.width
  protImg.height = imageElement.height
  var ctx = protImg.getContext('2d');

  const pose = await estimatePoseOnImage(imageElement);
  poses.push(pose)
  console.log(pose);
  console.log(poses);

  ctx.drawImage(imageElement, 0, 0)

  poses.forEach(({ score, keypoints }) => {
    console.log(score)
    console.log(keypoints)

    for (var index in keypoints) {
      var position = keypoints[index].position
      var part = keypoints[index].part

      if (0.2 > keypoints[index].score) {
        return false
      }

      var leftShoulderPosition = []
      var rightShoulderPosition = []

      var color = "black"
      switch (part) {
        case "nose":
          color = "blue";
          break;
        case 'leftEye':
        case 'rightEye':
          color = "yellow";
          break;
        case 'leftEar':
        case 'rightEar':
          color = "green";
          break;
        case 'leftShoulder':
          leftShoulderPosition = position
          color = "red";
          break;
        case 'rightShoulder':
          rightShoulderPosition = position
          color = "red";
          break;
        default:
          break;
      }

      drawPoint(ctx, position.x, position.y, part, color)
    }

  });

}

function drawPoint(ctx, x, y, part, color) {
  ctx.beginPath();
  ctx.arc(x, y, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = color
  ctx.fillText(part, x, y)
  ctx.stroke();
}
