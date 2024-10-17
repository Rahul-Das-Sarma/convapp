import Lottie from "react-lottie";
import animationData from "../../public/animation/loading.json";

const LoadingAnimation = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="w-full h-full pointer-events-none flex overflow-hidden">
      <Lottie options={defaultOptions} height={400} width={400} />{" "}
    </div>
  );
};

export default LoadingAnimation;
