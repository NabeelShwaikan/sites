دليل مطاعم المدينة — تعليمات التشغيل

1) يجب الحفاظ على الهيكلة التالية:
   index.html
   Restaurants/styles.css
   Restaurants/app.js
   Restaurants/madinah_restaurants.json

2) الصفحة تقرأ البيانات حصريًا من ملف JSON الخارجي:
   Restaurants/madinah_restaurants.json

3) عند دمجها داخل بوابة مسار أو استضافتها على GitHub Pages ستعمل مباشرة.

4) بعض المتصفحات تمنع fetch عند فتح index.html بالنقر المباشر بصيغة file://.
   للاختبار المحلي شغّل خادمًا بسيطًا داخل مجلد المشروع، مثل:
   python -m http.server 8000
   ثم افتح:
   http://localhost:8000
