'use client';
import styles from "./Predict.module.css"
import Link from "next/link";
import { useState, useEffect } from 'react';
import ReactPlayer from 'react-player'

function Predict() {
    const [mediaSource, setMediaSource] = useState('Live');
    const [loading, setLoading] = useState(false);
    const [video, setVideo] = useState<File | undefined>(undefined);
    const [videoURL, setVideoURL] = useState<String | undefined>(undefined);
    const [message, setMessage] = useState('____')

    useEffect(() => {
        fetch("http://localhost:8080/api/predictions")
            .then((response) => response.json())
            .then((data) => {
                setMessage(data.message)
                console.log(message);
            });
    }, []);

    const settingMedia = (source: string) => {
        setVideoURL(undefined);
        setVideo(undefined);
        setMediaSource(source)
    }

    const extractFilePath = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        setVideo(file);
        if (videoURL) {
            URL.revokeObjectURL(videoURL);
        }
        if (file) {
            const url = URL.createObjectURL(file);
            setVideoURL(url);
        } else {
            setVideoURL(undefined);
        }
    }

    const browseAction = () => {
        if (video) {
            console.log('browse');
        }

    }

    const startAction = (source: string) => {
        switch (source) {
            case 'Live':
                console.log('Live is not functional ... yet ;)');
                break;
            case 'Browse':
                browseAction();
                break;
            default:
                console.log('Neither live nor browse ... Error :(');
        }
    }

    return (
        <>
            <div className="div container px-5">
                <div className="row">
                    <div className="col-12 d-flex justify-content-center  py-3">
                        <div className={`${styles.radioInputs}`}>
                            <label className={`${styles.radio}`}>
                                <input id="liveInput" type="radio" name="radio" />
                                <span onClick={() => settingMedia('Live')} className={`${styles.name} fs-5`}>Live</span>
                            </label>
                            <label className={`${styles.radio}`}>
                                <input id="BrowseInput" type="radio" name="radio" />
                                <span onClick={() => settingMedia('Browse')} className={`${styles.name} fs-5`}>Browse</span>
                            </label>
                        </div>
                    </div>
                    {mediaSource == 'Browse' &&
                        <div className="col-12 d-flex justify-content-center pb-3">
                            <div className="col-6 bg-black rounded rounded-5 p-1">
                                <input id="BrowseBtn" type="file" onChange={extractFilePath} />
                            </div>
                        </div>}
                </div>
                <div className="d-flex justify-content-center align-items-center">
                    <div className="z-2 position-absolute">
                        {loading ?
                            <button className={`${styles.hourglassBackground}`}>
                                <div className={`${styles.hourglassContainer}`}>
                                    <div className={`${styles.hourglassCurves}`}></div>
                                    <div className={`${styles.hourglassCapTop}`}></div>
                                    <div className={`${styles.hourglassGlassTop}`}></div>
                                    <div className={`${styles.hourglassSand}`}></div>
                                    <div className={`${styles.hourglassSandStream}`}></div>
                                    <div className={`${styles.hourglassCapBottom}`}></div>
                                    <div className={`${styles.hourglassGlass}`}></div>
                                </div>
                            </button> :
                            <button onClick={() => startAction(mediaSource)} className={`${styles.gaitRounded}`}>Start</button>
                        }

                    </div>
                    <div className={`col-md-12 overflow-hidden ${styles.videoPlaceholder} `}>
                        {video && videoURL && (
                            <ReactPlayer className="w-100 h-100" url={videoURL} playing={true} loop={true} controls={false} autoplay />
                        )}
                    </div>
                </div>
                <div className="row pt-4">
                    <h2 className=" d-flex justify-content-center">Name: <span id="PredictionResult">{' '+ message}</span></h2>
                </div>
            </div>
        </>
    );
}
export default Predict