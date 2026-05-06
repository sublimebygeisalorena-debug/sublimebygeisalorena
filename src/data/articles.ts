export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readingTime: string;
  date: string;
  cover: string;
  content: string[];
}

export const articles: Article[] = [
  {
    slug: "cronograma-capilar-pos-quimica",
    title: "Cronograma capilar pós-química: o guia definitivo",
    excerpt: "Como estruturar hidratação, nutrição e reconstrução para devolver saúde aos fios após processos químicos.",
    category: "Cronograma",
    readingTime: "6 min",
    date: "12 de março, 2026",
    cover: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1600&q=80",
    content: [
      "Cabelos que passaram por progressivas, colorações ou descolorações perdem proteínas, lipídios e água em diferentes proporções. O cronograma capilar é a forma mais eficiente de repor esses três pilares de maneira intercalada e inteligente.",
      "A hidratação devolve a água que evapora dos fios no dia a dia — é o passo mais frequente, ideal para cabelos opacos e ressecados. A nutrição repõe os lipídios, selando a cutícula e restaurando o brilho. Já a reconstrução repõe a queratina, devolvendo resistência e elasticidade.",
      "Para cabelos pós-química, recomendamos a frequência de 2 hidratações, 1 nutrição e 1 reconstrução a cada 4 lavagens, sempre acompanhadas de um shampoo de pH ácido como o pH Balance.",
      "Lembre-se: reconstrução em excesso fragiliza os fios. O equilíbrio é o segredo para cabelos saudáveis e brilhantes.",
    ],
  },
  {
    slug: "ph-acido-por-que-importa",
    title: "Por que o pH ácido é essencial para os seus fios",
    excerpt: "Entenda como o equilíbrio do pH protege a cutícula, prolonga a cor e evita o frizz no longo prazo.",
    category: "Ciência capilar",
    readingTime: "4 min",
    date: "28 de fevereiro, 2026",
    cover: "https://images.unsplash.com/photo-1560869713-7d0954430a87?w=1600&q=80",
    content: [
      "O cabelo saudável tem pH entre 4.5 e 5.5 — levemente ácido. Quando usamos produtos com pH alcalino, a cutícula se abre, deixando o fio poroso, opaco e suscetível ao frizz.",
      "Fórmulas de pH balanceado, como as da linha pH Balance, mantêm a cutícula selada, preservam a cor e devolvem o brilho natural a cada lavagem.",
      "Esse cuidado é ainda mais essencial para cabelos com química, que naturalmente já têm a estrutura mais sensível e tendência à porosidade.",
    ],
  },
  {
    slug: "como-aplicar-leave-in-corretamente",
    title: "Como aplicar leave-in corretamente (e por que isso muda tudo)",
    excerpt: "A técnica certa de aplicação multiplica os benefícios do seu finalizador termoprotetor.",
    category: "Modo de uso",
    readingTime: "3 min",
    date: "10 de fevereiro, 2026",
    cover: "https://images.unsplash.com/photo-1519415943484-9fa1873496d4?w=1600&q=80",
    content: [
      "O leave-in é o último escudo entre o cabelo e o calor da escova, do secador ou da chapinha. Quando bem aplicado, ele protege, define e nutre em um só gesto.",
      "Aplique 2 a 3 borrifadas no cabelo úmido, mecha por mecha, do meio para as pontas. Penteie suavemente para distribuir o produto e siga com a finalização desejada.",
      "Evite a raiz: o leave-in foi desenhado para o comprimento e pontas, onde os danos se concentram. Na raiz, ele pode pesar e oleosificar mais rápido.",
    ],
  },
  {
    slug: "reparador-de-pontas-aliado-do-comprimento",
    title: "Reparador de pontas: o aliado do crescimento saudável",
    excerpt: "Pontas seladas crescem mais. Entenda como integrar o reparador no seu ritual diário.",
    category: "Cuidados diários",
    readingTime: "4 min",
    date: "22 de janeiro, 2026",
    cover: "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=1600&q=80",
    content: [
      "As pontas são a parte mais antiga e fragilizada do fio. Sem cuidado, elas se abrem, quebram e impedem o ganho de comprimento.",
      "Um reparador de pontas com óleos nobres sela a cutícula, devolve brilho e cria uma barreira contra a perda de proteínas.",
      "Use diariamente, em pequena quantidade, nos fios secos ou úmidos. Uma ou duas gotas são suficientes para selar todo o comprimento.",
    ],
  },
];
