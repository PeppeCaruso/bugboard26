# BugBoard26

Piattaforma web per la gestione collaborativa di issue in progetti software, sviluppata per il corso di Ingegneria del Software (A.A. 2025/2026), Università degli Studi di Napoli Federico II.

**Autori:** Giuseppe Pio Caruso, Danilo Del Prete

## Architettura

Il sistema è composto da due componenti indipendenti che comunicano tramite API REST:

- **backend/**: API REST sviluppata con NestJS (TypeScript), TypeORM e PostgreSQL
- **frontend/**: Single Page Application sviluppata con Angular e Angular Material

## Requisiti

- [Node.js](https://nodejs.org/) v26.4.0 o superiore (con npm)
- [PostgreSQL](https://www.postgresql.org/) in esecuzione in locale
- Angular CLI (facoltativo, è possibile usare `npx ng`)

## Installazione e avvio

### 1. Database

Creare un database vuoto in PostgreSQL, ad esempio da pgAdmin oppure con:

```sql
CREATE DATABASE bugboard26;
```

Le tabelle vengono create automaticamente da TypeORM al primo avvio del backend.

### 2. Backend

```bash
cd backend
npm install
```

Creare il file `.env` a partire dal modello fornito e compilarlo con i dati del proprio database:

```bash
cp .env.example .env
```

(su Windows: `copy .env.example .env`)

Avviare il backend:

```bash
npm run start:dev
```

Il backend è disponibile su `http://localhost:3000`.

### 3. Frontend

In un secondo terminale:

```bash
cd frontend
npm install
npm start
```

L'applicazione è disponibile su `http://localhost:4200`.

## Primo accesso

Al primo avvio, se nel database non è presente alcun amministratore, il backend crea automaticamente un account amministratore di default:

| Email | Password |
|---|---|
| `admin@bugboard.com` | `Admin1234!` |

Le credenziali possono essere modificate tramite le variabili `ADMIN_EMAIL` e `ADMIN_PASSWORD` del file `.env`, prima del primo avvio. Dopo l'accesso, l'amministratore può creare nuove utenze dalla sidebar.

## Test

I test di unità del backend si eseguono con:

```bash
cd backend
npm test
```

Per la misura della copertura:

```bash
npm test -- --coverage
```

## Funzionalità implementate

- **F1**: autenticazione tramite email e password e creazione delle utenze da parte dell'amministratore
- **F2**: segnalazione di issue con titolo, descrizione, tipo, priorità opzionale e immagine allegata
- **F3**: vista riepilogativa delle issue con filtri per tipo, stato, priorità e data
- **F5**: sezione commenti associata a ciascuna issue
- **F13**: archiviazione e disarchiviazione delle issue (solo amministratori)

Funzionalità aggiuntive: assegnazione delle issue, modifica dello stato, dashboard con statistiche.