import { useLocation, useNavigate } from '@solidjs/router';

function PreviewPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const generatedCode = location.state?.generatedCode || '';

  const downloadSourceCode = () => {
    const blob = new Blob([generatedCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'index.html';
    link.click();
    URL.revokeObjectURL(url);
  };

  const openPreview = () => {
    const previewWindow = window.open('', '_blank');
    previewWindow.document.open();
    previewWindow.document.write(generatedCode);
    previewWindow.document.close();
  };

  return (
    <div class="h-full bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center p-6">
      <div class="w-full max-w-4xl bg-white p-8 rounded-lg shadow-lg h-full">
        <h2 class="text-3xl font-bold mb-6 text-center text-blue-600">معاينة الموقع</h2>
        <div class="flex space-x-4 mb-6 justify-center">
          <button
            onClick={() => navigate(-1)}
            class="px-6 py-3 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition duration-300 ease-in-out cursor-pointer"
          >
            رجوع
          </button>
          <button
            onClick={openPreview}
            class="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out cursor-pointer"
          >
            معاينة
          </button>
          <button
            onClick={downloadSourceCode}
            class="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition duration-300 ease-in-out cursor-pointer"
          >
            تنزيل السورس
          </button>
        </div>
        <div class="overflow-y-auto max-h-[calc(100vh-300px)]">
          <pre class="bg-gray-100 p-4 rounded-lg whitespace-pre-wrap">
            <code>{generatedCode}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}

export default PreviewPage;