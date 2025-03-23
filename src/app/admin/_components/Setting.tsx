import React, { useEffect, useState } from "react";
import style from "./Setting.module.css";
import classNames from "classnames";
import { Button } from "@/app/_components/button/button";
import { getCompanyInfo, updateCompanyInfo } from "@/api";

const Setting = ({ info }: { info: CompanyInfo }) => {
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({ ...info });

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget;
    setCompanyInfo((prev) => ({ ...prev, [name]: value, isEdit: true }));
  };

  const onSaveSetting = async () => {
    try {
      const companyInfoCopy = { ...companyInfo };
      delete companyInfoCopy.id;
      await updateCompanyInfo(companyInfo.id as string, companyInfoCopy);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={style.container}>
      <div className={style.headerGroup}>
        <span className={style.title}>설정</span>
        <div>
          <Button disabled={false} onClick={onSaveSetting}>
            저장
          </Button>
        </div>
      </div>
      <div className={style.contentsGroup}>
        <InputFrom
          label={"법인명"}
          value={companyInfo.company}
          onChange={onChange}
          name="company"
        />
        <InputFrom
          label={"대표번호"}
          value={companyInfo.tel}
          onChange={onChange}
          name="tel"
        />
        <InputFrom
          label={"대표자"}
          value={companyInfo.representative}
          onChange={onChange}
          name="representative"
        />
        <InputFrom
          label={"주소"}
          value={companyInfo.address}
          onChange={onChange}
          name="address"
        />
        <InputFrom
          label={"상세 주소"}
          value={companyInfo.addressDetail}
          onChange={onChange}
          name="addressDetail"
        />
        <InputFrom
          label={"사업자등록번호"}
          value={companyInfo.businessLicenseNumber}
          onChange={onChange}
          name="businessLicenseNumber"
        />
        <InputFrom
          label={"통신판매업 신고번호"}
          value={companyInfo.mailOrderLicenseNumber}
          onChange={onChange}
          name="mailOrderLicenseNumber"
        />
        <InputFrom
          label={"이메일"}
          value={companyInfo.email}
          onChange={onChange}
          name="email"
        />
        <InputFrom
          label={"설명"}
          value={companyInfo.description}
          onChange={onChange}
          name="description"
        />
      </div>
    </div>
  );
};

export default Setting;

const InputFrom = ({
  label,
  value,
  onChange,
  name,
}: {
  label: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
}) => {
  return (
    <div className={style.inputGroup}>
      <span className={style.label}>{label}</span>
      <input
        name={name}
        className={style.input}
        value={value}
        onChange={(e) => onChange(e)}
      />
    </div>
  );
};
