import styles from '../styles/Header.module.scss';

function Header({ setModal }) {
    return (
        <header className={styles.header}>
            <div className={styles.logo}>Recippo</div>
            <nav>
                <button onClick={() => setModal(true)}>
                    <span>login</span>
                </button>
            </nav>
        </header>
    );
}

export default Header;
