"use client";

import { Coordinates, NaverMap } from "@/app/_hooks/useMap ";
import Script from "next/script";
import { useRef, useCallback, useState, useEffect } from "react";

const mapId = "naver-map";

const ClientPage = () => {


  return (
    <div className="m-auto">
      <div className="flex flex-col gap-3 flex-1 p-[90px] min-w-[1280px]">
        <span className=" text-2xl">오시는길</span>
        <Map />
        <div className="flex flex-col gap-3 py-5">
          <div className="flex flex-col gap-3 py-5">
            <span className=" text-xl">경기도 안산시 단원구 별망로 555 타원타크라5차 지식산업센터 7층 703호</span>
            <span className=" text-3xl">경기도 안산시 단원구 원시동 784-2</span>
          </div>
          <div className="flex flex-col  gap-3">
            <div className=" grid grid-cols-[200px_1fr] py-5 border-b border-solid border-[#D9D9D9]">
              <span className='text-[18px]'>대표님 전화번호</span>
              <span className='text-[18px]'>010-6365-1382</span>
            </div>
            <div className=" grid grid-cols-[200px_1fr] py-5 border-b border-solid border-[#D9D9D9]">
              <span className='text-[18px]'>회사 전화번호</span>
              <span className='text-[18px]'>031-434-3315</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );

};

export default ClientPage;

const Map = () => {
  const [loc, setLoc] = useState<Coordinates>();
  const mapRef = useRef<NaverMap>(null);

  const initializeMap = useCallback(() => {
    const mapOptions = {
      center: new window.naver.maps.LatLng(loc),
      zoom: 15,
      scaleControl: true,
      mapDataControl: true,
      logoControlOptions: {
        position: naver.maps.Position.BOTTOM_LEFT,
      },
    };
    const map = new window.naver.maps.Map(mapId, mapOptions);
    mapRef.current = map;
  }, [loc]);

  const initLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      setLoc([position.coords.longitude, position.coords.latitude]);
    });
  };

  useEffect(() => {
    initLocation();
  }, []);



  return (
    <>
      {loc &&
              <>
                <Script
                  strategy="afterInteractive"
                  type="text/javascript"
                  src={`https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.NEXT_PUBLIC_MAP_KEY}`}
                  onReady={initializeMap}
                ></Script>
                <div id={mapId} style={{ width: "100%", height: "500px" }} />
              </>
      }
    </>
  );

};
