import { useState } from "react";
import "./App.css";
import { languages } from "./languages";
import { clsx } from "clsx";
import { getRandomWord, getFarewellText } from "./utils";
import Confetti from "react-confetti"

function App() {
  // State values
  const [currentWord, setCurrentWord] = useState(() => getRandomWord());
  const [guessedLetter, setGuessedLetter] = useState([]);
  console.log(currentWord);
  // Derived values
  const numGuessesLeft = languages.length - 1;
  const wrongGuessCount = guessedLetter.filter(
    (letter) => !currentWord.includes(letter)
  ).length;
  const isGameWon = currentWord
    .split("")
    .every((letter) => guessedLetter.includes(letter));
  const isGameLost = wrongGuessCount >= numGuessesLeft;
  const isGameOver = isGameWon || isGameLost;

  const lastGuessedLetter = guessedLetter[guessedLetter.length - 1];
  const isLastGuessIncorrect =
    lastGuessedLetter && !currentWord.includes(lastGuessedLetter);

  // Static value
  const alphabet = "abcdefghijklmnopqrstuvwxyz";

  function addGuessedLetter(letter) {
    setGuessedLetter((prevLetter) => {
      const letterSet = new Set(prevLetter); //To prevent duplicate in guessedLetter
      letterSet.add(letter);
      return Array.from(letterSet);
    });
  }
  function startNewGame() {
    setCurrentWord(getRandomWord());
    setGuessedLetter([]);
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

  const currentWordArray = currentWord.split("").map((letter, index) => {
    const shouldRevealLetter = isGameLost || guessedLetter.includes(letter);
    const letterClassName = clsx(
      isGameLost && !guessedLetter.includes(letter) && "missed-letter"
  )
    return (
      <span className={letterClassName} key={index}>{shouldRevealLetter ? letter.toUpperCase() : ""}</span>
    );
  });

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
        disabled={isGameOver}
        aria-disabled={guessedLetter.includes(letter)}
        aria-label={`Letter ${letter}`} // To inrease a11y
        onClick={() => addGuessedLetter(letter)}
      >
        {letter.toUpperCase()}
      </button>
    );
  });
  const gameStatusClass = clsx("game-status", {
    won: isGameWon,
    lost: isGameLost,
    farewell: !isGameOver && isLastGuessIncorrect,
  });
  return (
    <main>
      {
                isGameWon && 
                    <Confetti
                        recycle={false}
                        numberOfPieces={1000}
                    />
            }
      <header>
        <h1>Assembly: Endgame</h1>
        <p>
          Guess the word within 8 attempts to keep the programming world safe
          from Assembly!
        </p>
      </header>
      <section aria-live="polite" role="status" className={gameStatusClass}>
        {isGameOver ? (
          <>
            <h2>{isGameWon ? "You win!" : "Game over!"}</h2>
            <p>
              {isGameWon
                ? "Well done! 🎉"
                : "You lose! Better start learning Assembly 😭"}
            </p>
          </>
        ) : (
          isLastGuessIncorrect && (
            <p className="farewell-message">
              {getFarewellText(languages[wrongGuessCount - 1].name)}
            </p>
          )
        )}
      </section>
      <section className="language-chips">{languageElements}</section>
      <section className="word">{currentWordArray}</section>
      {/* Combined visually-hidden aria-live region for status updates */}
      <section className="sr-only" aria-live="polite" role="status">
        <p>
          {currentWord.includes(lastGuessedLetter)
            ? `Correct! The letter ${lastGuessedLetter} is in the word.`
            : `Sorry, the letter ${lastGuessedLetter} is not in the word.`}
          You have {numGuessesLeft} attempts left.
        </p>
        <p>
          Current word:{" "}
          {currentWord
            .split("")
            .map((letter) =>
              guessedLetter.includes(letter) ? letter + "." : "blank."
            )
            .join(" ")}
        </p>
      </section>{" "}
      {/* To make a11y friendly */}
      <section className="keyboard">{keyboard}</section>
      {isGameOver && (
        <button className="new-game" onClick={startNewGame}>
          New Game
        </button>
      )}
    </main>
  );
}

export default App;
