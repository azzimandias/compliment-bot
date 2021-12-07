const TelegramApi = require('node-telegram-bot-api')
const axios = require('axios')
const cheerio = require('cheerio')
const fs = require('fs')
const path = require('path')
require('dotenv').config()
const token = process.env.BOT_TOKEN
const devId = process.env.DEV_ID
const testerId = process.env.TESTER_ID
const userId = process.env.USER_ID
const bot = new TelegramApi(token, {polling: true})
const ver = '1.1.0'
const programmerStickersArray = [
    "https://cdndelivr.com/stickerset/codebark/12/webp",
    "https://cdndelivr.com/stickerset/codebark/13/webp",
    "https://cdndelivr.com/stickerset/codebark/14/webp",
    "https://cdndelivr.com/stickerset/codebark/15/webp",
    "https://cdndelivr.com/stickerset/codebark/16/webp",
    "https://cdndelivr.com/stickerset/codebark/17/webp",
    "https://cdndelivr.com/stickerset/codebark/18/webp",
    "https://cdndelivr.com/stickerset/codebark/19/webp",
    "https://cdndelivr.com/stickerset/codebark/20/webp",
    "https://cdndelivr.com/stickerset/codebark/21/webp",
    "https://cdndelivr.com/stickerset/codebark/22/webp",
    "https://cdndelivr.com/stickerset/codebark/23/webp",
    "https://cdndelivr.com/stickerset/codebark/24/webp"
]

const corgiPhotosArray = []
const cuteStickersArray = [
    "https://cdndelivr.com/stickerset/blimchik_vk/7/webp",
    "https://cdndelivr.com/stickerset/blimchik_vk/6/webp",
    "https://cdndelivr.com/stickerset/blimchik_vk/8/webp",
    "https://cdndelivr.com/stickerset/blimchik_vk/19/webp",
    "https://cdndelivr.com/stickerset/blimchik_vk/20/webp",
    "https://cdndelivr.com/stickerset/blimchik_vk/24/webp",
    "https://cdndelivr.com/stickerset/blimchik_vk/27/webp",
    "https://cdndelivr.com/stickerset/blimchik_vk/32/webp",
    "https://cdndelivr.com/stickerset/blimchik_vk/33/webp",
    "https://cdndelivr.com/stickerset/blimchik_vk/11/webp"
]

const errorPhrases = [
    'Я еще не достаточно надрессирован чтобы что-то отвечать!! 🦴',
    'Гав-гав 🐕',
    'Когда-нибудь хозяин придумает, что можно на это ответить 🥺',
    'На этом мои полномочия всё',
    'Не могу ответить, спроси у Андрея'
]
const compliments = []
let arr = []
let isSuccess = ''
let currentDate = 0
let firstCompTime = 0
let secondCompTime = 0
let fir = false
let sec = false

function randomInteger(min, max) {
    let rand = min - 0.5 + Math.random() * (max - min + 1);
    return Math.round(rand);
}

const parseCompliments = async () => {
    const getHTML = async (url) => {
        const {data} = await axios.get(url)
        return cheerio.load(data)
    }
    const $ = await getHTML('http://kompli.me/komplimenty-lyubimoj')
    const pageNumber = $('a.page-numbers').eq(-2).text()
    for (let i = 1; i <= pageNumber; i++) {
        const selector = await getHTML(`http://kompli.me/komplimenty-lyubimoj/page/${i}`)
        selector('.post-card__title').each((i, element) => {
            const title = selector(element).find('a').text()
            compliments.push(title)
        })
    }
    if (!(fs.statSync(path.join(__dirname, 'data', 'compliments.txt'))).size) {
        mutateCompliments(compliments)
    }
    await activateInterval()
}

function mutateCompliments(array) {
    fs.writeFile(path.join(__dirname, 'data', 'compliments.txt'), JSON.stringify(array), err => {
        if (err) console.log(err)
    })
}

function readCompliments() {
    fs.readFile(
        path.join(__dirname, 'data', 'compliments.txt'),
        'utf-8',
        (err, content) => {
            if (err) console.log(err)
            arr = JSON.parse(content)}
    )
}

const parseStickersProgrammer = async () => {
    const getHTML = async (url) => {
        const {data} = await axios.get(url)
        return cheerio.load(data)
    }
    const selector = await getHTML(`https://telestorm.ru/stickers/codebark`)
    selector('.sticker').each((i, element) => {
        const sticker = selector(element).find('img').attr('src')
        programmerStickersArray.push(`${sticker}`)
    })
}

const parseCorgisPhotos = async () => {
    const getHTML = async (url) => {
        const {data} = await axios.get(url)
        return cheerio.load(data)
    }
    const selector = await getHTML(`https://www.pinterest.com/ladybugcorgi/corgi-puppies/`)
    selector('div.PinCard__imageWrapper').each((i, element) => {
        const img = selector(element).find('img').attr('src')
        corgiPhotosArray.push(`${img}`)
    })
}

async function activateInterval() {
    isSuccess = 'deploy success'
    console.log('deploy success')
    const complimentInterval = setInterval(() => {
        let date = new Date();
        readCompliments()
        /*if (!arr.length) {
            clearInterval(complimentInterval)
        }
        else*/ if (date.getDate() === currentDate) {
            if (date.getHours() === firstCompTime && !fir) {
                fir = !fir
                sendCompliment()
                arr.splice(0, 1);
                mutateCompliments(arr)
            }
            else if (date.getHours() === secondCompTime && !sec) {
                sec = !sec
                sendCompliment()
                arr.splice(0, 1);
                mutateCompliments(arr)
            }
        }
        else {
            currentDate = date.getDate()
            firstCompTime = randomInteger(4, 13) + 3
            secondCompTime = randomInteger(14, 20) + 3
            console.log(`fir - ${firstCompTime}, sec - ${secondCompTime}`)
            fir = false
            sec = false
        }
    }, 60000);
}

async function sendComplimentForce() {
    readCompliments()
    await sendCompliment()
    arr.splice(0, 1);
    mutateCompliments(arr)
}

async function sendCompliment() {
    await bot.sendMessage(devId, `${arr[0]}\n❤️💫💘❤️‍🔥\n#compliment`)
    await bot.sendMessage(testerId, `${arr[0]}\n❤️💫💘❤️‍🔥\n#compliment`)
    await bot.sendMessage(userId, `${arr[0]}\n❤️💫💘❤️‍🔥\n#compliment`)
    if (randomInteger(0, 9) > 4) {
        let sticker = randomInteger(0, 9)
        await bot.sendSticker(devId, `${cuteStickersArray[sticker]}`)
        await bot.sendSticker(testerId, `${cuteStickersArray[sticker]}`)
        await bot.sendSticker(userId, `${cuteStickersArray[sticker]}`)
    }
    else {
        let photo = randomInteger(0, 24)
        await bot.sendPhoto(devId, `${corgiPhotosArray[photo]}`)
        await bot.sendPhoto(testerId, `${corgiPhotosArray[photo]}`)
        await bot.sendPhoto(userId, `${corgiPhotosArray[photo]}`)
    }
}

parseStickersProgrammer().catch(err => {if (err) throw err})
parseCorgisPhotos().catch(err => {if (err) throw err})
parseCompliments().catch(err => {if (err) throw err})

async function forDev(text, msg) {
    if (text === '/start') {
        await bot.sendMessage(devId, `${msg.from.first_name} - ты моя хозяйка!\nЯ тебя люблю! ❤️❤️❤️\n#purelove`);
        await  bot.sendSticker(devId, 'https://tlgrm.ru/_/stickers/6dd/71d/6dd71dd3-89eb-4f4c-b5c4-9dc46269d022/192/33.webp');
    }
    else if (text === '/info') {
        await bot.sendMessage(devId, `@Corgi_In_Love_bot ver:${ver}\nНаведу шороху в твоем тг!\n#informator`);
        await  bot.sendSticker(devId, 'https://tlgrm.ru/_/stickers/6dd/71d/6dd71dd3-89eb-4f4c-b5c4-9dc46269d022/192/15.webp');
    }
    else if (text.split('\n')[0] === '/send' && text.split('\n')[1] !== ' ') {
        await bot.sendMessage(userId, `@azzimandias\n${text.split('\n')[1]}\n#master`);
    }
    else if (text === '/comp') {
        await sendComplimentForce();
    }
    else if (text === '/log') {
        await bot.sendMessage(devId, `Status - ${isSuccess}\nFirst comp - ${firstCompTime}\nSecond comp - ${secondCompTime}\n#log`)
    }
    else {
        await bot.sendMessage(devId, `${errorPhrases[randomInteger(0, 4)]}\n#dev #prog`)
        await bot.sendSticker(devId, `${programmerStickersArray[randomInteger(0, 24)]}`)
    }
}

async function forTester(text, msg) {
    if (text === '/start') {
        await bot.sendMessage(devId, `FROM TESTER\n${msg.from.first_name} - ты моя хозяйка!\nЯ тебя люблю! ❤️❤️❤️\n#purelove`);
        await bot.sendMessage(testerId, `${msg.from.first_name} - ты моя хозяйка!\nЯ тебя люблю! ❤️❤️❤️\n#purelove`);
        await  bot.sendSticker(devId, 'https://tlgrm.ru/_/stickers/6dd/71d/6dd71dd3-89eb-4f4c-b5c4-9dc46269d022/192/33.webp');
        await  bot.sendSticker(testerId, 'https://tlgrm.ru/_/stickers/6dd/71d/6dd71dd3-89eb-4f4c-b5c4-9dc46269d022/192/33.webp');
    }
    else if (text === '/info') {
        await bot.sendMessage(devId, `FROM TESTER\n@Corgi_In_Love_bot ver:${ver}\nНаведу шороху в твоем тг!\n#informator`);
        await bot.sendMessage(testerId, `@Corgi_In_Love_bot ver:${ver}\nНаведу шороху в твоем тг!\n#informator`);
        await  bot.sendSticker(devId, 'https://tlgrm.ru/_/stickers/6dd/71d/6dd71dd3-89eb-4f4c-b5c4-9dc46269d022/192/15.webp');
        await  bot.sendSticker(testerId, 'https://tlgrm.ru/_/stickers/6dd/71d/6dd71dd3-89eb-4f4c-b5c4-9dc46269d022/192/15.webp');
    }
    else {
        await bot.sendMessage(devId, `FROM TESTER\n${errorPhrases[randomInteger(0, 4)]}\n#dev #prog`)
        await bot.sendMessage(testerId, `${errorPhrases[randomInteger(0, 4)]}\n#dev #prog`)
        await bot.sendSticker(devId, `${programmerStickersArray[randomInteger(0, 24)]}`)
        await bot.sendSticker(testerId, `${programmerStickersArray[randomInteger(0, 24)]}`)
    }
}

async function forUser(text, msg) {
    if (text === '/start') {
        await bot.sendMessage(devId, `FROM USER\n${msg.from.first_name} - ты моя хозяйка!\nЯ тебя люблю! ❤️❤️❤️\n#purelove`);
        await bot.sendMessage(userId, `${msg.from.first_name} - ты моя хозяйка!\nЯ тебя люблю! ❤️❤️❤️\n#purelove`);
        await  bot.sendSticker(devId, 'https://tlgrm.ru/_/stickers/6dd/71d/6dd71dd3-89eb-4f4c-b5c4-9dc46269d022/192/33.webp');
        await  bot.sendSticker(userId, 'https://tlgrm.ru/_/stickers/6dd/71d/6dd71dd3-89eb-4f4c-b5c4-9dc46269d022/192/33.webp');
    }
    else if (text === '/info') {
        await bot.sendMessage(devId, `FROM USER\n@Corgi_In_Love_bot ver:${ver}\nНаведу шороху в твоем тг!\n#informator`);
        await bot.sendMessage(userId, `@Corgi_In_Love_bot ver:${ver}\nНаведу шороху в твоем тг!\n#informator`);
        await  bot.sendSticker(devId, 'https://tlgrm.ru/_/stickers/6dd/71d/6dd71dd3-89eb-4f4c-b5c4-9dc46269d022/192/15.webp');
        await  bot.sendSticker(userId, 'https://tlgrm.ru/_/stickers/6dd/71d/6dd71dd3-89eb-4f4c-b5c4-9dc46269d022/192/15.webp');
    }
    else {
        await bot.sendMessage(devId, `FROM USER\n${errorPhrases[randomInteger(0, 4)]}\n#dev #prog`)
        await bot.sendMessage(userId, `${errorPhrases[randomInteger(0, 4)]}\n#dev #prog`)
        await bot.sendSticker(devId, `${programmerStickersArray[randomInteger(0, 24)]}`)
        await bot.sendSticker(userId, `${programmerStickersArray[randomInteger(0, 24)]}`)
    }
}

bot.on('message', async msg => {
    const text = msg.text;
    const chatId = msg.chat.id;
    if (Number(chatId) === Number(devId)) {
        await forDev(text, msg)
    }
    else if (Number(chatId) === Number(testerId)) {
        await  bot.sendMessage(devId, `FROM TESTER\n${text}`)
        await forTester(text, msg)
    }
    else if (Number(chatId) === Number(userId)) {
        await  bot.sendMessage(devId, `FROM USER\n${text}`)
        await forUser(text, msg)
    }
})
