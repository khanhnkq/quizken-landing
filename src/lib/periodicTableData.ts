export type ElementCategory =
  | "kim-loai-kiem"
  | "kim-loai-kiem-tho"
  | "kim-loai-chuyen-tiep"
  | "kim-loai-yeu"
  | "a-kim"
  | "phi-kim"
  | "halogen"
  | "khi-hiem"
  | "lanthanide"
  | "actinide";

export interface ChemicalElement {
  z: number;
  symbol: string;
  nameEn: string;
  nameVi: string;
  atomicMass: number;
  period: number;
  group: number;
  gridRow: number;
  gridCol: number;
  category: ElementCategory;
  electronConfig: string;
  electronegativity: number | null;
  oxidationStates: string;
}

export const ELEMENT_CATEGORY_META: Record<
  ElementCategory,
  { label: string; chipClass: string; cellClass: string }
> = {
  "kim-loai-kiem": {
    label: "Kim loại kiềm (IA)",
    chipClass: "bg-rose-500/15 text-rose-700 dark:text-rose-300",
    cellClass:
      "bg-rose-500/12 border-rose-500/35 text-rose-900 dark:text-rose-100 hover:bg-rose-500/22",
  },
  "kim-loai-kiem-tho": {
    label: "Kim loại kiềm thổ (IIA)",
    chipClass: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
    cellClass:
      "bg-amber-500/12 border-amber-500/35 text-amber-900 dark:text-amber-100 hover:bg-amber-500/22",
  },
  "kim-loai-chuyen-tiep": {
    label: "Kim loại chuyển tiếp",
    chipClass: "bg-sky-500/15 text-sky-700 dark:text-sky-300",
    cellClass:
      "bg-sky-500/12 border-sky-500/35 text-sky-900 dark:text-sky-100 hover:bg-sky-500/22",
  },
  "kim-loai-yeu": {
    label: "Kim loại sau chuyển tiếp",
    chipClass: "bg-teal-500/15 text-teal-700 dark:text-teal-300",
    cellClass:
      "bg-teal-500/12 border-teal-500/35 text-teal-900 dark:text-teal-100 hover:bg-teal-500/22",
  },
  "a-kim": {
    label: "Á kim (Metalloid)",
    chipClass: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
    cellClass:
      "bg-emerald-500/12 border-emerald-500/35 text-emerald-900 dark:text-emerald-100 hover:bg-emerald-500/22",
  },
  "phi-kim": {
    label: "Phi kim",
    chipClass: "bg-lime-500/15 text-lime-700 dark:text-lime-300",
    cellClass:
      "bg-lime-500/12 border-lime-500/35 text-lime-900 dark:text-lime-100 hover:bg-lime-500/22",
  },
  halogen: {
    label: "Halogen (VIIA)",
    chipClass: "bg-indigo-500/15 text-indigo-700 dark:text-indigo-300",
    cellClass:
      "bg-indigo-500/12 border-indigo-500/35 text-indigo-900 dark:text-indigo-100 hover:bg-indigo-500/22",
  },
  "khi-hiem": {
    label: "Khí hiếm (VIIIA)",
    chipClass: "bg-purple-500/15 text-purple-700 dark:text-purple-300",
    cellClass:
      "bg-purple-500/12 border-purple-500/35 text-purple-900 dark:text-purple-100 hover:bg-purple-500/22",
  },
  lanthanide: {
    label: "Họ Lanthanide",
    chipClass: "bg-orange-500/15 text-orange-700 dark:text-orange-300",
    cellClass:
      "bg-orange-500/12 border-orange-500/35 text-orange-900 dark:text-orange-100 hover:bg-orange-500/22",
  },
  actinide: {
    label: "Họ Actinide",
    chipClass: "bg-fuchsia-500/15 text-fuchsia-700 dark:text-fuchsia-300",
    cellClass:
      "bg-fuchsia-500/12 border-fuchsia-500/35 text-fuchsia-900 dark:text-fuchsia-100 hover:bg-fuchsia-500/22",
  },
};

type RawRow = [
  number, // z
  string, // symbol
  string, // nameEn
  string, // nameVi
  number, // atomicMass
  number, // period
  number, // group
  number, // gridRow
  number, // gridCol
  ElementCategory, // category
  string, // electronConfig
  number | null, // electronegativity
  string // oxidationStates
];

const RAW_ELEMENTS: RawRow[] = [
  [1,"H","Hydrogen","Hydrogen (Hiđro)",1.008,1,1,1,1,"phi-kim","1s¹",2.2,"+1, -1"],
  [2,"He","Helium","Helium (Heli)",4.0026,1,18,1,18,"khi-hiem","1s²",null,"0"],
  [3,"Li","Lithium","Lithium (Liti)",6.94,2,1,2,1,"kim-loai-kiem","[He] 2s¹",0.98,"+1"],
  [4,"Be","Beryllium","Beryllium (Beri)",9.0122,2,2,2,2,"kim-loai-kiem-tho","[He] 2s²",1.57,"+2"],
  [5,"B","Boron","Boron (Bo)",10.81,2,13,2,13,"a-kim","[He] 2s² 2p¹",2.04,"+3"],
  [6,"C","Carbon","Carbon (Cacbon)",12.011,2,14,2,14,"phi-kim","[He] 2s² 2p²",2.55,"-4, +2, +4"],
  [7,"N","Nitrogen","Nitrogen (Nitơ)",14.007,2,15,2,15,"phi-kim","[He] 2s² 2p³",3.04,"-3, +1..+5"],
  [8,"O","Oxygen","Oxygen (Oxi)",15.999,2,16,2,16,"phi-kim","[He] 2s² 2p⁴",3.44,"-2, -1"],
  [9,"F","Fluorine","Fluorine (Flo)",18.998,2,17,2,17,"halogen","[He] 2s² 2p⁵",3.98,"-1"],
  [10,"Ne","Neon","Neon",20.18,2,18,2,18,"khi-hiem","[He] 2s² 2p⁶",null,"0"],
  [11,"Na","Sodium","Sodium (Natri)",22.99,3,1,3,1,"kim-loai-kiem","[Ne] 3s¹",0.93,"+1"],
  [12,"Mg","Magnesium","Magnesium (Magie)",24.305,3,2,3,2,"kim-loai-kiem-tho","[Ne] 3s²",1.31,"+2"],
  [13,"Al","Aluminium","Aluminium (Nhôm)",26.982,3,13,3,13,"kim-loai-yeu","[Ne] 3s² 3p¹",1.61,"+3"],
  [14,"Si","Silicon","Silicon (Silic)",28.085,3,14,3,14,"a-kim","[Ne] 3s² 3p²",1.9,"-4, +4"],
  [15,"P","Phosphorus","Phosphorus (Photpho)",30.974,3,15,3,15,"phi-kim","[Ne] 3s² 3p³",2.19,"-3, +3, +5"],
  [16,"S","Sulfur","Sulfur (Lưu huỳnh)",32.06,3,16,3,16,"phi-kim","[Ne] 3s² 3p⁴",2.58,"-2, +4, +6"],
  [17,"Cl","Chlorine","Chlorine (Clo)",35.45,3,17,3,17,"halogen","[Ne] 3s² 3p⁵",3.16,"-1, +1, +3, +5, +7"],
  [18,"Ar","Argon","Argon",39.948,3,18,3,18,"khi-hiem","[Ne] 3s² 3p⁶",null,"0"],
  [19,"K","Potassium","Potassium (Kali)",39.098,4,1,4,1,"kim-loai-kiem","[Ar] 4s¹",0.82,"+1"],
  [20,"Ca","Calcium","Calcium (Canxi)",40.078,4,2,4,2,"kim-loai-kiem-tho","[Ar] 4s²",1.0,"+2"],
  [21,"Sc","Scandium","Scandium",44.956,4,3,4,3,"kim-loai-chuyen-tiep","[Ar] 3d¹ 4s²",1.36,"+3"],
  [22,"Ti","Titanium","Titanium (Titan)",47.867,4,4,4,4,"kim-loai-chuyen-tiep","[Ar] 3d² 4s²",1.54,"+2, +3, +4"],
  [23,"V","Vanadium","Vanadium",50.942,4,5,4,5,"kim-loai-chuyen-tiep","[Ar] 3d³ 4s²",1.63,"+2, +3, +4, +5"],
  [24,"Cr","Chromium","Chromium (Crom)",51.996,4,6,4,6,"kim-loai-chuyen-tiep","[Ar] 3d⁵ 4s¹",1.66,"+2, +3, +6"],
  [25,"Mn","Manganese","Manganese (Mangan)",54.938,4,7,4,7,"kim-loai-chuyen-tiep","[Ar] 3d⁵ 4s²",1.55,"+2, +4, +6, +7"],
  [26,"Fe","Iron","Iron (Sắt)",55.845,4,8,4,8,"kim-loai-chuyen-tiep","[Ar] 3d⁶ 4s²",1.83,"+2, +3"],
  [27,"Co","Cobalt","Cobalt (Coban)",58.933,4,9,4,9,"kim-loai-chuyen-tiep","[Ar] 3d⁷ 4s²",1.88,"+2, +3"],
  [28,"Ni","Nickel","Nickel (Niken)",58.693,4,10,4,10,"kim-loai-chuyen-tiep","[Ar] 3d⁸ 4s²",1.91,"+2"],
  [29,"Cu","Copper","Copper (Đồng)",63.546,4,11,4,11,"kim-loai-chuyen-tiep","[Ar] 3d¹⁰ 4s¹",1.9,"+1, +2"],
  [30,"Zn","Zinc","Zinc (Kẽm)",65.38,4,12,4,12,"kim-loai-chuyen-tiep","[Ar] 3d¹⁰ 4s²",1.65,"+2"],
  [31,"Ga","Gallium","Gallium (Gali)",69.723,4,13,4,13,"kim-loai-yeu","[Ar] 3d¹⁰ 4s² 4p¹",1.81,"+3"],
  [32,"Ge","Germanium","Germanium",72.63,4,14,4,14,"a-kim","[Ar] 3d¹⁰ 4s² 4p²",2.01,"+2, +4"],
  [33,"As","Arsenic","Arsenic (Asen)",74.922,4,15,4,15,"a-kim","[Ar] 3d¹⁰ 4s² 4p³",2.18,"-3, +3, +5"],
  [34,"Se","Selenium","Selenium (Selen)",78.971,4,16,4,16,"phi-kim","[Ar] 3d¹⁰ 4s² 4p⁴",2.55,"-2, +4, +6"],
  [35,"Br","Bromine","Bromine (Brom)",79.904,4,17,4,17,"halogen","[Ar] 3d¹⁰ 4s² 4p⁵",2.96,"-1, +1, +5"],
  [36,"Kr","Krypton","Krypton",83.798,4,18,4,18,"khi-hiem","[Ar] 3d¹⁰ 4s² 4p⁶",3.0,"0, +2"],
  [37,"Rb","Rubidium","Rubidium",85.468,5,1,5,1,"kim-loai-kiem","[Kr] 5s¹",0.82,"+1"],
  [38,"Sr","Strontium","Strontium (Stronti)",87.62,5,2,5,2,"kim-loai-kiem-tho","[Kr] 5s²",0.95,"+2"],
  [39,"Y","Yttrium","Yttrium",88.906,5,3,5,3,"kim-loai-chuyen-tiep","[Kr] 4d¹ 5s²",1.22,"+3"],
  [40,"Zr","Zirconium","Zirconium",91.224,5,4,5,4,"kim-loai-chuyen-tiep","[Kr] 4d² 5s²",1.33,"+4"],
  [41,"Nb","Niobium","Niobium",92.906,5,5,5,5,"kim-loai-chuyen-tiep","[Kr] 4d⁴ 5s¹",1.6,"+5"],
  [42,"Mo","Molybdenum","Molybdenum (Molipđen)",95.95,5,6,5,6,"kim-loai-chuyen-tiep","[Kr] 4d⁵ 5s¹",2.16,"+4, +6"],
  [43,"Tc","Technetium","Technetium",98,5,7,5,7,"kim-loai-chuyen-tiep","[Kr] 4d⁵ 5s²",1.9,"+4, +7"],
  [44,"Ru","Ruthenium","Ruthenium",101.07,5,8,5,8,"kim-loai-chuyen-tiep","[Kr] 4d⁷ 5s¹",2.2,"+3, +4, +8"],
  [45,"Rh","Rhodium","Rhodium",102.91,5,9,5,9,"kim-loai-chuyen-tiep","[Kr] 4d⁸ 5s¹",2.28,"+3"],
  [46,"Pd","Palladium","Palladium",106.42,5,10,5,10,"kim-loai-chuyen-tiep","[Kr] 4d¹⁰",2.2,"+2, +4"],
  [47,"Ag","Silver","Silver (Bạc)",107.87,5,11,5,11,"kim-loai-chuyen-tiep","[Kr] 4d¹⁰ 5s¹",1.93,"+1"],
  [48,"Cd","Cadmium","Cadmium (Cađimi)",112.41,5,12,5,12,"kim-loai-chuyen-tiep","[Kr] 4d¹⁰ 5s²",1.69,"+2"],
  [49,"In","Indium","Indium (Inđi)",114.82,5,13,5,13,"kim-loai-yeu","[Kr] 4d¹⁰ 5s² 5p¹",1.78,"+3"],
  [50,"Sn","Tin","Tin (Thiếc)",118.71,5,14,5,14,"kim-loai-yeu","[Kr] 4d¹⁰ 5s² 5p²",1.96,"+2, +4"],
  [51,"Sb","Antimony","Antimony (Antimon)",121.76,5,15,5,15,"a-kim","[Kr] 4d¹⁰ 5s² 5p³",2.05,"-3, +3, +5"],
  [52,"Te","Tellurium","Tellurium (Telu)",127.6,5,16,5,16,"a-kim","[Kr] 4d¹⁰ 5s² 5p⁴",2.1,"-2, +4, +6"],
  [53,"I","Iodine","Iodine (Iot)",126.9,5,17,5,17,"halogen","[Kr] 4d¹⁰ 5s² 5p⁵",2.66,"-1, +1, +5, +7"],
  [54,"Xe","Xenon","Xenon",131.29,5,18,5,18,"khi-hiem","[Kr] 4d¹⁰ 5s² 5p⁶",2.6,"0, +2, +4, +6"],
  [55,"Cs","Cesium","Cesium (Xesi)",132.91,6,1,6,1,"kim-loai-kiem","[Xe] 6s¹",0.79,"+1"],
  [56,"Ba","Barium","Barium (Bari)",137.33,6,2,6,2,"kim-loai-kiem-tho","[Xe] 6s²",0.89,"+2"],
  [57,"La","Lanthanum","Lanthanum (Lantan)",138.91,6,3,9,4,"lanthanide","[Xe] 5d¹ 6s²",1.1,"+3"],
  [58,"Ce","Cerium","Cerium (Xeri)",140.12,6,3,9,5,"lanthanide","[Xe] 4f¹ 5d¹ 6s²",1.12,"+3, +4"],
  [59,"Pr","Praseodymium","Praseodymium",140.91,6,3,9,6,"lanthanide","[Xe] 4f³ 6s²",1.13,"+3"],
  [60,"Nd","Neodymium","Neodymium",144.24,6,3,9,7,"lanthanide","[Xe] 4f⁴ 6s²",1.14,"+3"],
  [61,"Pm","Promethium","Promethium",145,6,3,9,8,"lanthanide","[Xe] 4f⁵ 6s²",1.13,"+3"],
  [62,"Sm","Samarium","Samarium",150.36,6,3,9,9,"lanthanide","[Xe] 4f⁶ 6s²",1.17,"+2, +3"],
  [63,"Eu","Europium","Europium",151.96,6,3,9,10,"lanthanide","[Xe] 4f⁷ 6s²",1.2,"+2, +3"],
  [64,"Gd","Gadolinium","Gadolinium",157.25,6,3,9,11,"lanthanide","[Xe] 4f⁷ 5d¹ 6s²",1.2,"+3"],
  [65,"Tb","Terbium","Terbium",158.93,6,3,9,12,"lanthanide","[Xe] 4f⁹ 6s²",1.2,"+3"],
  [66,"Dy","Dysprosium","Dysprosium",162.5,6,3,9,13,"lanthanide","[Xe] 4f¹⁰ 6s²",1.22,"+3"],
  [67,"Ho","Holmium","Holmium",164.93,6,3,9,14,"lanthanide","[Xe] 4f¹¹ 6s²",1.23,"+3"],
  [68,"Er","Erbium","Erbium",167.26,6,3,9,15,"lanthanide","[Xe] 4f¹² 6s²",1.24,"+3"],
  [69,"Tm","Thulium","Thulium",168.93,6,3,9,16,"lanthanide","[Xe] 4f¹³ 6s²",1.25,"+3"],
  [70,"Yb","Ytterbium","Ytterbium",173.05,6,3,9,17,"lanthanide","[Xe] 4f¹⁴ 6s²",1.1,"+2, +3"],
  [71,"Lu","Lutetium","Lutetium",174.97,6,3,9,18,"lanthanide","[Xe] 4f¹⁴ 5d¹ 6s²",1.27,"+3"],
  [72,"Hf","Hafnium","Hafnium",178.49,6,4,6,4,"kim-loai-chuyen-tiep","[Xe] 4f¹⁴ 5d² 6s²",1.3,"+4"],
  [73,"Ta","Tantalum","Tantalum",180.95,6,5,6,5,"kim-loai-chuyen-tiep","[Xe] 4f¹⁴ 5d³ 6s²",1.5,"+5"],
  [74,"W","Tungsten","Tungsten (Vonfram)",183.84,6,6,6,6,"kim-loai-chuyen-tiep","[Xe] 4f¹⁴ 5d⁴ 6s²",2.36,"+4, +6"],
  [75,"Re","Rhenium","Rhenium",186.21,6,7,6,7,"kim-loai-chuyen-tiep","[Xe] 4f¹⁴ 5d⁵ 6s²",1.9,"+4, +7"],
  [76,"Os","Osmium","Osmium",190.23,6,8,6,8,"kim-loai-chuyen-tiep","[Xe] 4f¹⁴ 5d⁶ 6s²",2.2,"+4, +8"],
  [77,"Ir","Iridium","Iridium",192.22,6,9,6,9,"kim-loai-chuyen-tiep","[Xe] 4f¹⁴ 5d⁷ 6s²",2.2,"+3, +4"],
  [78,"Pt","Platinum","Platinum (Bạch kim)",195.08,6,10,6,10,"kim-loai-chuyen-tiep","[Xe] 4f¹⁴ 5d⁹ 6s¹",2.28,"+2, +4"],
  [79,"Au","Gold","Gold (Vàng)",196.97,6,11,6,11,"kim-loai-chuyen-tiep","[Xe] 4f¹⁴ 5d¹⁰ 6s¹",2.54,"+1, +3"],
  [80,"Hg","Mercury","Mercury (Thủy ngân)",200.59,6,12,6,12,"kim-loai-chuyen-tiep","[Xe] 4f¹⁴ 5d¹⁰ 6s²",2.0,"+1, +2"],
  [81,"Tl","Thallium","Thallium (Tali)",204.38,6,13,6,13,"kim-loai-yeu","[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p¹",1.62,"+1, +3"],
  [82,"Pb","Lead","Lead (Chì)",207.2,6,14,6,14,"kim-loai-yeu","[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p²",2.33,"+2, +4"],
  [83,"Bi","Bismuth","Bismuth (Bitmut)",208.98,6,15,6,15,"kim-loai-yeu","[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p³",2.02,"+3, +5"],
  [84,"Po","Polonium","Polonium (Poloni)",209,6,16,6,16,"a-kim","[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁴",2.0,"+2, +4"],
  [85,"At","Astatine","Astatine (Atatin)",210,6,17,6,17,"halogen","[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁵",2.2,"-1, +1"],
  [86,"Rn","Radon","Radon",222,6,18,6,18,"khi-hiem","[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁶",2.2,"0"],
  [87,"Fr","Francium","Francium (Franxi)",223,7,1,7,1,"kim-loai-kiem","[Rn] 7s¹",0.7,"+1"],
  [88,"Ra","Radium","Radium (Rađi)",226,7,2,7,2,"kim-loai-kiem-tho","[Rn] 7s²",0.9,"+2"],
  [89,"Ac","Actinium","Actinium (Actini)",227,7,3,10,4,"actinide","[Rn] 6d¹ 7s²",1.1,"+3"],
  [90,"Th","Thorium","Thorium (Thori)",232.04,7,3,10,5,"actinide","[Rn] 6d² 7s²",1.3,"+4"],
  [91,"Pa","Protactinium","Protactinium",231.04,7,3,10,6,"actinide","[Rn] 5f² 6d¹ 7s²",1.5,"+5"],
  [92,"U","Uranium","Uranium (Urani)",238.03,7,3,10,7,"actinide","[Rn] 5f³ 6d¹ 7s²",1.38,"+4, +6"],
  [93,"Np","Neptunium","Neptunium",237,7,3,10,8,"actinide","[Rn] 5f⁴ 6d¹ 7s²",1.36,"+3..+6"],
  [94,"Pu","Plutonium","Plutonium",244,7,3,10,9,"actinide","[Rn] 5f⁶ 7s²",1.28,"+3..+6"],
  [95,"Am","Americium","Americium",243,7,3,10,10,"actinide","[Rn] 5f⁷ 7s²",1.13,"+3"],
  [96,"Cm","Curium","Curium",247,7,3,10,11,"actinide","[Rn] 5f⁷ 6d¹ 7s²",1.28,"+3"],
  [97,"Bk","Berkelium","Berkelium",247,7,3,10,12,"actinide","[Rn] 5f⁹ 7s²",1.3,"+3, +4"],
  [98,"Cf","Californium","Californium",251,7,3,10,13,"actinide","[Rn] 5f¹⁰ 7s²",1.3,"+3"],
  [99,"Es","Einsteinium","Einsteinium",252,7,3,10,14,"actinide","[Rn] 5f¹¹ 7s²",1.3,"+3"],
  [100,"Fm","Fermium","Fermium",257,7,3,10,15,"actinide","[Rn] 5f¹² 7s²",1.3,"+3"],
  [101,"Md","Mendelevium","Mendelevium",258,7,3,10,16,"actinide","[Rn] 5f¹³ 7s²",1.3,"+2, +3"],
  [102,"No","Nobelium","Nobelium",259,7,3,10,17,"actinide","[Rn] 5f¹⁴ 7s²",1.3,"+2, +3"],
  [103,"Lr","Lawrencium","Lawrencium",266,7,3,10,18,"actinide","[Rn] 5f¹⁴ 7s² 7p¹",1.3,"+3"],
  [104,"Rf","Rutherfordium","Rutherfordium",267,7,4,7,4,"kim-loai-chuyen-tiep","[Rn] 5f¹⁴ 6d² 7s²",null,"+4"],
  [105,"Db","Dubnium","Dubnium",268,7,5,7,5,"kim-loai-chuyen-tiep","[Rn] 5f¹⁴ 6d³ 7s²",null,"+5"],
  [106,"Sg","Seaborgium","Seaborgium",269,7,6,7,6,"kim-loai-chuyen-tiep","[Rn] 5f¹⁴ 6d⁴ 7s²",null,"+6"],
  [107,"Bh","Bohrium","Bohrium",270,7,7,7,7,"kim-loai-chuyen-tiep","[Rn] 5f¹⁴ 6d⁵ 7s²",null,"+7"],
  [108,"Hs","Hassium","Hassium",277,7,8,7,8,"kim-loai-chuyen-tiep","[Rn] 5f¹⁴ 6d⁶ 7s²",null,"+8"],
  [109,"Mt","Meitnerium","Meitnerium",278,7,9,7,9,"kim-loai-chuyen-tiep","[Rn] 5f¹⁴ 6d⁷ 7s²",null,"—"],
  [110,"Ds","Darmstadtium","Darmstadtium",281,7,10,7,10,"kim-loai-chuyen-tiep","[Rn] 5f¹⁴ 6d⁸ 7s²",null,"—"],
  [111,"Rg","Roentgenium","Roentgenium",282,7,11,7,11,"kim-loai-chuyen-tiep","[Rn] 5f¹⁴ 6d⁹ 7s²",null,"—"],
  [112,"Cn","Copernicium","Copernicium",285,7,12,7,12,"kim-loai-chuyen-tiep","[Rn] 5f¹⁴ 6d¹⁰ 7s²",null,"+2"],
  [113,"Nh","Nihonium","Nihonium",286,7,13,7,13,"kim-loai-yeu","[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p¹",null,"+1"],
  [114,"Fl","Flerovium","Flerovium",289,7,14,7,14,"kim-loai-yeu","[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p²",null,"+2"],
  [115,"Mc","Moscovium","Moscovium",290,7,15,7,15,"kim-loai-yeu","[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p³",null,"+1, +3"],
  [116,"Lv","Livermorium","Livermorium",293,7,16,7,16,"kim-loai-yeu","[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁴",null,"+2"],
  [117,"Ts","Tennessine","Tennessine",294,7,17,7,17,"halogen","[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁵",null,"—"],
  [118,"Og","Oganesson","Oganesson",294,7,18,7,18,"khi-hiem","[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁶",null,"0"],
];

export const PERIODIC_ELEMENTS: ChemicalElement[] = RAW_ELEMENTS.map(
  ([
    z,
    symbol,
    nameEn,
    nameVi,
    atomicMass,
    period,
    group,
    gridRow,
    gridCol,
    category,
    electronConfig,
    electronegativity,
    oxidationStates,
  ]) => ({
    z,
    symbol,
    nameEn,
    nameVi,
    atomicMass,
    period,
    group,
    gridRow,
    gridCol,
    category,
    electronConfig,
    electronegativity,
    oxidationStates,
  })
);
