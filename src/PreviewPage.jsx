import { useLocation, useNavigate } from '@solidjs/router';
import { createSignal, Show } from 'solid-js';
import JSZip from 'jszip';

function PreviewPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const generatedCode = location.state?.generatedCode || '';
  const [loading, setLoading] = createSignal(false);

  const downloadSourceCode = async () => {
    setLoading(true);
    try {
      const zip = new JSZip();
      zip.file('index.html', generatedCode);
      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'website.zip';
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating ZIP file:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center p-6">
      <div class="w-full max-w-4xl bg-white p-4 rounded-lg shadow-lg h-full">
        <h2 class="text-3xl font-bold mb-6 text-center text-blue-600">معاينة الموقع</h2>
        <div class="flex space-x-4 mb-6 justify-center">
          <button
            onClick={() => navigate(-1)}
            class="px-6 py-3 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition duration-300 ease-in-out cursor-pointer"
          >
            رجوع
          </button>
          <button
            onClick={downloadSourceCode}
            class={`px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition duration-300 ease-in-out cursor-pointer ${
              loading() ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={loading()}
          >
            <Show when={loading()} fallback="تنزيل السورس">
              جاري التحضير...
            </Show>
          </button>
        </div>
        <div class="bg-gray-100 p-4 rounded-lg overflow-y-auto" style={{ height: '500px' }}>
          <iframe
            srcDoc={generatedCode}
            class="w-full h-full rounded-lg"
            frameBorder="0"
            sandbox=""
          ></iframe>
        </div>
      </div>
    </div>
  );
}

export default PreviewPage;