# LiquiSwap Enterprise

Piattaforma professionale per lo scambio di criptovalute con supporto fiat on/off-ramp e swap di token illiquidi.

## Caratteristiche Principali

### 🏦 Fiat On/Off-Ramp
- **Acquista Crypto**: Converti valuta fiat in criptovalute con supporto per 8 valute principali
- **Vendi Crypto**: Converti criptovalute in valuta fiat con bonifico su qualsiasi conto bancario
- **Metodi di Pagamento**: Bonifico bancario, carta di credito/debito, SEPA, wire transfer
- **Valute Supportate**: USD, EUR, GBP, CHF, JPY, CAD, AUD, BRL

### 🔄 Swap Token Illiquidi
- **Prezzi Creator-Set**: I token illiquidi hanno prezzi stabiliti dai creatori in termini di token di riferimento
- **Token di Riferimento**: BTC, ETH, USDT, BNB, SOL, USDC, XRP, ADA, AVAX, DOGE (top 10 per market cap)
- **Fiat Ramp Universale**: Tutti i token di riferimento supportano on/off-ramp fiat su qualsiasi conto bancario
- **Routing Intelligente**: Conversione automatica attraverso token di riferimento per garantire liquidità

### 📊 Dashboard Enterprise
- Statistiche in tempo reale (volume, transazioni, token supportati)
- Visualizzazione token di riferimento con market cap e ranking
- Lista token illiquidi con prezzi creator-set
- Alert informativi sul funzionamento del sistema

## Design Enterprise

### Interfaccia Utente
- **Layout Professionale**: Sidebar con navigazione chiara, topbar con stato connessione
- **Design System Coerente**: Componenti riutilizzabili con varianti (primary, secondary, success, danger)
- **User-Friendly**: Flussi guidati step-by-step, label chiare, helper text, feedback visivo
- **Responsive**: Adattabile a desktop, tablet e mobile

### Componenti UI
- **Cards**: Contenitori con bordi, hover states e transizioni fluide
- **Buttons**: Varianti primary, secondary, success, danger con hover effects
- **Form Inputs**: Campi con label, placeholder, helper text e focus states
- **Badges**: Indicatori di stato (success, warning, danger, info)
- **Alerts**: Messaggi informativi con icone e colori contestuali
- **Progress Steps**: Indicatori di avanzamento per flussi multi-step

## Struttura del Progetto

```
src/
├── components/
│   ├── Sidebar.tsx          # Navigazione laterale
│   ├── TopBar.tsx           # Header con stato connessione
│   ├── Dashboard.tsx        # Panoramica statistiche
│   ├── BuyCrypto.tsx        # Acquisto crypto con fiat (3 step)
│   ├── SellCrypto.tsx       # Vendita crypto per fiat
│   └── SwapTokens.tsx       # Swap token illiquidi
├── data.ts                  # Dati token, valute fiat, metodi pagamento
├── types.ts                 # Definizioni TypeScript
├── App.tsx                  # Componente principale
└── index.css                # Stili globali e design system
```

## Funzionalità Tecniche

### Calcolo Prezzi Token Illiquidi
```typescript
// Prezzo token illiquido in USD
const usdValue = creatorPrice.amount * referenceTokenPrice;

// Conversione tra token illiquidi
const outputAmount = (fromUSDValue / toUSDPerToken);
```

### Price Impact
- Calcolato dinamicamente basato sulla liquidità del token
- Warning visivo per impatti > 10%
- Blocco per impatti > 15% con opzione di forzatura

### Slippage Tolerance
- Configurabile: 0.5%, 1%, 3%, 5%, 10%
- Calcolo minimo ricevuto: `outputAmount * (1 - slippage/100)`

## Tecnologie

- **React 18** con TypeScript
- **Tailwind CSS** per styling
- **Vite** per build e development
- **Design System Enterprise** custom

## Build e Deploy

```bash
# Installazione dipendenze
npm install

# Development server
npm run dev

# Build produzione
npm run build

# Preview build
npm run preview
```

## Licenza

Proprietario - LiquiSwap Enterprise © 2026
