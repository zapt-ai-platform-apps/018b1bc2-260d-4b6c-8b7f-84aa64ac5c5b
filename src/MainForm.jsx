import { createSignal, For, Show } from 'solid-js';
import { createEvent } from './supabaseClient';
import { useNavigate } from '@solidjs/router';

function MainForm() {
  const [title, setTitle] = createSignal('');
  const [description, setDescription] = createSignal('');
  const [content, setContent] = createSignal('');
  const [sections, setSections] = createSignal([]);
  const [style, setStyle] = createSignal('');
  const [loading, setLoading] = createSignal(false);

  const styles = [
    'حداثي',
    'كلاسيكي',
    'بسيط',
    'احترافي',
    'داكن',
  ];

  const availableSections = [
    'الصفحة الرئيسية',
    'من نحن',
    'الخدمات',
    'المدونة',
    'اتصل بنا',
  ];

  const navigate = useNavigate();

  const handleGenerateWebsite = async () => {
    if (loading()) return;
    setLoading(true);
    try {
      const prompt = `
قم بإنشاء موقع إلكتروني احترافي كامل باللغة العربية يتضمن ما يلي:

- عنوان الموقع: ${title()}
- وصف الموقع: ${description()}
- محتوى الموقع: ${content()}
- الأقسام المطلوبة: ${sections().join(', ')}
- النمط أو التصميم المطلوب: ${style()}

يجب أن يكون الموقع:

- متوافقًا مع معايير HTML5 وCSS3 وJavaScript
- تصميم متجاوب يعمل على جميع الأجهزة
- استخدام أفضل الممارسات في كتابة الكود
- تنظيم الملفات في مجلدات بشكل احترافي كما يلي:
  - index.html
  - /css/styles.css
  - /js/script.js
  - /images (قم بتضمين أي صور افتراضية إذا لزم الأمر)
  - /fonts (إذا تم استخدام خطوط مخصصة)
- تضمين التعليقات في الكود لشرح الأقسام الرئيسية
- استخدام ميثاق تسمية احترافي للمتغيرات والأصناف

الرجاء تقديم النتيجة بصيغة JSON بالهيكل التالي:

{
  "index.html": "محتوى ملف index.html",
  "css/styles.css": "محتوى ملف styles.css",
  "js/script.js": "محتوى ملف script.js",
  // إذا كان هناك ملفات إضافية، قم بإضافتها بنفس الشكل
}

لا تقم بتضمين أي نص إضافي غير المطلوب.
`;
      const result = await createEvent('chatgpt_request', {
        prompt: prompt,
        response_type: 'json',
      });
      navigate('/preview', { state: { generatedCode: result } });
    } catch (error) {
      console.error('Error generating website:', error);
      alert('حدث خطأ أثناء إنشاء الموقع. الرجاء المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (section) => {
    if (sections().includes(section)) {
      setSections(sections().filter((s) => s !== section));
    } else {
      setSections([...sections(), section]);
    }
  };

  return (
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center p-6">
      <div class="w-full max-w-4xl bg-white p-8 rounded-lg shadow-lg h-full">
        <h1 class="text-4xl font-bold mb-6 text-center text-blue-600">منشئ المواقع باستخدام الذكاء الاصطناعي</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleGenerateWebsite();
          }}
          class="space-y-6"
        >
          <div>
            <label class="block mb-2 text-gray-700 font-medium">عنوان الموقع:</label>
            <input
              type="text"
              value={title()}
              onInput={(e) => setTitle(e.target.value)}
              class="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 box-border text-gray-800"
              required
            />
          </div>
          <div>
            <label class="block mb-2 text-gray-700 font-medium">وصف الموقع:</label>
            <textarea
              value={description()}
              onInput={(e) => setDescription(e.target.value)}
              class="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 box-border text-gray-800"
              rows="3"
              required
            ></textarea>
          </div>
          <div>
            <label class="block mb-2 text-gray-700 font-medium">محتوى الموقع:</label>
            <textarea
              value={content()}
              onInput={(e) => setContent(e.target.value)}
              class="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 box-border text-gray-800"
              rows="5"
              required
            ></textarea>
          </div>
          <div>
            <label class="block mb-2 text-gray-700 font-medium">الأقسام المطلوبة:</label>
            <div class="flex flex-wrap gap-4">
              <For each={availableSections}>
                {(section) => (
                  <label class="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sections().includes(section)}
                      onChange={() => toggleSection(section)}
                      class="form-checkbox h-5 w-5 text-blue-600 cursor-pointer"
                    />
                    <span class="text-gray-700">{section}</span>
                  </label>
                )}
              </For>
            </div>
          </div>
          <div>
            <label class="block mb-2 text-gray-700 font-medium">النمط أو التصميم المطلوب:</label>
            <select
              value={style()}
              onInput={(e) => setStyle(e.target.value)}
              class="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 box-border text-gray-800 cursor-pointer"
              required
            >
              <option value="" disabled>اختر نمطًا</option>
              <For each={styles}>
                {(styleOption) => <option value={styleOption}>{styleOption}</option>}
              </For>
            </select>
          </div>
          <button
            type="submit"
            class={`w-full py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out cursor-pointer ${
              loading() ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={loading()}
          >
            {loading() ? 'جاري الإنشاء...' : 'إنشاء الموقع'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default MainForm;