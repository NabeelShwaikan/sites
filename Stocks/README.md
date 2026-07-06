# Masar Module Standard v1.0 - Sharia Stocks

## التشغيل
افتح:
`index.html`

## الهيكل
```text
index.html
Pages/
  shariaStocks.html
Data/
  shariaMeta.js
  shariaSources.js
  shariaStocks.js
  shariaHistory.js
  shariaSchema.js
Services/
  dataService.js
  compareService.js
  parserService.js
  exportService.js
  validationService.js
UI/
  tableUI.js
  filtersUI.js
  statusPanelUI.js
  updaterUI.js
  themeUI.js
  app.js
Features/
  updater.js
  statistics.js
  favorites.js
Admin/
  update.html
Styles/
  main.css
  updater.css
  theme.css
Utils/
  constants.js
  helpers.js
  storage.js
```

## المخرجات
- تحويل الصفحة إلى وحدة معيارية داخل بوابة مسار.
- إضافة `shariaMeta.js`.
- إضافة لوحة حالة البيانات.
- تغيير زر التحديث إلى `فحص حالة التحديث`.
- دعم فحص تواريخ مصادر القوائم الثلاث.
- الحفاظ على بيانات الأسهم الحالية وعددها: 282.
- اعتماد مساحة أسماء واحدة: `Masar`.

## ملاحظة
يمكن لأي مستخدم فحص التحديث، لكن اعتماد التحديث الرسمي واستبدال ملفات البيانات مسؤولية مدير الصفحة.


## v1.1
أصبح `index.html` يعرض صفحة الأسهم الشرعية مباشرة بدون صفحة دخول وسيطة.
