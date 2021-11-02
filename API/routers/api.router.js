const express = require("express");
const { getTopSongs, scrapeTopSongs } = require("../controllers/api.controller");

const apiRouter = express.Router();

/**
 * returns the array contain the top 100 songs and its information, does not web scrape thus 
 * has faster return times
 *  
 */
apiRouter.get("/", getTopSongs);

/**
 * scrape https://www.billboard.com/charts/hot-100 and store top 100 songs and its attribute in a local array
 * 
 * IMPORTANT: MUST BE CALLED FIRST BEFORE CALLING REGULAR GET API
 */
apiRouter.get("/scrape", scrapeTopSongs);

module.exports = {
    apiRouter
}