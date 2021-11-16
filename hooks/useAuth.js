import React, { createContext, useContext, useState, useEffect, useMemo } from 'react'
import * as Google from 'expo-google-app-auth';
import { signInWithCredential, GoogleAuthProvider, onAuthStateChanged, signOut } from "@firebase/auth";
import { auth } from '../firebase';

const AuthContext = createContext({})
// 789907037104-i065j4u9nsehlnagvbmd16kqb23skshn.apps.googleusercontent.com

const config = {
    androidClientId: '832183223189-0ab7hms6kl602gq68hj54sptb2klqemd.apps.googleusercontent.com',
    scopes: ["profile", "email"],
    Permissions: ["public_profile", "email", "gender", "location"]
}

export const AuthProvider = ({ children }) => {

    const [err, setErr] = useState(null);
    const [user, setUser] = useState(null);
    const [loadingInitial, setLoadingInitial] = useState(true);
    const [loading,setLoading] = useState(false)


    useEffect(() => {

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user)
            }
            else {
                setUser(null)
            }
            setLoadingInitial(false);
        })
        return unsubscribe;
    }, [])

    const signInWithGoogle = async () => {
        setLoading(true)
        await Google.logInAsync(config).then(async (logInResult) => {
            if (logInResult.type === 'success') {

                const { idToken, accessToken } = logInResult;
                const credential = GoogleAuthProvider.credential(idToken, accessToken);
                await signInWithCredential(auth, credential)
            }

            return Promise.reject();


        }).catch((err) => setErr(err))
        .finally(() => setLoading(false));
    }

    const logOut = () => {
        setLoading(true);

        signOut(auth).catch((err) => setErr(err)).finally(() => setLoading(true))
    }

    const memoedValue = useMemo(()=> ({
        user, signInWithGoogle,loading,logOut
    }),[user,loading])

    return (
        <AuthContext.Provider value={memoedValue}>
            {!loadingInitial && children}
        </AuthContext.Provider>
    );
};


export default function useAuth() {
    return useContext(AuthContext)
}
