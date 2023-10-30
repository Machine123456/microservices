import "./Info.css";

export default function Info() {
    return (
        <>
         <div className="frame">
          <img src="/portrait_background.png" className="portrait-background" />
          <img src="/portrait.png" className="portrait-blur" />
          <img src="/portrait.png" className="portrait" />
        </div>
        <div className="divider"></div>
        <div className="blocks">
          <div className="block">Block 1</div>
          <div className="block">Block 2</div>
          <div className="block">Block 3</div>
          <div className="block">Block 4</div>
        </div>
        <p className="lorem">
          Lorem ipsum dolor sit amet consectetur,
          adipisicing elit.
          Labore omnis recusandae similique delectus non deserunt,
          tenetur ex perferendis dicta sed perspiciatis nihil! Saepe ipsam,
          fuga nulla molestias porro delectus quo!
        </p>
        <div className="divider"></div>
        </>
    );
}