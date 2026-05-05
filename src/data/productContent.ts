// Conteúdo editorial complementar por produto (handle do Shopify)
// Modo de uso, composição e benefícios — exibidos na página individual do produto.

export interface ProductContent {
  benefits: string[];
  howToUse: string[];
  composition: string;
}

export const productContent: Record<string, ProductContent> = {
  "escova-progressiva-base-acida-1kg": {
    benefits: [
      "Reduz volume e frizz em até 95%",
      "Tecnologia de base ácida que respeita a fibra capilar",
      "Não contém formol — segura para uso profissional",
      "Brilho intenso e movimento natural por até 4 meses",
    ],
    howToUse: [
      "Lave os fios com shampoo de limpeza profunda. Repita 2 a 3 vezes.",
      "Seque 100% e divida em 4 mechas.",
      "Aplique o produto mecha a mecha, mantendo 1cm da raiz. Massageie.",
      "Deixe agir por 40 a 60 minutos conforme a textura do cabelo.",
      "Enxágue 50% e seque 100%. Finalize com prancha (8 a 10 passadas por mecha a 200°C).",
    ],
    composition:
      "Ácido glioxílico, queratina hidrolisada, óleo de argan, manteiga de karité, d-pantenol e complexo de aminoácidos.",
  },
  "reparador-de-pontas-blend-7-oleos-30ml": {
    benefits: [
      "Blend exclusivo de 7 óleos nobres",
      "Sela cutículas e devolve brilho instantaneamente",
      "Toque seco — não pesa nem deixa oleoso",
      "Protege da poluição e do desgaste térmico",
    ],
    howToUse: [
      "Aplique 2 a 3 gotas nas palmas das mãos.",
      "Distribua nas pontas dos cabelos úmidos ou secos.",
      "Pode ser usado antes da escova ou como finalizador.",
    ],
    composition:
      "Óleos de argan, jojoba, coco, macadâmia, semente de uva, abacate e amêndoas doces. Vitamina E.",
  },
  "shampoo-pos-quimica-ph-balance-300ml": {
    benefits: [
      "pH 4.5 — equilibrado para cabelos quimicamente tratados",
      "Higieniza sem ressecar nem remover o tratamento",
      "Reduz a porosidade e mantém a hidratação",
      "Livre de sulfatos agressivos",
    ],
    howToUse: [
      "Aplique nos fios molhados, massageando o couro cabeludo.",
      "Enxágue e repita se necessário.",
      "Use no máximo 3 vezes por semana para preservar o tratamento.",
    ],
    composition:
      "Tensoativos suaves derivados do coco, ácido cítrico, queratina, pantenol e extrato de aloe vera.",
  },
  "mascara-pos-quimica-ph-balance-300g": {
    benefits: [
      "Reposição profunda de massa e nutrientes",
      "pH balanceado para selar a cutícula",
      "Restaura maciez, brilho e elasticidade",
      "Indicada para uso semanal pós-química",
    ],
    howToUse: [
      "Após o shampoo, retire o excesso de água.",
      "Aplique uma porção generosa do comprimento às pontas.",
      "Deixe agir por 5 a 15 minutos. Enxágue.",
    ],
    composition:
      "Manteiga de murumuru, óleo de coco, queratina hidrolisada, ceramidas, d-pantenol e extrato de bambu.",
  },
  "leave-in-termoprotetor-10-em-1-300ml": {
    benefits: [
      "Proteção térmica até 230°C",
      "10 ações: hidrata, desembaraça, dá brilho, controla frizz, sela pontas, protege da poluição, reduz porosidade, prepara para escova, prolonga a química e perfuma",
      "Toque leve, não pesa nos fios",
      "Para todos os tipos de cabelo",
    ],
    howToUse: [
      "Borrife uniformemente nos fios úmidos ou secos.",
      "Penteie para distribuir bem.",
      "Finalize com secador, prancha ou ao natural.",
    ],
    composition:
      "Óleos vegetais, silicones de baixo peso molecular, queratina, pantenol, filtro UV e complexo termoativo.",
  },
};
