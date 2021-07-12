import React from 'react';
import spinnerLogo from './../../assets/svg/spinner.svg';
import './Loader.module.css';
import Image from "next/image";

const Loader = () => {
    return (
        <div className='Loader'>
            <Image src={spinnerLogo} alt="Loading..." height={30} width={30}/>
        </div>
    );
};

export default Loader;
