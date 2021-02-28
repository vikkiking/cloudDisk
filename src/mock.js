const Mock = require('mockjs')

function generateToken(user) {
    return user.username + user.mail + user.password + parseInt(Math.random() * 100000)
}

function getParams(target, url) {
    let reg = new RegExp('[\?\&]' + target + '=([^&]*)(&|$)')
    let res = url.match(reg)
    if (res && res[1])
        return res[1]
    return false
}

let users = [
    {
        username: 'Admin',
        mail: '123@qq.com',
        password: '123456',
        token: '',
        img: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
    },
    {
        username: 'Bobby',
        mail: 'bobby@gmail.com',
        password: 'bob1998',
        token: '',
        img: 'https://a1cf74336522e87f135f-2f21ace9a6cf0052456644b80fa06d4f.ssl.cf2.rackcdn.com/images/characters_opt/p-supernatural-jim-beaver.jpg'
    },
    {
        username: 'Dean',
        mail: 'dean@gmail.com',
        password: 'Dean567',
        token: '',
        img: 'https://i.pinimg.com/originals/48/4d/82/484d829c4bf5b8103e1294e81a5413e8.png'
    },
    {
        username: 'Sam',
        mail: 'sam@gmail.com',
        password: 'sam123',
        token: '',
        img:'https://static.wikia.nocookie.net/supernaturalfanon/images/e/e6/Sam_S13.jpg/revision/latest?cb=20171210101620'
    },
]
Mock.mock('/loginBy', 'post', options => {
    options.body = JSON.parse(options.body)
    for (let i = 0; i < users.length; i++)
        if (users[i].mail === options.body.mail) {
            if (users[i].password === options.body.password) {
                users[i].token = generateToken(users[i])
                return Mock.mock({
                    'message': 'success',
                    "username": users[i].username,
                    "token": users[i].token,
                    "img":users[i].img
                })
            } else {
                return Mock.mock({
                    'message': 'failed',
                    'error': '密码错误'
                })
            }
        }
    return Mock.mock({
        'message': 'failed',
        'error': '您未注册'
    })
})
Mock.mock(/\/auth/, 'get', options => {
    let token = getParams('token', decodeURIComponent(options.url)),
        mail = getParams('mail', decodeURIComponent(options.url))
    //console.log(users)
    for (let i = 0; i < users.length; i++)
        if (mail === users[i].mail) {
            return Mock.mock({'message': token === users[i].token})
        }
    return Mock.mock({'message': 'false'})
})

