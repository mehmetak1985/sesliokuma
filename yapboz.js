// 5 Seviye × 5 Kelime — Kademeli Zorluk (3-7 Harf)
const SEViYELER=[
  [ // 1. Seviye: 3 Harfli
    {kelime:'MUZ', emoji:'🍌'}, {kelime:'KAZ', emoji:' Swan'}, 
    {kelime:'ARI', emoji:'🐝'}, {kelime:'TOP', emoji:'⚽'}, {kelime:'ÇAY', emoji:'☕'}
  ],
  [ // 2. Seviye: 4 Harfli
    {kelime:'ELMA', emoji:'🍎'}, {kelime:'KEDİ', emoji:'🐱'}, 
    {kelime:'KUZU', emoji:'🐑'}, {kelime:'GEMİ', emoji:'🚢'}, {kelime:'KAPI', emoji:'🚪'}
  ],
  [ // 3. Seviye: 5 Harfli
    {kelime:'ÇİLEK', emoji:'🍓'}, {kelime:'KÖPEK', emoji:'🐶'}, 
    {kelime:'RADYO', emoji:'📻'}, {kelime:'ŞEKER', emoji:'🍬'}, {kelime:'KAŞIK', emoji:'🥄'}
  ],
  [ // 4. Seviye: 6 Harfli
    {kelime:'KARPUZ', emoji:'🍉'}, {kelime:'GÖZLÜK', emoji:'👓'}, 
    {kelime:'TAVŞAN', emoji:'🐰'}, {kelime:'PEYNİR', emoji:'🧀'}, {kelime:'CETVEL', emoji:'📏'}
  ],
  [ // 5. Seviye: 7 Harfli
    {kelime:'ZÜRAFA', emoji:'🦒'}, {kelime:'TELEFON', emoji:'📱'}, 
    {kelime:'PENCERE', emoji:'🪟'}, {kelime:'ŞEMSİYE', emoji:'☂️'}, {kelime:'ELDİVEN', emoji:'🧤'}
  ]
];

// 7 harfli kelimelerin ekrana sığması için CSS güncellemesi (Koda ekle)
const style7 = document.createElement('style');
style7.innerHTML = `
  .harf-kutu { width: 40px !important; height: 50px !important; font-size: 1.2rem !important; }
  @media (max-width: 400px) { .harf-kutu { width: 35px !important; height: 45px !important; } }
`;
document.head.appendChild(style7);
