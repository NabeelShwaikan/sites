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
  desc: "مساعدة المستخدم على صياغة هدف واحد واضح ومحدد وقابل للقياس وقابل للتحقيق ومرتبط بالأولويات ومحدد بزمن، مع خطوات عملية للتنفيذ.",
  serves: "الطلاب، الموظفون، القياديون، روّاد الأعمال، وكل من يريد ضبط أهدافه الشخصية أو المهنية.",
  when: "عند تحويل فكرة عامة (مثل: تحسين الصحة، تطوير المشروع، رفع المبيعات) إلى هدف واضح يمكن متابعته وتنفيذه.",
  decisionLogic: "كلما كانت عناصر SMART قوية (تحديد واضح، قياس واضح، واقعية، صلة، وإطار زمني محدد) مع عوائق معروفة وخطوات عملية، كانت فرصة تحقيق الهدف أعلى.",
  categories: ["strategy", "personal", "projects"],
  audiences: ["individuals", "students", "execs", "entrepreneurs", "managers"],
  sections: [
    {
      key: "goal_title",
      label: "عنوان الهدف الرئيسي",
      positive: true,
      placeholder: "اكتب هدفًا واحدًا وواضحًا (مثال: رفع مبيعات المتجر الإلكتروني بنسبة ٢٠٪ خلال سنة)..."
    },
    {
      key: "goal_why",
      label: "لماذا هذا الهدف مهم؟",
      positive: true,
      placeholder: "ما الأسباب التي تدفعك لتحقيق هذا الهدف؟ ماذا سيضيف لك أو لفريقك أو لمؤسستك؟"
    },
    {
      key: "specific",
      label: "S — محدد (Specific)",
      positive: true,
      placeholder: "عرّف الهدف بدقة: ماذا ستفعل؟ لمن؟ في أي مجال/منتج/فريق؟ وما الحدود التي لن تتعداها؟"
    },
    {
      key: "measurable",
      label: "M — قابل للقياس (Measurable)",
      positive: true,
      placeholder: "ما المؤشرات الرقمية أو الواضحة لقياس التقدم؟ (نسب، أعداد، مواعيد تسليم، درجات... إلخ)"
    },
    {
      key: "achievable",
      label: "A — قابل للتحقيق (Achievable)",
      positive: true,
      placeholder: "ما الموارد المتاحة (وقت، ميزانية، أشخاص، أدوات) التي تجعل الهدف ممكنًا؟ وما الذي قد تحتاج إضافته؟"
    },
    {
      key: "relevant",
      label: "R — ذو صلة (Relevant)",
      positive: true,
      placeholder: "كيف يرتبط الهدف برؤيتك الشخصية أو خطة القسم/المؤسسة؟ ولماذا هو أهم من أهداف أخرى الآن؟"
    },
    {
      key: "time_bound",
      label: "T — محدد بزمن (Time-bound)",
      positive: true,
      placeholder: "ما الموعد النهائي للهدف؟ وهل هناك مراحل/محطات زمنية رئيسية (شهريًا، ربع سنويًا...)؟"
    },
    {
      key: "obstacles",
      label: "العوائق والمخاطر المحتملة",
      positive: false,
      placeholder: "ما أهم العوائق التي قد تمنعك من تحقيق الهدف؟ (الوقت، الدعم الإداري، التمويل، الانضباط الشخصي...)"
    },
    {
      key: "next_actions",
      label: "أقرب 3–5 خطوات عملية",
      positive: true,
      placeholder: "اكتب أقرب خطوات ستقوم بها في الأيام/الأسابيع القادمة لبدء تنفيذ الهدف (كل خطوة في سطر مستقل)..."
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

  // ===== 2.5) مصفوفة BCG =====
  {
    id: "bcg",
    file: "bcg.html",
    enabled: true,
    short: "BCG",
    name_ar: "مصفوفة BCG للمنتجات",
    name_en: "BCG Growth–Share Matrix",
    desc: "تحليل محفظة المنتجات أو الوحدات وفق حصة السوق ومعدل النمو: نجوم، المنتجات المدرة، علامات استفهام، والمنتجات الضعيفة الأداء.",
    serves: "مدراء المنتجات، القياديون، فرق التخطيط الاستراتيجي، وروّاد الأعمال.",
    when: "عند تقييم خطوط المنتجات الحالية، أو إعادة توزيع الاستثمارات بين وحدات الأعمال.",
    decisionLogic: "تركيز الاستثمارات على النجوم وعلامات الاستفهام الواعدة، والحفاظ على الأبقار الحلوب، والتخارج من الوحدات الضعيفة.",
    categories: ["strategy", "projects", "finance"],
    audiences: ["execs", "managers", "entrepreneurs", "analysts", "students"],
    sections: [
      {
        key: "stars",
        label: "النجوم (Stars)",
        positive: true,
        placeholder: "منتجات أو وحدات ذات نمو مرتفع وحصة سوقية قوية، تحتاج دعماً للاستمرار..."
      },
      {
        key: "cash_cows",
        label: "المنتجات المدرة (Cash Cows)",
        positive: true,
        placeholder: "منتجات مستقرة بحصة سوقية قوية في سوق نموه منخفض، غالباً مصدر السيولة الأساسي..."
      },
      {
        key: "question_marks",
        label: "علامات استفهام (Question Marks)",
        positive: false,
        placeholder: "منتجات في أسواق نامية لكن حصتها ضعيفة حالياً، تحتاج قرار: استثمار أم تخارج..."
      },
      {
        key: "dogs",
        label: "المنتجات الضعيفة الأداء (Dogs)",
        positive: false,
        placeholder: "منتجات ضعيفة النمو والحصة، غالباً مرشحة للإيقاف أو التخارج..."
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
  },
  
  // ===== نماذج إضافية: 19 نموذج جديد =====

  // 1) مصفوفة أنسوف للنمو
  {
    id: "ansoff",
    file: "ansoff.html",
    enabled: true,
    short: "Ansoff",
    name_ar: "مصفوفة أنسوف للنمو",
    name_en: "Ansoff Growth Matrix",
    desc: "تساعدك على تحديد اتجاهات نمو المشروع: اختراق السوق، تطوير السوق، تطوير المنتج، أو التنويع.",
    serves: "القياديون، رواد الأعمال، فرق التخطيط الاستراتيجي.",
    when: "عند البحث عن مسار نمو جديد لمنتج أو نشاط قائم.",
    decisionLogic: "كل خيار نمو يحمل مستوى مختلف من المخاطرة، وكلما زادت المخاطر يجب أن يكون العائد المتوقع أعلى.",
    categories: ["strategy", "projects", "risk"],
    audiences: ["execs", "entrepreneurs", "analysts", "students"],
    sections: [
      {
        key: "market_penetration",
        label: "اختراق السوق الحالي",
        positive: true,
        placeholder: "أفكار لتعميق الحصة في السوق الحالي بنفس المنتجات..."
      },
      {
        key: "product_development",
        label: "تطوير منتجات جديدة للسوق الحالي",
        positive: true,
        placeholder: "منتجات أو خدمات جديدة لنفس نوع العملاء..."
      },
      {
        key: "market_development",
        label: "تطوير أسواق جديدة",
        positive: true,
        placeholder: "الأسواق أو الشرائح الجديدة التي يمكن استهدافها بالمنتجات الحالية..."
      },
      {
        key: "diversification",
        label: "التنويع",
        positive: false,
        placeholder: "أفكار الدخول في منتجات / أسواق جديدة تماماً، مع مستوى المخاطرة..."
      }
    ]
  },

  // 2) قوى بورتر الخمس
  {
    id: "porter5",
    file: "porter5.html",
    enabled: true,
    short: "Porter 5",
    name_ar: "قوى بورتر الخمس",
    name_en: "Porter’s Five Forces",
    desc: "تحليل تنافسية السوق عبر خمس قوى: المنافسون، الداخلون الجدد، البدائل، قوة الموردين، وقوة العملاء.",
    serves: "المحللون الاستراتيجيون، القياديون، رواد الأعمال.",
    when: "عند تقييم جذابية قطاع أو سوق قبل الدخول أو التوسع.",
    decisionLogic: "كلما كانت القوى التنافسية أشد، قلت جاذبية السوق وزادت صعوبة تحقيق أرباح مستدامة.",
    categories: ["strategy", "risk"],
    audiences: ["execs", "analysts", "entrepreneurs", "students"],
    sections: [
      {
        key: "competitors",
        label: "حدة المنافسة بين اللاعبين الحاليين",
        positive: false,
        placeholder: "من هم المنافسون المباشرون؟ ما مستوى شدة المنافسة؟"
      },
      {
        key: "new_entrants",
        label: "تهديد الداخلين الجدد",
        positive: false,
        placeholder: "ما مدى سهولة دخول لاعبين جدد إلى السوق؟"
      },
      {
        key: "substitutes",
        label: "تهديد المنتجات البديلة",
        positive: false,
        placeholder: "ما البدائل الأخرى التي يمكن أن تحل محل منتجك؟"
      },
      {
        key: "suppliers",
        label: "قوة الموردين",
        positive: false,
        placeholder: "عدد الموردين، سهولة استبدالهم، قدرتهم على رفع الأسعار..."
      },
      {
        key: "buyers",
        label: "قوة العملاء",
        positive: false,
        placeholder: "مدى حساسية العملاء للسعر، قدرتهم على التفاوض، توفر البدائل..."
      }
    ]
  },

  // 3) تحليل سلسلة القيمة
  {
    id: "value_chain",
    file: "value_chain.html",
    enabled: true,
    short: "Value Chain",
    name_ar: "تحليل سلسلة القيمة",
    name_en: "Value Chain Analysis",
    desc: "تفكيك الأنشطة الرئيسية والداعمة في المنظمة لمعرفة أين تُخلق القيمة وأين تُهدر.",
    serves: "القياديون، مدراء العمليات، المستشارون.",
    when: "عند البحث عن فرص تحسين أو خفض تكاليف دون الإضرار بالقيمة المقدمة.",
    decisionLogic: "التركيز على الأنشطة ذات القيمة العالية وتقليل الأنشطة التي لا تضيف قيمة حقيقية.",
    categories: ["strategy", "projects", "finance"],
    audiences: ["execs", "managers", "analysts"],
    sections: [
      {
        key: "primary_activities",
        label: "الأنشطة الأساسية",
        positive: true,
        placeholder: "مثل: الخدمات، العمليات، التوزيع، التسويق والبيع، خدمة ما بعد البيع..."
      },
      {
        key: "support_activities",
        label: "الأنشطة الداعمة",
        positive: true,
        placeholder: "مثل: الموارد البشرية، التقنية، المشتريات، البنية التحتية الإدارية..."
      },
      {
        key: "improvements",
        label: "فرص التحسين في سلسلة القيمة",
        positive: true,
        placeholder: "أين يمكن تقليل التكاليف أو زيادة القيمة بشكل ملحوظ؟"
      }
    ]
  },

  // 4) مصفوفة GE–McKinsey
  {
    id: "ge_mckinsey",
    file: "ge_mckinsey.html",
    enabled: true,
    short: "GE Matrix",
    name_ar: "مصفوفة GE–McKinsey",
    name_en: "GE–McKinsey Matrix",
    desc: "تحليل محفظة الأعمال حسب جاذبية السوق وقوة وحدة الأعمال، لتحديد أين تُستثمر الموارد.",
    serves: "الشركات متعددة الوحدات، القياديون في التخطيط الاستراتيجي.",
    when: "عند إعادة توزيع الاستثمارات بين أنشطة أو وحدات أعمال متعددة.",
    decisionLogic: "الوحدات ذات الجاذبية العالية والقوة العالية تستحق الاستثمار الأكبر، والعكس بالعكس.",
    categories: ["strategy", "projects", "finance"],
    audiences: ["execs", "analysts"],
    sections: [
      {
        key: "strong_units",
        label: "وحدات قوية في أسواق جذابة",
        positive: true,
        placeholder: "وحدات تستحق استثماراً أكبر وتنمية إضافية..."
      },
      {
        key: "selective_units",
        label: "وحدات تحتاج انتقائية",
        positive: false,
        placeholder: "وحدات متوسطة الجاذبية أو القوة، تتطلب حذرًا في الاستثمار..."
      },
      {
        key: "weak_units",
        label: "وحدات ضعيفة في أسواق أقل جاذبية",
        positive: false,
        placeholder: "وحدات مرشحة للتقليص أو التخارج..."
      }
    ]
  },

  // 5) تحليل فجوة الأداء (GAP Analysis)
  {
    id: "gap",
    file: "gap.html",
    enabled: true,
    short: "GAP",
    name_ar: "تحليل فجوة الأداء",
    name_en: "GAP Analysis",
    desc: "مقارنة الوضع الحالي بالمستهدف لتحديد الفجوات وخطط الإغلاق.",
    serves: "الإدارات التشغيلية، الجودة، التخطيط.",
    when: "عند وضع خطة تطوير أو قياس تحقق الأهداف.",
    decisionLogic: "كلما كانت الفجوة كبيرة مع أهمية الهدف، زادت أولوية المعالجة.",
    categories: ["strategy", "projects", "personal"],
    audiences: ["managers", "execs", "students", "individuals"],
    sections: [
      {
        key: "current_state",
        label: "الوضع الحالي",
        positive: false,
        placeholder: "وصف مختصر ومقاييس للوضع الحالي..."
      },
      {
        key: "target_state",
        label: "الوضع المستهدف",
        positive: true,
        placeholder: "ما الصورة المثالية أو الهدف العددي أو الوصفي المطلوب؟"
      },
      {
        key: "gaps",
        label: "الفجوات",
        positive: false,
        placeholder: "ما الفارق بين الحالي والمستهدف من حيث الأرقام أو السلوك أو الأنظمة؟"
      },
      {
        key: "actions",
        label: "خطة إغلاق الفجوة",
        positive: true,
        placeholder: "إجراءات محددة لتقليل الفجوة أو إغلاقها، مع أولويات زمنية..."
      }
    ]
  },

  // 6) مبدأ باريتو 20/80
  {
    id: "pareto",
    file: "pareto.html",
    enabled: true,
    short: "Pareto 80/20",
    name_ar: "تحليل باريتو 20/80",
    name_en: "Pareto Analysis",
    desc: "تحديد القلة المؤثرة (20٪) التي تسبب أغلب النتائج (80٪) إيجابية كانت أو سلبية.",
    serves: "مدراء الجودة، خدمة العملاء، القياديون في التحسين المستمر.",
    when: "عند كثرة الأسباب أو المشكلات وترغب في التركيز على الأكثر تأثيراً.",
    decisionLogic: "التركيز على الأسباب أو العملاء أو المنتجات ذات التأثير الأكبر يعطي عائدًا أعلى على الجهد.",
    categories: ["strategy", "projects", "personal"],
    audiences: ["managers", "analysts", "execs", "individuals"],
    sections: [
      {
        key: "items",
        label: "العناصر أو الأسباب",
        positive: false,
        placeholder: "اكتب المشكلات، الأسباب، أو العناصر المراد تحليلها (كل عنصر في سطر)..."
      },
      {
        key: "top_focus",
        label: "العناصر ذات الأولوية القصوى",
        positive: true,
        placeholder: "بعد التحليل، ما العناصر القليلة التي يجب أن تركز عليها أولاً؟"
      }
    ]
  },

  // 7) خريطة رحلة العميل
  {
    id: "customer_journey",
    file: "customer_journey.html",
    enabled: true,
    short: "Journey",
    name_ar: "خريطة رحلة العميل",
    name_en: "Customer Journey Map",
    desc: "تصوير مراحل رحلة العميل من الوعي حتى الولاء، مع نقاط الاحتكاك والمشاعر.",
    serves: "التسويق، تجربة العميل، رواد الأعمال.",
    when: "عند تحسين تجربة العميل أو إطلاق منتج/خدمة جديدة.",
    decisionLogic: "تحسين اللحظات الحرجة في الرحلة يزيد رضا العملاء واحتمالية عودتهم.",
    categories: ["strategy", "projects"],
    audiences: ["entrepreneurs", "execs", "managers", "analysts"],
    sections: [
      {
        key: "stages",
        label: "مراحل الرحلة",
        positive: true,
        placeholder: "مثل: الوعي، البحث، الشراء، الاستخدام، ما بعد البيع..."
      },
      {
        key: "touchpoints",
        label: "نقاط الاحتكاك",
        positive: true,
        placeholder: "أين يلتقي العميل بالمنظمة (موقع، تطبيق، فرع، دعم فني، ...)..."
      },
      {
        key: "pain_points",
        label: "نقاط الألم والتحسين",
        positive: false,
        placeholder: "المشكلات أو الإحباطات التي يواجهها العميل في كل مرحلة..."
      }
    ]
  },

  // 8) نموذج Kano لرضا العملاء
  {
    id: "kano",
    file: "kano.html",
    enabled: true,
    short: "Kano",
    name_ar: "تحليل Kano لرضا العملاء",
    name_en: "Kano Model",
    desc: "تصنيف خصائص المنتج إلى أساسية، متوقعة، ومبهرة، وتأثير كل منها على رضا العميل.",
    serves: "فرق المنتج، التسويق، رواد الأعمال.",
    when: "عند تحديد أولويات خصائص منتج أو خدمة جديدة.",
    decisionLogic: "الخصائص الأساسية يجب ألا تُهمل، والمتوقعة تحسّن الرضا، والمبهرة تصنع الفارق التنافسي.",
    categories: ["strategy", "projects"],
    audiences: ["entrepreneurs", "execs", "managers", "analysts"],
    sections: [
      {
        key: "must_be",
        label: "الخصائص الأساسية (Must-be)",
        positive: true,
        placeholder: "خصائص إن غابت انخفض الرضا بشدة، حتى لو توفرت مزايا أخرى..."
      },
      {
        key: "one_dimensional",
        label: "الخصائص المتوقعة (Performance)",
        positive: true,
        placeholder: "كلما زادت جودتها زاد رضا العميل بشكل مباشر..."
      },
      {
        key: "delighters",
        label: "الخصائص المبهرة (Delighters)",
        positive: true,
        placeholder: "مزايا غير متوقعة تثير الإعجاب وتزيد الولاء..."
      }
    ]
  },

  // 9) مصفوفة القوة-الاهتمام لأصحاب المصلحة
  {
    id: "power_interest",
    file: "power_interest.html",
    enabled: true,
    short: "Power–Interest",
    name_ar: "مصفوفة قوة–اهتمام لأصحاب المصلحة",
    name_en: "Power–Interest Matrix",
    desc: "تصنيف أصحاب المصلحة حسب قوة تأثيرهم ودرجة اهتمامهم بالمشروع.",
    serves: "مدراء المشاريع، القياديون، فرق التغيير.",
    when: "عند تصميم خطة تواصل أو إدارة تغيير مؤثر على أطراف متعددة.",
    decisionLogic: "أصحاب المصلحة ذوو القوة والاهتمام العاليين يحتاجون متابعة وثيقة وإشراكاً مستمراً.",
    categories: ["stakeholders", "projects", "strategy"],
    audiences: ["managers", "execs", "analysts"],
    sections: [
      {
        key: "high_power_high_interest",
        label: "قوة عالية – اهتمام عالٍ",
        positive: true,
        placeholder: "أطراف يجب إشراكهم عن قرب وإدارة العلاقة معهم بحساسية..."
      },
      {
        key: "high_power_low_interest",
        label: "قوة عالية – اهتمام منخفض",
        positive: false,
        placeholder: "أطراف يجب إرضاؤهم ومراعاة مواقفهم حتى إن لم يهتموا بالتفاصيل..."
      },
      {
        key: "low_power_high_interest",
        label: "قوة منخفضة – اهتمام عالٍ",
        positive: true,
        placeholder: "يُستفاد منهم في الدعم والترويج، حتى لو كانت قوتهم الرسمية محدودة..."
      },
      {
        key: "low_power_low_interest",
        label: "قوة منخفضة – اهتمام منخفض",
        positive: false,
        placeholder: "أطراف يُكتفى بمشاركتهم بالمعلومات الأساسية عند الحاجة..."
      }
    ]
  },

  // 10) دورة حياة المنتج
  {
    id: "product_lifecycle",
    file: "product_lifecycle.html",
    enabled: true,
    short: "Product Life Cycle",
    name_ar: "تحليل دورة حياة المنتج",
    name_en: "Product Life Cycle",
    desc: "تحديد المرحلة التي يمر بها المنتج: مقدمة، نمو، نضج، انحدار، وتأثير ذلك على القرارات.",
    serves: "مدراء المنتجات، التسويق، رواد الأعمال.",
    when: "عند مراجعة استراتيجية التسعير، التسويق، أو الاستثمار في منتج.",
    decisionLogic: "كل مرحلة تتطلب قرارات مختلفة في التسويق والتطوير والاستثمار.",
    categories: ["strategy", "projects", "finance"],
    audiences: ["managers", "entrepreneurs", "execs", "analysts"],
    sections: [
      {
        key: "intro",
        label: "مرحلة المقدمة",
        positive: false,
        placeholder: "خصائص المرحلة، مستوى المبيعات، الاستثمارات التسويقية..."
      },
      {
        key: "growth",
        label: "مرحلة النمو",
        positive: true,
        placeholder: "دلائل نمو الطلب، توسع الحصة السوقية، الفرص المصاحبة..."
      },
      {
        key: "maturity",
        label: "مرحلة النضج",
        positive: true,
        placeholder: "استقرار المبيعات، شدة المنافسة، استراتيجيات الحفاظ على الحصة..."
      },
      {
        key: "decline",
        label: "مرحلة الانحدار",
        positive: false,
        placeholder: "مؤشرات التراجع، البدائل في السوق، خيارات الإيقاف أو التجديد..."
      }
    ]
  },

  // 11) تحليل SOAR الإيجابي
  {
    id: "soar",
    file: "soar.html",
    enabled: true,
    short: "SOAR",
    name_ar: "تحليل SOAR الإيجابي",
    name_en: "SOAR Analysis",
    desc: "بديل إيجابي لـ SWOT يركز على نقاط القوة والفرص والطموحات والنتائج.",
    serves: "فرق التطوير، القياديون، المستشارون.",
    when: "عند بناء رؤية مستقبلية إيجابية لفريق أو مشروع.",
    decisionLogic: "تركيز النقاش حول ما نمتلكه من قوة وما نطمح إليه بدلاً من التركيز على التهديدات فقط.",
    categories: ["strategy", "projects"],
    audiences: ["execs", "managers", "students", "analysts"],
    sections: [
      {
        key: "strengths",
        label: "Strengths — نقاط القوة",
        positive: true,
        placeholder: "ما الذي نقوم به بشكل ممتاز حالياً؟"
      },
      {
        key: "opportunities",
        label: "Opportunities — الفرص",
        positive: true,
        placeholder: "ما الفرص الخارجية أو الداخلية المتاحة لنا؟"
      },
      {
        key: "aspirations",
        label: "Aspirations — الطموحات",
        positive: true,
        placeholder: "كيف نتصور المستقبل؟ ماذا نريد أن نصبح؟"
      },
      {
        key: "results",
        label: "Results — النتائج",
        positive: true,
        placeholder: "ما النتائج القابلة للقياس التي نطمح لتحقيقها؟"
      }
    ]
  },

  // 12) تحليل VRIO للموارد
  {
    id: "vrio",
    file: "vrio.html",
    enabled: true,
    short: "VRIO",
    name_ar: "تحليل VRIO للموارد",
    name_en: "VRIO Analysis",
    desc: "فحص الموارد والقدرات من حيث القيمة والندرة وصعوبة التقليد والتنظيم، لتحديد المزايا التنافسية.",
    serves: "القياديون، المستشارون الاستراتيجيون.",
    when: "عند البحث عن مصادر الميزة التنافسية الحقيقية في المنظمة.",
    decisionLogic: "المورد الذي يحقق معايير VRIO يمكن أن يكون أساسًا لميزة تنافسية مستدامة.",
    categories: ["strategy", "projects"],
    audiences: ["execs", "analysts", "entrepreneurs"],
    sections: [
      {
        key: "resources",
        label: "الموارد / القدرات المستهدفة",
        positive: true,
        placeholder: "اكتب الموارد أو القدرات التي تريد تقييمها (كل مورد في سطر)..."
      },
      {
        key: "notes",
        label: "ملاحظات حول القيمة والندرة وصعوبة التقليد والتنظيم",
        positive: true,
        placeholder: "استنتاجاتك حول أي الموارد يمكن أن تمثل ميزة تنافسية حقيقية..."
      }
    ]
  },

  // 13) بطاقة الأداء المتوازن
  {
    id: "bsc",
    file: "balanced_scorecard.html",
    enabled: true,
    short: "BSC",
    name_ar: "بطاقة الأداء المتوازن",
    name_en: "Balanced Scorecard",
    desc: "ربط الأهداف بمؤشرات أداء من أربعة أبعاد: المالي، العملاء، العمليات الداخلية، التعلم والنمو.",
    serves: "القياديون، مدراء الوحدات، فرق التخطيط.",
    when: "عند ترجمة الاستراتيجية إلى أهداف ومؤشرات قابلة للمتابعة.",
    decisionLogic: "التوازن بين الأبعاد الأربعة يمنع التركيز المفرط على جانب وإهمال الجوانب الأخرى.",
    categories: ["strategy", "projects", "finance"],
    audiences: ["execs", "managers", "analysts"],
    sections: [
      {
        key: "financial",
        label: "المنظور المالي",
        positive: true,
        placeholder: "أهداف ومؤشرات مالية (إيرادات، ربحية، تكلفة، ...)..."
      },
      {
        key: "customers",
        label: "منظور العملاء",
        positive: true,
        placeholder: "أهداف مرتبطة برضا وولاء العملاء، الحصة السوقية..."
      },
      {
        key: "processes",
        label: "العمليات الداخلية",
        positive: true,
        placeholder: "أهداف تحسّن جودة وكفاءة العمليات..."
      },
      {
        key: "learning",
        label: "التعلم والنمو",
        positive: true,
        placeholder: "أهداف تتعلق بالمهارات، الثقافة، الابتكار، الأنظمة..."
      }
    ]
  },

  // 14) نموذج McKinsey 7S
  {
    id: "mckinsey_7s",
    file: "mckinsey_7s.html",
    enabled: true,
    short: "7S",
    name_ar: "نموذج McKinsey 7S",
    name_en: "McKinsey 7S",
    desc: "تحليل توافق سبعة عناصر داخلية: الاستراتيجية، الهيكل، الأنظمة، القيم، المهارات، الأسلوب، الأفراد.",
    serves: "القياديون، فرق التحول المؤسسي.",
    when: "عند تنفيذ تغيير مؤسسي أو مراجعة ملاءمة البنية الداخلية للاستراتيجية.",
    decisionLogic: "كلما زادت درجة الاتساق بين العناصر السبع، ارتفعت فرص نجاح التغيير.",
    categories: ["strategy", "projects"],
    audiences: ["execs", "managers", "analysts"],
    sections: [
      {
        key: "strategy",
        label: "Strategy — الاستراتيجية",
        positive: true,
        placeholder: "ما هي الاستراتيجية الحالية؟ وهل هي واضحة ومفهومة؟"
      },
      {
        key: "structure",
        label: "Structure — الهيكل",
        positive: true,
        placeholder: "كيف هو الهيكل التنظيمي؟ هل يدعم تنفيذ الاستراتيجية؟"
      },
      {
        key: "systems",
        label: "Systems — الأنظمة",
        positive: true,
        placeholder: "ما الأنظمة والإجراءات القائمة؟ وهل هي فعّالة؟"
      },
      {
        key: "shared_values",
        label: "Shared Values — القيم المشتركة",
        positive: true,
        placeholder: "ما القيم الجوهرية التي توحد أفراد المنظمة؟"
      },
      {
        key: "style_staff_skills",
        label: "Style, Staff, Skills — الأسلوب، الأفراد، المهارات",
        positive: true,
        placeholder: "ملاحظات حول أسلوب القيادة، كفاءة الأفراد، المهارات الحرجة المتوفرة أو المفقودة..."
      }
    ]
  },

  // 15) مصفوفة الجهد مقابل الأثر
  {
    id: "impact_effort",
    file: "impact_effort.html",
    enabled: true,
    short: "Impact–Effort",
    name_ar: "مصفوفة الجهد مقابل الأثر",
    name_en: "Impact–Effort Matrix",
    desc: "تصنيف الأفكار أو المبادرات حسب حجم الجهد المطلوب مقابل الأثر المتوقَّع.",
    serves: "فرق التحسين، مدراء المشاريع، رواد الأعمال.",
    when: "عند ترتيب مبادرات متعددة وتحديد ما يُنفّذ أولاً.",
    decisionLogic: "المبادرات ذات الأثر العالي والجهد المنخفض هي أسرع المكاسب التي تستحق البدء بها.",
    categories: ["projects", "strategy", "personal"],
    audiences: ["managers", "execs", "entrepreneurs", "individuals"],
    sections: [
      {
        key: "quick_wins",
        label: "أثر عالٍ – جهد منخفض (Quick Wins)",
        positive: true,
        placeholder: "أفكار أو مبادرات سهلة نسبيًا وتحدث فرقًا واضحًا..."
      },
      {
        key: "major_projects",
        label: "أثر عالٍ – جهد عالٍ",
        positive: true,
        placeholder: "مشاريع استراتيجية تحتاج تخطيطًا وموارد أكبر..."
      },
      {
        key: "fill_ins",
        label: "أثر منخفض – جهد منخفض",
        positive: false,
        placeholder: "أعمال يمكن تنفيذها إن توفّر وقت إضافي..."
      },
      {
        key: "time_wasters",
        label: "أثر منخفض – جهد عالٍ",
        positive: false,
        placeholder: "مبادرات لا تستحق الاستثمار حاليًا..."
      }
    ]
  },

  // 16) تحليل الاستجابة للمخاطر
  {
    id: "risk_response",
    file: "risk_response.html",
    enabled: true,
    short: "Risk Response",
    name_ar: "مصفوفة استجابة المخاطر",
    name_en: "Risk Response Matrix",
    desc: "تصنيف المخاطر وتحديد نوع الاستجابة: تجنّب، تخفيف، نقل، قبول.",
    serves: "مدراء المشاريع، الأمن السيبراني، إدارة المخاطر.",
    when: "بعد إعداد سجل للمخاطر وتريد تحديد خطة التعامل مع كل خطر.",
    decisionLogic: "وضوح نوع الاستجابة لكل خطر يساعد في تحويل التحليل إلى خطة فعلية.",
    categories: ["risk", "projects", "strategy"],
    audiences: ["managers", "analysts", "execs"],
    sections: [
      {
        key: "avoid",
        label: "مخاطر تُتجنَّب (Avoid)",
        positive: false,
        placeholder: "مخاطر تستدعي تغيير الخطة أو إيقاف النشاط لتجنبها..."
      },
      {
        key: "mitigate",
        label: "مخاطر تُخفَّف (Mitigate)",
        positive: true,
        placeholder: "مخاطر يمكن تقليل احتمالها أو أثرها عبر ضوابط وإجراءات..."
      },
      {
        key: "transfer",
        label: "مخاطر تُنقل (Transfer)",
        positive: true,
        placeholder: "مخاطر يمكن نقلها لطرف ثالث (تأمين، تعهيد، عقد...)"
      },
      {
        key: "accept",
        label: "مخاطر تُقبَل (Accept)",
        positive: false,
        placeholder: "مخاطر منخفضة تقرر قبولها مع مراقبتها فقط..."
      }
    ]
  },

  // 17) تحليل الأزمات والسيناريوهات
  {
    id: "crisis",
    file: "crisis.html",
    enabled: true,
    short: "Crisis",
    name_ar: "تحليل الأزمات والسيناريوهات",
    name_en: "Crisis & Scenario Analysis",
    desc: "تصور سيناريوهات سلبية محتملة وخطط الاستجابة لكل منها.",
    serves: "القياديون، فرق الطوارئ، الأمن السيبراني.",
    when: "عند الاستعداد لأزمات محتملة (تقنية، تشغيلية، إعلامية...).",
    decisionLogic: "وجود سيناريوهات واضحة وخطط استجابة يقلل أثر الأزمة عند وقوعها.",
    categories: ["risk", "strategy", "projects"],
    audiences: ["execs", "managers", "analysts"],
    sections: [
      {
        key: "scenarios",
        label: "السيناريوهات المحتملة",
        positive: false,
        placeholder: "اكتب أسوأ السيناريوهات المتوقعة، كل سيناريو في سطر..."
      },
      {
        key: "responses",
        label: "خطط الاستجابة",
        positive: true,
        placeholder: "ما الإجراءات التي ستتخذ في كل سيناريو؟ من المسؤول؟"
      },
      {
        key: "lessons",
        label: "دروس واستعدادات",
        positive: true,
        placeholder: "ما الذي يجب تجهيزه مسبقاً لتقليل أثر الأزمات؟"
      }
    ]
  },

  // 18) عجلة الحياة (للأهداف الشخصية)
  {
    id: "life_wheel",
    file: "life_wheel.html",
    enabled: true,
    short: "Life Wheel",
    name_ar: "عجلة الحياة",
    name_en: "Wheel of Life",
    desc: "تقييم درجة الرضا في مجالات حياتك المختلفة لتحديد مجالات التركيز.",
    serves: "الأفراد، المدربون الشخصيون، الطلاب.",
    when: "عند مراجعة توازن حياتك بين العمل، الأسرة، الصحة، المال، التطوير الشخصي...",
    decisionLogic: "المجالات ذات الرضا المنخفض والأهمية العالية تحتاج خطط تحسين واضحة.",
    categories: ["personal"],
    audiences: ["individuals", "students"],
    sections: [
      {
        key: "areas",
        label: "مجالات الحياة",
        positive: true,
        placeholder: "اكتب المجالات التي تريد تقييمها (الأسرة، العمل، الصحة، الدين، العلاقات، ...)..."
      },
      {
        key: "focus",
        label: "مجالات التركيز القادمة",
        positive: true,
        placeholder: "بناءً على تقييمك، ما المجالات التي تحتاج خطة عمل في الفترة القادمة؟"
      }
    ]
  },

  // 19) نموذج تسجيل الأولويات (Scoring Model)
  {
    id: "priority_scoring",
    file: "priority_scoring.html",
    enabled: true,
    short: "Priority Score",
    name_ar: "نموذج تسجيل الأولويات",
    name_en: "Priority Scoring Model",
    desc: "تقييم المبادرات بدرجات حسب الأثر والسرعة والمواءمة الاستراتيجية لتحديد ما يُنفّذ أولاً.",
    serves: "اللجان، مدراء المحافظ والمشاريع.",
    when: "عند وجود قائمة طويلة من المبادرات وتحتاج لترتيبها رقمياً.",
    decisionLogic: "ارتفاع مجموع درجات المبادرة مقارنة بغيرها يعني أولوية أعلى للتنفيذ.",
    categories: ["projects", "strategy", "finance"],
    audiences: ["execs", "managers", "analysts"],
    sections: [
      {
        key: "initiatives",
        label: "المبادرات / المشاريع",
        positive: true,
        placeholder: "اكتب قائمة بالمبادرات أو المشاريع المراد تقييمها..."
      },
      {
        key: "notes",
        label: "ملاحظات حول الأثر والمواءمة والموارد",
        positive: true,
        placeholder: "ملاحظات تساعد لاحقاً عند إدخال الأوزان والأرقام لكل مبادرة..."
      }
    ]
  },
  {
    id: "okr",
    file: "okr.html",
    enabled: true,
    short: "OKR",
    name_ar: "أهداف ونتائج رئيسية (OKR)",
    name_en: "Objectives & Key Results (OKR)",
    desc: "نموذج لتحديد أهداف طموحة وربطها بنتائج رئيسية قابلة للقياس، يساعد على التركيز ومواءمة الجهود.",
    serves: "القياديون، مدراء الفرق، رواد الأعمال، والطلاب في المشاريع.",
    when: "عند بداية ربع/سنة جديدة، أو عند إطلاق مبادرة وتريد أهدافًا واضحة يمكن قياسها.",
    decisionLogic: "كلما كانت النتائج الرئيسية محددة وقابلة للقياس، أصبح تقييم التقدم أسهل واتخاذ القرارات التصحيحية أدق.",
    categories: ["strategy", "projects", "personal"],
    audiences: ["execs", "managers", "entrepreneurs", "students", "individuals"],
    sections: [
      {
        key: "objective",
        label: "الهدف الرئيسي (Objective)",
        positive: true,
        placeholder: "اكتب هدفًا واحدًا واضحًا وطموحًا يصف ما تريد تحقيقه في هذه الفترة..."
      },
      {
        key: "key_results",
        label: "النتائج الرئيسية (Key Results)",
        positive: true,
        placeholder: "اكتب ٣–٥ نتائج رئيسية قابلة للقياس توضح كيف تعرف أن الهدف تحقق (كل نتيجة في سطر)..."
      },
      {
        key: "initiatives",
        label: "المبادرات / الأنشطة الداعمة",
        positive: true,
        placeholder: "ما هي الأنشطة أو المشاريع التي ستنفّذها لتحقيق هذه النتائج الرئيسية؟"
      },
      {
        key: "risks_notes",
        label: "مخاطر، عوائق، وملاحظات",
        positive: false,
        placeholder: "ما أهم العوائق أو المخاطر المحتملة؟ وما الملاحظات التي يجب تذكرها أثناء التنفيذ؟"
      }
    ]
  },
  {
    id: "rice",
    file: "rice.html",
    enabled: true,
    short: "RICE",
    name_ar: "نموذج أولوية RICE",
    name_en: "RICE Prioritization",
    desc: "نموذج لتحديد أولوية المبادرات بناءً على حجم الوصول (Reach) والأثر (Impact) والثقة (Confidence) والجهد (Effort).",
    serves: "فرق المنتج، مدراء المشاريع، رواد الأعمال، والقياديون في بيئات التحول الرقمي.",
    when: "عند وجود قائمة مبادرات أو خصائص منتج وتريد ترتيبها حسب الأولوية.",
    decisionLogic: "كلما ارتفعت قيمة RICE (الوصول × الأثر × الثقة ÷ الجهد) كان المشروع أكثر أولوية للتنفيذ.",
    categories: ["projects", "strategy"],
    audiences: ["managers", "execs", "entrepreneurs", "analysts"],
    sections: [
      {
        key: "initiatives",
        label: "المبادرات / الخصائص المراد ترتيبها",
        positive: true,
        placeholder: "اكتب قائمة بالمبادرات أو خصائص المنتج التي تريد تقييمها (كل مبادرة في سطر)..."
      },
      {
        key: "reach_notes",
        label: "Reach — حجم الوصول المتوقَّع",
        positive: true,
        placeholder: "ملاحظات حول عدد المستخدمين أو العملاء الذين سيتأثرون بكل مبادرة، أو حجم السوق المتأثر..."
      },
      {
        key: "impact_notes",
        label: "Impact — حجم الأثر",
        positive: true,
        placeholder: "ما نوع وقوة الأثر المتوقع؟ (تحسين تجربة، زيادة إيرادات، خفض تكلُفة، ...)"
      },
      {
        key: "confidence_effort",
        label: "Confidence & Effort — الثقة والجهد",
        positive: false,
        placeholder: "درجة ثقتك في التقديرات، ومستوى الجهد/الوقت/التكلفة المطلوب لكل مبادرة..."
      }
    ]
  },
  {
    id: "sipoc",
    file: "sipoc.html",
    enabled: true,
    short: "SIPOC",
    name_ar: "نموذج SIPOC لخرائط العمليات",
    name_en: "SIPOC Process Mapping",
    desc: "أداة بسيطة لرسم صورة عالية المستوى للعملية من حيث المورّدين والمدخلات والعملية والمخرجات والعملاء.",
    serves: "مدراء العمليات، فرق الجودة، فرق التحسين المستمر، وفرق الخدمات.",
    when: "عند توثيق عملية، أو فهم تسلسل العمل قبل إجراء تحسينات أو أتمتة.",
    decisionLogic: "وضوح المورّدين والمدخلات والعملاء يساعد في اتخاذ قرارات تحسين دقيقة وتقليل الهدر في العملية.",
    categories: ["projects", "strategy"],
    audiences: ["managers", "execs", "analysts", "students"],
    sections: [
      {
        key: "suppliers",
        label: "Suppliers — المورّدون",
        positive: true,
        placeholder: "من هم المورّدون الرئيسيون لهذه العملية؟ (أفراد، أقسام، جهات خارجية...)"
      },
      {
        key: "inputs",
        label: "Inputs — المدخلات",
        positive: true,
        placeholder: "ما المدخلات الأساسية التي تحتاجها العملية؟ (بيانات، مواد، طلبات، نماذج...)"
      },
      {
        key: "process",
        label: "Process — خطوات العملية (مختصرة)",
        positive: true,
        placeholder: "صفْ باختصار خطوات العملية من البداية إلى النهاية (كل خطوة في سطر)..."
      },
      {
        key: "outputs",
        label: "Outputs — المخرجات",
        positive: true,
        placeholder: "ما مخرجات العملية؟ (تقرير، خدمة منجزة، منتج، موافقة...)"
      },
      {
        key: "customers",
        label: "Customers — العملاء / المستفيدون",
        positive: true,
        placeholder: "من المستفيد النهائي من هذه العملية؟ (عملاء، طلاب، موظفون، إدارات...)"
      }
    ]
  },
  {
    id: "six_hats",
    file: "six_hats.html",
    enabled: true,
    short: "Six Hats",
    name_ar: "قبعات التفكير الست",
    name_en: "Six Thinking Hats",
    desc: "إطار لتنظيم النقاش واتخاذ القرار عبر ست زوايا تفكير: الحقائق، المشاعر، المخاطر، الإيجابيات، الإبداع، وإدارة العملية.",
    serves: "القياديون، فرق العمل، المدربون، الطلاب، ورواد الأعمال.",
    when: "عند مناقشة قرار مهم أو فكرة جديدة وتريد تجنب الجدل العشوائي وتشتيت النقاش.",
    decisionLogic: "التفكير المتوازي عبر القبعات الست يساعد على رؤية القرار من زوايا متعددة قبل الحسم.",
    categories: ["strategy", "projects", "personal"],
    audiences: ["execs", "managers", "students", "entrepreneurs", "individuals"],
    sections: [
      {
        key: "white_hat",
        label: "القبعة البيضاء — المعلومات والحقائق",
        positive: true,
        placeholder: "ما الحقائق والبيانات المتوفرة؟ وما المعلومات الناقصة التي نحتاجها؟"
      },
      {
        key: "red_hat",
        label: "القبعة الحمراء — المشاعر والانطباعات",
        positive: false,
        placeholder: "ما مشاعرك أو حدسك تجاه هذا القرار؟ (بدون تبرير منطقي مطلوب)..."
      },
      {
        key: "black_hat",
        label: "القبعة السوداء — المخاطر والتحفّظات",
        positive: false,
        placeholder: "ما المخاطر، العيوب، نقاط الضعف، وما الذي قد يسوء إن نفذنا هذا القرار؟"
      },
      {
        key: "yellow_hat",
        label: "القبعة الصفراء — الفوائد والإيجابيات",
        positive: true,
        placeholder: "ما الفوائد المحتملة، فرص النجاح، والمكاسب لو نجح القرار؟"
      },
      {
        key: "green_hat",
        label: "القبعة الخضراء — الأفكار الإبداعية والبدائل",
        positive: true,
        placeholder: "ما البدائل، والتحسينات، والأفكار الإبداعية المرتبطة بالقرار؟"
      },
      {
        key: "blue_hat",
        label: "القبعة الزرقاء — تنظيم النقاش والخطوات القادمة",
        positive: true,
        placeholder: "ما خلاصة النقاش؟ وما الخطوات التالية المقترحة؟ ومن المسؤول عن ماذا؟"
      }
    ]
  },
{
  id: "decision_tree",
  file: "decision_tree.html",
  enabled: true,
  short: "Decision Tree",
  name_ar: "شجرة القرار",
  name_en: "Decision Tree Analysis",
  desc: "أداة لتفكيك القرار إلى فروع وخيارات ثم تقييم النتائج والمخاطر المحتملة لكل فرع.",
  serves: "المستشارون، القياديون، رواد الأعمال، ومدراء المشاريع.",
  when: "عند وجود عدة مسارات أو سيناريوهات ويجب اختيار الأنسب بناءً على النتائج المتوقعة.",
  decisionLogic: "كل خيار يتم تقييمه بناءً على احتمالات النتائج والعائد المتوقع والمخاطر.",
  categories: ["strategy", "projects", "risk"],
  audiences: ["execs", "managers", "analysts", "entrepreneurs", "students"],
  sections: [
    {
      key: "main_decision",
      label: "القرار الرئيسي",
      positive: true,
      placeholder: "صف القرار الأساسي أو نقطة الانطلاق..."
    },
    {
      key: "branches",
      label: "الفروع المحتملة (الخيارات / المسارات)",
      positive: true,
      placeholder: "اكتب الفروع المحتملة للقرار (كل فرع في سطر)..."
    },
    {
      key: "outcomes",
      label: "النتائج المحتملة لكل فرع",
      positive: true,
      placeholder: "اكتب النتائج المحتملة لكل فرع، توزيع احتمالات إن وُجد..."
    },
    {
      key: "risks",
      label: "المخاطر والعوائق",
      positive: false,
      placeholder: "ما المخاطر المرتبطة بكل خيار؟ وما احتمالية حدوثها؟"
    }
  ]
},
{
  id: "ooda",
  file: "ooda.html",
  enabled: true,
  short: "OODA",
  name_ar: "دورة OODA",
  name_en: "OODA Loop",
  desc: "نموذج لاتخاذ القرار السريع عبر أربع مراحل: الملاحظة، الاستيعاب، اتخاذ القرار، والتنفيذ.",
  serves: "المديرون، القادة الميدانيون، رواد الأعمال، متخذي القرارات السريعة.",
  when: "عند الحاجة لاتخاذ قرارات متكررة تتغير فيها المعطيات بسرعة (سوق، فرق عمل، أزمات).",
  decisionLogic: "كل مرحلة تؤثر على الأخرى، وكلما كانت الملاحظة والاستيعاب أفضل، أصبح القرار والتنفيذ أدق.",
  categories: ["strategy", "personal", "projects"],
  audiences: ["execs", "managers", "entrepreneurs", "students", "individuals"],
  sections: [
    {
      key: "observe",
      label: "Observe — الملاحظة",
      positive: true,
      placeholder: "ما المعلومات التي تراها الآن؟ بيانات، مؤشرات، وضع السوق، حالة الفريق..."
    },
    {
      key: "orient",
      label: "Orient — الاستيعاب والتحليل",
      positive: true,
      placeholder: "ما معنى هذه المعلومات؟ كيف تفسرها بناءً على خبرتك وسياقك؟"
    },
    {
      key: "decide",
      label: "Decide — اتخاذ القرار",
      positive: true,
      placeholder: "ما القرار الذي توصلت إليه؟ وما البدائل المتاحة؟"
    },
    {
      key: "act",
      label: "Act — التنفيذ",
      positive: true,
      placeholder: "ما الإجراءات العملية التي ستقوم بها بناءً على القرار؟ ومن المسؤول عنها؟"
    }
  ]
},
{
  id: "scenario_planning",
  file: "scenario_planning.html",
  enabled: true,
  short: "Scenarios",
  name_ar: "التخطيط بالسيناريوهات",
  name_en: "Scenario Planning",
  desc: "أداة لتصميم عدة سيناريوهات مستقبلية محتملة (متفائل، متشائم، مرجّح) ووضع قرارات واستجابات لكل سيناريو.",
  serves: "القياديون، فرق التخطيط الاستراتيجي، رواد الأعمال، فرق إدارة المخاطر.",
  when: "عند وجود غموض في المستقبل (سوق، أنظمة، تقنية) وتحتاج لاستعداد لعدة احتمالات بدلاً من خطة واحدة فقط.",
  decisionLogic: "جودة السيناريوهات وقابليتها للتطبيق تساعد في اتخاذ قرارات مرنة تستطيع التكيّف مع تغيّر الظروف.",
  categories: ["strategy", "risk", "projects"],
  audiences: ["execs", "managers", "analysts", "entrepreneurs", "students"],
  sections: [
    {
      key: "time_horizon",
      label: "أفق الزمن المستهدف",
      positive: true,
      placeholder: "حدّد الفترة الزمنية التي تخطط لها (مثلاً: ٦ أشهر، سنة، ٣ سنوات)..."
    },
    {
      key: "key_drivers",
      label: "العوامل المحرّكة الرئيسية",
      positive: true,
      placeholder: "ما العوامل غير المؤكدة أو المتغيّرات الحرجة؟ (الأنظمة، الأسعار، المنافسة، التقنية، ...)"
    },
    {
      key: "optimistic_scenario",
      label: "السيناريو المتفائل",
      positive: true,
      placeholder: "صف أفضل حالة ممكنة وما الذي يحدث لو سارت الأمور بأفضل مما توقعت..."
    },
    {
      key: "realistic_scenario",
      label: "السيناريو المرجّح",
      positive: true,
      placeholder: "صف السيناريو الأكثر منطقية بناءً على المعطيات الحالية..."
    },
    {
      key: "pessimistic_scenario",
      label: "السيناريو المتشائم",
      positive: false,
      placeholder: "صف أسوأ حالة ممكنة والمخاطر الكبرى التي قد تقع..."
    },
    {
      key: "responses",
      label: "الاستجابات والقرارات لكل سيناريو",
      positive: true,
      placeholder: "ما القرارات أو الخطط التي ستتبعها في كل سيناريو؟ (مختصرًا، لكل سيناريو خطة)..."
    }
  ]
},
{
  id: "blue_ocean",
  file: "blue_ocean.html",
  enabled: true,
  short: "Blue Ocean",
  name_ar: "استراتيجية المحيط الأزرق",
  name_en: "Blue Ocean Strategy",
  desc: "إطار للتفكير في خلق سوق جديدة (محيط أزرق) بدل المنافسة الدموية في سوق مزدحم (محيط أحمر)، عبر الابتكار في القيمة.",
  serves: "رواد الأعمال، القياديون، فرق الابتكار، فرق تطوير الأعمال.",
  when: "عند البحث عن تميّز حقيقي بعيد عن التقليد المباشر للمنافسين، أو عند تشبع السوق الحالي.",
  decisionLogic: "التركيز على ما يمكن إزالته وتقليله ورفعه وإبداعه يساعد في تصميم عرض قيمة مختلف عن السائد.",
  categories: ["strategy", "projects"],
  audiences: ["entrepreneurs", "execs", "managers", "analysts", "students"],
  sections: [
    {
      key: "current_space",
      label: "وصف السوق / المجال الحالي (المحيط الأحمر)",
      positive: false,
      placeholder: "كيف يبدو السوق الحالي؟ من المنافسون؟ على ماذا يتنافسون عادة (السعر، الجودة، السرعة، ...؟)"
    },
    {
      key: "eliminate",
      label: "إزالة (Eliminate)",
      positive: true,
      placeholder: "ما العوامل أو المزايا المنتشرة في السوق ويمكنك إلغاؤها تماماً دون أن يفتقدها العميل؟"
    },
    {
      key: "reduce",
      label: "تقليل (Reduce)",
      positive: true,
      placeholder: "ما العوامل التي يمكن تقليلها بشكل كبير مقارنة بما هو سائد في السوق؟"
    },
    {
      key: "raise",
      label: "رفع (Raise)",
      positive: true,
      placeholder: "ما العوامل التي يجب أن ترفعها إلى مستوى أعلى من المتعارف عليه في السوق؟"
    },
    {
      key: "create",
      label: "إبداع / ابتكار (Create)",
      positive: true,
      placeholder: "ما العوامل أو الخدمات أو التجارب الجديدة التي لا يقدمها أحد حاليًا؟"
    },
    {
      key: "value_proposition",
      label: "عرض القيمة الجديد (القفزة في القيمة)",
      positive: true,
      placeholder: "اكتب خلاصة ما يميز عرضك الجديد للعميل مقارنة بالسوق الحالي..."
    }
  ]
},
{
  id: "pareto",
  file: "pareto.html",
  enabled: true,
  short: "Pareto",
  name_ar: "مبدأ باريتو (80/20)",
  name_en: "Pareto Analysis",
  desc: "تحليل يحدد أهم الأسباب المؤثرة في المشكلة، حيث تفترض قاعدة باريتو أن 20٪ من الأسباب تؤدي إلى 80٪ من النتائج.",
  serves: "القادة والمديرون ورواد الأعمال والمحللون وفِرق الجودة والتحسين المستمر.",
  when: "عند وجود مشكلة أو تراكم تحديات وتحتاج لتحديد الأسباب الأكثر تأثيرًا لحلّها أولًا.",
  decisionLogic: "ترتيب الأسباب حسب أعلى وزن وتأثير لتحديد العناصر التي تسبب أغلب النتائج أو الخسائر.",
  categories: ["analysis", "quality", "strategy"],
  audiences: ["execs", "managers", "analysts", "entrepreneurs", "students"],
  sections: [
    {
      key: "issue",
      label: "المشكلة / الظاهرة",
      positive: true,
      placeholder: "صف المشكلة التي تريد تحليلها..."
    },
    {
      key: "causes",
      label: "الأسباب المحتملة",
      positive: true,
      type: "list",
      placeholder: "أضف كل سبب (عنصر واحد في كل سطر)..."
    },
    {
      key: "weights",
      label: "وزن كل سبب (التأثير)",
      positive: true,
      type: "weights",
      placeholder: "قم بتقييم قوة تأثير كل سبب من 1 إلى 5 بناءً على أهميته."
    }
  ]
},
{
  id: "fishbone",
  file: "fishbone.html",
  enabled: true,
  short: "Fishbone",
  name_ar: "مخطط عظم السمكة (إيشيكاوا)",
  name_en: "Fishbone Diagram",
  desc: "أداة تحليل جذور المشكلات عبر تصنيف الأسباب ضمن ست فئات رئيسية لتحديد المصدر الحقيقي للمشكلة.",
  serves: "فرق إدارة الجودة، القادة، المحللون، فرق التحسين المستمر، ورواد الأعمال.",
  when: "عند وجود مشكلة معقدة ذات أسباب متعددة وتحتاج لتجزئتها وتحديد جذورها.",
  decisionLogic: "تجميع الأسباب داخل الفئات يساعد على رؤية العلاقات وتحديد المصدر الأكثر تأثيرًا.",
  categories: ["quality", "analysis", "operations"],
  audiences: ["managers", "execs", "analysts", "entrepreneurs", "students"],
  sections: [
    {
      key: "problem",
      label: "المشكلة الرئيسية",
      positive: true,
      placeholder: "ما المشكلة التي ترغب بتحليل جذورها؟"
    },
    {
      key: "man",
      label: "الأسباب المتعلقة بالإنسان (Man)",
      positive: false,
      type: "list",
      placeholder: "ضع الأسباب المرتبطة بالبشر، المهارات، التدريب..."
    },
    {
      key: "machine",
      label: "الأسباب المتعلقة بالآلة (Machine)",
      positive: false,
      type: "list",
      placeholder: "مشاكل الأجهزة، الأدوات، الأعطال..."
    },
    {
      key: "material",
      label: "الأسباب المتعلقة بالمواد (Material)",
      positive: false,
      type: "list",
      placeholder: "جودة المواد، توفر المواد، البدائل..."
    },
    {
      key: "method",
      label: "الأسباب المتعلقة بالأساليب (Method)",
      positive: false,
      type: "list",
      placeholder: "الإجراءات، السياسات، خطوات العمل..."
    },
    {
      key: "environment",
      label: "الأسباب المتعلقة بالبيئة (Environment)",
      positive: false,
      type: "list",
      placeholder: "الضوضاء، الحرارة، الضغط، البيئة المحيطة..."
    },
    {
      key: "measurement",
      label: "الأسباب المتعلقة بالقياس (Measurement)",
      positive: false,
      type: "list",
      placeholder: "طرق القياس، دقة البيانات، مؤشرات الأداء..."
    }
  ]
},
{
  id: "skill_will",
  file: "skill_will.html",
  enabled: true,
  short: "Skill / Will",
  name_ar: "مصفوفة المهارة والرغبة",
  name_en: "Skill–Will Matrix",
  desc: "أداة لتحديد أسلوب التعامل مع أعضاء الفريق بناءً على مستوى مهارتهم ومستوى رغبتهم / دافعيتهم.",
  serves: "القادة، مدراء الفرق، المشرفون، وأيضًا من يدير متدربين أو طلاب.",
  when: "عند توزيع المهام أو تطوير الأفراد وتحتاج لتحديد: من يحتاج توجيه؟ من يحتاج تمكين؟ من يحتاج تحفيز؟",
  decisionLogic: "كل ربع في المصفوفة يقترح أسلوب قيادة مختلف (توجيه، تدريب، دعم، تفويض).",
  categories: ["personal", "projects", "strategy"],
  audiences: ["managers", "execs", "students", "analysts"],
  sections: [
    {
      key: "context",
      label: "سياق الفريق / المهمة",
      positive: true,
      placeholder: "اكتب وصفًا مختصرًا للفريق أو المجموعة أو المهمة التي تقيمها..."
    },
    {
      key: "high_skill_high_will",
      label: "مهارة عالية + رغبة عالية",
      positive: true,
      placeholder: "من يندرج في هذا الربع؟ ما المهام المناسبة؟ ما مستوى التفويض والدعم؟"
    },
    {
      key: "high_skill_low_will",
      label: "مهارة عالية + رغبة منخفضة",
      positive: false,
      placeholder: "من يندرج هنا؟ ما أسباب انخفاض الدافعية؟ ما الحلول (تحفيز، تغيير دور، تقدير...؟)"
    },
    {
      key: "low_skill_high_will",
      label: "مهارة منخفضة + رغبة عالية",
      positive: true,
      placeholder: "من يندرج هنا؟ ما الاحتياجات التدريبية؟ ما المهام التي تساعدهم على التعلم؟"
    },
    {
      key: "low_skill_low_will",
      label: "مهارة منخفضة + رغبة منخفضة",
      positive: false,
      placeholder: "من يندرج هنا؟ ما المخاطر على الفريق؟ ما الخيارات (تدريب مكثف، نقل، متابعة لصيقة...؟)"
    },
    {
      key: "actions",
      label: "خطة التعامل والتطوير",
      positive: true,
      placeholder: "اكتب الخطة العامة لكيفية التعامل مع كل فئة، والخطوات القادمة خلال الفترة القادمة..."
    }
  ]
},
{
  id: "porter5",
  file: "porter5.html",
  enabled: true,
  short: "Porter 5",
  name_ar: "قوى بورتر الخمس",
  name_en: "Porter’s Five Forces",
  desc: "إطار لتحليل جاذبية قطاع أو صناعة من خلال خمس قوى: قوة الموردين، قوة المشترين، شدة المنافسة، التهديد بالبدائل، والداخلين الجدد.",
  serves: "رواد الأعمال، المخططون الاستراتيجيون، مدراء الوحدات، والمستثمرون.",
  when: "عند دراسة دخول سوق جديد، أو تقييم قوة منافسة في سوق تعمل فيه حاليًا.",
  decisionLogic: "كلما اشتدت القوى الخمس كان القطاع أقل جاذبية وربحية، والعكس صحيح.",
  categories: ["strategy", "risk", "analysis"],
  audiences: ["execs", "entrepreneurs", "analysts", "students"],
  sections: [
    {
      key: "industry",
      label: "تعريف القطاع / الصناعة",
      positive: true,
      placeholder: "ما هو القطاع أو السوق الذي تقوم بتحليله؟ (مثال: تطبيقات توصيل الطعام في مدينة كذا...)"
    },
    {
      key: "rivalry",
      label: "شدة المنافسة بين الموجودين في السوق",
      positive: false,
      placeholder: "مَن المنافسون الرئيسيون؟ ما درجة المنافسة (سعرية، تسويقية، تقنية)؟"
    },
    {
      key: "new_entrants",
      label: "تهديد الداخلين الجدد",
      positive: false,
      placeholder: "ما مدى سهولة دخول لاعبين جدد؟ (حواجز الدخول، متطلبات ترخيص، رأس مال، تقنيات...)"
    },
    {
      key: "substitutes",
      label: "تهديد المنتجات / الخدمات البديلة",
      positive: false,
      placeholder: "ما البدائل الأخرى التي يمكن أن يلجأ إليها العميل بدلاً منك أو من منافسيك؟"
    },
    {
      key: "suppliers_power",
      label: "قوة الموردين",
      positive: false,
      placeholder: "ما عدد الموردين؟ ما مدى اعتمادك عليهم؟ هل لديهم قوة تفاوضية عالية؟"
    },
    {
      key: "buyers_power",
      label: "قوة العملاء / المشترين",
      positive: false,
      placeholder: "ما مدى قوة العميل في التفاوض؟ هل يستطيع بسهولة الانتقال لمنافس آخر؟"
    },
    {
      key: "summary",
      label: "الخلاصة والانطباع عن جاذبية القطاع",
      positive: true,
      placeholder: "اكتب تقييمًا مختصرًا لجاذبية القطاع / الصناعة في ضوء القوى الخمس، وما يعنيه ذلك لقرارك."
    }
  ]
},
{
  id: "stakeholder_power_interest",
  file: "stakeholder_power_interest.html",
  enabled: true,
  short: "Power / Interest",
  name_ar: "مصفوفة قوة واهتمام أصحاب المصلحة",
  name_en: "Stakeholder Power–Interest Grid",
  desc: "أداة لتصنيف أصحاب المصلحة حسب قوة تأثيرهم ودرجة اهتمامهم بالمشروع لتحديد أسلوب التعامل المناسب مع كل فئة.",
  serves: "مدراء المشاريع، القياديون، فرق التغيير المؤسسي، والمستشارون.",
  when: "عند بدء مشروع أو تغيير مهم قد يتأثر به عدة أطراف داخلية وخارجية.",
  decisionLogic: "كل ربع من المصفوفة يقترح طريقة إدارة مختلفة (إدارة عن قرب، إشعار، مراقبة، إبقاء راضٍ).",
  categories: ["stakeholders", "projects", "strategy"],
  audiences: ["managers", "execs", "analysts", "students"],
  sections: [
    {
      key: "project_context",
      label: "وصف المشروع / القرار",
      positive: true,
      placeholder: "اكتب وصفًا مختصرًا للمشروع أو القرار الذي تحلل أصحاب المصلحة له..."
    },
    {
      key: "high_power_high_interest",
      label: "قوة عالية + اهتمام عالٍ (Manage Closely)",
      positive: true,
      placeholder: "من هم هؤلاء؟ ما توقعاتهم؟ كيف ستديرهم عن قرب (اجتماعات، تقارير، إشراك في القرار)..."
    },
    {
      key: "high_power_low_interest",
      label: "قوة عالية + اهتمام منخفض (Keep Satisfied)",
      positive: true,
      placeholder: "من هم؟ ما الذي يهمهم فعلاً؟ كيف تبقيهم راضين بدون إغراقهم بالتفاصيل؟"
    },
    {
      key: "low_power_high_interest",
      label: "قوة منخفضة + اهتمام عالٍ (Keep Informed)",
      positive: true,
      placeholder: "من هؤلاء (غالبًا مستخدمين، موظفين متأثرين)؟ ما أفضل طريقة لإبقاءهم على اطلاع؟"
    },
    {
      key: "low_power_low_interest",
      label: "قوة منخفضة + اهتمام منخفض (Monitor)",
      positive: false,
      placeholder: "من هم؟ كيف ستراقبهم من بعيد؟ ما الحد الأدنى من التواصل المطلوب؟"
    },
    {
      key: "engagement_plan",
      label: "خطة إدارة أصحاب المصلحة",
      positive: true,
      placeholder: "اكتب الخلاصة وخطة إدارة كل فئة: أدوات اتصال، تكرار، مسؤول المتابعة..."
    }
  ]
},
{
  id: "gap_analysis",
  file: "gap_analysis.html",
  enabled: true,
  short: "GAP",
  name_ar: "تحليل الفجوة",
  name_en: "GAP Analysis",
  desc: "تحديد الفجوة بين الوضع الحالي والوضع المستهدف ثم وضع الإجراءات التي تقود لسد الفجوة.",
  serves: "الإداريون، القياديون، فرق الجودة والتطوير، والطلاب.",
  when: "عند وجود مستوى أداء غير مرضٍ، أو عند الرغبة في الانتقال من وضع حالي إلى وضع أفضل.",
  decisionLogic: "كلما كانت الفجوة واضحة والإجراءات محددة، كان الوصول للوضع المستهدف أكثر دقة وسرعة.",
  categories: ["strategy", "projects", "personal"],
  audiences: ["execs", "managers", "analysts", "students", "individuals"],
  sections: [
    {
      key: "current_state",
      label: "الوضع الحالي",
      positive: false,
      placeholder: "صف الوضع الحالي بشكل دقيق…"
    },
    {
      key: "target_state",
      label: "الوضع المستهدف",
      positive: true,
      placeholder: "صف الهدف أو مستوى الأداء المطلوب…"
    },
    {
      key: "gap_points",
      label: "الفجوات (ما الفرق بين الوضعين؟)",
      positive: false,
      placeholder: "اكتب نقاط الفجوة بين الوضع الحالي والمستهدف…"
    },
    {
      key: "actions",
      label: "إجراءات سد الفجوة",
      positive: true,
      placeholder: "اكتب الخطوات المقترحة لتقليل الفجوة…"
    }
  ]
},
{
  id: "value_chain",
  file: "value_chain.html",
  enabled: true,
  short: "Value Chain",
  name_ar: "سلسلة القيمة",
  name_en: "Porter Value Chain",
  desc: "تحليل الأنشطة الرئيسة والداعمة داخل المؤسسة لتحديد مصادر القيمة والتميّز والتكلفة.",
  serves: "رواد الأعمال، القياديون، المحللون في إدارة العمليات والاستراتيجية.",
  when: "عند تحليل عمليات المؤسسة، تحسين الكفاءة، تحديد الميزة التنافسية، أو تحسين الربحية.",
  decisionLogic: "تحديد الأنشطة الأعلى قيمة مقابل الأنشطة الأعلى تكلفة يساعد في اتخاذ قرارات التحسين أو الاستثمار.",
  categories: ["strategy", "projects", "finance"],
  audiences: ["execs", "managers", "analysts", "entrepreneurs"],
  sections: [
    {
      key: "primary_activities",
      label: "الأنشطة الأساسية",
      positive: true,
      placeholder: "اكتب الأنشطة الأساسية مثل: اللوجستيات الداخلة، العمليات، اللوجستيات الخارجة، التسويق، الخدمة..."
    },
    {
      key: "support_activities",
      label: "الأنشطة الداعمة",
      positive: true,
      placeholder: "مثل: البنية التحتية، الموارد البشرية، التطوير التقني، إدارة التوريد..."
    },
    {
      key: "value_points",
      label: "نقاط خلق القيمة",
      positive: true,
      placeholder: "أين تُخلق القيمة في الأنشطة؟ ما مصادر التميز؟"
    },
    {
      key: "cost_drivers",
      label: "عوامل التكلفة",
      positive: false,
      placeholder: "ما الأنشطة التي ترفع التكلفة؟ كيف يمكن تخفيضها؟"
    }
  ]
},
{
  id: "value_chain",
  file: "value_chain.html",
  enabled: true,
  short: "Value Chain",
  name_ar: "سلسلة القيمة",
  name_en: "Porter Value Chain",
  desc: "تحليل الأنشطة الرئيسة والداعمة داخل المؤسسة لتحديد مصادر القيمة والتميّز والتكلفة.",
  serves: "رواد الأعمال، القياديون، المحللون في إدارة العمليات والاستراتيجية.",
  when: "عند تحليل عمليات المؤسسة، تحسين الكفاءة، تحديد الميزة التنافسية، أو تحسين الربحية.",
  decisionLogic: "تحديد الأنشطة الأعلى قيمة مقابل الأنشطة الأعلى تكلفة يساعد في اتخاذ قرارات التحسين أو الاستثمار.",
  categories: ["strategy", "projects", "finance"],
  audiences: ["execs", "managers", "analysts", "entrepreneurs"],
  sections: [
    {
      key: "primary_activities",
      label: "الأنشطة الأساسية",
      positive: true,
      placeholder: "اكتب الأنشطة الأساسية مثل: اللوجستيات الداخلة، العمليات، اللوجستيات الخارجة، التسويق، الخدمة..."
    },
    {
      key: "support_activities",
      label: "الأنشطة الداعمة",
      positive: true,
      placeholder: "مثل: البنية التحتية، الموارد البشرية، التطوير التقني، إدارة التوريد..."
    },
    {
      key: "value_points",
      label: "نقاط خلق القيمة",
      positive: true,
      placeholder: "أين تُخلق القيمة في الأنشطة؟ ما مصادر التميز؟"
    },
    {
      key: "cost_drivers",
      label: "عوامل التكلفة",
      positive: false,
      placeholder: "ما الأنشطة التي ترفع التكلفة؟ كيف يمكن تخفيضها؟"
    }
  ]
}

];
