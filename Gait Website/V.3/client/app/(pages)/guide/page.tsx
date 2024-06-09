import styles from "./Guide.module.css"
import Video from 'next-video';

function Guide() {
    return (
        <>
            <div className="container px-5">
                <div className="row">
                    <div className="d-flex justify-content-center pt-5">
                        <div className={`${styles.hcus}`}>
                            <iframe className="w-100 h-100 rounded-5" src="https://www.youtube.com/embed/uyULsEJRXWA"></iframe>
                        </div>
                    </div>
                    <h2 className="text-center pt-4 pb-2">Guide</h2>
                    <div className="d-flex justify-content-center">
                        <ol className={`${styles.adjust}`}>
                            <li className="li-big">Choose video input Method:</li>
                            <ol type="A">
                                <li className="li-big-outline">Live: Live Camera Feed For live Detection.</li>
                                <li className="li-big-outline"> Browse: To browse pre-recorded video.</li>
                            </ol>
                            <li className="li-big">Press (Start) wait for the AI to process.</li>
                            <li className="li-big">Name of the subject will appear below the feed.</li>
                            <li className="li-big">Check (Logs) tab to see the detected people with the date and time.</li>
                        </ol>
                    </div>
                </div>
            </div>

        </>
    );
}
export default Guide