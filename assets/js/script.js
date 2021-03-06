const apiUrl = "https://charlottegracia.dk/wp-json/wp/v2/";
const apiUserCredentials = {
    username: "api.user",
    password: "API-key-1234#!",
};

let katte;
const katId = 27;
const stockImagesId = 28;
const samarbejdspartnereId = 29;
const katINoedId = 30;
const foreningenId = 32;

getToken();

function getToken() {
    fetch('https://charlottegracia.dk/wp-json/jwt-auth/v1/token', {
        method: 'POST',
        body: JSON.stringify(apiUserCredentials),
        headers: {
            'Content-Type': 'application/JSON'
        }
    })
        .then(response => {
            return response.json(); //converts response to JSON and returns it
        })
        .then(response => {
            window.localStorage.setItem("authToken", response.token) //saves response.token in localStorage
            createPage();
        })
        .catch(error => {
            console.log(error); // logs any errors
        })
}

function createPage() {
    const url = window.location.href;
    fetch(`${apiUrl}posts?status=private&categories=${katId}&per_page=50`, {
        headers: {
            'Authorization': `Bearer ${window.localStorage.getItem("authToken")}`
        }
    }) //specifies the url to fetch() method with the API key
        .then(response => response.json()) //converts response to JSON object
        .then(data => { //passing data through arrow function
            drawNav();
            katte = data;
            if (url.indexOf('adopter') > -1) {
                drawAdopter(data);
            } else if (url.indexOf('kat-i-noed') > -1) {
                drawKatINoed();
            } else if (url.indexOf('kat') > -1) {
                drawCat(data);
            } else if (url.indexOf('stoet-os') > -1) {
                drawStoetOs();
            } else if (url.indexOf('foreningen') > -1) {
                drawForeningen();
            } else if (url.indexOf('samarbejde') > -1) {
                drawSamarbejdspartnere();
            } else if (url.indexOf('kontakt') > -1) {
                drawKontakt();
            } else {
                drawFrontpage(data);
            }
            drawFooter();
        })
        .catch(error => {
            console.log(error); // logs any errors
        })
}

function drawNav() {
    let text = "";
    text += `
    <nav>
        <a href="index.html">
            <img src="assets/images/NSKlogo.jpeg" alt="NSK Logo">
            <h1>Nordsj??llands Kattehj??lp</h1>
        </a>
        <ul>
            <li>
                <a href="index.html?adopter">Adopter</a>
            </li>
            <li>
                <a href="index.html?stoet-os">St??t os</a>
            </li>
            <li>
                <a href="index.html?kat-i-noed">Kat i n??d</a>
            </li>
            <li>
                <a href="index.html?foreningen">Foreningen</a>
            </li>
            <li>
                <a href="index.html?samarbejde">Samarbejde</a>
            </li>
            <li>
                <a href="index.html?kontakt">Kontakt</a>
            </li>
        </ul>
        <i id="navIkon" class="fas fa-bars" onclick="dropdownMobile()"></i>
    </nav>
    <ul class="dropdownMobile" id="navMobile">
        <li>
            <a href="index.html?adopter">Adopter</a>
        </li>
        <li>
            <a href="index.html?stoet-os">St??t os</a>
        </li>
        <li>
            <a href="index.html?kat-i-noed">Kat i n??d</a>
        </li>
        <li>
            <a href="index.html?foreningen">Foreningen</a>
        </li>
        <li>
            <a href="index.html?samarbejde">Samarbejde</a>
        </li>
        <li>
            <a href="index.html?kontakt">Kontakt</a>
        </li>
    </ul>
    <img class="social" src="assets/images/pilop.png" alt="pil op" onclick="backToTop()" id="backToTopButton">
    <a target="_blank" href="https://www.facebook.com/Kattehjaelpen/"> <img class="social social1" src="assets/images/facebookside.png" alt="facebookside"></a>
    <a target="_blank" href="https://www.facebook.com/groups/720551148010976/"> <img class="social social2" src="assets/images/facebookgruppe.png" alt="facebookgruppe"></a>
    <a target="_blank" href="https://www.instagram.com/kattehjaelp_/"> <img class="social social3" src="assets/images/instagram.png" alt="instagram"></a>
    <a target="_blank" href="https://www.dba.dk/saelger/privat/dba/1591203"> <img class="social social4" src="assets/images/dba.png" alt="dba"></a>
    `;
    document.querySelector('header').innerHTML = text;
}

function dropdownMobile() {
    if (document.getElementById("navMobile").style.display === "block") {
        document.getElementById("navMobile").style.display = "none";
    } else {
        document.getElementById("navMobile").style.display = "block"
    }
}

function drawFooter() {
    let text = "";
    text += `
        <h5> <a href="mailto:info@kattehjaelp.dk" class="mail whiteText">info@kattehjaelp.dk</a> | Konto: reg.: 5357 konto: 0246871 | CVR nr. 37805335</h5>
        <h5>Donationer modtages p?? Mobilepay 94686</h5>
        <a href="https://www.facebook.com/Kattehjaelpen/"> <img class="social whiteBorderHover" src="assets/images/facebookside2.png" alt="facebookside"></a>
        <a href="https://www.facebook.com/groups/720551148010976/"> <img class="social whiteBorderHover" src="assets/images/facebookgruppe2.png" alt="facebookgruppe"></a>
        <a href="https://www.instagram.com/kattehjaelp_/"> <img class="social whiteBorderHover" src="assets/images/instagram2.png" alt="instagram"></a>
        <a href="https://www.dba.dk/saelger/privat/dba/1591203"> <img class="social whiteBorderHover" src="assets/images/dba2.png" alt="dba"></a>
    `;
    document.querySelector('footer').innerHTML = text;
}

function drawFrontpage(data) {
    let title = "<title>Nordsj??llands Kattehj??lp</title>";
    document.querySelector("head").innerHTML += title;
    let metaText = `<meta name="description" content="Nordsj??llands Kattehj??lp er et st??rkt netv??rk af frivillige, private plejefamilier, der ??nsker at forbedre forholdene for ejerl??se katte i Nordsj??lland.">`
    document.querySelector("head").innerHTML += metaText;
    let text = "";
    fetch(`${apiUrl}posts?status=private&categories=${stockImagesId}&per_page=50`, {
        headers: {
            'Authorization': `Bearer ${window.localStorage.getItem("authToken")}`
        }
    }) //specifies the url to fetch() method with the API key
        .then(response => response.json()) //converts response to JSON object
        .then(billeder => { //passing data through arrow function
            text += `
        <h1>Nordsj??llands Kattehj??lp</h1>
        <section class="frontpageGrid">
            <a class="hoverBlue blue" href="index.html?adopter">
                <h2>Adopter</h2>
                <h3 class="darkblueText">Adoption / Bliv plejer</h3>
            </a>`
            if (data[0]) {
                text += `<a href="index.html?kat?${data[0].slug}"><img src="${data[0].acf.billeder.billede1.url}" alt="${data[0].acf.navn}"></a>`;
            } else {
                text += `<a><img src="${billeder[0].acf.billeder.stockbillede1.url}" alt="Kat></a>`;
            }
            text += `
            <a class="hoverDarkgreen darkgreen" href="index.html?stoet-os">
                <h2>St??t os</h2>
                <h3 class="greenText">Donation / Bliv medlem</h3>
            </a>
        `;
            if (data[1]) {
                text += `<a href="index.html?kat?${data[1].slug}"><img src="${data[1].acf.billeder.billede1.url}" alt="${data[1].acf.navn}"></a>`;
            } else {
                text += `<a><img src="${billeder[0].acf.billeder.stockbillede2.url}" alt="Kat></a>`;
            }
            if (data[2]) {
                text += `<a href="index.html?kat?${data[2].slug}"><img src="${data[2].acf.billeder.billede1.url}" alt="${data[2].acf.navn}"></a>`;
            } else {
                text += `
            <a href="#"><img src="${billeder[0].acf.billeder.stockbillede3.url}" alt="Kat"></a>`;
            }
            text += `
            <a class="hoverGreen green" href="index.html?kat-i-noed">
                <h2>Kat i n??d</h2>
                <h3 class="darkgreenText">Kattehj??lp / FIV</h3>
            </a>
        `;
            if (data[3]) {
                text += `<a href="index.html?kat?${data[3].slug}"><img src="${data[3].acf.billeder.billede1.url}" alt="${data[3].acf.navn}"></a>`;
            } else {
                text += `
            <a href="#"><img src="${billeder[0].acf.billeder.stockbillede4.url}" alt="Kat"></a>`;
            }
            text += `
            <a class="hoverDarkblue darkblue" href="index.html?foreningen">
                <h2>Foreningen</h2>
                <h3 class="blueText">Vedt??gter / Generalforsamling</h3>
            </a>
        </section
        `;
            document.querySelector('main').innerHTML = text;
        })
        .catch(error => {
            console.log(error); // logs any errors
        })
}

function drawSamarbejdspartnere() {
    let title = "<title>Samarbejdspartnere og sponsorer - Nordsj??llands Kattehj??lp</title>";
    document.querySelector("head").innerHTML += title;
    let metaText = `<meta name="description" content="Her er en oversigt over Nordsj??llands Kattehj??lps samarbejdspartnere og sponsorer.">`
    document.querySelector("head").innerHTML += metaText;
    fetch(`${apiUrl}posts?status=private&categories=${samarbejdspartnereId}&per_page=50`, {
        headers: {
            'Authorization': `Bearer ${window.localStorage.getItem("authToken")}`
        }
    }) //specifies the url to fetch() method with the API key
        .then(response => response.json()) //converts response to JSON object
        .then(samarbejdspartnere => { //passing data through arrow function
            let text = "";
            text += `
            <h1>Samarbejde</h1>
            <h2>Samarbejdspartnere og sponsorer</h2>`;
            text += `<section class="samarbejdsgrid">`;
            samarbejdspartnere.forEach(partner => {
                text += `
                <a href="${partner.acf.samarbejdspartner.firmalink}" target="_blank">
                    <img src="${partner.acf.samarbejdspartner.firmalogo.url}" alt="${partner.acf.samarbejdspartner.firmanavn}">
                </a>
            `;
            });
            text += `</section>`;
            document.querySelector('main').innerHTML = text;
        })
        .catch(error => {
            console.log(error); // logs any errors
        })
}

function drawAdopter(data) {
    fetch(`${apiUrl}posts?status=private&categories=${stockImagesId}&per_page=50`, {
        headers: {
            'Authorization': `Bearer ${window.localStorage.getItem("authToken")}`
        }
    }) //specifies the url to fetch() method with the API key
        .then(response => response.json()) //converts response to JSON object
        .then(billeder => { //passing data through arrow function
            let title = "<title>Adopter - Nordsj??llands Kattehj??lp</title>";
            document.querySelector("head").innerHTML += title;
            let metaText = `<meta name="description" content="Vi formidler kun katte og killinger, der er steriliseret/kastreret, ??rem??rket, chippet samt ormebehandlet og vaccineret 1. gang.">`
            document.querySelector("head").innerHTML += metaText;
            let text = "";
            console.log(data);
            text += `
        <h1>Adopter</h1>
        <h2>Katte som s??ger hjem</h2>
        <section class="flexAdopter">
                <section>
                    <h4>Milj??</h4>
                    <select class="miljo" name="miljo">
                        <option value="Alle">Alle</option>
                        <option value="Indekat">Indekat</option>
                        <option value="Udekat">Udekat</option>
                        <option value="Inde-/udekat">Inde-/udekat</option>
                    </select>
                </section>
                <section>
                    <h4>K??n</h4>
                    <select class="kon" name="kon">
                        <option value="Alle">Alle</option>
                        <option value="Hunkat">Hunkat</option>
                        <option value="Hankat">Hankat</option>
                    </select>
                </section>
            </section>
            <div class="result"></div>
        <section class="katteOverblikGrid">
        `;
            data.forEach(kat => {
                text +=
                    `<a href="index.html?kat?${kat.slug}">
                <img src="${kat.acf.billeder.billede1.url}" alt="${kat.acf.navn}">
                <section class="hoverBlue">
                    <p>${kat.acf.navn} - ${kat.acf.alder}</p>
                    <p>${kat.acf.inde_ude} - ${kat.acf.kon}</p>
                </section>
            </a>
            `;
            });
            text += `</section>`;
            text += `
        <article class="adoptionAfKatte">
            <article>
                <h2 class="greenText">Adoption af katte</h2>
                    <p>Nordsj??llands Kattehj??lp er ikke et internat. Vores katte bliver passet i private hjem og man skal "forh??ndgodkendes" f??r et bes??g. Vi bestr??ber os altid p?? at finde det bedste match mellem kat og ejer. </p>
                    <p>Vi formidler kun katte og killinger, der er steriliseret/kastreret, ??rem??rket, chippet samt ormebehandlet og vaccineret 1. gang.</p>
                    <p>Katten medbringer sundhedsbog og madpakke til den f??rste uge. K??nsmodne katte vil v??re Fiv/Felv testet.</p>
                    <p><span class="boldText">Killinger og unge katte</span> formidles for kr. 1450,-</p>
                    <p><span class="boldText">Katte over 2 ??r</span> formidles for kr. 1050,- </p>
                    <p>Med i prisen f??lger et ??rs st??ttemedlemsskab af foreningen (normalt kr. 275,- pr. ??r). </p>
                    <p>Kattene formidles i takt med at de bliver klar til hjem. De annonceres p?? vores <a target="_blank" href="https://www.facebook.com/groups/720551148010976/" class="boldText adopterLinks">Facebook gruppe</a> og p?? <a target="_blank" href="https://www.dba.dk/dyr/katte-og-tilbehoer/huskatte/reg-nordsjaelland/" class="boldText adopterLinks">dba</a> samt her p?? hjemmesiden under Katte som s??ger hjem</p>
                </article>
                <article class="white venteliste">
                    <h2 class="darkblueText">Vil du p?? ventelisten?</h2>
                    <p>S?? send os en mail p?? <a href="mailto:info@kattehjaelp.dk" class="mail">info@kattehjaelp.dk</a> og fort??l lidt om hvad du s??ger og hvilket hjem du tilbyder (inde/udeliv, b??rn/alder, andre dyr/hvilke osv.) og lad os hj??lpe med at finde den helt rigtige kat til dit hjem.</p>
                    <p>Vores katte formidles prim??rt som indekatte eller til hjem med lukket have eller katteg??rd, men vi formidler ogs?? katte til fritl??b hvis man bor et egnet sted og katten forventes at kunne trives som udekat.</p>
                    <p>Unge killinger (3-4 mdr) formidles som udgangspunkt kun ud sammen 2 og 2 - medmindre der er kat i hjemmet i forvejen eller hvis vi vurderer at killingen vil egne sig godt til at v??re enekat.</p>
                    <h3 class="greyText">Katte der kr??ver lidt ekstra</h3>
                    <p>Mange af vores katte har et s??rligt behov for socialisering for at opn?? eller genvinde tilliden til mennesker. Ofte har de strejfet omkring som ejerl??se i en l??ngere periode.</p>
                    <p>Vi s??ger altid familier med ekstra t??lmodighed til denne type katte. </p>
                </article>
                <article>
                    <h2 class="greenText">Bliv plejer for Nordsj??llands Kattehj??lp</h2>
                    <p>Er du interesseret i at blive plejefamilie for Nordsj??llands Kattehj??lp, s?? skal du kontakte foreningens plejeansvarlige Joan Andersen p?? mail: <span class="boldText"><a href="mailto:joan@kattehjaelp.dk" class="mail">joan@kattehjaelp.dk</a></span>. I mailen skal du kort fort??lle hvad du kan tilbyde af hj??lp, hvordan du bor, din erfaring med katte osv. Du bliver herefter kontaktet enten pr. mail eller via en telefonisk samtale.</p>
                    <p>Vi s??ger prim??rt plejefamilier, som er bosat i Nordsj??lland og K??benhavn og du skal v??re indstillet p?? at ??bne dit hjem, for et bes??g af en repr??sentant fra foreningen. F??r et eventuelt samarbejde indg??s, s?? fremsendes der en kontrakt til underskrift med nedenst??ende punkter.</p>
                    <h3 class="greyText">Krav til vores plejefamilier:</h3>
                    <ol>
                        <li>Du skal v??re fyldt 18 ??r og helst have lidt erfaring med katte/killinger. Dine eventuelt egne dyr skal kunne fungere socialt og harmonisk med plejekatte/killinger og du skal skal kunne fremvise gyldig attest p?? at eventuelt egne katte er vaccineret indenfor det seneste ??r samt at de er neutraliserede.</li>
                        <li>Det skal v??re tilladt at katten/killingen opholder sig i din bolig. Er der restriktioner ift. art eller antal dyr der m?? v??re i din bolig, skal foreningen informeres om dette.</li>
                    </ul>
                    <img src="${billeder[0].acf.billeder.stockbillede1.url}" alt="Nordsj??llands Kattehj??lp">
                    <img src="${billeder[0].acf.billeder.stockbillede3.url}" alt="Nordsj??llands Kattehj??lp">
                </article>
                <article class="kravDel2">
                    <ol start="3">
                        <li>Du skal som udgangspunkt have adgang til bil/k??rsel ifm. dyrl??gebes??g mv. Vi har frivillige der ofte kan hj??lpe med k??rsel, men dette kan ikke garanteres. Vi benytter prim??rt vores faste dyrl??ger i Esperg??rde og i Frederikssund.</li>
                        <li>Du skal have mulighed for at isolere katten/killingen i et s??rskilt rum (evt. et badev??relse), som er adskilt for husets eventuelt andre dyr de f??rste dage af plejeperioden.</li>
                        <li>Du skal v??re indstillet p?? at indrette din bolig, s?? den tilgodeser kattens/killingens behov: fri adgang til t??rfoder, rent drikkevand, kradsetr??, kattebakke og flere forskellige gode ligge/gemmesteder. Katten/killingen m?? under <span class="boldText">ingen</span> omst??ndigheder komme ud!</li>
                        <li>Foreningen s??rger for t??rfoder, v??dfoder, kattegrus, leget??j mv. (medmindre dette frav??lges), men plejefamilien skal v??re indstillet p?? selv at afhente det p?? vores lager i Kvistg??rd eller Dronningm??lle medmindre andet aftales. </li>
                        <li>Foreningen afholder alle udgifter til dyrl??ge samt loppe/ormekure og andre former for behandling. Den plejeansvarlige skal altid kontaktes, hvis plejeren vurderer et behov for dyrl??gebes??g. Plejer skal l??bende, holde den plejeansvarlige orienteret om hvordan det g??r med katten/killingen og rette henvendelse, hvis der opst??r sp??rgsm??l i plejeperioden</li>
                        <li>S??fremt katten/killingen for??rsager skader p?? plejefamiliens hjem, interi??r eller p?? personer, vil alle eventuelle udgifter ifm. dette tilfalde plejefamilien selv. Der er tavshedspligt for plejefamilierne, vedr. forhold omkring de katte man f??r i pleje, samt ting der bliver aftalt I foreningens regi. Det er foreningen der alene st??r for formidling af plejekatten til dens nye hjem. Dette sker dog som udgangspunkt altid i samr??d med plejer.</li>
                    </ul>
                </article>
            </article>`;
            document.querySelector('main').innerHTML = text;
            const selectMiljo = document.querySelector('.miljo');
            const selectKon = document.querySelector('.kon');

            selectMiljo.addEventListener('change', (event) => {
                sortByEnvironment(event);
            });

            selectKon.addEventListener('change', (event) => {
                sortByGender(event);
            });

        })
        .catch(error => {
            console.log(error); // logs any errors
        })
}

function sortByEnvironment(event) {
    let result;
    let text = "";
    const currentGender = document.querySelector('.kon').value;
    if (event.target.value === 'Indekat') {
        result = katte.filter(element => (currentGender === "Alle" || element.acf.kon === currentGender) && element.acf.inde_ude === 'Indekat');
    } else if (event.target.value === "Udekat") {
        result = katte.filter(element => (currentGender === "Alle" || element.acf.kon === currentGender) && element.acf.inde_ude === 'Udekat');
    } else if (event.target.value === "Inde-/udekat") {
        result = katte.filter(element => (currentGender === "Alle" || element.acf.kon === currentGender) && element.acf.inde_ude === 'Inde-/udekat');
    } else if (event.target.value === "Alle") {
        result = katte.filter(element => currentGender === "Alle" || element.acf.kon === currentGender);
    }
    
    if (result.length > 0) {
        result.forEach(kat => {
            text +=
            `<a href="index.html?kat?${kat.slug}">
                <img src="${kat.acf.billeder.billede1.url}" alt="${kat.acf.navn}">
                <section class="hoverBlue">
                    <p>${kat.acf.navn} - ${kat.acf.alder}</p>
                    <p>${kat.acf.inde_ude} - ${kat.acf.kon}</p>
                </section>
            </a>
            `;
        });
    } else {
        text +=
            `<p>Ingen katte opfylder kriterierne.</p>
            `;
    }
    document.querySelector('.katteOverblikGrid').innerHTML = text;
}

function sortByGender(event) {
    let result;
    let text = "";
    const currentEnvironment = document.querySelector('.miljo').value;
    if (event.target.value === 'Hunkat') {
        result = katte.filter(element => (currentEnvironment === "Alle" || element.acf.inde_ude === currentEnvironment) && element.acf.kon === 'Hunkat');
    } else if (event.target.value === "Hankat") {
        result = katte.filter(element => (currentEnvironment === "Alle" || element.acf.inde_ude === currentEnvironment) && element.acf.kon === 'Hankat');
    } else if (event.target.value === "Alle") {
        result = katte.filter(element => currentEnvironment === "Alle" || element.acf.inde_ude === currentEnvironment);
    }

    if (result.length > 0) {
        result.forEach(kat => {
            text +=
            `<a href="index.html?kat?${kat.slug}">
                <img src="${kat.acf.billeder.billede1.url}" alt="${kat.acf.navn}">
                <section class="hoverBlue">
                    <p>${kat.acf.navn} - ${kat.acf.alder}</p>
                    <p>${kat.acf.inde_ude} - ${kat.acf.kon}</p>
                </section>
            </a>
            `;
        });
    } else {
        text +=
            `<p>Ingen katte opfylder kriterierne.</p>
            `;
    }
    document.querySelector('.katteOverblikGrid').innerHTML = text;
}

function drawCat(data) {
    const url = window.location.href;
    let urlSplit = url.split('?');
    let text = "";
    console.log(data);
    data.forEach(kat => {
        if (urlSplit[2] == kat.slug) {
            let title = `<title>${kat.acf.navn} - Nordsj??llands Kattehj??lp</title>`;
            let metaText = `<meta name="description" content="${kat.acf.beskrivelse}">`;
            document.querySelector("head").innerHTML += title;
            document.querySelector("head").innerHTML += metaText;
            text += `
            <h1>${kat.acf.navn}</h1>
            <section class="katGrid">
                `;
            if (kat.acf.billeder.billede2) {
                text += `
                    <section class="slideshowGrid"> 
                    <i class="ikon fas fa-chevron-left" onclick="plusDivs(-1)"></i> <!-- Kilde: https://www.w3schools.com/w3css/tryit.asp?filename=tryw3css_slideshow_self --> `;
            }
            text += `<section>`;
            if (kat.acf.billeder.billede1 != false) {
                text += `<img class="firstPic mySlides" src="${kat.acf.billeder.billede1.url}"></img>`; // Kilde: https://www.w3schools.com/w3css/tryit.asp?filename=tryw3css_slideshow_self
            }
            if (kat.acf.billeder.billede2 != false) {
                text += `<img class="mySlides" src="${kat.acf.billeder.billede2.url}"></img>`; // Kilde: https://www.w3schools.com/w3css/tryit.asp?filename=tryw3css_slideshow_self
            }
            if (kat.acf.billeder.billede3 != false) {
                text += `<img class="mySlides" src="${kat.acf.billeder.billede3.url}"></img>`;// Kilde: https://www.w3schools.com/w3css/tryit.asp?filename=tryw3css_slideshow_self
            }
            if (kat.acf.billeder.billede4 != false) {
                text += `<img class="mySlides" src="${kat.acf.billeder.billede4.url}"></img>`; // Kilde: https://www.w3schools.com/w3css/tryit.asp?filename=tryw3css_slideshow_self
            }

            text += `
                </section>`;
            if (kat.acf.billeder.billede2) {
                text += `
                <i class="ikon fas fa-chevron-right" onclick="plusDivs(1)"></i> <!-- Kilde: https://www.w3schools.com/w3css/tryit.asp?filename=tryw3css_slideshow_self -->
                </section>`;
            }
            text += `
                <article class="katInfo">
                    <h2>Info om kat</h2>
                    <ul>
                        <li><span class="boldText">K??n: </span>${kat.acf.kon}</li>
                        <li><span class="boldText">Milj??: </span>${kat.acf.inde_ude}</li>
                        <li><span class="boldText">Alder: </span>${kat.acf.alder}</li>
                        <li><span class="boldText">Status: </span>${kat.acf.status}</li>
                        <li><span class="boldText">Pris: </span>${kat.acf.pris},-</li>
                        <li><span class="boldText">Plejeby: </span>${kat.acf.plejeby}</li>
                        <li><span class="boldText">Formidler: </span>${kat.acf.formidler} - kontakt via <a class="mail" href="mailto:${kat.acf.formidler_email}">${kat.acf.formidler_email}</a></li>
                    </ul>
                    <p><span class="boldText">Kastreret, vaccineret, chippet</span> og <span class="boldText">??rem??rket</span>.</p>
                    <p>Medbringer <span class="boldText">sundhedsbog</span> og madpakke til den f??rste tid i nyt hjem.</p>
                    <p>Der anbefales tegning af en sygeforsikring - f.eks hos Dyreforsikringdanmark.dk</p>
                </article>
                <article class="katBeskrivelse">
                    <h3>Beskrivelse</h3>
                    <p>${kat.acf.beskrivelse}</p>
                </article>
                <article class="katPlejefamilie">
                `;
            if (kat.acf.plejefamilie_navne != "" && kat.acf.plejefamilien_fortaeller != "") {
                text += `<h4>Plejefamilien (${kat.acf.plejefamilie_navne}) fort??ller</h4>
                    <p>${kat.acf.plejefamilien_fortaeller}</p>`;
            } else if (kat.acf.plejefamilie_navne == "" && kat.acf.plejefamilien_fortaeller != "") {
                text += `<h4>Plejefamilien fort??ller</h4>
                    <p>${kat.acf.plejefamilien_fortaeller}</p>`;
            }
            text += `
                </article>
            </section>
            `;
        }
    });

    text += `
        <section class ="flereKatte">
        <h2>Se ogs??</h2>
        <section class="katteOverblikGrid">`;
    for (let i = 0; i < 4; i++) {
        text += `
            <a href="index.html?kat?${data[i].slug}">
                <img src="${data[i].acf.billeder.billede1.url}" alt="${data[i].acf.navn}">
                <section class="hoverBlue">
                    <p>${data[i].acf.navn} - ${data[i].acf.alder}</p>
                    <p>${data[i].acf.inde_ude}</p>
                </section>
            </a> 
    `;
    }
    text += `</section></section>`;
    document.querySelector('main').innerHTML = text;
}

/* KODE NEDENFOR ER FRA W3SCHOOLS. Kilde: https://www.w3schools.com/w3css/tryit.asp?filename=tryw3css_slideshow_self */
var slideIndex = 1;
showDivs(slideIndex);

function plusDivs(n) {
    showDivs(slideIndex += n);
}

function showDivs(n) {
    var i;
    var x = document.getElementsByClassName("mySlides");
    if (n > x.length) {
        slideIndex = 1
    }
    if (n < 1) {
        slideIndex = x.length
    }
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }
    if (x.length > 0) {
        x[slideIndex - 1].style.display = "block";
    }
}

/* KODE OVENFOR ER FRA W3SCHOOLS. Kilde: https://www.w3schools.com/w3css/tryit.asp?filename=tryw3css_slideshow_self */


function drawStoetOs() {
    let title = "<title>St??t os - Nordsj??llands Kattehj??lp</title>";
    document.querySelector("head").innerHTML += title;
    let metaText = `<meta name="description" content="Nordsj??llands Kattehj??lp er en forening drevet af engagerede dyrevenner, der alle arbejder frivilligt og ul??nnet.">`
    document.querySelector("head").innerHTML += metaText;
    let text = `
    <h1 class="stoet-osOverskrift">St??t os</h1>
        <h4 class="stoet-osUnderoverskrift">- og hj??lp os med at hj??lpe katte i n??d</h4>
        <section class="stoet-osGrid">
            <article>
                <h2>Giv en donation</h2>
                <h4>Betal med MobilePay:</h4>
                <ol>
                    <li>??bn MobilePay-appen</li>
                    <li>Tryk p?? 'Betal'</li>
                    <li>Scan QR-koden via appen</li>
                </ol>
                <h5>ELLER indtast nummeret i din app: 94686</h5>
                <ol>
                    <li>V??lg ok n??r du f??r beskeden <span class="cursive">"94686 er ikke i dine kontakter"</span></li>
                    <li>Swipe for betaling</li>
                </ol>
                <h4>Betal via bankoverf??rsel:</h4>
                <address>
                    <p>Arbejdernes Landsbank, Helsing??r</p>
                    <p>reg. <span class="boldText">5357</span> kontonr. <span class="boldText">0246871</span></p>
                </address>
            </article>
            <article>
                <img src="assets/images/mobilepay.png" alt="Mobilepay - Nordsj??llands Kattehj??lp" class="MP">
            </article>
        </section>
        <section class="stoet-osGrid extrawhite">
            <article>
                <h2 class="greenText">Bliv medlem</h2>
                <p>Nordsj??llands Kattehj??lp er en forening drevet af engagerede dyrevenner, der alle arbejder frivilligt og ul??nnet. </p>
                <p>Du kan blive st??ttemedlem ved at udfylde blanketten p?? h??jre side. Medlemskabet giver adgang til foreningens generalforsamling i maj. </p>
                <p>Der udsendes reminder om fornyelse af medlemskab hvert ??r i januar/februar m??ned via mail og Facebook. </p>
                <p>Det er muligt at tegne erhvervsmedlemsskab og f?? firmalogo p?? hjemmesiden under samarbejdspartnere og sponsorer. Det koster kr. <span class="boldText">600,-</span> om ??ret.</p>
                <p>Send en mail til <a href="mailto:info@kattehjaelp.dk" class="mail">info@kattehjaelp.dk </a> for n??rmere aftale herom. </p>
                <p>Ved adoption af en af vores katte eller killinger er der inkluderet et ??rs st??ttemedlemsskab i formidlingsgebyret. </p>
            </article>
            <form>
                <h3 class="greenText">Skriv og bliv medlem</h3>
                    <input class="white" type="text" placeholder="Navn">
                    <input class="white" type="text" placeholder="E-mail">
                    <input class="white" type="number" placeholder="Telefon">
                    <input class="white" type="text" placeholder="Adresse">
                    <input class="white" type="text" placeholder="Postnummer og by">
                    <textarea class="white" placeholder="Din besked..." style="height:100px"></textarea>
                <button class="hoverGreen" type="button">Send</button>
            </form>
        </section>
    `;

    document.querySelector('main').innerHTML = text;
}

function drawKatINoed() {
    let title = "<title>Kat i n??d - Nordsj??llands Kattehj??lp</title>";
    document.querySelector("head").innerHTML += title;
    let metaText = `<meta name="description" content="Ved n??dstedt, tilskadekommen eller p??k??rt kat, s?? bring selv katten til n??rmeste dyrl??ge eller kontakt Dyrenes Beskyttelse p?? deres akutnummer 1812. Man m?? IKKE selv aflive et p??k??rt dyr.">`
    document.querySelector("head").innerHTML += metaText;
    fetch(`${apiUrl}posts?status=private&categories=${katINoedId}&per_page=50`, {
        headers: {
            'Authorization': `Bearer ${window.localStorage.getItem("authToken")}`
        }
    }) //specifies the url to fetch() method with the API key
        .then(response => response.json()) //converts response to JSON object
        .then(billeder => { //passing data through arrow function
            let text = "";
            text += `
        <h1>Kat i n??d</h1>
        <section class="katINoedGrid">
        <section>
            <h2>Katte i n??d</h2>
            <section class="dropdownKatINoed">
                <h4 class="blue dropdown" onclick="dropdownKatiNoed(1)">Hvad g??r jeg, hvis jeg finder en forladt killing? <i class="fas fa-chevron-down"></i></h4> <!-- ikon fra FontAwesome-->
                <article class="hide white dropdownContentKatINoed" id="katINoed1">
                    <iframe width="100%" height="315" src="https://www.youtube.com/embed/V50NMZsFIco?start=4" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                    <p>I f??rste omgang, er det vigtigt at sikre sig at killingen virkelig er forladt af deres mor. Alt efter killingens alder kan der g?? 3-8 timer imellem at moderkatten vender tilbage for at die sine killinger.</p>
                    <p>Herefter er det meget vigtigt at en kold og forkommen killings kropstemperatur er oppe p?? 35 grader f??r man giver den mad. L??g evt. en flaske varmt vand ned til den som varmedunk (pak flasken ind i h??ndkl??de). I akutte tilf??lde gives fysiologisk sukkervand (fremstilles af 55 g. druesukker opl??st i 1 liter vand - hvis du ikke har druesukker, kan 1 dl. puddersukker anvendes i stedet).</p>
                    <p>N??r killingen har opn??et normal kropstemperatur kan den fodres med moderm??lkerstatning. Husk at der b??de skal b??vses af og reng??res bagi efter hvert m??ltid. Se evt. videoen ??verst.</p>
                    <p>Nordjyllands Hittekilling har lavet en fin lille anvisning p?? pleje og pasning af killinger p?? deres hjemmeside som du finder ved <a class="mail" target="_blank" href="https://www.nordjyllandshittekilling.dk/">at klikke her</a></p>
                </article>
            </section>
            <section class="dropdownKatINoed">
                <h4 class="blue dropdown" onclick="dropdownKatiNoed(2)">Till??berkat der er kontakts??gende <i class="fas fa-chevron-down"></i></h4> <!-- ikon fra FontAwesome-->
                <article class="hide white dropdownContentKatINoed" id="katINoed2">
                    <p>Tjek f??rst om katten er ??rem??rket eller chippet. ??rem??rke fremg??r tydeligere ved at gnide lidt madolie p?? ??ret eller ved at lyse bagfra p?? ??ret med en lommelygte. Kan du afl??se ??rem??rket, s?? kan du finde ejeren i et af de danske registre (se links her p?? siden). S??t et ? istedet for ul??selige tegn. Chip skal tjekkes ved dyrl??gen med en chipscanner.</p>
                    <p>Er katten ikke m??rket eller er det ikke muligt at finde frem til ejer, s?? skal katten fremlyses med de nuv??rende regler. S??t opslag op i n??romr??det i minimum 5 dage, efterlys den p?? Facebook i lokale grupper.</p>
                    <p class="cursive">Der forventes at komme ny lovgivning pr. 1/7-2121 hvor ikke m??rkede katte automatisk betragtes som ejerl??se og derfor ikke l??ngere skal fremlyses, men kan indleveres p?? et internat.</p>
                </article>
            </section>
            <section class="dropdownKatINoed">
                <h4 class="blue dropdown" onclick="dropdownKatiNoed(3)">Vildkat/vildtlevende kat <i class="fas fa-chevron-down"></i></h4> <!-- ikon fra FontAwesome-->
                <article class="hide white dropdownContentKatINoed" id="katINoed3">
                    <p>Kontakt din kommune for at f?? en rekvisitation til indfangning via Kattens V??rn. Desv??rre har mange kommuner fravalgt samarbejdet med Kattens V??rn og udgiften p??hviler derfor dig som privatperson. Kattens V??rn hj??lper med indfangning og aflivning, men du kan ogs?? v??lge at f?? katten dyrl??getjekket, neutraliseret, m??rket og genudsat med dig som foderv??rt/ejer. L??s mere p?? Kattens V??rns hjemmeside <a class="mail" target="_blank" href="https://kattens-vaern.dk/vildekatte">her</a></p>
                    <p>Dyrenes Beskyttelse hj??lper som udgangspunkt kun vildtlevende katte hvis de er tilskadekomne.</p>
                    <p>Nordsj??llands Kattehj??lp kan desv??rre ikke hj??lpe med pleje til voksne "vildkatte". Vi modtager kun tamme eller delvis tamme, ejerl??se katte. Vi hj??lper dog meget gerne med genuds??tning, hvis du er indstillet p?? at betale et mindre bel??b til d??kning af dyrl??geudgifterne og indg?? en foderv??rtaftale. Katten genuds??ttes i dit navn og er herefter dit ansvar som foderv??rt. I s??rlige tilf??lde har vi ogs?? mulighed for at yde ??konomisk hj??lp ved lidt st??rre genuds??tningsprojekter. Kontakt os p?? <a href="mailto:info@kattehjaelp.dk" class="mail">info@kattehjaelp.dk</a> for at h??re n??rmere.</p>
                </article>
            </section>
            <section class="dropdownKatINoed">
                <h4 class="blue dropdown" onclick="dropdownKatiNoed(4)">Tilskadekommende kat <i class="fas fa-chevron-down"></i></h4> <!-- ikon fra FontAwesome-->
                <article class="hide white dropdownContentKatINoed" id="katINoed4">
                    <p>Ved n??dstedt, tilskadekommen eller p??k??rt kat, s?? bring selv katten til n??rmeste dyrl??ge eller kontakt Dyrenes Beskyttelse p?? deres akutnummer <a class="mail" href="tel:1812">1812</a>. Man m?? IKKE selv aflive et p??k??rt dyr. </p>
                </article>
            </section>
            <section class="dropdownKatINoed">
                <h4 class="blue dropdown" onclick="dropdownKatiNoed(5)">Trafikdr??bt kat <i class="fas fa-chevron-down"></i></h4> <!-- ikon fra FontAwesome-->
                <article class="hide white dropdownContentKatINoed" id="katINoed5">
                    <p>Er katten allerede d??d og er den ??rem??rket, s?? kan du finde ejeren via de danske registre (se links her p?? siden). S??t et ? ved ul??selige tegn. Er det ikke muligt at finde en ejer, s?? kan du kontakte Falck for at f?? afhentet katten og lav evt. et opslag i en lokal facebook gruppe s?? ejer f??r besked.</p>
                </article>
            </section>
            <section class="dropdownKatINoed">
                <h4 class="blue dropdown" onclick="dropdownKatiNoed(6)">Katteregistre, internater & foreninger <i class="fas fa-chevron-down"></i></h4> <!-- ikon fra FontAwesome-->
                <article class="hide white dropdownContentKatINoed" id="katINoed6">
                    <h3>Katteregistre:</h3>
                    <p><a class="mail" target="_blank" href="http://www.dansk-katteregister.dk/">Dansk Katteregister</a></p>
                    <p><a class="mail" target="_blank" href="https://www.katteregister.dk/s%C3%B8g-efter-kat">Katteregister</a></p>
                    <h3>Internater og foreninger i Nordsj??lland:</h3>
                    <address>
                        <p><a class="boldText mail" target="_blank" href="https://inges-kattehjem.dk/">Inges Kattehjem</a></p>
                        <p>Ejbydalsvej 260</p>
                        <p>2600 Glostrup</p>
                        <p><a class="blueText" href="tel:44853535">Tlf. 44 85 35 35</a></p>
                    </address>
                    <address>
                        <p><a class="boldText mail" target="_blank" href="https://dyrevaernet.dk/">Dyrev??rnet</a></p>
                        <p>Islevdalvej 85</p>
                        <p>2610 R??dovre</p>
                        <p><a class="blueText" href="tel:44946695">Tlf. 44 94 66 95</a></p>
                    </address>
                    <address>
                        <p><a class="boldText mail" href="https://kattens-vaern.dk/">Kattens V??rn</a></p>
                        <p>Sandager 11</p>
                        <p>2605 Br??ndby</p>
                        <p><a class="blueText" href="tel:38881200">Tlf. 38 88 12 00</a></p>
                    </address>
                    <address>
                        <p><a class="boldText mail" href="http://www.roskildeinternat.dk">Roskilde Internat (Dyrenes Beskyttelse)</a></p>
                        <p>Darupvej 131</p>
                        <p>4000 Roskilde</p>
                        <p><a class="blueText" href="tel:20527428">Tlf: 20 52 74 28</a></p>
                    </address>
                    <h3>Internater og foreninger i Nordsj??lland:</h3>
                    <p><a class="mail" target="_blank" href="https://www.facebook.com/havnekat/">Hundested Havnekatte</a></p>
                    <p><a class="mail" target="_blank" href="https://vestegnenskattehjalp.wixsite.com/website">Vestegnens Kattehj??lp</a></p>
                    <p><a class="mail" target="_blank" href="https://foreningensimba.dk/">Foreningen Simba</a></p>
                    <p><a class="mail" target="_blank" href="https://www.facebook.com/Foreningen-Sydhavs%C3%B8ernes-Katte-SOS-vores-katte-og-killinger-847775225579113/">Sydhavs??erne Kattehj??lp SOS</a></p>
                    <h3>??vrige Sj??lland:</h3>
                    <address>
                        <p><a class="boldText mail" href="https://inges-kattehjem.dk/">Inges Kattehjem i N??stved</a></p>
                        <p>Kasernevej 1</p>
                        <p>4700 N??stved</p>
                        <p><a class="blueText" href="tel:44853555">Tlf. 44 85 35 55</a></p>
                    </address>
                    <address>
                        <p><a class="boldText mail" href="http://kvslagelse.dk/">Kattens V??rn i Slagelse</a></p>
                        <p>Rugv??nget 12</p>
                        <p>4200 Slagelse</p>
                        <p><a class="blueText" href="tel:58505144">Tlf. 58 50 51 44</a></p>
                    </address>
                    <address>
                        <p><a class="boldText mail" href="vestsjaelland-hundepension.dk">Vestsj??llands Internat (Dyrenes Beskyttelse)</a></p>
                        <p>Stenager 2</p>
                        <p>4460 Snertinge</p>
                        <p><a class="blueText" href="tel:59293600">Tlf. 59 29 36 00</a></p>
                    </address>
                    <address>
                        <p><a class="boldText mail" href="vestsjaelland-hundepension.dk">Fuglebjerg Kattehjem (Dyrenes Beskyttelse)</a></p>
                        <p>Sandvedvej 36</p>
                        <p>4250 Fuglebjerg</p>
                        <p><a class="blueText" href="tel:60631650">Tlf. 60 63 16 50</a></p>
                    </address>
                    <h3>??vrige Sj??lland:</h3>
                    <p><a class="mail" target="_blank" href="https://www.karlakattehjem.dk/">Karla Kattehjem</a></p>
                    <p><a class="mail" target="_blank" href="https://www.tullebo.dk/">Tullebo Kattehjem</a></p>
                </article>
            </section>
        </section>
        <img class="oremaerke" src="${billeder[0].acf.oremaerke.url}" alt="${billeder[0].acf.oremaerke.name}">
        <section>
            <h3 class="greenText">FIV (For stadie til katteaids)</h3>
            <p>Fiv er et forstadie til katteaids og beh??ver s??ledes ikke n??dvendigvis at udvikle sig til en sygdom. Fiv opdages via en blodpr??ve hos dyrl??gen og betyder i f??rste omgang, at din kat kan v??re mere modtagelig overfor infektioner,  f?? feber, h??vede lymfeknuder osv. N??r/hvis sygdommen for alvor bryder ud, s?? vil immunforsvaret nedbrydes af virus. S??ledes f??r andre sygdomsforl??b mulighed for at udvikle sig og symptomerne kan derfor v??re mange forskellige.</p>
            <p>Katten smittes via dybe bid og i forbindelse med parring. Typisk er det fritl??bere (udekatte), der bliver smittet. Fiv smitter ikke mennesker! Man skal derfor overveje, om en fiv positiv udekat kan omskoles til at v??re indekat? I dag f??r flere og flere katte bygget en katteg??rd/voliere for at undg?? at katten uds??ttes for fare eller pga naboklager. Nogle gange viser det sig dog, at katten er bedst tjent med at blive aflivet.</p>
            <p>I USA findes der en fiv vaccine. Den er ikke godkendt i DK. L??s evt. mere her. Ofte afh??nger en fiv kats sk??bne af hvilken dyrl??ge der tester den. Nogen dyrl??ger anbefaler altid aflivning men mange er blevet bedre til at informere ejerne om kattens fremtidsudsigter - der ikke altid beh??ver at v??re d??rlig. P?? internaterne aflives fiv katte n??sten altid, da der er s?? mange herrel??se katte i Danmark at det kan virke omsonst at redde katte med fiv.</p>
            <p>I Nordsj??llands Kattehj??lp valgte vi at hj??lpe 3 fiv katte ud i hjem i 2018 og 2 i 2019 og Olga i 2020. To af dem fra 2018 (Skipper og Jarl) var godt brugte hankatte fra Hundested Havn, som vi vurderede ville s??tte pris p?? et fork??let liv som indekatte efter et h??rdt liv p?? havnen - og indtil videre ser det ud til at lykkes (se fotos her p?? siden). Den sidste var en till??bende ungkat (Lilleven) som i dag bor som tilfreds indekat hos Birgit fra vores bestyrelse. I 2019 har vi formidlet 2 maincoon drenge med Fiv til nye hjem i hhv. Ringsted og ??rhus. L??s mere i vores facebook gruppe "Katteliv med fiv"</p>
        </section>
        <section>
            <p>I England findes der et ??ldre par der gennem livet har taget 80 fiv katte ind som deres egne (fiv shelter). De har udgivet en lille bog (booklet) med deres erfaringer omkring katte med fiv. Den er gratis og kan downloades her.</p>
            <p>Nordsj??llands Kattehj??lp tester ikke automatisk killinger for Fiv. L??s <a href="http://www.fivcats.com/FIV/fiv_kittens.html" target="_blank" class="mail">her</a> hvorfor.</p>
            <section class="skipperOgJarlGrid">
                <img src="${billeder[0].acf.skipper_og_jarl.billede1.url}" alt="${billeder[0].acf.oremaerke.name}">
                <img src="${billeder[0].acf.skipper_og_jarl.billede2.url}" alt="${billeder[0].acf.oremaerke.name}">
            </section>
            <p class="billedTekst">Skipper p?? lammeskind og Jarl i vindueskarmen. Begge brugte hankatte fra Hundested Havn med fiv - som i dag lever det fede katteliv i lejlighed.</p>
        </section>
    </section>
        `;
            document.querySelector('main').innerHTML = text;
        })
        .catch(error => {
            console.log(error); // logs any errors
        })
}

function drawForeningen() {
    let title = "<title>Foreningen - Nordsj??llands Kattehj??lp</title>";
    document.querySelector("head").innerHTML += title;
    let metaText = `<meta name="description" content="Nordsj??llands Kattehj??lp er et st??rkt netv??rk af frivillige, private plejefamilier, der ??nsker at forbedre forholdene for ejerl??se katte i Nordsj??lland.">`
    document.querySelector("head").innerHTML += metaText;
    fetch(`${apiUrl}posts?status=private&categories=${foreningenId}&per_page=50`, {
        headers: {
            'Authorization': `Bearer ${window.localStorage.getItem("authToken")}`
        }
    }) //specifies the url to fetch() method with the API key
        .then(response => response.json()) //converts response to JSON object
        .then(billeder => { //passing data through arrow function
            let text = "";
            text += `
        <h1>Foreningen</h1>
        <section class="foreningenGrid">
            <article class="white">
                <h2>Om foreningen Nordsj??llands Kattehj??lp</h2>
                <p>Nordsj??llands Kattehj??lp er et st??rkt netv??rk af frivillige, private plejefamilier, der ??nsker at forbedre forholdene for ejerl??se katte i Nordsj??lland.</p>
                <p>St??r du med en till??ber, som du ikke kan finde ejeren til, s?? hj??lper vi med r??d og vejledning og kan tilbyde plejeophold med henblik p?? at finde katten et nyt hjem.</p>
                <p>Vi hj??lper med neutralisering, vaccination og ??rem??rkning af katte til genuds??tning i den udstr??kning det er os muligt. Dette foruds??tter, at man tegner et medlemskab hos os, at katten ikke er tamkat samt at man p??tager sig ansvaret som foderv??rt</p>
                <p>Ved akutte sager med tilskadekomne katte skal du kontakte Dyrenes Beskyttelse p?? 1812 eller bringe katten til n??rmeste dyrl??ge.</p>
                <h3>Bestyrelsen</h3>
                <ul>
                    <li><span class="boldText">Formand</span> Joan Andersen - <a href="mailto:joan@kattehjaelp.dk" class="mail">joan@kattehjaelp.dk</a></li>
                    <li><span class="boldText">N??stformand</span> Annette Nielsen - <a href="mailto:annette@kattehjaelp.dk" class="mail">annette@kattehjaelp.dk</a></li>
                    <li><span class="boldText">Kasserer</span> Kirsten Hammer - <a href="mailto:kirsten@kattehjaelp.dk" class="mail">kirsten@kattehjaelp.dk</a></li>
                    <li><span class="boldText">4. bestyrelsesmedlem</span> Margit Rand - <a href="mailto:margit@kattehjaelp.dk" class="mail">margit@kattehjaelp.dk</a></li>
                    <li><span class="boldText">5. bestyrelsesmedlem </span>Birgit Bauer - <a href="mailto:birgit@kattehjaelp.dk" class="mail">birgit@kattehjaelp.dk</a></li>

                </ul>
            </article>
            <img src="${billeder[0].acf.kort.url}" alt="Kort">
            <article>
                <h2 class="greenText">Vedt??gter & generalforsamling</h2>
                <p>Regnskabs??ret for Foreningen Nordsj??llands Kattehj??lp g??r fra 1. januar til 31. december. Der afholdes generalforsamling hvert ??r sidst i maj. Betalende medlemmer indkaldes via e-mail senest 4 uger f??r afholdelse.</p>
                <h3>Generalforsamling</h3>
                <address>
                    <p>Nordsj??llands Kattehj??lp</p>
                    <p>L??rdag den 18. juli 2020, kl. 14-16</p>
                    <p>Afholdt i Snekkersten</p>
                </address>
                <p>Generalforsamlingen var udsat fra maj til juli pga covid-19</p>
                <p><span class="boldText">Fremm??dte:</span> Joan Andersen, Annette Nielsen, Kirsten Hammer, Margit Rand, Birgit Bauer, Annette Bantz, Anne Glipstrup, Carli H??kkerup, Heidi Juel Hermansen, Rikke Falk Hansen og Anne Mau.</p>
                <a href="assets/images/NSK.pdf" download="NSK vedt??gter"><button class="hoverDarkgreen darkgreen" type="button">Download PDF</button></a>
            </article>
            <img src="${billeder[0].acf.kat.url}" alt="${billeder[0].acf.kat.title}">
        </section>
        <section>
            <h4 class="green dropdown" onclick="dropdown()">Seneste generalforsamling <i class="fas fa-chevron-down"></i></h4> <!-- ikon fra FontAwesome-->
            <section class="hide white dropdownContentForeningen" id="dropdownForeningen">
                <article>
                    <ol>
                        <li>Valg af dirigent (Birgit Bauer)</li>
                        <li>Valg af referent (Anne Glipstrup)</li>
                        <li>Beretning fra formanden inkl. Regnskab</li>
                    </ol>
                    <p>Nordsj??llands???Kattehj??lp (NSK),???har???kontinuerligt???haft???mellem 30-60???katte i pleje???hen over ??ret, hvilket er nogenlunde det samme antal som de foreg??ende ??r. Foreningen fyldte 4 ??r den 18. juni og har pt. hjulpet omkring 500 katte videre???ud???i k??rlige hjem?????????plus hjulpet mere end 100 katte til et bedre liv som neutraliseret genuds??tningskat med???en foderv??rt tilknyttet.</p>
                    <p>Vi afholdt et socialt arrangement 23/11 bes??g Skibsklarerg??rden ??? med frokost og pakkeleg. Arrangeret af Susanne. Arrangementet var en stor succes.</p>
                    <p>Kort info om Michelle Garnier 6/9 kl 14. Gratis for medlemmer.</p>
                    <p>Der har kun v??ret afholdt 1???fysisk???bestyrelsesm??de. Herudover er der afholdt et par telefonm??der.</p>
                    <p>Der er brugt 210.257 p?? dyrl??gehj??lp???i 2019. Hertil kommer dyrl??geregninger p?? 104.754 for Vestegnens Kattehj??lp, 10.337 for Hundested Havnekatte og 4611 for Sannes foderplads. Pengene er indsamlet af de forskellige foreninger og har ikke p??virket NSK ??konomi.</p>
                    <p>Vi fik desv??rre ikke 30.000 fra Dyrevelf??rdspuljen til brug i 2020, men kun 7.560,25,- De har ??ndret vilk??rene igen og der kommer ikke til at v??re helt s?? mange penge i puljen fremadrettet.</p>
                </article>
                <article>
                    <p>Vi valgte i efter??ret at melde os ind i DOSO som har givet os adgang til at s??ge diverse legater og fonde. Vi har en ans??gning ude nu og har lige f??et 30.000 til genuds??tninger/foder fra en anden fond.</p>
                    <p>DOSO k??mper fortsat for en kattelov. H??ber at have godt nyt p?? n??ste gf.</p>
                    <p>Vi havde mange katte siddende i ??rets f??rste m??neder som var ordnet og klar til hjem og hvor udgiften l?? i 2019 og indt??gten f??rst i 2020. Regnskabet endte derfor med et lille minus p?? kr. 116,- Vores bankkonto har det godt pt. og vi har f??et nogle store donationer af god kvalitetsmad der g??r at vi er ret godt k??rende pt.</p>
                    <p>Regnskab blev godkendt.</p>
                    <p>Ditte B??gevang Kanstrup blev valgt til at st?? for ekstern revision, da foreningen forventer at f?? mere end 50.000 via indsamlinger fremadrettet.</p>
                    <ol start="4">
                        <li>Fasts??ttelse af kontigent for medlemskab 2021. Kontigent fors??tter u??ndret </li>
                        <li>Valg af formand. Joan Andersen modtager genvalg. Ingen andre kandidater </li>
                        <li>Valg af 4. bestyrelsesmedlem. Margit Rand modtager genvalg. Ingen andre kandidater </li>
                        <li>Behandling af forslag fra bestyrelse og medlemmer. Ingen punkter indkommet </li>
                        <li>Eventuelt. Fri snak om den manglende kattelovgivning og om fonde/legater, som kan s??ges fremadrettet. </li>
                    </ol>
                </article>
            </section>
        </section>
        `;
            document.querySelector('main').innerHTML = text;
        })
        .catch(error => {
            console.log(error); // logs any errors
        })
}

function drawKontakt() {
    let title = "<title>Kontakt - Nordsj??llands Kattehj??lp</title>";
    document.querySelector("head").innerHTML += title;
    let metaText = `<meta name="description" content="Har du lyst til at hj??lpe os med at hj??lpe kattene, s?? send os en mail p?? og fort??l hvad du har lyst og mulighed for at bidrage med.">`
    document.querySelector("head").innerHTML += metaText;
    let text = `
    <h1>Kontakt</h1>
        <section class="kontaktOsGrid white">
            <article>
                <h2>Bestyrelsen i Nordsj??llands Kattehj??lp</h2>
                <p><span class="boldText">Formand</span> Joan Andersen - <a class="mail" href="mailto:joan@kattehjaelp.dk">joan@kattehjaelp.dk</a></p>
                <p><span class="boldText">N??stformand</span> Annette Nielsen - <a class="mail" href="mailto:annette@kattehjaelp.dk">annette@kattehjaelp.dk</a></p>
                <p><span class="boldText">Kasserer</span> Kirsten Hammer - <a class="mail" href="mailto:kirsten@kattehjaelp.dk">kirsten@kattehjaelp.dk</a></p>
                <p><span class="boldText">4. bestyrelsesmedlem</span> Margit Rand - <a class="mail" href="mailto:margit@kattehjaelp.dk">margit@kattehjaelp.dk</a></p>
                <p><span class="boldText">5. bestyrelsesmedlem </span>Birgit Bauer - <a class="mail" href="mailto:birgit@kattehjaelp.dk">birgit@kattehjaelp.dk</a></p>
                <p>Udover bestyrelsen har vi en r??kke af frivillige der hj??lper med pleje, k??rsel, donationer og diverse ad hoc opgaver.</p>
                <p>Har du lyst til at hj??lpe os med at hj??lpe kattene, s?? send os en mail p?? <a class="mail" href="mailto:info@kattehjaelp.dk">info@kattehjaelp.dk</a> og fort??l hvad du har lyst og mulighed for at bidrage med.</p>
            </article>
            <form>
                <h3 class="blueText">Kontakt os</h3>
                <input class="test extrawhite" type="text" placeholder="Navn">
                <input class="test extrawhite" type="text" placeholder="E-mail">
                <textarea class="test extrawhite" placeholder="Din besked..." style="height:100px"></textarea>
                <button class="hoverBlue blue" type="button">Send besked</button>
            </form>   
        </section>
        <h2 class="gdprOverskrift greenText">GDPR (Dataforordningen)</h2>
        <section class="kontaktOsGrid">
            <ol>
                <li>
                    <h4>Baggrund</h4>
                    <p>Beskyttelse af dit privatliv er meget vigtigt for os. I denne privatlivspolitik beskriver vi derfor, hvordan Nordsj??llands Kattehj??lp indsamler, benytter og videregiver dine personoplysninger, n??r du benytter vores hjemmeside. Du anerkender og accepterer hermed, at dine personoplysninger vil blive behandlet i overensstemmelse med denne privatlivspolitik.</p>
                </li>
                <li>
                    <h4>Indsamling af personoplysninger</h4>
                    <p>Vi indsamler og behandler visse personoplysninger om dig til de form??l, som fremg??r af afsnit 3 nedenfor. Vi indsamler de personoplysninger, som du giver os, n??r du opretter medlemskab, donerer, adoptere gennem os eller kommunikerer med os p?? anden vis, herunder navn, adresse, telefonnummer og e-mailadresse (samt evt. oplysning om boligforhold ift. adoption).</p>
                </li>
                <li>
                    <h4>Anvendelse af dine personoplysninger</h4>
                    <p>Vi anvender alene dine personoplysninger til f??lgende form??l:
                        for at kunne indg?? og opfylde aftale om medlemskab hos os, herunder automatisk fornyelse af medlemskab, udsendelse af nyhedsbreve, indkaldelse til generalforsamling mv.
                        for at kunne administrere eventuelle donationer til foreningen
                        for at kunne kommunikere med dig, n??r du henvender dig til os,
                        for at overholde vores juridiske forpligtelser og kunne dokumentere, ud??ve eller forsvare vores juridiske rettigheder.</p>
                </li>
                <li>
                    <h4>Overf??rsel af dine personoplysninger til tredjeparter</h4>
                    <p>Vi kan overf??re dine personoplysninger til de kategorier af tredjeparter, som fremg??r nedenfor:
                        Katteregister.dk og Dansk Katteregister.dk samt evt. samarbejdende dyrl??ger efter aftale.
                        Evt. videregivelse af oplysninger til F??devareministeriet ifm genuds??tning via tilkendte puljemidler samt til Civilstyrelsen ifm. donationer (indsamlingsn??vnet).</p>
                </li>
            </ol>
            <ol start="5">
                <li>
                    <h4>Retsgrundlag for behandling af dine oplysninger</h4>
                    <p>Vi vil behandle dine personoplysninger i overensstemmelse med denne privatlivspolitik, fordi det er n??dvendigt for:
                        at kunne indg?? og opfylde aftale om adoption, medlemskab og donation hos os, og at overholde vores juridiske forpligtelser.</p>
                </li>
                <li>
                    <h4>Beskyttelse og opbevaring af dine personoplysninger</h4>
                    <p>Vi tager din sikkerhed alvorligt og vil altid sikre, at de n??dvendige tekniske og organisatoriske sikkerhedsforanstaltninger er implementeret for at beskytte dine personoplysninger mod uautoriseret eller ulovlig behandling samt undergang, tab, ??ndring, misbrug eller offentligg??relse. De personoplysninger, som vi indsamler om dig, vil kun blive opbevaret s?? l??nge det er n??dvendigt for at indg?? og opfylde aftalen med dig.</p>
                </li>
                <li>
                    <h4>Indsigt i og korrektion af dine personoplysninger</h4>
                    <p>Under visse foruds??tninger har du f??lgende rettigheder i henhold til databeskyttelseslovgivningen:
                        retten til at modtage en kopi af de personoplysninger som vi har indsamlet om dig og til at videregive denne kopi til en anden dataansvarlig, retten til at f?? slettet, opdateret eller berigtiget de personoplysninger, som vi har indsamlet om dig,
                        retten til at begr??nse behandlingen af de personoplysninger, som vi har indsamlet om dig, retten til at g??re indsigelse mod behandlingen af de personoplysninger, som vi har indsamlet om dig, retten til at tilbagekalde et eventuelt samtykke, som danner grundlag for behandlingen af dine personoplysninger, og retten til at indgive en klage til Datatilsynet (www.datatilsynet.dk).</p>
                </li>
                <li>
                    <h4>??ndringer til denne privatlivspolitik</h4>
                    <p>Denne privatlivspolitik vil l??bende blive opdateret p?? vores hjemmeside.</p>
                </li>
                <li>
                    <h4>Kontaktoplysninger</h4>
                    <p>Hvis du har sp??rgsm??l eller kommentarer til denne privatlivspolitik, kan du kontakte os p??: info@kattehjaelp.dk</p>
                </li>
            </ol>
        </section>
    `;
    document.querySelector('main').innerHTML = text;
}

function dropdown() {
    document.getElementById("dropdownForeningen").classList.toggle('hide');
}

function dropdownKatiNoed(n) {
    if (n == 1) {
        document.getElementById("katINoed1").classList.toggle('hide');
    } else if (n == 2) {
        document.getElementById("katINoed2").classList.toggle('hide');
    } else if (n == 3) {
        document.getElementById("katINoed3").classList.toggle('hide');
    } else if (n == 4) {
        document.getElementById("katINoed4").classList.toggle('hide');
    } else if (n == 5) {
        document.getElementById("katINoed5").classList.toggle('hide');
    } else if (n == 6) {
        document.getElementById("katINoed6").classList.toggle('hide');
    }
}

window.onscroll = function () { scroll() };

function scroll() {
    let button = document.getElementById("backToTopButton");
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        button.style.display = "block";
    } else {
        button.style.display = "none";
    }
}

function backToTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}