import gifNotFound from '@/public/404.gif'
import Image from 'next/image';
import styles from '@/app/not-found.module.css'
import Link from "next/link";

function NotFound() {
    return (
        <>
            <div className="container">
                <div className="d-flex flex-column justify-content-center align-items-center vh-100">
                    <div className={`bg-black text-white ${styles.rounded} ${styles.padding}`}>
                        <div className='d-flex justify-content-center align-items-center g-0'>
                            <h2 className={`${styles.notFoundFontSize}`}>4</h2>
                            <Image className={`${styles.gifNotFound}`} src={gifNotFound} alt='' />
                            <h2 className={`${styles.notFoundFontSize}`}>4</h2>
                        </div>
                        <Link className={`gait-btn fs-3 ${styles.btnPadding}`} href='/'>Return To Home</Link>
                    </div>
                </div>
            </div>
        </>
    );
}

export default NotFound;