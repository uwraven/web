import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import styles from './navigator.module.scss';

const MOBILEWIDTH = 760;

class Navigator extends Component {
    constructor(props) {
        super(props);
        this.state = {
            expanded: false,
        }
        // this.resizeListener = this.resizeListener.bind(this);
    }

    // componentDidMount() {
    //     window.addEventListener("resize", this.resizeListener);
    // }

    // componentWillUnmount() {
    //     window.removeEventListener("resize", this.resizeListener);
    // }

    // resizeListener(e) {
    //     if (window.innerWidth < MOBILEWIDTH && !(this.state.mobile)) {
    //         this.setState({
    //             mobile: true,
    //             expanded: false,
    //         });
    //     } else  if (window.innerWidth > MOBILEWIDTH && this.state.mobile) {
    //         this.setState({mobile: false})
    //     }
    // }

    render() {
        const Links = () => Object.keys(this.props.refs).map(key => <li><Link to={this.props.refs[key].ref} onClick={() => {this.setState({expanded: false})}}>{this.props.refs[key].title}</Link></li>);
        return(
            <div className={styles.navigationWrapper}>
                <div className={styles.navigationLeft}>
                    <Link to={this.props.home}><h1>UW RAVEN</h1></Link>
                </div>
                    <div className={styles.navigationRight}>
                    <ul className={styles.navigationList}> 
                        <Links/>
                    </ul>
                    <button className={styles.ctabutton}>Contribute</button>
                    <div className={styles.mobileButton} onClick={(e) => {
                        this.setState({expanded: !this.state.expanded})
                    }}></div>
                </div>
                <div className={[styles.collapsable, (this.state.expanded ? styles.expanded : "")].join(" ")}>
                    <ul className={styles.collapsableNavList}> 
                        <Links/>
                    </ul>
                </div>
            </div>
        )
    }
}

Navigator.propTypes = {
    refs: PropTypes.objectOf(PropTypes.shape({
        title: PropTypes.string.isRequired, 
        destination: PropTypes.string.isRequired
    }).isRequired).isRequired
}

export default Navigator;