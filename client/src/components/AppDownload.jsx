import { assets } from '../assets/assets';

const AppDownload = () => {
  return (
    <div className="container px-4 2xl:px-20 mx-auto my-20">
      <div className="relative bg-gradient-to-r from-violet-50 to-purple-50 p-12 sm:p-24 lg:p-32 rounded-lg">
        <div>
          <h1 className="text-2xl sm:text-4xl font-bold mb-4 max-w-md">
            Mobile App Coming Soon!
          </h1>
          <p className="text-gray-600 mb-6 max-w-md text-sm">
            Built by{' '}
            <span className="font-semibold text-purple-700">Maaz Ansari</span> -
            Full-Stack Engineer with React Native expertise. The mobile
            experience is planned for the next release.
          </p>
          <div className="flex gap-4">
            <div className="inline-block opacity-50 relative">
              <img
                className="h-12"
                src={assets.play_store}
                alt="Google Play Store - Coming Soon"
              />
              <span className="absolute inset-0 bg-gray-200 bg-opacity-50 flex items-center justify-center text-xs font-medium">
                Soon
              </span>
            </div>
            <div className="inline-block opacity-50 relative">
              <img
                className="h-12"
                src={assets.app_store}
                alt="Apple App Store - Coming Soon"
              />
              <span className="absolute inset-0 bg-gray-200 bg-opacity-50 flex items-center justify-center text-xs font-medium">
                Soon
              </span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-4">
            Contact{' '}
            <a
              href="mailto:maazansari25667@gmail.com"
              className="text-purple-600 hover:underline"
            >
              maazansari25667@gmail.com
            </a>{' '}
            for updates
          </p>
        </div>
        <img
          className="absolute w-80 right-0 bottom-0 mr-32 max-lg:hidden"
          src={assets.app_main_img}
          alt=""
        />
      </div>
    </div>
  );
};

export default AppDownload;
