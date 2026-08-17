import express from "express";
import cors from "cors";

function createApp() {
    const app = express();

    app.use(cors());
    app.use(express.json());
    app.get('/abc', (req, res) => {
        res.send('hello,node.js  get方法')
    }
    )
    app.post('/aaa', (req, res) => {
        res.send('hello,node.js  post方法')
    })
    app.listen(3000, () => {
        console.log(`✅ 后端服务已启动：http://localhost:3000`);
    });

    return app;
}
createApp();

