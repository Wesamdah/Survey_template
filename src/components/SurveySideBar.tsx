import Image from "next/image";

interface Props {
  title: string;
  description: string;
  stepText: string;
  progress: number;
  onLoginClick: () => void;
}

const SurveySidebar = ({
  title,
  description,
  stepText,
  progress,
  onLoginClick,
}: Props) => {
  return (
    <div className="h-screen w-full bg-gray-900 text-white p-12 flex flex-col justify-end relative overflow-hidden">
      <div className="absolute top-0 left-0 p-8 z-30">
        <button
          onClick={onLoginClick}
          className="py-2 px-4 text-white border border-white rounded-lg hover:bg-white hover:text-gray-900 transition duration-200 text-lg font-medium"
        >
          تسجيل الدخول
        </button>
      </div>

      <Image
        src="/images/surveyForm_Background.png"
        alt="Survey Background Image"
        fill
        style={{ objectFit: "cover" }}
        priority
        className="absolute inset-0 z-0 opacity-80"
      />

      <div className="absolute inset-0 z-10 bg-gray-900 opacity-20"></div>

      <div className="relative z-20 text-right">
        <h1 className="text-5xl font-extrabold mb-4">{title}</h1>
        <p className="text-lg mb-12 text-gray-300">{description}</p>

        <p className="text-sm font-light mb-2">{stepText}</p>

        <div className="w-full h-2 bg-gray-600 rounded-full mb-2">
          <div
            className="h-full bg-white rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-sm font-bold">{progress}% تم أستكمال</p>
      </div>
    </div>
  );
};

export default SurveySidebar;
