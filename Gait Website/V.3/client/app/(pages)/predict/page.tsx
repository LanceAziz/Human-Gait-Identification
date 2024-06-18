'use client';
import styles from "./Predict.module.css"
import Link from "next/link";
import { useState, useEffect, useRef } from 'react';
import ReactPlayer from 'react-player'

function Predict() {
    // Hooks
    const [mediaSource, setMediaSource] = useState('Live');
    const [loading, setLoading] = useState(false);
    const [video, setVideo] = useState<File | null>(null);
    const [message, setMessage] = useState('____');
    const [stream, setStream] = useState<MediaStream>();
    const videoRef = useRef<HTMLVideoElement>(null);
    const postAPI = 'http://localhost:8080/post/predictions';

    // (settingMedia) function set the media source to be either LIVE or BROWSE
    const settingMedia = (source: string) => {
        setVideo(null);
        setMessage('____');
        if (videoRef.current) {
            videoRef.current.srcObject = null;
            videoRef.current.src = '';
        }
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
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

    // (videoShow) function set the video to be previewed 
    const videoShow = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setVideo(file);
            const url = URL.createObjectURL(file);
            if (videoRef.current) {
                videoRef.current.srcObject = null; // Clear previous stream
                videoRef.current.src = url;
                videoRef.current.play();
            }
        }
    };

    // (browseAction) function sends the browsed video to the backend
    const browseAction = () => {
        setLoading(true);
        const data = new FormData();
        if (video) {
            data.set('file', video);
        }
        fetch(postAPI, {
            method: 'POST',
            body: data
        })
            .then(res => res.json())
            .then(data => {
                setMessage(data.message);
                setLoading(false);
            })
    };

    // (liveAction) funtion sends chuncks of frames to the backend (every 15 frames)
    const liveAction = () => {
        navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } })
            .then(
                stream => {
                    if (videoRef.current) {
                        let video = videoRef.current
                        video.srcObject = stream;
                        setStream(stream)
                        video.play();
                    } else {
                        stream.getTracks().forEach(track => track.stop());
                    }
                }
            )
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
                            <input id="BrowseBtn" type="file" onChange={videoShow} />
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
                    <video ref={videoRef} className="w-100 h-100" muted loop autoPlay></video>
                </div>
            </div>
            <div className="row pt-4">
                <h2 className="d-flex justify-content-center">Name: <span id="PredictionResult">{' ' + message}</span></h2>
            </div>
        </div>
    );
}
export default Predict;