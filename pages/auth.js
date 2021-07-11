import FirebaseAuth from '../components/auth/FirebaseAuth'
import styles from "../styles/Home.module.css";

export default function Auth() {
    return (
        <div>
            <div>
                <FirebaseAuth/>
                <div className={styles.logo}><a style={{color: "white"}} href="/">Go Home</a></div>
            </div>
        </div>
    )
}
