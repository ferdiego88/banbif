interface String {
    replaceAll(search: string, replace: string): string;
    left(length: number): string;
    right(length: number): string;
}

String.prototype.replaceAll = function (search: string, replace: string): string {
    let cadena: string = this;
    while (cadena.indexOf(search) > -1) {
        cadena = cadena.replace( search, replace);
    }
    return cadena;
}

String.prototype.left = function (length: number): string {
    return this.substring(0, length);
}

String.prototype.right = function (length: number): string {
    return this.substring(this.length - length, this.length);
}