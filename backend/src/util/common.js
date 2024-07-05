export function successResponse (body){
    return {
        statusCode: 200,
        body: (typeof body === "string") ? body : JSON.stringify(body),
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Cache-Control": "no-cache",
        },
    }
}

export function badResponse (body){
    return {
        statusCode: 400,
        body: (typeof body === "string") ? body : JSON.stringify(body),
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Cache-Control": "no-cache",
        },
    }
}

// Function to generate a random string of specified length
export function generateRandomString () {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

export function createStats (record, key){
    const dateToday = new Date();
        const year = dateToday.getFullYear().toString();
        const month = (dateToday.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-indexed, so add 1
        const date = dateToday.getDate().toString().padStart(2, '0');
        if (!record[key]) {
            record[key] = {
                [year]: {
                    [month] : {
                        [date]: 0,
                        total: 0
                    },
                    total: 0,
                },
                total: 0
            }
        }
        else if (!record[key][year]) {
            record[key][year] = {
                [month] : {
                    [date]: 0,
                    total: 0
                },
                total: 0,
            }
        }
        else if (!record[key][year][month]) {
            record[key][year][month] = {
                [date]: 0,
                total: 0
            }
        }
        else if (!record[key][year][month][date]) {
            record[key][year][month][date] = 0
        }
        record[key][year][month][date]+=1;
        record[key][year][month]["total"]+=1;
        record[key][year]["total"]+=1;
        record[key].total+=1;
}

export function generateCognitoPassword({
    length = 12,
    includeUppercase = true,
    includeLowercase = true,
    includeNumbers = true,
    includeSpecialChars = true
} = {}) {
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const numberChars = '0123456789';
    const specialChars = '!@#$%^&*()_+[]{}|;:,.<>?';

    let allChars = '';
    if (includeUppercase) allChars += uppercaseChars;
    if (includeLowercase) allChars += lowercaseChars;
    if (includeNumbers) allChars += numberChars;
    if (includeSpecialChars) allChars += specialChars;

    if (allChars.length === 0) {
        throw new Error('No character sets selected for password generation.');
    }

    // Ensure the password includes at least one character from each selected set
    let password = '';
    if (includeUppercase) password += uppercaseChars[Math.floor(Math.random() * uppercaseChars.length)];
    if (includeLowercase) password += lowercaseChars[Math.floor(Math.random() * lowercaseChars.length)];
    if (includeNumbers) password += numberChars[Math.floor(Math.random() * numberChars.length)];
    if (includeSpecialChars) password += specialChars[Math.floor(Math.random() * specialChars.length)];

    // Fill the remaining length of the password
    for (let i = password.length; i < length; i++) {
        password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    // Shuffle the password to ensure randomness
    password = password.split('').sort(() => 0.5 - Math.random()).join('');

    return password;
}