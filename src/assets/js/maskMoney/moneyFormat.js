// formatea un numero según una mascara dada ej: "-$###,###,##0.00"
//
// elm   = elemento html <input> donde colocar el resultado
// n     = numero a formatear
// mask  = mascara ej: "-$###,###,##0.00"
// force = formatea el numero aun si n es igual a 0
//
// La función devuelve el numero formateado
var myExtObject = (function() {
    return {
        MASKMONEY: function(n, mask, format) {
            if (format == "undefined") format = false;
            if (format || NUM(n)) {
                dec = 0, point = 0;
                x = mask.indexOf(".") + 1;
                if (x) { dec = mask.length - x; }
                if (dec) {
                    n = NUM(n, dec) + "";
                    x = n.indexOf(".") + 1;
                    if (x) { point = n.length - x; } else { n += "."; }
                } else {
                    n = NUM(n, 0) + "";
                }
                for (var x = point; x < dec; x++) {
                    n += "0";
                }
                x = n.length, y = mask.length, XMASK = "";
                while (x || y) {
                    if (x) {
                        while (y && "#0.".indexOf(mask.charAt(y - 1)) == -1) {
                            if (n.charAt(x - 1) != "-")
                                XMASK = mask.charAt(y - 1) + XMASK;
                            y--;
                        }
                        XMASK = n.charAt(x - 1) + XMASK, x--;
                    } else if (y && "$0".indexOf(mask.charAt(y - 1)) + 1) {
                        XMASK = mask.charAt(y - 1) + XMASK;
                    }
                    if (y) { y-- }
                }
            } else {
                XMASK = "";
            }
            return XMASK;
        }
    }
})(myExtObject || {})

function MASK(form, n, mask, format) {
    if (format == "undefined") format = false;
    if (format || NUM(n)) {
        dec = 0, point = 0;
        x = mask.indexOf(".") + 1;
        if (x) { dec = mask.length - x; }

        if (dec) {
            n = NUM(n, dec) + "";
            x = n.indexOf(".") + 1;
            if (x) { point = n.length - x; } else { n += "."; }
        } else {
            n = NUM(n, 0) + "";
        }
        for (var x = point; x < dec; x++) {
            n += "0";
        }
        x = n.length, y = mask.length, XMASK = "";
        while (x || y) {
            if (x) {
                while (y && "#0.".indexOf(mask.charAt(y - 1)) == -1) {
                    if (n.charAt(x - 1) != "-")
                        XMASK = mask.charAt(y - 1) + XMASK;
                    y--;
                }
                XMASK = n.charAt(x - 1) + XMASK, x--;
            } else if (y && "$0".indexOf(mask.charAt(y - 1)) + 1) {
                XMASK = mask.charAt(y - 1) + XMASK;
            }
            if (y) { y-- }
        }
    } else {
        XMASK = "";
    }
    if (form) {
        form.value = XMASK;
        if (NUM(n) < 0) {
            form.style.color = "#FF0000";
        } else {
            form.style.color = "#000000";
        }
    }
    return XMASK;
}

// Convierte una cadena alfanumérica a numérica (incluyendo formulas aritméticas)
//
// s   = cadena a ser convertida a numérica
// dec = numero de decimales a redondear
//
// La función devuelve el numero redondeado

function NUM(s, dec) {
    for (var s = s + "", num = "", x = 0; x < s.length; x++) {
        c = s.charAt(x);
        if (".-+/*".indexOf(c) + 1 || c != " " && !isNaN(c)) { num += c; }
    }
    if (isNaN(num)) { num = eval(num); }
    if (num == "") { num = 0; } else { num = parseFloat(num); }
    if (dec != undefined) {
        r = .5;
        if (num < 0) r = -r;
        e = Math.pow(10, (dec > 0) ? dec : 0);
        return parseInt(num * e + r) / e;
    } else {
        return num;
    }
}