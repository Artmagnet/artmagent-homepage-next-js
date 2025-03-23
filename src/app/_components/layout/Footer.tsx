"use client";

import { useEffect } from "react";
import style from "./footerStyle.module.css";

const Footer = ({ info }: { info: CompanyInfo }) => {
  return (
    <div className={style.container}>
      <div className={style.contentsGroup}>
        <div className={style.topGroup}>
          <span className={style.title}>{info.description}</span>
          <span className={style.title}>TEL.{info.tel}</span>
        </div>
        <div className={style.bottomGroup}>
          <div className={style.bottomBox}>
            <span className={style.bottomText}>
              {info.company} | {info.representative} | {info.address}
              {info.addressDetail}
            </span>
            <span className={style.bottomText}>
              사업자등록번호:{info.businessLicenseNumber}| 통신판매업 신고번호 :
              {info.mailOrderLicenseNumber}
            </span>
            <span className={style.bottomText}>이메일:{info.email}</span>
            <span className={style.bottomText}>{info.description}</span>
            <div className={style.snsGroup}>
              {/* <CiYoutube />
              <FaInstagram /> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
