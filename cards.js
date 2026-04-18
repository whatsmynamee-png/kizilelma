// ═══════════════════════════════════════════════════════════
//  REALM CLASH — KART VERİTABANI
//  Bu dosyayı düzenleyerek yeni kartlar ve kombolar ekleyebilirsin.
//
//  Her kart şu alanları destekler:
//    id          → benzersiz kimlik (string)
//    name        → kart adı
//    class       → 'wizard' | 'warrior' | 'strategist' | 'guardian' | 'chaos'
//    emoji       → kart görseli (emoji)
//    atk         → saldırı gücü
//    def         → savunma gücü
//    cost        → mana maliyeti
//    effect      → kart efektinin açıklaması (metin)
//
//  Opsiyonel efekt fonksiyonları (gs = oyun durumu):
//    onSummon(gs)        → sahaya çıkınca tetiklenir
//    onKill(gs)          → bir düşman kartı yok edilince tetiklenir
//    onHit(gs, dmg)      → bu kart hasar aldığında tetiklenir
//    onDestroy(gs)       → bu kart yok edildiğinde tetiklenir
//    endOfTurn(gs, card) → her tur sonunda tetiklenir
//
//  Opsiyonel pasif özellikler:
//    attackBonus   → saldırıya ekstra hasar ekler
//    ignoreDefense → savunmayı yok sayarak saldırır
//    firstStrike   → yalnızca ilk saldırıda ATK bonusu (tek kullanım)
//    passiveMana   → her tur başında ekstra mana kazandırır
//    trapCounter   → tuzak kullanım sayısı
//    shield        → ilk yok etme girişimine karşı koruma
// ═══════════════════════════════════════════════════════════

const CARD_DB = [

  // ════════════════════════════════
  //  🧙 BÜYÜCÜ (wizard)
  // ════════════════════════════════
  {
    id: 'wiz1', name: 'Ateş Büyücüsü', class: 'wizard', emoji: '🧙',
    atk: 1600, def: 1100, cost: 3,
    effect: 'Sahaya çıkınca düşmana 200 alev hasarı verir.',
    onSummon: (gs) => { dealDirectDamage(gs, 200, 'alev'); }
  },
  {
    id: 'wiz2', name: 'Buz Büyücüsü', class: 'wizard', emoji: '❄️',
    atk: 1200, def: 1800, cost: 3,
    effect: 'Sahaya çıkınca düşmanın en güçlü kartını 1 tur dondurur.',
    onSummon: (gs) => { freezeStrongestEnemy(gs); }
  },
  {
    id: 'wiz3', name: 'Yıldırım Çağırıcısı', class: 'wizard', emoji: '⚡',
    atk: 2100, def: 900, cost: 5,
    effect: 'Saldırı 2100 ATK. Saldırıda +300 ekstra yıldırım hasarı.',
    attackBonus: 300
  },
  {
    id: 'wiz4', name: 'Void Büyücüsü', class: 'wizard', emoji: '🌀',
    atk: 1800, def: 1400, cost: 4,
    effect: 'Düşman kartı yok edilirse düşmana 400 ekstra hasar verir.',
    onKill: (gs) => { dealDirectDamage(gs, 400, 'void'); }
  },
  {
    id: 'wiz5', name: 'Zaman Büyücüsü', class: 'wizard', emoji: '⏳',
    atk: 1000, def: 1000, cost: 2,
    effect: 'Her tür başında 1 ek mana kazandırır.',
    passiveMana: 1
  },

  // ════════════════════════════════
  //  ⚔️ SAVAŞÇI (warrior)
  // ════════════════════════════════
  {
    id: 'war1', name: 'Demirli Şövalye', class: 'warrior', emoji: '⚔️',
    atk: 1900, def: 1600, cost: 4,
    effect: 'Hasar aldığında refleks olarak 200 hasar geri verir.',
    onHit: (gs, dmg) => { dealDirectDamage(gs, 200, 'refleks'); }
  },
  {
    id: 'war2', name: 'Barbar Savaşçı', class: 'warrior', emoji: '🪓',
    atk: 2400, def: 800, cost: 5,
    effect: 'Savunmayı yok sayarak direk ATK hesaplar.',
    ignoreDefense: true
  },
  {
    id: 'war3', name: 'Gizli Suikastçi', class: 'warrior', emoji: '🗡️',
    atk: 1700, def: 1200, cost: 3,
    effect: 'İlk saldırıda +600 gizli saldırı bonusu alır.',
    firstStrike: 600
  },
  {
    id: 'war4', name: 'Koruyan Şövalye', class: 'warrior', emoji: '🛡️',
    atk: 1100, def: 2400, cost: 3,
    effect: 'Sahaya çıkınca 500 can yeniler.',
    onSummon: (gs) => { healPlayer(gs, 500); }
  },
  {
    id: 'war5', name: 'Berserker', class: 'warrior', emoji: '👹',
    atk: 2700, def: 400, cost: 6,
    effect: 'Çılgın saldırı: 2700 ATK fakat savunması yok denecek kadar düşük.',
  },

  // ════════════════════════════════
  //  🎖️ STRATEJİST (strategist)
  // ════════════════════════════════
  {
    id: 'str1', name: 'Gölge Casusa', class: 'strategist', emoji: '🕵️',
    atk: 1300, def: 1300, cost: 3,
    effect: 'Sahaya çıkınca düşmanın elinden 1 kart siler.',
    onSummon: (gs) => { discardEnemyCard(gs); }
  },
  {
    id: 'str2', name: 'Tuzakçı', class: 'strategist', emoji: '🪤',
    atk: 800, def: 2000, cost: 3,
    effect: 'Düşman saldırısını geçersiz kılabilir, 2 tur boyunca.',
    trapCounter: 2
  },
  {
    id: 'str3', name: 'Komutan', class: 'strategist', emoji: '🎖️',
    atk: 1600, def: 1800, cost: 5,
    effect: 'Sahaya çıkınca tüm müttefik kartlara +300 ATK verir.',
    onSummon: (gs) => { buffAllies(gs, 300, 0); }
  },
  {
    id: 'str4', name: 'Bilge Kale', class: 'strategist', emoji: '🏰',
    atk: 600, def: 2800, cost: 4,
    effect: 'Defans modu: düşman saldırısından sonra 1 ek kart çeker.',
    onHit: (gs) => { drawCard(); }
  },
  {
    id: 'str5', name: 'Kahin', class: 'strategist', emoji: '🔮',
    atk: 1200, def: 1500, cost: 3,
    effect: 'Sahaya çıkınca düşmanın elindeki kartları gösterir.',
    onSummon: (gs) => { peekEnemyHand(gs); }
  },

  // ════════════════════════════════
  //  ✨ GARDİYAN (guardian)
  // ════════════════════════════════
  {
    id: 'grd1', name: 'Işık Gardiyanı', class: 'guardian', emoji: '✨',
    atk: 1500, def: 2000, cost: 4,
    effect: 'Sahaya çıkınca 700 can yeniler.',
    onSummon: (gs) => { healPlayer(gs, 700); }
  },
  {
    id: 'grd2', name: 'Taş Golem', class: 'guardian', emoji: '🗿',
    atk: 1000, def: 3000, cost: 5,
    effect: 'Her turda düşmana 150 ezme hasarı verir.',
    endOfTurn: (gs) => { dealDirectDamage(gs, 150, 'ezme'); }
  },
  {
    id: 'grd3', name: 'Kutsal Şövalye', class: 'guardian', emoji: '⚜️',
    atk: 1800, def: 1800, cost: 5,
    effect: 'Öldürüldüğünde 500 can yeniler.',
    onDestroy: (gs) => { healPlayer(gs, 500); }
  },
  {
    id: 'grd4', name: 'Işık Meleği', class: 'guardian', emoji: '👼',
    atk: 1200, def: 1600, cost: 3,
    effect: 'Sahaya çıkınca tüm müttefik kartlara +200 DEF verir.',
    onSummon: (gs) => { buffAllies(gs, 0, 200); }
  },
  {
    id: 'grd5', name: 'Kutsal Kalkanlı', class: 'guardian', emoji: '🔰',
    atk: 1400, def: 2200, cost: 4,
    effect: 'İlk yok etme girişimine karşı korunmalı (bir kez).',
    shield: true
  },

  // ════════════════════════════════
  //  🐉 KAOS (chaos)
  // ════════════════════════════════
  {
    id: 'cha1', name: 'Kaos Ejderi', class: 'chaos', emoji: '🐉',
    atk: 2800, def: 1200, cost: 7,
    effect: 'En güçlü kart. Saldırıda +300 ekstra hasar verir.',
    attackBonus: 300
  },
  {
    id: 'cha2', name: 'Kaos Büyücüsü', class: 'chaos', emoji: '🌑',
    atk: 2200, def: 1800, cost: 6,
    effect: 'Sahaya çıkınca düşmana 200 kaos hasarı verir.',
    onSummon: (gs) => { dealDirectDamage(gs, 200, 'kaos'); }
  },
  {
    id: 'cha3', name: 'Entropi Lordu', class: 'chaos', emoji: '💀',
    atk: 2500, def: 1000, cost: 6,
    effect: 'Saldırıda +400 entropi hasarı verir.',
    attackBonus: 400
  },
  {
    id: 'cha4', name: 'Boşluk Yaratığı', class: 'chaos', emoji: '🕳️',
    atk: 1900, def: 1900, cost: 5,
    effect: 'Yok edildiğinde tüm alanı sıfırlar; iki taraf da hasar alır.',
    onDestroy: (gs) => { dealDirectDamage(gs, 800, 'boşluk'); healPlayer(gs, -400); }
  },
  {
    id: 'cha5', name: 'Mutasyon Canavarı', class: 'chaos', emoji: '🧬',
    atk: 2000, def: 1600, cost: 5,
    effect: 'Her turda +100 ATK kazanır; durdurulamaz büyüme.',
    endOfTurn: (gs, card) => { card.atk += 100; }
  },

];

// ═══════════════════════════════════════════════════════════
//  KOMBİNASYON TANIMLARI
//
//  Her kombo şu alanları içerir:
//    name   → kombonun adı
//    desc   → açıklama (UI için)
//    check(field) → sahayı kontrol eder; true dönerse kombo tetiklenir
//    apply(gs)    → kombo efektini uygular
// ═══════════════════════════════════════════════════════════

const COMBOS = [
  {
    name: 'ALEV FIRTINASI',
    desc: '2 Büyücü sahada: tüm Büyücülere +800 ATK',
    check: (field) => field.filter(c => c && c.class === 'wizard').length >= 2,
    apply: (gs) => {
      gs.playerField.forEach(c => { if (c && c.class === 'wizard') c.atk += 800; });
      showCombo('ALEV FIRTINASI', 'Tüm Büyücülere +800 ATK!');
      addLog('🔥 ALEV FIRTINASI komusu tetiklendi! Büyücüler güçlendi!', 'combo');
    }
  },
  {
    name: 'SAVAŞ ÇIĞLIĞI',
    desc: '2 Savaşçı sahada: düşmana 600 direkt hasar',
    check: (field) => field.filter(c => c && c.class === 'warrior').length >= 2,
    apply: (gs) => {
      dealDirectDamage(gs, 600, 'savaş çığlığı');
      showCombo('SAVAŞ ÇIĞLIĞI', 'Düşmana 600 Direkt Hasar!');
      addLog('⚔️ SAVAŞ ÇIĞLIĞI! Düşmana 600 hasar!', 'combo');
    }
  },
  {
    name: 'GALİBİYET STRATEJİSİ',
    desc: '2 Stratejist sahada: 2 ek kart çek',
    check: (field) => field.filter(c => c && c.class === 'strategist').length >= 2,
    apply: (gs) => {
      drawCard(); drawCard();
      showCombo('GALİBİYET STRATEJİSİ', '2 Ekstra Kart Çektin!');
      addLog('🎖️ GALİBİYET STRATEJİSİ! 2 kart çektin!', 'combo');
    }
  },
  {
    name: 'KUTSAL KALKAN',
    desc: '2 Gardiyan sahada: 1000 can yenile',
    check: (field) => field.filter(c => c && c.class === 'guardian').length >= 2,
    apply: (gs) => {
      healPlayer(gs, 1000);
      showCombo('KUTSAL KALKAN', '1000 Can Yenilendi!');
      addLog('✨ KUTSAL KALKAN! 1000 can yenilendi!', 'heal');
    }
  },
  {
    name: 'KAOS PATLAMASI',
    desc: '2 Kaos sahada: düşman alanını temizle + 500 hasar',
    check: (field) => field.filter(c => c && c.class === 'chaos').length >= 2,
    apply: (gs) => {
      gs.enemyField = gs.enemyField.map(() => null);
      dealDirectDamage(gs, 500, 'kaos patlaması');
      showCombo('KAOS PATLAMASI', 'Düşman Alan Temizlendi + 500 Hasar!');
      addLog('💥 KAOS PATLAMASI! Düşman alanı silindi!', 'combo');
    }
  },
  {
    name: 'KAOS BÜYÜCÜLERİ',
    desc: 'Kaos + Büyücü sahada: tüm kartlara +500 ATK',
    check: (field) => field.some(c => c && c.class === 'chaos') && field.some(c => c && c.class === 'wizard'),
    apply: (gs) => {
      gs.playerField.forEach(c => { if (c) c.atk += 500; });
      showCombo('KAOS BÜYÜCÜLERİ', 'Tüm Kartlara +500 ATK!');
      addLog('🌑⚡ KAOS BÜYÜCÜLERİ! +500 ATK!', 'combo');
    }
  },
  {
    name: 'İRON WALL',
    desc: 'Gardiyan + Savaşçı sahada: 800 can + 400 hasar',
    check: (field) => field.some(c => c && c.class === 'guardian') && field.some(c => c && c.class === 'warrior'),
    apply: (gs) => {
      healPlayer(gs, 800);
      dealDirectDamage(gs, 400, 'demir duvar');
      showCombo('İRON WALL', '800 Can + 400 Hasar!');
      addLog('⚜️⚔️ İRON WALL! 800 can yenilendi, 400 hasar!', 'combo');
    }
  },
];
