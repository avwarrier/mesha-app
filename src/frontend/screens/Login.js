import {React, useState} from 'react'
import NavBarLogin from '../components/Nav/NavBarLogin'
import {motion as m } from "framer-motion"
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth, signInWithGoogle } from '../../backend/firebase';
import { useNavigate } from 'react-router-dom'
import ReactLoading from "react-loading";
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';

const Login = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password , setPassword] = useState('');
    const [invalidInfoEmail, setInvalidInfoEmail] = useState(false);
    const [shortPass, setShortPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [epInvalid, setepInvalid] = useState(false);
    const [passReset, setReset] = useState(false);

    const googleAuthLogin = async() => {
        await signInWithGoogle();
        navigate('/homepage');
    }


    const login = async() => {
        if(email === '') {
            setInvalidInfoEmail(true);
            setEmail('');
            if(password === '') {
                setShortPass(true);
                setPassword('');
                return;
            }
            return;
        }
        if(password === '') {
            setShortPass(true);
            setPassword('');
            return;
        }

        setShortPass(false);
        setInvalidInfoEmail(false);


        console.log(email + " " + password)
        setLoading(true);
            await signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                navigate("/homepage")
                console.log(user);
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage)
                setInvalidInfoEmail(true);
                setShortPass(true);
                setEmail('');
                setPassword('');
                setepInvalid(true)
            });
            setLoading(false);
           
    }

    const forgotPassword = async () => {
        try {
            setLoading(true);
            await sendPasswordResetEmail(auth, email);
            setReset(true);
          } catch (err) {
            console.error(err);
          }
          setLoading(false);
      }



    return (
        <div className='h-[100vh] bg-[#ffffff] '>
            <NavBarLogin started={false}/>
                <Collapse in={epInvalid}>
                    <Alert
                    severity='warning'
                    action={
                        <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={() => {
                            setepInvalid(false);
                        }}
                        >
                        <CloseIcon fontSize="inherit" />
                        </IconButton>
                    }
                    sx={{ mb: 2, position: 'absolute', width: "100%" }}
                    >
                    email or password invalid!
                    </Alert>
                </Collapse>
                <Collapse in={passReset}>
                    <Alert
                    severity='info'
                    action={
                        <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={() => {
                            setReset(false);
                        }}
                        >
                        <CloseIcon fontSize="inherit" />
                        </IconButton>
                    }
                    sx={{ mb: 2, position: 'absolute', width: "100%" }}
                    >
                    Password reset link sent!
                    </Alert>
                </Collapse>
            <m.div exit={{opacity: 0}} initial={{opacity: 0}} animate={{opacity: 1}}className='h-[370px] w-[400px] drop-shadow-md rounded-md bg-[#ffffff] mt-[15vh] m-auto flex flex-col items-center justify-center gap-[10px]'>
                {
                    loading ? 
                    <ReactLoading type="bubbles" color="#4a6a8f" />
                    :
                    <>
                <div className='flex items-center justify-between bg-white h-[50px] w-[300px] border-[1.5px] border-[#4a6a8f] rounded-xl cursor-pointer  hover:shadow-md' onClick={googleAuthLogin}>
                    <img alt='google' className='ml-[20px] h-[25px]' src='https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/2008px-Google_%22G%22_Logo.svg.png'/>
                    <p className='mr-[70px] font-light'>Sign-In With Google</p>
                </div>
                <p className='text-[#4a6a8f]'>_________________________</p>
                <div className='h-[210px] w-[300px] flex flex-col items-center justify-center gap-[15px] mt-[15px]'>
                    <input value={email} onChange={(e) => {
                        if(invalidInfoEmail) setInvalidInfoEmail(false);
                        setEmail(e.target.value)
                    }} placeholder='email' className={!invalidInfoEmail ? 'outline-none bg-[#eaeaea] font-light placeholder:font-thin placeholder:text-[#4a6a8f] h-[45px] w-[300px] p-[20px] rounded-xl' : 'outline-none bg-[#eaeaea] font-light placeholder:font-thin placeholder:text-red-700 h-[45px] w-[300px] p-[20px] rounded-xl border-red-400 border-2'}/>
                    <input value={password} onChange={(e) => {
                        if(shortPass) setShortPass(false);
                        setPassword(e.target.value)
                    }} placeholder='password' type="password" className={!shortPass ? 'outline-none bg-[#eaeaea] font-light placeholder:font-thin placeholder:text-[#4a6a8f] h-[45px] w-[300px] p-[20px] rounded-xl' : 'outline-none bg-[#eaeaea] font-light placeholder:font-thin placeholder:text-red-700 h-[45px] w-[300px] p-[20px] rounded-xl border-red-400 border-2'}/>
                    <p onClick={forgotPassword} className='cursor-pointer text-[13px]'>forgot password?</p>
                    <div onClick={login} initial={{opacity: 0}} animate={{opacity: 1}} className='bg-[#6a8099] h-[50px] w-[150px] flex items-center justify-center rounded-md cursor-pointer  hover:shadow-md hover:bg-[#4a6a8f]'>
                        <p className='text-[#ffffff]'>login</p>
                    </div>
                </div>
                </>
                }
                
            </m.div>
        </div>
        
  )
}

export default Login