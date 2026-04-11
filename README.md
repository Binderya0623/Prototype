# JSF + React Микрофронтэнд Загвар (Prototype)

Энэхүү загвар нь **JSF 2.3**-ийг үндсэн бүрхүүл (host) болгон ашиглаж, **React 18** микрофронтэнд модулиудыг нэгтгэх архитектурыг харуулна.

```
prototype/
├── jsf-host/          ← JSF 2.3 Maven вэб аппликэйшн (host)
│   └── src/main/webapp/
│       ├── index.xhtml       ← Нүүр хуудас
│       ├── students.xhtml    ← Модуль 1 ачаалагддаг хуудас
│       ├── topics.xhtml      ← Модуль 2 ачаалагддаг хуудас
│       ├── resources/css/host.css
│       └── WEB-INF/
│           ├── web.xml
│           ├── faces-config.xml
│           └── templates/layout.xhtml
├── module1/           ← React Модуль 1: Оюутны жагсаалт
│   └── src/
│       ├── index.js          ← import('./bootstrap')  ← async entry
│       ├── bootstrap.js      ← createRoot('#microfrontend-root')
│       ├── App.jsx
│       └── App.module.css    ← CSS Modules (хэш нэмдэг)
├── module2/           ← React Модуль 2: Сэдвийн сан
│   └── src/ (адил бүтэц)
└── build-modules.sh   ← Хоёр модулийг build хийж JSF-д хуулах скрипт
```

---

## Шаардлага

| Технологи | Хувилбар |
|-----------|----------|
| Java (JDK) | 11+ |
| Maven | 3.6+ |
| Node.js | 18.18.0 |
| npm | 9+ |

---

## Аппликэйшн ажиллуулах

### 1-р алхам — React модулиудыг Build хийх

Build скрипт нь хоёр модулийг `npm install` + `webpack build` хийж,  
үүссэн `main.js` файлуудыг автоматаар JSF webapp руу хуулна.

```bash
cd /Users/bindertsetseg/diploma/prototype
./build-modules.sh
```

> **Гаралт:** `jsf-host/src/main/webapp/microfrontends/module1/dist/main.js` болон `module2/dist/main.js` үүснэ.

Хэрэв хүсвэл тус тусад нь ажиллуулж болно:

```bash
# Module 1
cd module1
npm install
npm run build

# Module 2
cd module2
npm install
npm run build
```

---

### 2-р алхам — JSF Host аппликэйшныг ажиллуулах

```bash
cd /Users/bindertsetseg/diploma/prototype/jsf-host
mvn tomcat7:run
```

Амжилттай эхэлвэл консол дотор доорх мэдэгдэл гарна:

```
INFO: Starting Servlet Engine: Apache Tomcat/7.x
INFO: Starting PrototypeContext
```

---

### 3-р алхам — Хөтчид нэвтрэх

| Хуудас | URL | Тайлбар |
|--------|-----|---------|
| Нүүр хуудас | [http://localhost:8080](http://localhost:8080) | Архитектурын тайлбар |
| Оюутны жагсаалт | [http://localhost:8080/students.xhtml](http://localhost:8080/students.xhtml) | React Модуль 1 |
| Сэдвийн сан | [http://localhost:8080/topics.xhtml](http://localhost:8080/topics.xhtml) | React Модуль 2 |

---

## Хөгжүүлэлтийн горим (Dev Mode)

Модуль бүрийг бие дааж hot-reload-тайгаар ажиллуулж болно:

```bash
# Module 1 — http://localhost:3001
cd module1 && npm start

# Module 2 — http://localhost:3002
cd module2 && npm start
```

---

## Архитектурын тайлбар

### Асинхрон скрипт ачаалалт

```
JSF хуудас   →  <script src=".../main.js">
                        ↓
              index.js: import('./bootstrap')   ← dynamic import
                        ↓  (хамаарлуудыг урьдчилан татна)
              bootstrap.js: createRoot(#microfrontend-root)
                        ↓
              React App render хийгдэнэ
```

### CSS Modules — Загварын давхцалаас хамгаалах

Webpack нь `.module.css` файлын класс нэрүүдийг unique болгодог:

```
Модуль 1:  .card  →  .App_card_a3f9k   (хэш: a3f9k)
Модуль 2:  .card  →  .App_card_9d2e1f  (хэш: 9d2e1f)
JSF Host:  .card  →  .card             (өөрчлөгдөхгүй)
```

Иймд модулиуд хоорондоо болон JSF-тэй CSS мөргөлдөл үүсгэхгүй.

---

## Технологийн орчин

| Технологи | Үндсэн аппликэйшн | Модуль 1 | Модуль 2 |
|-----------|:-----------------:|:--------:|:--------:|
| Node.js   | —                 | 18.18.0  | 18.18.0  |
| Webpack   | —                 | 5.81.0   | 5.81.0   |
| JSF       | 2.3               | —        | —        |
| React     | —                 | 18.2.0   | 18.2.0   |
