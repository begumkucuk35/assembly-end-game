import React from "react";
import "./App.css";
import { languages } from "./languages";

function App() {
  const [winningGame, setWinningGame] = React.useState(true);

  const languageElements =languages.map((language, index) => (
    <span key={index} style={{color: language.color, backgroundColor: language.backgroundColor}}>{language.name}</span>
  ))

  return (
    <main>
      <header>
        <h1>Assembly: Endgame</h1>
        <p>
          Guess the word within 8 attempts to keep the programming world safe
          from Assembly!
        </p>
      </header>
      <section className="game-status">
        <h2>You win!</h2>
        <p>Well done! 🎉</p>
      </section>
      <section className="language-chips">
          {languageElements}
      </section>
    </main>
  );
}

export default App;
