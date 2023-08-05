import {React, useEffect, useState} from 'react'
import NavBarLogin from '../components/Nav/NavBarLogin'
import {motion as m } from "framer-motion"
import { auth, db } from '../../backend/firebase'
import { collection, doc, updateDoc } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { onAuthStateChanged } from "firebase/auth";

const CompleteProfile = () => {
    const navigate = useNavigate();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [level, setLevel] = useState('');

    const [userInfo, setUserInfo] = useState({
        email: '',
        name: '',
        level: '',
        uid: ''
      })


    const updateDB = async() => {
        console.log(userInfo.email)
        const userRef = doc(db, "users", userInfo.email);
        await updateDoc(userRef, {
            name: firstName + lastName,
            level: level
        })
        navigate("/homepage")
    }

    useEffect(()=>{
        const getInfo = async() => {
            onAuthStateChanged(auth, (user) => {
                console.log(user.displayName)
                if(user.displayName != null){
                const names = user.displayName.split(" ");
                setFirstName(names[0]);
                setLastName(names[1]);
                }
                setUserInfo({
                    email: user.email,
                    uid: user.uid,
                    name: user.displayName,
                    level: user.level
                  })
            });
            
          }

          getInfo();
          
         
    }, [])

    
  return (
    <div className='h-[100vh] bg-[#ffffff] '>
            <NavBarLogin started={true}/>
            <m.div exit={{opacity: 0}} initial={{opacity: 0}} animate={{opacity: 1}}className='h-[320px] w-[400px] drop-shadow-md rounded-md bg-[#ffffff] mt-[15vh] m-auto flex flex-col items-center justify-center gap-[20px]'>
                
                    <input value={firstName} onChange={(e) => {
                        setFirstName(e.target.value)
                    }} placeholder='First Name' className='outline-none border-[1.5px] border-[#4a6a8f] bg-[#ffffff] font-light placeholder:font-thin placeholder:text-[#000] h-[50px] w-[300px] p-[20px] rounded-md' />
                    
                    <input value={lastName} onChange={(e) => {
                        setLastName(e.target.value)
                    }} placeholder='Last Name' className='outline-none border-[1.5px] border-[#4a6a8f] bg-[#ffffff] font-light placeholder:font-thin placeholder:text-[#000] h-[50px] w-[300px] p-[20px] rounded-md'/>

                    <FormControl sx={{width: "300px", color: "#4a6a8f"}}>
                        <InputLabel >Level</InputLabel>
                        <Select
                            
                            labelId="level-label"
                            value={level}
                            label="Level"
                            onChange={(e) => setLevel(e.target.value)}
                            >
                            <MenuItem  value={10}>Student</MenuItem>
                            <MenuItem  value={20}>Teacher</MenuItem>
                            <MenuItem value={30}>Teaching Assistant</MenuItem>
                        </Select>
                    </FormControl>

                    <div onClick={updateDB}  initial={{opacity: 0}} animate={{opacity: 1}} className='bg-[#6a8099] h-[50px] w-[150px] flex items-center justify-center rounded-md cursor-pointer  hover:shadow-md hover:bg-[#4a6a8f]'>
                        <p className='text-[#ffffff]'>Continue</p>
                    </div>
                
            </m.div>
        </div>
  )
}

export default CompleteProfile