import React, {useEffect, useState} from 'react';
import styles from '../styles/AnonStoriesView.module.css'
import axios from "../utils/axiosInstance";
import Modal from "./Modal";
import AnonStoryCreate from "./modals/AnonStoryCreate";
import UserSubmitStoryReport from "./modals/UserSubmitStoryReport";
const AnonStoriesView = () => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    // eslint-disable-next-line no-self-compare
    const [component, setComponent] = useState(null);
    const [stories, setStories] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [query, setQuery] = useState("");


    useEffect(() => {
        axios.get(`/story?q=${query}&page=${page}&size=2&sortDirection=ASC`)
            .then(res => {
                setStories(res.data.content);
                setTotalPages(res.data.page.totalPages);
            })
            .catch(err => console.error(err))
    }, [page, query]);


    const handleClose = () => {
        setIsModalOpen(false);
    };
    const handleSubmit = (anonStory) => {
        const newTags = anonStory.tags.filter(tag => tag.__isNew__).map(tag => tag.label);
        if (newTags.length > 0) {
            axios.post("/story/tags", { tags: newTags }).then((res) => {
                const resIds = res.data._embedded.tags.map(tag => tag.id);
                const updatedTags = anonStory.tags
                    .filter(tag => !tag.__isNew__)
                    .map(tag => tag.value)
                    .concat(resIds);
                console.log("resIds", resIds)
                console.log("updatedTags", updatedTags)

                const updatedAnonStory = { ...anonStory, tags: updatedTags };
                axios.post("/story", updatedAnonStory).then((res) => {
                    console.log(res);
                });
            });
        } else {
            const updatedAnonStory = { ...anonStory, tags: anonStory.tags.map(tag => tag.value) };
            axios.post("/story", updatedAnonStory).then((res) => {
                console.log(res);
            });
        }
        setIsModalOpen(false);
    }

    const handleReport = (data) => {
        axios.post("/story/report", data).then((res) => {
            console.log(res);
        })
        setIsModalOpen(false);
    }

    const openCreateStoryModal = () => {
        setComponent(<AnonStoryCreate callback={handleSubmit}/>)
        setIsModalOpen(true);
    }

    const openReportModal = (id) => {
        setComponent(<UserSubmitStoryReport callback={handleReport} storyId={id}/>)
        setIsModalOpen(true);
    }

    return (
        <div className={styles.content}>
            {isModalOpen? <Modal component={component} onClose={handleClose} />
            : null}
            <div className={styles.left}>
                <input className={styles.input} onChange={(e) => setQuery(e.target.value)} placeholder={"Пошук за тегами"}>

                </input>

                <div className={styles.searchcontainer}>
                    <div className={styles.doctorcontainer}>
                        {stories? stories.map((story) => (
                            <div key={story.id} className={styles.story}>
                                <div className={styles.up}>
                                    <div className={styles.textfield}>{story.displayed_name}</div>
                                    <div className={`${styles.textfield} ${styles.scrollabledown}`}>{story.tags.map(tag => tag.name).join(", ")}</div>
                                    <button className={`${styles.textfield} ${styles.button} ${styles.report}`}
                                            onClick={()=> openReportModal(story.id)}>Поскаржитись</button>
                                </div>
                                <div className={styles.down}>
                                    <div className={`${styles.richtext} ${styles.scrollabledown}`}>{story.content}</div>
                                </div>
                            </div>
                            ))
                            : null}
                    </div>
                    <div className={styles.paginationbuttons}>
                        <button className={styles.button}
                                onClick={() => setPage(prev => prev -1)}
                                disabled={page === 0}>{"<-"}</button>
                        <button className={styles.button}
                                onClick={() => setPage(prev => prev + 1)}
                                disabled={page === totalPages-1}>{"->"}</button>
                    </div>
                </div>

            </div>

            <div className={styles.right}>
                <div className={styles.button} onClick={() => openCreateStoryModal()}>Додати історію</div>
            </div>

        </div>
    );
};

export default AnonStoriesView;
