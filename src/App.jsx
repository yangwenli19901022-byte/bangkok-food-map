import React, { useEffect, useMemo, useRef, useState } from 'react'
import Map from './components/Map'
import DetailsModal from './components/DetailsModal'
const defaultMarkers = [
  {
    "id": 1,
    "name": "Gaggan Anand",
    "short": "亚洲前50餐厅，现代印度创意料理",
    "address": "68/1 Soi Langsuan, Lumpini",
    "lat": 13.730946,
    "lng": 100.539049,
    "source": "2023-michelin,2024-michelin,2026-asia50",
    "year": 2023,
    "website": "https://www.gaggananand.com/",
    "photos": [
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=60"
    ],
    "avgPrice": "THB 2,500",
    "phone": "+66 2 652 1700",
    "hours": "12:00-14:30 / 18:00-22:30",
    "category": "restaurant"
  },
  {
    "id": 2,
    "name": "Sühring",
    "short": "米其林双星，德国风味现代料理",
    "address": "10 Yen Akat Soi 3, Chong Nonsi",
    "lat": 13.726383,
    "lng": 100.530721,
    "source": "2025-michelin,2026-michelin,2026-asia50",
    "year": 2023,
    "website": "https://www.suhring.com/",
    "photos": [
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80"
    ],
    "avgPrice": "THB 4,200",
    "phone": "+66 2 679 3955",
    "hours": "18:00-23:00",
    "category": "restaurant"
  },
  {
    "id": 3,
    "name": "Le Du",
    "short": "当代泰式料理与本地季节食材",
    "address": "399/3 Silom Soi 7, Silom",
    "lat": 13.723769,
    "lng": 100.545626,
    "source": "2024-michelin,2025-michelin,2023-asia50",
    "year": 2023,
    "website": "https://ledubkk.com/",
    "photos": [
      "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=800&q=80"
    ],
    "category": "restaurant"
  },
  {
    "id": 4,
    "name": "Nahm",
    "short": "米其林推荐经典泰国风味",
    "address": "27 S Sathorn Rd, Sathorn",
    "lat": 13.72491,
    "lng": 100.532354,
    "source": "2024-michelin,2025-michelin",
    "year": 2023,
    "website": "https://www.google.com/search?q=Nahm+%E6%9B%BC%E8%B0%B7",
    "photos": [
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=80"
    ],
    "category": "restaurant"
  },
  {
    "id": 5,
    "name": "Sorn",
    "short": "米其林二星南部泰式料理",
    "address": "56 Sukhumvit 26, Khlong Tan",
    "lat": 13.734103,
    "lng": 100.569049,
    "source": "2025-michelin,2026-michelin",
    "year": 2023,
    "website": "https://sornfinesouthern.com/",
    "photos": [
      "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1506354666786-959d6d497f1a?auto=format&fit=crop&w=800&q=80"
    ],
    "category": "restaurant"
  },
  {
    "id": 6,
    "name": "Paste",
    "short": "亚洲前50餐厅，皇室泰式新潮美食",
    "address": "3/1 Soi Tantawan, Lumpini",
    "lat": 13.734446,
    "lng": 100.529501,
    "source": "2024-michelin,2025-michelin,2025-asia50",
    "year": 2023,
    "website": "https://pastebangkok.com/",
    "photos": [
      "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=800&q=80"
    ],
    "category": "restaurant"
  },
  {
    "id": 7,
    "name": "Jay Fai",
    "short": "米其林一星街头海鲜煎蛋",
    "address": "327 Maha Chai Rd, Samran Rat",
    "lat": 13.7527,
    "lng": 100.537656,
    "source": "2023-michelin,2024-michelin",
    "year": 2023,
    "website": "https://www.google.com/search?q=Jay+Fai+%E6%9B%BC%E8%B0%B7",
    "photos": [
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=80"
    ],
    "category": "restaurant"
  },
  {
    "id": 8,
    "name": "Bo.lan",
    "short": "传统泰式烹饪与有机菜园",
    "address": "24 Sukhumvit 53, Phra Khanong",
    "lat": 13.730344,
    "lng": 100.589491,
    "source": "2023-michelin,2024-michelin",
    "year": 2023,
    "website": "https://bolan.co.th/",
    "photos": [
      "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1506354666786-959d6d497f1a?auto=format&fit=crop&w=800&q=80"
    ],
    "category": "restaurant"
  },
  {
    "id": 9,
    "name": "80/20",
    "short": "本地食材与轻奢风味",
    "address": "72/1 Sukhumvit 61 Lane 1, Phra Khanong",
    "lat": 13.732894,
    "lng": 100.589146,
    "source": "other",
    "year": 2023,
    "website": "https://www.google.com/search?q=80%2F20+%E6%9B%BC%E8%B0%B7",
    "photos": [
      "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=800&q=80"
    ],
    "category": "other"
  },
  {
    "id": 10,
    "name": "Canvas",
    "short": "现代泰式料理与艺术呈盘",
    "address": "8/8 Sukhumvit 55, Thonglor",
    "lat": 13.738101,
    "lng": 100.580298,
    "source": "2023-asia50",
    "year": 2023,
    "website": "https://www.google.com/search?q=Canvas+%E6%9B%BC%E8%B0%B7",
    "photos": [
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=80"
    ],
    "category": "restaurant"
  },
  {
    "id": 11,
    "name": "Aksorn",
    "short": "米其林推荐经典泰式家常菜",
    "address": "45 Sukhumvit 23, Khlong Toei",
    "lat": 13.727281,
    "lng": 100.544434,
    "source": "other",
    "year": 2023,
    "website": "https://www.google.com/search?q=Aksorn+%E6%9B%BC%E8%B0%B7",
    "photos": [
      "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1506354666786-959d6d497f1a?auto=format&fit=crop&w=800&q=80"
    ],
    "category": "other"
  },
  {
    "id": 12,
    "name": "Saneh Jaan",
    "short": "传统泰式名厨私房料理",
    "address": "26 Sukhumvit 23, Khlong Toei",
    "lat": 13.72753,
    "lng": 100.555367,
    "source": "other",
    "year": 2023,
    "website": "https://www.google.com/search?q=Saneh+Jaan+%E6%9B%BC%E8%B0%B7",
    "photos": [
      "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=800&q=80"
    ],
    "category": "other"
  },
  {
    "id": 13,
    "name": "Elements",
    "short": "米其林三星主厨新派泰料理",
    "address": "42 Sukhumvit 26, Khlong Tan",
    "lat": 13.740046,
    "lng": 100.570255,
    "source": "2025-asia50",
    "year": 2023,
    "website": "https://www.google.com/search?q=Elements+%E6%9B%BC%E8%B0%B7",
    "photos": [
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=80"
    ],
    "category": "restaurant"
  },
  {
    "id": 14,
    "name": "Le Normandie",
    "short": "老牌法式美馔与河畔华丽氛围",
    "address": "48 Oriental Ave, Riverside",
    "lat": 13.71926,
    "lng": 100.520099,
    "source": "2024-michelin,2025-michelin",
    "year": 2023,
    "website": "https://www.google.com/search?q=Le+Normandie+%E6%9B%BC%E8%B0%B7",
    "photos": [
      "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1506354666786-959d6d497f1a?auto=format&fit=crop&w=800&q=80"
    ],
    "category": "restaurant"
  },
  {
    "id": 15,
    "name": "Aaharn",
    "short": "现代泰式多道套餐体验",
    "address": "80/1 Sukhumvit 53, Phra Khanong",
    "lat": 13.733459,
    "lng": 100.584564,
    "source": "other",
    "year": 2023,
    "website": "https://www.google.com/search?q=Aaharn+%E6%9B%BC%E8%B0%B7",
    "photos": [
      "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=800&q=80"
    ],
    "category": "other"
  },
  {
    "id": 16,
    "name": "Savelberg Bangkok",
    "short": "荷式经典与泰式食材混搭",
    "address": "37/1 Langsuan Rd, Pathum Wan",
    "lat": 13.741581,
    "lng": 100.541025,
    "source": "2024-michelin,2025-michelin",
    "year": 2023,
    "website": "https://www.google.com/search?q=Savelberg+Bangkok+%E6%9B%BC%E8%B0%B7",
    "photos": [
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=80"
    ],
    "category": "restaurant"
  },
  {
    "id": 17,
    "name": "Issaya Siamese Club",
    "short": "名厨 Pailin 的泰式创意料理",
    "address": "4 Sri Aksorn Rd, Langsuan",
    "lat": 13.747885,
    "lng": 100.54249,
    "source": "2023-michelin,2024-michelin",
    "year": 2023,
    "website": "https://www.google.com/search?q=Issaya+Siamese+Club+%E6%9B%BC%E8%B0%B7",
    "photos": [
      "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1506354666786-959d6d497f1a?auto=format&fit=crop&w=800&q=80"
    ],
    "category": "restaurant"
  },
  {
    "id": 18,
    "name": "Bunker",
    "short": "美式料理与工业风酒吧",
    "address": "50 Sukhumvit 55, Thonglor",
    "lat": 13.74156,
    "lng": 100.580198,
    "source": "other",
    "year": 2023,
    "website": "https://www.google.com/search?q=Bunker+%E6%9B%BC%E8%B0%B7",
    "photos": [
      "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=800&q=80"
    ],
    "category": "other"
  },
  {
    "id": 19,
    "name": "Dala",
    "short": "法式料理与繁华城市绿洲",
    "address": "152/3 Ploenchit Rd, Ploenchit",
    "lat": 13.754731,
    "lng": 100.536022,
    "source": "other",
    "year": 2023,
    "website": "https://www.google.com/search?q=Dala+%E6%9B%BC%E8%B0%B7",
    "photos": [
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=80"
    ],
    "category": "other"
  },
  {
    "id": 20,
    "name": "Babette's The Steakhouse",
    "short": "精品牛排与经典西餐",
    "address": "57 Sukhumvit 39, Phrom Phong",
    "lat": 13.740391,
    "lng": 100.568401,
    "source": "other",
    "year": 2023,
    "website": "https://www.google.com/search?q=Babette%27s+The+Steakhouse+%E6%9B%BC%E8%B0%B7",
    "photos": [
      "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1506354666786-959d6d497f1a?auto=format&fit=crop&w=800&q=80"
    ],
    "category": "other"
  },
  {
    "id": 21,
    "name": "The Bamboo Bar",
    "short": "曼谷最经典的酒店鸡尾酒吧",
    "address": "Mandarin Oriental, Riverside",
    "lat": 13.719839,
    "lng": 100.522418,
    "source": "other",
    "year": 2023,
    "website": "https://www.google.com/search?q=The+Bamboo+Bar+%E6%9B%BC%E8%B0%B7",
    "photos": [
      "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=800&q=80"
    ],
    "category": "bar"
  },
  {
    "id": 22,
    "name": "Tropic City",
    "short": "亚洲前50酒吧，热带风味鸡尾酒",
    "address": "672/71 Charoenkrung Rd, Charoenkrung",
    "lat": 13.725748,
    "lng": 100.502578,
    "source": "2023-asia50",
    "year": 2023,
    "website": "https://www.google.com/search?q=Tropic+City+%E6%9B%BC%E8%B0%B7",
    "photos": [
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=80"
    ],
    "category": "restaurant"
  },
  {
    "id": 23,
    "name": "Teens of Thailand",
    "short": "经典琴通纳那巷的特色鸡尾酒",
    "address": "76 Soi Nana, Chinatown",
    "lat": 13.743943,
    "lng": 100.516656,
    "source": "other",
    "year": 2023,
    "website": "https://www.google.com/search?q=Teens+of+Thailand+%E6%9B%BC%E8%B0%B7",
    "photos": [
      "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1506354666786-959d6d497f1a?auto=format&fit=crop&w=800&q=80"
    ],
    "category": "other"
  },
  {
    "id": 24,
    "name": "Backstage Cocktail Bar",
    "short": "表演主题调酒吧",
    "address": "6 Sukhumvit 23, Asoke",
    "lat": 13.73826,
    "lng": 100.560303,
    "source": "other",
    "year": 2023,
    "website": "https://www.google.com/search?q=Backstage+Cocktail+Bar+%E6%9B%BC%E8%B0%B7",
    "photos": [
      "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=800&q=80"
    ],
    "category": "bar"
  },
  {
    "id": 25,
    "name": "Rabbit Hole",
    "short": "隐秘酒吧与创意调酒",
    "address": "116/2 Thonglor 13, Thonglor",
    "lat": 13.742644,
    "lng": 100.588421,
    "source": "other",
    "year": 2023,
    "website": "https://www.google.com/search?q=Rabbit+Hole+%E6%9B%BC%E8%B0%B7",
    "photos": [
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=80"
    ],
    "category": "bar"
  },
  {
    "id": 26,
    "name": "Iron Balls Distillery",
    "short": "工业风烈酒与手调鸡尾酒",
    "address": "30 Sukhumvit 26, Khlong Tan",
    "lat": 13.730884,
    "lng": 100.564776,
    "source": "other",
    "year": 2024,
    "website": "https://www.google.com/search?q=Iron+Balls+Distillery+%E6%9B%BC%E8%B0%B7",
    "photos": [
      "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1506354666786-959d6d497f1a?auto=format&fit=crop&w=800&q=80"
    ],
    "category": "bar"
  },
  {
    "id": 27,
    "name": "Vesper",
    "short": "现代欧风酒吧餐厅",
    "address": "10 Convent Rd, Silom",
    "lat": 13.72726,
    "lng": 100.536052,
    "source": "other",
    "year": 2024,
    "website": "https://www.google.com/search?q=Vesper+%E6%9B%BC%E8%B0%B7",
    "photos": [
      "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=800&q=80"
    ],
    "category": "other"
  },
  {
    "id": 28,
    "name": "Asia Today",
    "short": "香料主题小酒吧",
    "address": "189/4 Charoen Krung 24, Chinatown",
    "lat": 13.724897,
    "lng": 100.49893,
    "source": "other",
    "year": 2024,
    "website": "https://www.google.com/search?q=Asia+Today+%E6%9B%BC%E8%B0%B7",
    "photos": [
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=80"
    ],
    "category": "other"
  },
  {
    "id": 29,
    "name": "Smalls",
    "short": "舒适老洋房风情的地下酒吧",
    "address": "186/3 Suan Phlu, Sathorn",
    "lat": 13.725795,
    "lng": 100.536835,
    "source": "other",
    "year": 2024,
    "website": "https://www.google.com/search?q=Smalls+%E6%9B%BC%E8%B0%B7",
    "photos": [
      "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1506354666786-959d6d497f1a?auto=format&fit=crop&w=800&q=80"
    ],
    "category": "other"
  },
  {
    "id": 30,
    "name": "J.Boroski",
    "short": "私人订制鸡尾酒体验",
    "address": "3/1 Sukhumvit 55, Thonglor",
    "lat": 13.743801,
    "lng": 100.578775,
    "source": "other",
    "year": 2024,
    "website": "https://www.google.com/search?q=J.Boroski+%E6%9B%BC%E8%B0%B7",
    "photos": [
      "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=800&q=80"
    ],
    "category": "other"
  },
  {
    "id": 31,
    "name": "TEP BAR",
    "short": "经典泰式风味调酒与传统表演",
    "address": "69/9 Soi Nana, Chinatown",
    "lat": 13.737697,
    "lng": 100.511733,
    "source": "other",
    "year": 2024,
    "website": "https://www.google.com/search?q=TEP+BAR+%E6%9B%BC%E8%B0%B7",
    "photos": [
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=80"
    ],
    "category": "bar"
  },
  {
    "id": 32,
    "name": "The Locker Room",
    "short": "秘密酒吧与运动主题调酒",
    "address": "7/1 Sukhumvit 31, Phrom Phong",
    "lat": 13.748768,
    "lng": 100.535091,
    "source": "other",
    "year": 2024,
    "website": "https://www.google.com/search?q=The+Locker+Room+%E6%9B%BC%E8%B0%B7",
    "photos": [
      "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1506354666786-959d6d497f1a?auto=format&fit=crop&w=800&q=80"
    ],
    "category": "other"
  },
  {
    "id": 33,
    "name": "The House on Sathorn",
    "short": "历史建筑里的酒吧餐厅",
    "address": "106 North Sathorn Rd, Sathorn",
    "lat": 13.719801,
    "lng": 100.533656,
    "source": "other",
    "year": 2024,
    "website": "https://www.google.com/search?q=The+House+on+Sathorn+%E6%9B%BC%E8%B0%B7",
    "photos": [
      "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=800&q=80"
    ],
    "category": "other"
  },
  {
    "id": 34,
    "name": "The Bar Upstairs",
    "short": "屋顶酒吧与城市夜景",
    "address": "49/2 Soi Ruamrudee, Lumphini",
    "lat": 13.721402,
    "lng": 100.540234,
    "source": "other",
    "year": 2024,
    "website": "https://www.google.com/search?q=The+Bar+Upstairs+%E6%9B%BC%E8%B0%B7",
    "photos": [
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=80"
    ],
    "category": "bar"
  },
  {
    "id": 35,
    "name": "Sky Bar Lebua",
    "short": "高空夜景与经典鸡尾酒",
    "address": "1055 Silom Rd, Silom",
    "lat": 13.72903,
    "lng": 100.547586,
    "source": "other",
    "year": 2024,
    "website": "https://www.google.com/search?q=Sky+Bar+Lebua+%E6%9B%BC%E8%B0%B7",
    "photos": [
      "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1506354666786-959d6d497f1a?auto=format&fit=crop&w=800&q=80"
    ],
    "category": "bar"
  },
  {
    "id": 36,
    "name": "Moon Bar",
    "short": "高空屋顶酒吧俯瞰湄南河",
    "address": "21/100 South Sathon Rd, Sathorn",
    "lat": 13.7203,
    "lng": 100.544373,
    "source": "other",
    "year": 2024,
    "website": "https://www.google.com/search?q=Moon+Bar+%E6%9B%BC%E8%B0%B7",
    "photos": [
      "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=800&q=80"
    ],
    "category": "bar"
  },
  {
    "id": 37,
    "name": "Octave Rooftop Lounge",
    "short": "360 度天台派对酒吧",
    "address": "2 Sukhumvit 57, Thonglor",
    "lat": 13.737039,
    "lng": 100.581823,
    "source": "other",
    "year": 2024,
    "website": "https://www.google.com/search?q=Octave+Rooftop+Lounge+%E6%9B%BC%E8%B0%B7",
    "photos": [
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=80"
    ],
    "category": "bar"
  },
  {
    "id": 38,
    "name": "Above Eleven",
    "short": "秘鲁日式融合屋顶酒吧",
    "address": "38/8 Sukhumvit 11, Nana",
    "lat": 13.751317,
    "lng": 100.536259,
    "source": "other",
    "year": 2024,
    "website": "https://www.google.com/search?q=Above+Eleven+%E6%9B%BC%E8%B0%B7",
    "photos": [
      "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1506354666786-959d6d497f1a?auto=format&fit=crop&w=800&q=80"
    ],
    "category": "other"
  },
  {
    "id": 39,
    "name": "Vertigo Too",
    "short": "双层屋顶酒吧与城市天际线",
    "address": "12/52 South Sathon Rd, Sathorn",
    "lat": 13.723734,
    "lng": 100.530073,
    "source": "other",
    "year": 2024,
    "website": "https://www.google.com/search?q=Vertigo+Too+%E6%9B%BC%E8%B0%B7",
    "photos": [
      "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=800&q=80"
    ],
    "category": "other"
  },
  {
    "id": 40,
    "name": "HI-SO Bar",
    "short": "豪华酒店顶部休闲酒吧",
    "address": "2 North Sathorn Rd, Sathorn",
    "lat": 13.727174,
    "lng": 100.546487,
    "source": "other",
    "year": 2024,
    "website": "https://www.google.com/search?q=HI-SO+Bar+%E6%9B%BC%E8%B0%B7",
    "photos": [
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=80"
    ],
    "category": "bar"
  },
  {
    "id": 41,
    "name": "Mahanakhon SkyBar",
    "short": "泰国最高观景酒吧",
    "address": "114 Naradhiwas Rajanagarindra Rd, Silom",
    "lat": 13.730252,
    "lng": 100.548014,
    "source": "other",
    "year": 2024,
    "website": "https://www.google.com/search?q=Mahanakhon+SkyBar+%E6%9B%BC%E8%B0%B7",
    "photos": [
      "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1506354666786-959d6d497f1a?auto=format&fit=crop&w=800&q=80"
    ],
    "category": "bar"
  },
  {
    "id": 42,
    "name": "Scarlett Wine Bar",
    "short": "红酒与城市天际观景",
    "address": "37-37/1 Patpong 2, Silom",
    "lat": 13.72475,
    "lng": 100.542288,
    "source": "other",
    "year": 2024,
    "website": "https://www.google.com/search?q=Scarlett+Wine+Bar+%E6%9B%BC%E8%B0%B7",
    "photos": [
      "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=800&q=80"
    ],
    "category": "bar"
  },
  {
    "id": 43,
    "name": "ThreeSixty Rooftop Bar",
    "short": "全景露台酒吧与夜景",
    "address": "40/5 Surawong Rd, Silom",
    "lat": 13.726213,
    "lng": 100.536517,
    "source": "other",
    "year": 2024,
    "website": "https://www.google.com/search?q=ThreeSixty+Rooftop+Bar+%E6%9B%BC%E8%B0%B7",
    "photos": [
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=80"
    ],
    "category": "bar"
  },
  {
    "id": 44,
    "name": "Red Sky",
    "short": "大型屋顶酒吧与法式餐点",
    "address": "999/99 Rama I Rd, Pathum Wan",
    "lat": 13.748529,
    "lng": 100.53975,
    "source": "other",
    "year": 2024,
    "website": "https://www.google.com/search?q=Red+Sky+%E6%9B%BC%E8%B0%B7",
    "photos": [
      "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1506354666786-959d6d497f1a?auto=format&fit=crop&w=800&q=80"
    ],
    "category": "other"
  },
  {
    "id": 45,
    "name": "CÉ LA VI",
    "short": "亚洲前50酒吧之一的高端天台",
    "address": "39/8-9 Sathorn Rd, Sathorn",
    "lat": 13.723744,
    "lng": 100.536056,
    "source": "2024-asia50",
    "year": 2024,
    "website": "https://www.google.com/search?q=C%C3%89+LA+VI+%E6%9B%BC%E8%B0%B7",
    "photos": [
      "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=800&q=80"
    ],
    "category": "restaurant"
  },
  {
    "id": 46,
    "name": "Mikkeller Bangkok",
    "short": "精酿啤酒酒吧与潮流氛围",
    "address": "38 Sukhumvit 26, Khlong Tan",
    "lat": 13.736164,
    "lng": 100.555232,
    "source": "other",
    "year": 2024,
    "website": "https://www.google.com/search?q=Mikkeller+Bangkok+%E6%9B%BC%E8%B0%B7",
    "photos": [
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=80"
    ],
    "category": "other"
  },
  {
    "id": 47,
    "name": "Iron Fairies",
    "short": "梦幻铁艺主题酒吧",
    "address": "464/1-5 Thonglor 10, Thonglor",
    "lat": 13.737441,
    "lng": 100.577903,
    "source": "other",
    "year": 2024,
    "website": "https://www.google.com/search?q=Iron+Fairies+%E6%9B%BC%E8%B0%B7",
    "photos": [
      "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1506354666786-959d6d497f1a?auto=format&fit=crop&w=800&q=80"
    ],
    "category": "other"
  },
  {
    "id": 48,
    "name": "Q Bar",
    "short": "经典夜店与国际调酒",
    "address": "44/5 Sukhumvit 11, Nana",
    "lat": 13.75325,
    "lng": 100.547737,
    "source": "other",
    "year": 2024,
    "website": "https://www.google.com/search?q=Q+Bar+%E6%9B%BC%E8%B0%B7",
    "photos": [
      "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=800&q=80"
    ],
    "category": "bar"
  },
  {
    "id": 49,
    "name": "Hair of the Dog",
    "short": "美式酒吧与独特鸡尾酒",
    "address": "170/1 Sukhumvit 55, Thonglor",
    "lat": 13.741155,
    "lng": 100.577569,
    "source": "other",
    "year": 2024,
    "website": "https://www.google.com/search?q=Hair+of+the+Dog+%E6%9B%BC%E8%B0%B7",
    "photos": [
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=80"
    ],
    "category": "other"
  },
  {
    "id": 50,
    "name": "Forbidden City",
    "short": "老牌中式风格酒吧",
    "address": "29/3-4 Soi Ruamrudee, Lumphini",
    "lat": 13.724262,
    "lng": 100.540671,
    "source": "other",
    "year": 2024,
    "website": "https://www.google.com/search?q=Forbidden+City+%E6%9B%BC%E8%B0%B7",
    "photos": [
      "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1506354666786-959d6d497f1a?auto=format&fit=crop&w=800&q=80"
    ],
    "category": "other"
  },
  {
    "id": 51,
    "name": "The Speakeasy",
    "short": "复古风格的隐秘屋顶酒吧",
    "address": "939/39 Rama I Rd, Pathum Wan",
    "lat": 13.75373,
    "lng": 100.529728,
    "source": "other",
    "year": 2025,
    "website": "https://www.google.com/search?q=The+Speakeasy+%E6%9B%BC%E8%B0%B7",
    "photos": [
      "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=800&q=80"
    ],
    "category": "bar"
  },
  {
    "id": 52,
    "name": "Hemingway's Bangkok",
    "short": "晚宴式酒吧与经典鸡尾酒",
    "address": "1 Sukhumvit 11, Nana",
    "lat": 13.753107,
    "lng": 100.542421,
    "source": "other",
    "year": 2025,
    "website": "https://www.google.com/search?q=Hemingway%27s+Bangkok+%E6%9B%BC%E8%B0%B7",
    "photos": [
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=80"
    ],
    "category": "other"
  },
  {
    "id": 53,
    "name": "L'Atelier de Joël Robuchon",
    "short": "名厨法国料理餐酒体验",
    "address": "39/1-2 Sathorn Rd, Sathorn",
    "lat": 13.7204,
    "lng": 100.543438,
    "source": "other",
    "year": 2025,
    "website": "https://www.google.com/search?q=L%27Atelier+de+Jo%C3%ABl+Robuchon+%E6%9B%BC%E8%B0%B7",
    "photos": [
      "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1506354666786-959d6d497f1a?auto=format&fit=crop&w=800&q=80"
    ],
    "category": "other"
  },
  {
    "id": 54,
    "name": "Maison Jean Philippe",
    "short": "法式甜点与咖啡轻食",
    "address": "5/F EmQuartier, Phrom Phong",
    "lat": 13.735755,
    "lng": 100.57169,
    "source": "other",
    "year": 2025,
    "website": "https://www.google.com/search?q=Maison+Jean+Philippe+%E6%9B%BC%E8%B0%B7",
    "photos": [
      "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=800&q=80"
    ],
    "category": "other"
  },
  {
    "id": 55,
    "name": "Roast",
    "short": "精品咖啡与全天早午餐",
    "address": "49/2 The Commons, Thonglor",
    "lat": 13.74259,
    "lng": 100.577741,
    "source": "other",
    "year": 2025,
    "website": "https://www.google.com/search?q=Roast+%E6%9B%BC%E8%B0%B7",
    "photos": [
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=80"
    ],
    "category": "other"
  },
  {
    "id": 56,
    "name": "Casa Lapin",
    "short": "复古风格精品咖啡馆",
    "address": "16 Sukhumvit 49, Phrom Phong",
    "lat": 13.738878,
    "lng": 100.571934,
    "source": "other",
    "year": 2025,
    "website": "https://www.google.com/search?q=Casa+Lapin+%E6%9B%BC%E8%B0%B7",
    "photos": [
      "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1506354666786-959d6d497f1a?auto=format&fit=crop&w=800&q=80"
    ],
    "category": "other"
  },
  {
    "id": 57,
    "name": "One Ounce for Onion",
    "short": "亚洲前50咖啡馆与手冲精品",
    "address": "98/1 Sukhumvit 55, Thonglor",
    "lat": 13.739343,
    "lng": 100.579179,
    "source": "2024-asia50",
    "year": 2025,
    "website": "https://www.google.com/search?q=One+Ounce+for+Onion+%E6%9B%BC%E8%B0%B7",
    "photos": [
      "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=800&q=80"
    ],
    "category": "restaurant"
  },
  {
    "id": 58,
    "name": "Toby's",
    "short": "澳式早午餐与手冲咖啡",
    "address": "36 Soi Sukhumvit 38, Phrom Phong",
    "lat": 13.741449,
    "lng": 100.566043,
    "source": "other",
    "year": 2025,
    "website": "https://www.google.com/search?q=Toby%27s+%E6%9B%BC%E8%B0%B7",
    "photos": [
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=80"
    ],
    "category": "other"
  },
  {
    "id": 59,
    "name": "Roots Handmade Coffee",
    "short": "本地烘焙与咖啡实验室",
    "address": "37/1 Sukhumvit 49, Phrom Phong",
    "lat": 13.732985,
    "lng": 100.567288,
    "source": "other",
    "year": 2025,
    "website": "https://www.google.com/search?q=Roots+Handmade+Coffee+%E6%9B%BC%E8%B0%B7",
    "photos": [
      "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1506354666786-959d6d497f1a?auto=format&fit=crop&w=800&q=80"
    ],
    "category": "cafe"
  },
  {
    "id": 60,
    "name": "Café Tartine",
    "short": "法式甜点与温馨咖啡时光",
    "address": "29 Sukhumvit 55, Thonglor",
    "lat": 13.737319,
    "lng": 100.584459,
    "source": "other",
    "year": 2025,
    "website": "https://www.google.com/search?q=Caf%C3%A9+Tartine+%E6%9B%BC%E8%B0%B7",
    "photos": [
      "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=800&q=80"
    ],
    "category": "other"
  },
  {
    "id": 61,
    "name": "Audrey Café",
    "short": "网红泰式西式混搭甜点",
    "address": "4 Siam Square Soi 3, Pathum Wan",
    "lat": 13.74887,
    "lng": 100.535542,
    "source": "other",
    "year": 2025,
    "website": "https://www.google.com/search?q=Audrey+Caf%C3%A9+%E6%9B%BC%E8%B0%B7",
    "photos": [
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=80"
    ],
    "category": "other"
  },
  {
    "id": 62,
    "name": "After You Dessert Cafe",
    "short": "甜点连锁招牌蜜糖吐司",
    "address": "Siam Square One, Pathum Wan",
    "lat": 13.753368,
    "lng": 100.538637,
    "source": "other",
    "year": 2025,
    "website": "https://www.google.com/search?q=After+You+Dessert+Cafe+%E6%9B%BC%E8%B0%B7",
    "photos": [
      "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1506354666786-959d6d497f1a?auto=format&fit=crop&w=800&q=80"
    ],
    "category": "cafe"
  },
  {
    "id": 63,
    "name": "Mont Nom Sod",
    "short": "经典泰式牛奶吐司与甜品",
    "address": "2/1 Sukhumvit Soi 21, Asoke",
    "lat": 13.739556,
    "lng": 100.556446,
    "source": "other",
    "year": 2025,
    "website": "https://www.google.com/search?q=Mont+Nom+Sod+%E6%9B%BC%E8%B0%B7",
    "photos": [
      "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=800&q=80"
    ],
    "category": "other"
  },
  {
    "id": 64,
    "name": "Mae Varee Mango Sticky Rice",
    "short": "知名芒果糯米饭老店",
    "address": "16 Ari Samphan Soi 1, Ari",
    "lat": 13.787899,
    "lng": 100.538823,
    "source": "other",
    "year": 2025,
    "website": "https://www.google.com/search?q=Mae+Varee+Mango+Sticky+Rice+%E6%9B%BC%E8%B0%B7",
    "photos": [
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=80"
    ],
    "category": "other"
  },
  {
    "id": 65,
    "name": "Coffee Beans by Dao",
    "short": "简约文青风咖啡馆",
    "address": "14 Sukhumvit 49, Phrom Phong",
    "lat": 13.74119,
    "lng": 100.561871,
    "source": "other",
    "year": 2025,
    "website": "https://www.google.com/search?q=Coffee+Beans+by+Dao+%E6%9B%BC%E8%B0%B7",
    "photos": [
      "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1506354666786-959d6d497f1a?auto=format&fit=crop&w=800&q=80"
    ],
    "category": "cafe"
  },
  {
    "id": 66,
    "name": "Gallery Drip Coffee",
    "short": "画廊主题手冲精品咖啡",
    "address": "Soi Ari 5, Ari",
    "lat": 13.787496,
    "lng": 100.548486,
    "source": "other",
    "year": 2025,
    "website": "https://www.google.com/search?q=Gallery+Drip+Coffee+%E6%9B%BC%E8%B0%B7",
    "photos": [
      "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=800&q=80"
    ],
    "category": "cafe"
  },
  {
    "id": 67,
    "name": "Rocket Coffeebar",
    "short": "北欧风格咖啡与早午餐",
    "address": "Soi Sukhumvit 49, Phrom Phong",
    "lat": 13.737346,
    "lng": 100.565581,
    "source": "other",
    "year": 2025,
    "website": "https://www.google.com/search?q=Rocket+Coffeebar+%E6%9B%BC%E8%B0%B7",
    "photos": [
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=80"
    ],
    "category": "bar"
  },
  {
    "id": 68,
    "name": "FABB Coffee Roasters",
    "short": "咖啡烘焙与单品手冲",
    "address": "Sukhumvit 49 Alley 1, Phrom Phong",
    "lat": 13.731747,
    "lng": 100.558306,
    "source": "other",
    "year": 2025,
    "website": "https://www.google.com/search?q=FABB+Coffee+Roasters+%E6%9B%BC%E8%B0%B7",
    "photos": [
      "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1506354666786-959d6d497f1a?auto=format&fit=crop&w=800&q=80"
    ],
    "category": "cafe"
  },
  {
    "id": 69,
    "name": "Hands and Heart Bakery",
    "short": "手工面包与精品咖啡",
    "address": "Udomsuk 36, Bang Na",
    "lat": 13.751535,
    "lng": 100.535811,
    "source": "other",
    "year": 2025,
    "website": "https://www.google.com/search?q=Hands+and+Heart+Bakery+%E6%9B%BC%E8%B0%B7",
    "photos": [
      "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=800&q=80"
    ],
    "category": "other"
  },
  {
    "id": 70,
    "name": "Café Chilli White",
    "short": "泰式甜品与网红奶茶",
    "address": "Soi Ari 4, Ari",
    "lat": 13.785019,
    "lng": 100.548325,
    "source": "other",
    "year": 2025,
    "website": "https://www.google.com/search?q=Caf%C3%A9+Chilli+White+%E6%9B%BC%E8%B0%B7",
    "photos": [
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=80"
    ],
    "category": "other"
  },
  {
    "id": 71,
    "name": "The Never Ending Summer",
    "short": "河畔风格泰式餐厅与甜点",
    "address": "41/5 Charoenkrung Rd, Charoenkrung",
    "lat": 13.72733,
    "lng": 100.500226,
    "source": "other",
    "year": 2025,
    "website": "https://www.google.com/search?q=The+Never+Ending+Summer+%E6%9B%BC%E8%B0%B7",
    "photos": [
      "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1506354666786-959d6d497f1a?auto=format&fit=crop&w=800&q=80"
    ],
    "category": "other"
  },
  {
    "id": 72,
    "name": "Namsaah Bottling Trust",
    "short": "复古粉红泰式料理与酒吧",
    "address": "78/4-5 Convent Rd, Silom",
    "lat": 13.729972,
    "lng": 100.536227,
    "source": "other",
    "year": 2025,
    "website": "https://www.google.com/search?q=Namsaah+Bottling+Trust+%E6%9B%BC%E8%B0%B7",
    "photos": [
      "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=800&q=80"
    ],
    "category": "other"
  },
  {
    "id": 73,
    "name": "Eat Me",
    "short": "国际风味与现代美学餐厅",
    "address": "20 Sathorn Soi 11, Sathorn",
    "lat": 13.72731,
    "lng": 100.535777,
    "source": "other",
    "year": 2025,
    "website": "https://www.google.com/search?q=Eat+Me+%E6%9B%BC%E8%B0%B7",
    "photos": [
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=80"
    ],
    "category": "other"
  },
  {
    "id": 74,
    "name": "Blue Elephant",
    "short": "经典泰式名厨餐厅",
    "address": "233 S Sathorn Rd, Sathorn",
    "lat": 13.724326,
    "lng": 100.540928,
    "source": "other",
    "year": 2025,
    "website": "https://www.google.com/search?q=Blue+Elephant+%E6%9B%BC%E8%B0%B7",
    "photos": [
      "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1506354666786-959d6d497f1a?auto=format&fit=crop&w=800&q=80"
    ],
    "category": "other"
  },
  {
    "id": 75,
    "name": "Baan Khanitha",
    "short": "泰式家常与古典餐饮",
    "address": "36/1 Sukhumvit 23, Khlong Toei",
    "lat": 13.735528,
    "lng": 100.544042,
    "source": "other",
    "year": 2025,
    "website": "https://www.google.com/search?q=Baan+Khanitha+%E6%9B%BC%E8%B0%B7",
    "photos": [
      "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=800&q=80"
    ],
    "category": "other"
  },
  {
    "id": 76,
    "name": "Thip Samai",
    "short": "米其林必比登老牌泰式炒河粉",
    "address": "313 Maha Chai Rd, Samran Rat",
    "lat": 13.749273,
    "lng": 100.537695,
    "source": "2025-michelin,2026-michelin,2025-blackpearl",
    "year": 2026,
    "website": "https://www.google.com/search?q=Thip+Samai+%E6%9B%BC%E8%B0%B7",
    "photos": [
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=80"
    ],
    "category": "restaurant"
  },
  {
    "id": 77,
    "name": "Somtum Der",
    "short": "黑珍珠青木瓜沙拉名店",
    "address": "5 Ekamai 10, Phra Khanong",
    "lat": 13.730847,
    "lng": 100.585368,
    "source": "2024-blackpearl",
    "year": 2026,
    "website": "https://www.google.com/search?q=Somtum+Der+%E6%9B%BC%E8%B0%B7",
    "photos": [
      "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1506354666786-959d6d497f1a?auto=format&fit=crop&w=800&q=80"
    ],
    "category": "restaurant"
  },
  {
    "id": 78,
    "name": "Krua Apsorn",
    "short": "家庭式泰国家常菜",
    "address": "169 Dinso Rd, Phra Nakhon",
    "lat": 13.756049,
    "lng": 100.492628,
    "source": "2024-blackpearl",
    "year": 2026,
    "website": "https://www.google.com/search?q=Krua+Apsorn+%E6%9B%BC%E8%B0%B7",
    "photos": [
      "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=800&q=80"
    ],
    "category": "restaurant"
  },
  {
    "id": 79,
    "name": "Baan Ice Rice",
    "short": "街头经典冰糯米饭小店",
    "address": "1/1 Thanon Phra Arthit, Phra Nakhon",
    "lat": 13.763527,
    "lng": 100.488163,
    "source": "other",
    "year": 2026,
    "website": "https://www.google.com/search?q=Baan+Ice+Rice+%E6%9B%BC%E8%B0%B7",
    "photos": [
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=80"
    ],
    "category": "other"
  },
  {
    "id": 80,
    "name": "Nai Mong Hoy Tod",
    "short": "百年海鲜煎蚝煎饼",
    "address": "79/7-8 Maha Chai Rd, Samran Rat",
    "lat": 13.755468,
    "lng": 100.547195,
    "source": "2025-blackpearl",
    "year": 2026,
    "website": "https://www.google.com/search?q=Nai+Mong+Hoy+Tod+%E6%9B%BC%E8%B0%B7",
    "photos": [
      "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1506354666786-959d6d497f1a?auto=format&fit=crop&w=800&q=80"
    ],
    "category": "restaurant"
  },
  {
    "id": 81,
    "name": "Pee Aor Tom Yum Kung Noodle",
    "short": "浓郁冬阴功大虾汤面",
    "address": "68/8 Sukhumvit 55, Thonglor",
    "lat": 13.740548,
    "lng": 100.576899,
    "source": "other",
    "year": 2026,
    "website": "https://www.google.com/search?q=Pee+Aor+Tom+Yum+Kung+Noodle+%E6%9B%BC%E8%B0%B7",
    "photos": [
      "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=800&q=80"
    ],
    "category": "streetfood"
  },
  {
    "id": 82,
    "name": "Chote Chitr",
    "short": "历史悠久泰式热菜馆",
    "address": "146 Phraeng Phuton Rd, Phra Nakhon",
    "lat": 13.761363,
    "lng": 100.499165,
    "source": "other",
    "year": 2026,
    "website": "https://www.google.com/search?q=Chote+Chitr+%E6%9B%BC%E8%B0%B7",
    "photos": [
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=80"
    ],
    "category": "other"
  },
  {
    "id": 83,
    "name": "Somboon Seafood",
    "short": "知名海鲜咖喱蟹连锁",
    "address": "895/9-10 Rama IV Rd, Silom",
    "lat": 13.729639,
    "lng": 100.548168,
    "source": "2026-blackpearl",
    "year": 2026,
    "website": "https://www.google.com/search?q=Somboon+Seafood+%E6%9B%BC%E8%B0%B7",
    "photos": [
      "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1506354666786-959d6d497f1a?auto=format&fit=crop&w=800&q=80"
    ],
    "category": "restaurant"
  },
  {
    "id": 84,
    "name": "Suda Restaurant",
    "short": "口碑泰国当地美食餐厅",
    "address": "7/1 Rama IV Rd, Silom",
    "lat": 13.728946,
    "lng": 100.538818,
    "source": "other",
    "year": 2026,
    "website": "https://www.google.com/search?q=Suda+Restaurant+%E6%9B%BC%E8%B0%B7",
    "photos": [
      "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=800&q=80"
    ],
    "category": "other"
  },
  {
    "id": 85,
    "name": "Baan Phad Thai",
    "short": "泰式炒河粉经典老店",
    "address": "68 Soi Phra Athit 44, Phra Nakhon",
    "lat": 13.757484,
    "lng": 100.500942,
    "source": "other",
    "year": 2026,
    "website": "https://www.google.com/search?q=Baan+Phad+Thai+%E6%9B%BC%E8%B0%B7",
    "photos": [
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=80"
    ],
    "category": "other"
  },
  {
    "id": 86,
    "name": "Ka Nom Jeen Pa Lek",
    "short": "老牌泰式米粉与咖喱",
    "address": "5/1 Soi Phra Sumen 1, Phra Nakhon",
    "lat": 13.752341,
    "lng": 100.494113,
    "source": "other",
    "year": 2026,
    "website": "https://www.google.com/search?q=Ka+Nom+Jeen+Pa+Lek+%E6%9B%BC%E8%B0%B7",
    "photos": [
      "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1506354666786-959d6d497f1a?auto=format&fit=crop&w=800&q=80"
    ],
    "category": "other"
  },
  {
    "id": 87,
    "name": "Khao Gaeng Rang Nam",
    "short": "知名泰式快餐米饭档",
    "address": "409 Rang Nam Rd, Phaya Thai",
    "lat": 13.765373,
    "lng": 100.553031,
    "source": "other",
    "year": 2026,
    "website": "https://www.google.com/search?q=Khao+Gaeng+Rang+Nam+%E6%9B%BC%E8%B0%B7",
    "photos": [
      "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=800&q=80"
    ],
    "category": "other"
  },
  {
    "id": 88,
    "name": "Soei",
    "short": "米其林推荐泰式精致小馆",
    "address": "101/1 Soi Sukhumvit 55, Thonglor",
    "lat": 13.73492,
    "lng": 100.587529,
    "source": "2025-michelin,2026-michelin",
    "year": 2026,
    "website": "https://www.google.com/search?q=Soei+%E6%9B%BC%E8%B0%B7",
    "photos": [
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=80"
    ],
    "category": "restaurant"
  },
  {
    "id": 89,
    "name": "Go Ang Pratunam",
    "short": "米其林必比登船面",
    "address": "100/1 Soi Petchaburi 19, Pratunam",
    "lat": 13.753693,
    "lng": 100.540066,
    "source": "2023-michelin,2024-michelin",
    "year": 2026,
    "website": "https://www.google.com/search?q=Go+Ang+Pratunam+%E6%9B%BC%E8%B0%B7",
    "photos": [
      "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1506354666786-959d6d497f1a?auto=format&fit=crop&w=800&q=80"
    ],
    "category": "restaurant"
  },
  {
    "id": 90,
    "name": "Soi Polo Fried Chicken",
    "short": "炸鸡与辣酱热门快餐",
    "address": "253 Sukhumvit 21, Asoke",
    "lat": 13.737285,
    "lng": 100.556452,
    "source": "other",
    "year": 2026,
    "website": "https://www.google.com/search?q=Soi+Polo+Fried+Chicken+%E6%9B%BC%E8%B0%B7",
    "photos": [
      "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=800&q=80"
    ],
    "category": "other"
  },
  {
    "id": 91,
    "name": "Ann Guay Tiew Kua Gai",
    "short": "泰式鸡肉炒面风味",
    "address": "31 Soi Ari 1, Ari",
    "lat": 13.787487,
    "lng": 100.552492,
    "source": "other",
    "year": 2026,
    "website": "https://www.google.com/search?q=Ann+Guay+Tiew+Kua+Gai+%E6%9B%BC%E8%B0%B7",
    "photos": [
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=80"
    ],
    "category": "other"
  },
  {
    "id": 92,
    "name": "Pa Tong Ko",
    "short": "经典油条与甜品摊",
    "address": "Soi Mahadlekluang 2, Pathum Wan",
    "lat": 13.754069,
    "lng": 100.529291,
    "source": "other",
    "year": 2026,
    "website": "https://www.google.com/search?q=Pa+Tong+Ko+%E6%9B%BC%E8%B0%B7",
    "photos": [
      "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1506354666786-959d6d497f1a?auto=format&fit=crop&w=800&q=80"
    ],
    "category": "other"
  },
  {
    "id": 93,
    "name": "Wattanapanich Seafood",
    "short": "本地人推荐海鲜餐厅",
    "address": "152 Rama IV Rd, Silom",
    "lat": 13.728905,
    "lng": 100.538472,
    "source": "other",
    "year": 2026,
    "website": "https://www.google.com/search?q=Wattanapanich+Seafood+%E6%9B%BC%E8%B0%B7",
    "photos": [
      "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=800&q=80"
    ],
    "category": "other"
  },
  {
    "id": 94,
    "name": "Khao Gaeng Manee",
    "short": "家庭式泰式快餐米饭",
    "address": "23 Sukhumvit 53, Phra Khanong",
    "lat": 13.728826,
    "lng": 100.590655,
    "source": "other",
    "year": 2026,
    "website": "https://www.google.com/search?q=Khao+Gaeng+Manee+%E6%9B%BC%E8%B0%B7",
    "photos": [
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=80"
    ],
    "category": "other"
  },
  {
    "id": 95,
    "name": "The Local by Oamthong Thai Cuisine",
    "short": "传统泰式料理与乡土风味",
    "address": "718 Saladaeng Rd, Silom",
    "lat": 13.725429,
    "lng": 100.548404,
    "source": "other",
    "year": 2026,
    "website": "https://www.google.com/search?q=The+Local+by+Oamthong+Thai+Cuisine+%E6%9B%BC%E8%B0%B7",
    "photos": [
      "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1506354666786-959d6d497f1a?auto=format&fit=crop&w=800&q=80"
    ],
    "category": "other"
  },
  {
    "id": 96,
    "name": "Supanniga Eating Room",
    "short": "米其林推荐泰式家常菜",
    "address": "160/11 Sukhumvit 55, Thonglor",
    "lat": 13.743409,
    "lng": 100.591284,
    "source": "2025-michelin,2026-michelin",
    "year": 2026,
    "website": "https://www.google.com/search?q=Supanniga+Eating+Room+%E6%9B%BC%E8%B0%B7",
    "photos": [
      "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=800&q=80"
    ],
    "category": "restaurant"
  },
  {
    "id": 97,
    "name": "Khao",
    "short": "泰式面点与创新小吃",
    "address": "18 Sukhumvit 53, Phra Khanong",
    "lat": 13.732926,
    "lng": 100.588944,
    "source": "other",
    "year": 2026,
    "website": "https://www.google.com/search?q=Khao+%E6%9B%BC%E8%B0%B7",
    "photos": [
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=80"
    ],
    "category": "other"
  },
  {
    "id": 98,
    "name": "Baan Matum",
    "short": "泰式长桌风味街头小馆",
    "address": "28 Sukhumvit 53, Phra Khanong",
    "lat": 13.736157,
    "lng": 100.585379,
    "source": "other",
    "year": 2026,
    "website": "https://www.google.com/search?q=Baan+Matum+%E6%9B%BC%E8%B0%B7",
    "photos": [
      "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1506354666786-959d6d497f1a?auto=format&fit=crop&w=800&q=80"
    ],
    "category": "other"
  },
  {
    "id": 99,
    "name": "Spice Market",
    "short": "河畔泰式自助与海鲜料理",
    "address": "190/1 Charoenkrung Rd, Charoenkrung",
    "lat": 13.726313,
    "lng": 100.506588,
    "source": "other",
    "year": 2026,
    "website": "https://www.google.com/search?q=Spice+Market+%E6%9B%BC%E8%B0%B7",
    "photos": [
      "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=800&q=80"
    ],
    "category": "other"
  },
  {
    "id": 100,
    "name": "Ayutthaya Boat Noodles",
    "short": "经典泰式船面老店",
    "address": "5/1 Phra Arthit Rd, Phra Nakhon",
    "lat": 13.760257,
    "lng": 100.490018,
    "source": "other",
    "year": 2026,
    "website": "https://www.google.com/search?q=Ayutthaya+Boat+Noodles+%E6%9B%BC%E8%B0%B7",
    "photos": [
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=80"
    ],
    "category": "streetfood"
  },
  {
    "id": 101,
    "name": "The Commons Thonglor",
    "short": "文青社区美食聚落，曼谷最潮的露天美食广场",
    "address": "335 Thonglor 17, Sukhumvit 55",
    "lat": 13.7305,
    "lng": 100.5795,
    "category": "other",
    "source": "other",
    "website": "https://www.thecommonsbkk.com/",
    "photos": [
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80"
    ],
    "avgPrice": "THB 300-600",
    "hours": "08:00-21:00"
  },
  {
    "id": 102,
    "name": "Factory Coffee",
    "short": "曼谷冠军咖啡馆，创意咖啡与精致空间",
    "address": "49 Phaya Thai Rd, Thung Phaya Thai",
    "lat": 13.7567,
    "lng": 100.5324,
    "category": "cafe",
    "source": "other",
    "website": "https://www.factorycoffeebangkok.com/",
    "photos": [
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80"
    ],
    "avgPrice": "THB 150-250",
    "hours": "08:00-17:00"
  },
  {
    "id": 103,
    "name": "Roots Coffee",
    "short": "曼谷精品咖啡 pioneer，自家烘焙",
    "address": "The Commons, Thonglor 17",
    "lat": 13.7303,
    "lng": 100.5797,
    "category": "cafe",
    "source": "other",
    "website": "https://www.rootsbkk.com/",
    "photos": [
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80"
    ],
    "avgPrice": "THB 120-200",
    "hours": "08:00-18:00"
  },
  {
    "id": 104,
    "name": "Rocket Coffeebar",
    "short": "北欧风咖啡馆，Brunch 与精品咖啡",
    "address": "149 Sathorn Soi 12, Silom",
    "lat": 13.7234,
    "lng": 100.5256,
    "category": "cafe",
    "source": "other",
    "website": "https://www.rocketcoffeebar.com/",
    "photos": [
      "https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=800&q=80"
    ],
    "avgPrice": "THB 250-450",
    "hours": "07:00-18:00"
  },
  {
    "id": 105,
    "name": "% Arabica Bangkok",
    "short": "日本京都网红咖啡，极简美学空间",
    "address": "The EmQuartier, Sukhumvit Rd",
    "lat": 13.7312,
    "lng": 100.5698,
    "category": "cafe",
    "source": "other",
    "website": "https://arabica.coffee/",
    "photos": [
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80"
    ],
    "avgPrice": "THB 120-180",
    "hours": "08:00-21:00"
  },
  {
    "id": 106,
    "name": "Toby's Cafe",
    "short": "澳洲风 Brunch 咖啡馆，颜值与口味兼具",
    "address": "75 Sukhumvit 38, Phra Khanong",
    "lat": 13.7198,
    "lng": 100.5742,
    "category": "cafe",
    "source": "other",
    "website": "https://www.google.com/search?q=Toby%27s+Cafe+Bangkok",
    "photos": [
      "https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=800&q=80"
    ],
    "avgPrice": "THB 300-500",
    "hours": "09:00-17:30"
  },
  {
    "id": 107,
    "name": "Jodd Fairs 乔德夜市",
    "short": "曼谷最火夜市，火山排骨与水果西施",
    "address": "Rama IX Rd, Huai Khwang",
    "lat": 13.7589,
    "lng": 100.5956,
    "category": "streetfood",
    "source": "other",
    "website": "https://www.google.com/search?q=Jodd+Fairs+Bangkok",
    "photos": [
      "https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&w=800&q=80"
    ],
    "avgPrice": "THB 100-300",
    "hours": "16:00-00:00"
  },
  {
    "id": 108,
    "name": "Train Night Market Srinakarin",
    "short": "席娜卡琳火车夜市，复古风情与地道小吃",
    "address": "Srinakarin Rd, Nong Bon",
    "lat": 13.6934,
    "lng": 100.6487,
    "category": "streetfood",
    "source": "other",
    "website": "https://www.google.com/search?q=Train+Night+Market+Srinakarin",
    "photos": [
      "https://images.unsplash.com/photo-1555126634-323283e090fa?auto=format&fit=crop&w=800&q=80"
    ],
    "avgPrice": "THB 80-250",
    "hours": "17:00-01:00"
  },
  {
    "id": 109,
    "name": "Yaowarat 唐人街",
    "short": "曼谷唐人街美食街，燕窝鱼翅与路边小吃",
    "address": "Yaowarat Rd, Samphanthawong",
    "lat": 13.7395,
    "lng": 100.5123,
    "category": "streetfood",
    "source": "other",
    "website": "https://www.google.com/search?q=Yaowarat+Chinatown+Bangkok+food",
    "photos": [
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80"
    ],
    "avgPrice": "THB 100-500",
    "hours": "18:00-02:00"
  },
  {
    "id": 110,
    "name": "Thipsamai Pad Thai",
    "short": "传奇泰式炒河粉店，米其林必比登推荐",
    "address": "313 Mahachai Rd, Samran Rat",
    "lat": 13.7521,
    "lng": 100.5056,
    "category": "streetfood",
    "source": "other",
    "website": "https://www.google.com/search?q=Thipsamai+Pad+Thai+Bangkok",
    "photos": [
      "https://images.unsplash.com/photo-1559314809-0d155014e29e?auto=format&fit=crop&w=800&q=80"
    ],
    "avgPrice": "THB 80-200",
    "hours": "17:00-02:00"
  },
  {
    "id": 111,
    "name": "Raan Jay Fai 备用",
    "short": "Jay Fai 的分店/相关档口",
    "address": "327 Maha Chai Rd, Phra Nakhon",
    "lat": 13.7523,
    "lng": 100.5058,
    "category": "streetfood",
    "source": "other",
    "website": "https://www.google.com/search?q=Jay+Fai+Bangkok",
    "photos": [
      "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80"
    ],
    "avgPrice": "THB 500-1500",
    "hours": "09:00-21:00"
  },
  {
    "id": 112,
    "name": "Sorn 备用",
    "short": "南部泰式料理的另一种体验",
    "address": "56 Sukhumvit 26, Khlong Tan",
    "lat": 13.7345,
    "lng": 100.5685,
    "category": "restaurant",
    "source": "other",
    "website": "https://sornfinesouthern.com/",
    "photos": [
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80"
    ],
    "avgPrice": "THB 3000-5000",
    "hours": "18:00-23:00"
  },
  {
    "id": 113,
    "name": "Social Club Rooftop Bar",
    "short": "顶层酒吧，曼谷天际线与创意调酒",
    "address": "No.1 Sukhumvit Soi 15, Klong Toey Nua",
    "lat": 13.7456,
    "lng": 100.5634,
    "category": "bar",
    "source": "other",
    "website": "https://www.hyatt.com/en-US/hotel/thailand/park-hyatt-bangkok/bkkph/dining",
    "photos": [
      "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80"
    ],
    "avgPrice": "THB 400-800",
    "hours": "17:00-01:00"
  },
  {
    "id": 114,
    "name": "Mahanakhon SkyBar",
    "short": "泰国最高楼顶酒吧，360度城市景观",
    "address": "King Power Mahanakhon, Silom",
    "lat": 13.7238,
    "lng": 100.5284,
    "category": "bar",
    "source": "other",
    "website": "https://kingpowermahanakhon.co.th/skybar/",
    "photos": [
      "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=800&q=80"
    ],
    "avgPrice": "THB 500-1000",
    "hours": "17:00-01:00"
  },
  {
    "id": 115,
    "name": "Tropic City 备用",
    "short": "热带风情鸡尾酒吧，亚洲前50",
    "address": "672/65 Soi Charoen Krung 28, Bang Rak",
    "lat": 13.7245,
    "lng": 100.5295,
    "category": "bar",
    "source": "other",
    "website": "https://www.google.com/search?q=Tropic+City+Bangkok",
    "photos": [
      "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?auto=format&fit=crop&w=800&q=80"
    ],
    "avgPrice": "THB 300-600",
    "hours": "18:00-01:00"
  },
  {
    "id": 116,
    "name": "Cactus Restaurant",
    "short": "隐藏式地下酒吧， speakeasy 风格",
    "address": "Yothi Rd, Si Yaek Maha Nak",
    "lat": 13.7634,
    "lng": 100.5378,
    "category": "bar",
    "source": "other",
    "website": "https://www.google.com/search?q=Cactus+Bangkok+speakeasy",
    "photos": [
      "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80"
    ],
    "avgPrice": "THB 350-700",
    "hours": "19:00-02:00"
  },
  {
    "id": 117,
    "name": "Err Urban Rustic Thai",
    "short": "Bo.lan 团队打造，传统泰式下酒菜",
    "address": "394/35 Maharaj Rd, Phra Borom Maha Ratchawang",
    "lat": 13.7445,
    "lng": 100.4932,
    "category": "restaurant",
    "source": "other",
    "website": "https://errbkk.com/",
    "photos": [
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80"
    ],
    "avgPrice": "THB 400-800",
    "hours": "12:00-22:00"
  },
  {
    "id": 118,
    "name": "Soul Food Mahanakorn",
    "short": "东南亚街头美食与精酿啤酒",
    "address": "56/10 Sukhumvit Soi 55, Thonglor",
    "lat": 13.7312,
    "lng": 100.5834,
    "category": "restaurant",
    "source": "other",
    "website": "https://www.soulfoodmahanakorn.com/",
    "photos": [
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=80"
    ],
    "avgPrice": "THB 300-600",
    "hours": "11:30-23:00"
  },
  {
    "id": 119,
    "name": "Sra Bua by Kiin Kiin",
    "short": "分子料理泰餐，米其林一星",
    "address": "991/9 Rama I Rd, Pathum Wan",
    "lat": 13.7467,
    "lng": 100.5345,
    "category": "restaurant",
    "source": "other",
    "website": "https://www.kempinski.com/en/bangkok/siam-hotel/dining/sra-bua-by-kiin-kiin/",
    "photos": [
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80"
    ],
    "avgPrice": "THB 2500-4000",
    "hours": "12:00-14:30 / 18:00-22:30"
  },
  {
    "id": 120,
    "name": "Gaa Restaurant",
    "short": "Gaggan 副线，印度与北欧融合料理",
    "address": "68/1 Soi Langsuan, Lumpini",
    "lat": 13.7312,
    "lng": 100.5389,
    "category": "restaurant",
    "source": "other",
    "website": "https://www.gaabangkok.com/",
    "photos": [
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80"
    ],
    "avgPrice": "THB 3000-5000",
    "hours": "18:00-23:00"
  }
];

const STORAGE_KEY = 'bangkok-map-markers'
const FAVORITES_KEY = 'bangkok-map-favorites'

const categoryConfig = {
  all: { label: '全部', color: '#0d6554' },
  restaurant: { label: '餐厅', color: '#b08b4f' },
  cafe: { label: '咖啡馆', color: '#1565c0' },
  bar: { label: '酒吧', color: '#7b1fa2' },
  streetfood: { label: '街头美食', color: '#e65100' },
  other: { label: '本地推荐', color: '#836a55' },
}

function getDistanceKm(lat1, lng1, lat2, lng2) {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export default function App() {
  const [markers, setMarkers] = useState(() => {
    if (typeof window === 'undefined') return defaultMarkers
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : defaultMarkers
    } catch {
      return defaultMarkers
    }
  })

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(markers))
  }, [markers])

  const [favorites, setFavorites] = useState(() => {
    if (typeof window === 'undefined') return []
    try {
      const saved = window.localStorage.getItem(FAVORITES_KEY)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
  }, [favorites])

  const [userLocation, setUserLocation] = useState(null)
  useEffect(() => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      pos => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => {},
      { enableHighAccuracy: false, timeout: 10000 }
    )
  }, [])

  const mapApiRef = useRef(null)
  const [editingId, setEditingId] = useState(null)
  const [draftAddress, setDraftAddress] = useState('')
  const [activeCardId, setActiveCardId] = useState(null)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const [sortMode, setSortMode] = useState('default')
  const [selectedPlace, setSelectedPlace] = useState(null)
  const [newPlace, setNewPlace] = useState({
    name: '',
    short: '',
    address: '',
    lat: '',
    lng: '',
    category: 'other'
  })

  function toggleFavorite(id, e) {
    if (e) e.stopPropagation()
    setFavorites(prev => {
      const set = new Set(prev)
      if (set.has(id)) set.delete(id)
      else set.add(id)
      return Array.from(set)
    })
  }

  function startEdit(p) {
    setEditingId(p.id)
    setDraftAddress(p.address || '')
  }

  function cancelEdit() { setEditingId(null); setDraftAddress('') }

  function saveEdit(id, name) {
    const place = markers.find(m => m.id === id)
    const source = place?.source
    setMarkers(ms => ms.map(m => m.id === id ? { ...m, address: draftAddress } : m))
    setEditingId(null)
    const api = mapApiRef.current
    if (api && api.markersMap && api.markersMap.has(String(id))) {
      const marker = api.markersMap.get(String(id))
      if (marker) {
        marker.bindPopup(getPopupHtml(name, draftAddress, source))
        marker.openPopup()
      }
    }
    setDraftAddress('')
  }

  function handleEditKeyDown(evt, id, name) {
    if (evt.key === 'Enter') {
      evt.preventDefault()
      saveEdit(id, name)
    }
    if (evt.key === 'Escape') {
      evt.preventDefault()
      cancelEdit()
    }
  }

  function handleNewKeyDown(evt) {
    if (evt.key === 'Enter') {
      evt.preventDefault()
      addNewPlace()
    }
  }

  function addNewPlace() {
    if (!newPlace.name.trim() || !newPlace.lat.trim() || !newPlace.lng.trim()) return
    const nextId = markers.reduce((max, p) => Math.max(max, p.id), 0) + 1
    const next = {
      id: nextId,
      name: newPlace.name.trim(),
      short: newPlace.short.trim(),
      address: newPlace.address.trim(),
      lat: Number(newPlace.lat),
      lng: Number(newPlace.lng),
      category: newPlace.category || 'other',
      source: 'other'
    }
    setMarkers(ms => [...ms, next])
    setNewPlace({ name: '', short: '', address: '', lat: '', lng: '', category: 'other' })
    const api = mapApiRef.current
    if (api && api.map) {
      api.map.setView([next.lat, next.lng], 15, { animate: true })
    }
    setActiveCardId(nextId)
  }

  function handleCardClick(place) {
    const api = mapApiRef.current
    if (!api || !api.map) return
    const { map } = api
    if (place.lat && place.lng) {
      map.setView([place.lat, place.lng], 15, { animate: true })
    }
    setActiveCardId(place.id)
  }

  function openDetails(place) {
    setSelectedPlace(place)
    handleCardClick(place)
  }

  const normalizedSearch = search.trim().toLowerCase()
  const filteredMarkers = useMemo(() => {
    let result = [...markers]
    if (normalizedSearch) {
      result = result.filter(place => {
        const target = [place.name, place.short, place.address].join(' ').toLowerCase()
        return target.includes(normalizedSearch)
      })
    }
    if (selectedCategory !== 'all') {
      result = result.filter(p => p.category === selectedCategory)
    }
    if (showFavoritesOnly) {
      result = result.filter(p => favorites.includes(p.id))
    }
    if (sortMode === 'distance' && userLocation) {
      result = result.map(p => ({
        ...p,
        _distance: getDistanceKm(userLocation.lat, userLocation.lng, p.lat, p.lng)
      })).sort((a, b) => a._distance - b._distance)
    } else if (sortMode === 'name') {
      result = result.sort((a, b) => a.name.localeCompare(b.name))
    }
    return result
  }, [markers, normalizedSearch, selectedCategory, showFavoritesOnly, favorites, sortMode, userLocation])

  const sourceLabelMap = {
    michelin: '米其林推荐',
    asia50: '亚洲前50榜',
    blackpearl: '黑珍珠榜',
    other: '本地推荐'
  }

  const sourceBadgeClasses = {
    michelin: 'bg-[#b08b4f] text-white',
    asia50: 'bg-[#1565c0] text-white',
    blackpearl: 'bg-[#7b1fa2] text-white',
    other: 'bg-[#f0e0cc] text-[#4a3825]'
  }

  function parseSourceItems(source) {
    const items = Array.isArray(source) ? source : (typeof source === 'string' ? source.split(',') : [])
    return items.map(item => item.trim()).filter(Boolean).map(item => {
      const parts = item.split('-')
      if (parts.length > 1 && /^\d{4}$/.test(parts[0])) {
        return { raw: item, year: parts[0], base: parts.slice(1).join('-') }
      }
      return { raw: item, year: null, base: item }
    })
  }

  function formatSourceLabel(item) {
    const baseLabel = sourceLabelMap[item.base] || item.base
    if (item.year && item.base !== 'other') {
      return `${item.year}${baseLabel}`
    }
    return baseLabel
  }

  function getSourceBadges(source) {
    return parseSourceItems(source).map(item => (
      <span key={item.raw} className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${sourceBadgeClasses[item.base] || sourceBadgeClasses.other}`}>
        {formatSourceLabel(item)}
      </span>
    ))
  }

  function getPopupHtml(name, address, source) {
    const badgeHtml = parseSourceItems(source).map(item => {
      const color = item.base === 'michelin' ? '#b08b4f' : item.base === 'asia50' ? '#1565c0' : item.base === 'blackpearl' ? '#7b1fa2' : '#d8b192'
      const textColor = item.base === 'other' ? '#4a3825' : '#ffffff'
      return `<span style="display:inline-block;margin-right:6px;margin-top:6px;padding:4px 10px;border-radius:999px;background:${color};color:${textColor};font-size:0.8rem;font-weight:600;">${formatSourceLabel(item)}</span>`
    }).join('')
    return `<strong>${name}</strong><br/>${address || ''}${badgeHtml ? `<div style="margin-top:8px">${badgeHtml}</div>` : ''}`
  }

  const favCount = favorites.length

  return (
    <div className="min-h-screen bg-paper text-thai-dark font-ui">
      <div className="max-w-7xl mx-auto h-screen grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6 px-4 py-6 lg:px-0">
        <aside className="rounded-[32px] border border-[#d9c9a4] bg-white/95 p-6 shadow-[0_20px_60px_rgba(32,30,24,0.12)] backdrop-blur-sm flex flex-col">
          <div className="mb-5 border-b border-[#e2d5ba] pb-4">
            <p className="text-sm uppercase tracking-[0.35em] text-[#8a6f51]">曼谷风味</p>
            <h1 className="mt-3 text-3xl font-display font-semibold tracking-[0.02em] text-[#1f352f]">曼谷美食咖啡地图</h1>
            <p className="mt-3 text-sm leading-6 text-[#716054]">从复古咖啡馆到小巷夜市，搜索并点击卡片即可在地图中定位。</p>
          </div>

          {/* Search */}
          <div className="mb-4 rounded-3xl border border-[#f0e4cf] bg-[#fff9f2] p-4 text-sm text-[#5f4f3d] shadow-[inset_0_0_0_1px_rgba(234,221,190,0.8)]">
            <div className="flex items-center justify-between gap-3">
              <span className="font-semibold text-[#5d4a33]">搜索地点</span>
              <span className="text-xs uppercase tracking-[0.18em]">快捷</span>
            </div>
            <input
              className="mt-3 w-full rounded-2xl border border-[#d8b57b] bg-white px-4 py-3 text-sm text-[#3a372f] outline-none transition focus:border-thai-teal"
              placeholder="输入咖啡馆、夜市或街区"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {/* Category Filter */}
          <div className="mb-4">
            <div className="flex items-center justify-between gap-3 mb-2">
              <span className="text-sm font-semibold text-[#5d4a33]">分类筛选</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(categoryConfig).map(([key, cfg]) => (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                    selectedCategory === key
                      ? 'text-white shadow-sm'
                      : 'bg-[#f5efe6] text-[#6b5a45] hover:bg-[#ebe0d0]'
                  }`}
                  style={selectedCategory === key ? { backgroundColor: cfg.color } : {}}
                >
                  {cfg.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sort & Favorites */}
          <div className="mb-4 flex items-center gap-2 flex-wrap">
            <select
              value={sortMode}
              onChange={e => setSortMode(e.target.value)}
              className="rounded-2xl border border-[#d8b57b] bg-white px-3 py-2 text-sm text-[#3a372f] outline-none"
            >
              <option value="default">默认排序</option>
              <option value="distance">距离最近</option>
              <option value="name">名称排序</option>
            </select>
            <button
              onClick={() => setShowFavoritesOnly(v => !v)}
              className={`rounded-2xl px-4 py-2 text-sm font-medium transition flex items-center gap-1.5 ${
                showFavoritesOnly
                  ? 'bg-thai-gold text-white'
                  : 'bg-[#f5efe6] text-[#6b5a45] hover:bg-[#ebe0d0]'
              }`}
            >
              <span>{showFavoritesOnly ? '★' : '☆'}</span>
              收藏{favCount > 0 ? ` (${favCount})` : ''}
            </button>
          </div>

          {/* Place List */}
          <div className="space-y-3 flex-1 overflow-y-auto pr-1 scrollbar-thin min-h-0">
            {filteredMarkers.length ? filteredMarkers.map((p) => {
              const isFav = favorites.includes(p.id)
              const distance = userLocation && p._distance
                ? `${p._distance < 1 ? (p._distance * 1000).toFixed(0) + 'm' : p._distance.toFixed(1) + 'km'}`
                : null
              return (
                <div
                  key={p.id}
                  className={`group rounded-3xl border px-4 py-4 transition ${activeCardId === p.id ? 'border-thai-teal/70 bg-[#eef7f2]' : 'border-[#ece0d1] bg-white'} shadow-sm hover:shadow-md`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <button type="button" onClick={() => handleCardClick(p)} className="text-left flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-[#25322f] truncate">{p.name}</h3>
                        {distance && <span className="text-xs text-[#8a6f51] whitespace-nowrap">{distance}</span>}
                      </div>
                      <p className="mt-1 text-sm leading-6 text-[#726855]">{p.short}</p>
                    </button>
                    <div className="flex flex-col items-end gap-1">
                      <button
                        type="button"
                        onClick={(e) => toggleFavorite(p.id, e)}
                        className={`text-lg leading-none transition ${isFav ? 'text-thai-gold' : 'text-[#d5c8b0] hover:text-thai-gold'}`}
                        title={isFav ? '取消收藏' : '收藏'}
                      >
                        {isFav ? '★' : '☆'}
                      </button>
                      <button
                        type="button"
                        onClick={() => startEdit(p)}
                        className="text-sm font-medium text-thai-teal transition hover:text-thai-gold"
                      >编辑</button>
                    </div>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {getSourceBadges(p.source)}
                    {p.category && p.category !== 'other' && (
                      <span className="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] bg-[#e8f4f8] text-[#1565c0]">
                        {categoryConfig[p.category]?.label || p.category}
                      </span>
                    )}
                  </div>
                  <div className="mt-2 flex flex-wrap items-center justify-between gap-3 text-sm text-[#695f53]">
                    <span className="truncate">{p.address}</span>
                    <span className="rounded-full bg-[#f7ede0] px-3 py-1 text-[#8a6f51] whitespace-nowrap">#{p.id}</span>
                  </div>
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => openDetails(p)}
                      className="text-xs font-medium text-thai-teal hover:text-thai-gold transition"
                    >
                      查看详情 →
                    </button>
                  </div>
                  {editingId === p.id && (
                    <div className="mt-4 space-y-3">
                      <input
                        className="w-full rounded-2xl border border-[#d5c2a0] bg-[#fffdf8] px-3 py-2 text-sm text-[#3d352f] outline-none"
                        value={draftAddress}
                        onChange={e => setDraftAddress(e.target.value)}
                        onKeyDown={e => handleEditKeyDown(e, p.id, p.name)}
                        placeholder="输入新地址，Enter 保存，Esc 取消"
                      />
                      <div className="flex justify-end gap-2">
                        <button onClick={cancelEdit} className="rounded-full border border-[#c3b090] px-4 py-2 text-sm text-[#7d6d57]">取消</button>
                        <button onClick={() => saveEdit(p.id, p.name)} className="rounded-full bg-thai-teal px-4 py-2 text-sm font-semibold text-white">保存</button>
                      </div>
                    </div>
                  )}
                </div>
              )
            }) : (
              <div className="rounded-3xl border border-[#eedfc5] bg-[#fff8ee] p-5 text-sm text-[#705b45]">
                未找到匹配地点，请尝试其他关键词或筛选条件。
              </div>
            )}
          </div>

          {/* Add New Place */}
          <div className="mt-4 rounded-3xl border border-[#f0e4cf] bg-[#fff9f2] p-4 text-sm text-[#5f4f3d] shadow-[inset_0_0_0_1px_rgba(234,221,190,0.8)]">
            <div className="flex items-center justify-between gap-3">
              <span className="font-semibold text-[#5d4a33]">新增地点</span>
              <span className="text-xs uppercase tracking-[0.18em]">自定义</span>
            </div>
            <div className="mt-4 space-y-3">
              <input
                className="w-full rounded-2xl border border-[#d8b57b] bg-white px-4 py-3 text-sm text-[#3a372f] outline-none"
                placeholder="地点名称"
                value={newPlace.name}
                onChange={e => setNewPlace(prev => ({ ...prev, name: e.target.value }))}
                onKeyDown={handleNewKeyDown}
              />
              <input
                className="w-full rounded-2xl border border-[#d8b57b] bg-white px-4 py-3 text-sm text-[#3a372f] outline-none"
                placeholder="一句话描述（可选）"
                value={newPlace.short}
                onChange={e => setNewPlace(prev => ({ ...prev, short: e.target.value }))}
                onKeyDown={handleNewKeyDown}
              />
              <input
                className="w-full rounded-2xl border border-[#d8b57b] bg-white px-4 py-3 text-sm text-[#3a372f] outline-none"
                placeholder="地址"
                value={newPlace.address}
                onChange={e => setNewPlace(prev => ({ ...prev, address: e.target.value }))}
                onKeyDown={handleNewKeyDown}
              />
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  className="w-full rounded-2xl border border-[#d8b57b] bg-white px-4 py-3 text-sm text-[#3a372f] outline-none"
                  placeholder="纬度"
                  value={newPlace.lat}
                  onChange={e => setNewPlace(prev => ({ ...prev, lat: e.target.value }))}
                  onKeyDown={handleNewKeyDown}
                />
                <input
                  className="w-full rounded-2xl border border-[#d8b57b] bg-white px-4 py-3 text-sm text-[#3a372f] outline-none"
                  placeholder="经度"
                  value={newPlace.lng}
                  onChange={e => setNewPlace(prev => ({ ...prev, lng: e.target.value }))}
                  onKeyDown={handleNewKeyDown}
                />
              </div>
              <select
                className="w-full rounded-2xl border border-[#d8b57b] bg-white px-4 py-3 text-sm text-[#3a372f] outline-none"
                value={newPlace.category}
                onChange={e => setNewPlace(prev => ({ ...prev, category: e.target.value }))}
              >
                {Object.entries(categoryConfig).filter(([k]) => k !== 'all').map(([k, cfg]) => (
                  <option key={k} value={k}>{cfg.label}</option>
                ))}
              </select>
              <button
                onClick={addNewPlace}
                className="w-full rounded-2xl bg-thai-teal px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0b4f45]"
              >添加地点</button>
              <p className="text-xs leading-5 text-[#7a6652]">请输入名称和坐标后点击添加，地点会保存到浏览器本地存储。</p>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-4 rounded-[28px] border border-[#e7d9c2] bg-[#fcfaf6] p-5 shadow-[0_8px_30px_rgba(111,92,63,0.08)]">
            <div className="flex items-center justify-between gap-3 text-sm text-[#6f5f4a]">
              <span>当前地点数量</span>
              <span className="font-semibold text-[#2b3b33]">{filteredMarkers.length} / {markers.length}</span>
            </div>
            {userLocation && (
              <div className="mt-2 text-xs text-[#8a7a65]">
                已获取您的位置，可按距离排序
              </div>
            )}
          </div>

          <div className="mt-4 rounded-3xl border border-[#f0e1c6] bg-[#fff8f1] p-5 text-xs leading-6 text-[#7a6652]">
            Tip: 点击列表卡片可快速定位地图，☆ 收藏地点，查看详情可浏览更多信息。
          </div>
        </aside>

        <main className="relative rounded-[40px] border border-[#d7c4a4] bg-[#fbf6ef] p-3 shadow-[0_24px_80px_rgba(38,34,21,0.12)]">
          <div className="h-full rounded-[32px] overflow-hidden border border-[#f0e0c8] bg-white shadow-[inset_0_0_0_1px_rgba(223,203,160,0.24)]">
            <Map markers={filteredMarkers} onReady={api => (mapApiRef.current = api)} activeId={activeCardId} />
          </div>
          {selectedPlace && (
            <DetailsModal
              place={selectedPlace}
              onClose={() => setSelectedPlace(null)}
              isFavorite={favorites.includes(selectedPlace.id)}
              onToggleFavorite={() => toggleFavorite(selectedPlace.id)}
              userLocation={userLocation}
            />
          )}
        </main>
      </div>
    </div>
  )
}
