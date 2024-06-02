import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import styles from "./Footer.module.css"
import Link from "next/link";


function Footer() {
    return (
        <>
            <footer className="footer fixed-bottom d-flex justify-content-center align-items-center bg-black rounded rounded-bottom-0 rounded-top-5 p-3">
                <div className={`${styles.footerBtnWidth}`}>
                    <Link className='gait-btn fs-3 py-3 d-flex justify-conetnt-center align-items-center' href="https://github.com/LanceAziz/Human-Gait-Identification.git"><FontAwesomeIcon className='gaitIcon mx-2' icon={faGithub} />Github</Link>
                </div>
            </footer >
        </>
    );
}

export default Footer