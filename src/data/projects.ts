export interface Project {
  slug: string;
  title: string;
  tag: string;
  category: "web" | "mobile" | "ecommerce" | "cloud" | "ui";
  client: string;
  year: string;
  excerpt: string;
  description: string;
  challenge: string;
  solution: string;
  results: string[];
  tech: string[];
  duration: string;
}

export const projects: Project[] = [
  {
    slug: "data-analytics-platform",
    title: "منصة تحليلات البيانات الذكية",
    tag: "تطبيق ويب",
    category: "web",
    client: "تك فيجن",
    year: "2025",
    excerpt: "منصة متكاملة لتحليل البيانات الضخمة مع لوحات تحكم تفاعلية ورسوم بيانية متقدمة.",
    description:
      "بنينا منصة سحابية تعالج ملايين الصفوف من البيانات يومياً وتقدم رؤى فورية للقرارات الاستراتيجية، مع واجهة سهلة الاستخدام تدعم العربية بالكامل.",
    challenge:
      "كان العميل يستخدم أدوات مبعثرة لمعالجة البيانات مما أبطأ القرارات وزاد التكاليف بشكل ملحوظ.",
    solution:
      "صمّمنا بنية تحتية موزّعة على AWS مع طبقة معالجة بـ Apache Spark وواجهة React عالية الأداء، إضافة إلى نظام صلاحيات متعدد المستويات.",
    results: ["تقليل وقت التحليل بنسبة 78%", "زيادة دقة التوقعات إلى 94%", "خفض التكاليف التشغيلية 45%"],
    tech: ["React", "TypeScript", "Node.js", "PostgreSQL", "Apache Spark", "AWS"],
    duration: "6 أشهر",
  },
  {
    slug: "smart-delivery-app",
    title: "تطبيق التوصيل الذكي",
    tag: "تطبيق جوال",
    category: "mobile",
    client: "سرعة دليفري",
    year: "2025",
    excerpt: "تطبيق توصيل متطور بخوارزميات ذكاء اصطناعي لتحديد أفضل المسارات وتقليل وقت التوصيل.",
    description:
      "طوّرنا تطبيقاً متكاملاً للسائقين والعملاء مع تتبع لحظي، نظام مكافآت، ومدفوعات آمنة عبر بوابات متعددة.",
    challenge: "كان وقت التوصيل أطول من المنافسين بمعدل 22 دقيقة، مما أثر على رضا العملاء.",
    solution:
      "بنينا محرك تخصيص مسارات يعتمد على بيانات حركة المرور الحية، ودمجنا واجهات سلسة بـ Flutter لتعمل بسلاسة على iOS و Android.",
    results: ["خفض وقت التوصيل 35%", "زيادة الطلبات 4 أضعاف", "تقييم 4.9 على المتاجر"],
    tech: ["Flutter", "Firebase", "Google Maps", "Stripe", "Python"],
    duration: "4 أشهر",
  },
  {
    slug: "luxury-ecommerce-store",
    title: "متجر إلكتروني فاخر",
    tag: "متجر إلكتروني",
    category: "ecommerce",
    client: "بوتيك أناقة",
    year: "2024",
    excerpt: "متجر إلكتروني للأزياء الراقية بتجربة تسوّق غامرة وإدارة مخزون متطورة.",
    description:
      "صمّمنا تجربة تسوّق سينمائية تعكس فخامة العلامة التجارية، مع نظام توصيات ذكي وتكامل كامل مع بوابات الدفع المحلية والعالمية.",
    challenge: "متجر سابق ببطء كبير في التحميل وارتداد عالٍ وفقدان للمبيعات.",
    solution:
      "أعدنا بناء المتجر بـ Next.js مع تحسينات أداء جذرية، أضفنا تجربة AR لتجربة المنتجات، ولوحة تحكم متقدمة للإدارة.",
    results: ["زيادة المبيعات 3 أضعاف", "تحسين السرعة بـ 4 أضعاف", "خفض الارتداد 60%"],
    tech: ["Next.js", "Stripe", "Sanity CMS", "TailwindCSS"],
    duration: "5 أشهر",
  },
  {
    slug: "fintech-dashboard",
    title: "لوحة تحكم مالية متقدمة",
    tag: "FinTech",
    category: "web",
    client: "مالي برو",
    year: "2024",
    excerpt: "نظام إدارة محافظ استثمارية احترافي مع تحليلات لحظية ومخاطر محسوبة.",
    description:
      "نظام مصرفي متكامل يدير محافظ استثمارية بقيمة مليارات، مع تقارير امتثال وأمان من الطراز المصرفي.",
    challenge: "حاجة لنظام يجمع بين الأمان البنكي والسرعة العالية للمتداولين المحترفين.",
    solution: "بنينا نظاماً مشفّراً بالكامل مع 2FA إلزامي، WebSockets للأسعار الحية، وتدقيق أمني مستقل.",
    results: ["معالجة 50K معاملة/ثانية", "صفر اختراقات", "اعتماد من 3 جهات تنظيمية"],
    tech: ["React", "Node.js", "WebSockets", "PostgreSQL", "Redis"],
    duration: "8 أشهر",
  },
  {
    slug: "healthcare-platform",
    title: "منصة الرعاية الصحية الرقمية",
    tag: "صحة رقمية",
    category: "web",
    client: "صحتي بلس",
    year: "2024",
    excerpt: "منصة لربط المرضى بالأطباء مع استشارات مرئية وملفات طبية إلكترونية آمنة.",
    description:
      "نظام شامل للحجوزات، الاستشارات عن بُعد، وإدارة الوصفات الطبية بمعايير HIPAA.",
    challenge: "الحاجة لمنصة موثوقة تربط آلاف المرضى بالأطباء في وقت قصير وبأمان.",
    solution: "طوّرنا منصة WebRTC مشفّرة من طرف لطرف مع نظام ذكي لتوزيع المواعيد.",
    results: ["50K+ استشارة شهرياً", "متوسط انتظار 3 دقائق", "رضا 96%"],
    tech: ["React", "WebRTC", "Node.js", "MongoDB", "AWS"],
    duration: "7 أشهر",
  },
  {
    slug: "saas-crm",
    title: "نظام CRM سحابي",
    tag: "SaaS",
    category: "cloud",
    client: "بزنس سويت",
    year: "2025",
    excerpt: "نظام إدارة علاقات عملاء حديث متعدد المستأجرين بأتمتة مبيعات قوية.",
    description:
      "منصة SaaS متكاملة بأتمتة سير العمل، تكامل مع 30+ خدمة خارجية، وتقارير تحليلية متقدمة.",
    challenge: "تشتت بيانات العملاء بين أدوات متعددة وفقدان للفرص البيعية.",
    solution: "نظام موحّد بـ React + Node على بنية Microservices مع طبقة Webhooks مرنة.",
    results: ["مضاعفة معدل التحويل", "وفّر 20 ساعة/أسبوع للفرق", "ROI خلال 3 أشهر"],
    tech: ["React", "Node.js", "Kubernetes", "PostgreSQL", "Stripe"],
    duration: "9 أشهر",
  },
];

export const projectCategories = [
  { id: "all", label: "الكل" },
  { id: "web", label: "ويب" },
  { id: "mobile", label: "جوال" },
  { id: "ecommerce", label: "متاجر" },
  { id: "cloud", label: "سحابة" },
] as const;
