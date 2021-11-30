import { motion } from 'framer-motion';
import styles from '../styles/Modal.module.scss';

function Modal({ children, setModal }) {
    return (
        <>
            <motion.div
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                transition={{
                    duration: 0.3,
                }}
                className={styles.inputsOuterContainer}
            >
                <div className={styles.modalContainer}>{children}</div>
            </motion.div>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={styles.modalBG}
                onClick={() => setModal(false)}
            />
        </>
    );
}

export default Modal;
