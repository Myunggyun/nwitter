import { dbService } from "fbase";
import React, { useEffect, useState } from "react";
import Nweet from "../components/Nweet";

const Home = ({ userObj }) => {
  const [nweet, setNweet] = useState("");
  const [nweets, setNweets] = useState([]);

  useEffect(() => {
    dbService.collection("nweets").onSnapshot(snapshot => {
      const nweetArray = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNweets(nweetArray);
    });
  }, []);

  const onSubmit = async event => {
    event.preventDefault();
    await dbService.collection("nweets").add({
      text: nweet,
      createdat: Date.now(),
      createdId: userObj.uid,
    });
    setNweet("");
  };
  const onChange = event => {
    const {
      target: { value },
    } = event;
    setNweet(value);
  };
  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="What's your mind?"
          maxLength={120}
          value={nweet}
          onChange={onChange}
        />
        <input type="submit" value="Nweet" />
      </form>
      <div>
        {nweets.map(nweet => (
          <Nweet
            nweetObj={nweet}
            key={nweet.id}
            isOwner={nweet.createdId === userObj.uid}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
