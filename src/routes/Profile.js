import { authService, dbService } from "fbase";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

const Profile = ({ userObj, refreshUser }) => {
  let history = useHistory();
  const [newDisplayName, setDisplayName] = useState(userObj.displayName);

  const onLogOutClick = () => {
    authService.signOut();
    history.push("/");
  };

  const getMyNweets = async () => {
    const nweets = await dbService
      .collection("nweets")
      .where("creatorId", "==", userObj.uid)
      .orderBy("createdat")
      .get();
    console.log(nweets.docs.map(doc => doc.data()));
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
    console.log(userObj);
    if (userObj.displayName !== newDisplayName) {
      await userObj.updateProfile({
        displayName: newDisplayName,
      });
      refreshUser();
    }
  };

  return (
    <>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="displayName"
          onChange={onChange}
          value={newDisplayName}
        />
        <input type="submit" value="Update Profile" />
      </form>
      <button onClick={onLogOutClick}>log out</button>
    </>
  );
};

export default Profile;
