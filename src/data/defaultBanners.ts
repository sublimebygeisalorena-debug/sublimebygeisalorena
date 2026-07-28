export interface HomeBanner {
  id: string;
  imageUrl: string;
  mobileImageUrl?: string;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  buttonText?: string;
  buttonUrl?: string;
  active?: boolean;
}

export const defaultBanners: HomeBanner[] = [
  {
    id: "banner-1",
    imageUrl: "/hero-new.jpg",
    eyebrow: "Coleção Essencial",
    title: "A ciência do cuidado capilar em suas mãos.",
    subtitle: "Fórmulas profissionais com pH balanceado, óleos nobres e proteção térmica.",
    buttonText: "Ver produtos",
    buttonUrl: "#produtos",
    active: true,
  },
  {
    id: "banner-2",
    imageUrl: "/products/reestruturador-infinit-repair.png",
    eyebrow: "Linha Infinit Repair",
    title: "Reestruturação e Tratamento Intensivo",
    subtitle: "Restauração profunda da fibra para cabelos quimicamente tratados e alisados.",
    buttonText: "Conhecer Linha",
    buttonUrl: "/loja",
    active: true,
  },
  {
    id: "banner-3",
    imageUrl: "/products/leave-in-termoprotetor.png",
    eyebrow: "Proteção Térmica 10x1",
    title: "Brilho, Selamento e Proteção até 230°C",
    subtitle: "Desenvolvido com Ácido Hialurônico e Silsoft AX para o seu ritual diário.",
    buttonText: "Comprar Agora",
    buttonUrl: "/product/leave-in-termoprotetor-10-em-1-300ml",
    active: true,
  },
];
