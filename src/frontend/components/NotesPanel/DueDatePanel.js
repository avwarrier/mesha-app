import React, { useEffect, useState } from 'react'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import DueDate from './DueDate';
import { auth, db } from '../../../backend/firebase'
import { collection, doc, setDoc, getDocs, collectionGroup, getDoc, deleteDoc, updateDoc } from "firebase/firestore";
import Skeleton from '@mui/material/Skeleton';
import {motion as m, AnimatePresence } from "framer-motion"

const DueDatePanel = (props) => {
    const [dueDates, setDueDates] = useState([]);
    const [open, setOpen] = useState(true);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const saved = (localStorage.getItem("dueOpen") == 'true')
        setOpen(saved);
        console.log(open);
    }, [open])

    useEffect(() => {
        const checkOpen = async () => {
            console.log(props.userEmail == '')
            if(props.userEmail == '') return;
            //setLoading(true);
            const colRef = collection(db, "users", props.userEmail, "dueDateCollection");
            const docsSnap = await getDocs(colRef);
            let temp = [];
            docsSnap.forEach(doc => {
                if(doc == null) return;
                else {
                    let docDate = doc.data().dateTime.date.split('/');
                    let docAm = doc.data().dateTime.time.substring(doc.data().dateTime.time.length-2);
                    let docTime = doc.data().dateTime.time.substring(0, doc.data().dateTime.time.length-2);
                    docTime = docTime.split(':')
                    if(temp.length == 0) {
                    temp.push({
                        type: doc.data().type,
                        name: doc.data().name,
                        date: doc.data().dateTime.date,
                        time: doc.data().dateTime.time,
                        id: doc.id
                    })} else if (temp.length == 1) {
                        let tempDate = temp[0].date.split('/')
                        let tempAm = temp[0].time.substring(temp[0].time.length-2);
                        let tempTime = temp[0].time.substring(0, temp[0].time.length-2);
                        tempTime = tempTime.split(':');

                        if(parseInt(tempDate[2]) != parseInt(docDate[2])) {
                            if(parseInt(tempDate[2]) > parseInt(docDate[2])) {
                                temp.unshift({
                                    type: doc.data().type,
                                    name: doc.data().name,
                                    date: doc.data().dateTime.date,
                                    time: doc.data().dateTime.time,
                                    id: doc.id
                                })
                            } else {
                            temp.push({
                                type: doc.data().type,
                                name: doc.data().name,
                                date: doc.data().dateTime.date,
                                time: doc.data().dateTime.time,
                                id: doc.id
                            })}
                        } else {
                            if(parseInt(tempDate[1]) != parseInt(docDate[1])) {
                                if(parseInt(tempDate[1]) > parseInt(docDate[1])) {
                                    temp.unshift({
                                        type: doc.data().type,
                                        name: doc.data().name,
                                        date: doc.data().dateTime.date,
                                        time: doc.data().dateTime.time,
                                        id: doc.id
                                    })
                                } else {
                                temp.push({
                                    type: doc.data().type,
                                    name: doc.data().name,
                                    date: doc.data().dateTime.date,
                                    time: doc.data().dateTime.time,
                                    id: doc.id
                                })}
                            } else {
                                if(parseInt(tempDate[0]) != parseInt(docDate[0])) {
                                    if(parseInt(tempDate[0]) > parseInt(docDate[0])) {
                                        temp.unshift({
                                            type: doc.data().type,
                                            name: doc.data().name,
                                            date: doc.data().dateTime.date,
                                            time: doc.data().dateTime.time,
                                            id: doc.id
                                        })
                                    } else {
                                    temp.push({
                                        type: doc.data().type,
                                        name: doc.data().name,
                                        date: doc.data().dateTime.date,
                                        time: doc.data().dateTime.time,
                                        id: doc.id
                                    })}
                                } else {
                                    if(tempAm != docAm) {
                                        if(tempAm == 'pm') {
                                            temp.unshift({
                                                type: doc.data().type,
                                                name: doc.data().name,
                                                date: doc.data().dateTime.date,
                                                time: doc.data().dateTime.time,
                                                id: doc.id
                                            })
                                        } else {
                                            temp.push({
                                                type: doc.data().type,
                                                name: doc.data().name,
                                                date: doc.data().dateTime.date,
                                                time: doc.data().dateTime.time,
                                                id: doc.id
                                            })}
                                        } else {
                                            if(parseInt(tempTime[0]) != parseInt(docTime[0])) {
                                                if(parseInt(tempTime[0]) > parseInt(docTime[0])) {
                                                    temp.unshift({
                                                        type: doc.data().type,
                                                        name: doc.data().name,
                                                        date: doc.data().dateTime.date,
                                                        time: doc.data().dateTime.time,
                                                        id: doc.id
                                                    })
                                                } else {
                                                temp.push({
                                                    type: doc.data().type,
                                                    name: doc.data().name,
                                                    date: doc.data().dateTime.date,
                                                    time: doc.data().dateTime.time,
                                                    id: doc.id
                                                })}
                                            } else {
                                                if(parseInt(tempTime[1]) != parseInt(docTime[1])) {
                                                    if(parseInt(tempTime[1]) > parseInt(docTime[1])) {
                                                        temp.unshift({
                                                            type: doc.data().type,
                                                            name: doc.data().name,
                                                            date: doc.data().dateTime.date,
                                                            time: doc.data().dateTime.time,
                                                            id: doc.id
                                                        })
                                                    } else {
                                                    temp.push({
                                                        type: doc.data().type,
                                                        name: doc.data().name,
                                                        date: doc.data().dateTime.date,
                                                        time: doc.data().dateTime.time,
                                                        id: doc.id
                                                    })}
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        } else {
                            for(let i = 0; i < temp.length; i++) {
                        let tempDate = temp[i].date.split('/')
                        let tempAm = temp[i].time.substring(temp[0].time.length-2);
                        let tempTime = temp[i].time.substring(0, temp[0].time.length-2);
                        tempTime = tempTime.split(':');

                        if(parseInt(tempDate[2]) != parseInt(docDate[2])) {
                            if(parseInt(tempDate[2]) > parseInt(docDate[2])) {
                                temp.splice(i, 0, {
                                    type: doc.data().type,
                                    name: doc.data().name,
                                    date: doc.data().dateTime.date,
                                    time: doc.data().dateTime.time,
                                    id: doc.id
                                });
                                return;
                            } else if (i == temp.length-1) {
                                temp.push({
                                    type: doc.data().type,
                                    name: doc.data().name,
                                    date: doc.data().dateTime.date,
                                    time: doc.data().dateTime.time,
                                    id: doc.id
                                })
                                return;
                            }
                                
                            
                        } else {
                            if(parseInt(tempDate[1]) != parseInt(docDate[1])) {
                                if(parseInt(tempDate[1]) > parseInt(docDate[1])) {
                                    temp.splice(i, 0, {
                                        type: doc.data().type,
                                        name: doc.data().name,
                                        date: doc.data().dateTime.date,
                                        time: doc.data().dateTime.time,
                                        id: doc.id
                                    });
                                    return;
                                } else if (i == temp.length-1) {
                                    temp.push({
                                        type: doc.data().type,
                                        name: doc.data().name,
                                        date: doc.data().dateTime.date,
                                        time: doc.data().dateTime.time,
                                        id: doc.id
                                    })
                                    return;
                                }
                            } else {
                                if(parseInt(tempDate[0]) != parseInt(docDate[0])) {
                                    if(parseInt(tempDate[0]) > parseInt(docDate[0])) {
                                        temp.splice(i, 0, {
                                            type: doc.data().type,
                                            name: doc.data().name,
                                            date: doc.data().dateTime.date,
                                            time: doc.data().dateTime.time,
                                            id: doc.id
                                        });
                                        return;
                                    } else if (i == temp.length-1) {
                                        temp.push({
                                            type: doc.data().type,
                                            name: doc.data().name,
                                            date: doc.data().dateTime.date,
                                            time: doc.data().dateTime.time,
                                            id: doc.id
                                        })
                                        return;
                                    }
                                } else {
                                    if(tempAm != docAm) {
                                        if(tempAm == 'pm') {
                                            temp.splice(i, 0, {
                                                type: doc.data().type,
                                                name: doc.data().name,
                                                date: doc.data().dateTime.date,
                                                time: doc.data().dateTime.time,
                                                id: doc.id
                                            });
                                            return;
                                        } else if (i == temp.length-1) {
                                            temp.push({
                                                type: doc.data().type,
                                                name: doc.data().name,
                                                date: doc.data().dateTime.date,
                                                time: doc.data().dateTime.time,
                                                id: doc.id
                                            })
                                            return;
                                        }
                                        } else {
                                            if(parseInt(tempTime[0]) != parseInt(docTime[0])) {
                                                if(parseInt(tempTime[0]) > parseInt(docTime[0])) {
                                                    temp.splice(i, 0, {
                                                        type: doc.data().type,
                                                        name: doc.data().name,
                                                        date: doc.data().dateTime.date,
                                                        time: doc.data().dateTime.time,
                                                        id: doc.id
                                                    });
                                                    return;
                                                } else if (i == temp.length-1) {
                                                    temp.push({
                                                        type: doc.data().type,
                                                        name: doc.data().name,
                                                        date: doc.data().dateTime.date,
                                                        time: doc.data().dateTime.time,
                                                        id: doc.id
                                                    })
                                                    return;
                                                }
                                            } else {
                                                if(parseInt(tempTime[1]) != parseInt(docTime[1])) {
                                                    if(parseInt(tempTime[1]) > parseInt(docTime[1])) {
                                                        temp.splice(i, 0, {
                                                            type: doc.data().type,
                                                            name: doc.data().name,
                                                            date: doc.data().dateTime.date,
                                                            time: doc.data().dateTime.time,
                                                            id: doc.id
                                                        });
                                                        return;
                                                    } else if (i == temp.length-1) {
                                                        temp.push({
                                                            type: doc.data().type,
                                                            name: doc.data().name,
                                                            date: doc.data().dateTime.date,
                                                            time: doc.data().dateTime.time,
                                                            id: doc.id
                                                        })
                                                        return;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            }
                        }
                    }
                
            })
            setDueDates(temp);
            //setLoading(false);
            
            
        }
        
        checkOpen();
    }, [props.dues, props.userEmail])

    const removeDueDate = async(id) => {
        const userRef = doc(db, "users", props.userEmail, "openItems", id);
        await updateDoc(userRef, {
            dueDate: null,
        });
        const dueRef = doc(db, "users", props.userEmail, "dueDateCollection", id);
        await deleteDoc(dueRef);

        props.updateDues(!props.dues);
        props.setDueChange(!props.dueChange)
      }


  return (
    <div className={open ? dueDates.length==0 ? 'w-[105%]' : 'pb-[20px] w-[105%]' : 'w-[105%]'}>
        <div onClick={() => {
            setOpen(!open);
            localStorage.setItem("dueOpen", !open);

        }} className=' w-[100%] h-[40px] flex items-center justify-center gap-[10px] border-b-[2px]  hover:border-[#c5c5c5] rounded-md cursor-pointer mb-[5px]'>
            <p className='text-[22px] font-thin select-none'>Due Soon</p>
            {
                open ?
                <KeyboardArrowDownIcon sx={{fontSize: '25px', marginTop: "3px"}} />
                :
                <KeyboardArrowRightIcon sx={{fontSize: '25px', marginTop: "3px"}} />
            }
        </div>
        <AnimatePresence>
        {
            open &&
        
            <m.div className='px-[10px]' initial={{
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
            }}>
         
                
                    {dueDates.map((dueDate) => {
                        return <DueDate  removeDueDate={removeDueDate} dueDate={dueDate} />
                    })}
            
        
        </m.div>
        
        }
        </AnimatePresence>
    </div>
  )
}

export default DueDatePanel

/*loading ? 
                    <div className='flex flex-col gap-[5px]'>
                        <div className='flex items-center justify-center gap-[10px]'>
                            <Skeleton sx={{}} variant="circular" width={26} height={26} />
                                <Skeleton sx={{marginLeft: "0px",}} variant="rounded" width={150} height="20px" />
                        </div>
                        <div className='flex items-center justify-center gap-[10px]'>
                        <Skeleton sx={{}} variant="circular" width={26} height={26} />
                                <Skeleton sx={{marginLeft: "0px",}} variant="rounded" width={150} height="20px" />
                        </div>
                        <div className='flex items-center justify-center gap-[10px]'>
                        <Skeleton sx={{}} variant="circular" width={26} height={26} />
                                <Skeleton sx={{marginLeft: "0px",}} variant="rounded" width={150} height="20px" />
                        </div>
                    </div>*/