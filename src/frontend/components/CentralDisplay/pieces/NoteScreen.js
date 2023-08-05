import {React, useEffect, useState, useCallback, useRef} from 'react'
import "quill/dist/quill.snow.css"
import Quill from "quill"
import './styles.css'
import { auth, db } from '../../../../backend/firebase'
import { collection, doc, setDoc, getDoc, collectionGroup, updateDoc, deleteDoc } from "firebase/firestore";

const NoteScreen = (props) => {
    const [name, setName] = useState('');

    useEffect(() => {
        setName(props.name);
    }, [props.name])



    const doSumn = async(name) => {
        
        const userRef = doc(db, "users", props.userEmail, "openItems", props.id);
            await updateDoc(userRef, {
                name: name
        });
        props.setChan({
        id: props.id,
        name: name
        });
    }

    

    var Size = Quill.import('attributors/style/size');
    Size.whitelist = ['14px', '16px', '18px'];
    Quill.register(Size, true);
    let Font = Quill.import('formats/font');
// We do not add Sans Serif since it is the default
    Font.whitelist = ['calibri', 'futura', 'impact', 'courier', 'comic', 'times-new-roman', 'arial'];
    Quill.register(Font, true);

    const TOOLBAR_OPTIONS = [
        [{ 'size': ['14px', '16px', '18px'] }],
        [{ font: ['calibri', 'futura', 'impact', 'courier', 'comic', 'times-new-roman', 'arial'] }],
        [{ list: "ordered" }, {list: "bullet" }],
        ["bold", "italic", "underline"],
        [{ color: [] }, {background: [] }],
        ["image", "blockquote", "code-block"],
        
      ]

     
    
      const wrapperRef = useCallback((wrapper) => {
        if(wrapper == null) return;
        wrapper.innerHTML = '';
        const editor = document.createElement('div');
        wrapper.append(editor)
        const q = new Quill(editor, { theme: "snow", modules: {toolbar: TOOLBAR_OPTIONS } })
        setQuill(q);
      }, [])

      const [quill, setQuill] = useState();

      useEffect(() => {
        if(quill == null || props.userEmail == '') return;
        const handler = async (delta, oldDelta, source) => {
            if(source !== 'user') return;
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
        if(quill == null || props.userEmail == '' || props.id == 'yee') {
            
            return;
              
        }
        const getStuff = async () => {
            const docRef = doc(db, "users", props.userEmail, "openItems", props.id);
            const docSnap = await getDoc(docRef);
            console.log(docSnap.data().description)
            quill.setContents(docSnap.data().description);
        }

        getStuff();
        
      }, [quill, props.id])

      


  return (
    <div className='bg-[#ffffff] h-[calc(100vh-70px)] pt-[10px] w-[680px] rounded-md flex-col flex'>
            <input  onKeyDown={props.handleEnter} value={props.name} onChange={(e) => {
              doSumn(e.target.value)
              props.setName(e.target.value)
            }} className='h-[40px] bg-[#ffffff] border-[#b8b8b8] border-[1px] w-[300px] outline-none rounded-md px-[15px] text-[23px] mt-[10px] mb-[10px] ml-[22.75px] font-light' />
            <div className='w-[93%] h-[65vh] ml-[22.75px]'>
              <div ref={wrapperRef} id='container' className='resize-none outline-none rounded-b-md ' />
            </div>
      </div>
  )
}

export default NoteScreen