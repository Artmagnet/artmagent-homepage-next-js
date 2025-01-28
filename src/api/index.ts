import firebase from "@/util/firebaseClient";
import { getDatabase } from "firebase/database";

export const database = getDatabase(firebase);
