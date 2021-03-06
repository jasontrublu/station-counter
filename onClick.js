var dotImg = document.querySelector("#dot");
var container = document.querySelector("#map");
var mapImg = document.querySelector("#mapImg");
var counterField = document.querySelector("#counterField");
var btn1 = document.querySelector("#btn-challenge-1");
var btn2 = document.querySelector("#btn-challenge-2");
var btn3 = document.querySelector("#btn-challenge-3");
var details = {dots: [], count: 0};
var globStoreName = "";

function init(storeName) {
    clearDots();
    globStoreName = storeName;
    var storedDetails = JSON.parse(localStorage.getItem(storeName));
    if (storedDetails !== null
        && storedDetails.dots !== null
        && storedDetails.dots.length > 0) {
        details = storedDetails;
        for (var i = details.dots.length - 1; i >= 0; i--) {
            printDot(details.dots[i]);
        }
        counterField.innerHTML = details.dots.length;
    }

    container.addEventListener("click", getClickPosition, false);
}

function onClickChallenge1() {
    btn1.disabled = true;
    btn2.disabled = false;
    btn3.disabled = false;
    init("dots_challenge1");
}

function onClickChallenge2() {
    btn1.disabled = false;
    btn2.disabled = true;
    btn3.disabled = false;
    init("dots_challenge2")
}

function onClickChallenge3() {
    btn1.disabled = false;
    btn2.disabled = false;
    btn3.disabled = true;
    init("dots_challenge3")
}

function getClickPosition(e) {
    if (e.target.id.includes("dot")) {
        removeDot(e);
    } else {
        addDot(e);
    }

    store(globStoreName, details);
    counterField.innerHTML = details.dots.length;
}

function dragPosition(e) {
    e.target.id;
    var parentPosition = getPosition(e.currentTarget.parentNode);
    e.srcElement.style.left = e.clientX - parentPosition.x - (dotImg.clientWidth / 2) + "px";
    e.srcElement.style.top = e.clientY - parentPosition.y - (dotImg.clientHeight / 2) + "px";
}

function addDot(e) {
    details.count++;
    var parentPosition = getPosition(e.currentTarget);
    var dot = {
        name: "dot" + details.count,
        position: {
            x: e.clientX - parentPosition.x - (dotImg.clientWidth / 2),
            y: e.clientY - parentPosition.y - (dotImg.clientHeight / 2)
        }
    };
    printDot(dot);
    details.dots.push(dot);
}

function removeDot(e) {
    container.removeChild(e.target);
    for (var i = details.dots.length - 1; i >= 0; i--) {
        if (details.dots[i].name === e.target.id) {
            details.dots.splice(i, 1);
        }
    }
    if (details.dots.length < 1) {
        details.count = 0;
    }
}

function printDot(dot) {
    var newDot = dotImg.cloneNode(true);
    newDot.style.visibility = "visible";
    newDot.id = dot.name;
    container.insertBefore(newDot, mapImg);
    newDot.style.left = dot.position.x + "px";
    newDot.style.top = dot.position.y + "px";
    newDot.addEventListener("dragend", dragPosition, false);
}

function store(storeName, o) {
    localStorage.setItem(storeName, JSON.stringify(o));
}

// Helper function to get an element's exact position
function getPosition(el) {
    var xPos = 0;
    var yPos = 0;

    while (el) {
        if (el.tagName == "BODY") {
            // deal with browser quirks with body/window/document and page scroll
            var xScroll = el.scrollLeft || document.documentElement.scrollLeft;
            var yScroll = el.scrollTop || document.documentElement.scrollTop;

            xPos += (el.offsetLeft - xScroll + el.clientLeft);
            yPos += (el.offsetTop - yScroll + el.clientTop);
        } else {
            // for all other non-BODY elements
            xPos += (el.offsetLeft - el.scrollLeft + el.clientLeft);
            yPos += (el.offsetTop - el.scrollTop + el.clientTop);
        }

        el = el.offsetParent;
    }
    return {
        x: xPos,
        y: yPos
    };
}

function clearDots() {
    for (var j = details.dots.length - 1; j >= 0; j--) {
        var dot = document.querySelector("#" + details.dots[j].name);
        container.removeChild(dot);
    }
    counterField.innerHTML = 0;
    details = {dots: [], count: 0};
}