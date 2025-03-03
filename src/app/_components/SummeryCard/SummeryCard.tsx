import style from "./style.module.css";

const SummeryCard = () => {
  return (<div className={style.container}>
    <div className={style.textGroup}><span className={style.text}>대메뉴</span>
      <span className={style.text}> 더보기</span>
    </div>
    <div className={style.imageGroup}>
      <div className={style.image}></div>
      <div className={style.image}></div>
      <div className={style.image}></div>
    </div>
  </div>);
};

export default SummeryCard;
