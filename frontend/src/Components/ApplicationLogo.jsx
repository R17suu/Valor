import logo from "@/assets/seal.png";

export default function ApplicationLogo({ className = "h-8 w-auto text-gray-500", size = 48, ...props }) {
  return (
    <img
      src={logo}
      alt="Complete in Jesus Christ Mission Church"
      width={size}
      height={size}
      className={className}
      {...props}
    />
  );
}
