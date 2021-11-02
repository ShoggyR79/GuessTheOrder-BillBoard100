const axios = require('axios')
const cheerio = require('cheerio')


let top100songs = [];



const scrapeTopSongs = async (req, res) => {
    try {
        //fetching the html of billboard website
        const { data } = await axios.get("https://www.billboard.com/charts/hot-100")
        const $ = cheerio.load(data)
        const songs = $(".chart-list__element")

        //emptying array in case of refresh
        top100songs = [];
        
        songs.each((i, elem) => {
            top100songs.push({
                name: $(elem).find(".chart-element__information__song").text(),
                artist: $(elem).find(".chart-element__information__artist").text(),
                rank: $(elem).find(".chart-element__rank__number").text()
            })

        })
        res.status(200).send({ message: "Top 100 data successfully collected and stored locally.", data: top100songs })
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
}

const getTopSongs = async(req, res) =>{
    res.status(200).send(top100songs)
}


module.exports = {
    scrapeTopSongs,
    getTopSongs
}