"use client";

import {  ReactNode, useEffect } from "react";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
import firebase from "@/util/firebaseClient";



export default function FirebaseInitializer({ children ,$appCheckKey}: {children:ReactNode,$appCheckKey?:string}) {
    
    useEffect(() => {
    initializeAppCheck(firebase, {
        provider: new ReCaptchaV3Provider($appCheckKey as string),
    });
    }, []);

    return <>{children}</>;
}
