import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { isMobile as mobile } from 'react-device-detect';
import styles from '../styles/Modal.module.scss';

function Modal({ children, modal, setModal }) {
	useEffect(() => {
		modal &&
			document.body.setAttribute('style', `overflow: hidden; margin-right: ${mobile ? '0' : '12px'};`);
		!modal &&
			document.body.removeAttribute(
				'style',
				`overflow: hidden; margin-right: ${mobile ? '0' : '12px'};`
			);
	}, [modal]);

	return (
		<AnimatePresence exitBeforeEnter>
			{modal && (
				<>
					<motion.div
						key="modal"
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
			)}
		</AnimatePresence>
	);
}

export default Modal;
