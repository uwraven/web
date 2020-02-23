import React from 'react';
import styles from './Footer.module.scss';

const Footer = () => {
    return (
        <div className={styles.container}>
            <div className={styles.inner}>
                <p>© 2020 <strong>Autonomous Rocket Control Club</strong> at the University of Washington</p>
                <a href={"mailto:arcc@uw.edu"}><button className={"filledButton"}>Contribute to ARCC</button></a>
            </div>
        </div>
    );
};

export default Footer;