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

////////////////////////////////////////////////////////   GRAAD SELECTIE
eerste.addEventListener('click', (event) => {
    event.preventDefault();

    eerste.classList = "menuItem selected";
    tweede.classList = "menuItem";
    derde.classList = "menuItem";

    rightM.innerHTML = `
        <option value="alle">Alle stromingen</option>
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
        <option value="alle">Alle stromingen</option>
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
        <option value="alle">Alle stromingen</option>
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
    filteredData = [];
    object.forEach(competentie => {
        if (competentie.Graad == graad) {
            filteredData.push(competentie);
        }
    });

    const groupedByComp = groupBy(filteredData, 'Sleutelcompetentie');
    console.log(filteredData);
    let htmlGroup = ``;
    let index = 0;
    Object.entries(groupedByComp).map(item => {
        let htmlString = ``;

        item[1].forEach(comp => {
            let bubbleHTML = "";
            let number;
            let rest;
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
                    if (hoofdstuk.includes("Challenge")) {
                        if (first) {
                            challengeString += hoofdstuk.slice(-1);
                            first = !first;
                        } else {
                            challengeString += ", " + hoofdstuk.slice(-1);
                        }
                    } else if (hoofdstuk.includes("Hoofdstuk")) {
                        bubbleHTML += `
                            <div style="display: block;" class="bubble" id="hoofdstuk">${hoofdstuk}</div>
                        `;
                    }
                });
                if (challengeString != "Challenge: ") {
                    bubbleHTML += `
                        <div style="display: block;" class="bubble" id="challenges">${challengeString}</div>
                    `;
                }
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

fetch("../backend/data/" + document.title + ".json")
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
                break;
            case "A":
                if (graad == "1ste graad") {
                    if (document.getElementById("stroom" + i).innerText != "A-stroom") {
                        document.getElementById(i).style.display = "none";
                    } else {
                        document.getElementById(i).style.display = "block";
                    }
                } else if (graad == "2de graad" || graad == "3de graad") {
                    if (document.getElementById("stroom" + i).innerText != "Finaliteit doorstroom") {
                        document.getElementById(i).style.display = "none";
                    } else {
                        document.getElementById(i).style.display = "block";
                    }
                }
                break;
            case "B":
                if (graad == "1ste graad") {
                    if (document.getElementById("stroom" + i).innerText != "B-stroom") {
                        document.getElementById(i).style.display = "none";
                    } else {
                        document.getElementById(i).style.display = "block";
                    }
                } else if (graad == "2de graad" || graad == "3de graad") {
                    if (document.getElementById("stroom" + i).innerText != "Finaliteit arbeidsmarkt") {
                        document.getElementById(i).style.display = "none";
                    } else {
                        document.getElementById(i).style.display = "block";
                    }
                }
                break;
            case "C":
                if (graad == "1ste graad") {
                    break;
                } else if (graad == "2de graad" || graad == "3de graad") {
                    if (document.getElementById("stroom" + i).innerText != "Dubbele finaliteit") {
                        document.getElementById(i).style.display = "none";
                    } else {
                        document.getElementById(i).style.display = "block";
                    }
                }
                break;
            default:
                break;
        }
    }
});
////////////////////////////////////////////////////////