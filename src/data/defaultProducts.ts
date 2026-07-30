export interface LocalProduct {
  id: string;
  handle: string;
  title: string;
  description: string;
  price: string;
  productType: string;
  imageUrl: string;
  additionalImages?: string[];
  benefits: string[];
  howToUse: string[];
  composition: string;
  professionalTip?: string;
  featured?: boolean;
  available?: boolean;
}

export const defaultProducts: LocalProduct[] = [
  {
    id: "prod-leave-in-10in1",
    handle: "leave-in-termoprotetor-10-em-1-300ml",
    title: "Leave-In Termoprotetor 10x1 Infinit Repair 300ml",
    price: "129.90",
    productType: "Home Care",
    imageUrl: "/products/leave-in-termoprotetor.png",
    description:
      "Proteção térmica avançada e hidratação inteligente para todos os tipos de cabelo. Desenvolvido para proteger contra o calor extremo de secador e prancha, selando as cutículas e eliminando o frizz com toque sedoso.",
    benefits: [
      "Proteção térmica avançada até 230°C",
      "Hidratação inteligente e controle de frizz",
      "Fortalecimento capilar e ação desembaraçante",
      "Toque sedoso com fios alinhados e protegidos",
      "0% Petrolatos — Cruelty Free",
    ],
    howToUse: [
      "Borrife ou distribua uma pequena quantidade nos fios úmidos ou secos.",
      "Espalhe uniformemente do comprimento às pontas com o auxílio dos dedos ou pente.",
      "Finalize como desejar com secador, prancha ou deixe secar naturalmente.",
    ],
    composition:
      "Ácido Hialurônico, Elastina, Silsoft AX, silicones nobres termoativos, pantenol e filtro protetor.",
    featured: true,
    available: true,
  },
  {
    id: "prod-shampoo-pos-quimica",
    handle: "shampoo-pos-quimica-ph-balance-300ml",
    title: "Shampoo Pós-Química Infinit Repair 300ml",
    price: "109.90",
    productType: "Home Care",
    imageUrl: "/products/shampoo-pos-quimica.png",
    description:
      "Higienização suave com manutenção do cabelo alisado e quimicamente tratado. Recompõe a fibra capilar sem agredir a estrutura ou acelerar o desgaste da química.",
    benefits: [
      "pH balanceado especial pós-química",
      "Higienização suave sem ressecar a fibra",
      "Auxilia na recuperação dos cabelos quimicamente tratados",
      "Manutenção do cabelo alisado por mais tempo",
      "0% Parabenos, Petrolatos e Cruelty Free",
    ],
    howToUse: [
      "Aplique nos cabelos molhados massageando o couro cabeludo até formar espuma.",
      "Enxágue abundantemente com água fria ou morna.",
      "Repita a aplicação se necessário e prossiga com a Máscara Pós-Química.",
    ],
    composition:
      "Ácido Hialurônico, Ceramidas, Silsoft AX, tensoativos suaves derivados do coco e d-pantenol.",
    featured: true,
    available: true,
  },
  {
    id: "prod-reestruturador-1l",
    handle: "escova-progressiva-base-acida-1kg",
    title: "Reestruturador Infinit Repair 1L — Uso Profissional",
    price: "289.90",
    productType: "Uso Profissional",
    imageUrl: "/products/reestruturador-infinit-repair.png",
    description:
      "Tratamento de reestruturação capilar intensivo exclusivo para uso profissional. Proporciona sedução de volume, realinhamento de alta precisão e retenção hídrica superior.",
    benefits: [
      "Reestruturação intensa e alinhamento dos fios",
      "Redução de volume e frizz com brilho espelhado",
      "Alta capacidade de retenção hídrica e resistência",
      "Tecnologia Silsoft AX + Ácido Lático",
      "0% Parabenos — Cruelty Free",
    ],
    howToUse: [
      "Lave os cabelos com shampoo de limpeza profunda e seque 100%.",
      "Aplique o Reestruturador mecha a mecha mantendo 1cm da raiz.",
      "Deixe agir de 40 a 60 minutos conforme o tipo de cabelo.",
      "Enxágue o excesso, escove 100% e finalize com prancha em mechas finas.",
    ],
    composition:
      "Silsoft AX, Ácido Lático, Hidrahaai, Sphere, agentes de selamento e reconstrução capilar.",
    featured: true,
    available: true,
  },
  {
    id: "prod-mascara-pos-quimica",
    handle: "mascara-pos-quimica-ph-balance-300g",
    title: "Máscara Pós-Química Infinit Repair 300g",
    price: "119.90",
    productType: "Home Care",
    imageUrl: "/products/mascara-pos-quimica.png",
    description:
      "Tratamento de restauração profunda para manutenção do cabelo alisado e quimicamente tratado. Recompõe aminoácidos essenciais e fortalece os fios desvitalizados.",
    benefits: [
      "Restauração profunda e reposição de nutrientes",
      "Maciez extrema, movimento e efeito aveludado",
      "Fortalecimento e selamento das cutículas",
      "0% Petrolatos — Cruelty Free",
    ],
    howToUse: [
      "Após o Shampoo Pós-Química, remova o excesso de água das mechas.",
      "Aplique a máscara mecha a mecha do comprimento às pontas enluvando bem.",
      "Deixe agir de 5 a 15 minutos e enxágue completamente.",
    ],
    composition:
      "Ácido Hialurônico, Elastina, Silsoft AX, manteiga de murumuru, ceramidas e complexo vitamínico.",
    featured: true,
    available: true,
  },
  {
    id: "prod-reparador-7-oleos",
    handle: "reparador-de-pontas-blend-7-oleos-30ml",
    title: "Reparador de Pontas Blend 7 Óleos 30ml",
    price: "89.90",
    productType: "Home Care",
    imageUrl: "/hero-new.jpg",
    description:
      "Blend exclusivo de 7 óleos nobres para reparar pontas duplas, selar cutículas e proporcionar brilho radiante sem pesar nos fios.",
    benefits: [
      "Blend exclusivo de 7 óleos nobres",
      "Sela cutículas e elimina pontas duplas",
      "Toque seco — não deixa o cabelo oleoso",
      "Proteção antipoluição e brilho tridimensional",
    ],
    howToUse: [
      "Pingue de 2 a 3 gotas na palma das mãos.",
      "Esfregue levemente e distribua nas pontas do cabelo seco ou úmido.",
      "Pode ser aplicado diariamente.",
    ],
    composition:
      "Óleos de Argan, Jojoba, Coco, Macadâmia, Semente de Uva, Abacate e Amêndoas Doces com Vitamina E.",
    featured: false,
    available: true,
  },
];
