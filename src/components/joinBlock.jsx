import React from "react";
import socket from "../socket";
import axios from "axios";

const JoinBlock = ({onLogin}) => {

  const [roomId, setRoomId] = React.useState("");
  const [userName, setUserName] = React.useState("");
  const [isLoading, setLoading] = React.useState(false);

  const onEnter = async () => {
    if(!roomId || !userName) {
      return alert("Неверные данные")
    }
    const obj = {
        roomId,
        userName
    }
    setLoading(true);
    await axios.post("/rooms", obj);
    onLogin(obj);
  }


  return (
    <div>
        <div className={"join-block"}>
            <input type={"text"} required value={roomId} onChange={(e) => setRoomId(e.target.value)}/>
            <span className={"bar"}/>
            <label>Room id</label>
        </div>
        <div className={"join-block"}>
          <input type={"text"} required value={userName} onChange={(e) => setUserName(e.target.value)}/>
          <span className={"bar"}/>
          <label>Ваше имя</label>
        </div>
        <div className={"button"}>
          <button disabled={isLoading} onClick={onEnter}>Войти
          {isLoading ? "" : ""}
          </button>
        </div>
    </div>
  )
}

export default JoinBlock;