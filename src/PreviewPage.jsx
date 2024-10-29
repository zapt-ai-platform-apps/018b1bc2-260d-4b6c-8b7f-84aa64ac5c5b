import { useLocation, useNavigate } from '@solidjs/router';
import { createSignal, Show } from 'solid-js';

function PreviewPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const generatedCode = location.state?.generatedCode || '';
  const [showCode, setShowCode] = createSignal(false);

  const downloadSourceCode = () => {
    const blob = new Blob([generatedCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'index.html';
    link.click();
    URL.revokeObjectURL(url);
  };

  const openSourceCodeWindow = () => {
    const codeWindow = window.open('', '_blank');
    codeWindow.document.open();
    codeWindow.document.write(`
      <html>
        <head>
          <title>كود السورس</title>
          <meta charset="UTF-8">
        </head>
        <body>
          <pre>${generatedCode.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
        </body>
      </html>
    `);
    codeWindow.document.close();
  };

  return (
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center p-6">
      <div class="w-full max-w-4xl bg-white p-8 rounded-lg shadow-lg h-full">
        <h2 class="text-3xl font-bold mb-6 text-center text-blue-600">كود السورس</h2>
        <div class="flex space-x-4 mb-6 justify-center">
          <button
            onClick={() => navigate(-1)}
            class="px-6 py-3 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition duration-300 ease-in-out cursor-pointer"
          >
            رجوع
          </button>
          <button
            onClick={openSourceCodeWindow}
            class="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out cursor-pointer"
          >
            عرض كود السورس
          </button>
          <button
            onClick={downloadSourceCode}
            class="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition duration-300 ease-in-out cursor-pointer"
          >
            تنزيل السورس
          </button>
        </div>
        <Show when={true}>
          <div class="overflow-y-auto max-h-[calc(100vh-300px)]">
            <pre class="bg-gray-100 p-4 rounded-lg whitespace-pre-wrap">
              <code>{generatedCode}</code>
            </pre>
          </div>
        </Show>
      </div>
    </div>
  );
}

export default PreviewPage;