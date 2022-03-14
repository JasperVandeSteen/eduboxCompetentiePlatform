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
    .post((req, res) => {
        title = req.body.title
        generateJSONFile(req.body.selectedData)
        generateNewLink(title);
        res.send("done!");
    });

bgRouter.route('/deleteEdubox')
    .delete((req, res) => {
        title = req.body.title
        deleteEduboxFiles(title);
        res.send("deleted!");
    });

function generateJSONFile(data) {
    try {
        let htmlBody = `
            <!DOCTYPE html>
            <html lang="en">

                <head>
                    <meta charset="UTF-8">
                    <meta http-equiv="X-UA-Compatible" content="IE=edge">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>${title}</title>
                    <link rel="stylesheet" href="style.css">
                    <script type="module" src="script.js"></script>
                    <link rel="stylesheet" href="https://use.typekit.net/izu2qxl.css">
                    <link rel="stylesheet" href="https://use.typekit.net/izu2qxl.css">
                    <script src="https://kit.fontawesome.com/0cfde2b051.js" crossorigin="anonymous"></script>
                    <link rel="icon" type="image/svg" href="./resources/images/icon.svg">
                </head>

                <body>
                    <section id="logo">
                        <img src="resources/images/EDUBOX RGB.svg" alt="Edubox logo">
                    </section>

                    <section id="backToTop">
                        <p><i class="fas fa-arrow-up"></i> Naar boven</p>
                    </section>

                    <header>
                        <h2>${title}</h2>
                        <div class="menu" id="leftM">
                            <p class="menuItem selected" id="eerste">1ste Graad</p>
                            <p class="menuItem" id="tweede">2e Graad</p>
                            <p class="menuItem" id="derde">3e Graad</p>
                        </div>
                        <select class="menu" id="rightM" name="stroom">
                            <option value="alle">Alle stromingen</option>
                            <option value="A">A-stroom</option>
                            <option value="B">B-stroom</option>
                        </select>
                    </header>

                    <main id="main"></main>
                </body>
                <script>
                    function showMoreOrLess(numb, moreOrLess) {
                        let zin = document.getElementById("gesloten" + numb);
                        let extra = document.getElementById("open" + numb);
                        let btn = document.getElementById("more" + numb);

                        if (moreOrLess == 1) {
                            zin.style.boxShadow = "0px 3px 6px 1px rgba(0, 0, 0, 0.171)";
                            zin.style.padding = "2%";

                            extra.style.display = "block";
                            btn.style.display = "none";
                        } else if (moreOrLess == 0) {
                            zin.style.boxShadow = "none";
                            zin.style.padding = "0";

                            extra.style.display = "none";
                            btn.style.display = "block";
                        }
                    }
                </script>
            </html>
        `;

        fs.writeFileSync(`./data/${title}.json`, JSON.stringify(data));
        fs.writeFileSync(`../${title}.html`, htmlBody);
    } catch (err) {
        console.error(err)
    }
}

function deleteEduboxFiles(edubox) {
    fs.unlinkSync(`./data/${edubox}.json`);
    fs.unlinkSync(`../${edubox}.html`);

    let data = fs.readFileSync('../links.json');
    let json = JSON.parse(data);
    json = json.filter((comp) => {
        return comp.title !== edubox
    });
    fs.writeFileSync('../links.json', JSON.stringify(json, null, 2));
}

function generateNewLink(title) {
    let duplicate = false;
    let data = fs.readFileSync('../links.json');
    let json = JSON.parse(data);
    json.forEach(link => {
        if (link.title == title) {
            duplicate = true;
        }
    });

    if (!duplicate) {
        let newLinkObject = {
            "title": title,
            "link": `<li><a href='../${title}.html' target='_blank'>${title}</a></li>`
        }
        json.push(newLinkObject);
        fs.writeFileSync('../links.json', JSON.stringify(json));
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
            fs.writeFileSync('../data.json', JSON.stringify(newData));
        })
        .catch(function (error) {
            console.log(error);
        });
});

app.get('/', (req, res) => {
    res.send("server is up...")
});

app.use('/api', bgRouter);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});