const TelegramApi = require('node-telegram-bot-api')
const axios = require('axios')
const cheerio = require('cheerio')
const fs = require('fs')
const path = require('path');
const token = '2100773545:AAFSmLwDreLWc_izYjgaambSSUvLwmWwqds'
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
const errorPhrases = [
    'Я еще не достаточно надрессирован чтобы что-то отвечать!! 🦴',
    'Гав-гав 🐕',
    'Когда-нибудь хозяин придумает, что можно на это ответить 🥺',
    'На этом мои полномочия всё',
    'Не могу ответить, спроси у Андрея'
]
const compliments = []

let flag = false
let i = 0

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
            fs.appendFileSync('./data.txt', `${title}\n`)
        })
    }
    await createCompliments()
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

function createCompliments() {
    compliments.push(
        fs.readFileSync(path.join(__dirname, 'data.txt'), 'utf-8').split('\n')
    )
}

const sendCompliment = async (chatId) => {

    const interval = setInterval(() => {
        let date = new Date();
        if (date.getHours() === 12 || date.getHours() === 20) {
            bot.sendMessage(chatId, `${compliments[0][i]}\n❤️💫💘❤️‍🔥\n#compliment`);
            i++
        }
    }, 3600000)
}

function randomInteger(min, max) {
    let rand = min - 0.5 + Math.random() * (max - min + 1);
    return Math.round(rand);
}

bot.on('message', async msg => {
    const text = msg.text;
    const chatId = msg.chat.id;
    if (text === '/start' && !flag) {
        await bot.sendMessage(chatId, `Привет красавица ${msg.from.first_name}!\nТы моя хозяйка?)\nЯ уже тебя люблю! ❤️❤️❤️\n#purelove`);
        await  bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/6dd/71d/6dd71dd3-89eb-4f4c-b5c4-9dc46269d022/2.webp');
        flag = !flag
        await parseStickersProg()
        await parseCompliments(chatId)
    }
    else if (text === '/start' && flag) {
        await bot.sendMessage(chatId, `${msg.from.first_name} - ты моя хозяйка!\nЯ тебя люблю! ❤️❤️❤️\n#purelove`);
        await  bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/6dd/71d/6dd71dd3-89eb-4f4c-b5c4-9dc46269d022/192/33.webp');
    }
    else if (text === '/info') {
        await bot.sendMessage(chatId, `@Corgi_In_Love_bot ver:${ver}\nНаведу шороху в твоем тг!\n#informator`);
        await  bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/6dd/71d/6dd71dd3-89eb-4f4c-b5c4-9dc46269d022/192/15.webp');
    }
    else if (text === "/Go") {
        await bot.sendMessage(chatId, `${compliments[0][i]}\n#test`);
        await  bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/6dd/71d/6dd71dd3-89eb-4f4c-b5c4-9dc46269d022/12.webp');
    }
    else {
        await bot.sendMessage(chatId, `${errorPhrases[randomInteger(0, 4)]}\n#dev #prog`)
        await bot.sendSticker(chatId, `${progStickersArray[randomInteger(0, 24)]}`)
    }
})
