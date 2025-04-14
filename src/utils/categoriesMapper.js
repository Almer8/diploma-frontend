export const roleMap = {
    VETERAN: "Ветеран",
    PERSON_WITH_DISABILITY: "Особа з інвалідністю"
};

export const mapCategory = (role) => roleMap[role] || role;
