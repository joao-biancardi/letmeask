import { useHistory } from 'react-router-dom';
import { FormEvent, useState } from 'react';

import { database } from '../../services/firebase';

import illustrationImg from '../../assets/images/illustration.svg';
import logoImg from '../../assets/images/logo.svg';
import googleIconImg from '../../assets/images/google-icon.svg';
import githubIconImg from '../../assets/images/github.svg';

import { Button } from '../../components/Button';
import { useAuth } from '../../hooks/useAuth';
import { notify } from '../../utils/notify'

import { useTheme } from '../../hooks/useTheme';

import './styles.scss';

export function Home() {
    const history = useHistory();
    const { user, signInWithGoogle } = useAuth();
    const { theme, toggleTheme } = useTheme();
    // const { user, signInWithGithub } = useAuth();
    const [roomCode, setRoomCode] = useState('');

    // async function handleCreateRoomGithub() {
    //     if (!user) {
    //         await signInWithGithub();
    //     }
    // }

    async function handleCreateRoom() {
        if (!user) {
            await signInWithGoogle();
        }

        history.push('/rooms/new');
        notify('success', 'successful authentication!');
    }

    async function handleJoinRoom(event: FormEvent) {
        event.preventDefault();

        if (roomCode.trim() === '') {
            return;
        }

        const roomRef = await database.ref(`rooms/${roomCode}`).get();

        if (!roomRef.exists()) {
            notify('error', 'Room does not exists.')
            return;
        }

        if (roomRef.val().endedAt) {
            notify('error', 'Room already closed.')
            return;
        }

        notify('success', 'entered successfully!')
        history.push(`rooms/${roomCode}`)
    }

    function signInGithub() {
        notify('error', 'authentication with github is currently disabled.')
        return;
    }

    return (
        <div id="page-auth" className={theme}>
            <aside>
                <img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas" />
                <strong>Crie salas de Q&amp;A ao-vivo</strong>
                <p>Tire as dúvidas da sua audiência em tempo-real</p>
            </aside>

            <main>
                <div className="main-content">
                    <button className="toggle-theme" onClick={toggleTheme}>Dark</button>
                    <img src={logoImg} alt="Letmeask" />
                    <button onClick={handleCreateRoom} className="create-room">
                        <img src={googleIconImg} alt="Logo do Google" />
                        Crie sua sala com o Google
                    </button>
                    <button onClick={signInGithub} className="create-room" id="github">
                        <img src={githubIconImg} alt="Logo do Github" />
                        Crie sua sala com o Github
                    </button>
                    <div className="separator">ou entre em uma sala</div>
                    <form onSubmit={handleJoinRoom}>
                        <input
                            type="text"
                            placeholder="Digite o código da sala"
                            onChange={event => setRoomCode(event.target.value)}
                            value={roomCode}
                        />
                        <Button type="submit">
                            Entrar na sala
                        </Button>
                    </form>
                </div>
            </main>
        </div>
    )
}