import {formatDate} from "./Date";

export const fetchData = async (url) => {
    let res = await fetch(url.href);
    if(res.status !== 200) {
        throw new Error('Failed to fetch data: ' + res.statusText);
    }
    return await res.json();
};

export const groupByDate = (list) => {
    let allDates = getDatesFromList(list);

    let groupedList = {};
    allDates.forEach(date => {
        groupedList[date] = list.filter(el => el.dt_txt.includes(date));
    });

    return groupedList;
};

const getDatesFromList = (list) => {
    let dates = [];
    list.forEach(el => {
        let date = el.dt_txt.split(' ')[0];
        if(!dates.includes(date) && formatDate(new Date(date)) !== formatDate(new Date())) {
            dates.push(date);
        }
    });

    return dates;
};