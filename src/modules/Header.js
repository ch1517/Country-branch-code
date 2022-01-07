import "../App.css";
import { React, useState } from "react";
import CbcConvert from "./CbcConvert";

function Header({ menuState, historyList, setAppState, setMenuState }) {
  const [submitValue, setSubmitValue] = useState(""); // 검색창에 입력한 값

  // 검색 버튼을 눌렀을 때 호출되는 handler
  const pushToApp = (event) => {
    // 기존의 form event를 막는다.
    event.preventDefault();

    var s = submitValue.split(",");
    var _lat, _lng;
    // lat, lng 으로 주어질 때
    if (s.length === 2) {
      _lat = parseFloat(s[0]);
      _lng = parseFloat(s[1]);
      // 만약 _lat, _lng 이 숫자가 아니고, 한국 지도 범위를 벗어났을 때
      if (
        isNaN(_lat) ||
        isNaN(_lng) ||
        !(_lat > 31 && _lat < 39) ||
        !(_lng > 124 && _lng < 133)
      ) {
        alert("ex. '32.66367, 124.43291'");
      } else {
        var cbc = CbcConvert.converterToCbc([_lng, _lat]);
        // App.js로 보내는 작업, App.js에서는 state 설정을 변경한다.
        setAppState(
          _lat,
          _lng,
          `${cbc[0]} ${cbc[1]} ${cbc[2]}`,
          null,
          true
        );
      }
    } else {
      s = submitValue.split(" ");
      // 국가지점번호로 주어질 때
      if (s.length === 3) {
        //s[0]가 문자, s[1],s[2]가 숫자가 아닌 경우
        if (!isNaN(s[0]) || isNaN(s[1]) || isNaN(s[2])) {
          alert("ex. '가가 1234 1234'");
        } else {
          var latLng = CbcConvert.converterToLatLng(submitValue);
          if (latLng === -1) {
            // converterToLatLng Error
            alert("ex. 가가 1234 1234");
          } else {
            // 그 외의 경우
            _lng = latLng[0];
            _lat = latLng[1];
            // App.js로 보내는 작업, App.js에서는 state 설정을 변경한다.
            setAppState(_lat, _lng, submitValue, null, true);
          }
        }
      } else {
        alert("ex. '32.66367, 124.43291' or '가가 1234 1234'");
      }
    }
  };

  // history 메뉴 toggle (mobile 경우)
  // mobile의 경우 history 버튼이 없기 때문에 검색 input focus 설정 시 history 영역 호출
  const menuSateChangeMobile = () => {
    // 모바일 환경에서만 input Focus, Blur로 history 영역 제어
    const state = /Mobile|Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(
      navigator.userAgent
    );
    if (state) {
      setMenuState(true);
    }
  };
  const makeHistory = (historyArr, setAppState) => {
    return (
      <div>
        {historyArr.map(({ lng, lat, cbcCode }) => {
          return (
            <div
              key={cbcCode}
              className="historyList"
              onClick={(event) => {
                setAppState(lat, lng, cbcCode, null, true);
              }}
            >
              <img src="/CountryBranchCode/images/marker.png" alt="" />
              <div className="codeDiv">
                <div className="cbcCode">{cbcCode}</div>
                <div className="latlng">
                  {lat.toFixed(5)}, {lng.toFixed(5)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
  return (
    <div className="header">
      <div className="leftMenu">
        <div className="title">국가지점번호</div>
        <div className="developer">
          <a href="https://doqtqu.tistory.com/186">©doqtqu</a>
        </div>
      </div>
      <div className="search-div">
        <form className="search" onSubmit={pushToApp}>
          <input
            onFocus={menuSateChangeMobile}
            onBlur={menuSateChangeMobile}
            type="text"
            placeholder="32.66367, 124.43291 or 가가 1234 1234"
            // 검색창에 입력하는 값이 달라질 때마다 호출되는 handler
            onChange={(event) => setSubmitValue(event.target.value)}
          />
          <input type="submit" value="검색"></input>
          <div
            className={menuState ? "historyOpen" : "historyClose"}
          >
            {makeHistory(historyList, setAppState)}
          </div>
        </form>
        {/* history 메뉴 toggle (Window의 경우) */}
        <button className="toggleBtn" onClick={() => setMenuState(!menuState)}>
          <i className="fas fa-history lg"></i>
        </button>
      </div>
    </div>
  );
}

export default Header;
