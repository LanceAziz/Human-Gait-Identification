'use client';
import styles from "./Predict.module.css"
import Link from "next/link";

function Predict() {
    let browseElement = document.getElementById('browseElement')
    function openCamera() {
        browseElement?.classList.add('d-none');
    }
    function openFileBrowser() {
        console.log("browser opened");
        browseElement?.classList.remove('d-none');
    }

    function mediaSource(source: string) {
        switch (source) {
            case source = 'Live':
                openCamera();
                break;
            case source = 'Browse':
                openFileBrowser();
                break;
            default:
                console.log("Unknown Source selected");
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
                                <span onClick={() => mediaSource('Live')} className={`${styles.name} fs-5`}>Live</span>
                            </label>
                            <label className={`${styles.radio}`}>
                                <input id="BrowseInput" type="radio" name="radio" />
                                <span onClick={() => mediaSource('Browse')} className={`${styles.name} fs-5`}>Browse</span>
                            </label>
                        </div>
                    </div>
                    <div id="browseElement" className="col-12 d-flex justify-content-center pb-3 d-none">
                        <div className="col-8 bg-black rounded rounded-5">d</div>
                    </div>
                </div>
                <div className="d-flex justify-content-center align-items-center">
                    <div className="z-2 position-absolute">
                        <button id="startButton" className={`${styles.gaitRounded}`}>Start</button>
                        <button id="loader" className={`${styles.hourglassBackground} d-none`}>
                            <div className={`${styles.hourglassContainer}`}>
                                <div className={`${styles.hourglassCurves}`}></div>
                                <div className={`${styles.hourglassCapTop}`}></div>
                                <div className={`${styles.hourglassGlassTop}`}></div>
                                <div className={`${styles.hourglassSand}`}></div>
                                <div className={`${styles.hourglassSandStream}`}></div>
                                <div className={`${styles.hourglassCapBottom}`}></div>
                                <div className={`${styles.hourglassGlass}`}></div>
                            </div>
                        </button>
                    </div>
                    <div className={`col-md-12 ${styles.videoPlaceholder} `}></div>
                </div>
                <div className="row pt-4">
                    <h2 className=" d-flex justify-content-center">Name: <span id="PredictionResult">Lance Moheb</span></h2>
                </div>
            </div>
        </>
    );
}
export default Predict