import React from 'react';
import { HiMenuAlt4 } from 'react-icons/hi';
import { AiOutlineClose } from 'react-icons/ai';
import { useState } from 'react';

import logo from '../../images/ozlogo.png';

const NavbarItem = ({ title, classProps }) => {
    return (
        <li className={`mx-4 my-2 cursor-pointer ${classProps}`}>
            {title}
        </li>
    )
}

const Navbar = () => {
    const [toggleMobile, setToggleMobile] = useState(false);


    return (
        <nav className='w-full flex md:justify-center justify-between items-center p-4'>
            <div className='md:flex-[0.5] flex-initial justify-center items-center'>
                <img src={logo} alt='logo' className='w-32 cursor-pointer' />
            </div>
            <ul className='text-white md:flex hidden list-none flex-row justify-between items-center flex-initial'>
                {//instead of just listing menu items, lets define another component called Navbar item to define the link props,
                    //create an array of links and then map each link to their own NavbarItem component
                    ["Market", "Exchange", "Tutorials", "Wallets"].map((item, index) => (
                        <NavbarItem key={item + index} title={item} />
                    ))}
                <li className='bg-[#2952e3] px-7 py-2 mx-4 rounded-full cursor-pointer hover:bg-[#2546bd]'>
                    Login
                </li>
            </ul>

            <div className='flex relative'>
                {//this is the entire mobile version of the navigation - just below this switches the mobile version menu toggle icons
                    toggleMobile ?
                        <AiOutlineClose fontSize={28} className='text-white md:hidden cursor-pointer' onClick={() => setToggleMobile(false)} />
                        :
                        <HiMenuAlt4 fontSize={28} className='text-white md:hidden cursor-pointer' onClick={() => setToggleMobile(true)} />
                }
                {//this is the dropdown menu which pops up when toggleMobile state is set to true
                    toggleMobile && (
                        <ul
                            className='z-10 fixed top-0 -right-2 p-3 w-[60vw] h-screen shadow-2xl md:hidden list-none
                            flex flex-col justify-start items-end rounded-md blue-glassmorphism text-white animate-slide-in'
                        >
                            <li className='text-xl w-full my-2'>
                                <AiOutlineClose onClick={() => setToggleMobile(false)} />
                            </li>
                            { //reusing the navbaritem mapping to render the mobile version of the navigation
                                ["Market", "Exchange", "Tutorials", "Wallets"].map((item, index) => (
                                    <NavbarItem key={item + index} title={item} />
                                ))
                            }
                        </ul>
                    )
                }
            </div>
        </nav>
    )
}

export default Navbar;