import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faServer } from '@fortawesome/free-solid-svg-icons';
import styles from "./Predict.module.css"
import Link from "next/link";



function Predict() {
    const inputOptions = [
        { name: 'Live' },
        { name: 'Browse' }
    ]

    function mediaSource(source: string) {
        switch (source) {
            case source = 'Live':
                // openCamera();
                console.log("camera opened")
                break;
            case source = 'Browse':
                // openFileBrowser();
                console.log("browser opened")
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
                                <input type="radio" name="radio" />
                                <span className={`${styles.name} fs-5`}>Live</span>
                            </label>
                        </div>
                    </div>
                </div>
                <div className="row justify-content-center">
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