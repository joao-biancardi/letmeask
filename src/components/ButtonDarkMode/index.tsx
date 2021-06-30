import { useTheme } from '../../hooks/useTheme';

import './styles.scss';

export function ButtonDarkMode() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button 
            className="toggle-theme"
            onClick={toggleTheme}
        >
            {theme === 'light' ? 'DarkTheme' : 'LigthTheme'}
        </button>
    )
}

