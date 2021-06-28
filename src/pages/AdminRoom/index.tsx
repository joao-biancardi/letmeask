import { useHistory, useParams } from 'react-router-dom'
import { Fragment } from 'react';

import Modal from 'react-modal';

import emptyImg from '../../assets/images/empty-questions.svg';
import logoImg from '../../assets/images/logo.svg';
import logoWhite from '../../assets/images/logoWhite.svg';
import deleteImg from '../../assets/images/delete.svg';
import checkImg from '../../assets/images/check.svg';
import answerImg from '../../assets/images/answer.svg';

import { Button } from '../../components/Button';
import { Question } from '../../components/Question';
import { RoomCode } from '../../components/RoomCode';
// import { useAuth } from '../hooks/useAuth';
import { useRoom } from '../../hooks/useRoom';
import { useTheme } from '../../hooks/useTheme';
import { database } from '../../services/firebase';
import { notify } from '../../utils/notify';

import { useState } from 'react';

import './styles.scss';
import { useAuth } from '../../hooks/useAuth';

type RoomParams = {
    id: string;
}

export function AdminRoom() {
    const { user } = useAuth();
    const { theme } = useTheme();
    const history = useHistory()
    const params = useParams<RoomParams>();
    const roomId = params.id;
    const [questionIdModalOpen, setQuestionIdModalOpen] = useState<string | undefined>()

    const { title, questions } = useRoom(roomId);

    async function handleEndRoom() {
        notify('success', 'room successfully closed!')
        await database.ref(`rooms/${roomId}`).update({
            endedAt: new Date(),
        })

        history.push('/');
    }

    async function handleDeleteQuestion(questionId: string) {
        if (window.confirm('Tem certeza que você deseja excluir esta pergunta?')) {
            notify('success', 'question successfully removed!')
            await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
        }
    }

    async function handleCheckQuestionAsAnswered(questionId: string) {
        notify('success', 'successfully marked question!')
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isAnswered: true,
        });

    }

    async function handleHighlightQuestion(questionId: string) {
        notify('success', 'successfully highlighted question!')
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isHighlighted: true,
        });
    }

    return (
        <div id="page-room" className={theme}>
            <header>
                <div className="content">
                    {theme === 'light' ? (
                        <img src={logoImg} alt="Letmeask" />
                    ) : (
                        <img src={logoWhite} alt="Letmeask" />
                    )}
                    <div>
                        <RoomCode code={roomId} />
                        <Button isOutlined onClick={handleEndRoom}>Encerrar sala</Button>
                    </div>
                </div>
            </header>

            <main>
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
                </div>

                {questions.length === 0 && (
                    <div className="empty-questions">
                        <img src={emptyImg} alt="nenhuma pergunta" />
                        <h3>Nenhuma pergunta por aqui...</h3>
                        <span>Envie o código desta sala para seus amigos e comece a responder perguntas!</span>
                    </div>
                )}

                <div className="question-list">
                    {questions.map(question => {
                        return (
                            <Fragment key={question.id}>
                                <Question
                                    content={question.content}
                                    author={question.author}
                                    isAnswered={question.isAnswered}
                                    isHighlighted={question.isHighlighted}
                                >
                                    {!question.isAnswered && (
                                        <>
                                            <button
                                                type="button"
                                                onClick={() => handleCheckQuestionAsAnswered(question.id)}
                                            >
                                                <img src={checkImg} alt="Marcar pergunta respondida" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleHighlightQuestion(question.id)}
                                            >
                                                <img src={answerImg} alt="Dar destaque à pergunta" />
                                            </button>
                                        </>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => setQuestionIdModalOpen(question.id)}
                                    >
                                        <img src={deleteImg} alt="Remover pergunta" />
                                    </button>
                                </Question>
                                <Modal
                                    ariaHideApp={false}
                                    isOpen={questionIdModalOpen === question.id}
                                    onRequestClose={() => setQuestionIdModalOpen(undefined)}
                                >
                                    <div className="modal-body">
                                        <svg width="42" height="42" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M3 5.99988H5H21" stroke="#e73f5d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M8 5.99988V3.99988C8 3.46944 8.21071 2.96074 8.58579 2.58566C8.96086 2.21059 9.46957 1.99988 10 1.99988H14C14.5304 1.99988 15.0391 2.21059 15.4142 2.58566C15.7893 2.96074 16 3.46944 16 3.99988V5.99988M19 5.99988V19.9999C19 20.5303 18.7893 21.039 18.4142 21.4141C18.0391 21.7892 17.5304 21.9999 17 21.9999H7C6.46957 21.9999 5.96086 21.7892 5.58579 21.4141C5.21071 21.039 5 20.5303 5 19.9999V5.99988H19Z" stroke="#e73f5d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <h2>Excluir pergunta</h2>
                                        <span>Tem certeza que você deseja excluir esta pergunta?</span>
                                        <button onClick={() => setQuestionIdModalOpen(undefined)}>Cancelar</button>
                                        <button onClick={() => handleDeleteQuestion(question.id)}>Deletar</button>
                                    </div>
                                </Modal>
                            </Fragment>
                        );
                    })}
                </div>
            </main>
        </div>
    );
}