import { useState } from "react";
import "./App.css";
import { languages } from "./languages";
import { clsx } from "clsx";

function App() {
  // State values
  const [currentWord, setCurrentWord] = useState("react");
  const [guessedLetter, setGuessedLetter] = useState([]);

  // Derived values
  const wrongGuessCount = guessedLetter.filter(
    (letter) => !currentWord.includes(letter)
  ).length;
  const isGameWon = currentWord
    .split("")
    .every((letter) => guessedLetter.includes(letter));
  const isGameLost = wrongGuessCount >= languages.length - 1;
  const isGameOver = isGameWon || isGameLost;

  // Static value
  const alphabet = "abcdefghijklmnopqrstuvwxyz";

  function addGuessedLetter(letter) {
    setGuessedLetter((prevLetter) => {
      const letterSet = new Set(prevLetter); //To prevent duplicate in guessedLetter
      letterSet.add(letter);
      return Array.from(letterSet);
    });
  }
  const languageElements = languages.map((language, index) => {
    const isLanguageLost = index < wrongGuessCount;
    return (
      <span
        key={index}
        className={isLanguageLost ? "lost" : ""}
        style={{
          color: language.color,
          backgroundColor: language.backgroundColor,
        }}
      >
        {language.name}
      </span>
    );
  });

  const currentWordArray = currentWord
    .split("")
    .map((letter, index) => (
      <span key={index}>
        {guessedLetter.includes(letter) ? letter.toUpperCase() : ""}
      </span>
    ));

  const keyboard = alphabet.split("").map((letter, index) => {
    const isGuessed = guessedLetter.includes(letter);
    const isCorrect = isGuessed && currentWord.includes(letter);
    const isWrong = isGuessed && !currentWord.includes(letter);
    const className = clsx({
      correct: isCorrect,
      wrong: isWrong,
    });
    return (
      <button
        className={className}
        key={index}
        onClick={() => addGuessedLetter(letter)}
      >
        {letter.toUpperCase()}
      </button>
    );
  });
  const gameStatusClass = clsx("game-status", {
    won: isGameWon,
    lost: isGameLost
})
  return (
    <main>
      <header>
        <h1>Assembly: Endgame</h1>
        <p>
          Guess the word within 8 attempts to keep the programming world safe
          from Assembly!
        </p>
      </header>
      <section className={gameStatusClass}>
        {isGameOver && (
          <>
            <h2>{isGameWon ? "You win!" : "Game over!"}</h2>
            <p>
              {isGameWon
                ? "Well done! 🎉"
                : "You lose! Better start learning Assembly 😭"}
            </p>
          </>
        )}
      </section>
      <section className="language-chips">{languageElements}</section>
      <section className="word">{currentWordArray}</section>
      <section className="keyboard">{keyboard}</section>
      {isGameOver && <button className="new-game">New Game</button>}
    </main>
  );
}

export default App;
