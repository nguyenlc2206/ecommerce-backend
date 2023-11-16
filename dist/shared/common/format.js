"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDate = void 0;
// function format date
const formatDate = (time) => {
    var a = new Date(time).toString().split(/\s/);
    return (a[2] +
        '/' +
        {
            Jan: '01',
            Feb: '02',
            Mar: '03',
            Apr: '04',
            May: '05',
            Jun: '06',
            Jul: '07',
            Aug: '08',
            Sep: '09',
            Oct: '10',
            Nov: '11',
            Dec: '12'
        }[a[1]] +
        '/' +
        a[3]);
};
exports.formatDate = formatDate;
