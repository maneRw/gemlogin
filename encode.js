module.exports.encodeString = (stringEncode, keys) => {
    let keysGer = getLowercaseLetters(keys);
    let numberCharacter = NumberCharacter(keys);
    let input = stringEncode.split('\n');
    let output = [];
    input.forEach(line => {
        if (line !== "") {
            const endcode_1 = encodeBinToHex(line.trim());
            // Insert key at the 6th position from the right and at the beginning and end
            const str_1 = endcode_1.substring(0, endcode_1.length - 6);
            const str_2 = endcode_1.substring(endcode_1.length - 6);
            const chenkey1 = numberCharacter.LowerCase + str_1 + numberCharacter.UpperCase + str_2 + numberCharacter.NumberCase;
            const endcode_3 = Base64Encode(chenkey1);
            // Insert key at the 8th position from the right and at the beginning and end
            const str_3 = endcode_3.substring(0, endcode_3.length - 8);
            const str_4 = endcode_3.substring(endcode_3.length - 8);
            const chenkey2 = numberCharacter.LowerCase + str_3 + numberCharacter.UpperCase + str_4 + numberCharacter.NumberCase;
            const enCode4 = xorEncryptDecrypt(chenkey2, keys);
            const enCode5 = encodeBinToHex(enCode4);
            const enCode6 = VigenereEncrypt(enCode5, keysGer);
            const enCode7 = VigenereEncrypt(enCode6, keysGer);
            output.push(enCode7);
        }
    });
    let enCode8 = encodeBinToHex(output.join("\n"));
    let enCode9 = VigenereEncrypt(enCode8, keysGer);
    let enCode10 = VigenereEncrypt(enCode9, keysGer);
    let enCode11 = VigenereEncrypt(enCode10, "coremins");
    return enCode11;
}
module.exports.decodeString = (input, keys) => {
    let keysGer = getLowercaseLetters(keys);
    let numberCharacter = NumberCharacter(keys);


    let deCode11 = vigenereDecrypt(input, "coremins");
    let deCode10 = vigenereDecrypt(deCode11, keysGer);
    let deCode9 = vigenereDecrypt(deCode10, keysGer);
    let deCode8 = decodeBinToHex(deCode9);

    let inputs = deCode8.split('\n');
    let output = [];
    for (let line of inputs) {
        if (line !== "") {
            let deCode1 = vigenereDecrypt(line.trim(), keysGer);
            let deCode2 = vigenereDecrypt(deCode1, keysGer);

            let deCode3 = decodeBinToHex(deCode2);

            let deCode4 = xorEncryptDecrypt(deCode3, keys);

            // remove key them vao dau v, cuoi va vi tri thu 8
            let removedFirstAndLast = deCode4.substring(1, deCode4.length - 1);
            let str_1 = removedFirstAndLast.substring(0, removedFirstAndLast.length - 9);
            let str_2 = removedFirstAndLast.substring(removedFirstAndLast.length - 8);

            let giaiKey1 = str_1 + str_2;

            let deCode5 = base64Decode(giaiKey1);

            // let deCode6 = BinarySerializer.DeserializeFromString(deCode5);

            // remove key them vao dau v, cuoi va vi tri thu 8
            let removedFirstAndLast2 = deCode5.substring(1, deCode5.length - 1);
            let str_3 = removedFirstAndLast2.substring(0, removedFirstAndLast2.length - 7);
            let str_4 = removedFirstAndLast2.substring(removedFirstAndLast2.length - 6);

            let giaiKey2 = str_3 + str_4;

            let ouDecode = decodeBinToHex(giaiKey2);
            output.push(ouDecode);
        }
    }

    return output.join("\n");
}


function isLetter(str) {
    return str.length === 1 && str.match(/[a-zA-Z]/i)
}
function isUpperCase(character) {
    if (character === character.toUpperCase()) {
        return true
    }
    if (character === character.toLowerCase()) {
        return false
    }
}

VigenereEncrypt = (message, key) => {
    let result = ''

    for (let i = 0, j = 0; i < message.length; i++) {
        const c = message.charAt(i)
        if (isLetter(c)) {
            if (isUpperCase(c)) {
                result += String.fromCharCode((c.charCodeAt(0) + key.toUpperCase().charCodeAt(j) - 2 * 65) % 26 + 65) // A: 65
            } else {
                result += String.fromCharCode((c.charCodeAt(0) + key.toLowerCase().charCodeAt(j) - 2 * 97) % 26 + 97) // a: 97
            }
        } else {
            result += c
        }
        j = ++j % key.length
    }
    return result
}


function encodeBinToHex(input) {
    const bytes = new TextEncoder().encode(input);
    let hexString = "";
    for (let ii = 0; ii < bytes.length; ii++) {
        hexString += bytes[ii].toString(16).padStart(2, '0');
    }
    return hexString;
}
function Base64Encode(plainText) {
    const plainTextBytes = new TextEncoder().encode(plainText);
    return btoa(String.fromCharCode(...plainTextBytes));
}

function getLowercaseLetters(input) {
    let result = '';

    for (let c of input) {
        if (c === c.toLowerCase() && c !== c.toUpperCase()) {
            result += c;
        }
    }

    return result;
}
function xorEncryptDecrypt(data, key) {
    let output = new Array(data.length);

    for (let i = 0; i < data.length; ++i) {
        output[i] = String.fromCharCode(data.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }

    return output.join('');
}
function NumberCharacter(chuoi) {
    let demChuHoa = 0;
    let demChuThuong = 0;
    let demChuSo = 0;

    for (let kyTu of chuoi) {
        if (kyTu >= 'A' && kyTu <= 'Z') {
            demChuHoa++;
        } else if (kyTu >= 'a' && kyTu <= 'z') {
            demChuThuong++;
        } else if (kyTu >= '0' && kyTu <= '9') {
            demChuSo++;
        }
    }

    return { LowerCase: demChuThuong, UpperCase: demChuHoa, NumberCase: demChuSo };
}

function decodeBinToHex(input) {
    input = input.replace(/-/g, ""); // Remove "-" from the input hex string
    const bytes = new Uint8Array(input.length / 2);
    for (let ii = 0; ii < input.length; ii += 2) {
        bytes[ii / 2] = parseInt(input.substring(ii, ii + 2), 16);
    }
    const result = new TextDecoder("ascii").decode(bytes); // Convert byte array to string
    return result;
}
function vigenereDecrypt(text, key) {
    let result = "";
    const keyLength = key.length;
    const textLength = text.length;

    for (let i = 0; i < textLength; ++i) {
        let c = text[i];

        if (/[a-zA-Z]/.test(c)) {
            const offset = c === c.toUpperCase() ? 'A'.charCodeAt(0) : 'a'.charCodeAt(0);
            const k = key.toUpperCase().charCodeAt(i % keyLength) - 'A'.charCodeAt(0);
            c = String.fromCharCode(((c.charCodeAt(0) - offset - k + 26) % 26) + offset);
        }
        result += c;
    }

    return result;
}
function getLowercaseLetters(input) {
    let result = '';

    for (let c of input) {
        if (c === c.toLowerCase() && c !== c.toUpperCase()) {
            result += c;
        }
    }

    return result;
}
function base64Decode(base64EncodedData) {
    const base64EncodedBytes = Uint8Array.from(atob(base64EncodedData), c => c.charCodeAt(0));
    return new TextDecoder('utf-8').decode(base64EncodedBytes);
}




