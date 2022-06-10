import moment from "moment";

export const convertUtcDate = (_date) => {
    console.log("ss : ",_date);
    var date = new Date(_date);
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate() ));
}

export const getCurrentYear = () => {
    var date = new Date();
    return date.getFullYear()
}

export const getCurrentYearFirstDate = () => moment().startOf("year").format("YYYY/MM/DD");

export const getCurrentYearLastDate = () =>  moment().endOf("year").format("YYYY/MM/DD");

export const getCurrentWeekFirstDate = () => moment().startOf("week").format("YYYY/MM/DD");

export const getCurrentWeekLastDate = () =>  moment().endOf("week").format("YYYY/MM/DD");


export const getYearFirstDate = (year) => moment(new Date(year,0,1)).startOf("year").format("YYYY/MM/DD");

export const getYearLastDate = (year) => moment(new Date(year,0,1)).endOf("year").format("YYYY/MM/DD");

export const convertUtcDateWithPart = (year, month, day) => new Date(Date.UTC(year, month, day ));
