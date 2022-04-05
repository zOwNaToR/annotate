import React from 'react';
import { useTheme } from '@/hooks/useTheme';
import { DARK_THEME } from '@/context/theme/constants';
import MoonIcon from '@/images/svg/Moon.svg';
import SunIcon from '@/images/svg/Sun.svg';
import './styles.css';

export interface IThemeToggle {}

const ThemeToggle: React.VFC<IThemeToggle> = ({}) => {
  const [theme, , toggleTheme, getOppositeTheme] = useTheme();
  const isDarkMode = theme === DARK_THEME;

  const handleClick = () => {
    toggleTheme();
  };

  return (
    <label className="toggle-wrapper" htmlFor="toggle">
      <div
        className={`toggle ${isDarkMode ? 'enabled' : 'disabled'}`}
        style={{ backgroundColor: getOppositeTheme().values.backgroundColor }}
      >
        <span className="hidden">{isDarkMode ? 'Enable Light Mode' : 'Enable Dark Mode'}</span>
        <div className="toggleCircle" style={{ backgroundColor: theme.values.backgroundColor }} />

        <div className="icons">
          <img
            alt="enable light mode"
            src={SunIcon}
            style={{ visibility: isDarkMode ? 'visible' : 'hidden' }}
          />
          <img
            alt="enable dark mode"
            src={MoonIcon}
            style={{ visibility: !isDarkMode ? 'visible' : 'hidden' }}
          />
        </div>

        <input
          id="toggle"
          name="toggle"
          type="checkbox"
          checked={isDarkMode}
          onChange={handleClick}
        />
      </div>
    </label>
  );
};

export default ThemeToggle;
