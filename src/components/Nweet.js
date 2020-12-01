import { dbService, storageService } from "fbase";
import React, { useState } from "react";

const Nweet = ({ nweetObj, isOwner }) => {
  const [editing, setEditing] = useState(false);
  const [newNweet, setNewNweet] = useState(nweetObj.text);

  const onDeleteClick = async () => {
    const ok = window.confirm("Are you sure you want to delet this nweet?");
    if (ok) {
      await dbService.doc(`nweets/${nweetObj.id}`).delete();
      await storageService.refFromURL(nweetObj.attachmentURL).delete();
    }
  };

  const toggleEditing = () => {
    setEditing(!editing);
  };

  const onChange = event => {
    const {
      target: { value },
    } = event;
    setNewNweet(value);
  };

  const onSubmit = event => {
    event.preventDefault();
    dbService.doc(`nweets/${nweetObj.id}`).update({
      text: newNweet,
    });
    setEditing(false);
  };

  return (
    <>
      {editing ? (
        <>
          <form onSubmit={onSubmit}>
            <input
              type="text"
              value={newNweet}
              placeholder="What is your mind?"
              required
              onChange={onChange}
            />
            <input type="submit" value="Update Nweet" />
          </form>
          <button onClick={toggleEditing}>Cancel</button>
        </>
      ) : (
        <>
          <h4>{nweetObj.text}</h4>
          {nweetObj.attachmentURL && (
            <img
              src={nweetObj.attachmentURL}
              alt=""
              width="50px"
              height="50px"
            />
          )}
          {isOwner && (
            <>
              <button onClick={onDeleteClick}>Delete Nweet</button>
              <button onClick={toggleEditing}>Edit Nweet</button>
            </>
          )}
        </>
      )}
    </>
  );
};

export default Nweet;
