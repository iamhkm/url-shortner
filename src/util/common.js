export function successResponse (body){
    return {
        statusCode: 200,
        body: (typeof body === "string") ? body : JSON.stringify(body)
    }
}

export function badResponse (body){
    return {
        statusCode: 400,
        body: (typeof body === "string") ? body : JSON.stringify(body)
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