import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
// import { motion } from 'framer-motion';
// import { useClosingKey } from '../helpers/useClosingKey';
import Modal from './Modal';
import styles from '../styles/Login.module.scss';
import toast from 'react-hot-toast';

function Login({ setModal }) {
    // const [loading, setLoading] = useState(false);
    const [registerState, setRegisterState] = useState(false);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmedPassword, setConfirmedPassword] = useState('');

    const handleLogin = async e => {
        e.preventDefault();
        try {
            // setLoading(true);
            const { error } = await supabase.auth.signIn({ email: email, password: password });

            if (error) throw error;

            setModal(false);
        } catch (error) {
            toast.error(error.error_description || error.message);
        }
    };

    const handleSignUp = async e => {
        e.preventDefault();
        try {
            if (password !== confirmedPassword) {
                toast.error("Passwords don't match!");
                return;
            }

            const { user, session, error } = await supabase.auth.signUp({
                email: email,
                password: password,
            });

            if (error) throw error;
        } catch (error) {
            toast.error(error.error_description || error.message);
        }
    };

    // const handleProviderLogin = async (e, provider) => {
    //     e.preventDefault();
    //     try {
    //         const { error } = await supabase.auth.signIn({
    //             provider: provider,
    //         });

    //         if (error) throw error;
    //     } catch (error) {
    //         notifyError(error.error_description || error.message);
    //     } finally {
    //         setModal(false);
    //     }
    // };

    // useClosingKey('Escape', undefined, setModal);

    return (
        <>
            <Modal setModal={setModal}>
                <div className={styles.inputsContainer}>
                    <span>Sign in:</span>
                    {registerState ? (
                        <form onSubmit={e => handleSignUp(e)}>
                            <span>Register with your email</span>
                            <label>
                                <span>Email</span>
                                <input
                                    name="email"
                                    type="email"
                                    placeholder="Your email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                />
                            </label>
                            <label>
                                <span>Password</span>
                                <input
                                    name="password"
                                    type="password"
                                    placeholder="Your pass"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                />
                            </label>
                            <label>
                                <span>Confirm password</span>
                                <input
                                    name="confirmedpass"
                                    type="password"
                                    placeholder="Confirm password"
                                    value={confirmedPassword}
                                    onChange={e => setConfirmedPassword(e.target.value)}
                                />
                            </label>
                            <button>sign up</button>
                        </form>
                    ) : (
                        <form onSubmit={e => handleLogin(e)}>
                            <span>Login with your email</span>
                            <span onClick={() => setRegisterState(true)}>
                                ...or register if you haven&apos;t
                            </span>
                            <label>
                                <span>Email</span>
                                <input
                                    name="email"
                                    type="email"
                                    placeholder="Your email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                />
                            </label>
                            <label>
                                <span>Password</span>
                                <input
                                    name="password"
                                    type="password"
                                    placeholder="Your pass"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                />
                            </label>
                            <button>sign up</button>
                        </form>
                    )}
                    {/* <div>
                            <span>With Twitter</span>
                            <br />
                            <motion.button
                                onClick={e => handleProviderLogin(e, 'twitter')}
                                whileHover={{ y: -3 }}
                                whileTap={{ y: 0 }}
                                transition={{ duration: 0.2 }}
                                aria-label="google login button"
                                disabled={loading}
                                className={styles.googleButton}
                            >
                                Twitter
                            </motion.button>
                        </div> */}
                </div>
            </Modal>
        </>
    );
}

export default Login;
