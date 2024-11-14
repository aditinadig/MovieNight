import { db } from "../../firebaseConfig";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";

const bingoTasksCollectionRef = collection(db, "bingo_tasks");

export const fetchBingoTasks = async () => {
  const snapshot = await getDocs(bingoTasksCollectionRef);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const addBingoTask = async (taskData) => {
  const docRef = await addDoc(bingoTasksCollectionRef, taskData);
  return { id: docRef.id, ...taskData };
};

export const updateBingoTask = async (id, updatedData) => {
  const docRef = doc(db, "bingo_tasks", id);
  await updateDoc(docRef, updatedData);
};

export const deleteBingoTask = async (id) => {
  const docRef = doc(db, "bingo_tasks", id);
  await deleteDoc(docRef);
};