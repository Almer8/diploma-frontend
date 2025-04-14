const getNextTenDays = () => {
    const days = [];
    const today = new Date();
    for (let i = 0; i < 10; i++) {
        const nextDate = new Date(today);
        nextDate.setDate(today.getDate() + i);
        days.push(nextDate);
    }
    return days;
};

const getWeekDayName = (date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
};

export const generateScheduleForFiveDays = (schedule, template) => {
    const result = [];
    const scheduleMap = new Map(schedule.map(entry => [entry.date, entry]));

    const days = getNextTenDays();
    for (const day of days) {
        const isoDate = day.toISOString().split('T')[0];
        const localizedDate = day.toLocaleDateString('uk-UA', { day: '2-digit', month: '2-digit', year: 'numeric' });
        const weekday = getWeekDayName(day);

        const daySchedule = scheduleMap.get(isoDate);

        if (daySchedule) {
            if (!daySchedule.is_working) {
                result.push({
                    date: localizedDate,
                    day: weekday,
                    slots: null,
                });
            } else {
                result.push({
                    date: localizedDate,
                    day: weekday,
                    slots: daySchedule.slots,
                });
            }
        } else {
            const templateDay = template.find(t => t.day === weekday);
            result.push({
                date: localizedDate,
                day: weekday,
                slots: templateDay ? templateDay.slots : [],
            });
        }
    }

    return result;
};
