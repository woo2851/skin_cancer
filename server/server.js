require('dotenv').config()
const uri = process.env.URI
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
mongoose.set("strictQuery", false)
const User = require('./configs/user-model')
const multer = require('multer');
const cors = require('cors'); 
const bcrypt = require('bcrypt')
const path = require('path');
const tf = require('@tensorflow/tfjs-node')
const fs = require('fs')
const { BlobServiceClient } = require('@azure/storage-blob');
const { DefaultAzureCredential } = require('@azure/identity');
const { v1: uuidv1 } = require("uuid");

let model 
const app = express()
app.use(cors());
app.use(bodyParser.json())
app.use(express.json())
app.use(express.urlencoded({extended : true}))

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
  
app.post("/login/:id", async (req,res) => {
    try{
        const user = await User.findOne({ id: req.params.id }).exec();
        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        isMatch = await comparePassword(req.body.pw, user.pw)

        if(isMatch == true){
            token = generateToken(req.params.id)
            return res.json({token})
        }
        else {
            return res.status(401).json({ error: 'Invalid password' });
        }
    } catch(e){
        console.error(e);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post("/signup/:id", async (req,res) => {
    try{
        const user = await User.findOne({id: req.params.id}).exec()
        if (user) {
            console.log('user', user)
            return res.send("유저 존재")
        }
        else {
            req.body.pw = await hashPassword(req.body.pw);
            const user = await User.create(req.body)
            token = generateToken(req.params.id)
            return res.json({token})
        }
    }catch(e){
        console.error(e)
    }
})

app.post("/main/:id", upload.single('img'), async (req, res) => {
  const file = req.file
  const filename = req.params.id + "." +req.file.originalname.split(".")[1] 
  await uploadFile(file, filename)
  const result = await predict(file)
  let user_result = ""
  switch (result) {
    case 0:
      user_result = "광선 각화증" 
    case 1:
      user_result = "기저세포암"  
    case 2:
      user_result = "지루 각화증" 
    case 3:
      user_result = "피부 섬유종" 
    case 4:
      user_result = "멜라닌 세포성 모반" 
    case 5: 
      user_result = "화농성 육아종"
    case 6:  
      user_result = "흑색종" 
  }
  res.json({"result": user_result}) 
});  


app.get("/mypage/:id", async (req,res) => {
})

app.listen(4000, async () => {
    model = await loadModel()
    console.log("finished load model")
    console.log("server started")
    mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Successfully connected to mongodb'))
  .catch(e => console.error(e));
    console.log("mongodb connected")
})
  
 async function hashPassword(password){
    try {
      // Generate a salt
      const salt = 10;
      // Hash the password using the salt
      const hashedPassword = await bcrypt.hash(password, salt);
      return hashedPassword;
    } catch (error) {
      console.error('Error hashing password:', error);
      throw new Error('Could not hash password');
    }
  };

  async function comparePassword(password, hashedPassword){
    try {
      // Compare the password with the hashed password
      const isMatch = await bcrypt.compare(password, hashedPassword);
      return isMatch;
    } catch (error) {
      console.error('Error comparing passwords:', error);
      throw new Error('Could not compare passwords');
    }
  };

  function generateToken(id) {
    return id + '_token';
  }

async function loadModel() {
  const model = await tf.loadLayersModel("https://raw.githubusercontent.com/woo2851/skin_cancer/master/server/model.json",false);
  return model
}

async function imageToTensor(imageBuffer) {
  // 이미지 파일을 읽어들여 버퍼로 변환
  const imgTensor = tf.node.decodeImage(imageBuffer, 3)
  const resizedImgTensor = tf.image.resizeBilinear(imgTensor, [28, 28])
  const normalizedImgTensor = resizedImgTensor.toFloat().div(tf.scalar(255))
  const batchedImgTensor = normalizedImgTensor.expandDims(0)
  return batchedImgTensor;
}

async function predict(imagePath) {
  // 모델 로드
  const imgTensor = await imageToTensor(imagePath.buffer);
  const prediction = model.predict(imgTensor);
  const softmaxPredictions = tf.softmax(prediction)
  const probabilities = softmaxPredictions.arraySync()
  console.log("probabilities", probabilities)
  if (!prediction) {
    throw new Error('Prediction failed');
  }
    // 예측 결과를 텐서로 변환
  const predictedClass = prediction.argMax(-1).dataSync()[0];
  console.log(`Predicted class: ${predictedClass}`, probabilities[0][predictedClass]);
  return predictedClass 
}

async function connectCloud() {

  const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
  if (!accountName) throw Error('Azure Storage accountName not found');

  const credential = new DefaultAzureCredential();
  const blobServiceClient = new BlobServiceClient(
    `https://${accountName}.blob.core.windows.net`,credential
  );    

  return blobServiceClient
}

async function uploadFile(file, filename) {
  try {
    const blobServiceClient = await connectCloud()
    const blobName = filename
    const containerName = 'woo2851'

    console.log('\nConnecting container...'); 
    console.log('\t', containerName);

    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    /*await blockBlobClient.uploadData(file.buffer, {
      blobHTTPHeaders: { blobContentType: file.mimetype }
    }); */

    const uploadBlobResponse = await blockBlobClient.upload(file.buffer, filename.length);

    console.log(`Upload block blob ${blobName} successfully`, uploadBlobResponse.requestId);
  } catch (error) {
    console.error('Error uploading file to Azure Blob Storage:', error);
  }
}
