import React, { useState } from "react";
import style from "./Setting.module.css";

const Setting = () => {
  const [settingInfo, setSettingInfo] = useState({
    company: "아트자석",
    tel:"031-434-3315",
    representative: "조정희",
    address: "경기도 안산시 단원구 별망로555",
    addressDetail: "타원타크라5 지식산업센터 7층 703호",
    businessLicenseNumber:"134-06-39611",
    mailOrderLicenseNumber: "2017-경기안산-0360 호",
    email: "artinc5123@naver.com",
    description:"자석제조전문/도무송가공/교육용자석/자석판촉상품"
  });

  const onChange =  (event: React.ChangeEvent<HTMLInputElement>)=> {
    const {} = event.currentTarget;
  };


  return (<div className={style.container}>
    <span className={style.title}>설정</span>
    <div className={ style.contentsGroup}>
      <InputFrom label={"법인명"} value={settingInfo.company} onChange={onChange} name="company"/>
      <InputFrom label={"대표번호호"} value={settingInfo.tel} onChange={onChange} name="tel"/>
      <InputFrom label={"대표자"} value={settingInfo.representative} onChange={onChange}  name="representative"/>
      <InputFrom label={"주소"} value={settingInfo.address} onChange={onChange}  name="address"/>
      <InputFrom label={"상세 주소"} value={settingInfo.addressDetail} onChange={onChange}  name="addressDetail"/>
      <InputFrom label={"사업자등록번호"} value={settingInfo.businessLicenseNumber} onChange={onChange}  name="businessLicenseNumber"/>
      <InputFrom label={"통신판매업 신고번호"} value={settingInfo.mailOrderLicenseNumber} onChange={onChange} name="mailOrderLicenseNumber"/>
      <InputFrom label={"이메일"} value={settingInfo.email} onChange={onChange}  name="email"/>
      <InputFrom label={"설명"} value={settingInfo.description} onChange={onChange} name="description"/>
    </div>
  </div>);
};

export default Setting;


const InputFrom = ({ label, value, onChange, name }: {
    label: string;
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
    name: string;
}) => {
  return <div className={style.inputGroup}>
    <span className={style.label}>{label}</span>
    <input
      name={name}
      className={style.input}
      value={value}
      onChange={(e)=>onChange(e)} />
  </div>;
};
