import { ChevronRight } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import FacebookFooterLink from "../../components/FacebookFooterLink";
import RetailerSearch from "../../components/RetailerSearch";

export const metadata: Metadata = {
  title: "Retailer List — KC Games Sdn Bhd",
  description: "Official KC Games Riftbound Trading Card Game retailers across Malaysia and Brunei. Find your nearest stockist.",
  alternates: {
    canonical: "https://www.kc-games.com/retailers.html",
  },
  openGraph: {
    title: "Retailer List — KC Games Sdn Bhd",
    description: "Official KC Games Riftbound Trading Card Game retailers across Malaysia and Brunei. Find your nearest stockist.",
    type: "website",
    url: "https://www.kc-games.com/retailers.html",
    siteName: "KC Games",
    locale: "en_MY",
  },
  twitter: {
    card: "summary_large_image",
    title: "Retailer List — KC Games Sdn Bhd",
    description: "Official KC Games Riftbound Trading Card Game retailers across Malaysia and Brunei.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const retailers = [
  {
    id: 1,
    name: "Hobby Lookout",
    address: "1st Floor, Citis Square Shopping Complex, Unit G38, Spg 13-41 Jln, Bandar Seri Begawan BB2713, Brunei",
    region: "BRUNEI",
  },
  {
    id: 2,
    name: "Games & Lattes Cafe",
    address: "G/F, Unit E9, Blk E, Setia Kenangan II, Spg 150-5-13-18, Kg Kiulap, Brunei BE1518, BF1920, BSB, Brunei Darussalam",
    region: "BRUNEI",
  },
  {
    id: 3,
    name: "Games Haven Southkey",
    address: "D-1-10 Pusat Komersial Bayu Tasek Persiaran Southkey 1, Kota Southkey, 1, Southkey, 80150 Johor Bahru, Johor Darul Ta'zim, Malaysia",
    region: "JOHOR",
  },
  {
    id: 4,
    name: "Hobby Town",
    address: "B0448, Eco Galleria, Taman Eko Botani, 79100, Iskandar Puteri, Johor (Shop) 8, Jalan Tembaga, Taman Kolam Air, 80200, Johor Bahru, Johor, Malaysia (Shipping)",
    region: "JOHOR",
  },
  {
    id: 5,
    name: "House Of Southerner",
    address: "No. 7, Jalan Besi, Taman Sri Putri, 81300, Skudai, Johor, Malaysia",
    region: "JOHOR",
  },
  {
    id: 6,
    name: "Impulse Gaming (Johor)",
    address: "55, Jalan Serampang, Taman Sri Tebrau, 80050 Johor Bahru, Johor Darul Ta'zim",
    region: "JOHOR",
  },
  {
    id: 7,
    name: "KADO",
    address: "A0331, Eco Galleria, Jalan Eko Botani 3, Taman Eko Botani, 79100, Johor Bahru, Johor, MY",
    region: "JOHOR",
  },
  {
    id: 8,
    name: "Living Legends JB",
    address: "32A, Jalan Pingai, Taman Pelangi, 80400, Johor Bahru, Johor, Malaysia",
    region: "JOHOR",
  },
  {
    id: 9,
    name: "Shuffle Duel Field",
    address: "G-10-01, Jalan Austin Perdana 2/24, Taman Austin Perdana, 81100 Johor Bahru, Johor Darul Ta'zim",
    region: "JOHOR",
  },
  {
    id: 10,
    name: "The Bonfire Hobby Shop",
    address: "0509, Level 5, Wisma SP Setia, Indah Walk 3, Bukit Indah, 81200, Iskandar Puteri, Johor, Malaysia",
    region: "JOHOR",
  },
  {
    id: 11,
    name: "AeXern",
    address: "52A, Block M, Jalan Raja Uda, Pusat Perniagaan Raja Uda, 12300 Butterworth, Pulau Pinang",
    region: "PENANG",
  },
  {
    id: 12,
    name: "Card Master Club",
    address: "I-Santorini, 6-1-8, Jalan Seri Tanjung Pinang 1, Tanjung Tokong, 10470 Pulau Pinang",
    region: "PENANG",
  },
  {
    id: 13,
    name: "Ace Cards & Collectibles (Mid-Valley)",
    address: "T-059, 3rd Floor Mezzanine Floor, Mid Valley Megamall, Mid Valley City, 59200 Kuala Lumpur, W.P. Kuala Lumpur",
    region: "KUALA LUMPUR",
  },
  {
    id: 14,
    name: "Axes & Hexes",
    address: "2-1, 42A, Jalan 34/26, Taman Sri Rampai, 53300 Kuala Lumpur, Federal Territory of Kuala Lumpur",
    region: "KUALA LUMPUR",
  },
  {
    id: 15,
    name: "Bulba Milk TCG",
    address: "117-1, Jalan Radin Bagus, Bandar Baru Sri Petaling, 57000 Kuala Lumpur, Wilayah Persekutuan Kuala Lumpur",
    region: "KUALA LUMPUR",
  },
  {
    id: 16,
    name: "Bulba Store Gamez & Hobby",
    address: "Level 2, Unit 2-39, PV 128, Jalan Genting Kelang, Setapak, 53300 Kuala Lumpur, Federal Territory of Kuala Lumpur",
    region: "KUALA LUMPUR",
  },
  {
    id: 17,
    name: "DiscoverCollectibles",
    address: "3, Jalan Ambong Kiri 1, Kepong Baru, 52100 Kuala Lumpur, Wilayah Persekutuan Kuala Lumpur",
    region: "KUALA LUMPUR",
  },
  {
    id: 18,
    name: "EXAKADO TCG & COLLECTIBLES",
    address: "2A-1, PLAZA USAHAWAN GENTING KLANG, Jalan Danau Niaga, Danau Kota, 53300 Kuala Lumpur, Federal Territory of Kuala Lumpur",
    region: "KUALA LUMPUR",
  },
  {
    id: 19,
    name: "G.E.T & GO",
    address: "C-12-02, PUSAT PERDAGANGAN BANDAR BUKIT JALIL, PERSIARAN JALIL 7, 57000, Bukit Jalil, Kuala Lumpur, Malaysia",
    region: "KUALA LUMPUR",
  },
  {
    id: 20,
    name: "Ghost Owl House",
    address: "2D Claw, A-G-9, Residence unggul kepong, 5, Jalan Vista Mutiara 1, Kepong Baru, 52000 Kuala Lumpur, Wilayah Persekutuan Kuala Lumpur",
    region: "KUALA LUMPUR",
  },
  {
    id: 21,
    name: "Hobby Nikki",
    address: "Medan Niaga, Kuala Lumpur MY, Jln Tasik Utama 10, Sungai Besi, 57000 Kuala Lumpur, Wilayah Persekutuan",
    region: "KUALA LUMPUR",
  },
  {
    id: 22,
    name: "Hobibear Gaming",
    address: "52A, Jalan Cerdas, Taman Connaught, 56000 Cheras, Wilayah Persekutuan Kuala Lumpur",
    region: "KUALA LUMPUR",
  },
  {
    id: 23,
    name: "Impluse Gaming (Sungai Besi)",
    address: "Lot 4, Jln Sungai Besi, Chan Sow Lin, 57100 Sungai Besi, Wilayah Persekutuan Kuala Lumpur",
    region: "KUALA LUMPUR",
  },
  {
    id: 24,
    name: "Kids Heaven",
    address: "4-1, Jalan Damai Perdana 1/8b, Bandar Damai Perdana, 56000 Cheras, Wilayah Persekutuan Kuala Lumpur",
    region: "KUALA LUMPUR",
  },
  {
    id: 25,
    name: "Luludemon Collectibles",
    address: "20-1 (First Floor), Jalan Radin Bagus 1, Bandar Baru Sri Petaling, 57000 Kuala Lumpur, Wilayah Persekutuan Kuala Lumpur",
    region: "KUALA LUMPUR",
  },
  {
    id: 26,
    name: "Mewmon",
    address: "No.14-2, Jalan Manis 3, Taman Bukit Segar, 56100 Cheras, Wilayah Persekutuan Kuala Lumpur",
    region: "KUALA LUMPUR",
  },
  {
    id: 27,
    name: "Monxter",
    address: "18-2, Jalan Menara Gading 1, Taman Connaught, 56000 Cheras, Wilayah Persekutuan Kuala Lumpur",
    region: "KUALA LUMPUR",
  },
  {
    id: 28,
    name: "SAIKYO HOBBY",
    address: "12-A, Jalan Midah 1 Taman Midah Cheras, 56000 Kuala Lumpur, Wilayah Persekutuan Kuala Lumpur",
    region: "KUALA LUMPUR",
  },
  {
    id: 29,
    name: "Dimension TCG Enterprise",
    address: "27(2F), Jalan Lagenda 1, Taman Lagenda, 75400 Melaka",
    region: "MELAKA",
  },
  {
    id: 30,
    name: "Epic Hobbies",
    address: "664E/1, Jalan Bukit Melaka 1/2 Bukit Beruang, 75450 Ayer Keroh, Melaka",
    region: "MELAKA",
  },
  {
    id: 31,
    name: "GameTown Entertainment Studio",
    address: "No 4, 1, Jalan Rahmat 4, Taman Malim Jaya, 75250 Malim Jaya, Melaka",
    region: "MELAKA",
  },
  {
    id: 32,
    name: "Korindou",
    address: "39-1, Jalan Bukit Beruang Utama 2, Taman Bukit Beruang Utama, 75450, Bukit Beruang, Melaka, Malaysia",
    region: "MELAKA",
  },
  {
    id: 33,
    name: "Latias Kingdom",
    address: "A-G-5, Pangsapuri Jayamuda, Jalan Pelanduk Putih, 75300 Melaka",
    region: "MELAKA",
  },
  {
    id: 34,
    name: "MOON ROOST ENTERPRISE",
    address: "219, Jln Tengkera, TANGKERA, 75200 Melaka",
    region: "MELAKA",
  },
  {
    id: 35,
    name: "Meo Gaming Lab",
    address: "36-1, Jalan BBN 6/3B, Desa Cempaka, 71800, Nilai, Negeri Sembilan, Malaysia",
    region: "NEGERI SEMBILAN",
  },
  {
    id: 36,
    name: "The Rare Den",
    address: "26-1, Jalan KS 3, Kepayang Sentral, 70200, Seremban, Negeri Sembilan, Malaysia",
    region: "NEGERI SEMBILAN",
  },
  {
    id: 37,
    name: "Collect All Card Shop",
    address: "10, Pesara Lembah Permai 1, Tanjung Bungah, 11200, Penang, Malaysia",
    region: "PENANG",
  },
  {
    id: 38,
    name: "Dueling Nexus",
    address: "33 - 02, 79, Jalan Dr Lim Chwee Leong, 10100 George Town, Pulau Pinang",
    region: "PENANG",
  },
  {
    id: 39,
    name: "DUNIA CARDS",
    address: "50-3 JALAN PERDA BARAT, BANDAR PERDA, 14000, BUKIT MERTAJAM, Penang, Malaysia",
    region: "PENANG",
  },
  {
    id: 40,
    name: "GAMEONBGC",
    address: "199B, Jln PSK 5, Pekan Simpang Kuala, 05400, Alor Setar, Kedah, Malaysia",
    region: "KEDAH",
  },
  {
    id: 41,
    name: "LEAFY LEGEND TCG",
    address: "8A-36-13, i-Santorini Condominium, Jalan Seri Tanjung Pinang 1, 10470, Tanjong Tokong, Pulau Pinang, Malaysia",
    region: "PENANG",
  },
  {
    id: 42,
    name: "Legacy Games",
    address: "281g Jalan Pekeliling, 11700, Bukit Gelugor, Penang, Malaysia",
    region: "PENANG",
  },
  {
    id: 43,
    name: "Sarang Mainan",
    address: "3-1, Jalan Anggerik 1/3A, Bandar Amanjaya, 08000, Sungai Petani, Kedah, Malaysia",
    region: "KEDAH",
  },
  {
    id: 44,
    name: "Shuffle by Snacks & Ladders",
    address: "7, Jalan Bayan Mutiara 4, D'residence, 11900 Bayan Lepas, Penang, Malaysia",
    region: "PENANG",
  },
  {
    id: 45,
    name: "Favonia Hobbies",
    address: "12B Persiaran Greentown 6, Greentown Business Centre, Ipoh, Malaysia, 30450",
    region: "PERAK",
  },
  {
    id: 46,
    name: "GM Hobby Base",
    address: "48, Taman Bauhinia, Kampung Koh, 32000, Sitiawan, Perak, Malaysia",
    region: "PERAK",
  },
  {
    id: 47,
    name: "Hotcake trading",
    address: "NO.77A PERSIARAN RAJA PEREMPUAN MAZWIN SELATAN, DESA RISHAH INDAH, 30100, Ipoh, Perak, Malaysia",
    region: "PERAK",
  },
  {
    id: 48,
    name: "NEO HIBIKI TCG ENTERPRISE",
    address: "11B Jalan Teh Hawa, Kampung Jawa 30300, 30300, Ipoh, Perak, Malaysia",
    region: "PERAK",
  },
  {
    id: 49,
    name: "Game Anima (Kota Kinabalu)",
    address: "Lot No. 6, First Floor, Block P Taman Chemei Shophouse, KM 5 Jalan Penampang, Lido, Taman Che Mei, 88300 Kota Kinabalu, Sabah",
    region: "SABAH",
  },
  {
    id: 50,
    name: "TABLETOP ARENA",
    address: "S-206, 2ND FLOOR, 1BORNEO HYPERMALL, JALAN SULAMAN, 88450, KOTA KINABALU, Sabah, Malaysia",
    region: "SABAH",
  },
  {
    id: 51,
    name: "Buddy Connection",
    address: "Ground Floor & 1st Floor, Sub Lot 4, Block A Emporium, Jalan Tun Jugah, 93350 Kuching, Sarawak, Malaysia",
    region: "SARAWAK",
  },
  {
    id: 52,
    name: "Card Genesis Sdn. Bhd",
    address: "Lot 11597, Block 16, R.H Plaza, Jalan Lapangan Terbang, Sedc Woodhouse, 93250 Kuching, Sarawak",
    region: "SARAWAK",
  },
  {
    id: 53,
    name: "Gentoshi TCG",
    address: "2nd Floor, Lot 10520, Block 16, KCLD, Jalan, Tun Jugah, 93350 Kuching, Sarawak",
    region: "SARAWAK",
  },
  {
    id: 54,
    name: "LUCKY TCG",
    address: "No.28, 2nd Floor, Lorong Sena 8, Pekan Sibu, 96000 Sibu, Sarawak",
    region: "SARAWAK",
  },
  {
    id: 55,
    name: "Neko Neko Nyaa",
    address: "Block 10, 1st Floor, Q3A, KCLD, Lot 2762, 93150 Kuching, Sarawak",
    region: "SARAWAK",
  },
  {
    id: 56,
    name: "sbcardgamers",
    address: "6810, 1st Floor, Section 65, KLTD, Q309, 93050 Kuching, Sarawak",
    region: "SARAWAK",
  },
  {
    id: 57,
    name: "Shuffle Up",
    address: "KTLD, Lot 564, Section 62, Datuk Wee Kheng Chiang, Jalan Ang Cheng Ho, Road, 93450 Kuching, Sarawak",
    region: "SARAWAK",
  },
  {
    id: 58,
    name: "Toysbar Sdn. Bhd.",
    address: "78A, Jalan SS 22/21, Damansara Jaya, 47400 Petaling Jaya, Selangor",
    region: "SELANGOR",
  },
  {
    id: 59,
    name: "Collect A Deck",
    address: "SK113, 2nd Floor, 1 Utama Shopping Centre, Old Wing, Damansara Utama, 47800 Petaling Jaya, Selangor",
    region: "SELANGOR",
  },
  {
    id: 60,
    name: "Ace Cards & Collectibles (Sunway Pyramid)",
    address: "First Floor, Asian Avenue, Sunway Pyramid, Jalan PJS 11/15, Bandar Sunway, 47500 Subang Jaya, Selangor",
    region: "SELANGOR",
  },
  {
    id: 61,
    name: "Cardinals Hobby Store",
    address: "No 49-1, Jalan USJ 21/11, 47640, Subang Jaya, Selangor, Malaysia",
    region: "SELANGOR",
  },
  {
    id: 62,
    name: "Impulse Gaming (Bandar Sunway)",
    address: "79, Jalan PJS 11/9, Bandar Sunway, 47500 Petaling Jaya, Selangor",
    region: "SELANGOR",
  },
  {
    id: 63,
    name: "The Hypebox (Setia Alam)",
    address: "NO 9-G, JALAN SETIA UTAMA AR, U13/AR, SEKSYEN U13, SETIA ALAM, 40170, Shah Alam, Selangor",
    region: "SELANGOR",
  },
  {
    id: 64,
    name: "Clasroom: The Gaming Center",
    address: "74, Jalan SS 21/35, Damansara Utama, 47400 Petaling Jaya, Selangor",
    region: "SELANGOR",
  },
  {
    id: 65,
    name: "Game On",
    address: "S-217, Second Floor, The Starling Mall, Jalan SS 21/37, Damansara Utama, 47400, Petaling Jaya, Selangor, Malaysia",
    region: "SELANGOR",
  },
  {
    id: 66,
    name: "V-Collect",
    address: "3A-01, Dataran Pelangi Utama, Jalan Masjid, PJU 6A, Bandar Utama, 47400 PJ, Selangor D.E., Petaling Jaya, Malaysia",
    region: "SELANGOR",
  },
  {
    id: 67,
    name: "The Weatherlight Enterprise",
    address: "29-1, Jalan USJ 10/1a, Taipan Business Centre, 47620 Subang Jaya, Selangor",
    region: "SELANGOR",
  },
  {
    id: 68,
    name: "Cards & Hobbies",
    address: "A-1-5 Parklanes Commercial Hub, Jalan SS7/26, 47301, Kelana Jaya, Selangor",
    region: "SELANGOR",
  },
  {
    id: 69,
    name: "The Collective",
    address: "No 21-2, Jalan Elektron F U16/F, Denai Alam, Shah Alam, Malaysia 40160",
    region: "SELANGOR",
  },
  {
    id: 70,
    name: "The Card Shop PLT",
    address: "54A, Jalan 19/3, 46300, Petaling Jaya, Selangor, Malaysia",
    region: "SELANGOR",
  },
  {
    id: 71,
    name: "Nakama Shop",
    address: "46-1, Jalan Anggerik Vanilla Z 31/Z, 40460, Shah Alam, Selangor, Malaysia",
    region: "SELANGOR",
  },
  {
    id: 72,
    name: "Storm Gate Games",
    address: "Unit R-3A-27 Emporis, Persiaran Surian, Kota Damansara, 47810, Petaling Jaya, Selangor, Malaysia",
    region: "SELANGOR",
  },
  {
    id: 73,
    name: "Cards & Games Capital",
    address: "30-3, Jalan BS 4/2, Taman Bukit Serdang, 43300, Selangor, Seri Kembangan, Malaysia",
    region: "SELANGOR",
  },
  {
    id: 74,
    name: "Spacecard Ent",
    address: "L2-16 Jalan Mewah 4, Taman Ampang Mewah, 68000, Ampang, Selangor, Malaysia",
    region: "SELANGOR",
  },
  {
    id: 75,
    name: "Toreca Hobby",
    address: "10a, Jalan SS 21/58, Damansara Utama, 47400 Petaling Jaya, Selangor",
    region: "SELANGOR",
  },
  {
    id: 76,
    name: "Ethereal Sanctum",
    address: "Unit 603, Level 6, Block A4, Leisure Commerce Square, Jalan PJS 8/9, 46150, Petaling Jaya, Selangor Darul Ehsan, Malaysia",
    region: "SELANGOR",
  },
  {
    id: 77,
    name: "Invictus Forge",
    address: "Lot 2F-55, Second Floor, IOI Mall Damansara, 2, Persiaran Surian, Tropicana Indah, 47810 Petaling Jaya, Selangor",
    region: "SELANGOR",
  },
  {
    id: 78,
    name: "Secret Base",
    address: "SH-G-17, Pangsapuri Perkhidmatan Knox Wawasan, Jalan Sungai Burung 32/68 Seksyen 32, Bukit Rimau, 40460 Shah Alam, Selangor",
    region: "SELANGOR",
  },
  {
    id: 79,
    name: "UNITY GAME",
    address: "A-13A-G & A-13A-M, SUNWAY GIZA, JALAN PJU 5/14, DATARAN SUNWAY, KOTA DAMANSARA, 47810, PETALING JAYA, SELANGOR DARUL EHSAN, Malaysia",
    region: "SELANGOR",
  },
  {
    id: 80,
    name: "Hobby Lords",
    address: "31-1F, Persiaran Setia Utama, Setia Alam, 40170 Shah Alam, Selangor",
    region: "SELANGOR",
  },
  {
    id: 81,
    name: "CARDBROS",
    address: "45-1, Lorong Batu Nilam 3A, Bandar Bukit Tinggi 1, 41200 Klang, Selangor",
    region: "SELANGOR",
  },
  {
    id: 82,
    name: "Games Haven Malaysia",
    address: "20a, Jalan SS 3/31, Taman Universiti, 47300 Petaling Jaya, Selangor",
    region: "SELANGOR",
  },
  {
    id: 83,
    name: "Games Haven BBK",
    address: "17, Lorong Tiara 1a, Bandar Baru Klang, 41150 Klang, Selangor",
    region: "SELANGOR",
  },
  {
    id: 84,
    name: "Atlas Gamers",
    address: "54A, Jalan SS21/62, Damansara Utama, 47400 Petaling Jaya",
    region: "SELANGOR",
  },
  {
    id: 85,
    name: "MYU Collectibles",
    address: "6, usj2/5c, 47600, Subang Jaya, Selangor, Malaysia",
    region: "SELANGOR",
  },
  {
    id: 86,
    name: "Let's Koppie and Hobbies",
    address: "SG-10-0, Subang Square Shopping Gallery, Jalan SS15/4, 47500, Selangor, Subang Jaya, Malaysia",
    region: "SELANGOR",
  },
  {
    id: 87,
    name: "Guildhall Card Game and Board Game",
    address: "Unit D6-1-2, Block D6, Dana 1, Commercial Centre, Jalan PJU 1a/46, Ara Damansara, 47301, Petaling Jaya, Selangor, Malaysia",
    region: "SELANGOR",
  },
  {
    id: 88,
    name: "Deck Out Trading Cards",
    address: "8-2, Jalan USJ 21/6, Taman Indah Subang Uep, 47630 Subang Jaya, Selangor, 47630, Subang Jaya, Selangor, Malaysia",
    region: "SELANGOR",
  },
  {
    id: 89,
    name: "Rare Candy - Cards & Curios",
    address: "A-7-1, Jalan USJ 21/4, 47630, Subang Jaya, Selangor, Malaysia",
    region: "SELANGOR",
  },
  {
    id: 90,
    name: "MVP Hobbies & Collectibles Sdn Bhd",
    address: "A-G-17, Zenopy Shoplex, Jalan LP 7/4, Lestari Perdana, 43300, Seri Kembangan, Selangor, Malaysia",
    region: "SELANGOR",
  },
  {
    id: 91,
    name: "SideDeck",
    address: "20-1, Jalan Impian Makmur 3/A, Saujana Impian, 43000 Kajang, Selangor",
    region: "SELANGOR",
  },
  {
    id: 92,
    name: "Spectre",
    address: "9-1, Jalan PJS 8/13, Bandar Sunway, 46150, Subang Jaya",
    region: "SELANGOR",
  },
  {
    id: 93,
    name: "Boards & Brews by TD",
    address: "5D, Nadayu, 28 Dagang, Jalan PJS 11/7, Bandar Sunway, 47500 Subang Jaya, Selangor",
    region: "SELANGOR",
  },
  {
    id: 94,
    name: "Game and Glory",
    address: "F-1, 42, Jalan PJU 1/45, Aman Suria, 47301 Petaling Jaya, Selangor",
    region: "SELANGOR",
  },
  {
    id: 95,
    name: "Kaadoya",
    address: "L2-45, Mitsui Shopping Park Lalaport BUKIT BINTANG CITY CENTRE, Bukit Bintang City Centre, No.2, Jalan Hang Tuah, 55100, Kuala Lumpur, Wp Kuala Lumpur, Malaysia",
    region: "SELANGOR",
  },
  {
    id: 96,
    name: "Cardcade Tabletop Cafe",
    address: "3A-10, Dataran Pelangi Utama, Jalan Masjid, PJU6A, Bandar Utama, 47400 Petaling Jaya, Selangor",
    region: "SELANGOR",
  },
  {
    id: 97,
    name: "Hobby Outpost Cheras",
    address: "C63-1, Jalan C180/1, Dataran C180, 43200, Cheras, Selangor, Malaysia",
    region: "SELANGOR",
  },
  {
    id: 98,
    name: "Direct No Limit Card Vault",
    address: "NO. 17-4-1 JALAN SETIA PRIMA, U13/D SETIA ALAM, SEKSYEN U13, 40170, Shah Alam, Malaysia",
    region: "SELANGOR",
  },
  {
    id: 99,
    name: "Geniuz Maze Games",
    address: "UG1-40 Radia, Persiaran Tebar Layar, Bukit Jelutong, 40150, Shah Alam, Selangor, Malaysia",
    region: "SELANGOR",
  },
  {
    id: 100,
    name: "Pi Space",
    address: "Shoplot 1 Suria Residence, No 5 Jalan Bazaar U8/100 Bukit Jelutong, 40150, Bukit Jelutong, Selangor",
    region: "SELANGOR",
  },
  {
    id: 101,
    name: "AM Cards & Collectibles",
    address: "32A-1, Jalan Ramin 3, Bandar Botanic, 41200, Klang, Selangor, Malaysia",
    region: "SELANGOR",
  },
  {
    id: 102,
    name: "Ministry of Hobbies",
    address: "43, Jalan Raja Abdullah Satu, 9/19A, Seksyen 9, 40100, Shah Alam, Selangor, Malaysia",
    region: "SELANGOR",
  },
  {
    id: 103,
    name: "saikou",
    address: "34-1A, Jalan Puteri 1/2, Bandar Puteri, 47100, Puchong, Selangor, Malaysia",
    region: "SELANGOR",
  },
  {
    id: 104,
    name: "My Oasis TCG (Pasar TCG)",
    address: "10, Jalan Biola 33/1, Seksyen 33, 40350 Shah Alam, Selangor",
    region: "SELANGOR",
  },
  {
    id: 105,
    name: "Official Brick & Block LEGO Malaysia Toy Store (Eco Majestic)",
    address: "Eco Majestic, 36, Jalan Eco Majestic 10/1D, 43500 Semenyih, Selangor",
    region: "SELANGOR",
  },
  {
    id: 106,
    name: "Adventurers' Hall",
    address: "1st Floor, 50, Jalan SS 2/4a, SS 2, 47300 Petaling Jaya, Selangor",
    region: "SELANGOR",
  },
  {
    id: 107,
    name: "Capitalist Hobbies",
    address: "1-059, Level 1, Seksyen 14, 46100 Petaling Jaya, Selangor",
    region: "SELANGOR",
  },
  {
    id: 108,
    name: "Kichi TCG",
    address: "77-2, Jalan BK 5a/2, Bandar Kinrara, 47180 Puchong, Selangor",
    region: "SELANGOR",
  },
  {
    id: 109,
    name: "Kai Cards & Collectibles",
    address: "Unit 17, 3, Jalan PJS 11/28, Bandar Sunway, 46100 Petaling Jaya, Selangor",
    region: "SELANGOR",
  },
  {
    id: 110,
    name: "Hobby Spot",
    address: "Lot B2, Arked MARA Kajang, Jln TB 1/1, Bandar Kajang, 43000 Kajang, Selangor",
    region: "SELANGOR",
  },
  {
    id: 111,
    name: "KZ Hobby Base Trading",
    address: "B5-2-9, 5, Jalan Teknologi 2/1A, Signature Park, 47810 Petaling Jaya, Selangor",
    region: "SELANGOR",
  },
  {
    id: 112,
    name: "littleAKIBA",
    address: "7-2, Jalan USJ 10/1c, USJ 10 Taipan, 47620 Subang Jaya, Selangor",
    region: "SELANGOR",
  },
  {
    id: 113,
    name: "Game Over Here",
    address: "B -2-5, Arena Mentari, Jalan PJS 8/15, Bandar Sunway, 46150 Petaling Jaya, Selangor",
    region: "SELANGOR",
  },
  {
    id: 114,
    name: "Yuguco",
    address: "NO 5-1, JLN PNBB 2, PUSAT NIAGA BUKIT BARU, 75150 MELAKA, Malaysia",
    region: "MELAKA",
  },
  {
    id: 115,
    name: "Vincent's Card Colosseum",
    address: "Sarawak, Miri, Phase 1, 98000",
    region: "SARAWAK",
  },
  {
    id: 116,
    name: "Yu-King Malaysia",
    address: "2A-B Jalan Bayu Tinggi 5, Taman Bayu Tinggi, Klang, Selangor 41200, Malaysia",
    region: "SELANGOR",
  },
  {
    id: 117,
    name: "Collector's Edition",
    address: "G-3A, Impiria, Lorong Batu Nilam 16A/KS06, Bandar Bukit Tinggi 2, 41200 Klang, Selangor",
    region: "SELANGOR",
  },
  {
    id: 118,
    name: "iKad CYK",
    address: "B-08, 17, Jalan Persiaran Multimedia, Seksyen 7, 40000 Shah Alam, Selangor",
    region: "SELANGOR",
  },
  {
    id: 119,
    name: "Sector Mercatura",
    address: "52, jalan 7/12d, Kampung Batu Muda, 51100, Kuala Lumpur, Wp Kuala Lumpur, Malaysia",
    region: "KUALA LUMPUR",
  },
  {
    id: 120,
    name: "絆-Kizuna",
    address: "26-A, Jalan Mutiara 1/1, Mutiara Rini, 81300, Skudai, Johor, Malaysia",
    region: "JOHOR",
  },
  {
    id: 121,
    name: "Owlbear Eyrie",
    address: "No 18A, Laluan Tasek Timur 1, Pusat Perdagangan Tasek Indra, 31400, Ipoh, Perak, Malaysia",
    region: "PERAK",
  },
  {
    id: 122,
    name: "ERICFUN GAME & HOBBY SHOP",
    address: "83-1, Jalan Equine 9, Taman Equine, 43300 Seri Kembangan, Selangor",
    region: "SELANGOR",
  },
  {
    id: 123,
    name: "Yolo TCG Park",
    address: "Parcel no.2 - level, 3 Of Bintulu, Parkcity Commerce Square, 97000 Bintulu, Sarawak",
    region: "SARAWAK",
  },
  {
    id: 124,
    name: "Labyrinth Games & Collectibles",
    address: "Kampong Gadong, Simpang 27, No.26, Block B, 2/F, Bagunan Gadong Central, BE4119, BE4119, Bandar Seri Begawan, Brunei Muara, Brunei Darussalam",
    region: "BRUNEI",
  },
  {
    id: 125,
    name: "STP HOBBIES COLLECTIBLES SDN. BHD.",
    address: "NO.2-2, DINASTI SENTRAL, JALAN KUCHAI MAJU 19, 58200, Kuala Lumpur, Wp Kuala Lumpur, Malaysia",
    region: "KUALA LUMPUR",
  },
  {
    id: 126,
    name: "Belalang Collectablez",
    address: "3-2, Jalan Seri Putra 1/4, Bandar Seri Putra, 43000 Bangi, Selangor",
    region: "SELANGOR",
  },
  {
    id: 127,
    name: "Top Deck Trading",
    address: "2ND FLOOR, 15-2 VANTAGE POINT, JALAN LENGGONG, 11600 JELUTONG, PULAU PINANG, MALAYSIA",
    region: "PENANG",
  },
  {
    id: 128,
    name: "ORI GAME",
    address: "5-2, Jalan PNBB 2, Pusat Niaga Bukit Baru, 75150, Melaka, Malaysia",
    region: "MELAKA",
  },
  {
    id: 129,
    name: "PCMOD",
    address: "C-11-GF, Garden Shoppe @ One City, Jalan USJ 25/1C, USJ, 47650 Subang Jaya, Selangor, 47650, Subang Jaya, Selangor, Malaysia",
    region: "SELANGOR",
  },
  {
    id: 130,
    name: "Tester Retailer Company",
    address: "Road K, jalan 8, 59200, Bangsar, Wp Kuala Lumpur, Malaysia",
    region: "KUALA LUMPUR",
  },
  {
    id: 131,
    name: "SGC Card Cafe",
    address: "23-02, jalan suria 7, bandar baru seri alam, 81750, Masai, Johor, Malaysia",
    region: "JOHOR",
  },
  {
    id: 132,
    name: "Elements Cards & Hobbies",
    address: "81a, Jalan Rengas, Taman Selatan, 41200, Klang, Selangor, Malaysia",
    region: "SELANGOR",
  },
  {
    id: 133,
    name: "MightyWizards TCG",
    address: "B-3A-08, ATIVO PLAZA, PERSIARAN PERDANA, BDR SRI DAMANSARA, 52200, KL, Wp Kuala Lumpur, Malaysia",
    region: "KUALA LUMPUR",
  },
  {
    id: 134,
    name: "Muhaha tcg",
    address: "27-02 jalan indah 13/3 taman bukit indah 79100 iskandar puteri johor, 719100, Johor bahru, Johor, Malaysia",
    region: "JOHOR",
  },
  {
    id: 135,
    name: "CARDFIGHT BUDDY ENTERPRISE",
    address: "210B JALAN DATUK KUMBAR, 05300, Alor Setar, Kedah, Malaysia",
    region: "KEDAH",
  },
  {
    id: 136,
    name: "TCG Malaysia",
    address: "K-02-13A, Solaris Mont Kiara, Jalan Solaris 2, 50480, Kuala Lumpur Malaysia",
    region: "KUALA LUMPUR",
  },
  {
    id: 137,
    name: "RoundTable Cards&Hobbies Centre",
    address: "B263-t1, jalan berselah, taman berselah 25300 Kuantan Pahang",
    region: "PAHANG",
  },
  {
    id: 138,
    name: "TRUE MINT COLLECTIBLES TRADING",
    address: "Block B-1-9 Soho Ipoh, Jalan Sultan Iskandar Shah, 30000 Ipoh, Perak",
    region: "PERAK",
  },
  {
    id: 139,
    name: "Command Tower TCG Shop",
    address: "11-2F, Jalan Boling Padang G 13/G, Seksyen 13, 40100 Shah Alam, Selangor",
    region: "SELANGOR",
  },
];

export default function RetailersPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-navy-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(36,59,83,0.85),_transparent_55%)]" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-15" />

      <div className="relative">
        <header className="sticky top-0 z-50 border-b border-white/10 bg-navy-950/80 backdrop-blur-sm">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 sm:px-10 lg:px-16">
            <Link
              href="/"
              className="font-display text-xl font-bold tracking-tight text-silver-100 transition-colors hover:text-white"
              aria-label="KC Games Home"
            >
              KC Games
            </Link>
            <nav className="hidden items-center gap-6 text-sm font-semibold text-silver-300 md:flex">
              <Link href="/" className="transition-colors hover:text-white">Home</Link>
              <Link href="/retailer.html" className="transition-colors hover:text-white">Sign Up as Retailer</Link>
            </nav>
          </div>
        </header>

        <section className="relative mx-4 mt-6 overflow-hidden rounded-3xl border border-amber-400/20 bg-[linear-gradient(135deg,rgba(12,24,43,0.95),rgba(18,39,67,0.92))] shadow-2xl sm:mx-10 lg:mx-16">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.22),transparent_36%)]" />
          <div className="relative px-6 py-12 text-center sm:px-10 sm:py-16 lg:px-16 lg:py-20">
            <div className="inline-flex rounded-full border border-amber-400/40 bg-[rgba(32,28,21,0.78)] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.32em] text-amber-200 shadow-[0_10px_30px_rgba(0,0,0,0.28)] backdrop-blur-sm sm:text-xs">
              Official Retailers
            </div>
            <h1 className="mx-auto mt-6 max-w-4xl font-display text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
              Official Riftbound Retailers
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-navy-100">
              Find your nearest KC Games authorised retailer for Riftbound Trading Card Game products, organised play,
              and community events across Malaysia and Brunei.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/retailer.html"
                className="group relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-silver-100 px-8 py-4 text-base font-bold text-navy-950 shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all hover:scale-105 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <span className="absolute inset-0 bg-foil opacity-20 transition-opacity group-hover:opacity-40" />
                <span className="relative flex items-center gap-2 font-display tracking-wider">
                  Sign Up as Retailer
                  <ChevronRight className="h-5 w-5" aria-hidden />
                </span>
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-lg border border-silver-400/30 bg-navy-900/60 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition-all hover:border-white hover:bg-navy-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-12 sm:px-10 lg:px-16 lg:py-16">
          <div className="mb-6">
            <h2 className="font-display text-2xl font-bold text-silver-100 sm:text-3xl">Our Retail Network</h2>
            <p className="mt-2 text-navy-200">Find a retailer by name, city, or state.</p>
          </div>

          <RetailerSearch retailers={retailers} />

          <div className="mt-16 rounded-3xl border border-navy-700/50 bg-card-gradient p-8 text-center shadow-2xl sm:p-12">
            <h2 className="font-display text-2xl font-bold text-silver-100 sm:text-3xl">Want to join the network?</h2>
            <p className="mx-auto mt-3 max-w-2xl text-navy-200">
              Become an authorised KC Games retailer and stock Riftbound Trading Card Game products in your store.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/retailer.html"
                className="group relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-silver-100 px-8 py-4 text-base font-bold text-navy-950 shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all hover:scale-105 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <span className="absolute inset-0 bg-foil opacity-20 transition-opacity group-hover:opacity-40" />
                <span className="relative flex items-center gap-2 font-display tracking-wider">
                  Sign Up as Retailer
                  <ChevronRight className="h-5 w-5" aria-hidden />
                </span>
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-lg border border-silver-400/30 bg-navy-900/60 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition-all hover:border-white hover:bg-navy-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </section>

        <footer className="flex flex-col items-center gap-4 pb-10 pt-6">
          <FacebookFooterLink className="text-silver-400" />
          <p className="text-sm text-navy-400">© 2026 KC Games Sdn Bhd. All rights reserved.</p>
        </footer>
      </div>
    </main>
  );
}
