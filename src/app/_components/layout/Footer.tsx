import { FaInstagram } from "react-icons/fa6";
import style from "./footerStyle.module.css";
import { CiYoutube } from "react-icons/ci";

const Footer = () => {
  return (
    <div className={style.container}>
      <div className={style.contentsGroup}>
        <div className={style.topGroup}>
          <span className={ style.title}>자석제조전문/도무송가공/교육용자석/자석판촉상품</span>
          <span className={ style.title}>TEL.031-031-434-3315</span>
        </div>
        <div className={style.bottomGroup}>
          <div className={style.bottomBox}>
            <span className={style.bottomText}>
                아트자석 | 조정희 | 경기도 안산시 단원구 별망로555 타원타크라5 지식산업센터 7층 703호
            </span>
            <span  className={style.bottomText}>사업자등록번호:134-06-39611  | 통신판매업 신고번호 : 2017-경기안산-0360 호 </span>
            <span  className={style.bottomText}>이메일:artinc5123@naver.com</span>
            <span  className={style.bottomText}>자석제조전문/도무송가공/교육용자석/자석판촉상품</span>
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
