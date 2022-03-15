import * as Hash from "./HashFunction.js";

let data = [];
let htmlString;
let index;
let pickedArr;
let links;
let graad;
let formFilledIn = false;

let compTable = document.getElementById("compTable");
let compForm = document.getElementById("compForm");
let newEDUform = document.getElementById("newEDUform");
let titelDisplay = document.getElementById("titelDisplay");
let title = document.getElementById("title");
let nav = document.getElementById("nav");
let zoeken = document.getElementById("zoeken");

let start = document.getElementById("start");
let addCol = document.getElementById("addCol");
let cancel = document.getElementById("cancel");
let deleteComp = document.getElementById("delete");
let addBtn = document.getElementById("addBtn");
let nameSwitch = document.getElementById("nameSwitch");
let search = document.getElementById("search");

const passwordKey = "0886a33c90525502556e37fda871aa173b95581a70c58e421aad36224a32b5ae";

function checkLogIn() {
    if (!sessionStorage.getItem("password")) {
        let wachtwoord = prompt("Wachtwoord:", '');
        let ww2 = Hash.SHA256(wachtwoord);
        if (ww2 != passwordKey) {
            alert("Wachtwoord is fout");
            sessionStorage.clear();
            checkLogIn();
        } else {
            sessionStorage.setItem("password", wachtwoord);
        }
    } else {
        let ww2 = Hash.SHA256(sessionStorage.getItem("password"));
        if (ww2 != passwordKey) {
            alert("Wachtwoord is veranderd!");
            sessionStorage.clear();
            checkLogIn();
        }
    }
}
checkLogIn()

////////////////////////////////////////////////////////   GRAAD SELECTIE
eerste.addEventListener('click', (event) => {
    event.preventDefault();

    if (graad == "1ste graad") {
        eerste.classList = "Bluebtn";
        tweede.classList = "Bluebtn";
        derde.classList = "Bluebtn";
        graad = undefined;
        filterByGraad(0);
    } else {
        eerste.classList = "Bluebtn selected";
        tweede.classList = "Bluebtn";
        derde.classList = "Bluebtn";
        graad = "1ste graad";
        filterByGraad(1);
    }
});

tweede.addEventListener('click', (event) => {
    event.preventDefault();

    if (graad == "2de graad") {

        tweede.classList = "Bluebtn";
        eerste.classList = "Bluebtn";
        derde.classList = "Bluebtn";
        graad = undefined;
        filterByGraad(0);
    } else {
        tweede.classList = "Bluebtn selected";
        eerste.classList = "Bluebtn";
        derde.classList = "Bluebtn";
        graad = "2de graad";
        filterByGraad(2);
    }
});

derde.addEventListener('click', (event) => {
    event.preventDefault();

    if (graad == "3de graad") {
        derde.classList = "Bluebtn";
        eerste.classList = "Bluebtn";
        tweede.classList = "Bluebtn";
        graad = undefined;
        filterByGraad(0);
    } else {
        derde.classList = "Bluebtn selected";
        eerste.classList = "Bluebtn";
        tweede.classList = "Bluebtn";
        graad = "3de graad";
        filterByGraad(3);
    }
});
////////////////////////////////////////////////////////   

fetch("../data.json")
    .then(response => {
        return response.json();
    })
    .then(jsondata => {
        document.getElementById("newEDUform").style.display = "flex";
        document.getElementById("loading").style.display = "none";

        let duplicates = [];
        jsondata.forEach(element => {
            let count = (element.code.match(new RegExp("\\.", "g")) || []).length;
            let duplicate = false;

            let sleutelComp1;
            let sleutelComp2;

            let finaliteit1;
            let finaliteit2;

            if ("vlaamse_sleutelcompetentie" in element.onderwijsdoelenset) {
                sleutelComp1 = element.onderwijsdoelenset.vlaamse_sleutelcompetentie.korte_naam;
            } else {
                sleutelComp1 = element.onderwijsdoelenset.wetenschapsdomein.korte_naam;
            }
            if (element.onderwijsdoelenset.onderwijsstructuur.graad != "1ste graad") {
                finaliteit1 = element.onderwijsdoelenset.onderwijsstructuur.finaliteit;
            } else {
                finaliteit1 = element.onderwijsdoelenset.onderwijsstructuur.stroom;
            }

            data.forEach(comp => {
                if ("vlaamse_sleutelcompetentie" in comp.onderwijsdoelenset) {
                    sleutelComp2 = comp.onderwijsdoelenset.vlaamse_sleutelcompetentie.korte_naam;
                } else {
                    sleutelComp2 = comp.onderwijsdoelenset.wetenschapsdomein.korte_naam;
                }
                if (comp.onderwijsdoelenset.onderwijsstructuur.graad != "1ste graad") {
                    finaliteit2 = comp.onderwijsdoelenset.onderwijsstructuur.finaliteit;
                } else {
                    finaliteit2 = comp.onderwijsdoelenset.onderwijsstructuur.stroom;
                }

                if (sleutelComp1 == sleutelComp2 && comp.omschrijving == element.omschrijving && finaliteit1 == finaliteit2 && comp.onderwijsdoelenset.onderwijsstructuur.graad == element.onderwijsdoelenset.onderwijsstructuur.graad) {
                    duplicate = true;
                }
            });

            if (count < 2 && !data.includes(element) && !duplicate) {
                data.push(element);
            } else if (duplicate) {
                duplicate = false;
                duplicates.push(element);
            }
        });
        console.log(data);
        console.log(duplicates);
    });

fetch("../links.json")
    .then(response => {
        return response.json();
    })
    .then(jsondata => {
        links = jsondata;
        links.forEach(link => {
            document.getElementById("links").innerHTML += link.link;
            document.getElementById("dataList").innerHTML += `
                <p onclick="launchForm('${link.title}')" class="dataLink">${link.title}</p>
            `;
        });
    });

function filterByGraad(graad) {
    let graad1 = "1ste graad";
    let graad2 = "2de graad";
    let graad3 = "3de graad";

    for (let i = 0; i < data.length; i++) {
        switch (graad) {
            case 0:
                document.getElementById(i).style.display = "table-row";
                break;
            case 1:
                if (document.getElementById(i).firstElementChild.innerHTML != graad1) {
                    document.getElementById(i).style.display = "none";
                } else {
                    document.getElementById(i).style.display = "table-row";
                }
                break;
            case 2:
                if (document.getElementById(i).firstElementChild.innerHTML != graad2) {
                    document.getElementById(i).style.display = "none";
                } else {
                    document.getElementById(i).style.display = "table-row";
                }
                break;
            case 3:
                if (document.getElementById(i).firstElementChild.innerHTML != graad3) {
                    document.getElementById(i).style.display = "none";
                } else {
                    document.getElementById(i).style.display = "table-row";
                }
                break;
            default:
                break;
        }
    }
}

function filterByText(input) {
    let showArr = [];
    let hideArr = [];
    for (let i = 0; i < data.length; i++) {
        if (document.getElementById("doelzin" + i).innerText.includes(input) || document.getElementById("comp" + i).innerText.includes(input) || document.getElementById("finaliteit" + i).innerText.includes(input)) {
            showArr.push(i);
        } else {
            hideArr.push(i);
        }
    }

    showArr.forEach(comp => {
        document.getElementById(comp).style.display = "table-row";
    });

    hideArr.forEach(comp => {
        document.getElementById(comp).style.display = "none";
    });
}

function showOrHideForm(state) {
    let existingEDUbox;
    if (state == 1 && title.value != null && title.value != undefined && title.value != "" && title.value != " ") {
        links.forEach(link => {
            if (link.title == title.value) {
                existingEDUbox = link.title;
            }
        });

        if (existingEDUbox != undefined) {
            document.getElementById("delete").style.display = "block";
            fetch("../backend/data/" + existingEDUbox + ".json")
                .then(response => {
                    return response.json();
                })
                .then(jsondata => {
                    fillInForm(jsondata, true)
                });
        } else {
            document.getElementById("delete").style.display = "none";
            if (!formFilledIn)
                fillInForm(data, false);
        }

        compForm.style.display = "flex";
        nav.style.display = "flex";
        addBtn.style.display = "block";
        zoeken.style.display = "block";
        titelDisplay.innerHTML = title.value;
        newEDUform.style.display = "none";

        document.getElementById("inputPrompt").style.display = "block";
    } else if (state == 0) {
        compForm.style.display = "none";
        nav.style.display = "none";
        addBtn.style.display = "none";
        zoeken.style.display = "none";
        newEDUform.style.display = "flex";

        document.getElementById("inputPrompt").style.display = "flex";
    }
}

function fillInForm(passedData, hasChecks) {
    let picked;
    let hoofdstukken = [];
    index = 0;
    pickedArr = [];
    htmlString = `
        <tr id="tableHead">
            <th>Graad</th>
            <th>Finaliteit</th>
            <th>Sleutelcompetentie</th>
            <th>Doelzin</th>
        </tr>
    `;

    data.forEach(element => {
        pickedArr.push(element);
        let sleutelComp;
        let doelzin;
        let finaliteit

        if ("vlaamse_sleutelcompetentie" in element.onderwijsdoelenset) {
            sleutelComp = element.onderwijsdoelenset.vlaamse_sleutelcompetentie.korte_naam;
        } else {
            sleutelComp = element.onderwijsdoelenset.wetenschapsdomein.korte_naam;
        }
        if (element.omschrijving.includes("<p>")) {
            doelzin = element.omschrijving.slice(3, -1);
        } else {
            doelzin = element.omschrijving;
        }
        if (element.onderwijsdoelenset.onderwijsstructuur.graad != "1ste graad") {
            finaliteit = element.onderwijsdoelenset.onderwijsstructuur.finaliteit;
        } else {
            finaliteit = element.onderwijsdoelenset.onderwijsstructuur.stroom;
        }

        htmlString += `
                <tr id="${index}">
                    <td>${element.onderwijsdoelenset.onderwijsstructuur.graad}</td>
                    <td id="finaliteit${index}">${finaliteit}</td>
                    <td id="comp${index}">${sleutelComp}</td>
                    <td id="doelzin${index}" class="doelzin">${element.code} ${doelzin}</td>
                </tr>
            `;
        index++;
    });
    compTable.innerHTML = htmlString;

    if (hasChecks) {
        passedData.forEach(element => {
            element.Hoofdstukken.forEach(hs => {
                if (!hoofdstukken.includes(hs))
                    hoofdstukken.push(hs);
            });
        });

        hoofdstukken.forEach(hs => {
            addHeader(hs);
        });

        passedData.forEach(comp => {
            comp.Hoofdstukken.forEach(hs => {
                document.getElementById("check" + comp.Id + hs).checked = true;
                document.getElementById("check" + comp.Id + hs).setAttribute("checked", true);
            });
        });
    }
    formFilledIn = true;
}

function addHeader(head) {
    if (head != null && head != " ") {
        htmlString = "";
        document.getElementById("tableHead").innerHTML += `<th class="${head}">${head} <button onclick="deleteCol('${head}')" id="deleteCol">-</button></th>`;

        for (let i = 0; i < pickedArr.length; i++) {
            htmlString = `
                    <td class="${head}">
                        <input onclick="checkOrUncheckComp('${head}', ${i})" type="checkbox" id="check${i}${head}" name="${i}" value="yes">
                        <label for="${i}">Ja</label>
                    </td>
                `;
            document.getElementById(i).innerHTML += htmlString;
        }
    }
}

addCol.addEventListener('click', (e) => {
    e.preventDefault();
    let title = prompt('Kies de naam van de cel (bv: Hoofdstuk 1)');
    addHeader(title);
});

start.addEventListener('submit', (e) => {
    e.preventDefault();
    showOrHideForm(1)
});

nameSwitch.addEventListener('click', (e) => {
    e.preventDefault();
    showOrHideForm(0);
});

cancel.addEventListener('click', (e) => {
    e.preventDefault();
    document.location.reload();
});

search.addEventListener('input', (e) => {
    e.preventDefault();
    filterByText(search.value);
});

deleteComp.addEventListener('click', (e) => {
    e.preventDefault();
    if (confirm("Wil je deze EDUbox verwijderen?") == true) {
        fetch('https://competentie-platform-backend.herokuapp.com/api/deleteEdubox', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                "title": title.value
            })
        });
    }
});