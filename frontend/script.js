let eerste = document.getElementById("eerste");
let tweede = document.getElementById("tweede");
let derde = document.getElementById("derde");
let rightM = document.getElementById("rightM");

let mybutton = document.getElementById("backToTop");
let file = document.getElementById("file");

let graad = "1ste graad";
let view = "lijst";
let data;
let filteredData = [];

var params = {};
location.search.slice(1).split("&").forEach(function (pair) {
    pair = pair.split("=");
    params[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
});

////////////////////////////////////////////////////////   GRAAD SELECTIE
eerste.addEventListener('click', (event) => {
    event.preventDefault();

    eerste.classList = "menuItem selected";
    tweede.classList = "menuItem";
    derde.classList = "menuItem";

    rightM.innerHTML = `
        <option value="alle">Alle stromen</option>
        <option value="A">A-stroom</option>
        <option value="B">B-stroom</option>
    `;

    graad = "1ste graad";
    loadInData(data);
});

tweede.addEventListener('click', (event) => {
    event.preventDefault();

    tweede.classList = "menuItem selected";
    eerste.classList = "menuItem";
    derde.classList = "menuItem";

    rightM.innerHTML = `
        <option value="alle">Alle finaliteiten</option>
        <option value="A">Finaliteit doorstroom</option>
        <option value="B">Finaliteit arbeidsmarkt</option>
        <option value="C">Dubbele finaliteit</option>
    `;

    graad = "2de graad";
    loadInData(data);
});

derde.addEventListener('click', (event) => {
    event.preventDefault();

    derde.classList = "menuItem selected";
    eerste.classList = "menuItem";
    tweede.classList = "menuItem";

    rightM.innerHTML = `
        <option value="alle">Alle finaliteiten</option>
        <option value="A">Finaliteit doorstroom</option>
        <option value="B">Finaliteit arbeidsmarkt</option>
        <option value="C">Dubbele finaliteit</option>
    `;

    graad = "3de graad";
    loadInData(data);
});
////////////////////////////////////////////////////////   


////////////////////////////////////////////////////////
//
//      LOAD AND FILL IN JSON DATA
//
////////////////////////////////////////////////////////

const groupBy = (array, key) => {
    return array.reduce((result, currentValue) => {
        (result[currentValue[key]] = result[currentValue[key]] || []).push(
            currentValue
        );
        return result;
    }, {}); // empty object is the initial value for result object
};

function loadInData(object) {
    document.getElementById("title").innerHTML = params.title;
    document.title = "EDUboxen | " + params.title;
    filteredData = [];
    object.forEach(competentie => {
        if (competentie.Graad == graad) {
            filteredData.push(competentie);
        }
    });

    filteredData.sort(function (a, b) {
        let numbA,
            numbB;
        let strA = a.Doelzin,
            srtB = b.Doelzin;
        if (strA.charAt(0) == "B" || strA.charAt(0) == "U") {
            let bg = strA.slice(0, 3);
            numbA = bg + strA.slice(3, -1).substr(0, strA.slice(3, -1)
                .indexOf(' '));
        } else {
            numbA = strA.substr(0, strA.indexOf(' '));
        }
        if (srtB.charAt(0) == "B" || srtB.charAt(0) == "U") {
            let bg = srtB.slice(0, 3);
            numbB = bg + srtB.slice(3, -1).substr(0, srtB.slice(3, -1)
                .indexOf(' '));
        } else {
            numbB = srtB.substr(0, srtB.indexOf(' '));
        }

        let keyA = a.Id,
            keyB = b.Id;
        if (keyA < keyB) return -1;
        if (keyA > keyB) return 1;
        return 0;
    });

    const groupedByComp = groupBy(filteredData, 'Sleutelcompetentie');
    console.log(filteredData);
    let htmlGroup = ``;
    let index = 0;

    Object.entries(groupedByComp).map(item => {
        let htmlString = ``;
        let nextStroom;
        let stroom;
        let first = true;

        item[1].forEach(comp => {
            let bubbleHTML = "";
            let number;
            let rest;
            let stroomTitel;
            let uitlegString = `
                Met inbegrip van kennis
                Feitenkennis
                Conceptuele kennis
                Procedurele kennis

                Met inbegrip van context

                Met inbegrip van tekst kenmerken

                Met inbegrip van dimensies eindterm
                Cognitieve dimensie
                Affectieve dimensie
                Psychomotorische dimensie
            `;

            if ("Hoofdstukken" in comp) {
                let first = true;
                let challengeString = "Challenge: ";
                comp.Hoofdstukken.forEach(hoofdstuk => {
                    if (hoofdstuk.toLowerCase().includes("challenge") || hoofdstuk.toLowerCase().includes("uitdaging")) {
                        if (first) {
                            challengeString += hoofdstuk.slice(-2);
                            first = !first;
                        } else {
                            challengeString += ", " + hoofdstuk.slice(-2);
                        }
                    } else if (hoofdstuk.includes("Hoofdstuk")) {
                        bubbleHTML += `
                            <div style="display: inline-block;" class="bubble" id="hoofdstuk">${hoofdstuk}</div>
                        `;
                    }
                });
                if (challengeString != "Challenge: ") {
                    bubbleHTML += `
                        <div style="display: inline-block;" class="bubble" id="challenges">${challengeString}</div>
                    `;
                }
            }

            if (first) {
                stroom = comp.Finaliteit;
                nextStroom = comp.Finaliteit;
            } else {
                nextStroom = comp.Finaliteit;
            }

            if (nextStroom != stroom) {
                stroom = nextStroom;
                stroomTitel = `
                    <h3 class="${stroom} subTitle">${stroom}</h3>
                `;
            } else if (first) {
                stroomTitel = `
                    <h3 class="${stroom} subTitle">${stroom}</h3>
                `;
            } else {
                stroomTitel = "";
            }

            let str = comp.Doelzin;
            if (str.charAt(0) == "B" || str.charAt(0) == "U") {
                let bg = str.slice(0, 3);
                number = bg + str.slice(3, -1).substr(0, str.slice(3, -1)
                    .indexOf(' '));
                rest = str.slice(4, -1).substr(str.indexOf(' ') + 1);
            } else {
                number = str.substr(0, str.indexOf(' '));
                rest = str.substr(str.indexOf(' ') + 1);
            }

            if (comp.UitlegString)
                uitlegString = comp.UitlegString;

            htmlString += `
                        ${stroomTitel}
                        <div class="comp" id="${index}">
                            <div id="gesloten${index}" class="gesloten">
                                <p><b id="number">${number}</b> ${rest}</p>
                                <h4 onClick="showMoreOrLess(${index}, 1)" class="readMoreLess" id="more${index}">meer lezen <i class="fas fa-angle-down"></i></h4>
                            </div>
                            <div id="open${index}" class="open">
                                <p>
                                   ${uitlegString} 
                                </p>
                                <div class="infoBubblesAndClose">
                                    <div class="infoBubbles">
                                        <div class="bubbleGroen" id="stroom${index}">${comp.Finaliteit}</div>
                                        ${bubbleHTML}
                                    </div>
                                    <h4 onClick="showMoreOrLess(${index}, 0)" class="readMoreLess" id="less">minder lezen <i
                                            style="transform: rotate(180deg);" class="fas fa-angle-down"></i></h4>
                                </div>
                            </div>
                        </div>
                    `;
            index++;
            if (first)
                first = false;
        });
        htmlGroup += `
                <div class="compGroep">
                    <h1>${item[0]}</h1>
                    <div class="competenties">

                        ${htmlString}

                    </div>
                </div>
                `;
    });
    document.getElementById("main").innerHTML = htmlGroup;
}

fetch("https://competentie-platform-backend.herokuapp.com/api/getEdubox/" + params.title)
    .then(response => {
        return response.json();
    })
    .then(jsondata => {
        console.log(jsondata);
        data = jsondata;
        loadInData(data);
    });

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function () {
    scrollFunction()
};

function scrollFunction() {
    if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
        mybutton.style.display = "block";
    } else {
        mybutton.style.display = "none";
    }
}

document.getElementById("backToTop").addEventListener('click', (e) => {
    e.preventDefault();
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
});

////////////////////////////////////////////////////////   STROOM SELECTIE
rightM.addEventListener('change', (e) => {
    e.preventDefault();

    for (let i = 0; i < filteredData.length; i++) {
        switch (rightM.selectedOptions[0].value) {
            case "alle":
                document.getElementById(i).style.display = "block";
                let titles = document.getElementsByClassName("subTitle");
                for (var j = 0; j < titles.length; j++) {
                    titles.item(j).style.display = "block";
                }
                break;
            case "A":
                if (graad == "1ste graad") {
                    if (document.getElementById("stroom" + i).innerText != "A-stroom") {
                        document.getElementById(i).style.display = "none";
                        let titles = document.getElementsByClassName("A-stroom");
                        for (var j = 0; j < titles.length; j++) {
                            titles.item(j).style.display = "block";
                        }
                    } else {
                        document.getElementById(i).style.display = "block";
                        let titles = document.getElementsByClassName("B-stroom");
                        for (var j = 0; j < titles.length; j++) {
                            titles.item(j).style.display = "none";
                        }
                    }
                } else if (graad == "2de graad" || graad == "3de graad") {
                    if (document.getElementById("stroom" + i).innerText != "Finaliteit doorstroom") {
                        document.getElementById(i).style.display = "none";
                        let titles = document.getElementsByClassName("Finaliteit doorstroom");
                        for (var j = 0; j < titles.length; j++) {
                            titles.item(j).style.display = "block";
                        }
                    } else {
                        document.getElementById(i).style.display = "block";
                        let titles = document.getElementsByClassName("Finaliteit arbeidsmarkt");
                        for (var j = 0; j < titles.length; j++) {
                            titles.item(j).style.display = "none";
                        }
                        let titles2 = document.getElementsByClassName("Dubbele finaliteit");
                        for (var j = 0; j < titles.length; j++) {
                            titles2.item(j).style.display = "none";
                        }
                    }
                }
                break;
            case "B":
                if (graad == "1ste graad") {
                    if (document.getElementById("stroom" + i).innerText != "B-stroom") {
                        document.getElementById(i).style.display = "none";
                        let titles = document.getElementsByClassName("B-stroom");
                        for (var j = 0; j < titles.length; j++) {
                            titles.item(j).style.display = "block";
                        }
                    } else {
                        document.getElementById(i).style.display = "block";
                        let titles = document.getElementsByClassName("A-stroom");
                        for (var j = 0; j < titles.length; j++) {
                            titles.item(j).style.display = "none";
                        }
                    }
                } else if (graad == "2de graad" || graad == "3de graad") {
                    if (document.getElementById("stroom" + i).innerText != "Finaliteit arbeidsmarkt") {
                        document.getElementById(i).style.display = "none";
                        let titles = document.getElementsByClassName("Finaliteit arbeidsmarkt");
                        for (var j = 0; j < titles.length; j++) {
                            titles.item(j).style.display = "block";
                        }
                    } else {
                        document.getElementById(i).style.display = "block";
                        let titles = document.getElementsByClassName("Finaliteit doorstroom");
                        for (var j = 0; j < titles.length; j++) {
                            titles.item(j).style.display = "none";
                        }
                        let titles2 = document.getElementsByClassName("Dubbele finaliteit");
                        for (var j = 0; j < titles.length; j++) {
                            titles2.item(j).style.display = "none";
                        }
                    }
                }
                break;
            case "C":
                if (graad == "1ste graad") {
                    break;
                } else if (graad == "2de graad" || graad == "3de graad") {
                    if (document.getElementById("stroom" + i).innerText != "Dubbele finaliteit") {
                        document.getElementById(i).style.display = "none";
                        let titles = document.getElementsByClassName("Dubbele finaliteit");
                        for (var j = 0; j < titles.length; j++) {
                            titles.item(j).style.display = "block";
                        }
                    } else {
                        document.getElementById(i).style.display = "block";
                        let titles = document.getElementsByClassName("Finaliteit doorstroom");
                        for (var j = 0; j < titles.length; j++) {
                            titles.item(j).style.display = "none";
                        }
                        let titles2 = document.getElementsByClassName("Finaliteit arbeidsmarkt");
                        for (var j = 0; j < titles.length; j++) {
                            titles2.item(j).style.display = "none";
                        }
                    }
                }
                break;
            default:
                break;
        }
    }
});
////////////////////////////////////////////////////////