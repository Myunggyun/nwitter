import { authService, dbService } from "fbase";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

const Profile = ({ userObj, refreshUser }) => {
  let history = useHistory();
  const [newDisplayName, setDisplayName] = useState("");

  const onLogOutClick = () => {
    authService.signOut();
    history.push("/");
  };

  const getMyNweets = async () => {
    await dbService
      .collection("nweets")
      .where("creatorId", "==", userObj.uid)
      .orderBy("createdat")
      .get();
  };

  useEffect(() => {
    getMyNweets();
  }, []);

  const onChange = event => {
    const {
      target: { value },
    } = event;
    setDisplayName(value);
  };

  const onSubmit = async event => {
    event.preventDefault();
    if (userObj.displayName !== newDisplayName) {
      await userObj.updateProfile({
        displayName: newDisplayName,
      });
      refreshUser();
      setDisplayName("");
    }
  };

  return (
    <>
      <div className="container">
        <form onSubmit={onSubmit} className="profileForm">
          <input
            className="formInput"
            autoFocus
            type="text"
            placeholder="displayName"
            onChange={onChange}
            value={newDisplayName ? newDisplayName : ""}
          />
          <input
            type="submit"
            value="Update Profile"
            className="formBtn"
            style={{
              marginTop: 10,
            }}
          />
        </form>
        <span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>
          Log Out
        </span>
      </div>
    </>
  );
};

export default Profile;
