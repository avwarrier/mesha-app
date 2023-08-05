import {React, useState} from 'react'
import NavBarLogin from '../components/Nav/NavBarLogin'
import {motion as m } from "framer-motion"
import {  createUserWithEmailAndPassword  } from 'firebase/auth';
import { auth, registerWithEmailAndPassword, signInWithGoogle, db } from '../../backend/firebase'
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from "firebase/firestore";
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import ReactLoading from "react-loading";


const GetStarted = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password , setPassword] = useState('');
    const [invalidInfoEmail, setInvalidInfoEmail] = useState(false);
    const [shortPass, setShortPass] = useState(false);
    const [userExists, setUserExists] = useState(false);
    const [loading, setLoading] = useState(false);
    const [firebaseErr, setFirebaseErr] = useState(false);

    const googleAuthSignUp = async() => {
        await signInWithGoogle();
        navigate('/completeprofile');
    }

    const signUp = async() => {
        if(email === '') {
            setInvalidInfoEmail(true);
            setEmail('');
            if(password.length < 8) {
                setShortPass(true);
                setPassword('');
                return;
            }
            return;
        }
        if(password.length < 8) {
            setShortPass(true);
            setPassword('');
            return;
        }

        setShortPass(false);
        setInvalidInfoEmail(false);
        setLoading(true);
        const docRef = doc(db, "users", email);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            setEmail("");
            setPassword("");
            setUserExists(true);
            return;
        } else {
        // docSnap.data() will be undefined in this case
        console.log("No such document!");
        }
        
        registerWithEmailAndPassword("", email, password, navigate)
        

        setLoading(false);
    }


    return (
        
        <div className='h-[100vh] bg-[#ffffff] '>
            <NavBarLogin started={true}/>
            <Collapse in={userExists}>
                    <Alert
                    severity='error'
                    action={
                        <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={() => {
                            setUserExists(false);
                        }}
                        >
                        <CloseIcon fontSize="inherit" />
                        </IconButton>
                    }
                    sx={{ mb: 2, position: 'absolute', width: "100%" }}
                    >
                    user already exists
                    </Alert>
                </Collapse>
                <Collapse in={firebaseErr}>
                    <Alert
                    severity='error'
                    action={
                        <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={() => {
                            setFirebaseErr(false);
                        }}
                        >
                        <CloseIcon fontSize="inherit" />
                        </IconButton>
                    }
                    sx={{ mb: 2, position: 'absolute', width: "100%" }}
                    >
                    invalid email
                    </Alert>
                </Collapse>
            <m.div exit={{opacity: 0}} initial={{opacity: 0}} animate={{opacity: 1}}className='h-[350px] w-[400px] drop-shadow-md rounded-md bg-[#ffffff] mt-[15vh] m-auto flex flex-col items-center justify-center gap-[10px]'>
            {
                    loading ? 
                    <ReactLoading type="bubbles" color="#4a6a8f" />
                    :
                    <>
                <div className='flex items-center justify-between bg-white h-[50px] w-[300px] border-[1.5px] border-[#4a6a8f] rounded-xl cursor-pointer hover:shadow-md' onClick={googleAuthSignUp}>
                    <img alt='google' className='ml-[20px] h-[25px]' src='https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/2008px-Google_%22G%22_Logo.svg.png'/>
                    <p className='mr-[70px] font-light'>Sign-Up With Google</p>
                </div>
                <p className='text-[#4a6a8f]'>_________________________</p>
                <div className='h-[180px] w-[300px] flex flex-col items-center justify-center gap-[20px] mt-[15px]'>
                    <input value={email} onChange={(e) => {
                        if(invalidInfoEmail) setInvalidInfoEmail(false);
                        setEmail(e.target.value)
                        setUserExists(false);
                    }} placeholder='email' className={invalidInfoEmail || userExists ? 'outline-none bg-[#eaeaea] font-light placeholder:font-thin placeholder:text-red-700 h-[45px] w-[300px] p-[20px] rounded-xl border-red-400 border-2' : 'outline-none bg-[#eaeaea] font-light placeholder:font-thin placeholder:text-[#4a6a8f] h-[45px] w-[300px] p-[20px] rounded-xl'}/>
                    
                    <input value={password} onChange={(e) => {
                        if(shortPass) setShortPass(false);
                        setPassword(e.target.value)
                    }} placeholder={!shortPass ? 'password (8 characters)' : 'must be 8 or more characters'} type="password" className={shortPass || userExists ? 'outline-none bg-[#eaeaea] font-light placeholder:font-thin placeholder:text-red-700 h-[45px] w-[300px] p-[20px] rounded-xl border-red-400 border-2' : 'outline-none bg-[#eaeaea] font-light placeholder:font-thin placeholder:text-[#4a6a8f] h-[45px] w-[300px] p-[20px] rounded-xl' }/>
                    <div onClick={signUp} initial={{opacity: 0}} animate={{opacity: 1}} className='bg-[#6a8099] h-[50px] w-[150px] flex items-center justify-center rounded-md cursor-pointer  hover:shadow-md hover:bg-[#4a6a8f]'>
                        <p className='text-[#ffffff]'>Sign Up</p>
                    </div>
                </div>
                </>
                }
            </m.div>
        </div>
  )
}

export default GetStarted