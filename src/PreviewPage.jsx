import { useLocation, useNavigate } from '@solidjs/router';
import { createSignal, Show, onCleanup } from 'solid-js';
import JSZip from 'jszip';

function PreviewPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const generatedCode = location.state?.generatedCode || {};

  const [loading, setLoading] = createSignal(false);
  const [previewURL, setPreviewURL] = createSignal('');

  const downloadSourceCode = async () => {
    if (loading()) return;
    setLoading(true);
    try {
      const zip = new JSZip();

      // Iterate over the generatedCode object and add files to the ZIP
      Object.keys(generatedCode).forEach((filePath) => {
        zip.file(filePath, generatedCode[filePath]);
      });

      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'website.zip';
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating ZIP file:', error);
      alert('حدث خطأ أثناء تنزيل السورس. الرجاء المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  const createPreview = () => {
    const htmlContent = generatedCode['index.html'] || '';
    const cssContent = generatedCode['css/styles.css'] || '';
    const jsContent = generatedCode['js/script.js'] || '';

    const fullHTML = `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>معاينة الموقع</title>
<style>
${cssContent}
</style>
</head>
<body>
${htmlContent}
<script>
${jsContent}
</script>
</body>
</html>
    `;

    const blob = new Blob([fullHTML], { type: 'text/html' });
    return URL.createObjectURL(blob);
  };

  // Generate the preview URL and cleanup when component unmounts
  const url = createPreview();
  setPreviewURL(url);

  onCleanup(() => {
    URL.revokeObjectURL(previewURL());
  });

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
            src={previewURL()}
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