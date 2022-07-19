const express = require("express");
const cors = require("cors");
const app = express();
const port = 3001;
const mysql  = require("mysql");
const fs = require("fs"); // 파일을 읽어오도록 !
const { normalize } = require("path");
const { query } = require("express");

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

// app.get("경로", 함수)
// connection.query('쿼리문', callback함수)

// 고객 리스트 💜
// http://localhost:3001/customers
app.get('/customers', async (req, res) => {
    // 연결하기, 넘기기, 연결끊기
    // connection.connect();
    connection.query ( // query문 작성, 결과 날려주기 ? 🧡
        "select * from customers_table", // 다 조회하기
        (err, rows, fields) => {
            res.send(rows); // 결과값, 안나오면 에러 찍어보기
            // console.log(fields);
            // console.log(err);
        }
    )
    // connection.end();
})

// 고객 상세정보 💜
// http://localhost:3001/customer/1
app.get('/customer/:no', async (req, res) => { // req 요청, res 전송
    const params = req.params;
    connection.query (
    `select * from customers_table where no=${params.no}`, // 하나만 조회하기
    (err, rows, fields) => {
        res.send(rows[0]); // [0] > 배열에서 바로 객체로 받기위해 💚 {data[0].name} 안해줘도됨
        // res.send(rows);
    })
})

// 신규 고객 등록 💜
// addCustomer post요청이 오면 처리
// 첫번째 자리) req => 요청하는 객체, 두번째 자리) res => 응답하는 객체
app.post("/addCustomer", async (req, res) => { // Postman 으로 확인 💚
    // console.log(req); // 예시 > url: '/addCustomer', method: 'POST', body: { name: 'abv', age: 20 }
    // console.log(req.body); // 예시 > { name: 'abv', age: 20 }

    // 구조 분해 할당 💚 다른 변수에 한 번 더 옮겨담기
    // const { name, age } = req.body; // body.name 이 아닌 그냥 name으로 부르면됨 💚
    // console.log(name); // abv
    // console.log(age); // 20
    // res.send(req.body);

    const { c_name, c_phone, c_birth, c_gender, c_add, c_adddetail } = req.body;
    // connection.query("쿼리문", 함수(에러, 결과, 결과의 필드정보) => {})
    // mysql 쿼리 => select, update, delete, insert
    // insert into 테이블(컬럼1, 컬럼2, 컬럼3,...) values("값1", "값2", "값3",...)

    // 더 쉽게 ↓
    // query("쿼리", [값1, 값2, 값3,...]) => 배열 넣기 💚
    // insert into 테이블(컬럼1, 컬럼2, 컬럼3,...) values(?,?,?,...)

    // insert into customers_table(name, phone, birth, gender, add1, add2)
    // values(?,?,?,?,?,?)
    connection.query("insert into customers_table(name, phone, birth, gender, add1, add2) values(?,?,?,?,?,?)",
    [c_name, c_phone, c_birth, c_gender, c_add, c_adddetail],
    
    (err, result, field) => {
        console.log(result);
    })
    res.send("등록되었습니다.");
})

// 삭제하기 💜
// delete 쿼리문
// delete from 테이블명 조건절
// delete from customers_table where no = ${params.no}
app.delete("/delCustomer/:no", async (req, res) => {
    const params = req.params;
    console.log("삭제");
    connection.query(`delete from customers_table where no = ${params.no}`,
    (err, result, field) => {
        console.log(result);
    })
    res.send("삭제되었습니다.");
})

// 고객 정보 수정하기 💜
// update 테이블이름 set 컬럼명 = 값   where no = 값
// update customers_table
// set name='', phone='', birth ='', gender='', add1='', add2=''
// where no =
// 업데이트는 put으로 받기
// http://localhost:3001/editCustomer/1
app.put('/editCustomer/:no', async(req, res) => {
    // 파라미터 값을 가지고 있는 객체 /:no
    const params = req.params;
    const { c_name, c_phone, c_birth, c_gender, c_add, c_adddetail } = req.body;
    connection.query(`update customers_table 
    set name='${c_name}', phone='${c_phone}', birth ='${c_birth}', gender='${c_gender}', add1='${c_add}', add2='${c_adddetail}' 
    where no =${params.no}`, 
    (err, result, field) => {
        res.send(result);
    })
})
// http://localhost:3001/editCustomer/22
// 서버에서 먼저 test 꼭 하기 💚

// 서버실행 💜
app.listen(port, () => {
    console.log("고객 서버가 돌아가고 있습니다.");
})