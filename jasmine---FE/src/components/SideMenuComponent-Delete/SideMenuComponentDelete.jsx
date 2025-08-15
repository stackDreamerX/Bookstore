import React from "react";
import "./SideMenuComponentDelete.css";
import ButtonNoBGComponent from "../ButtonNoBGComponent/ButtonNoBGComponent";

const SideMenuComponentDelete = (props) => {
  return (
    <div>
      <div className="side-menu sticky-left">
        <div
          className=" btn__side-menu1"
          role="group"
          aria-label="Vertical button group"
        >
          <div style={{display:"flex"}}>
          <button className="btn__component1">{props.children}
          </button>
          <button className="delete-categoryBtn">
            <svg xmlns="http://www.w3.org/2000/svg" width="19" height="24" viewBox="0 0 19 24" fill="none">
  <path d="M1.35714 21.3333C1.35714 22.8 2.57857 24 4.07143 24H14.9286C16.4214 24 17.6429 22.8 17.6429 21.3333V8C17.6429 6.53333 16.4214 5.33333 14.9286 5.33333H4.07143C2.57857 5.33333 1.35714 6.53333 1.35714 8V21.3333ZM17.6429 1.33333H14.25L13.2864 0.386667C13.0421 0.146667 12.6893 0 12.3364 0H6.66357C6.31071 0 5.95786 0.146667 5.71357 0.386667L4.75 1.33333H1.35714C0.610714 1.33333 0 1.93333 0 2.66667C0 3.4 0.610714 4 1.35714 4H17.6429C18.3893 4 19 3.4 19 2.66667C19 1.93333 18.3893 1.33333 17.6429 1.33333Z" fill="#3A060E"/>
</svg>
            </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default SideMenuComponentDelete;
