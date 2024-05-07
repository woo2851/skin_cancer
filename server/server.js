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
const tf = require('@tensorflow/tfjs');
const fs = require('fs');
const csvParser = require('csv-parser');
const csvFilePath = 'data.csv';

const app = express()
app.use(cors());
app.use(bodyParser.json())
app.use(express.json())
app.use(express.urlencoded({extended : true}))

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '../public/upload/');
    },
    filename: function (req, file, cb) {
      cb(null, req.params.id + path.extname(file.originalname));
    }
  }),
});

const data = [];
const labels = [];

fs.createReadStream(csvFilePath)
  .pipe(csvParser())
  .on('data', (row) => {
    data.push(row);
  })
  .on('end', () => {
  
  data.map(row => {
    labels.push(row.label) 
  });
  data.map(row => {
    delete row.label
  });
  });

  async function loadModel() {
    const model = await tf.loadLayersModel("./model.json");
    console.log(model)
  }

  loadModel()


  
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
  });

app.get("/mypage/:id", async (req,res) => {

})

app.listen(4000, async () => {
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

  async function loadAndProcessData() {
    try {
        // CSV 파일 읽기
        const csvData = fs.readFileSync(csvFilePath, 'utf8');

        // CSV 데이터 파싱
        // 데이터를 피처와 레이블로 분리
        return { features, labels };
    } catch (err) {
        console.error('Error reading or parsing CSV file:', err);
        throw err;
    }
}

// 모델 학습 함수
async function trainModel(features, labels) {
  // 텐서로 변환
  const xs = tf.tensor(features);
  const ys = tf.scalar('int32');
  const reshapedXs = tf.layers.reshape({targetShape: [-1, 28, 28, 3]});

  // 모델 정의
  model.add(tf.layers.conv2d({
      inputShape: [28, 28, 3], // 이미지의 크기 및 채널 수
      kernelSize: 4, // 커널(필터) 크기
      filters: 16, // 필터 수
      activation: 'relu' // 활성화 함수
  }));
  model.add(tf.layers.maxPooling2d({ poolSize: [2, 2] }));
  model.add(tf.layers.flatten()); // 1차원 벡터로 평탄화
  model.add(tf.layers.dense({ units: 6, activation: 'softmax' }));

  // 모델 컴파일
  model.compile({ optimizer: 'adam', loss: 'categoricalCrossentropy', metrics: ['accuracy'] });

  // 데이터로 모델 학습
  await model.fit(reshapedXs, ys, { epochs: 10 });

  console.log('학습 완료');
}


