/* Simon Game - robust start/restart handling */

/* ---- variables ---- */
const colors = ["red", "yellow", "green", "purple"];
let gameSeq = [];
let userSeq = [];
let level = 0;

let started = false;         // whether game is in-progress
let acceptingInput = false;  // whether user clicks are allowed

const statusEl = document.querySelector("#status");
const allBtns = document.querySelectorAll(".btn");

/* ---- start helpers ---- */
function startGame() {
  if (started) return;
  console.log("Starting game...");
  started = true;
  level = 0;
  gameSeq = [];
  userSeq = [];
  statusEl.innerText = `Level 0`;
  nextLevel();
}

/* Support keyboard and pointer start (keyboard for desktop, pointer for mobile) */
document.addEventListener("keydown", (e) => {
  // ignore modifier keys so accidental Shift/Ctrl won't start repeatedly
  if (e.key === "Shift" || e.key === "Control" || e.key === "Alt" || e.key === "Meta") return;
  startGame();
});
document.addEventListener("pointerdown", (e) => {
  // If the pointer event originated from a button click we don't treat it as "start" here.
  // Only start when tapping empty/outer area or the status text.
  if (!started) startGame();
});

/* ---- visual helpers ---- */
function gameFlash(btn) {
  if (!btn) return;
  btn.classList.add("flash");
  setTimeout(() => btn.classList.remove("flash"), 300);
}
function userFlash(btn) {
  if (!btn) return;
  btn.classList.add("pressed");
  setTimeout(() => btn.classList.remove("pressed"), 140);
}

/* ---- game flow ---- */
function nextLevel() {
  acceptingInput = false;
  userSeq = [];
  level++;
  statusEl.innerText = `Level ${level}`;

  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  gameSeq.push(randomColor);

  playSequence();
}

function playSequence(){
  acceptingInput = false;
  let delay = 0;
  // show each color in sequence with consistent spacing
  gameSeq.forEach(color => {
    const btn = document.getElementById(color);
    setTimeout(() => gameFlash(btn), delay);
    delay += 600;
  });
  // enable input only after last flash finishes
  setTimeout(() => {
    acceptingInput = true;
    console.log("Now accepting input for level", level);
  }, delay);
}

/* ---- user interaction ---- */
function checkAnswer(idx){
  if (userSeq[idx] === gameSeq[idx]) {
    if (userSeq.length === gameSeq.length) {
      acceptingInput = false;
      setTimeout(nextLevel, 700);
    }
  } else {
    gameOver();
  }
}

function buttonPressedHandler(e){
  if (!acceptingInput) return;
  const btn = e.currentTarget;
  userFlash(btn);
  const color = btn.id;
  userSeq.push(color);
  checkAnswer(userSeq.length - 1);
}

/* attach click/tap handlers to color buttons */
allBtns.forEach(btn => btn.addEventListener("click", buttonPressedHandler));

/* ---- game over and reset ---- */
function gameOver(){
  statusEl.innerHTML = `Game Over! Your score was <b>${level}</b><br>Press any key or tap to restart`;
  document.body.style.backgroundColor = "red";
  setTimeout(() => { document.body.style.backgroundColor = ""; }, 250);

  // reset flags so startGame() works again
  started = false;
  acceptingInput = false;
  gameSeq = [];
  userSeq = [];
  level = 0;
  console.log("Game over. Waiting to restart.");
}
