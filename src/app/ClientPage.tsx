"use client";
import useEmblaCarousel from "embla-carousel-react";
import SummeryCard from "./_components/SummeryCard/SummeryCard";
import style from "./style.module.css";
import { useCallback, useEffect, useState } from "react";




const ClientPage = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ "loop":true });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const slides = ["Slide 1", "Slide 2", "Slide 3"];
  useEffect(() => {
    if (!emblaApi) {return;}

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);


  const scrollTo = (index: number) => emblaApi && emblaApi.scrollTo(index);

  return (<div className={style.container}>

    <div className="carousel">
      <div className="embla" ref={emblaRef}>
        <div className="embla__container">
          {slides.map((slide, index) => (
            <div key={index} className="embla__slide">
              {slide}
            </div>
          ))}
        </div>
      </div>

      {/* Dots (페이지네이션) */}
      <div className="dots">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`dot ${index === selectedIndex ? "active" : ""}`}
            onClick={() => scrollTo(index)}
          />
        ))}
      </div>
      <style jsx>{`
        .carousel {
          text-align: center;
          width: 1280px;
          height:480px;
          position: relative;
           
        }
        .embla {
          overflow: hidden;
          margin: auto;

        }
        .embla__container {
          display: flex;

        }
        .embla__slide {
          flex: 0 0 100%;
          padding: 20px;
          background: #ddd;
          text-align: center;
          font-size: 20px;
          height:420px;
          align-items: center;
          display:flex;
          justify-content: center;
        }
         .dots {
            flex:1;
          bottom:80px;
            left:0;
          display: flex;
          justify-content: center;
          position: absolute;
          gap:12px;
          width:100%;
           align-items: center;
        justify-content: center;
          
        }
        .dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #bbb;
          border: none;
          cursor: pointer;
        }
        .dot.active {
          background: #333;
        }
        button {
          cursor: pointer;
        }
      `}</style>
    </div>
    <div className={style.contentsGroup}>

      <SummeryCard/>
      <SummeryCard/>
      <SummeryCard/>

    </div>
  </div>);
};

export default ClientPage;
