import Image from 'next/image';

const Landing = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      {/* Hero Section */}
      <div className="grid grid-cols-2 gap-4 mb-16">
        <div className="relative h-48">
          <div className="bg-orange-100 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Snap it.</h3>
            <Image
              src="/images/writing.jpg"
              alt="Student writing notes"
              fill
              className="object-cover rounded-lg"
            />
          </div>
        </div>
        <div className="relative h-48">
          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Score it.</h3>
            <Image
              src="/images/grading.jpg"
              alt="Grading papers"
              fill
              className="object-cover rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="space-y-24">
        {/* AI Feature */}
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-4">
            <Image
              src="/images/ai-icon.png"
              alt="AI Icon"
              width={96}
              height={96}
            />
          </div>
          <h2 className="text-xl font-bold mb-2">Powered by AI</h2>
          <p className="text-gray-600">
            Utilizes multiple AI models to create an accurate and fast grading experience.
          </p>
        </div>

        {/* Platform Support */}
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-4">
            <Image
              src="/images/devices-icon.png"
              alt="Devices Icon"
              width={96}
              height={96}
            />
          </div>
          <h2 className="text-xl font-bold mb-2">Supported on Multiple Platforms</h2>
          <ul className="text-gray-600 space-y-2">
            <li>Compatible with your existing Android and Windows Device</li>
            <li>Requires Android 8+ or Windows 10 for seamless operation</li>
            <li>Sync effortlessly across devices: scan with Android, review on Android Tablet, or access via the website</li>
          </ul>
        </div>

        {/* Companion Website */}
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-4">
            <Image
              src="/images/website-icon.png"
              alt="Website Icon"
              width={96}
              height={96}
            />
          </div>
          <h2 className="text-xl font-bold mb-2">Accessible Companion Website</h2>
          <p className="text-gray-600">
            Optional data sync with Snapscore.ai and across all your devices
          </p>
        </div>

        {/* Answer Sheets */}
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-4">
            <Image
              src="/images/download-icon.png"
              alt="Download Icon"
              width={96}
              height={96}
            />
          </div>
          <h2 className="text-xl font-bold mb-2">Downloadable Answer Sheets</h2>
          <p className="text-gray-600">
            Custom Print Options lets you create tailored answer sheets, fully customizable with your choice of question count and personalized labels throughout
          </p>
        </div>
      </div>
    </div>
  );
};

export default Landing;