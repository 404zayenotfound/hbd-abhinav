// ============================================================
//  EDIT THIS FILE. Everything personal lives here.
//  (Inside jokes go wherever you see  ← INSIDE JOKE)
// ============================================================

const NAME = "Abhinav";        // ← his name
const FROM = "astra";          // ← you

window.BDAY = {
  name: NAME,
  from: FROM,
  age: 18,                     // ← the age he's turning

  // the scrolling banner at the top
  marquee: ["HAPPY BIRTHDAY", NAME, "LEGALLY ONE YEAR OLDER", "NO REFUNDS", "CAKE IS MANDATORY", "THIS IS AN OFFICIAL WEBSITE", "WHATS UP??", "THE SKYYYY."],

  // rotates under the title
  subtitles: [
    "now in HD",
    "limited edition. no refunds.",
    "certified vintage",
    "patch notes: +1 year, 0 bugs fixed",
    "still not a grown-up (affectionate)",
    "it's giving… older",
  ],

  // what the security guard says each time he tries to press "no"
  noTaunts: ["nice try", "nope", "you can't escape this", "the button doesn't want you either", "denied.", "stop it.", "…ok fine. you've earned it."],

  // ---------- THE LETTER ----------
  letter: {
    greeting: `Dear ${NAME},`,
    paragraphs: [
      "Do you remember our very first message? No, cuz I don't and guess what YOU ARE NOT REMEMBERING WHAT I DONT.",
      "but i think, looking back, the thing i remember beyond everything is your willingness to share details. by willingness, i mean..it may have very much persuaded out OR SMTH LIKE THAT. ok ok fine maybe i dragged details outta u but u still gimme em.",
      "also, u owe me things. STARTING WITH MANDHI. KINDER JOY. CHOCOLATE. even more yummy thingies. njum njum.",
      "also like, have we come to terms with the fact that you are a full on legal adult?? the fuck?? and the fact IM THE YOUNGER ONE while if you were to judge by how we talk, YOU'RE ABOUT 8. an 8 year old potato. you know its bad when i put you in the same category as my actually 8 year old little brother.",
      "Also, we've known eachother since March 2025 to October 2026 and counting. that's a lot of time to be stupid as fuck. let's just...enjoy being dumb and happy and silly and annoying. cheers dawg.",
    ],
    signoff: `From: the most awesome goated amazing person in the world who u shouldnt contact now cuz ur a major and im a minor\n— ${FROM}`,
  },

  // ---------- PHOTOS ----------
  // drop images in the /photos folder and list them here.
  //   wide: true  → for long thin screenshots (chat messages) so they stay readable
  //   emoji: "🥔" → a polaroid of a giant emoji instead of an image
  photos: [
    { src: "photos/01-potato-msg.png", caption: "\"i thought i was ur potato\"", wide: true },
    { emoji: "🥔", caption: "you are. a massive one." },   // swap for a real photo: { src: "photos/potato.jpg", caption: "..." }
    { src: "photos/02-french-fry.png", caption: "8/9/25 · my emotional french fry", wide: true },
    { src: "photos/03-discord-squad.png", caption: "one's me...and one's my alt." },
    { src: "photos/04-cats.png", caption: "two murderous cats. you've deffo joined the cult by now." },
    { src: "photos/05-minecraft.png", caption: "betrayal." },
    { src: "photos/06-green-fit.png", caption: "freak 60.", fit: "cover" },
    { src: "photos/07-discord-sidekick.png", caption: "your lowk my sidekick asw", wide: true },
  ],

  // ---------- THE MIXTAPE ----------
  // plays right on the page (audio only). yt = the YouTube video id (the bit after watch?v=)
  playlist: {
    title: "songs for the potato",
    tracks: [
      { title: "Sahiba", artist: "Aditya Rikhari & Ankita Chhetri", yt: "ydk-JTPln9I" },
      { title: "Beggin'", artist: "Måneskin", yt: "D557gnClcwc" },
      { title: "Let the World Burn", artist: "Chris Grey", yt: "SkcO47UDzzY" },
      { title: "Gladiator", artist: "Jann", yt: "pgs4KeaEsBk" },
      { title: "My Heart Will Go On", artist: "Céline Dion", yt: "mNsm2P0l_7Y" },
      { title: "In the Stars", artist: "Benson Boone", yt: "2n5GKLdrTfk" },
      { title: "Jhol", artist: "Maanu & Annural Khalid", yt: "-2RAq5o5pwc" },
      { title: "Pretty Little Baby", artist: "Connie Francis", yt: "A1MdThqGarI" },
      { title: "I Wanna Be Your Slave", artist: "Måneskin", yt: "PAyubf7v1FQ" },
      { title: "Free Bird", artist: "Lynyrd Skynyrd", yt: "0LwcvjNJTuM" },
    ],
  },

  // ---------- AWARDS (flip cards) ----------
  //   img + featured: true → a big card with a screenshot on the front
  awards: [   // ← INSIDE JOKES, all of these
    { emoji: "🏛️", title: "HALL OF FAME", img: "photos/08-hall-of-fame.png", featured: true, text: "+infinity bro points." },
    { emoji: "🖼️", title: "HALL OF FAME", img: "photos/09-rock-wall.png", featured: true,
      caption: "unprecedented artwork i still dont believe wasnt stolen.", text: "+infinity bro points. (pending a theft investigation.)" },
    { emoji: "🎤", title: "Best Singer, Most Confidence", img: "photos/10-voice-message.png", featured: true, color: "#ff5fa2",
      caption: "proven.", text: "Pitch: perfect. Volume: maximum. Regret: none." },
    { emoji: "🎸", title: "HALL OF FAME", img: "photos/11-guitar-stage.png", featured: true,
      caption: "kadha poya paattukaran.", text: "+infinity bro points. (encore pending.)" },
    { emoji: "🫡", title: "Best Human (Reluctantly Awarded)", img: "photos/12-best-human.png", featured: true, color: "#5b86ff",
      text: "The committee argued for hours. You won. Barely." },
    { emoji: "🍼", title: "Best Tiny Human", img: "photos/13-tiny-human.png", featured: true, color: "#35d07f",
      text: "Before the potato. Before the french fry. Just a tiny guy." },
  ],

  // the cake can only fit so many candles before it becomes a fire hazard
  maxCandles: 9,

  // every so often, this rains down the screen for no reason
  randomRain: { emoji: ["🍟"], everySeconds: [35, 70], message: "🍟 emotional french fry shower. this is normal." },

  // ---------- SECRET WORDS ----------
  // if he types one of these anywhere on the page, something happens.
  // each one counts as a hidden easter egg.
  secretWords: [
    { word: "whats up", hint: "a very important question", emoji: ["☁️", "🌤️", "🐦"], message: "☁️ THE SKYYYY. ☁️", plane: true },
    { word: "mandhi", hint: "a debt you still owe", emoji: ["🍗", "🍚"], message: "🍗 MANDHI DEBT: still outstanding. interest is accruing." },
    { word: "potato", hint: "what you thought you were", emoji: ["🥔"], message: "🥔 you are, in fact, the potato." },
    { word: "french fry", hint: "an emotional side dish", emoji: ["🍟"], message: "🍟 my emotional french fry 🍟" },
    // ← add inside-joke words here, e.g.
    // { word: "pineapple", hint: "you know what you did", emoji: ["🍍"], message: "we said we'd never bring this up" },
  ],

  // ---------- THE SERIOUS ENDING ----------
  finale: [
    "abhi ur gonna laugh at me forever for this.",
    "i think my ego can take it, cuz as previously established, i dont miss you.",
    "but anyways, in a very very cringe way, 'real talk'.",
    "right so. anyways im lowk glad u lived to be 18,",
    "now please dont let your stupid decisions end your adulthood very very early.",
    "thanks for making me laugh my ass off.",
    "i am grateful yk?",
    "grateful i can come home and go ahead and bully you.",
    "ok this is getting too emotional.",
    "happy birthday motherfucker.",
  ],
};
