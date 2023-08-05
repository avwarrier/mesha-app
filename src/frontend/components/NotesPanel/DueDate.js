import React, { useEffect, useState } from 'react'
import docsLogo from '../../assets/docsLogo.png'
import LinkIcon from '@mui/icons-material/Link';
import NotesIcon from '@mui/icons-material/Notes';
import { styled } from '@mui/material/styles';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import CheckIcon from '@mui/icons-material/Check';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import {motion as m } from "framer-motion"

const BootstrapTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} arrow classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.arrow}`]: {
      color: "#444",
    },
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: "#444",
    },
  }));

  
  

const DueDate = (props) => {

   

    const [displayName, setDisplayName] = useState('');
    const [dueIn, setDueIn] = useState('');
    const [dueLevel, setDueLevel] = useState('');

    useEffect(() => {
        if(props.dueDate.name.length >= 14) {
            setDisplayName(props.dueDate.name.substring(0, 11) + '...')
        } else {
            setDisplayName(props.dueDate.name);
        }
    }, [props.dueDate.name])

    useEffect(() => {
        const monthNames = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
                ];
                let propDate = props.dueDate.date.split('/')
                let propAm = props.dueDate.time.substring(props.dueDate.time.length-2);
                let d = props.dueDate.time.substring(0, props.dueDate.time.length-2)
                let propHour = d.split(':')[0];
                let propMinute = d.split(':')[1];
                let today = new Date();
                console.log(today.getDate() + ' ' + today.getMonth() + today.getFullYear().toString().substring(2))
                

                let hour = today.getHours();
                let am = 'am';
                if(hour > 12) {
                    am = 'pm';
                    hour -= 12;
                } else if (hour == 0) {
                    hour = 12;
                }
                let minute = today.getMinutes();
               
                



                if(propDate[2] != today.getFullYear().toString().substring(2)) {
                    if(propDate[2] < today.getFullYear().toString().substring(2)) {
                        setDueLevel('#cc5e5e');
                        return;
                    }
                    const num = parseInt(propDate[2]) - parseInt(today.getFullYear().toString().substring(2));
                    if(num == 1) setDueIn(num + " year")
                    else setDueIn(num + " years")
                    
                    
                } else if (propDate[0] != today.getMonth() + 1) {
                    if(propDate[0] < today.getMonth()+1) {
                        setDueLevel('#cc5e5e');
                        return;
                    }
                    const num = parseInt(propDate[0]) - (today.getMonth()+1);
                    if(num == 1) setDueIn(num + " month")
                    else setDueIn(num + " months")
                } else if (propDate[1] != today.getDate()) {
                    if(propDate[1] < today.getDate()) {
                        setDueLevel('#cc5e5e');
                        return;
                    }
                    const num = parseInt(propDate[1]) - (today.getDate());
                    if(num == 1) {
                        setDueIn('tomorrow')
                        setDueLevel('#ffaa6e');
                        return;
                    }
                    else setDueIn(num + " days")
                    if(num <= 3) {
                        setDueLevel('#ffc670')
                    } else {
                        setDueLevel("#f4f4f4")
                    }
                } else if (propAm == 'am' && am == 'pm') {
                    setDueLevel('#cc5e5e');
                    return;
                } else if (propAm == 'pm' && am == 'am') {
                    setDueLevel('#ff8469');
                    const num = (12 + parseInt(propHour)) - (hour);
                    if(num == 1) setDueIn(num + ' hour');
                    else setDueIn(num + ' hours');
                } else if (propAm == am) {
                    setDueLevel('#ff8469');
                    if(propHour != hour) {
                        if(parseInt(propHour) < hour) {
                            setDueLevel('#cc5e5e');
                            return;
                        }
                        const num = parseInt(propHour) - (hour);
                        if(num == 1) setDueIn(num + ' hour');
                        else setDueIn(num + ' hours');
                    } else if (propMinute != minute) {
                        if(parseInt(propMinute) < minute) {
                            setDueLevel('#cc5e5e');
                            return;
                        }
                        const num = parseInt(propMinute) - (minute);
                        if(num == 1) setDueIn(num + ' min');
                        else setDueIn(num + ' mins');
                    }
                }
                
      }, [props.dueDate])

      

  return (
    <BootstrapTooltip arrow  title={props.dueDate.date + " " +  props.dueDate.time} placement='left'><div  style={{backgroundColor: dueLevel}} className=' w-[100%] h-[45px] flex items-center justify-between'>
        <p className='ml-[10px] mr-[5px] text-[15px] w-[60px]'>{dueLevel == '#cc5e5e' ? 'overdue' : dueIn}</p>
        <div className='flex items-center gap-[1px] w-[120px] justify-start'>
            {
                props.dueDate.type == 'document' ?
                <img className='h-[18px] items-center justify-center flex' src={docsLogo}/>
                :
                    props.dueDate.type == 'link' ?
                    <LinkIcon  sx={{fontSize: '20px', color: "#c41a0e", marginTop: '5px'}}/>
                    :
                    <NotesIcon  sx={{fontSize: '20px', color: "#222"}}/>
            }
            <p className=''>{displayName}</p>
            
        </div>
        <div onClick={() => {
            setDueLevel('#93ff91')
            props.removeDueDate(props.dueDate.id)
            
        }} className='mr-[8px] flex justify-center items-center w-[21px] h-[21px] shadow-md cursor-pointer rounded-xl'>
            <CheckIcon sx={{fontSize: "17px"}}/>
        </div>
    </div></BootstrapTooltip>
  )
}

export default DueDate