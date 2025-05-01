import 'survey-core/survey-core.css';
import { BorderlessLight } from "survey-core/themes";
import { Survey } from 'survey-react-ui';
import { Model } from 'survey-core';
import * as SurveyCore from 'survey-core';
import { useState } from 'react';
import { settings } from "survey-core";
import { microphone } from 'surveyjs-widgets/';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import axios from "../utils/axiosInstance";
import { emotionAdvice } from "../utils/testResults";
import { surveyJson } from "../utils/surveyJson";
import styles from "../styles/EmotionSurvey.module.css";

microphone(SurveyCore);

settings.liveUpdate = false;
settings.clearInvisibleValues = "onHidden";
settings.animateNavigationButtons = false;

const ffmpeg = new FFmpeg();

const convertToWav = async (webmBase64) => {
    if (!ffmpeg.loaded) await ffmpeg.load();

    const base64Data = webmBase64.split(',')[1];
    const binaryString = atob(base64Data);
    const binary = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        binary[i] = binaryString.charCodeAt(i);
    }
    await ffmpeg.writeFile('input.webm', binary);

    await ffmpeg.exec(['-i', 'input.webm', '-ar', '16000', '-ac', '1', 'output.wav']);
    const data = await ffmpeg.readFile('output.wav');
    return new Blob([data.buffer], { type: 'audio/wav' });
};

const getTopEmotions = (emotions) => {
    console.log("emotions", emotions)
    const sorted = Object.entries(emotions).sort((a, b) => b[1] - a[1]);
    const topEmotions = [sorted[0]];
    if (sorted[0][1] - sorted[1][1] < 0.1) topEmotions.push(sorted[1]);
    return topEmotions;
};

export default function EmotionSurvey() {
    const [audioProcessed, setAudioProcessed] = useState(false);
    const [audioResults, setAudioResults] = useState(null);
    const [fullAudio, setFullAudio] = useState()
    const [showSurvey, setShowSurvey] = useState(false);
    const [finalResults, setFinalResults] = useState(null);

    const survey = new Model(surveyJson);
    survey.applyTheme(BorderlessLight);

    const handleAudioComplete = async (audioBase64) => {
        const audioBlob = await convertToWav(audioBase64);

        const formData = new FormData();
        formData.append('audio', audioBlob, 'audio.wav');

        axios.post('/survey/audio', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        }).then(res => {
            setFullAudio(res.data);
            setAudioResults(getTopEmotions(res.data));
            setAudioProcessed(true);
        });
    };

    survey.onComplete.add(async (sender) => {
        const surveyData = sender.data;

        const combinedData = {
            audio_ang: fullAudio.ang,
            audio_fru: fullAudio.fru,
            audio_hap: fullAudio.hap,
            audio_exc: fullAudio.exc,
            audio_neu: fullAudio.neu,
            audio_sad: fullAudio.sad,
            ...surveyData
        };

        axios.post('/survey', combinedData).then(res => {
            setFinalResults(getTopEmotions(res.data));
        });
    });

    const renderEmotionCards = (results) => (
        <div className={styles.results}>
            <div className={styles.recommendations}>
                <div className={styles.card}>
                    <div>{emotionAdvice[results[0][0]].description}</div>
                    <div><strong>Порада:</strong> {emotionAdvice[results[0][0]].advice}</div>
                    <div><strong>Рекомендація:</strong> {emotionAdvice[results[0][0]].recommendation}</div>
                </div>
                {results.length > 1 && (
                    <div className={styles.secondary}>
                        <div className={styles.additional}>Окрім того, зверніть увагу:</div>
                        <div className={styles.card}>
                            <div>{emotionAdvice[results[1][0]].description}</div>
                            <div><strong>Порада:</strong> {emotionAdvice[results[1][0]].advice}</div>
                            <div><strong>Рекомендація:</strong> {emotionAdvice[results[1][0]].recommendation}</div>
                        </div>
                    </div>

                )}
            </div>
            <div className={styles.warning}>Увага! Усі надані вище результати є
                лише рекомендацією та в жодному разі НЕ МОЖУТЬ замінити консультацію
                у акредитованого спеціаліста!
            </div>
        </div>
    );

    return (
        <div>
            {!audioProcessed ? (
                <Survey model={new Model({
                    elements: [{
                        type: "microphone",
                        name: "audio",
                        title: "Будь ласка, запишіть коротке аудіоповідомлення про свій емоційний стан:"
                    }]
                })} onComplete={(sender) => handleAudioComplete(sender.data.audio)} />
            ) : !showSurvey && !finalResults ? (
                <>
                    {renderEmotionCards(audioResults)}
                    <button className={styles.additionalSurveyBtn} onClick={() => setShowSurvey(true)}>
                        Хочете додатково пройти тестування?
                    </button>
                </>
            ) : showSurvey && !finalResults ? (
                <Survey model={survey} />
            ) : finalResults && (
                renderEmotionCards(finalResults)
            )}
        </div>
    );
}
