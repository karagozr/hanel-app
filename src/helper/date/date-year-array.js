const today = new Date();
export const currYear = today.getFullYear();
const minCurrYear = 2020;

export const years = (minYear, maxYear) =>{
    var arr = [];
    for (let index = 0; index <= maxYear-minYear; index++) {
        arr.push(minYear+index)
    }
    return arr;
} 

export const yearsStartMinYear = (minYear) =>{
    return years(minYear,currYear);
} 

export const yearsEndMaxYear = (maxYear) =>{
    return years(minCurrYear,currYear)
}

export const getToday = () =>{
    return new Date(currYear,today.getMonth(), today.getDay())
}