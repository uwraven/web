import React, { Component } from 'react';
import styles from './Team.module.scss';

// Import images
import url_vredevoogd from '../../Assets/Portraits/vredevoogd.jpeg';
import url_moccia from '../../Assets/Portraits/moccia.jpg';
import url_barry from '../../Assets/Portraits/barry.jpg'
import url_thompson from '../../Assets/Portraits/thompson.jpg'
import url_chen from '../../Assets/Portraits/chen.jpg';
import url_bardakcilar from '../../Assets/Portraits/bardakcilar.jpg';
import url_kim from '../../Assets/Portraits/kim.png';
import url_grinchuck from '../../Assets/Portraits/grinchuck.jpg';

class Team extends Component {
    render() {
        return (
            <div className={styles.container}>
                <h3>Members</h3>
                <div className={styles.peopleContainer}>
                    { Members.map(person => {
                        return(
                            <div className={styles.personContainer}>
                                <div className={styles.imageContainer}>
                                    <img src={person.source} alt={person.name} className={styles.personImage}/>
                                    { person.link && <a className={styles.link} target={"_blank"} href={person.link}></a> }
                                </div>
                                <p className={styles.name}>{person.name}</p>
                                <p className={styles.role}>{person.role}</p>
                            </div>
                        )
                    }) }
                </div>
                {/* <h3>Mentors</h3>
                <div className={styles.peopleContainer}>
                    { Members.map(person => {
                        return(
                            <div className={styles.personContainer}>
                                <div className={styles.imageContainer}>
                                    <img src={person.source} alt={person.name} className={styles.personImage}/>
                                    <a></a>
                                </div>
                                <p className={styles.name}>{person.name}</p>
                                <p className={styles.role}>{person.role}</p>
                            </div>
                        )
                    }) }
                </div> */}
            </div>
        );
    }
}

const Members = [
    {
        name: "Gabe Thompson",
        role: "Team Administrator, Actuators",
        source: url_thompson,
        link: "https://www.linkedin.com/in/gwthmpsn/"
    },
    {
        name: "Matt Vredevoogd",
        role: "Chief Engineer, Avionics and GNC Lead",
        source: url_vredevoogd,
        link: "https://www.linkedin.com/in/matt-vredevoogd-1b6662155/"
    },
    {
        name: "Tom Moccia",
        role: "Propulsion Lead",
        source: url_moccia,
        link: "https://www.linkedin.com/in/thomas-moccia-747455106/"
    },
    {
        name: "Erdem Bardakcilar",
        role: "Actuators Lead, Avionics and GNC",
        source: url_bardakcilar,
        link: "https://www.linkedin.com/in/erdem-bardakcilar-57041b170/"
    },
    {
        name: "Jiacheng Chen",
        role: "Structures Lead",
        source: url_chen,
        link: "https://www.linkedin.com/in/nathaniel-barry-42580a147/"
    },
    {
        name: "Nate Barry",
        role: "Propulsion",
        source: url_barry,
        link: "https://www.linkedin.com/in/nathaniel-barry-42580a147/"
    },
    {
        name: "Roman Grinchuck",
        role: "Actuators, Avionics and GNC",
        source: url_grinchuck,
        // link: "https://www.linkedin.com/in/nathaniel-barry-42580a147/"
    },
    {
        name: "Shawn Kim",
        role: "Structures",
        source: url_kim,
        // link: "https://www.linkedin.com/in/nathaniel-barry-42580a147/"
    },
]

// const Mentors = [
//     {
//         name: "Gabe Thompson",
//         role: "Team Administrator",
//         source: url_thompson,
//         link: "https://www.linkedin.com/in/gwthmpsn/"
//     },
//     {
//         name: "Matt Vredevoogd",
//         role: "Chief Engineer, Avionics and GNC Lead",
//         source: url_vredevoogd,
//         link: "https://www.linkedin.com/in/matt-vredevoogd-1b6662155/"
//     },
// ]

export default Team;