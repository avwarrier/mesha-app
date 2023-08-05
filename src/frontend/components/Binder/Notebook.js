import {React, useState, useEffect, forwardRef, useImperativeHandle, useRef} from 'react'
import NotebookItem from './BinderProps/NotebookItem'
import Note from './BinderProps/DocItems/Note';
import { v4 as uuid } from 'uuid';
import { auth, db } from '../../../backend/firebase'
import { collection, doc, setDoc, getDocs, collectionGroup, updateDoc, deleteDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const Notebook = forwardRef((props, ref) => {

    const [items, setItems] = useState([]);


    useImperativeHandle(ref, () => ({
        childFunction1(id) {
            if(id != props.id) return;
            let temp = [...items]
            for(let i = 0; i < items.length; i++) {
                    props.setCentralInfo('yee', 'yee');
                    props.setDocOpen('none');
                    delDoc(temp[i].id, temp[i].num);
                
            }
        },
      }));

    useEffect(() => {
        setItems(props.components);
        const checkOpen = async () => {
            const colRef = collection(db, "users", props.userEmail, "openItems");
            const docsSnap = await getDocs(colRef);
            let temp = props.components;
            docsSnap.forEach(doc => {
                console.log(doc.data());
                //doc.data().open
                
                if(temp.indexOf(doc.data().id) != -1) {
                    
                    temp[temp.indexOf(doc.data().id)].open = doc.data().open;
                }
            })
            setItems(temp);
        }
        
        //checkOpen();
    }, [props.components])

    useEffect(() => {
        
        let temp = [...items];
        for(let i = 0; i < temp.length; i++) {
            if(temp[i].id == props.chan.id) {
                temp[i].name = props.chan.name
            }
        }

        setItems(temp);
        props.setComponents(props.id, temp);
    }, [props.chan])

    useEffect(() => {
        let saved = localStorage.getItem("structId");
        if(saved != null) {
            saved = saved.substring(1, saved.length-1)
        }
        let temp = props.components;
        for(let i = 0; i < temp.length; i++) {
            if(temp[i].num >= 40) {
                if(temp[i].id != props.docOpen) {
                    if(temp[i].id != saved) {
                        temp[i].open = false;
                    }
                }
            }
        }
        setItems(temp);
        props.setComponents(props.id, temp);
    }, [props.docOpen])

    const addItem = (num) => {
        const myId = uuid();
        setItems(oldItems => [...oldItems, {
            type: 'note',
            name: 'default',
            num: 60,
            open: false,
            id: myId
        }]);


        console.log(items);
    }

    const updateDB = async(id, object) => {
        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
            ];
            let today = new Date();
            let date = monthNames[today.getMonth()] + " " + today.getDate() + ", " + today.getFullYear()
            let hour = today.getHours();
            let am = 'am';
            if(hour > 12) {
                am = 'pm';
                hour -= 12;
            } else if (hour == 0) {
                hour = 12;
            }
            let minute = '';
            if(today.getMinutes() < 10) {
                minute = '0' + today.getMinutes();
            } else {
                minute = today.getMinutes();
            }
            let time = hour + ":" + minute + "" + am;
        const userRef = doc(db, "users", props.userEmail, "openItems", id);
        await setDoc(userRef, {
            name: object.name,
            date: date,
            time: time,
            links: [],
            comments: [],
            description: '',
            type: object.type,
            open: true,
            id: id,
            dueDate: null
          });
          if(object.type == 'note') {
            const noteRef = doc(db, "users", props.userEmail, "openNotes", id);
        await setDoc(noteRef, {
            name: object.name,
            open: true,
            parentName: props.name,
            parentType: 'class'
          });
          }
          switchOpen(id, object.type);
    }


    const switchOpen = async (id, type) => {
        const colRef = collection(db, "users", props.userEmail, "openItems");
            const docsSnap = await getDocs(colRef);
            docsSnap.forEach(async dox => {
                if(id != dox.data().id) {
                    const userRef = doc(db, "users", props.userEmail, "openItems", dox.data().id);
                    await updateDoc(userRef, {
                        open: false,
                    });
                }
            })

            if(type == 60 || type == 'note') {
                const anothaRef = collection(db, "users", props.userEmail, "openNotes");
            const snape = await getDocs(anothaRef);
            snape.forEach(async dox => {
                if(id != dox.id) {
                    const userRef = doc(db, "users", props.userEmail, "openNotes", dox.id);
                    await updateDoc(userRef, {
                        open: false,
                    });
                }
            })
            }
            props.setComponents(props.id, items);
    }

    const changeName = async (paramName, id, type) => {
        const userRef = doc(db, "users", props.userEmail, "openItems", id);
        await updateDoc(userRef, {
            name: paramName,
          });
          if(type == 60) {
            const noteRef = doc(db, "users", props.userEmail, "openNotes", id);
        await updateDoc(noteRef, {
            name: paramName
          });
          }
    }

    const changeOpen = async (id, type) => {
        const userRef = doc(db, "users", props.userEmail, "openItems", id);
        await updateDoc(userRef, {
            open: true,
          });
          if(type == 60) {
            const noteRef = doc(db, "users", props.userEmail, "openNotes", id);
        await updateDoc(noteRef, {
            open: true
          });
          }
          switchOpen(id, type);
    }



    const setName = (id, prevName, name) => {
        let temp = [...items];
        for(let i = 0; i < temp.length; i++) {
            if(temp[i].id == id) {
                temp[i].name = name;
                    if(prevName == 'default') {
                        updateDB(temp[i].id, temp[i]);
                        props.setCentralInfo(temp[i].id, temp[i].name);
                        localStorage.setItem("structId", JSON.stringify(temp[i].id));
                        props.setDocOpen(temp[i].id);
                    } else {
                        changeName(temp[i].name, temp[i].id, temp[i].num);
                        props.setCentralInfo(temp[i].id, temp[i].name);
                        localStorage.setItem("structId", JSON.stringify(temp[i].id));
                        props.setDocOpen(temp[i].id);
                        switchOpen(temp[i].id, temp[i].num);
                    }
                    
            }
        }
        setItems(temp);
        props.setComponents(props.id, items);
    }

    const setPropOpen = (id, open) => {
        let temp = [...items];
        for(let j = 0; j < items.length; j++) {

                if(temp[j].id == id && temp[j].open == true) {
                    return;
                }
                if(temp[j].open == true) {
                    temp[j].open = false;
                }
        }
        for(let i = 0; i < items.length; i++) {
            if(temp[i].id == id) {
                temp[i].open = open;
                changeOpen(temp[i].id, temp[i].num)
                props.setCentralInfo(id, temp[i].name);
                localStorage.setItem("structId", JSON.stringify(id));
                props.setDocOpen(id);
            }
        }
        console.log(temp);
        setItems(temp);
        props.setComponents(props.id, items);
    }




    const delDoc = async (id, type) => {
        await deleteDoc(doc(db, "users", props.userEmail, "openItems", id));
        if(type == 60) {
            await deleteDoc(doc(db, "users", props.userEmail, "openNotes", id))
          }
    }


    const removeSubItem = (id) => {
        let temp = [...items];
        for(let i = 0; i < items.length; i++) {
            if(temp[i].id == id) {
                if(temp[i].name != 'default') {
                    console.log(props.centralInfo + "   " + id)
                    if(props.centralInfo.id == id) {
                    props.setCentralInfo('yee', 'yee');
                props.setDocOpen('none');
                    }
                }
                let numz = temp[i].num
                temp.splice(i, 1);
                localStorage.setItem("descriptC", "blank");
                delDoc(id, numz);
                break;
            }
        }
        setItems(temp);
        console.log(temp);
        props.setComponents(props.id, temp);
    }

  return (
    <div className='flex flex-col'>
        <NotebookItem inputColor={props.inputColor} dropColor={props.dropColor} selectionColor={props.selectionColor} id={props.id} open={props.open} setOpen={props.setPropOpen} addItem={addItem} removeItem={props.removeItem} setName={props.setName} name={props.name}/>
        {props.open && 
            <div className={items.length > 0 ? 'ml-[20px] my-[5px]' : "ml-[20px]"}>
                {
                    items.map((item) => {
                        return <Note inputColor={props.inputColor} dropColor={props.dropColor} selectionColor={props.selectionColor} id={item.id} setPropOpen={setPropOpen} open={item.open} removeItem={removeSubItem} setName={setName} name={item.name}/>
                    })
                }
            </div>  
        }
    </div>
  )
})

export default Notebook