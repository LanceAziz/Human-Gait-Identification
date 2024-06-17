'use client';
import styles from "./Predict.module.css"
import Link from "next/link";
import { useState, useRef } from 'react';
import ReactPlayer from 'react-player'

function Predict() {
    // Variables
    const [mediaSource, setMediaSource] = useState('Live');
    const [loading, setLoading] = useState(false);
    const [video, setVideo] = useState<File | undefined>(undefined);
    const [videoURL, setVideoURL] = useState<string | undefined>(undefined);
    const [message, setMessage] = useState('____');
    const ref = useRef<HTMLInputElement>(null);
    const postAPI = 'http://localhost:8080/post/predictions';

    // (settingMedia) function set the media source to be either LIVE or BROWSE
    const settingMedia = (source: string) => {
        setVideoURL(undefined);
        setVideo(undefined);
        setMessage('____')
        setMediaSource(source);
    };

    // (startAction) function redirects the code to either LIVE or BROWSE
    const startAction = async (source: string) => {
        switch (source) {
            case 'Live':
                await liveAction();
                break;
            case 'Browse':
                await browseAction();
                break;
        }
    };

    // (extractFilePath) function set the video to be previewed 
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
    };

    // (browseAction) function sends the browsed video to the backend
    const browseAction = async () => {
        if (!video) return;
        setLoading(true);
        try {
            const data = new FormData();
            data.set('file', video);
            const res = await fetch(postAPI, {
                method: 'POST',
                body: data,
            });
            if (!res.ok) throw new Error(await res.text());
            const result = await res.json();
            setMessage(result.message); // Display the success message from the backend
            ref.current && (ref.current.value = '');
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const liveAction = async () => {
        // try {
        //     const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        //     setVideoURL(stream); // Set the stream object directly as URL
        // } catch (error) {
        //     console.error('Error accessing camera:', error);
        // }
    };


    return (
        <div className="div container px-5">
            <div className="row">
                <div className="col-12 d-flex justify-content-center py-3">
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
                            <input id="BrowseBtn" type="file" onChange={extractFilePath} ref={ref} />
                        </div>
                    </div>}
            </div>
            <div className="d-flex justify-content-center align-items-center">
                <div className="z-2 position-absolute">
                    {loading ?
                        <button className='hourglassBackground'>
                            <div className='hourglassContainer'>
                                <div className='hourglassCurves'></div>
                                <div className='hourglassCapTop'></div>
                                <div className='hourglassGlassTop'></div>
                                <div className='hourglassSand'></div>
                                <div className='hourglassSandStream'></div>
                                <div className='hourglassCapBottom'></div>
                                <div className='hourglassGlass'></div>
                            </div>
                        </button> :
                        <button onClick={() => startAction(mediaSource)} className={`${styles.gaitRounded}`}>Start</button>
                    }

                </div>
                <div className={`col-md-12 overflow-hidden ${styles.videoPlaceholder} `}>
                    {video && videoURL && (
                        <ReactPlayer className="w-100 h-100" url={videoURL} playing={true} loop={true} controls={false} muted={true} autoplay />
                    )}
                </div>
            </div>
            <div className="row pt-4">
                <h2 className="d-flex justify-content-center">Name: <span id="PredictionResult">{' ' + message}</span></h2>
            </div>
        </div>
    );
}
export default Predict;