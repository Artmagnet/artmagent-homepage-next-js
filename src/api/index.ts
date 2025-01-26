import firebase from "@/util/firebase";
import { getDatabase } from "firebase/database";

export const database = getDatabase(firebase);
