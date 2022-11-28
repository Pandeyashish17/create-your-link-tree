import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../config/Firebase";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import Link from "next/link";
import firebase from "firebase/app";
import { v4 as uuid } from "uuid";
const Create = () => {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [error, setError] = useState(false);
  const [textToShow, setTextToShow] = useState("");
  const [linkToGo, setLinkToGo] = useState("");

  const isValidUrl = (urlString) => {
    try {
      return Boolean(new URL(urlString));
    } catch (e) {
      return false;
    }
  };
  const addLink = async (text, link) => {
    if (!user) return;
    if (text.length == 0 || !isValidUrl(link)) {
      setError(true);
    } else {
      setError(false);
      const pathRef = doc(db, "users", user.email);
      await updateDoc(pathRef, {
        link: arrayUnion({
          id: uuid(),
          textToShow: text,
          linkToGo: link,
        }),
      });
      router.push("/");
    }
  };

  return (
    <>
      {user ? (
        <div className="flex flex-col justify-center items-center gap-2 h-[90vh]">
          <div className="form-control">
            <div className="input-group">
              <input
                type="text"
                placeholder="Type display Name"
                className="input input-bordered"
                onChange={(e) => setTextToShow(e.target.value)}
              />
            </div>
          </div>
          <div className="form-control">
            <div className="input-group">
              <input
                type="text"
                placeholder="Add the link here"
                className="input input-bordered"
                onChange={(e) => setLinkToGo(e.target.value)}
              />
            </div>
          </div>
          <button
            className="btn"
            onClick={() => {
              addLink(textToShow, linkToGo);
            }}
          >
            Add{" "}
          </button>
          {error ? <p className="text-red-500">Enter Correct Details</p> : null}
        </div>
      ) : (
        <div className="h-[85vh] grid place-content-center">
          <Link
            href="/"
            className=" animate__animated animate__shakeX relative px-6 py-3 font-bold text-white rounded-lg group"
          >
            <span className="absolute inset-0 w-full h-full transition duration-300 transform -translate-x-1 -translate-y-1 bg-purple-800 ease opacity-80 group-hover:translate-x-0 group-hover:translate-y-0"></span>
            <span className="absolute inset-0 w-full h-full transition duration-300 transform translate-x-1 translate-y-1 bg-pink-800 ease opacity-80 group-hover:translate-x-0 group-hover:translate-y-0 mix-blend-screen"></span>
            <span className="relative ">Sign in first</span>
          </Link>
        </div>
      )}
    </>
  );
};

export default Create;
