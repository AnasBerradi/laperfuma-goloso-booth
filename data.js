/* ============================================================
   Velveteen's Secret Potions — La Perfuma Goloso booth app
   DATA — every card, every string. Edit freely.

   ▸ name_zh / intensity labels: taken from the printed cards.
   ▸ poem_en / spell_en: taken from the printed cards (PDF).
   ▸ poem_zh / spell_zh: DRAFT translations in a poetic register.
     Each is flagged  // REVIEW: native speaker  — have them
     checked by a native speaker before the booth opens.
   ▸ notes: families in order of prominence (largest first).
     Weights are rough, descending and editable — tweak the
     numbers, never the order, unless the formula changes.
   ▸ Intensity keys: exhilarating | intriguing | outstanding |
     overstimulating | invigorating  (labels in INTENSITIES).
   ============================================================ */

window.VSP_DATA = (function () {
  "use strict";

  /* ---------- Note families (8) ---------- */
  const FAMILIES = [
    { key: "wood",    en: "Wood",    zh: "木质调" },
    { key: "fruit",   en: "Fruit",   zh: "果香调" },
    { key: "greens",  en: "Greens",  zh: "绿意调" },
    { key: "spices",  en: "Spices",  zh: "辛香调" },
    { key: "citrus",  en: "Citrus",  zh: "柑橘调" },
    { key: "floral",  en: "Floral",  zh: "花香调" },
    { key: "musk",    en: "Musk",    zh: "麝香调" },
    { key: "resins",  en: "Resins",  zh: "树脂调" },
  ];

  /* ---------- Intensity categories (5) ---------- */
  const INTENSITIES = [
    { key: "exhilarating",   en: "Exhilarating — Yearning",        zh: "令人振奋——思慕渴望" },
    { key: "intriguing",     en: "Intriguing — Arousing",          zh: "令人着迷——撩动兴奋" },
    { key: "outstanding",    en: "Outstanding — Untamed",          zh: "出类拔萃——桀骜不驯" },
    { key: "overstimulating",en: "Overstimulating — Stupefied",    zh: "感官过载——目眩神迷" },
    { key: "invigorating",   en: "Invigorating — Refreshing",      zh: "活力焕发——清新宜人" },
  ];

  /* ---------- The 25 vials ----------
     Weight scheme by count of notes (descending, ≈ sums to 100):
       7 notes → 35/25/15/10/6/5/4     6 notes → 40/25/15/10/5/5
       5 notes → 40/25/18/10/7         4 notes → 42/28/18/12
       3 notes → 50/30/20                                   */
  const VIALS = [
    {
      id: "LPG003",
      name_en: "Heartbreaker",
      name_zh: "芳心纵火犯",
      poem_en:
        "A midnight temptation,\nwhere confidence and danger entwine,\nslipping beneath your skin like a forbidden glance,\none you should ignore but cannot deny.\nA signature of irresistible trouble,\netched in memory before it's fathomed,\nan encounter foreseen as folly,\nyet willingly embraced.",
      // REVIEW: native speaker — poem_zh draft
      poem_zh:
        "午夜时分的诱惑，\n自信与危险交缠共舞，\n如一道不该回望的目光，\n悄然潜入肌肤之下——\n明知应当视而不见，\n却终究无法否认。\n那是无可抗拒的劫数，\n未被读懂，已铭刻于心；\n明知是场荒唐的相逢，\n却仍甘愿沉溺其间。",
      spell_en: "I trust the temptation ahead, where every dangerous turn reveals a deeper desire.",
      // REVIEW: native speaker — spell_zh draft
      spell_zh: "我信奉前方的诱惑——每一次险峻的转弯，都显露出更深一层的渴望。",
      notes: [
        { family: "greens",  weight: 35 },
        { family: "musk",    weight: 25 },
        { family: "citrus", weight: 15 },
        { family: "resins", weight: 10 },
        { family: "spices", weight: 6 },
        { family: "floral", weight: 5 },
        { family: "wood",    weight: 4 },
      ],
      intensity: "exhilarating",
      hz: 299,
    },
    {
      id: "LPG004",
      name_en: "Devil in Disguise",
      name_zh: "伪装的魔鬼",
      poem_en:
        "A graceful contradiction, moving with perfect grace,\nCarrying tenderness in one hand, thunder in its embrace.\nA presence that reads the room,\nChoosing moments so fine,\nOwning the balance, in rhythm and rhyme.\nThe greatest power lies in knowing every side,\nEmbracing the self with nothing to hide.",
      // REVIEW: native speaker — poem_zh draft
      poem_zh:
        "一场优雅的矛盾，步履从容有度，\n一手执温柔，一手拥雷霆入怀。\n它善察全场的气韵，\n择至精微的时机而动，\n在韵律与格律之间，从容执掌平衡。\n至高的力量，在于洞悉每一面，\n坦然拥抱自我，无需遮掩。",
      spell_en: "I move through every contrast with command, letting each side serve its purpose.",
      // REVIEW: native speaker — spell_zh draft
      spell_zh: "我从容穿行于每一重对比之间，令彼此对立的，皆为我所用。",
      notes: [
        { family: "spices", weight: 40 },
        { family: "resins", weight: 25 },
        { family: "greens", weight: 15 },
        { family: "citrus", weight: 10 },
        { family: "wood",   weight: 5 },
        { family: "floral", weight: 5 },
      ],
      intensity: "intriguing",
      hz: 468,
    },
    {
      id: "LPG005",
      name_en: "Hello, I Love You!",
      name_zh: "你好，我爱你！",
      poem_en:
        "In a pause so complete, the world starts to confess,\nMotionless it stands, amidst noise and excess.\nBeauty and vanity, desire on display,\nIn plain sight they arrange, in their own array.\nA signature of distance, immaculate and free,\nClose enough to witness, too far to seize or see.\nFirst, the world revealed itself, a silent decree.",
      // REVIEW: native speaker — poem_zh draft
      poem_zh:
        "在一场全然静止的停顿里，世界开始坦白，\n它伫立不动，置身喧嚣与浮华中央。\n美与虚荣，欲望陈列于众目之下，\n以各自的秩序，坦然排布成行。\n那是一种超然的印记，无瑕而自由——\n近可观瞻，却远得无从攫取、无从看透。\n首先，是这世界自己招认了，一纸无声的敕令。",
      spell_en: "I rise where nothing can claim me, and everything that reacts reveals itself as it is.",
      // REVIEW: native speaker — spell_zh draft
      spell_zh: "我升至无人能宣称占有之处；凡因我而动者，皆显露出它的本相。",
      notes: [
        { family: "citrus", weight: 35 },
        { family: "floral", weight: 25 },
        { family: "spices", weight: 15 },
        { family: "fruit",  weight: 10 },
        { family: "musk",   weight: 6 },
        { family: "wood",   weight: 5 },
        { family: "greens", weight: 4 },
      ],
      intensity: "intriguing",
      hz: 655,
    },
    {
      id: "LPG006",
      name_en: "Too Shy Shy",
      name_zh: "极度害羞",
      poem_en:
        "In a small realm where air is your own,\nIt wraps around, yet secrets aren't shown.\nA whispered touch close to the skin,\nIntimate space where breath begins.\nA hidden bond, distance maintains,\nNearness a gift, where essence remains.",
      // REVIEW: native speaker — poem_zh draft
      poem_zh:
        "在一方小小的天地里，空气只属于你，\n它环绕周身，却不泄露半分秘密。\n一缕贴近肌肤的轻声耳语，\n是呼吸开始的亲密之地。\n一段藏而不宣的羁绊，以距离相守——\n贴近是馈赠，芬芳因此长留。",
      spell_en: "Only what belongs this close may stay; everything else can leave my quiet exactly as it is.",
      // REVIEW: native speaker — spell_zh draft
      spell_zh: "唯有真正属于此间的，方可停留；其余一切，请原样离开我的静谧。",
      notes: [
        { family: "citrus", weight: 42 },
        { family: "floral", weight: 28 },
        { family: "greens", weight: 18 },
        { family: "resins", weight: 12 },
      ],
      intensity: "exhilarating",
      hz: 9977,
    },
    {
      id: "LPG008",
      name_en: "In the Forest",
      name_zh: "在森林",
      poem_en:
        "A wild invitation with no clear goal,\nIt drifts with the air, a wanderer's stroll.\nTrailing the memory, it dances along,\nWith each new companion, it hums a song.\nA signature of joy and open embrace,\nSpacious enough for surprises to place.\nLeave something open, let the world pass through,\nAnd see what wonders it brings to you.",
      // REVIEW: native speaker — poem_zh draft
      poem_zh:
        "一场没有既定归宿的野性邀约，\n随风游走，如闲步的漫游者。\n它追随记忆的尾迹，且行且歌，\n与每一位新识的旅伴，轻声唱和。\n那是欢愉与坦荡的印记，\n留一处空位，让惊喜安然落座。\n留一扇开启的门，任世界穿行而过，\n看它会带来怎样的奇迹。",
      spell_en: "What finds me gets a place to land, and from there, I carry it forward.",
      // REVIEW: native speaker — spell_zh draft
      spell_zh: "凡寻到我的，皆有一处栖身之地；自此，我携它同行。",
      notes: [
        { family: "spices", weight: 40 },
        { family: "greens", weight: 25 },
        { family: "resins", weight: 15 },
        { family: "wood",   weight: 10 },
        { family: "citrus", weight: 5 },
      ],
      intensity: "outstanding",
      hz: 464,
    },
    {
      id: "LPG015",
      name_en: "Juxtaposed",
      name_zh: "极致反差",
      poem_en:
        "A ritual of trust unfolds,\nWhere surrender's power boldly holds.\nBinding forces, fierce yet kind,\nSoftness and intensity intertwined.\nPresence reveals pleasure near the ledge,\nHidden within the edge's pledge.\nThe line fades, as if a spell,\nBetween holding and being held,\nall is well.",
      // REVIEW: native speaker — poem_zh draft
      poem_zh:
        "一场交付信任的仪式徐徐展开，\n以降服之力，牢牢执掌全局。\n束缚的力量，暴烈而仁慈，\n柔软与炽烈，彼此交织。\n临渊之处，欢愉显露真容，\n藏于绝壁边缘的誓约之中。\n界线消融，恍若被施了咒——\n于紧拥与被拥之间，一切安好。",
      spell_en: "I unlock what holds me back, allowing the bound and the free to move as one.",
      // REVIEW: native speaker — spell_zh draft
      spell_zh: "我解开束缚我的一切，令被缚者与自由者，同频共行。",
      notes: [
        { family: "wood",   weight: 35 },
        { family: "spices", weight: 25 },
        { family: "citrus", weight: 15 },
        { family: "greens", weight: 10 },
        { family: "musk",   weight: 6 },
        { family: "floral", weight: 5 },
        { family: "fruit",  weight: 4 },
      ],
      intensity: "outstanding",
      hz: 383,
    },
    {
      id: "LPG021",
      name_en: "Everybody Loves Mojitos",
      name_zh: "每个人都喜欢莫吉托",
      poem_en:
        "The irresistible choice, silent yet bold,\nNever needing to vie for attention's hold.\nIt glides through moments, gently it stands,\nFinding its place wherever it lands.\nA presence that shifts the course of time,\nUnchanged itself, in harmony and line.\nThe one you choose, instinctively clear,\nBefore other options even appear.",
      // REVIEW: native speaker — poem_zh draft
      poem_zh:
        "那无可抗拒的抉择，沉静而果敢，\n从不需争夺，便得众目青睐。\n它从容穿行于时光之间，静静伫立，\n落在哪里，哪里便是它的位置。\n它的出现，改变了时间的流向，\n自身却始终如一，与万物相谐。\n你本能地选定它，答案了然于心，\n早在其余选项浮现之前。",
      spell_en: "I change the angle, bypass the obstacle, and become the choice that remains.",
      // REVIEW: native speaker — spell_zh draft
      spell_zh: "我换一个角度，绕过障碍，成为那仅存的选择。",
      notes: [
        { family: "citrus", weight: 40 },
        { family: "greens", weight: 25 },
        { family: "fruit",  weight: 18 },
        { family: "wood",   weight: 10 },
      ],
      intensity: "outstanding",
      hz: 3773,
    },
    {
      id: "LPG026",
      name_en: "Hungla Urbano",
      name_zh: "城市丛林",
      poem_en:
        "A wild instinct grows through cracks of stone,\nNavigates the noise, the signals alone.\nUnexpected paths, beyond the ordinary,\nA presence feeding curiosity, wary.\nDesire and freedom, a rhythm it finds,\nIn a city alive, when free of confines.\nStop following scripts, let instincts be,\nIn the dance of the city's own tapestry.",
      // REVIEW: native speaker — poem_zh draft
      poem_zh:
        "一株野性的本能，自石缝间生长，\n在喧嚣与信号之中，独自辨认方向。\n意外的路径，越出寻常的疆界，\n一种喂养好奇心的存在，警觉而行。\n欲望与自由，在城市解缚之时，\n自成一种律动，兀自生长。\n别再循章行事，让本能苏醒，\n在都市自织的锦缎上，翩然起舞。",
      spell_en: "I move through the maze, rewriting the route every time the system blocks the way.",
      // REVIEW: native speaker — spell_zh draft
      spell_zh: "我穿行于迷宫之中，每逢旧路被封，便重写一条新的路径。",
      notes: [
        { family: "greens", weight: 35 },
        { family: "wood",   weight: 25 },
        { family: "spices", weight: 15 },
        { family: "floral", weight: 10 },
        { family: "resins", weight: 6 },
        { family: "musk",   weight: 5 },
      ],
      intensity: "outstanding",
      hz: 7373,
    },
    {
      id: "LPG033",
      name_en: "The Ride of the Valkyries",
      name_zh: "女战神的骑行",
      poem_en:
        "A majestic ascent, unstoppable in its flight,\nRises layer by layer, reaching new height.\nTransitions reveal a force ever grand,\nMotion transformed into greatness at hand.\nHigher it soars, becoming ever more,\nA wondrous journey, led by an unseen core.",
      // REVIEW: native speaker — poem_zh draft
      poem_zh:
        "一场恢弘的升腾，羽翼所向无阻，\n层层而上，直抵新的高处。\n每一次转换，都显露更宏大的力量，\n运动本身，化作手边的伟业。\n它愈飞愈高，愈发浩然，\n一段由无形之核引领的壮丽旅程。",
      spell_en: "I leave the ground behind, rising into the force that carries my name.",
      // REVIEW: native speaker — spell_zh draft
      spell_zh: "我将大地抛在身后，升入那承载我名号的伟力之中。",
      notes: [
        { family: "greens", weight: 42 },
        { family: "citrus", weight: 28 },
        { family: "musk",   weight: 18 },
        { family: "wood",   weight: 12 },
      ],
      intensity: "exhilarating",
      hz: 18881,
    },
    {
      id: "LPG036",
      name_en: "On the Top of the World",
      name_zh: "世界之巅",
      poem_en:
        "A private realm above demands,\nWhere gravity holds no sway.\nIt glides through spotlit lands,\nYet remains outside the fray.\nA mark of triumph and grace,\nWith distance in its role.\nUntouched by noise's chase,\nIt plays with effortless control.",
      // REVIEW: native speaker — poem_zh draft
      poem_zh:
        "一方凌驾于万物索求之上的私属疆域，\n在那里，引力无从施展威权。\n它滑行过聚光的国土，\n却置身纷争之外。\n那是凯旋与优雅的印记，\n距离，自有其分内的职责。\n喧嚣的追逐无从沾染，\n它以毫不费力的掌控，从容戏耍。",
      spell_en: "The world can demand; I remain the hand that directs it.",
      // REVIEW: native speaker — spell_zh draft
      spell_zh: "世界尽管索取；我自岿然，做那只掌控全局的手。",
      notes: [
        { family: "greens", weight: 35 },
        { family: "floral", weight: 25 },
        { family: "wood",   weight: 15 },
        { family: "citrus", weight: 10 },
        { family: "resins", weight: 6 },
        { family: "spices", weight: 5 },
      ],
      intensity: "exhilarating",
      hz: 7477,
    },
    {
      id: "LPG037",
      name_en: "I Wanna Be Sedated",
      name_zh: "让我镇静",
      poem_en:
        "A sudden halt amidst eternal motion,\nCreating distance from its source's notion.\nBefore it stretches to reach further afar,\nA presence declines another cycle's spar.\nNo more input, no more response at play,\nIn silence, it chooses its own way.",
      // REVIEW: native speaker — poem_zh draft
      poem_zh:
        "在永恒的运转之中，一次骤然的停顿，\n与其源头之意，拉开一段距离。\n在它伸向更远方之前，\n这存在，婉拒了又一轮交锋。\n不再输入，不再应答——\n在静默之中，它选定了自己的路。",
      spell_en: "I am no longer available for this.",
      // REVIEW: native speaker — spell_zh draft
      spell_zh: "此事，我不再奉陪。",
      notes: [
        { family: "wood",   weight: 40 },
        { family: "greens", weight: 25 },
        { family: "resins", weight: 18 },
        { family: "citrus", weight: 10 },
      ],
      intensity: "overstimulating",
      hz: 4646,
    },
    {
      id: "LPG042",
      name_en: "I Am the Spring",
      name_zh: "我就是春天",
      poem_en:
        "In regal procession, I arrive,\nA cape unveiling the unseen with a dive.\nThe unknown adorns me, a brilliant show,\nIlluminating grand possibilities below.\nA sovereign of emergence, lush and bright,\nImpossible to ignore, a wondrous sight.\nWhere I reign, futures hidden unfurl,\nStepping forward,\ndressed for their debut whirl.",
      // REVIEW: native speaker — poem_zh draft
      poem_zh:
        "我以帝王之仪降临，\n一袭披风，揭开未见的世界。\n未知加冕于我，是一场盛大的演出，\n照亮脚下万千恢弘的可能。\n我是喷薄而出的君主，丰盈而明亮，\n令人无从忽视，叹为奇观。\n在我君临之处，藏匿的未来徐徐舒展，\n迈步向前——\n正装赴这场初演。",
      spell_en: "I dissolve the limit; my dominion exceeds the design.",
      // REVIEW: native speaker — spell_zh draft
      spell_zh: "我消融界限；我的疆域，超出了设计的度量。",
      notes: [
        { family: "floral", weight: 40 },
        { family: "musk",   weight: 25 },
        { family: "wood",   weight: 15 },
        { family: "greens", weight: 10 },
      ],
      intensity: "overstimulating",
      hz: 17766,
      season: "spring",
    },
    {
      id: "LPG043A",
      name_en: "A Sunday Kind of Love",
      name_zh: "星期日之爱",
      poem_en:
        "In comfort's embrace, a heart does long,\nFor enchantment's dance and a magical song.\nNew dimensions of romance it seeks,\nWhere affection deepens with each mystique.\nA presence that weaves a timeless thread,\nTurns connection to wonders, gently spread.\nThe rarest moments, like echoes, ring,\nIn endless return, their beauty they bring.",
      // REVIEW: native speaker — poem_zh draft
      poem_zh:
        "在闲适的怀抱里，一颗心开始向往，\n向往魔法的舞步，与一支有魔力的歌。\n它追寻浪漫的崭新维度，\n每一重神秘，都令深情再深一层。\n有一种存在，织就一条永恒的线，\n将寻常的联结，化作悄然铺展的奇迹。\n那些最珍罕的时刻，如回声般鸣响，\n在无尽的复返之中，携美而归。",
      spell_en: "I know what I want. I'm going after it.",
      // REVIEW: native speaker — spell_zh draft
      spell_zh: "我清楚我要什么。我即刻去取。",
      notes: [
        { family: "floral", weight: 35 },
        { family: "greens", weight: 25 },
        { family: "wood",   weight: 15 },
        { family: "spices", weight: 10 },
        { family: "musk",   weight: 6 },
      ],
      intensity: "overstimulating",
      hz: 3883,
    },
    {
      id: "LPG043B",
      name_en: "Cherrybomba!",
      name_zh: "樱桃炸弹",
      poem_en:
        "A wild ignition, free from expectation,\nSoars through storms of thought and desire's sensation.\nAmid contradictions, it holds its own name,\nA presence that rebels and speaks in its flame.\nThe next move is mine, in this dance of the free,\nWhere rebellion and language merge into me.",
      // REVIEW: native speaker — poem_zh draft
      poem_zh:
        "一次野性的点火，挣脱了所有预期，\n穿越思绪与欲望的风暴，扶摇而上。\n在重重矛盾之间，它守着自己的名字，\n一种反叛的存在，以火焰发声。\n下一步属于我——在这支自由之舞里，\n反叛与言语，皆融入我身。",
      spell_en: "I find the tension point and make it mine.",
      // REVIEW: native speaker — spell_zh draft
      spell_zh: "我找到那个紧绷的点，并把它据为己有。",
      notes: [
        { family: "spices", weight: 35 },
        { family: "wood",   weight: 25 },
        { family: "floral", weight: 15 },
        { family: "greens", weight: 10 },
        { family: "fruit",  weight: 6 },
      ],
      intensity: "invigorating",
      hz: 7788,
    },
    {
      id: "LPG049",
      name_en: "I'm not that innocent",
      name_zh: "我没那么无辜",
      poem_en:
        "A force of passion, bright and bold,\nMoves toward what the heart has told.\nChosen paths with purpose clear,\nIntention grows, drawing near.\nA presence strong, conviction pure,\nTransforms the soul, an outcome sure.\nWhat unfolds feels quite surprising,\nYet destiny was always rising.",
      // REVIEW: native speaker — poem_zh draft
      poem_zh:
        "一股明亮而炽烈的热情，\n循着心之所指，昂然前行。\n选定的道路，目标分明，\n意图步步生长，渐行渐近。\n一种笃定的存在，信念纯粹，\n重塑灵魂，结局早已注定。\n后来的展开或许令人惊讶，\n可命运，其实一直在上升。",
      spell_en: "I already know what happens when I set this in motion.",
      // REVIEW: native speaker — spell_zh draft
      spell_zh: "我早已知晓，当我推动这一切时，将会发生什么。",
      notes: [
        { family: "floral", weight: 35 },
        { family: "musk",   weight: 25 },
        { family: "resins", weight: 15 },
        { family: "greens", weight: 10 },
        { family: "spices", weight: 6 },
        { family: "citrus", weight: 5 },
      ],
      intensity: "intriguing",
      hz: 4646,
    },
    {
      id: "LPG050",
      name_en: "Trust in Me",
      name_zh: "信任我",
      poem_en:
        "A hypnotic allure in graceful dance,\nDrawing senses inward in a trance.\nFascination grows, impossible to resist,\nA magnetic pull, beyond reason persist.\nNearer it comes, boundaries fade away,\nGuiding the senses in a gentle sway.\nWith effortless grace, it captures the soul,\nA wondrous enchantment, making us whole.",
      // REVIEW: native speaker — poem_zh draft
      poem_zh:
        "一场催眠般的魅惑，在优雅中起舞，\n引感官向内，坠入一场迷醉。\n痴迷滋长，令人无从抗拒，\n一股磁力，越过了理智的边疆。\n它渐行渐近，边界层层消融，\n引着感官，随温柔的摇曳俯仰。\n以从容不迫的优雅，它俘获灵魂——\n一场绝妙的魔法，令我们重归完满。",
      spell_en: "I create the pull; what enters follows another nature.",
      // REVIEW: native speaker — spell_zh draft
      spell_zh: "引力由我缔造；凡入彀中者，皆循另一种天性而行。",
      notes: [
        { family: "musk",   weight: 35 },
        { family: "spices", weight: 25 },
        { family: "floral", weight: 15 },
        { family: "citrus", weight: 10 },
        { family: "resins", weight: 6 },
        { family: "wood",   weight: 5 },
        { family: "greens", weight: 4 },
      ],
      intensity: "exhilarating",
      hz: 6363,
    },
    {
      id: "LPG051",
      name_en: "Materialista",
      name_zh: "唯物主义者",
      poem_en:
        "A longing for more, with vision so clear,\nIt strides forth boldly, casting aside fear.\nUnapologetic, it leaves limits behind,\nA power that transforms, with determination aligned.\nIt clears the path, aspirations take flight,\nNothing can hold back its relentless might.",
      // REVIEW: native speaker — poem_zh draft
      poem_zh:
        "一份对「更多」的渴望，目光却清明如镜，\n它大步向前，将恐惧抛在身后。\n坦荡无惧，把疆界留在原地，\n一股变革之力，与决意对齐同行。\n它廓清道路，让抱负振翅高飞，\n没有什么能阻拦这股不肯停歇的力量。",
      spell_en: "Everything in my way becomes part of my way.",
      // REVIEW: native speaker — spell_zh draft
      spell_zh: "途经我的一切，都成为我的道路本身。",
      notes: [
        { family: "floral", weight: 40 },
        { family: "musk",   weight: 25 },
        { family: "wood",   weight: 15 },
        { family: "spices", weight: 10 },
        { family: "citrus", weight: 5 },
      ],
      intensity: "invigorating",
      hz: 19888,
    },
    {
      id: "LPG055",
      name_en: "Lady Pop",
      name_zh: "流行女王",
      poem_en:
        "Amidst the sun's warm, radiant groove,\nA bright expression, with nothing to prove.\nIt dances like a perfect sunny day,\nEffortless joy in every sway.\nA spirit that finds delight anew,\nIn simple things, both old and true.\nA signature of pleasures so rare,\nSpontaneous attraction, beyond compare.",
      // REVIEW: native speaker — poem_zh draft
      poem_zh:
        "在阳光温暖明亮的律动之间，\n一种明亮的表达，无需自证。\n它跳起舞来，像一个晴朗无云的日子，\n每一次摇曳，都是不费力的欢愉。\n一种总能重新寻得欣喜的精神，\n在最简单的事物里，旧而弥真。\n那是珍罕愉悦的印记——\n一场自发的吸引，无可比拟。",
      spell_en: "Anything outside the rhythm disappears from the composition.",
      // REVIEW: native speaker — spell_zh draft
      spell_zh: "一切不合拍者，都将从这乐章中消失。",
      notes: [
        { family: "floral", weight: 42 },
        { family: "musk",   weight: 28 },
        { family: "citrus", weight: 18 },
        { family: "spices", weight: 12 },
      ],
      intensity: "invigorating",
      hz: 788,
    },
    {
      id: "LPG056",
      name_en: "Would you be mine?",
      name_zh: "你会是我的吗？",
      poem_en:
        "A clear desire with a confident call,\nMoves toward its aim, sure of it all.\nThe answer awaits, already there,\nA dance of attraction floats in the air.\nIntent and certainty shape the path,\nGuided by fate's gentle math.\nThe question posed, though outcome known,\nA journey of longing, now fully grown.",
      // REVIEW: native speaker — poem_zh draft
      poem_zh:
        "一份清晰的渴望，一声笃定的召唤，\n向着目标行进，对全局成竹在胸。\n答案早就在那里等候，\n一场吸引之舞，漂浮于空气之中。\n意图与笃定，共同塑形这段路途，\n由命运温柔的算学一路引导。\n问题已然提出，结局早已知晓——\n一场渴望的旅程，至此长成。",
      spell_en: "I lift what clouds the answer.",
      // REVIEW: native speaker — spell_zh draft
      spell_zh: "我拂去遮蔽答案的云翳。",
      notes: [
        { family: "floral", weight: 40 },
        { family: "musk",   weight: 25 },
        { family: "greens", weight: 18 },
        { family: "wood",   weight: 10 },
      ],
      intensity: "exhilarating",
      hz: 477,
    },
    {
      id: "LPG060",
      name_en: "I Am the Summer",
      name_zh: "我就是夏天",
      poem_en:
        "A salty breeze upon the lips,\nA memory that gently grips.\nIt carries warmth of sunlit skin,\nAnd freedom in the air so thin.\nIt whispers tales of distant shores,\nWhere nature opens all the doors.\nA moment where the body knows,\nA different way to breathe and flow.",
      // REVIEW: native speaker — poem_zh draft
      poem_zh:
        "唇上一抹带着盐味的海风，\n一段记忆，温柔地攥紧不放。\n它携带阳光晒暖的肌肤的温度，\n携着自由，在稀薄的空气里。\n它低语着遥远海岸的传说，\n在那里，自然敞开所有的门。\n有那么一瞬，身体忽然懂得：\n呼吸与流动，原来另有其道。",
      spell_en: "I ride the wave longer, returning ready for the next one.",
      // REVIEW: native speaker — spell_zh draft
      spell_zh: "我在浪尖驰骋得更久，归来时，已为下一道浪整装待发。",
      notes: [
        { family: "citrus", weight: 50 },
        { family: "fruit",  weight: 30 },
        { family: "spices", weight: 20 },
      ],
      intensity: "overstimulating",
      hz: 18888,
      season: "summer",
    },
    {
      id: "LPG064",
      name_en: "Breath of Life",
      name_zh: "生命的气息",
      poem_en:
        "A living force that senses the end,\nWhere breath ceases, it knows when.\nThrough rigid forms, it gently weaves,\nSetting free what time deceives.\nIt loosens patterns bound too tight,\nRevealing space, hidden from sight.\nWhat once stood still, now finds its way,\nIn newfound paths, begins to sway.",
      // REVIEW: native speaker — poem_zh draft
      poem_zh:
        "一股鲜活的力量，感知终结的临近，\n气息止歇之处，它自会知晓。\n它穿过僵硬的形制，温柔穿行，\n解开时间的谎言所缚的一切。\n它松开捆缚过紧的旧习，\n让藏于视野之外的空间显形。\n曾经静止的，如今找到出路，\n在崭新的路径上，开始摇曳生姿。",
      spell_en: "Your form has become too tight. I change your state.",
      // REVIEW: native speaker — spell_zh draft
      spell_zh: "你的形骸已太过紧绷。我来改变你的状态。",
      notes: [
        { family: "spices", weight: 35 },
        { family: "citrus", weight: 25 },
        { family: "wood",   weight: 15 },
        { family: "greens", weight: 10 },
        { family: "musk",   weight: 6 },
        { family: "floral", weight: 5 },
      ],
      intensity: "intriguing",
      hz: 477,
    },
    {
      id: "LPG065",
      name_en: "Fire Walk With Me",
      name_zh: "与火同行",
      poem_en:
        "A dangerous intensity moves,\nWhere contradictions collide,\nEntering hidden places, where\nCertainty starts to divide.\nIt exposes what was concealed,\nBeneath the surface guise,\nThe old arrangement loses power,\nAs new truths arise.",
      // REVIEW: native speaker — poem_zh draft
      poem_zh:
        "一股危险的高热正在移动，\n在矛盾彼此相撞之处，\n它潜入藏匿之地——\n在那里，笃定开始分崩离析。\n它揭穿被掩埋的一切，\n卸下伪装的表层之下，\n旧的秩序节节失守，\n新的真相，正破土而出。",
      spell_en: "This is intense. This is dangerous. This is useful.",
      // REVIEW: native speaker — spell_zh draft
      spell_zh: "这很烈。这很险。这很有用。",
      notes: [
        { family: "spices", weight: 40 },
        { family: "musk",   weight: 25 },
        { family: "resins", weight: 18 },
        { family: "fruit",  weight: 10 },
      ],
      intensity: "intriguing",
      hz: 888,
    },
    {
      id: "LPG066",
      name_en: "Loverman",
      name_zh: "博爱男士",
      poem_en:
        "A primal desire, certain and clear,\nGuided by instincts that draw it near.\nIt moves with purpose, bold and free,\nUnwavering, without apology.\nIntensity fuels the fervent chase,\nTurning pursuit into an embraced space.\nWhat is chosen, held close and unfurled,\nBecomes the center of its world.",
      // REVIEW: native speaker — poem_zh draft
      poem_zh:
        "一份原初的欲望，笃定而分明，\n由本能引路，步步逼近。\n它目标明确的行动，果敢而自由，\n不曾犹疑，亦无需致歉。\n炽热助燃这场沸腾的追逐，\n将追赶本身，化作一个被拥抱的空间。\n凡被选中者，被紧拥、被舒展，\n终成为它世界的中心。",
      spell_en: "Turn desire into the encounter.",
      // REVIEW: native speaker — spell_zh draft
      spell_zh: "将欲望，化作一场相逢。",
      notes: [
        { family: "greens", weight: 35 },
        { family: "wood",   weight: 25 },
        { family: "resins", weight: 15 },
        { family: "spices", weight: 10 },
        { family: "musk",   weight: 6 },
        { family: "floral", weight: 5 },
      ],
      intensity: "outstanding",
      hz: 993,
    },
    {
      id: "LPG069",
      name_en: "I Am the Autumn",
      name_zh: "我就是秋天",
      poem_en:
        "A vivid spark of confidence ignites,\nWith depth and unexpected might.\nCapturing senses in richness profound,\nA presence that can't be ignored or drowned.\nA character weaving complexity's thread,\nAttraction and contrast in expression spread.\nThe one unforeseen in the crowd's sway,\nBecomes the unforgettable, night and day.",
      // REVIEW: native speaker — poem_zh draft
      poem_zh:
        "一簇鲜明的自信火花，骤然点燃，\n带着深度，与出乎意料的伟力。\n以丰沛将感官尽数俘获，\n一种无从忽视、也淹不灭的存在。\n它以复杂的丝线织就性情，\n吸引与反差，在表达中铺陈。\n人潮涌动中那未可预见的一个，\n昼夜之间，成为无可忘却。",
      spell_en: "I make my impact unavoidable.",
      // REVIEW: native speaker — spell_zh draft
      spell_zh: "我让我的降临，无可回避。",
      notes: [
        { family: "floral", weight: 35 },
        { family: "wood",   weight: 25 },
        { family: "spices", weight: 15 },
        { family: "musk",   weight: 10 },
        { family: "resins", weight: 6 },
        { family: "citrus", weight: 5 },
      ],
      intensity: "overstimulating",
      hz: 3636,
      season: "autumn",
    },
    {
      id: "LPG078",
      name_en: "I Am the Winter",
      name_zh: "我就是冬天",
      poem_en:
        "A colossal spirit beyond the bounds,\nReaching where separation surrounds.\nIn distance, it sees a chance to weave,\nConnections others can't perceive.\nIts size a veil for depths untold,\nIn whispers, secrets it does hold.\nFarthest places draw near and close,\nWhen bonds of strength and love impose.",
      // REVIEW: native speaker — poem_zh draft
      poem_zh:
        "一尊庞大的魂魄，越出一切边界，\n抵达被隔绝层层围困之地。\n在距离之中，它看见编织的时机，\n那是旁人无从察觉的联结。\n它的体量，掩着未曾言说的深壑，\n在低语里，握着不肯示人的秘密。\n最远的地方，贴近又贴近——\n当力量与爱的羁绊，落定为誓。",
      spell_en: "I am here, even when I am far.",
      // REVIEW: native speaker — spell_zh draft
      spell_zh: "我纵远隔千里，也无处不在。",
      notes: [
        { family: "greens", weight: 35 },
        { family: "wood",   weight: 25 },
        { family: "spices", weight: 15 },
        { family: "citrus", weight: 10 },
        { family: "musk",   weight: 6 },
      ],
      intensity: "overstimulating",
      hz: 13888,
      season: "winter",
    },
  ];

  /* ---------- Seasons set blurbs ---------- */
  const SEASONS = [
    { key: "spring", en: "Spring", zh: "春", tag_en: "I Am the Spring", tag_zh: "我就是春天",
      blurb_en: "The sovereign of emergence — lush, bright, impossible to ignore.",
      blurb_zh: "喷薄而出的君主——丰盈明亮，令人无从忽视。" }, // REVIEW: native speaker
    { key: "summer", en: "Summer", zh: "夏", tag_en: "I Am the Summer", tag_zh: "我就是夏天",
      blurb_en: "A salty breeze, sunlit skin, freedom in thin air.",
      blurb_zh: "带盐味的海风，晒暖的肌肤，稀薄空气里的自由。" }, // REVIEW: native speaker
    { key: "autumn", en: "Autumn", zh: "秋", tag_en: "I Am the Autumn", tag_zh: "我就是秋天",
      blurb_en: "A vivid spark with unexpected might; the unforgettable one.",
      blurb_zh: "鲜明的火花，出乎意料的伟力；令人无可忘却。" }, // REVIEW: native speaker
    { key: "winter", en: "Winter", zh: "冬", tag_en: "I Am the Winter", tag_zh: "我就是冬天",
      blurb_en: "A colossal spirit — present even at the farthest distance.",
      blurb_zh: "庞大的魂魄——纵远隔千里，也无处不在。" }, // REVIEW: native speaker
  ];

  /* ---------- UI strings (EN / ZH) — mystical voice ----------
     ZH microcopy is drafted; every line that isn't from the printed
     cards is flagged // REVIEW: native speaker. */
  const I18N = {
    brand: {
      incantation: { en: "Yeelorya!", zh: "耶洛里亚！" },
      collection:  { en: "The VSPellbinding Eightfold", zh: "八重诱惑" },
    },
    langLabel: { en: "中文", zh: "EN" },               // the toggle shows the *other* language
    tagline: { en: "Love-potion oils & elixir balms", zh: "爱情魔油 · 灵药香脂" },
    nav: {
      home:       { en: "The Grimoire", zh: "魔法典籍" },          // REVIEW: native speaker
      quiz:       { en: "The Divination", zh: "占卜仪式" },        // REVIEW: native speaker
      collection: { en: "Perfume Gallery", zh: "香水画廊" },       // REVIEW: native speaker
      seasons:    { en: "Wheel of the Year", zh: "年轮之环" },     // REVIEW: native speaker
      picks:      { en: "Your Cabinet", zh: "你的药柜" },          // REVIEW: native speaker
    },
    home: {
      begin:    { en: "Touch the seal to begin", zh: "触碰封印，开启仪式" }, // REVIEW: native speaker
      hint:     { en: "25 vials · 8 elements · one fate", zh: "二十五瓶魔药 · 八重元素 · 一个命运" }, // REVIEW: native speaker
      hearts:   { en: "{n} sealed in your cabinet", zh: "已封存 {n} 瓶于药柜" }, // REVIEW: native speaker
    },
    quiz: {
      title:     { en: "Which spell claims you?", zh: "哪道魔咒选中了你？" }, // REVIEW: native speaker
      intro:     { en: "Ask, and the potions will answer.", zh: "发问吧，魔药自会回应。" }, // REVIEW: native speaker
      introCta:  { en: "Begin the divination", zh: "开始占卜" },   // REVIEW: native speaker
      subtitle:  { en: "Five cards will be drawn.", zh: "将为你抽出五张牌。" }, // REVIEW: native speaker
      progress:  { en: "Card {a} of {b}", zh: "第 {a} / {b} 张牌" }, // REVIEW: native speaker
      back:      { en: "Return the card", zh: "收回此牌" },        // REVIEW: native speaker
      next:      { en: "Draw the next", zh: "抽下一张" },          // REVIEW: native speaker
      skip:      { en: "Leave the circle", zh: "离开仪式" },       // REVIEW: native speaker
      restart:   { en: "Divine again", zh: "再问一次" },           // REVIEW: native speaker
      yourSpell: { en: "The spell that claims you", zh: "选中你的魔咒" }, // REVIEW: native speaker
      runnerUp:  { en: "The shadow potion", zh: "影子魔药" },      // REVIEW: native speaker
      reveal:    { en: "The smoke parts…", zh: "烟霭散开……" },     // REVIEW: native speaker
      viewCard:  { en: "Open the card", zh: "翻开此卡" },
      reason:    { en: "The potions whisper: ", zh: "魔药低语：" }, // REVIEW: native speaker
      matchNoteFam: { en: "your love of {f} called to it", zh: "你对{f}的偏爱唤醒了它" }, // REVIEW: native speaker
      matchIntensity: { en: "its {i} nature mirrors your own", zh: "它的{i}气质映照出你的本相" }, // REVIEW: native speaker
      matchSeason: { en: "it was distilled in your season", zh: "它在你的季节里酿成" }, // REVIEW: native speaker
      matchDefault: { en: "it was already watching you", zh: "它早已在注视你" }, // REVIEW: native speaker
      ratioHint: { en: "Drag the gold stoppers to blend your ratios. Arrow keys move 1%; Shift + arrow moves 5%.", zh: "拖动金色瓶塞调配比例。方向键调整 1%，Shift + 方向键调整 5%。" }, // REVIEW: native speaker
      ratioTotal: { en: "Your formula always totals 100%", zh: "你的配方总计始终为 100%" }, // REVIEW: native speaker
      ratioReset: { en: "Reset to equal ratios", zh: "重置为均等比例" }, // REVIEW: native speaker
      ratioBoundary: { en: "Ratio boundary between {a} and {b}", zh: "{a}与{b}之间的比例分界" }, // REVIEW: native speaker
      ratioAnnounce: { en: "{f} is now {n} percent. Formula total 100 percent.", zh: "{f}现为 {n}%。配方总计 100%。" }, // REVIEW: native speaker
    },
    q: {
      mood:     { en: "What stirs in you tonight?", zh: "今夜，你心中翻涌着什么？" }, // REVIEW: native speaker
      season:   { en: "Which season holds your name?", zh: "哪个季节握有你的名字？" }, // REVIEW: native speaker
      boldness: { en: "How loud is your aura?", zh: "你的气场有多强？" }, // REVIEW: native speaker
      families: { en: "Which elements do you crave? Drag to choose your ratios", zh: "你渴求哪些元素？拖动以调配比例" }, // REVIEW: native speaker
      closeness:{ en: "How near may they approach?", zh: "他人可以靠你多近？" }, // REVIEW: native speaker
    },
    cards: {
      vialNo:    { en: "Vial No.", zh: "瓶号" },
      flip:      { en: "Turn the card", zh: "翻转此牌" },         // REVIEW: native speaker
      unflip:    { en: "Return to the poem", zh: "回到诗篇" },     // REVIEW: native speaker
      formula:   { en: "Intuitively Synchronized Formula", zh: "感官同步配方" },
      intensity: { en: "Empirical Scent Intensity", zh: "感官芳香强度" },
      hearHz:    { en: "Hear its incantation", zh: "聆听其咒音" }, // REVIEW: native speaker
      hearingHz: { en: "The tone lingers…", zh: "咒音回荡……" },   // REVIEW: native speaker
      foldNote:  { en: "{orig} Hz is folded down by octaves to {fold} Hz — gentle on mortal ears.", zh: "{orig} Hz 已按八度折叠至 {fold} Hz，以护凡人之耳。" }, // REVIEW: native speaker
      spell:     { en: "The Spell", zh: "施咒" },
      incant:    { en: "Yeelorya!", zh: "耶洛里亚！" },
      prev:      { en: "Previous vial", zh: "上一瓶" },
      next:      { en: "Next vial", zh: "下一瓶" },
      close:     { en: "Close", zh: "关闭" },
      favAdd:    { en: "Seal it in your cabinet", zh: "封入药柜" },     // REVIEW: native speaker
      favRemove: { en: "Unseal from your cabinet", zh: "移出药柜" },    // REVIEW: native speaker
      share:     { en: "Craft a talisman", zh: "打造护符" },            // REVIEW: native speaker
    },
    filters: {
      families:  { en: "Ingredients", zh: "药材" },               // REVIEW: native speaker
      anyOf:     { en: "vials containing any ticked element", zh: "含有任一勾选元素的魔药" }, // REVIEW: native speaker
      clearFam:  { en: "Unbind", zh: "解除" },                    // REVIEW: native speaker
      feel:      { en: "I wish to feel…", zh: "我渴望感到……" },   // REVIEW: native speaker
      all:       { en: "All potions", zh: "全部魔药" },           // REVIEW: native speaker
      shown:     { en: "{n} vials answer", zh: "{n} 瓶应答" },    // REVIEW: native speaker
      none:      { en: "No vial answers — loosen one thread.", zh: "无瓶应答——松开一根丝线。" }, // REVIEW: native speaker
    },
    seasons: {
      title:   { en: "Wheel of the Year", zh: "年轮之环" },       // REVIEW: native speaker
      subtitle:{ en: "One vial for every turning of the year", zh: "一年轮转，每季一瓶" }, // REVIEW: native speaker
      order:   { en: "Claim all four: {ids}", zh: "收齐四瓶：{ids}" }, // REVIEW: native speaker
    },
    picks: {
      title:     { en: "Your Cabinet", zh: "你的药柜" },          // REVIEW: native speaker
      subtitle:  { en: "Show this scroll at the counter to claim them.", zh: "将此卷轴出示于柜台，即可请回。" }, // REVIEW: native speaker
      empty:     { en: "Your cabinet is empty — the shelf awaits.", zh: "药柜尚空——静候入藏。" }, // REVIEW: native speaker
      remove:    { en: "Unseal", zh: "解封" },                    // REVIEW: native speaker
      open:      { en: "Consult", zh: "召见" },                   // REVIEW: native speaker
      clear:     { en: "Empty the cabinet", zh: "清空药柜" },     // REVIEW: native speaker
      note:      { en: "Seals live on this device only.", zh: "封印仅存于此器之中。" }, // REVIEW: native speaker
      scroll:    { en: "The scroll of numbers", zh: "瓶号卷轴" }, // REVIEW: native speaker
    },
    share: {
      title:     { en: "Your Talisman", zh: "你的护符" },         // REVIEW: native speaker
      mySpell:   { en: "My spell:", zh: "我的魔咒：" },
      download:  { en: "Save the talisman", zh: "收下护符" },     // REVIEW: native speaker
      shareTo:   { en: "Share to…", zh: "分享到……" },
      savedHint: { en: "The talisman is yours — find it in Photos / Files, then carry it to WeChat, Xiaohongshu or Instagram.", zh: "护符已归你——在相册或文件中找到它，带往微信、小红书或 Instagram。" }, // REVIEW: native speaker
      contact:   { en: "Contact", zh: "联系" },
      follow:    { en: "Follow", zh: "关注" },
      wechat:    { en: "WeChat", zh: "微信" },
      wechatOfficial: { en: "WeChat Official Account", zh: "微信公众号" }, // REVIEW: native speaker
      xhs:       { en: "Xiaohongshu", zh: "小红书" },
      ig:        { en: "Instagram", zh: "Instagram" },
      close:     { en: "Close", zh: "关闭" },
    },
    admin: {
      title:   { en: "Keeper's panel", zh: "守药人面板" },
      reset:   { en: "Clear all favorites", zh: "清除全部收藏" },
      cancel:  { en: "Cancel", zh: "取消" },
      done:    { en: "The cabinet is empty. The ritual begins anew.", zh: "药柜已空，仪式重新开始。" }, // REVIEW: native speaker
      confirm: { en: "Empty the cabinet for the next visitor?", zh: "为下一位来客清空药柜？" }, // REVIEW: native speaker
    },
    ambience: {
      label:    { en: "Ambience", zh: "氛围之音" },               // REVIEW: native speaker
    },
    a11y: {
      logo:        { en: "VSP logo — hold 3 seconds for staff panel", zh: "VSP 标志——长按 3 秒打开工作人员面板" },
      langToggle:  { en: "Switch language", zh: "切换语言" },
      themeToggle: { en: "Turn the moon — switch light or dark", zh: "拨转月相——切换深浅模式" }, // REVIEW: native speaker
      ambienceToggle: { en: "Light the ambience — soft chimes and drone", zh: "点燃氛围之音——轻柔钟鸣与低吟" }, // REVIEW: native speaker
      heart:       { en: "Seal this vial in your cabinet", zh: "将这瓶魔油封入药柜" }, // REVIEW: native speaker
      vialPhoto:   { en: "Vial photograph of {name}", zh: "{name} 的瓶身照片" },
      qr:          { en: "VSP WeChat Official Account QR code", zh: "VSP 微信公众号二维码" }, // REVIEW: native speaker
      filterChip:  { en: "Filter by {f}", zh: "按{f}筛选" },
      attractExit: { en: "Touch the seal to begin", zh: "触碰封印，开启仪式" }, // REVIEW: native speaker
    },
  };

  /* ---------- Quiz definition ----------
     Each option carries: intensity affinity {key:points},
     family affinity {family:points}, optional season key. */
  const QUIZ = [
    {
      id: "mood", // REVIEW: native speaker — ZH option wording
      options: [
        { id: "playful", en: "Playful — the day is light", zh: "玩心正起——今日轻盈",
          intensity: { invigorating: 2, exhilarating: 1 }, families: { citrus: 1, fruit: 1 } },
        { id: "yearning", en: "Yearning — something is missing", zh: "思慕——心里缺了一角",
          intensity: { exhilarating: 2 }, families: { musk: 1, resins: 1 } },
        { id: "magnetic", en: "Magnetic — eyes keep finding me", zh: "魅惑——目光总落回我身上",
          intensity: { intriguing: 2 }, families: { floral: 1, spices: 1 } },
        { id: "unbothered", en: "Unbothered — do not disturb", zh: "勿扰——请勿靠近",
          intensity: { overstimulating: 2 }, families: { wood: 1, greens: 1 } },
        { id: "untamed", en: "Untamed — let the room beware", zh: "桀骜——让全场小心",
          intensity: { outstanding: 2 }, families: { wood: 1, spices: 1 } },
      ],
    },
    {
      id: "season",
      options: [
        { id: "spring", en: "Spring", zh: "春", season: "spring",
          intensity: { overstimulating: 0.5 }, families: { floral: 1.5, greens: 1 } },
        { id: "summer", en: "Summer", zh: "夏", season: "summer",
          intensity: { overstimulating: 0.5 }, families: { citrus: 1.5, fruit: 1 } },
        { id: "autumn", en: "Autumn", zh: "秋", season: "autumn",
          intensity: { overstimulating: 0.5 }, families: { spices: 1.5, resins: 1 } },
        { id: "winter", en: "Winter", zh: "冬", season: "winter",
          intensity: { overstimulating: 0.5 }, families: { wood: 1.5, musk: 1 } },
      ],
    },
    {
      id: "boldness",
      options: [
        { id: "whisper", en: "A whisper", zh: "一缕轻语",
          intensity: { invigorating: 2 }, families: { greens: 1, citrus: 1 } },
        { id: "buzz", en: "A buzz", zh: "一圈微醺涟漪",
          intensity: { exhilarating: 2 }, families: { floral: 1, musk: 0.5 } },
        { id: "flame", en: "A flame", zh: "一簇火焰",
          intensity: { intriguing: 2 }, families: { spices: 1, resins: 1 } },
        { id: "thunder", en: "A thunderclap", zh: "一声惊雷",
          intensity: { outstanding: 1.5, overstimulating: 1.5 }, families: { wood: 1, spices: 0.5 } },
      ],
    },
    {
      id: "families",  // multi-select of FAMILIES keys; scoring handled in quiz.js
      options: FAMILIES.map(function (f) {
        return { id: f.key, en: f.en, zh: f.zh, families: {} };
      }),
    },
    {
      id: "closeness",
      options: [
        { id: "distance", en: "A polite arm's length", zh: "保持优雅的一臂距离",
          intensity: { invigorating: 2 }, families: { citrus: 1, greens: 1 } },
        { id: "wonder", en: "Near enough to wonder", zh: "近到引人遐想",
          intensity: { intriguing: 2 }, families: { floral: 1, spices: 0.5 } },
        { id: "yearn", en: "Close enough to yearn", zh: "近到生出思慕",
          intensity: { exhilarating: 2 }, families: { musk: 1, resins: 0.5 } },
        { id: "untamed2", en: "Untamed closeness", zh: "桀骜不驯的贴近",
          intensity: { outstanding: 2 }, families: { wood: 1, spices: 0.5 } },
        { id: "immersed", en: "Total sensory immersion", zh: "感官彻底沦陷",
          intensity: { overstimulating: 2 }, families: { resins: 1, musk: 0.5 } },
      ],
    },
  ];

  /* ---------- helpers ---------- */
  function byId(id) {
    for (var i = 0; i < VIALS.length; i++) if (VIALS[i].id === id) return VIALS[i];
    return null;
  }

  return {
    vials: VIALS,
    families: FAMILIES,
    intensities: INTENSITIES,
    seasons: SEASONS,
    quiz: QUIZ,
    i18n: I18N,
    byId: byId,
  };
})();