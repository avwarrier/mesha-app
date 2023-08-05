import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth";
import {
    GoogleAuthProvider,
    signInWithPopup,
    createUserWithEmailAndPassword,
} from "firebase/auth"
import {
    query,
    getDocs,
    collection,
    where,
    doc,
    setDoc
} from "firebase/firestore"
import {
  getStorage
} from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyBxRDSWPnVLYdonfiVCKKgwY5dG6HPBGrY",
  authDomain: "mesha-7d338.firebaseapp.com",
  projectId: "mesha-7d338",
  storageBucket: "mesha-7d338.appspot.com",
  messagingSenderId: "420548524708",
  appId: "1:420548524708:web:a25f023dc9b0d37dc18431",
  measurementId: "G-FH5QGJWGCW"
};

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const auth = getAuth(app);
const storage = getStorage(app);

const googleProvider = new GoogleAuthProvider();
const signInWithGoogle = async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      const user = res.user;
      const q = query(collection(db, "users"), where("uid", "==", user.uid));
      const docs = await getDocs(q);
      if (docs.docs.length === 0) {
        await setDoc(doc(db, "users", user.email), {
          uid: user.uid,
          name: user.displayName,
          authProvider: "google",
          email: user.email,
          level: 'default',
          items: [],
          color: "#4a6a8f"
        });
      }
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const registerWithEmailAndPassword = async (name, email, password, navigate) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const user = res.user;
      await setDoc(doc(db, "users", email), {
        uid: user.uid,
        name,
        authProvider: "local",
        email,
        level: 'default',
        items: [],
        color: "#4a6a8f"
      });
      
      navigate('/completeprofile');
    } catch (err) {
      console.error(err);
      alert(err)
    }
  };




export {
    auth,
    db,
    storage,
    signInWithGoogle,
    registerWithEmailAndPassword,
  };