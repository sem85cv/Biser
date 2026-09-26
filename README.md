# Бісер · Облік складу

**Версія 1.0** — вхід через Google, спільні дані у Firebase, склад матеріалів,
набори з підрахунком собівартості (грн/USD), категорії, пошук/сортування/пагінація.

React + Vite PWA для обліку матеріалів (бісер, нитки, фурнітура) та підрахунку
собівартості наборів для виготовлення прикрас. Вхід через Google, дані —
спільні для всіх авторизованих акаунтів, зберігаються у Firebase (Firestore +
Storage для фото) і синхронізуються в реальному часі.

## Крок 1. Створення проєкту Firebase

1. Відкрийте https://console.firebase.google.com → **Add project** → дайте
   назву (напр. "beads-inventory") → створіть проєкт (Google Analytics не
   обов'язковий, можна вимкнути)
2. У лівому меню → **Build → Authentication** → вкладка **Sign-in method** →
   увімкніть провайдер **Google**
3. У лівому меню → **Build → Firestore Database** → **Create database** →
   оберіть будь-який регіон → режим **Production mode**
4. У лівому меню → **Build → Storage** → **Get started** → **Production mode**
5. У лівому меню → шестерня біля "Project Overview" → **Project settings** →
   внизу "Your apps" → натисніть іконку `</>` (Web) → дайте назву застосунку →
   **Register app**. З'явиться блок `firebaseConfig` з ключами — вони знадобляться
   на кроці 2

## Крок 2. Ключі проєкту (.env)

Скопіюйте файл `.env.example` у `.env` і заповніть значеннями з `firebaseConfig`
(крок 1.5): `apiKey` → `VITE_FIREBASE_API_KEY`, `authDomain` →
`VITE_FIREBASE_AUTH_DOMAIN`, і так для решти полів (назви відповідають один до
одного).

`.env` вже додано в `.gitignore` — він не потрапить у Git, це нормально й
правильно (ключі не мають бути публічними в репозиторії).

**Для Netlify:** ці ж змінні потрібно продублювати в налаштуваннях сайту →
**Site configuration → Environment variables** → додати кожну змінну (ті самі
назви `VITE_FIREBASE_...` і значення) → зробити новий деплой (Deploys → Trigger
deploy), інакше Netlify збере застосунок без ключів і вхід не запрацює.

## Крок 3. Хто має доступ (список дозволених email)

Дані спільні для всіх, кого ви авторизуєте — за замовчуванням Firestore і
Storage закриті для всіх. Відкрийте:

**Firestore Database → вкладка Rules**, замініть вміст на:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAllowed() {
      return request.auth != null &&
        request.auth.token.email in [
          'ваша-пошта@gmail.com',
          'пошта-дружини@gmail.com'
        ];
    }
    match /{document=**} {
      allow read, write: if isAllowed();
    }
  }
}
```

**Storage → вкладка Rules**, замініть вміст на:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null &&
        request.auth.token.email in [
          'ваша-пошта@gmail.com',
          'пошта-дружини@gmail.com'
        ];
    }
  }
}
```

Вставте реальні пошти замість прикладів (натисніть **Publish** після редагування
кожного правила). Щоб додати ще одну людину пізніше — просто допишіть її email
у список в обох місцях і знову Publish.

**Ще один момент:** якщо застосунок буде на Netlify-домені (напр.
`beadsinventory.netlify.app`), його треба додати в список дозволених доменів
для входу: **Authentication → Settings → Authorized domains → Add domain**.

## Запуск

Потрібен встановлений Node.js (18+).

```bash
npm install
npm run dev
```

## Встановлення як застосунок (PWA)

```bash
npm run build
npm run preview
```

Для реального хостингу зберіть `npm run build` і викладіть вміст папки `dist/`
(Netlify підхопить це автоматично при кожному коміті в GitHub).

## Структура проєкту

- `src/App.jsx` — головний компонент, авторизація і стан складу/наборів
- `src/firebase.js` — підключення до Firebase (ключі з `.env`)
- `src/hooks/useAuth.js` — вхід/вихід через Google
- `src/hooks/useFirestoreCollection.js` — реальночасова синхронізація складу й наборів
- `src/hooks/useSettingsDoc.js` — категорії та курс USD (спільні налаштування)
- `src/utils/upload.js` — завантаження фото у Firebase Storage
- `src/components/` — форми та списки (склад, набори, модальні вікна, вхід)
- `src/utils/calc.js` — розрахунок собівартості
- `vite.config.js` — налаштування PWA (manifest, іконки, офлайн-кеш)

## Функціонал

- Вхід через Google, спільні дані для всіх дозволених акаунтів (реальний час —
  зміни від одного бачить інший одразу)
- Пошук, сортування (дата/назва/вартість) і посторінкова навігація на "Склад" і "Набори"
- Категорії товарів — редагування назви, іконки, кольору; додавання й видалення
- Вартість товару — загальна за партію або за одиницю (перемикач)
- Собівартість набору — в грн і в USD (курс задається вручну в ⚙ Налаштування)
- Пошук товару зі складу при додаванні компонента в набір (замість випадаючого списку)
