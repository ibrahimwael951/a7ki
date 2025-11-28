import { Button } from "./ui/button";
import LightRays from "./ui/LightRays";

const Hero = () => {
  return (
    <section className=" min-h-screen flex flex-col gap-2 justify-center items-center text-center">
      <div className="absolute top-0 left-0 w-full h-full -z-10">
        <LightRays
          raysOrigin="top-left"
          raysColor="white"
          raysSpeed={1.5}
          lightSpread={0.8}
          rayLength={1.2}
          followMouse={true}
          mouseInfluence={0.1}
          noiseAmount={0.1}
          distortion={0.05}
          className="w-full!"
        />
      </div>
      <div className="absolute top-0 left-0 w-full h-full -z-10">
        <LightRays
          raysOrigin="bottom-right"
          raysColor="white"
          raysSpeed={1.5}
          lightSpread={0.8}
          rayLength={1.2}
          followMouse={true}
          mouseInfluence={0.1}
          noiseAmount={0.1}
          distortion={0.05}
          className="w-full!"
        />
      </div>
      <h1 className="text-5xl md:text-7xl lg:text-8xl max-w-3xl ">
        Measure. Reduce. Report. With AI.
      </h1>
      <p className="md:text-lg lg:text-xl max-w-2xl ">
        Smarter carbon management software that helps your business cut
        emissions and stay compliant — automatically.
      </p>
      <div className="flex justify-center items-center gap-4 lg:scale-125 mt-5 lg:mt-7">
        <Button link="/send" className="">
          Send Your Message
        </Button>
        <Button link="/about" variant={"outline"}>
          About Us
        </Button>
      </div>
    </section>
  );
};

export default Hero;
