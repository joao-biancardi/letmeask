import { FormEvent, useState } from 'react'
import { Link, useHistory } from 'react-router-dom';

import illustrationImg from '../../assets/images/illustration.svg';
import logoImg from '../../assets/images/logo.svg';
import logoWhite from '../../assets/images/logoWhite.svg';

import { Button } from '../../components/Button';
import { ButtonDarkMode } from '../../components/ButtonDarkMode';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { database } from '../../services/firebase';
import { notify } from '../../utils/notify'

import '../Home/styles.scss';

export function NewRoom() {
    const { user } = useAuth();
    const history = useHistory();
    const { theme } = useTheme();
    const [newRoom, setNewRoom] = useState('')

    async function handleCreateRoom(event: FormEvent) {
        event.preventDefault();

        if (newRoom.trim() === '') {
            return;
        }

        const roomRef = database.ref('rooms');

        const firebaseRoom = await roomRef.push({
            title: newRoom,
            authorId: user?.id,
        })

        notify('success', 'successfully created room!')
        history.push(`/admin/rooms/${firebaseRoom.key}`)
    }

    return (
        <div id="page-auth" className={theme}>
            <aside>
                <img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas" />
                <strong>Crie salas de Q&amp;A ao-vivo</strong>
                <p>Tire as dúvidas da sua audiência em tempo-real</p>
            </aside>

            <main>
                <ButtonDarkMode />
                <div className="main-content">
                    {theme === 'light' ? (
                        <img src={logoImg} alt="Letmeask" />
                    ) : (
                        <img src={logoWhite} alt="Letmeask" />
                    )}
                    <h2>Criar uma nova sala</h2>
                    <div className="separator">ou entre em uma sala</div>
                    <form onSubmit={handleCreateRoom}>
                        <input
                            type="text"
                            placeholder="Nome da sala"
                            onChange={event => setNewRoom(event.target.value)}
                            value={newRoom}
                        />
                        <Button type="submit">
                            Criar sala
                        </Button>
                    </form>
                    <p>
                        Quer entrar em uma sala existente? <Link to="/">Clique aqui</Link>
                    </p>
                </div>
            </main>
        </div>
    )
}