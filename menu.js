const fs = require("fs");
let readFilePromise = (fileName) => {
    return new Promise((resolve, reject) => {
        fs.readFile(fileName, "utf8", (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        })
    })
}
const valueArray = [];
let menuSplit = (file) => {
    let lines = file.split("\r\n");

    for (var line = 0; line < lines.length; line++) {
        var split = lines[line].split(",");
        valueArray.push(split);
    }
    return valueArray;
}

let objectMenu = (array) => {
    const menuItem = [];
    const menuObject = {};
    const menuArray = [];
    for (items of array) {
        menuItem.push(items);
        const menuTime = items[0];
        const menuFood = items[1];
        const foodQuantity = items[2];
        const foodPrice = items[3];
        menuObject[menuTime] = [foodPrice, foodQuantity, menuFood];
        menuArray.push({ [menuTime]: `${foodPrice} ${menuFood}, ${foodQuantity}` });
    }
    // console.log(menuArray)
    return menuArray;
}

let addDuplicateKey = (objectArray) => {
    let keyObject = {}
    for (let obj of objectArray) {
        const menu = Object.keys(obj);
        const food = Object.values(obj);
        if (menu in keyObject) {
            keyObject[menu].push(`${food}`);
        } else {
            keyObject[menu] = [`${food}`];
        }
    }
    return keyObject
}

let displayMenu = (menu) => {
    var menuList = []
    for (let item in menu) {
        const itemTitle = `* ` + `${item.charAt(0).toUpperCase()}` + `${item.slice(1)}` + ` Items *`

        menuList.push(`${itemTitle}` + `\n` + `${menu[item].join('\r\n')}` + `\n`)
    }
    return (menuList.join("\n"))
}

readFilePromise("menu.csv")
    .then((res) => menuSplit(res))
    .then((array) => objectMenu(array))
    .then((objectArray) => addDuplicateKey(objectArray))
    .then((menuFood) => fs.writeFile("menu.txt", displayMenu(menuFood), function (err) {
        if (err) {
            return console.log(err);
        }
        console.log("File saved");
    }))
    .catch(err => console.log(err))