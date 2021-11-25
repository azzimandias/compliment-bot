const TelegramApi = require('node-telegram-bot-api')
const axios = require('axios')
const cheerio = require('cheerio')
require('dotenv').config()
const token = process.env.BOT_TOKEN
const devId = process.env.DEV_ID
const testerId = process.env.TESTER_ID
const userId = process.env.USER_ID
const bot = new TelegramApi(token, {polling: true})
const ver = '1.0.0'
const progStickersArray = [
    'https://cdndelivr.com/stickerset/codebark/12/webp',
    'https://cdndelivr.com/stickerset/codebark/13/webp',
    'https://cdndelivr.com/stickerset/codebark/14/webp',
    'https://cdndelivr.com/stickerset/codebark/15/webp',
    'https://cdndelivr.com/stickerset/codebark/16/webp',
    'https://cdndelivr.com/stickerset/codebark/17/webp',
    'https://cdndelivr.com/stickerset/codebark/18/webp',
    'https://cdndelivr.com/stickerset/codebark/19/webp',
    'https://cdndelivr.com/stickerset/codebark/20/webp',
    'https://cdndelivr.com/stickerset/codebark/21/webp',
    'https://cdndelivr.com/stickerset/codebark/22/webp',
    'https://cdndelivr.com/stickerset/codebark/23/webp',
    'https://cdndelivr.com/stickerset/codebark/24/webp',
]
const cuteStickersArray = [
    'https://cdndelivr.com/stickerset/blimchik_vk/7/webp',
    'https://cdndelivr.com/stickerset/blimchik_vk/6/webp',
    'https://cdndelivr.com/stickerset/blimchik_vk/8/webp',
    'https://cdndelivr.com/stickerset/blimchik_vk/19/webp',
    'https://cdndelivr.com/stickerset/blimchik_vk/20/webp',
    'https://cdndelivr.com/stickerset/blimchik_vk/24/webp',
    'https://cdndelivr.com/stickerset/blimchik_vk/27/webp',
    'https://cdndelivr.com/stickerset/blimchik_vk/32/webp',
    'https://cdndelivr.com/stickerset/blimchik_vk/33/webp',
    'https://cdndelivr.com/stickerset/blimchik_vk/11/webp'
]
const errorPhrases = [
    'Я еще не достаточно надрессирован чтобы что-то отвечать!! 🦴',
    'Гав-гав 🐕',
    'Когда-нибудь хозяин придумает, что можно на это ответить 🥺',
    'На этом мои полномочия всё',
    'Не могу ответить, спроси у Андрея'
]
const compliments = []

let flag = false
let i = 6
let j = 0


function randomInteger(min, max) {
    let rand = min - 0.5 + Math.random() * (max - min + 1);
    return Math.round(rand);
}

const parseCompliments = async (chatId) => {
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
    await sendCompliment(chatId)
}

const parseStickersProg = async () => {
    const getHTML = async (url) => {
        const {data} = await axios.get(url)
        return cheerio.load(data)
    }
    const selector = await getHTML(`https://telestorm.ru/stickers/codebark`)
    selector('.sticker').each((i, element) => {
        const sticker = selector(element).find('img').attr('src')
        progStickersArray.push(`${sticker}`)
    })
}

async function sendCompliment(chatId) {
    switch (Number(chatId)) {
        case Number(devId):
            await bot.sendMessage(devId, `Dev YES`);
            break
        case Number(testerId):
            await bot.sendMessage(devId, `Tester YES`);
            break
        case Number(userId):
            await bot.sendMessage(devId, `User YES`);
            break
    }
    const interval = setInterval(() => {
        if (j === 3) {
            j = 0
        }
        let date = new Date();
        if (date.getHours() === 9 || date.getHours() === 17) {
            bot.sendMessage(chatId, `${compliments[i]}\n❤️💫💘❤️‍🔥\n#compliment`);
            bot.sendSticker(chatId, `${cuteStickersArray[randomInteger(0, 9)]}`)
            j++
        }
        else if (i >= 1040) {
            clearInterval(interval)
        }
    }, 3600000)
}

parseStickersProg().catch(err => {if (err) throw err})
parseCompliments(devId).catch(err => {if (err) throw err})
parseCompliments(testerId).catch(err => {if (err) throw err})
parseCompliments(userId).catch(err => {if (err) throw err})

async function forDev(text, msg) {
    if (text === '/start' && !flag) {
        await bot.sendMessage(devId, `Привет красавица ${msg.from.first_name}!\nТы моя хозяйка?)\nЯ уже тебя люблю! ❤️❤️❤️\n#purelove`);
        await  bot.sendSticker(devId, 'https://tlgrm.ru/_/stickers/6dd/71d/6dd71dd3-89eb-4f4c-b5c4-9dc46269d022/2.webp');
        flag = !flag
    }
    else if (text === '/start' && flag) {
        await bot.sendMessage(devId, `${msg.from.first_name} - ты моя хозяйка!\nЯ тебя люблю! ❤️❤️❤️\n#purelove`);
        await  bot.sendSticker(devId, 'https://tlgrm.ru/_/stickers/6dd/71d/6dd71dd3-89eb-4f4c-b5c4-9dc46269d022/192/33.webp');
    }
    else if (text === '/info') {
        await bot.sendMessage(devId, `@Corgi_In_Love_bot ver:${ver}\nНаведу шороху в твоем тг!\n#informator`);
        await  bot.sendSticker(devId, 'https://tlgrm.ru/_/stickers/6dd/71d/6dd71dd3-89eb-4f4c-b5c4-9dc46269d022/192/15.webp');
    }
    else if (text === "/Go") {
        await bot.sendMessage(devId, `${compliments[i]}\n❤️💫💘❤️‍🔥\n#compliment`);
        await bot.sendMessage(userId, `${compliments[i]}\n❤️💫💘❤️‍🔥\n#compliment`);
        await  bot.sendSticker(devId, 'https://tlgrm.ru/_/stickers/6dd/71d/6dd71dd3-89eb-4f4c-b5c4-9dc46269d022/12.webp');
        await  bot.sendSticker(userId, 'https://tlgrm.ru/_/stickers/6dd/71d/6dd71dd3-89eb-4f4c-b5c4-9dc46269d022/12.webp');
    }
    else {
        await bot.sendMessage(devId, `${errorPhrases[randomInteger(0, 4)]}\n#dev #prog`)
        await bot.sendSticker(devId, `${progStickersArray[randomInteger(0, 24)]}`)
    }
}

async function forTester(text, msg) {
    if (text === '/start' && !flag) {
        await bot.sendMessage(devId, `FROM TESTER\nПривет красавица ${msg.from.first_name}!\nТы моя хозяйка?)\nЯ уже тебя люблю! ❤️❤️❤️\n#purelove`);
        await bot.sendMessage(testerId, `Привет красавица ${msg.from.first_name}!\nТы моя хозяйка?)\nЯ уже тебя люблю! ❤️❤️❤️\n#purelove`);
        await  bot.sendSticker(devId, 'https://tlgrm.ru/_/stickers/6dd/71d/6dd71dd3-89eb-4f4c-b5c4-9dc46269d022/2.webp');
        await  bot.sendSticker(testerId, 'https://tlgrm.ru/_/stickers/6dd/71d/6dd71dd3-89eb-4f4c-b5c4-9dc46269d022/2.webp');
        flag = !flag
        await parseStickersProg()
        await parseCompliments(devId)
        await parseCompliments(testerId)
        await parseCompliments(userId)
    }
    else if (text === '/start' && flag) {
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
    else if (text === "/Go") {
        await bot.sendMessage(devId, `FROM TESTER\n${compliments[i]}\n❤️💫💘❤️‍🔥\n#compliment`);
        await bot.sendMessage(testerId, `${compliments[i]}\n❤️💫💘❤️‍🔥\n#compliment`);
        await  bot.sendSticker(devId, 'https://tlgrm.ru/_/stickers/6dd/71d/6dd71dd3-89eb-4f4c-b5c4-9dc46269d022/12.webp');
        await  bot.sendSticker(testerId, 'https://tlgrm.ru/_/stickers/6dd/71d/6dd71dd3-89eb-4f4c-b5c4-9dc46269d022/12.webp');
    }
    else {
        await bot.sendMessage(devId, `FROM TESTER\n${errorPhrases[randomInteger(0, 4)]}\n#dev #prog`)
        await bot.sendMessage(testerId, `${errorPhrases[randomInteger(0, 4)]}\n#dev #prog`)
        await bot.sendSticker(devId, `${progStickersArray[randomInteger(0, 24)]}`)
        await bot.sendSticker(testerId, `${progStickersArray[randomInteger(0, 24)]}`)
    }
}

async function forUser(text, msg) {
    if (text === '/start' && !flag) {
        await bot.sendMessage(devId, `FROM USER\nПривет красавица ${msg.from.first_name}!\nТы моя хозяйка?)\nЯ уже тебя люблю! ❤️❤️❤️\n#purelove`);
        await bot.sendMessage(userId, `Привет красавица ${msg.from.first_name}!\nТы моя хозяйка?)\nЯ уже тебя люблю! ❤️❤️❤️\n#purelove`);
        await  bot.sendSticker(devId, 'https://tlgrm.ru/_/stickers/6dd/71d/6dd71dd3-89eb-4f4c-b5c4-9dc46269d022/2.webp');
        await  bot.sendSticker(userId, 'https://tlgrm.ru/_/stickers/6dd/71d/6dd71dd3-89eb-4f4c-b5c4-9dc46269d022/2.webp');
        flag = !flag
    }
    else if (text === '/start' && flag) {
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
    else if (text === "/Go") {
        await bot.sendMessage(devId, `FROM USER\n${compliments[i]}\n❤️💫💘❤️‍🔥\n#compliment`);
        await bot.sendMessage(userId, `${compliments[i]}\n❤️💫💘❤️‍🔥\n#compliment`);
        await  bot.sendSticker(devId, 'https://tlgrm.ru/_/stickers/6dd/71d/6dd71dd3-89eb-4f4c-b5c4-9dc46269d022/12.webp');
        await  bot.sendSticker(userId, 'https://tlgrm.ru/_/stickers/6dd/71d/6dd71dd3-89eb-4f4c-b5c4-9dc46269d022/12.webp');
    }
    else {
        await bot.sendMessage(devId, `FROM USER\n${errorPhrases[randomInteger(0, 4)]}\n#dev #prog`)
        await bot.sendMessage(userId, `${errorPhrases[randomInteger(0, 4)]}\n#dev #prog`)
        await bot.sendSticker(devId, `${progStickersArray[randomInteger(0, 24)]}`)
        await bot.sendSticker(userId, `${progStickersArray[randomInteger(0, 24)]}`)
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
