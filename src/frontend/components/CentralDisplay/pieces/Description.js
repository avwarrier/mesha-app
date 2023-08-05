import React, { useEffect, useState, useRef, useCallback } from 'react'
import "quill/dist/quill.bubble.css"
import Quill from "quill"
import './styledesc.css'
import { auth, db } from '../../../../backend/firebase'
import { collection, doc, setDoc, getDoc, collectionGroup, updateDoc, deleteDoc } from "firebase/firestore";

const Description = (props) => {

    
    const [notes, setNotes] = useState('');
    const ref = useRef(null);
    const divref = useRef(null);
    const [editing, setEditing] = useState(true);
    
    const [quill, setQuill] = useState();

    const wrapperRef = useCallback((wrapper) => {
      if(wrapper == null) return;
      wrapper.innerHTML = '';
      const editor = document.createElement('div');
      wrapper.append(editor)
      const q = new Quill(editor, { theme: "bubble"})
      setQuill(q);
      
    }, [])

    
    

    useEffect(() => {
      if(quill == null || props.userEmail == null) return;
      const handler = async (delta, oldDelta, source) => {
          if(source !== 'user') return;
          setEditing(false);
          let x = quill.getContents().ops;
          const userRef = doc(db, "users", props.userEmail, "openItems", props.id);
          await updateDoc(userRef, {
              description: x,
          });
      }

      quill.on('text-change', handler)

      return () => {
          quill.off('text-change', handler)
      }
    }, [quill, props.id])

    useEffect(() => {
      
      if(quill == null || props.userEmail == '') {
          
          return;
            
      }
      const getStuff = async () => {
          const docRef = doc(db, "users", props.userEmail, "openItems", props.id);
          const docSnap = await getDoc(docRef);
          if(docSnap._document == null) return;
          console.log(docSnap.data().description)
          quill.setContents(docSnap.data().description);
      }

      getStuff();
      
    }, [quill, props.id])


  return (
      <div ref={divref} className=' w-[400px] h-[27vh] '>
        {
          quill == null && <p className='absolute ml-[14px] mt-[7px] z-50 font-light'>notes</p>
        }
        <div  ref={wrapperRef} id='container2' className='resize-none outline-none rounded-b-md ' />
        
      </div>
      
      
  )
}

export default Description
/*<textarea ref={ref} value={notes} onChange={(e) => {
            setNotes(e.target.value);
            localStorage.setItem("notes", JSON.stringify(e.target.value));
        }}  placeholder='Notes' className='h-[100%] w-[100%] p-[10px] resize-none outline-none bg-[#eaeaea] placeholder:text-[#6d6b69] placeholder:font-light rounded-md border-b-[2px] border-[#4a6a8f] whitespace-pre-line'/>*/