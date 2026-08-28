const COOLDOWN_MS = 24 * 60 * 60 * 1000;
const STORAGE_KEY = "love-letter-last-opened";
const MESSAGE_KEY = "love-letter-message-index";
const OPENED_DATE_KEY = "love-letter-opened-date";

const messages = [
  {
    image: "https://i.imgur.com/FVErM9U.png",
    date: "para la niña mas bella",
    greeting: "Mi amor,",
    paragraphs: [
      "Hoy solo quería recordarte que contigo todo se siente más bonito. Gracias por ser ese lugar donde mi corazón descansa y por llenar mis días de pequeñas cosas que me recuerdan por que te elegi a ti.",
      "Me encanta compartir mis dias contigo, tus risas, tus tonterias, tus escenas y hasta esos silencios que no molestan.",
      "Ojalá nunca olvides lo especial que eres para mí, te elegiría una y otra vez, en todas las versiones de nosotros y en cada día que todavía nos queda por inventar."
    ],
    signature: "Te amo demasiado,<br><span>mi chanchita</span> ♥"
  },
  {
    image: "https://i.imgur.com/Nx2rq9X.png",
    date: "una pequeña razón para sonreír",
    greeting: "Hola mi amorshito,",
    paragraphs: [
      "Se que tienes días difíciles, pero siempre debes recordar que eres mucho más fuerte, valiosa y querida de lo que tu crees.",
      "Tu forma de mirar el mundo, de reírte y de cuidar a quienes amas hace que me gustes cada vez mas.",
      "Gracias por existir exactamente como eres, mi lugar favorito siempre tendrá algo de Naomy."
    ],
    signature: "Con amor,<br><span>su niño</span> ♥"
  },
  {
    image: "https://i.imgur.com/Lbi10n0.jpeg",
    date: "Siempre pensando en ti",
    greeting: "Mi bebita linda,",
    paragraphs: [
      "Hay días en los que no hace falta que hagamos nada, basta con saber que estamos juntos para que todo se sienta mas tranquilo.",
      "Me quedo con cada conversación, cada chiste funable y cada momento que compartimos donde el tiempo pasa volando.",
      "Que lindo fue conocerte. Gracias por hacer que me de cuenta de lo que valgo, de que todavia se puede creer en el amor por mujeres como tu."
    ],
    signature: "Te amo,<br><span>con todo mi corazón</span> ♥"
  }
];

const letterCard = document.querySelector("#letterCard");
const letterInside = document.querySelector("#letterInside");
const openButton = document.querySelector("#openButton");
const openHint = document.querySelector("#openHint");
const cooldownNote = document.querySelector("#cooldownNote");

function renderMessage(index) {
  const message = messages[index];
  const photo = document.querySelector(".letter-photo");
  photo.src = message.image;
  photo.alt = `Imagen de ${message.date}`;
  photo.onerror = () => {
    photo.src = "assets/images/letter-photo.png";
    photo.alt = "Imagen de respaldo de la nota";
  };
  document.querySelector("#letterDate").textContent = message.date;
  document.querySelector("#letterGreeting").textContent = message.greeting;
  document.querySelector("#letterParagraphOne").textContent = message.paragraphs[0];
  document.querySelector("#letterParagraphTwo").textContent = message.paragraphs[1];
  document.querySelector("#letterParagraphThree").textContent = message.paragraphs[2];
  document.querySelector("#letterSignature").innerHTML = message.signature;
}

function getNextMessageIndex() {
  const previousIndex = Number(localStorage.getItem(MESSAGE_KEY));
  if (!Number.isInteger(previousIndex)) return 0;
  return (previousIndex + 1) % messages.length;
}

function getRemainingTime() {
  const openedDate = localStorage.getItem(OPENED_DATE_KEY);
  if (!openedDate || openedDate !== getTodayKey()) return 0;

  const tomorrow = new Date();
  tomorrow.setHours(24, 0, 0, 0);
  return Math.max(0, tomorrow.getTime() - Date.now());
}

function getTodayKey() {
  const today = new Date();
  return `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
}

function formatRemainingTime(milliseconds) {
  const totalMinutes = Math.ceil(milliseconds / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) return `${minutes} min`;
  return `${hours} h ${String(minutes).padStart(2, "0")} min`;
}

function updateCooldown() {
  const remaining = getRemainingTime();
  const isCoolingDown = remaining > 0;
  openButton.disabled = isCoolingDown;
  openButton.innerHTML = isCoolingDown
    ? `Vuelve en ${formatRemainingTime(remaining)}`
    : "Abrir mi carta <span>→</span>";
  cooldownNote.textContent = isCoolingDown
    ? "La carta guarda un poquito de magia para mañana."
    : "Una vez abierta, podrás volver a leerla mañana.";
  if (!isCoolingDown && letterCard.classList.contains("open")) {
    openHint.textContent = "la carta está abierta para ti";
  }
}

openButton.addEventListener("click", () => {
  if (getRemainingTime() > 0) return;
  const messageIndex = getNextMessageIndex();
  renderMessage(messageIndex);
  localStorage.setItem(MESSAGE_KEY, String(messageIndex));
  localStorage.setItem(STORAGE_KEY, String(Date.now()));
  localStorage.setItem(OPENED_DATE_KEY, getTodayKey());
  letterCard.classList.add("open");
  letterInside.setAttribute("aria-hidden", "false");
  openHint.textContent = "guardada en mi corazón";
  updateCooldown();
});

renderMessage(Number(localStorage.getItem(MESSAGE_KEY)) || 0);
updateCooldown();
setInterval(updateCooldown, 30000);
