const express = require("express");
const cors = require("cors");
const app = express();
const port = 3001;
const mysql  = require("mysql");
const fs = require("fs"); // 파일을 읽어오도록 !
const { normalize } = require("path");

const dbinfo = fs.readFileSync("./database.json");
const conf = JSON.parse(dbinfo); // json데이터를 객체 형태로 변경

// connection mysql연결 🧡
// createConnection()
// connection.connect() 연결하기
// connection.end() 연결종료
// connection.query('쿼리문', callback함수) → 쿼리문 넘겨주기, 잘되었는지 결과받기
// callback(error, result, field) → 에러, 결과, 결과의 필드정보

const connection = mysql.createConnection({
    host : conf.host,
    user : conf.user,
    password : conf.password,
    port : conf.port,
    database : conf.database,
})

app.use(express.json());
app.use(cors());

// http://localhost:3001/customers
app.get('/customers', async (req, res) => {
    // 연결하기, 넘기기, 연결끊기
    // connection.connect();
    connection.query ( // query문 작성, 결과 날려주기 ? 🧡
        "select * from customers_table",
        (err, rows, fields) => {
            res.send(rows); // 결과값, 안나오면 에러 찍어보기
            console.log(fields);
            // console.log(err);
        }
    )
    // connection.end();
})

app.get('/customer/:no', async (req, res) => {
    const params = req.params;
    connection.query ( // query문 작성, 결과 날려주기 ? 🧡
    `select * from customers_table where no=${params.no} `,
    (err, rows, fields) => {
        res.send(rows); // 결과값, 안나오면 에러 찍어보기
        console.log(fields);
        // console.log(err);
    }
)
    
app.post('/customers', async (req, res) => {
    const params = req.params;
    const { c_name, c_phone, c_birth, c_gender, c_add, c_adddetail } = body;
    connection.query (
        `insert into customers_table (c_name, c_phone, c_birth, c_gender, c_add, c_adddetail)
        values(
            
        )
        `,
        (err, rows, fields) => {
            res.send(rows);
            console.log(fields);
        }
    )
    }
    // connection.query('INSERT INTO posts SET ?',
    // {title: 'test'}, function (error, results, fields) {
    //     if (error) throw error;
    //     console.log(results.insertId);
    // });
      
)
    

    

})

// 서버실행
app.listen(port, () => {
    console.log("고객 서버가 돌아가고 있습니다.");
})