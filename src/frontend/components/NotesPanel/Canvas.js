import {React, useEffect, useState} from 'react'
import NoteStruct from './NoteStruct';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { auth, db } from '../../../backend/firebase'
import { collection, doc, setDoc, getDocs, collectionGroup, getDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { motion as m, AnimatePresence } from 'framer-motion';

const Canvas = (props) => {

    const [open, setOpen] = useState(true);


    return (
        <div className={open ? 'pb-[20px] w-[105%]' : 'w-[105%]'}>
            <div onClick={() => {
                setOpen(!open);
                localStorage.setItem("canvasOpen", !open);
    
            }} className=' w-[100%] h-[40px] flex items-center justify-between gap-[10px] border-b-[2px] hover:border-[#c5c5c5] rounded-md cursor-pointer mb-[5px]'>
                <p className='text-[22px] font-thin select-none ml-[80px]'>Canvas</p>
                {
                    open ?
                    <KeyboardArrowDownIcon sx={{fontSize: '25px', marginTop: "3px", marginRight: "60px"}} />
                    :
                    <KeyboardArrowRightIcon sx={{fontSize: '25px', marginTop: "3px", marginRight: "60px"}} />
                }
            </div>
            <AnimatePresence>
            {
                open && 
    
                    <m.div initial={{
                        height: 0,
                        opacity: 0,
                      }}
                      animate={{
                        height: "auto",
                        opacity: 1,
                        transition: {
                                     height: {
                                          duration: 0.1,
                                    },
                                    opacity: {
                                          duration: 0.1,
                                          delay: 0,
                                     },
                                  },
                      }}
                      exit={{
                        height: 0,
                        opacity: 0,
                        transition: {
                                    height: {
                                         duration: 0.1,
                                     },
                                     opacity: {
                                         duration: 0.1,
                                     },
                                 },
                      }} className='m-auto w-[200px] flex items-center justify-center'>
                    Canvas Coming Soon...
                </m.div>
            }
            </AnimatePresence>
        </div>
        
      )
}

export default Canvas