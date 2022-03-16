const fs = require("fs");

const express = require('express');
const cors = require('cors');
const bodyparser = require('body-parser');
const schedule = require('node-schedule');
const fetch = require('node-fetch');

const app = express();
const bgRouter = express.Router();
const port = process.env.PORT || 3000;

let title;

let today = new Date();
let date;

// Middle ware
app.use(bodyparser.urlencoded({
    limit: '50mb',
    extended: true
}));
app.use(bodyparser.json({
    limit: '50mb'
}));
app.use(cors());

bgRouter.route('/addEdubox')
    .post(async (req, res) => {
        title = req.body.title
        await generateJSONFile(req.body.selectedData)
        await generateNewLink(title);
        res.send("done!");
    });

bgRouter.route('/getData')
    .get((req, res) => {
        let data = fs.readFileSync('./data.json');
        let json = JSON.parse(data);
        res.send(json);
    });

bgRouter.route('/getEdubox/:title')
    .get((req, res) => {
        let title = req.params.title;
        let data = fs.readFileSync('./data/' + title + '.json');
        let json = JSON.parse(data);
        res.send(json);
    });

bgRouter.route('/getLinks')
    .get((req, res) => {
        let data = fs.readFileSync('./links.json');
        let json = JSON.parse(data);
        res.send(json);
    });

bgRouter.route('/deleteEdubox')
    .delete(async (req, res) => {
        title = req.body.title
        await deleteEduboxFiles(title);
        res.send("deleted!");
    });

async function generateJSONFile(data) {
    try {
        await fs.writeFile(`./data/${title}.json`, JSON.stringify(data), function (err) {
            if (err) throw err;
            console.log('Data file is created successfully.');
        });
    } catch (err) {
        console.error(err)
    }
}

async function deleteEduboxFiles(edubox) {
    await fs.unlink(`./data/${edubox}.json`, function (err) {
        if (err) throw err;
        console.log('Data file deleted!');
    });

    let data = fs.readFileSync('./links.json');
    let json = JSON.parse(data);
    json = json.filter((comp) => {
        return comp.title !== edubox
    });

    await fs.writeFile('./links.json', JSON.stringify(json, null, 2), function (err) {
        if (err) throw err;
        console.log('Links file is updated successfully.');
    });
}

async function generateNewLink(title) {
    let duplicate = false;
    let data = fs.readFileSync('./links.json');
    let json = JSON.parse(data);
    json.forEach(link => {
        if (link.title == title) {
            duplicate = true;
        }
    });

    if (!duplicate) {
        let newLinkObject = {
            "title": title,
            "link": `<li><a href='./EDUbox.html?title=${title}' target='_blank'>${title}</a></li>`
        }
        json.push(newLinkObject);

        await fs.writeFile('./links.json', JSON.stringify(json), function (err) {
            if (err) throw err;
            console.log('Links file is updated successfully.');
        });
    }
}

var j = schedule.scheduleJob('0 0 * * *', function () {
    console.log('Updating local data storage...');
    const url = "https://onderwijs.api.vlaanderen.be/onderwijsdoelen/onderwijsdoel?versie=2.0";
    fetch(url, {
            method: "GET",
            withCredentials: true,
            headers: {
                'X-API-KEY': 'yrkJV8z5jYAje8W7ErNnenp9j3Yz8xH8',
                'Accept': '*/*',
                'Content-Type': 'application/json'
            }
        })
        .then(resp => resp.json())
        .then(function (jsondata) {
            const newData = jsondata.gegevens.member;
            // fs.writeFileSync('./data.json', JSON.stringify(newData));

            fs.writeFile(`./data.json`, JSON.stringify(newData), function (err) {
                if (err) throw err;
                date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
                console.log('Completed update at ' + date);
            });
        })
        .catch(function (error) {
            console.log(error);
        });
});

app.get('/', (req, res) => {
    res.send("server is up and running... V5.1 --- Last data update was at: " + date)
});

app.use('/api', bgRouter);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});