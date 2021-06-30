import { useTheme } from '../../hooks/useTheme';

import logoImg from '../../assets/images/logo.svg';
import logoWhite from '../../assets/images/logoWhite.svg';
import { ButtonDarkMode } from '../../components/ButtonDarkMode';

import './styles.scss';
import { Link } from 'react-router-dom';

export function PageNotFound() {
    const { theme } = useTheme();

    return (
        <div id="page-not-found" className={theme}>
            <header>
                <div className="content">
                    {theme === 'light' ? (
                        <img src={logoImg} alt="Letmeask" />
                    ) : (
                        <img src={logoWhite} alt="Letmeask" />
                    )}
                    <div>
                        <ButtonDarkMode />
                    </div>
                </div>
            </header>
            <main>
                <h1>Page not found!</h1>
                <p>
                    Voltar para o início <Link to="/">Clique aqui</Link>
                </p>
            </main>
        </div>
    )
}