// import { useHistory } from 'react-router-dom';
import { useEffect, useState, createContext, ReactNode } from "react";
import { auth, firebase } from "../services/firebase";

type User = {
    id: string;
    name: string,
    avatar: string;
}

type AuthContextType = {
    user: User | undefined;
    signInWithGoogle: () => Promise<void>;
    signInWithGithub: () => Promise<void>;
    signOut: () => Promise<void>;
}

type AuthContextProviderProps = {
    children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextType);

export function AuthContextProvider(props: AuthContextProviderProps) {

    const [user, setUser] = useState<User>();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                const { displayName, photoURL, uid } = user

                if (!displayName || !photoURL) {
                    throw new Error('Missing information from Google Account.')
                }

                setUser({
                    id: uid,
                    name: displayName,
                    avatar: photoURL
                });
            }
        })

        return () => {
            unsubscribe();
        }
    }, [])


    async function signInWithGithub() {
        const provider = new firebase.auth.GithubAuthProvider();

        const result = await auth.signInWithPopup(provider);
        
        if (result.credential) {
            var token = result.credential.providerId;
            console.log(token)
        }   
        var user = result.user;
        console.log(user)
    }

    async function signInWithGoogle() {
        const provider = new firebase.auth.GoogleAuthProvider();

        const result = await auth.signInWithPopup(provider)

        if (result.user) {
            const { displayName, photoURL, uid } = result.user

            if (!displayName || !photoURL) {
                throw new Error('Missing information from Google Account.')
            }

            setUser({
                id: uid,
                name: displayName,
                avatar: photoURL
            })
        }
    }

    async function signOut() {
        await auth.signOut()

        setUser(undefined)
    }

    return (
        <AuthContext.Provider value={{ user, signInWithGoogle, signInWithGithub, signOut }}>
            {props.children}
        </AuthContext.Provider>
    );
}