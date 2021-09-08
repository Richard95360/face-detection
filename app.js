const fileUpload = document.getElementById("fileUpload");
const uploadedImageDiv = document.getElementById("uploadedImage");

fileUpload.addEventListener("change", getImage, false);

const MODEL_URL = "./models";

let modelsLoad = [];

faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL).then(() => {
  modelsLoad = [...modelsLoad, "tinyFaceDetector loaded"]
})

faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL).then(() => {
  modelsLoad = [...modelsLoad, "ssdMobilenetv1 loaded"]
})

function getImage() {
  //remove the previous image
  uploadedImageDiv.innerHTML = "";

  console.log("images", this.files[0]);
  const imageToProcess = this.files[0];

  let image = new Image(imageToProcess.width, imageToProcess.height);
  image.src = URL.createObjectURL(imageToProcess)
  // uploadedImageDiv.style.border = "4px solid #FCB514";
  uploadedImageDiv.appendChild(image)
  image.addEventListener("load", () => {

    const imageDimensions = {
      width: image.width,
      height: image.height
    }
    const data = {
      image,
      imageDimensions
    }
    processImage(data)
  })
}

function processImage({
  image,
  imageDimensions
}) {
  if (modelsLoad.length !== 2) {
    console.log("please wait while: models are still loading");
    return;
  }
  faceapi.detectAllFaces(image).then(facesDetected => {
    facesDetectedImage = faceapi.resizeResults(image, {
      height: imageDimensions.height,
      width: imageDimensions.width
    });
    const canvas = faceapi.createCanvasFromMedia(image);
    faceapi.draw.drawDetections(canvas, facesDetected);
    uploadedImageDiv.innerHTML = "";
    uploadedImageDiv.appendChild(canvas);
    canvas.style.position = "absolute";
    canvas.style.top = uploadedImageDiv.y + "px";
    canvas.style.left = uploadedImageDiv.x + "px";

    facesDetected.map(face => {
      faceapi.draw.drawDetections(canvas, face)
    })
  })
}