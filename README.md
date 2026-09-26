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

## Деплой на Firebase Hosting (рекомендовано замість Netlify)

Хостинг на Firebase має домен того ж "сімейства", що й `authDomain` — це усуває
проблеми входу через Google, пов'язані з ізоляцією сховища між різними доменами.
Налаштовується один раз, повністю з телефону, через GitHub Actions.

**Крок 1. Секрети в GitHub**

У репозиторії на GitHub: **Settings → Secrets and variables → Actions → New
repository secret**. Додайте 6 секретів з тими самими назвами й значеннями, що
й у `.env` / Netlify:

```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
```

**Крок 2. Ключ сервісного акаунту**

У консолі Firebase: **Project settings → Service accounts** → кнопка
**"Generate new private key"** → підтвердіть → завантажиться `.json` файл.
Відкрийте цей файл (на телефоні — через "Файли" або браузер), виділіть і
скопіюйте геть увесь його вміст.

Додайте ще один секрет у GitHub з назвою **FIREBASE_SERVICE_ACCOUNT** і
значенням — усім вмістом цього json-файлу (вставте як є, це один довгий текст).

**Крок 3. Увімкнути Hosting у Firebase**

У консолі Firebase: **Build → Hosting → Get started** → можна пропустити всі
кроки з встановленням CLI (вони не потрібні — це зробить GitHub Actions) →
просто дійдіть до кінця майстра, щоб Hosting значився як увімкнений для проєкту.

**Крок 4. Готово**

Файли `firebase.json`, `.firebaserc` і `.github/workflows/firebase-hosting-deploy.yml`
вже є в цьому репозиторії. Після додавання секретів (кроки 1-2) наступний
`git push`/коміт у гілку `main` автоматично запустить збірку й викладе сайт на:

```
https://beadsinventory-d73f2.web.app
```

Прогрес збірки видно в репозиторії на GitHub у вкладці **Actions**. Домен
`.web.app` вже автоматично в списку дозволених для входу через Google (Firebase
додає його сам) — окремо дозволяти не потрібно.

Netlify можна лишити паралельно (не заважає) або згодом відключити — на ваш розсуд.

## Запуск локально

Потрібен встановлений Node.js (18+).

```bash
npm install
npm run dev
```

## Деплой на Netlify (альтернатива)

Якщо волієте Netlify — просто підключіть репозиторій як раніше (Build command:
`npm run build`, Publish directory: `dist`) і додайте ті самі 6 змінних
`VITE_FIREBASE_...` в Site configuration → Environment variables. Але майте на
увазі нюанс з доменами, описаний вище (Крок 3) — можливі проблеми входу через
Google через ізоляцію сховища між доменами.

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
