export const roleMap = {
    PSYCHOTHERAPIST: "Психотерапевт",
    PSYCHIATRIST: "Психіатр"
};

export const mapRole = (role) => roleMap[role] || role;
