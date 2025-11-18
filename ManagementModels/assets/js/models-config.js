// الفئات حسب مجال الاستخدام
const CATEGORIES = [
  { id: "all",         name: "كل النماذج" },
  { id: "strategy",    name: "تحليل استراتيجي / عام" },
  { id: "finance",     name: "تحليل مالي / جدوى" },
  { id: "projects",    name: "إدارة المشاريع" },
  { id: "time",        name: "إدارة الوقت والمهام" },
  { id: "risk",        name: "إدارة المخاطر" },
  { id: "stakeholders",name: "أصحاب المصلحة" },
  { id: "personal",    name: "قرارات شخصية / مهنية فردية" }
];

// الفئات حسب "مناسب لمن؟"
const AUDIENCES = [
  { id: "entrepreneurs", name: "روّاد الأعمال وأصحاب المشاريع" },
  { id: "execs",         name: "القياديون والتنفيذيون" },
  { id: "managers",      name: "مدراء المشاريع وفرق العمل" },
  { id: "analysts",      name: "المستشارون والمحللون" },
  { id: "students",      name: "الطلاب والباحثون" },
  { id: "individuals",   name: "القرارات الشخصية / المهنية" }
];

// جميع النماذج (١١ قديمة + ٤ جديدة)

const MODELS = [
  {
    id: "swot",
    file: "swot.html",
    enabled: true,
    short: "SWOT",
    name_ar: "تحليل SWOT",
    name_en: "SWOT Analysis",
    desc: "تحليل نقاط القوة والضعف والفرص والتهديدات المحيطة بقرارك أو مشروعك.",
    serves: "روّاد الأعمال، المديرون، القياديون، والطلاب في المشاريع.",
    when: "عند اتخاذ قرار مصيري، بدء مشروع جديد، تقييم شراكة، أو تغيير مسار.",
    decisionLogic: "مقارنة العوامل الداعمة (القوة + الفرص) بالعوامل المعطِّلة (الضعف + التهديدات) للخروج بصورة عن جدوى القرار.",
    categories: ["strategy", "projects"],
    audiences: ["entrepreneurs", "execs", "managers", "students", "analysts"],
    sections: [
      {
        key: "strengths",
        label: "نقاط القوة",
        positive: true,
        placeholder: "اكتب نقاط القوة، كل نقطة في سطر مستقل..."
      },
      {
        key: "weaknesses",
        label: "نقاط الضعف",
        positive: false,
        placeholder: "اكتب نقاط الضعف، كل نقطة في سطر مستقل..."
      },
      {
        key: "opportunities",
        label: "الفرص",
        positive: true,
        placeholder: "اكتب الفرص المحتملة، كل نقطة في سطر مستقل..."
      },
      {
        key: "threats",
        label: "التهديدات",
        positive: false,
        placeholder: "اكتب المخاطر والتهديدات، كل نقطة في سطر مستقل..."
      }
    ]
  },
  {
    id: "cba",
    file: "cba.html",
    enabled: true,
    short: "CBA",
    name_ar: "تحليل التكاليف والفوائد",
    name_en: "Cost–Benefit Analysis",
    desc: "مقارنة التكاليف مقابل الفوائد لاختبار جدوى قرار أو مشروع.",
    serves: "أصحاب المشاريع، الإداريون، متخذي القرار المالي والطلاب في مشاريع التخرج.",
    when: "عند دراسة مشروع جديد، شراء نظام، التوسع في نشاط، أو اتخاذ قرار له أثر مالي أو جهدي.",
    decisionLogic: "مقارنة إجمالي وزن الفوائد مقابل إجمالي وزن التكاليف لتقدير جدوى القرار.",
    categories: ["finance", "projects"],
    audiences: ["entrepreneurs", "execs", "managers", "analysts"],
    sections: [
      {
        key: "benefits",
        label: "الفوائد",
        positive: true,
        placeholder: "اكتب الفوائد المتوقعة، كل نقطة في سطر مستقل..."
      },
      {
        key: "costs",
        label: "التكاليف",
        positive: false,
        placeholder: "اكتب التكاليف أو المخاطر، كل نقطة في سطر مستقل..."
      }
    ]
  },
  {
    id: "pros_cons",
    file: "pros_cons.html",
    enabled: true,
    short: "Pros / Cons",
    name_ar: "تحليل الإيجابيات والسلبيات",
    name_en: "Pros & Cons",
    desc: "نموذج بسيط لموازنة الإيجابيات مقابل السلبيات قبل اتخاذ القرار.",
    serves: "جميع متخذي القرار: أفراد، طلاب، روّاد أعمال، ومديرون.",
    when: "عند التردد بين خيارين أو أكثر، أو تقييم خطوة شخصية أو مهنية.",
    decisionLogic: "كلما زادت الإيجابيات (وزناً وعدداً) مقارنة بالسلبيات، كان القرار أكثر ميلاً للتنفيذ.",
    categories: ["strategy", "personal"],
    audiences: ["individuals", "students", "entrepreneurs"],
    sections: [
      {
        key: "pros",
        label: "الإيجابيات",
        positive: true,
        placeholder: "اكتب الإيجابيات، كل نقطة في سطر مستقل..."
      },
      {
        key: "cons",
        label: "السلبيات",
        positive: false,
        placeholder: "اكتب السلبيات أو العيوب، كل نقطة في سطر مستقل..."
      }
    ]
  },
  {
    id: "risk_opportunity",
    file: "risk_opportunity.html",
    enabled: true,
    short: "Risk / Opportunity",
    name_ar: "تحليل الفرص والمخاطر",
    name_en: "Risk–Opportunity Analysis",
    desc: "تركيز على الفرص التي يخلقها القرار مقابل المخاطر التي قد تترتب عليه.",
    serves: "الاستثمار، المشاريع، المبادرات الجديدة، والتوسعات.",
    when: "عند التفكير في مشروع استثماري أو توسع نشاط أو دخول سوق جديد.",
    decisionLogic: "مقارنة وزن الفرص مع وزن المخاطر لتقدير مدى جدوى المجازفة.",
    categories: ["strategy", "risk", "projects"],
    audiences: ["entrepreneurs", "execs", "managers", "analysts"],
    sections: [
      {
        key: "opportunities",
        label: "الفرص",
        positive: true,
        placeholder: "اكتب الفرص المحتملة، كل نقطة في سطر مستقل..."
      },
      {
        key: "risks",
        label: "المخاطر",
        positive: false,
        placeholder: "اكتب المخاطر والتهديدات، كل نقطة في سطر مستقل..."
      }
    ]
  },
  {
    id: "force_field",
    file: "force_field.html",
    enabled: true,
    short: "Force Field",
    name_ar: "تحليل قوى الدفع والكبح",
    name_en: "Force Field Analysis",
    desc: "يحلل القوى التي تدفع القرار للأمام مقابل القوى التي تعيقه.",
    serves: "إدارة التغيير، تطوير العمليات، التحسين المستمر.",
    when: "عند تطبيق تغيير داخلي في فريق، قسم، أو مؤسسة.",
    decisionLogic: "إذا كانت قوى الدفع أقوى بكثير من قوى الكبح، يصبح تنفيذ القرار أكثر قابلية للنجاح.",
    categories: ["strategy", "projects"],
    audiences: ["execs", "managers", "analysts"],
    sections: [
      {
        key: "driving_forces",
        label: "قوى الدفع",
        positive: true,
        placeholder: "اكتب العوامل التي تدعم التغيير، كل نقطة في سطر مستقل..."
      },
      {
        key: "restraining_forces",
        label: "قوى الكبح",
        positive: false,
        placeholder: "اكتب العوامل التي تعيق التغيير، كل نقطة في سطر مستقل..."
      }
    ]
  },
  {
    id: "moscow",
    file: "moscow.html",
    enabled: true,
    short: "MoSCoW",
    name_ar: "تحليل أولويات MoSCoW",
    name_en: "MoSCoW Prioritization",
    desc: "تقسيم المتطلبات إلى: يجب، ينبغي، يمكن، لن يُنفّذ حالياً.",
    serves: "إدارة المشاريع، تحليل المتطلبات، تطوير الأنظمة والمنتجات.",
    when: "عند تزاحم المتطلبات وقلة الموارد وتحتاج لتحديد ما يُقدّم وما يُؤجّل.",
    decisionLogic: "ارتفاع وزن فئة (يجب) و(ينبغي) مقابل (لن يُنفّذ) يعطي وضوحاً في ما يجب تنفيذه أولاً.",
    categories: ["strategy", "projects", "time"],
    audiences: ["managers", "execs", "analysts"],
    sections: [
      {
        key: "must",
        label: "Must — يجب تنفيذها",
        positive: true,
        placeholder: "اكتب المتطلبات الحرجة (Must)، كل نقطة في سطر مستقل..."
      },
      {
        key: "should",
        label: "Should — يُفضّل تنفيذها",
        positive: true,
        placeholder: "اكتب المتطلبات المهمة لكن ليست حرجة، كل نقطة في سطر مستقل..."
      },
      {
        key: "could",
        label: "Could — يمكن تنفيذها",
        positive: true,
        placeholder: "اكتب المتطلبات الإضافية (تحسينية)، كل نقطة في سطر مستقل..."
      },
      {
        key: "wont",
        label: "Won’t — لن تُنفّذ حالياً",
        positive: false,
        placeholder: "اكتب المتطلبات التي سيتم استبعادها أو تأجيلها الآن..."
      }
    ]
  },
  {
    id: "eisenhower",
    file: "eisenhower.html",
    enabled: true,
    short: "Eisenhower",
    name_ar: "مصفوفة أيزنهاور للأولويات",
    name_en: "Eisenhower Matrix",
    desc: "تصنيف المهام حسب الأهمية والعجلة لتحديد ما يُنفّذ وما يُفوَّض وما يُؤجَّل.",
    serves: "القياديون، المديرون، العاملون ذوو المهام المتعددة، والطلاب.",
    when: "عند الشعور بتزاحم المهام وكثرة الضغوط وعدم وضوح الأولويات.",
    decisionLogic: "زيادة وزن المهام المهمة (العاجلة وغير العاجلة) مقابل غير المهمة يعكس جودة جدولك اليومي.",
    categories: ["strategy", "time", "personal"],
    audiences: ["individuals", "execs", "managers", "students"],
    sections: [
      {
        key: "urgent_important",
        label: "مهم وعاجل (نفّذه الآن)",
        positive: true,
        placeholder: "اكتب المهام المهمة والعاجلة، كل مهمة في سطر مستقل..."
      },
      {
        key: "not_urgent_important",
        label: "مهم وغير عاجل (خطط له)",
        positive: true,
        placeholder: "اكتب المهام المهمة لكن غير العاجلة، كل مهمة في سطر مستقل..."
      },
      {
        key: "urgent_not_important",
        label: "عاجل وغير مهم (فوّضه)",
        positive: false,
        placeholder: "اكتب المهام العاجلة ولكن غير المهمة لك، كل مهمة في سطر مستقل..."
      },
      {
        key: "not_urgent_not_important",
        label: "غير عاجل وغير مهم (تخلّص منه)",
        positive: false,
        placeholder: "اكتب المهام التي يمكن حذفها أو التقليل منها..."
      }
    ]
  },
  {
    id: "smart",
    file: "smart.html",
    enabled: true,
    short: "SMART",
    name_ar: "أهداف SMART",
    name_en: "SMART Goals",
    desc: "تفصيل الأهداف لتكون محددة، قابلة للقياس، قابلة للتحقيق، واقعية، ومحددة بزمن.",
    serves: "الطلاب، الموظفون، القياديون، وروّاد الأعمال.",
    when: "عند تحويل فكرة عامة إلى هدف واضح يمكن تتبّعه وقياسه.",
    decisionLogic: "كلما زادت قوة عناصر SMART وقلّت العوائق، أصبح الهدف أكثر قابلية للتطبيق.",
    categories: ["strategy", "personal", "projects"],
    audiences: ["individuals", "students", "execs", "entrepreneurs"],
    sections: [
      {
        key: "smart_factors",
        label: "عناصر SMART (S-M-A-R-T)",
        positive: true,
        placeholder: "اكتب نقاط توضح: التحديد، القياس، القابلية للتحقيق، الواقعية، الإطار الزمني..."
      },
      {
        key: "obstacles",
        label: "عوائق أو شروط نجاح الهدف",
        positive: false,
        placeholder: "اكتب العوائق أو المتطلبات الحرجة لتحقيق الهدف..."
      }
    ]
  },
  {
    id: "risk_matrix",
    file: "risk_matrix.html",
    enabled: true,
    short: "Risk Matrix",
    name_ar: "مصفوفة المخاطر",
    name_en: "Risk Impact–Probability Matrix",
    desc: "ترتيب المخاطر حسب درجة الاحتمال والتأثير لتحديد ما يجب التعامل معه أولاً.",
    serves: "إدارة المشاريع، الأمن السيبراني، التشغيل، السلامة.",
    when: "عند وجود قائمة مخاطر وترغب في ترتيبها حسب الأولوية.",
    decisionLogic: "تركّز على المخاطر ذات الوزن الأعلى (تأثير × احتمال) لمعالجتها أولاً أو لتعديل القرار.",
    categories: ["strategy", "risk", "projects"],
    audiences: ["managers", "analysts", "execs"],
    sections: [
      {
        key: "high_risks",
        label: "مخاطر عالية",
        positive: false,
        placeholder: "اكتب المخاطر عالية التأثير أو الاحتمال..."
      },
      {
        key: "medium_risks",
        label: "مخاطر متوسطة",
        positive: false,
        placeholder: "اكتب المخاطر متوسطة التأثير أو الاحتمال..."
      },
      {
        key: "low_risks",
        label: "مخاطر منخفضة",
        positive: false,
        placeholder: "اكتب المخاطر منخفضة نسبياً..."
      },
      {
        key: "mitigations",
        label: "إجراءات تخفيف ومعالجة",
        positive: true,
        placeholder: "اكتب إجراءات التخفيف أو الضوابط المقترحة..."
      }
    ]
  },
  {
    id: "stakeholder",
    file: "stakeholder.html",
    enabled: true,
    short: "Stakeholders",
    name_ar: "تحليل أصحاب المصلحة",
    name_en: "Stakeholder Analysis",
    desc: "تحديد أصحاب المصلحة الداعمين والمتأثرين والمعارضين وتأثيرهم على القرار.",
    serves: "القياديون، مدراء المشاريع، فرق التغيير المؤسسي.",
    when: "عند إطلاق مشروع أو تغيير قد يؤثر في عدة جهات داخلية وخارجية.",
    decisionLogic: "كلما زاد وزن الداعمين وقل وزن المعارضين، كان تنفيذ القرار أسهل.",
    categories: ["strategy", "stakeholders", "projects"],
    audiences: ["execs", "managers", "analysts"],
    sections: [
      {
        key: "supporters",
        label: "أصحاب مصلحة داعمون",
        positive: true,
        placeholder: "اكتب الجهات أو الأشخاص الداعمين، مع ملاحظات قصيرة..."
      },
      {
        key: "neutral",
        label: "أصحاب مصلحة محايدون",
        positive: true,
        placeholder: "اكتب الجهات المحايدة وتأثيرها المحتمل..."
      },
      {
        key: "opponents",
        label: "أصحاب مصلحة معارضون",
        positive: false,
        placeholder: "اكتب الجهات أو الأشخاص المعارضين، مع ملاحظات عن سبب المعارضة..."
      }
    ]
  },
  {
    id: "root_cause",
    file: "root_cause.html",
    enabled: true,
    short: "Root Cause",
    name_ar: "تحليل الأسباب الجذرية (5 Whys)",
    name_en: "Root Cause (5 Whys)",
    desc: "أداة لتفكيك المشكلة وطرح \"لماذا؟\" عدة مرات للوصول إلى السبب الجذري.",
    serves: "فرق الجودة، الدعم الفني، قادة الفرق، والطلاب في المشاريع.",
    when: "عند تكرار مشكلة أو فشل إجراء وترغب في معرفة السبب الحقيقي وليس السطحي.",
    decisionLogic: "كلما زادت وضوح الأسباب الجذرية والدروس المستفادة، كان القرار العلاجي أكثر قوة.",
    categories: ["strategy", "risk", "projects"],
    audiences: ["managers", "analysts", "students"],
    sections: [
      {
        key: "problem",
        label: "وصف المشكلة",
        positive: true,
        placeholder: "اكتب وصفاً مختصراً للمشكلة بشكل واضح..."
      },
      {
        key: "why_chain",
        label: "سلسلة لماذا؟ (Why 1 → Why 5)",
        positive: false,
        placeholder: "اكتب تسلسل الإجابات على سؤال لماذا؟ لكل مستوى، كل نقطة في سطر مستقل..."
      },
      {
        key: "actions",
        label: "الإجراءات التصحيحية المقترحة",
        positive: true,
        placeholder: "اكتب الحلول أو الإجراءات المقترحة لمعالجة السبب الجذري..."
      }
    ]
  },

  // ===== 1) مصفوفة القرار متعددة المعايير =====
  {
    id: "decision_matrix",
    file: "decision_matrix.html",
    enabled: true,
    short: "Decision Matrix",
    name_ar: "مصفوفة القرار متعددة المعايير",
    name_en: "Weighted Decision Matrix",
    desc: "مقارنة عدة خيارات وفق مجموعة من المعايير مع أوزان لكل معيار، للوصول إلى قرار أكثر موضوعية.",
    serves: "اللجان، مدراء المشاريع، القياديون، ورواد الأعمال عند الاختيار بين بدائل متعددة.",
    when: "عند المفاضلة بين عروض، مورّدين، حلول تقنية، أو مسارات مختلفة لمشروع واحد.",
    decisionLogic: "كلما زادت الدرجة الموزونة لخيار معيّن مقارنة بباقي الخيارات، كان هو المرشح الأقوى للتنفيذ.",
    categories: ["strategy", "projects", "finance"],
    audiences: ["execs", "managers", "analysts", "entrepreneurs"],
    sections: [
      {
        key: "criteria",
        label: "المعايير (معايير التقييم الأساسية)",
        positive: true,
        placeholder: "اكتب المعايير التي ستقيّم بها الخيارات (التكلفة، الجودة، الزمن، المخاطر، ...)، كل معيار في سطر مستقل..."
      },
      {
        key: "options",
        label: "الخيارات / البدائل",
        positive: true,
        placeholder: "اكتب الخيارات أو البدائل (مثال: عرض الشركة أ، عرض الشركة ب، ...)، كل خيار في سطر مستقل..."
      },
      {
        key: "notes",
        label: "ملاحظات إضافية أو شروط حساسة",
        positive: true,
        placeholder: "اكتب أي شروط أو ملاحظات قد تؤثر في اختيارك النهائي (شروط تعاقدية، مخاوف، استثناءات)..."
      }
    ]
  },

  // ===== 2) تحليل PESTEL =====
  {
    id: "pestel",
    file: "pestel.html",
    enabled: true,
    short: "PESTEL",
    name_ar: "تحليل PESTEL للبيئة الخارجية",
    name_en: "PESTEL Analysis",
    desc: "تحليل البيئة المحيطة بالقرار من الجوانب السياسية والاقتصادية والاجتماعية والتقنية والبيئية والقانونية.",
    serves: "القياديون، المستشارون، رواد الأعمال، والطلاب في مشاريع التخطيط الاستراتيجي.",
    when: "عند دراسة سوق جديد، أو وضع خطة استراتيجية، أو اتخاذ قرار تأثّره بالبيئة الخارجية كبير.",
    decisionLogic: "كلما زادت وضوح العوامل الخارجية وتأثيرها، كان القرار الاستراتيجي أكثر اتزانًا وواقعية.",
    categories: ["strategy", "risk"],
    audiences: ["execs", "analysts", "entrepreneurs", "students"],
    sections: [
      {
        key: "political",
        label: "العوامل السياسية (Political)",
        positive: false,
        placeholder: "اكتب العوامل السياسية المؤثرة (استقرار سياسي، أنظمة حكومية، سياسات ضريبية، ...)"
      },
      {
        key: "economic",
        label: "العوامل الاقتصادية (Economic)",
        positive: false,
        placeholder: "اكتب العوامل الاقتصادية (التضخم، سعر الصرف، القوة الشرائية، النمو الاقتصادي، ...)"
      },
      {
        key: "social",
        label: "العوامل الاجتماعية (Social)",
        positive: false,
        placeholder: "اكتب العوامل الاجتماعية (العادات، التركيبة السكانية، اتجاهات المستهلكين، ...)"
      },
      {
        key: "technological",
        label: "العوامل التقنية (Technological)",
        positive: true,
        placeholder: "اكتب العوامل التقنية (التطور التقني، البنية الرقمية، توفر الحلول التقنية، ...)"
      },
      {
        key: "environmental",
        label: "العوامل البيئية (Environmental)",
        positive: false,
        placeholder: "اكتب العوامل البيئية (التغير المناخي، المتطلبات البيئية، الاستدامة، ...)"
      },
      {
        key: "legal",
        label: "العوامل القانونية (Legal)",
        positive: false,
        placeholder: "اكتب العوامل القانونية والتنظيمية (التشريعات، التراخيص، أنظمة حماية البيانات، ...)"
      }
    ]
  },

  // ===== 3) لوحة نموذج العمل =====
  {
    id: "bmc",
    file: "bmc.html",
    enabled: true,
    short: "BMC",
    name_ar: "لوحة نموذج العمل",
    name_en: "Business Model Canvas",
    desc: "تصميم نموذج عمل الفكرة أو المشروع عبر ٩ مربعات توضح القيمة المقدَّمة، العملاء، القنوات، الموارد، التكاليف، والإيرادات.",
    serves: "رواد الأعمال، القياديون المسؤولون عن وحدات أعمال جديدة، والطلاب في مشاريع ريادة الأعمال.",
    when: "عند تحويل فكرة إلى مشروع، أو إعادة تصميم نموذج عمل قائم، أو عرض الفكرة للمستثمرين.",
    decisionLogic: "كلما كان نموذج العمل متناسقاً بين عناصر القيمة، العملاء، الإيرادات، والتكاليف؛ كان المشروع أكثر قابلية للاستدامة.",
    categories: ["strategy", "projects"],
    audiences: ["entrepreneurs", "execs", "students"],
    sections: [
      {
        key: "value_proposition",
        label: "القيمة المقدَّمة (Value Proposition)",
        positive: true,
        placeholder: "ما القيمة الأساسية التي تقدمها للعملاء؟ ما المشكلة التي تحلها أو الحاجة التي تلبيها؟"
      },
      {
        key: "customer_segments",
        label: "شرائح العملاء (Customer Segments)",
        positive: true,
        placeholder: "من هم العملاء أو المستفيدون الرئيسيون؟ اكتب الشرائح أو الفئات المستهدفة..."
      },
      {
        key: "channels",
        label: "القنوات (Channels)",
        positive: true,
        placeholder: "كيف تصل إلى عملائك؟ قنوات البيع أو التسويق أو التوزيع..."
      },
      {
        key: "customer_relationships",
        label: "علاقات العملاء (Customer Relationships)",
        positive: true,
        placeholder: "كيف تحافظ على علاقتك مع العملاء؟ دعم، اشتراكات، تواصل دوري، مجتمع مستخدمين..."
      },
      {
        key: "revenue_streams",
        label: "مصادر الإيرادات (Revenue Streams)",
        positive: true,
        placeholder: "من أين يأتي الدخل؟ بيع مباشر، اشتراك، عمولة، إعلانات، ... "
      },
      {
        key: "key_activities",
        label: "الأنشطة الرئيسية (Key Activities)",
        positive: true,
        placeholder: "ما أهم الأنشطة التي يجب تنفيذها لتقديم القيمة والمحافظة على نموذج العمل؟"
      },
      {
        key: "key_resources",
        label: "الموارد الرئيسية (Key Resources)",
        positive: true,
        placeholder: "ما أهم الموارد (بشرية، تقنية، مالية، علاقات...) اللازمة لتشغيل النموذج؟"
      },
      {
        key: "key_partners",
        label: "الشركاء الرئيسيون (Key Partners)",
        positive: true,
        placeholder: "من هم الشركاء أو المزودون الرئيسيون الذين يعتمد عليهم نجاح النموذج؟"
      },
      {
        key: "cost_structure",
        label: "هيكل التكاليف (Cost Structure)",
        positive: false,
        placeholder: "ما أبرز عناصر التكاليف في هذا النموذج؟ رواتب، منصات، بنية تحتية، تسويق..."
      }
    ]
  },

  // ===== 4) مصفوفة RACI =====
  {
    id: "raci",
    file: "raci.html",
    enabled: true,
    short: "RACI",
    name_ar: "مصفوفة RACI لتحديد الأدوار",
    name_en: "RACI Matrix",
    desc: "أداة لتحديد من المسؤول عن التنفيذ، ومن يتحمل المسؤولية النهائية، ومن يُستشار، ومن يُبلّغ في كل نشاط.",
    serves: "مدراء المشاريع، القياديون، فرق العمل المشتركة، والمستشارون في إعادة تنظيم الأدوار.",
    when: "عند وجود التباس في الأدوار، أو بداية مشروع جديد، أو إعادة هيكلة فريق أو عملية.",
    decisionLogic: "وضوح الأدوار يقلل التداخل والمساءلة غير العادلة، ويسرّع تنفيذ القرارات والمشاريع.",
    categories: ["projects", "stakeholders"],
    audiences: ["managers", "execs", "analysts"],
    sections: [
      {
        key: "responsible",
        label: "R — Responsible (المنفِّذون)",
        positive: true,
        placeholder: "اكتب الأشخاص أو الجهات المسؤولة عن التنفيذ المباشر لكل مهمة أو نشاط..."
      },
      {
        key: "accountable",
        label: "A — Accountable (المسؤول النهائي)",
        positive: true,
        placeholder: "اكتب الشخص أو الجهة التي تتحمل المسؤولية النهائية عن نجاح أو فشل المهمة..."
      },
      {
        key: "consulted",
        label: "C — Consulted (مَن يُستشار)",
        positive: true,
        placeholder: "اكتب الأشخاص أو الجهات التي يجب استشارتها قبل اتخاذ القرار في المهمة..."
      },
      {
        key: "informed",
        label: "I — Informed (مَن يجب إبلاغه)",
        positive: true,
        placeholder: "اكتب الجهات أو الأفراد الذين يجب إبلاغهم بالتقدم أو النتائج، حتى لو لم يشاركوا في التنفيذ..."
      }
    ]
  }
];
