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
قم بإنشاء كود HTML كامل لموقع إلكتروني احترافي باللغة العربية يحتوي على ما يلي:

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

  const downloadSourceCode = () => {
    const blob = new Blob([generatedCode()], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'index.html';
    link.click();
    URL.revokeObjectURL(url);
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

        <Show when={generatedCode()}>
          <div class="mt-10">
            <h2 class="text-2xl font-bold mb-4 text-gray-800">كود الموقع الناتج:</h2>
            <pre class="bg-gray-100 p-4 rounded-lg overflow-x-auto whitespace-pre-wrap">
              <code>{generatedCode()}</code>
            </pre>
            <button
              onClick={downloadSourceCode}
              class="mt-6 w-full py-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition duration-300 ease-in-out cursor-pointer"
            >
              تنزيل السورس
            </button>
          </div>
        </Show>
      </div>
    </div>
  );
}

export default App;