const http = require('http');
const url = require("url");
const request = require("request");
const server = http.createServer();
let form = {
  zh: "",
  mm: ""
}
let loginCookie;
server.on('request', function(request, response) {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.writeHead(200, {
    'Content-Type': 'text/plain'
  });
  request.setEncoding('utf8');
  var str=url.parse(request.url,true).query;
  
  if (str && str.hblj) {
    reg().then(() => {
      return login(form)
    }).then(() => {
      const hblj = decodeURIComponent(str.hblj);
      return lingqu(hblj)
    }).then((msg) => {
      response.write(msg);
      response.end();
    })
  } else {
    response.write('ERROR');
    response.end();
  }
  
});

function createParams() {
const zh = 'a' + Math.floor(Math.random() * 10000);
const mm = '123';
const qrmm = '123';
const qq = String(Math.floor(Math.random() * 100000000));
return {
  zh,
  mm,
  qrmm,
  qq
}
}
function reg() {
const params = createParams();
console.log('注册', params);
return new Promise((resolve, reject) => {
  request.post('http://118.89.232.25/register.php?nSR', {
    form: params
  }, (err, response) => {
    r = response.body;
    form.zh = params.zh;
    form.mm = params.mm;
    console.log('注册回调', r);
    resolve()
  })
})
}
function login(params) {
  console.log('登录', params);
  
return new Promise((resolve) => {
  request.post('http://118.89.232.25/login.php?nSR', {
    form: params
  }, (err, response) => {
    loginCookie = response.headers["set-cookie"];
    console.log('登录Cookie', loginCookie);
    r = response.body;
    console.log('登录回调', r);
    resolve()
  })
})
}
function lingqu(hblj) {
  console.log('领取大红包', hblj);
  return new Promise((resolve) => {
    request.post('http://118.89.232.25/go.php?nSR', {
      form: {
        hblj
      },
      encoding: null,
      headers: {
        'Cookie': loginCookie
      }
    }, (err, response) => {
      r = response.body;
      resolve(r);
    })
  })
}
server.listen(10010, function() {
  console.log('服务器已经开始监听10010端口');
});



