import React from 'react';
import styles from './Footer.module.scss';

const Footer = () => {
    return (
        <div className={styles.container}>
            <p>© 2020 <strong>Autonomous Rocket Controls Club</strong> at the University of Washington</p>
            <button className={"filledButton"}>Contribute to ARCC</button>
        </div>
    );
};

export default Footer;