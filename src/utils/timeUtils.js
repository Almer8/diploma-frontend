export const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('uk-UA');
};

export const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' });
};

export const formatVisitTime = (startTime, endTime) => {
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);

    const pad = (num) => String(num).padStart(2, '0');

    const date = `${pad(startDate.getDate())}.${pad(startDate.getMonth() + 1)}.${startDate.getFullYear()}`;
    const start = `${pad(startDate.getHours())}:${pad(startDate.getMinutes())}`;
    const end = `${pad(endDate.getHours())}:${pad(endDate.getMinutes())}`;

    return `${date} ${start}-${end}`;
};
