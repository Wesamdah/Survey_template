import Image from "next/image";

export default function AuthSidebar({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div
      className="w-full h-full text-white flex flex-col justify-end p-12 bg-cover bg-center"
      dir="rtl"
    >
      <Image
        src="/images/login_background.png"
        alt="login_background"
        fill
        style={{ objectFit: "cover" }}
        className="z-0"
        priority
      />
      <div className="z-10">
        <h2 className="text-4xl font-extrabold mb-2">{title}</h2>

        <p className="text-gray-300 text-lg">{description}</p>
      </div>

      <div className="absolute inset-0 bg-black opacity-40"></div>
    </div>
  );
}
