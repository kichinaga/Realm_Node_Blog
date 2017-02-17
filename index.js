'use strict';

var express = require('express'),
    bodyParser = require('body-parser'),
    Realm = require('realm');

var app = express();

// Realmのスキーマ
let PostSchema = {
    // Realmモデルの名前,値はPost
    name: 'Post',
    // モデルの各種情報を保持するproperties属性
    properties: {
        timestamp: 'date',
        title: 'string',
        content: 'string'
    }
};

var blogRealm = new Realm({
    // path => DBのファイル名
    path: 'blog.realm',
    // DBで使用するモデルを配列で指定、[,]区切りで複数個のモデルを指定可能
    schema: [PostSchema]
});


app.use(bodyParser.urlencoded({extended: true}));
// テンプレートとしてejsの使用を宣言
app.set('view engine', 'ejs');


app.get('/', function(req, res){
    // blogRealmDBのPostオブジェクトを、日付昇順で全て入手(true=昇順,false=降順)
    let posts = blogRealm.objects('Post').sorted('timestamp', true);
    res.render('index.ejs', {posts: posts});
});

app.get('/write', function(req, res){
    res.sendFile(__dirname + '/write.html');
});

app.post('/write', function(req, res){
    let title = req.body["title"],
        content = req.body["content"],
        timestamp = new Date();

    // 書いた内容をRealmDBに保存
    blogRealm.write(() => {
        blogRealm.create('Post', {title: title, content: content, timestamp: timestamp });
    });

    // parseされた情報をwrite-compleate.htmlというファイル名で保存する
    res.sendFile(__dirname + "/write-compleate.html");
});

app.listen(3000, function(){
    console.log("listen port is 3000");
});
