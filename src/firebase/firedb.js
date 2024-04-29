import firebaseApp from "./firebaseApp";
import { getFirestore } from 'firebase/firestore/lite';
const db = getFirestore(firebaseApp);
export default db;