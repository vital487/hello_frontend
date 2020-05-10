export function brightnessByColor(color) {
    color = "" + color;
    let isHEX = color.indexOf("#") === 0, isRGB = color.indexOf("rgb") === 0, r, g, b;
    if (isHEX) {
        const hasFullSpec = color.length === 7;
        let m = color.substr(1).match(hasFullSpec ? /(\S{2})/g : /(\S{1})/g);
        if (m) {
            r = parseInt(m[0] + (hasFullSpec ? '' : m[0]), 16);
            g = parseInt(m[1] + (hasFullSpec ? '' : m[1]), 16);
            b = parseInt(m[2] + (hasFullSpec ? '' : m[2]), 16);
        }
    }
    if (isRGB) {
        var m = color.match(/(\d+){3}/g);
        if (m) {
            r = m[0];
            g = m[1];
            b = m[2];
        }
    }
    if (typeof r != "undefined") return ((r * 299) + (g * 587) + (b * 114)) / 1000;
}

/**
 * Torna uma cor mais clara ou mais escura
 * @param {*} hex cor em hexadecimal
 * @param {*} lum valores vão de -1 a 1. -1 é mais escuro e 1 é mais claro
 */
export function modifyColor(hex, lum) {
    // validate hex string
    hex = String(hex).replace(/[^0-9a-f]/gi, '');
    if (hex.length < 6) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    lum = lum || 0;
    // convert to decimal and change luminosity
    var rgb = "#", c, i;
    for (i = 0; i < 3; i++) {
        c = parseInt(String(hex).substr(i * 2, 2), 16);
        c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
        rgb += ("00" + c).substr(c.length);
    }
    return rgb;
}

/**
 * Retorna objeto com day, month e year.
 */
export function unixToDate(unix) {
    let obj = {};
    let date = new Date(unix * 1000);
    obj.day = date.getDate();
    obj.month = date.getMonth() + 1;
    obj.year = date.getFullYear();
    obj.hour = date.getHours();
    obj.minutes = date.getMinutes();
    return obj;
}

/**
 * Retorna numero para uma string com '0' atrás se  o número tiver só um dígito
 */
export function addZero(n) {
    if (n < 10 && n > -1) return `0${n}`;
    else return n;
}

export function getCookie(c_name) {
    return localStorage.getItem(c_name);
}

export function setCookie(c_name, value) {
    return localStorage.setItem(c_name, value);
}

export function eraseCookie(c_name) {
    return localStorage.removeItem(c_name);
}

export function isValidDate(year, month, day) {
    let now = Date.now();
    let date = Date.parse(`${year}-${month}-${day}`);

    if (date > now) {
        return false;
    }

    switch (month) {
        case 1:
        case 3:
        case 5:
        case 7:
        case 8:
        case 10:
        case 12:
            if (day < 1 || day > 31) {
                return false;
            }
            return true;
        case 4:
        case 6:
        case 9:
        case 11:
            if (day < 1 || day > 30) {
                return false;
            }
            return true;
        case 2:
            if (year % 4 === 0) {
                if (day < 1 || day > 29) {
                    return false;
                }
                return true;
            }
            else {
                if (day < 1 || day > 28) {
                    return false;
                }
                return true;
            }
        default:
            return false;
    }
}

/**
 * Get data difference 
 * @param {*} date seconds since 1st January 1970
 */
export function getDataDiff(date) {
    if (date === -62135596800000)
        return "Nunca";

    let diffSecs = Math.floor(Date.now() / 1000) - date;

    if (diffSecs < 0) {
        diffSecs = 0;
    }

    if (diffSecs < 60)
        return diffSecs !== 1 ? diffSecs + " segundos" : diffSecs + " segundo"
    else {
        let diffMins = Math.floor(diffSecs / 60);
        if (diffMins < 60)
            return diffMins !== 1 ? diffMins + " minutos" : diffMins + " minuto";
        else {
            let diffHours = Math.floor(diffMins / 60);
            if (diffHours < 24)
                return diffHours !== 1 ? diffHours + " horas" : diffHours + " hora";
            else {
                let diffDays = Math.floor(diffHours / 24);
                if (diffDays < 24)
                    return diffDays !== 1 ? diffDays + " dias" : diffDays + " dia";
                else {
                    let diffWeeks = Math.floor(diffDays / 7);
                    if (diffWeeks < 24)
                        return diffWeeks !== 1 ? diffWeeks + " semanas" : diffWeeks + " semana";
                    else {
                        let diffYears = Math.floor(diffWeeks / 365);
                        return diffYears !== 1 ? diffYears + " anos" : diffYears + " ano";
                    }
                }
            }
        }
    }
}