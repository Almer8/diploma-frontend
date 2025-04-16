export const statusMap = {
    PLANNED: "Заплановано",
    PAYED: "Сплачено",
    COMPLETED: "Завершено",
    CANCELED: "Відмінено"
};

export const mapStatus = (status) => statusMap[status] || status;
