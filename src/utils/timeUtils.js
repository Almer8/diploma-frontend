export const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('uk-UA'); // "15.04.2025"
};

export const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' });
};
