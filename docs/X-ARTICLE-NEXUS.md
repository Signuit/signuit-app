# SignUIT'i Nexus Framework ile 3 Haftada Nasıl İnşa Ettik

**Canton Network üzerinde kurumsal bir collateral routing uygulaması — type-safe, gerçek zamanlı, production-ready.**

---

3 haftada kurumsal bir finans uygulaması inşa etmek mümkün mü?

Biz ettik.

Biz, küçük bir ekip olarak Canton Network üzerinde çalışan bir **collateral routing motoru** inşa ettik. Kurumlar arasında milyonlarca dolarlık teminat hareketi, 3 saniyede hesaplanıyor ve blockchain üzerinde kayıt altına alınıyor.

Bu yazı, o yolculuğun teknik hikayesi — neden bu kararları verdik, neyi yanlış yaptık ve bizi hızlandıran tek şeyin ne olduğu.

---

## Sorun: İki Katmanlı Bir Kabus

### Katman 1: Collateral Yönetimi Hâlâ Excel'de

Finans kurumlarının %70'i teminat yönetiminde hâlâ manuel süreçler kullanıyor.

Bir margin call geldiğinde:
- Trader Excel'i açıyor
- Hangi varlıktan ne kadar göndereceğini hesaplıyor
- Uyumluluk kontrolü yapıyor
- Karşı tarafa telefon açıyor

**Toplam süre: 30+ dakika.**

Bir saniye için düşünün. Kurumlar günde onlarca margin call alıyor. Bu onlarca saat boşa harcanan insan enerjisi demek.

### Katman 2: Canton'da Build Etmek Zordu

SignUIT'i [Canton Network](https://www.canton.network/) üzerinde inşa etmek istedik. Neden? Çünkü Canton bize iki şeyi aynı anda veriyor:

- **Gizlilik**: Teminat pozisyonları yalnızca ilgili taraflarla paylaşılıyor
- **Audit trail**: Her karar değiştirilemez bir akıllı kontrat olarak kayıt altında

Ama Canton'da geliştirme yapmak, başlı başına bir zorluktı.

Ham API payloadlarını elle oluşturmak. JWT token üretimini sıfırdan yazmak. WebSocket bağlantılarını yönetmek. Server-side rendering için hiçbir dokümantasyon yok. Type safety? Yok.

İlk haftanın sonunda şunu fark ettik: Ürünü değil, altyapıyı yazıyorduk. **İşte burada Nexus Framework doğdu.**

---

## Çözüm: Nexus Framework

Canton ekosistemi için "missing middleware"i biz yazdık — SignUIT'i inşa ederken, aynı anda.

Nexus'u şöyle düşünebilirsiniz:
- **Prisma** — ama Daml akıllı kontratları için
- **tRPC** — ama Canton ledger operasyonları için
- **wagmi/viem** — ama Canton dApp geliştiricileri için

Tek bir framework. Üç katman.

---

## Mimariye Bakış

```
React Frontend (SignUIT)
    │
    ├── @nexus-framework/react
    │   ├── useContracts() — type-safe sorgular
    │   ├── useExerciseChoice() — optimistic mutations
    │   └── streamingPlugin — gerçek zamanlı güncellemeler
    │
    ├── @nexus-framework/orpc
    │   ├── Otomatik ledger context injection
    │   ├── RBAC middleware
    │   └── Canton hata yönetimi
    │
    └── @nexus-framework/core
        ├── Canton HTTP client
        ├── PQS SQL motoru (10x hızlı okuma)
        └── Session yönetimi (AES-GCM şifreli cookie)
            │
            ▼
    Canton Network
    └── Daml Akıllı Kontratlar
```

---

## Eski Dünya vs Nexus: Somut Fark

Bir örnek üzerinden gösterelim. SignUIT'te kurumun sahip olduğu teminatları sorgulamak istiyorsunuz.

### Eskiden (raw Canton API):

```typescript
// Elle token al
const token = await fetch('/v2/auth/token', {
  method: 'POST',
  body: JSON.stringify({ userId: '...' })
}).then(r => r.json());

// Template ID'yi elle yaz (hata yapmak çok kolay)
const response = await fetch('/v2/state/active-contracts', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token.access_token}` },
  body: JSON.stringify({
    filter: {
      filtersByParty: {
        [partyId]: {
          filters: [{
            templateId: 'a1b2c3d4:CollateralRouter:CollateralHolding'
          }]
        }
      }
    }
  })
});

// Pagination'ı elle yönet
let contracts = [];
let pageToken = null;
do {
  // ...aynı fetch, her seferinde nextPageToken ile...
} while (pageToken);

// Tip güvenliği? Yok. Runtime'da patlayabilir.
const holdings = (await response.json()).activeContracts;
```

**~50 satır. Tip güvenliği yok. Pagination manuel. Hata yönetimi yok.**

### Nexus ile:

```typescript
const holdings = await nexus.CollateralHolding.findMany({
  where: { active: true },
  limit: 100
});
// ✅ Tam TypeScript desteği
// ✅ Pagination otomatik
// ✅ Hata yönetimi dahili
```

**3 satır. Full type safety. Bitirdiniz.**

---

## SignUIT'i Nasıl İnşa Ettik

### 1. Daml'dan TypeScript'e: Type Generation

Bu kısım çoğu anlatımda atlanıyor ama bize en çok zaman kazandıran şey burada.

Daml, akıllı kontratları tanımlamak için kullanılan bir dil. Bir kontrat şöyle görünüyor:

```haskell
-- CollateralRouter.daml
template CollateralHolding
  with
    institution  : Party
    operator     : Party
    assetSymbol  : Text      -- "USDC", "USYC", "UST"
    amount       : Decimal
    yield        : Decimal   -- 0.045 = %4.5
    haircut      : Decimal   -- 0.02 = %2
  where
    signatory institution
    observer operator

    choice UpdateYield : ContractId CollateralHolding
      with newYield : Decimal
      controller operator
      do create this with yield = newYield
```

Bu Daml dosyasından `daml codegen ts` komutuyla otomatik olarak TypeScript tipleri üretiliyor:

```bash
daml codegen ts .daml/dist/nexus-example-0.0.1.dar -o daml.js/nexus-example-0.0.1
```

Çıktı: her kontrat için bir TypeScript modülü. İçinde payload tipi, decoder, encoder ve choice tanımları var. Bizim tek yapmamız gereken bu çıktıyı Nexus'a **bir kez** kayıt etmek:

```typescript
// apps/web/src/lib/nexus-types.ts
import * as DamlPackage from "@daml.js/nexus-example-0.0.1";

const { CollateralRouter } = DamlPackage;

export const nexusTypes = {
  // Onboarding
  JoinRequest:        CollateralRouter.JoinRequest,
  ServiceAgreement:   CollateralRouter.ServiceAgreement,

  // Policy & Holdings
  CollateralPolicy:   CollateralRouter.CollateralPolicy,
  CollateralHolding:  CollateralRouter.CollateralHolding,

  // Routing Flow
  MarginCall:         CollateralRouter.MarginCall,
  RoutingSuggestion:  CollateralRouter.RoutingSuggestion,
  AllocationRecord:   CollateralRouter.AllocationRecord,
} as const;
```

Bu tek dosya, tüm uygulamaya type safety'yi **otomatik** olarak yayıyor. Artık:

- `nexus.CollateralHolding.findMany()` → payload tipi `{ institution, assetSymbol, amount, yield, haircut }` olarak bilinir
- `nexus.RoutingSuggestion.exercise("Approve", contractId, {})` → choice argümanları compile-time'da kontrol edilir
- Daml kontratında bir alan adı değişirse → TypeScript derleme hatası verir, runtime'da patlayamazsın

**Yanlış template ID yazmak artık mümkün değil. Yanlış payload alanı adı yazmak mümkün değil. Hata yazmak için aktif çaba sarf etmen gerekiyor.**

---

### 2. Daml Kontratları

Tasarımın özünde tek bir ilke vardı: **kurum her şeyin sahibi, biz (operator) yalnızca altyapıyız.** 6 temel kontrat:

| Kontrat | Kim oluşturuyor | Ne için |
|---------|----------------|---------|
| `CollateralHolding` | Kurum | Sahip olunan varlıklar |
| `CollateralPolicy` | Kurum | Hangi varlığı ne zaman kullan |
| `MarginCall` | Karşı taraf | Teminat talebi |
| `RoutingSuggestion` | Sistem | CTD algoritmasının önerisi |
| `AllocationRecord` | Kurum | Onaylanan ve uygulanan karar |
| `ServiceAgreement` | Kurum + Operator | Ağa katılım |

Bu kontratların tümü `nexusTypes` dosyasına kaydedildiği an, uygulama genelinde tam tip güvencesiyle kullanılabilir hale geldi.

### 3. Kontrat Tasarımının Asıl Zorluğu: Kimin Neyi Göreceği

Daml'da her şey "kimin signatory, kimin observer olduğu" sorusuna dayanıyor. Bu soruyu yanlış cevaplamak demek yanlış bir güven modeli demek — ve bu hata production'da görünmüyor, tasarım aşamasında yakalanıyor.

Bizi en çok uğraştıran yer burası oldu.

**Problem:** Bir `RoutingSuggestion` kontratı oluşturulduğunda:
- Kurumun onu görmesi lazım (o onaylayacak)
- Operatörün görmesi lazım (dashboard'da gösterecek)
- Karşı tarafın *opsiyonel* olarak görmesi lazım (çünkü her senaryoda bir karşı taraf olmayabilir)

Daml'da bunu şöyle çözdük:

```haskell
template RoutingSuggestion
  with
    institution  : Party
    operator     : Party
    counterparty : Optional Party   -- her zaman olmayabilir
    ...
    status       : RouteStatus
  where
    signatory institution            -- kontratı kurum oluşturur
    observer  operator,
              optional [] (\x -> [x]) counterparty  -- varsa karşı taraf da görür

    -- Onaylama yetkisi sadece kurumda
    choice ApproveSuggestion : ContractId AllocationRecord
      with approvedBy : Party
      controller institution
      do
        create AllocationRecord with
          assetsSent         = suggestedAssets
          amountsSent        = suggestedAmounts
          opportunityCostBps = (estimatedOpportunityCost / amountRequired) * 10000.0
          approvedBy         = approvedBy
          executedAt         = now
          status             = RouteExecuted
```

`ApproveSuggestion` choice'ı çalıştığında iki şey aynı anda oluyor:
1. `RoutingSuggestion` kontratı **archive** ediliyor (bir daha değiştirilemez)
2. Yerine `AllocationRecord` yaratılıyor — neyin ne zaman kim tarafından onaylandığının değiştirilemez kaydı

Bu atomik dönüşüm Canton'ın sağladığı bir güvence. Nexus bu choice'ı şöyle kullanıyor:

```typescript
// Ops ekibi "Onayla" butonuna basınca:
const result = await nexus.RoutingSuggestion.exercise(
  "ApproveSuggestion",
  suggestion.contractId,
  { approvedBy: partyId }
);
// result.contractId → yeni AllocationRecord'un ID'si
// Tip sistemi: yanlış choice adı veya payload → derleme hatası
```

**Operatör bu choice'ı tetikleyemez.** `controller institution` — bu Daml'ın enforcement'ı, uygulama katmanında bir `if` değil. Ledger seviyesinde reddedilir.

Bu tasarım bize "güvenli by default" bir sistem verdi. Nexus'un type generation'ı da bu choice tanımlarını TypeScript'e taşıdığı için, frontend hiçbir zaman olmayan bir choice'ı çağırmaya bile *çalışamıyor*.

### 4. Multi-Party Auth

Canton'ın gücü çok taraflı iş akışlarında ortaya çıkıyor. SignUIT'te üç farklı taraf var:

- **VantageCapital** (Kurum) — Teminatı olan taraf
- **PrimeBank** (Karşı taraf) — Margin call gönderen
- **SignUIT** (Operator) — Ağ altyapısı, karar verici değil

Her tarafın farklı bir dashboard'u var. Her biri farklı kontratları görüyor. Nexus'un session yönetimi bunu tek satır config ile çözüyor:

```typescript
// Her HTTP isteği otomatik olarak doğru tarafın bağlamını alıyor
const ctx = await nexus.forRequest(req);
// ctx.CollateralHolding → sadece bu kurumun varlıkları görünüyor
```

### 5. Gerçek Zamanlı Dashboard

Margin call geldiğinde dashboard anında güncellensin istiyorduk. Polling yok, sayfa yenileme yok.

```typescript
// VantageCapital'ın dashboardunda:
const { contracts: marginCalls, isLive } = nexus.MarginCall.useStreamContracts({
  parties: [partyId]
});

// PrimeBank yeni bir margin call oluşturduğu an,
// VantageCapital'ın ekranı otomatik güncelleniyor.
```

WebSocket bağlantısı, token refresh'i, bağlantı kopması, temizleme — hepsi Nexus tarafından yönetiliyor.

---

## Sandbox-First Geliştirme Deneyimi

Canton'da geliştirme ortamı kurmak geleneksel olarak saatler alırdı.

Nexus ile:

```bash
docker-compose up  # Canton sandbox ayağa kalktı
bun dev            # Uygulama başladı
```

İlk istek geldiğinde Nexus otomatik olarak:
1. Canton'da bir party oluşturuyor
2. Kullanıcı hesabı açıyor
3. JWT token üretiyor
4. Şifreli session cookie yazıyor

Tek satır kod yazmadan çalışan bir geliştirme ortamı.

---

## 3 Hafta Neden Yetti?

Açık olmak gerekirse: bu sürede bitirmek Nexus olmasaydı mümkün olmazdı. Nexus'u yazarken zaten SignUIT'i yazıyorduk — ikisi aynı anda şekillendi.

Nexus olmasaydı bu sürenin çoğunu şunlara harcayacaktık:

| Sorun | Geleneksel çözüm | Nexus ile |
|-------|-----------------|-----------|
| JWT üretimi ve refresh | ~3 gün | Config satırı |
| ACS pagination | ~1 gün | Otomatik |
| WebSocket yönetimi | ~2 gün | `useStreamContracts()` |
| SSR hydration | ~2 gün | `prefetchNexusQuery()` |
| Cache invalidation | ~1 gün | Template ID'ye göre otomatik |
| Multi-user auth | ~3 gün | `sandboxAuth()` plugin |
| Hata yönetimi (409, 425) | ~1 gün | Dahili retry logic |

**Toplamda ~13 gün kurtardık. 3 haftada bitirebildik.**

---

## Öğrendiklerimiz

**1. Canton için "integration tax" gerçek**

Doğrudan Canton API'larıyla çalışmak, her projede aynı altyapı kodunu yazmayı gerektiriyor. Biz bunu ilk gün hissettik. Bu ekosistemi yavaşlatıyor.

**2. Type safety sadece konfor değil, hız**

Daml codegen çıktısını TypeScript'e bağladığımızda, kontrat payload hatalarını runtime'da değil compile-time'da yakalamaya başladık. Bu bize ciddi zaman kazandırdı.

**3. Sandbox DX, üretim kalitesini belirliyor**

Geliştirme ortamı ne kadar kolay kurulursa, o kadar çok iterasyon yapılıyor. Nexus'un auto-provisioning özelliği sayesinde ekibimizin her üyesi dakikalar içinde üretime yakın bir ortamda çalışmaya başlayabildi.

**4. "Operator as infrastructure, not gatekeeper"**

Canton'ın çok taraflı modelini doğru anlamak kritikti. Biz bir aracı değil, altyapıyız. Kurumlar kendi kararlarını kendileri veriyor. Biz sadece hesaplamaları yapıyoruz ve kaydı tutuyoruz.

---

## Sonuç

SignUIT, kurumsal collateral yönetimini 30 dakikadan 3 saniyeye indiriyor. Ve bunu yaparken her kararı değiştirilemez bir Canton kaydı olarak saklıyor.

Bunu 3 haftada inşa edebildiysek, bunun büyük bir kısmı Nexus Framework sayesinde — ve Nexus'u da biz yazdık.

**Nexus, Canton ekosisteminde eksik olan katmandı. Onu açık kaynak olarak yayımlıyoruz çünkü bir sonraki takımın bizim harcadığımız zamanı harcamamasını istiyoruz.**

Canton üzerinde bir şey inşa etmeyi düşünüyorsanız, Nexus Framework'e göz atın:

- Dokümantasyon: [docs.signuit.com](https://docs.signuit.com)
- SignUIT ürünü: [signuit.com](https://signuit.com)

---

*SignUIT CollateralRouter, HackCanton Season #1'de inşa edildi.*  
*Nexus Framework — Apache-2.0 lisanslı, Canton ekosistemi için açık kaynak.*
