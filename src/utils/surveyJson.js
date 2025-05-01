const questionChoices = [
    "Ніколи",
    "Рідко",
    "Іноді",
    "Часто",
    "Дуже часто",
]
export const surveyJson = {
    title: "Тест емоційного стану",
    showProgressBar: "top",
    showQuestionNumbers: "on",
    pages: [
        {
            elements: [
                {
                    type: "radiogroup",
                    name: "ang_1",
                    title: "Ви часто дратуєтесь, якщо хтось заважає вашим планам?",
                    isRequired: true,
                    choices: questionChoices
                }
            ]
        },
        {
            elements: [
                {
                    type: "radiogroup",
                    name: "ang_2",
                    title: "Вас легко вивести з себе у пробці чи черзі?",
                    isRequired: true,
                    choices: questionChoices
                }
            ]
        },
        {
            elements: [
                {
                    type: "radiogroup",
                    name: "fru_1",
                    title: "Коли щось йде за планом, вам важко зберігати спокій?",
                    isRequired: true,
                    choices: questionChoices
                }
            ]
        },
        {
            elements: [
                {
                    type: "radiogroup",
                    name: "fru_2",
                    title: "Чи буває, що ви відчуваєте внутрішнє роздратування через дрібниці?",
                    isRequired: true,
                    choices: questionChoices
                }
            ]
        },
        {
            elements: [
                {
                    type: "radiogroup",
                    name: "hap_1",
                    title: "Ви часто радієте дрібницям, як теплій погоді чи смачній їжі?",
                    isRequired: true,
                    choices: questionChoices
                }
            ]
        },
        {
            elements: [
                {
                    type: "radiogroup",
                    name: "hap_2",
                    title: "Чи легко ви переймаєте гарний настрій від інших людей?",
                    isRequired: true,
                    choices: questionChoices
                }
            ]
        },
        {
            elements: [
                {
                    type: "radiogroup",
                    name: "exc_1",
                    title: "Вас легко надихнути новою ідеєю чи проектом?",
                    isRequired: true,
                    choices: questionChoices
                }
            ]
        },
        {
            elements: [
                {
                    type: "radiogroup",
                    name: "exc_2",
                    title: "Чи часто ви відчуваєте передчуття перед цікавими подіями?",
                    isRequired: true,
                    choices: questionChoices
                }
            ]
        },
        {
            elements: [
                {
                    type: "radiogroup",
                    name: "neu_1",
                    title: "У більшості ситуацій ви почуваєтеся спокійно та врівноважено?",
                    isRequired: true,
                    choices: questionChoices
                }
            ]
        },
        {
            elements: [
                {
                    type: "radiogroup",
                    name: "neu_2",
                    title: "Ваш настрій рідко змінюється раптово протягом дня?",
                    isRequired: true,
                    choices: questionChoices
                }
            ]
        },
        {
            elements: [
                {
                    type: "radiogroup",
                    name: "sad_1",
                    title: "Чи буває, що без причини вам стає сумно?",
                    isRequired: true,
                    choices: questionChoices
                }
            ]
        },
        {
            elements: [
                {
                    type: "radiogroup",
                    name: "sad_2",
                    title: "Ви часто згадуєте неприємні моменти і переживаєте їх заново?",
                    isRequired: true,
                    choices: questionChoices
                }
            ]
        }
    ]
};
