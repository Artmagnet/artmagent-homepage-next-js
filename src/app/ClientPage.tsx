"use client";
import useEmblaCarousel from "embla-carousel-react";
import SummeryCard from "./_components/SummeryCard/SummeryCard";
import { useCallback, useEffect, useState } from "react";
import style from "./style.module.css"; // SummeryCard 그룹에만 적용된 스타일이 있다면 유지

const ClientPage = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const slides = ["Slide 1", "Slide 2", "Slide 3"];

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  const scrollTo = (index: number) => emblaApi && emblaApi.scrollTo(index);

  return (
    <div className={`${style.container}`}>
      <div className="w-[1280px] h-[480px] relative text-center mx-auto">
        <div className="overflow-hidden mx-auto" ref={emblaRef}>
          <div className="flex">
            {slides.map((slide, index) => (
              <div
                key={index}
                className="flex-[0_0_100%] p-5 bg-[#ddd] text-[20px] h-[420px] flex items-center justify-center"
              >
                {slide}
              </div>
            ))}
          </div>
        </div>

        {/* Dots (페이지네이션) */}
        <div className="absolute bottom-20 left-0 w-full flex justify-center items-center gap-3">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full border-none ${
                index === selectedIndex ? "bg-[#333]" : "bg-[#bbb]"
              }`}
              onClick={() => scrollTo(index)}
            />
          ))}
        </div>
      </div>

      <div className={style.contentsGroup}>
        <SummeryCard />
        <SummeryCard />
        <SummeryCard />
      </div>
    </div>
  );
};

export default ClientPage;
