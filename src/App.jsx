import { createSignal, Show, For } from 'solid-js';
import { createEvent } from './supabaseClient';

function App() {
  const [title, setTitle] = createSignal('');
  const [description, setDescription] = createSignal('');
  const [content, setContent] = createSignal('');
  const [style, setStyle] = createSignal('');
  const [generatedCode, setGeneratedCode] = createSignal('');
  const [loading, setLoading] = createSignal(false);

  const styles = [
    'نمط حديث',
    'تصميم كلاسيكي',
    'واجهة بسيطة',
    'تصميم احترافي',
    'نمط داكن',
  ];

  const handleGenerateWebsite = async () => {
    if (loading()) return;
    setLoading(true);
    try {
      const prompt = `
قم بإنشاء كود HTML لموقع إلكتروني احترافي باللغة العربية يحتوي على ما يلي:

- عنوان الموقع: ${title()}
- وصف الموقع: ${description()}
- محتوى الموقع: ${content()}
- النمط أو التصميم المطلوب: ${style()}

يجب أن يكون الكود متوافقًا مع معايير HTML5 وCSS3، ويتضمن تنسيقات مناسبة. لا تقم بتضمين أي نص إضافي غير المطلوب.
`;
      const result = await createEvent('chatgpt_request', {
        prompt: prompt,
        response_type: 'text',
      });
      setGeneratedCode(result);
    } catch (error) {
      console.error('Error generating website:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="min-h-screen bg-gray-100 p-6">
      <div class="max-w-3xl mx-auto bg-white p-8 rounded shadow h-full">
        <h1 class="text-3xl font-bold mb-6 text-center text-blue-600">منشئ المواقع باستخدام الذكاء الاصطناعي</h1>
        <form onSubmit={(e) => { e.preventDefault(); handleGenerateWebsite(); }} class="space-y-4">
          <div>
            <label class="block mb-2 text-gray-700">عنوان الموقع:</label>
            <input
              type="text"
              value={title()}
              onInput={(e) => setTitle(e.target.value)}
              class="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 box-border text-gray-800"
              required
            />
          </div>
          <div>
            <label class="block mb-2 text-gray-700">وصف الموقع:</label>
            <textarea
              value={description()}
              onInput={(e) => setDescription(e.target.value)}
              class="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 box-border text-gray-800"
              rows="3"
              required
            ></textarea>
          </div>
          <div>
            <label class="block mb-2 text-gray-700">محتوى الموقع:</label>
            <textarea
              value={content()}
              onInput={(e) => setContent(e.target.value)}
              class="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 box-border text-gray-800"
              rows="5"
              required
            ></textarea>
          </div>
          <div>
            <label class="block mb-2 text-gray-700">النمط أو التصميم المطلوب:</label>
            <select
              value={style()}
              onInput={(e) => setStyle(e.target.value)}
              class="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 box-border text-gray-800 cursor-pointer"
              required
            >
              <option value="">اختر نمطًا</option>
              <For each={styles}>{(styleOption) => (
                <option value={styleOption}>{styleOption}</option>
              )}</For>
            </select>
          </div>
          <button
            type="submit"
            class={`w-full py-3 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition duration-300 ease-in-out cursor-pointer ${loading() ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loading()}
          >
            {loading() ? 'جاري الإنشاء...' : 'إنشاء الموقع'}
          </button>
        </form>

        <Show when={generatedCode()}>
          <div class="mt-8">
            <h2 class="text-2xl font-bold mb-4 text-gray-800">كود الموقع الناتج:</h2>
            <pre class="bg-gray-200 p-4 rounded overflow-x-auto">
              <code>{generatedCode()}</code>
            </pre>
            <div class="mt-6">
              <h3 class="text-xl font-semibold mb-2 text-gray-800">معاينة الموقع:</h3>
              <iframe
                srcDoc={generatedCode()}
                class="w-full h-96 border border-gray-300 rounded"
                sandbox=""
              ></iframe>
            </div>
          </div>
        </Show>
      </div>
    </div>
  );
}

export default App;