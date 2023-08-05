import NavBar from "../components/Nav/NavBar";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../../backend/firebase';
import {useState, useEffect} from 'react'
import {  signOut } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import Binder from "../components/Binder/Binder";
import CentralDisplay from "../components/CentralDisplay/CentralDisplay";
import NotesPanel from "../components/NotesPanel/NotesPanel";
import Divider from '@mui/material/Divider';
import { db } from '../../backend/firebase'
import { collection, doc, updateDoc, getDoc } from "firebase/firestore";

function HomePage() {

  const navigate = useNavigate();
  const [centralInfo, setC] = useState({
    id: 'yee',
    name: ''
  });

  const [color, setColor] = useState('#fff');

  

  const setCentralInfo = (id, name) => {
    setC({
      name: name,
      id: id
    })
  }

  const [userInfo, setUserInfo] = useState({
    email: '',
    name: '',
    level: '',
    uid: '',
    items: []
  })

  const [userEmail, setUserEmail] = useState('');

  useEffect(()=>{
    onAuthStateChanged(auth, (user) => {
      console.log('erytime')
        if (user) {
          // User is signed in, see docs for a list of available properties
          // https://firebase.google.com/docs/reference/js/firebase.User
          setUserInfo({
            email: user.email,
            uid: user.uid,
            name: user.displayName,
            level: user.level,
            items: user.items
          })
          setUserEmail(user.email);
          // ...
          localStorage.setItem("userEmail", user.email);
          localStorage.setItem("letter", user.displayName);
          const saved = localStorage.getItem("name");
          const otherSaved = localStorage.getItem("id");
          console.log(otherSaved, "   ", saved);
          if(saved != null && otherSaved != null) {
            setC({
            id: otherSaved.substring(1, otherSaved.length-1),
            name: saved.substring(1, saved.length-1)
          })
          }
          console.log("uid", user.uid)
        } else {
          // User is signed out
          // ...
          console.log("user is logged out")
        }
      });
      
      
     
}, [])

useEffect(() => {
  const doit = async () => {
    if(userEmail == '' || userEmail == undefined || userEmail == '') return;
    const docRef = doc(db, "users", userEmail);
    const docSnap = await getDoc(docRef);
              if (docSnap.exists()) {
                  setColor(docSnap.data().color)
              } else {
                  // docSnap.data() will be undefined in this case
                  console.log("No such document!");
              }
  }
  doit();
}, [userEmail])

const [chan, setChan] = useState({});
const [dues, updateDues] = useState(false);
const [dueChange, setDueChange] = useState(false);
const [menuOpen, setMenuOpen] = useState(false);
const [noteChange, setNoteChange] = useState('');

const setColors = async(color) => {
  setColor(color);
  const userRef = doc(db, "users", userEmail);
    await updateDoc(userRef, {
        color: color
    })
}

  /*{
            menuOpen &&
            <div className='absolute bg-red-500 w-[180px] h-[100px] z-50 ml-[calc(100vw-200px)] '></div>
      }*/

  return (
    <div className="h-[100vh] bg-[#ffffff]">
      <NavBar setColors={setColors} color={color} menuOpen={menuOpen} setMenuOpen={setMenuOpen} userEmail={userEmail}/>
      
      <div className="flex justify-center items-center gap-[5px]">
          <Binder centralInfo={centralInfo} setNoteChange={setNoteChange} updateDues={updateDues} dues={dues} chan={chan} setCentralInfo={setCentralInfo}/>
          
          <CentralDisplay dueChange={dueChange} dues={dues} updateDues={updateDues} setChan={setChan} centralInfo={centralInfo} userEmail={userEmail} setC={setC}/>
          <NotesPanel noteChange={noteChange} dueChange={dueChange} setDueChange={setDueChange} updateDues={updateDues} userEmail={userEmail} dues={dues}/>

      </div>
      
    </div>
  );
}

export default HomePage;
