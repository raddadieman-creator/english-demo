// أنشطة المهارات الأربع — مبنية على مفردات وقواعد الوحدتين 4 و5

export const LISTENING = {
  pick: [
    { say: 'I usually go to the rink on weekends.', q: 'Where does she go?', opts: ['the rink', 'the library', 'the mall'], a: 'the rink', u: 'u4' },
    { say: 'How often do you work out? Three times a week.', q: 'How often?', opts: ['3 times a week', 'once a week', 'every day'], a: '3 times a week', u: 'u4' },
    { say: 'My brother seldom plays video games.', q: 'How often does he play video games?', opts: ['seldom', 'always', 'usually'], a: 'seldom', u: 'u4' },
    { say: 'I know how to paint, but I don’t know how to cook.', q: 'What can she do?', opts: ['paint', 'cook', 'ice-skate'], a: 'paint', u: 'u4' },
    { say: 'Is there any milk? No, there isn’t any.', q: 'Is there milk?', opts: ['No', 'Yes', 'A lot'], a: 'No', u: 'u5' },
    { say: 'Can I have a bowl of soup, please?', q: 'What does she order?', opts: ['a bowl of soup', 'a slice of pizza', 'a glass of milk'], a: 'a bowl of soup', u: 'u5' },
    { say: 'This tea is too hot. I can’t drink it.', q: 'What is the problem?', opts: ['too hot', 'too cold', 'too sweet'], a: 'too hot', u: 'u5' },
    { say: 'We need two loaves of bread and a bag of rice.', q: 'How much bread?', opts: ['two loaves', 'one loaf', 'a slice'], a: 'two loaves', u: 'u5' },
  ],
  dictation: [
    { say: 'hobby', u: 'u4' }, { say: 'work out', u: 'u4' }, { say: 'pastime', u: 'u4' }, { say: 'board games', u: 'u4' },
    { say: 'cheese', u: 'u5' }, { say: 'vegetables', u: 'u5' }, { say: 'enough', u: 'u5' }, { say: 'menu', u: 'u5' },
  ],
  dialogs: [
    {
      id: 'd1', u: 'u4', title: 'At the Sports Club', ar: 'في النادي الرياضي',
      lines: [
        ['Sara', 'Hi Lama! What do you do in your free time?'],
        ['Lama', 'I love ice-skating. I go to the rink every Saturday.'],
        ['Sara', 'Really? How often do you practice?'],
        ['Lama', 'Twice a week. And you? What’s your favorite pastime?'],
        ['Sara', 'I enjoy painting. I usually paint after school.'],
        ['Lama', 'Do you know how to paint faces?'],
        ['Sara', 'Yes, I do! I can paint your face for the school party.'],
      ],
      qs: [
        { q: 'What is Lama’s pastime?', opts: ['ice-skating', 'painting', 'cooking'], a: 'ice-skating' },
        { q: 'How often does Lama practice?', opts: ['twice a week', 'every day', 'once a month'], a: 'twice a week' },
        { q: 'When does Sara usually paint?', opts: ['after school', 'in the morning', 'on Saturday'], a: 'after school' },
      ],
    },
    {
      id: 'd2', u: 'u5', title: 'At the Café', ar: 'في المقهى',
      lines: [
        ['Waiter', 'Good evening. Are you ready to order?'],
        ['Noura', 'Yes, please. I’d like a chicken sandwich.'],
        ['Waiter', 'Would you like some juice?'],
        ['Noura', 'Yes, a glass of orange juice, please. Is there any ice cream?'],
        ['Waiter', 'Sorry, there isn’t any ice cream today. We have some chocolate cake.'],
        ['Noura', 'Great! A piece of chocolate cake, please.'],
      ],
      qs: [
        { q: 'What does Noura order to eat?', opts: ['a chicken sandwich', 'a pizza', 'soup'], a: 'a chicken sandwich' },
        { q: 'What does she drink?', opts: ['orange juice', 'milk', 'tea'], a: 'orange juice' },
        { q: 'Why doesn’t she get ice cream?', opts: ['there isn’t any', 'it is too cold', 'it is too expensive'], a: 'there isn’t any' },
      ],
    },
  ],
}

export const SPEAKING = {
  read: [
    { t: 'What do you do in your free time?', u: 'u4' },
    { t: 'I usually hang out with my friends on weekends.', u: 'u4' },
    { t: 'I know how to ice-skate very well.', u: 'u4' },
    { t: 'Painting is my favorite pastime.', u: 'u4' },
    { t: 'Is there any ice cream in the fridge?', u: 'u5' },
    { t: 'Can I have a glass of milk, please?', u: 'u5' },
    { t: 'The soup is too hot.', u: 'u5' },
    { t: 'I would like a piece of chocolate cake.', u: 'u5' },
  ],
  twisters: [
    'Six sweet cakes for six sweet friends.',
    'Fresh fried fish, fish fresh fried.',
    'Betty bought a bit of better butter.',
  ],
  talk: [
    { u: 'u4', q: 'Tell me about your favorite pastime.', hints: ['My favorite pastime is …', 'I … every / twice a week.', 'I enjoy … because …'] },
    { u: 'u4', q: 'What do you know how to do well?', hints: ['I know how to …', 'I learned it when …'] },
    { u: 'u5', q: 'What is your favorite food? How do you make it?', hints: ['My favorite food is …', 'First, chop / boil / mix …', 'It needs some …'] },
    { u: 'u5', q: 'Order a meal at a café.', hints: ['I’d like …, please.', 'Can I have a glass of …?', 'Is there any …?'] },
  ],
}

export const READING = [
  {
    id: 'r1', u: 'u4', title: 'Reema’s Busy Weekend', ar: 'عطلة ريم المزدحمة', level: 1,
    text: [
      'Reema is fourteen years old, and she has a lot of hobbies. Her favorite pastime is calligraphy. She practices writing Arabic letters three times a week, and she always uses a special pen.',
      'On Fridays, Reema usually goes cycling with her father in the park. She knows how to ride a bike very well. Her little brother doesn’t know how to ride yet, so he watches them.',
      'Reema seldom plays video games. She says, “Reading is more fun for me.” She enjoys reading adventure stories, and she wants to write her own story one day.',
    ],
    gloss: { calligraphy: 'الخط العربي', practices: 'تتدرّب', special: 'خاص', cycling: 'ركوب الدراجة', yet: 'بعد / حتى الآن', adventure: 'مغامرة', own: 'خاص بها' },
    qs: [
      { q: 'What is Reema’s favorite pastime?', opts: ['calligraphy', 'cycling', 'video games'], a: 'calligraphy' },
      { q: 'How often does she practice calligraphy?', opts: ['three times a week', 'every day', 'on Fridays'], a: 'three times a week' },
      { q: 'Reema’s brother knows how to ride a bike.', opts: ['True', 'False'], a: 'False' },
      { q: 'What does Reema want to do one day?', opts: ['write her own story', 'buy a bike', 'play video games'], a: 'write her own story' },
    ],
  },
  {
    id: 'r2', u: 'u4', title: 'Unusual Hobbies Around the World', ar: 'هوايات غير مألوفة', level: 2,
    text: [
      'Most teens enjoy playing sports or hanging out with friends. But some people have very unusual hobbies.',
      'Geocaching is a treasure hunt for the modern world. Players use GPS on their phones to find small boxes that other players hide in parks, forests, and even cities. When they find a box, they write their name in a small notebook inside it.',
      'In Saudi Arabia, falconry is a famous traditional pastime. Falconers train their birds for months. A good falcon can fly very fast and come back to its owner. Falconry is part of the Intangible Cultural Heritage list of UNESCO.',
    ],
    gloss: { unusual: 'غير مألوف', 'treasure hunt': 'البحث عن كنز', hide: 'يُخفون', forests: 'غابات', notebook: 'دفتر', falconers: 'الصقّارون', train: 'يدرّبون', owner: 'صاحب' },
    qs: [
      { q: 'What do geocaching players use?', opts: ['GPS', 'maps on paper', 'falcons'], a: 'GPS' },
      { q: 'What do players write in the notebook?', opts: ['their name', 'a story', 'the time'], a: 'their name' },
      { q: 'Falconers train their birds for one day.', opts: ['True', 'False'], a: 'False' },
    ],
  },
  {
    id: 'r3', u: 'u5', title: 'A Picnic Plan', ar: 'خطة رحلة', level: 1,
    text: [
      'Huda and her family are going on a picnic tomorrow. Huda opens the fridge to check the food.',
      '“Is there any cheese?” asks her mother. “Yes, there is some,” says Huda. “But there isn’t any bread.” They need two loaves of bread and a bottle of water for each person.',
      'Huda wants to take ice cream, but her mother says, “It is too hot outside. The ice cream will melt!” So they decide to take some fruit and a box of cookies. Now the picnic basket is full enough!',
    ],
    gloss: { picnic: 'نزهة', check: 'تتفقد', melt: 'يذوب', decide: 'يقررون', basket: 'سلة', full: 'ممتلئة' },
    qs: [
      { q: 'Is there any cheese in the fridge?', opts: ['Yes, there is some.', 'No, there isn’t any.'], a: 'Yes, there is some.' },
      { q: 'How much bread do they need?', opts: ['two loaves', 'one slice', 'a bag'], a: 'two loaves' },
      { q: 'Why can’t they take ice cream?', opts: ['It is too hot outside.', 'There isn’t enough.', 'Huda doesn’t like it.'], a: 'It is too hot outside.' },
    ],
  },
  {
    id: 'r4', u: 'u5', title: 'Food Around the World', ar: 'الطعام حول العالم', level: 2,
    text: [
      'Today you can eat pizza, burgers, and ice cream in almost every country. But restaurants often change their menus for local tastes.',
      'In Saudi Arabia, many people love kabsa, a dish made with rice, meat or chicken, and spices. In Japan, sushi is popular, and people eat a lot of rice and fish. In Italy, people eat pasta with many kinds of sauce.',
      'Some foods travel around the world. Shawarma, for example, comes from the Middle East, and now you can find it in cities everywhere.',
    ],
    gloss: { almost: 'تقريبًا', 'local tastes': 'الأذواق المحلية', spices: 'بهارات', popular: 'مشهور', sauce: 'صلصة', everywhere: 'في كل مكان' },
    qs: [
      { q: 'Why do restaurants change their menus?', opts: ['for local tastes', 'to be cheaper', 'for tourists only'], a: 'for local tastes' },
      { q: 'What is kabsa made with?', opts: ['rice, meat or chicken, and spices', 'pasta and sauce', 'fish and rice'], a: 'rice, meat or chicken, and spices' },
      { q: 'Shawarma comes from Japan.', opts: ['True', 'False'], a: 'False' },
    ],
  },
]

export const WRITING = {
  builder: [
    { u: 'u4', words: ['I', 'usually', 'read', 'before', 'bed'], ar: 'عادةً أقرأ قبل النوم' },
    { u: 'u4', words: ['How', 'often', 'do', 'you', 'cook', '?'], ar: 'كم مرة تطبخين؟' },
    { u: 'u4', words: ['She', 'knows', 'how', 'to', 'paint'], ar: 'هي تعرف كيف ترسم' },
    { u: 'u4', words: ['Swimming', 'is', 'good', 'for', 'you'], ar: 'السباحة مفيدة لك' },
    { u: 'u5', words: ['Is', 'there', 'any', 'milk', '?'], ar: 'هل يوجد حليب؟' },
    { u: 'u5', words: ['I’d', 'like', 'a', 'glass', 'of', 'juice'], ar: 'أريد كوب عصير' },
    { u: 'u5', words: ['The', 'soup', 'is', 'too', 'hot'], ar: 'الشوربة حارّة جدًا' },
    { u: 'u5', words: ['There', 'isn’t', 'enough', 'sugar'], ar: 'لا يوجد سكر كافٍ' },
  ],
  tasks: [
    {
      id: 'w1', u: 'u4', title: 'My Favorite Pastime', ar: 'هوايتي المفضلة',
      prompt: 'Write a paragraph (50–80 words) about your hobby. What is it? What do you need? How often do you do it? Where and with whom? Why do you like it?',
      frame: 'My favorite pastime is … I need … I … (how often). I usually do it … with … I enjoy it because …',
      checks: [
        { id: 'len', ar: '50 كلمة على الأقل', test: (t) => t.trim().split(/\s+/).filter(Boolean).length >= 50 },
        { id: 'freq', ar: 'ظرف تكرار (always, usually, often…)', test: (t) => /\b(always|usually|often|sometimes|seldom|rarely|never)\b/i.test(t) },
        { id: 'howoften', ar: 'عبارة تكرار (once / twice / every…)', test: (t) => /\b(once|twice|three times|four times|every|on weekends)\b/i.test(t) },
        { id: 'ger', ar: 'مصدر بـ ‑ing بعد enjoy / like / love', test: (t) => /\b(enjoy|enjoys|like|likes|love|loves|hate|hates)\s+\w+ing\b/i.test(t) },
        { id: 'cap', ar: 'تبدأ الجمل بحرف كبير وتنتهي بنقطة', test: (t) => /^[A-Z]/.test(t.trim()) && /[.!?]$/.test(t.trim()) },
      ],
    },
    {
      id: 'w2', u: 'u5', title: 'My Family Recipe', ar: 'وصفة عائلتي',
      prompt: 'Write a recipe for your favorite dish. First list the ingredients with quantities. Then write the steps.',
      frame: 'Ingredients: a cup of …, two …, some … Steps: First, chop … Then, boil / fry … Next, mix … Finally, …',
      checks: [
        { id: 'len', ar: '40 كلمة على الأقل', test: (t) => t.trim().split(/\s+/).filter(Boolean).length >= 40 },
        { id: 'part', ar: 'اسم كمية (a cup of, a bag of…)', test: (t) => /\b(a|an|two|three|one)\s+(cup|cups|bag|bags|bottle|bottles|glass|glasses|piece|pieces|slice|slices|bowl|bowls|loaf|loaves|spoon|spoons|teaspoon|tablespoon|can|cans|kilo|kilos)\s+of\b/i.test(t) },
        { id: 'some', ar: 'some أو any', test: (t) => /\b(some|any)\b/i.test(t) },
        { id: 'verbs', ar: 'فعلان من أفعال الطبخ', test: (t) => (t.match(/\b(chop|boil|fry|bake|mix|add|pour|cut|slice|cook|stir|wash)\b/gi) || []).length >= 2 },
        { id: 'seq', ar: 'كلمات ترتيب (First, Then, Next, Finally)', test: (t) => (t.match(/\b(first|then|next|after that|finally)\b/gi) || []).length >= 2 },
      ],
    },
  ],
}
