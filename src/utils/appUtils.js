export function getOrderDate() {
    let currentBillDate = new Date();
    let currentBillDay = currentBillDate.getDate();
    let currentBillMonth = currentBillDate.getMonth() + 1;
    let currentBillYear = currentBillDate.getFullYear();

    return `${currentBillDay}/${currentBillMonth}/${currentBillYear}`;
};

export function getCurrentItemTime() {
    let currentItemDate = new Date();
    let currentItemHour = currentItemDate.getHours();
    let currentItemMinute = currentItemDate.getMinutes();
    let currentItemSeconds = currentItemDate.getSeconds();

    return `${currentItemHour}:${currentItemMinute}:${currentItemSeconds}`;
};
