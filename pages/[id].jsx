import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  arrayRemove,
  doc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { auth, db } from "../config/Firebase";
import { useRouter } from "next/router";
import Loader from "../components/Loader";
import { FaEdit } from "react-icons/fa";
import {
  AiFillFacebook,
  AiFillInstagram,
  AiFillYoutube,
  AiFillTwitterCircle,
  AiOutlineWhatsApp,
  AiFillDelete,
} from "react-icons/ai";
import { BsTelegram } from "react-icons/bs";
import { useAuthState } from "react-firebase-hooks/auth";
import FileBase64 from "react-file-base64";
import Link from "next/link";
import UpdatingLoader from "../components/UpdatingLoader";
import { v4 as uuid } from "uuid";

const LinkPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setimageUrl] = useState(null);
  const [random, setRandom] = useState(null);
  const [description, setDescription] = useState(null);
  const [name, setName] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [previousValue, setPreviousValue] = useState(null);
  const [error, setError] = useState(false);
  const [newValue, setNewValue] = useState({
    textToShow: "",
    linkToGo: "",
  });
  console.log(newValue);
  useEffect(() => {
    if (!id) return;
    const getData = async () => {
      setLoading(true);
      const q = query(collection(db, "users"), where("id", "==", id));
      const querySnapshot = await getDocs(q);
      querySnapshot.docs.length == 0
        ? setLoading(false)
        : querySnapshot.forEach((doc) => {
            setData(doc.data());
            setLoading(false);
          });
    };
    getData();
  }, [id, random]);

  const [user] = useAuthState(auth);

  const deleteLink = async (item) => {
    setUpdating(true);
    if (!item) return;
    const pathRef = doc(db, "users", user.email);
    await updateDoc(pathRef, {
      link: arrayRemove(item),
    });
    setUpdating(false);
    setRandom(Math.random());
  };

  const updatePicture = async (url) => {
    if (!url) return;
    setUpdating(true);

    const pathRef = doc(db, "users", user.email);
    await updateDoc(pathRef, {
      imageUrl: url,
    });
    setUpdating(false);
    setRandom(Math.random());
  };

  const updateDescription = async (desc) => {
    if (!desc) return;
    setUpdating(true);
    const pathRef = doc(db, "users", user.email);
    await updateDoc(pathRef, {
      description: desc,
    });
    setUpdating(false);
    setRandom(Math.random());
  };

  const updateName = async (name) => {
    if (!name) return;
    setUpdating(true);
    const pathRef = doc(db, "users", user.email);
    await updateDoc(pathRef, {
      name: name,
    });
    setUpdating(false);
    setRandom(Math.random());
  };
  const isValidUrl = (urlString) => {
    try {
      return Boolean(new URL(urlString));
    } catch (e) {
      return false;
    }
  };
  const editLink = async (previousValue, newValue) => {
    if (!previousValue || !newValue) return;
    console.log(newValue);
    if (!isValidUrl(newValue.linkToGo) || newValue.textToShow.length == 0) {
      setError(true);
      return;
    }
    setUpdating(true);
    setError(false);
    const pathRef = doc(db, "users", user.email);
    await updateDoc(pathRef, {
      link: arrayRemove(previousValue),
    });
    await updateDoc(pathRef, {
      link: arrayUnion({
        id: uuid(),
        textToShow: newValue.textToShow,
        linkToGo: newValue.linkToGo,
      }),
    });
    setUpdating(false);
    setRandom(Math.random());
  };
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          {data ? (
            <div className=" font-sans antialiased min-h-[75vh]">
              <div className="container mx-auto my-28 ">
                <div>
                  <div className="bg-white relative shadow rounded-lg w-5/6 md:w-4/6  lg:w-3/6 xl:w-2/6 mx-auto">
                    <div className="flex justify-center relative">
                      <img
                        src={data.imageUrl}
                        alt=""
                        className="rounded-full mx-auto absolute -top-20 w-32 h-32 shadow-md border-4 border-white transition duration-200 transform hover:scale-110"
                      />
                      {user && id == user.uid && (
                        <button className="absolute hover:text-gray-300 hover:scale-105 transition-all duration-300 -bottom-10 left-[60%]">
                          <label htmlFor="my-modal-4" className="">
                            <FaEdit className="w-7 h-7 text-black" />
                          </label>
                        </button>
                      )}
                    </div>

                    <div className="mt-16">
                      <div className="flex gap-2 justify-center items-centers">
                        <h1 className="font-bold text-center text-3xl text-gray-900 capitalize">
                          {data?.name}
                        </h1>
                        {user && id == user.uid && (
                          <label htmlFor="my-modal-6" className="">
                            <FaEdit className="w-4 h-4 text-gray-400" />
                          </label>
                        )}
                      </div>
                      <p className="text-center text-sm text-gray-600 font-medium">
                        {data?.email}
                      </p>
                      <div className="flex justify-center items-center gap-3 ">
                        <p className="text-center text-sm text-gray-400 w-[60%] font-medium">
                          {data?.description}
                        </p>
                        {user && id == user.uid && (
                          <label htmlFor="my-modal-5" className="">
                            <FaEdit className="w-4 h-4 text-gray-400" />
                          </label>
                        )}
                      </div>

                      <div className="w-full">
                        {data.link.length == 0 ? (
                          <>
                            <div className="flex gap-2 items-center ">
                              <h3 className="font-medium text-gray-900 text-left px-6 py-3">
                                No Links
                              </h3>
                              {user && user.uid == id && (
                                <Link
                                  className="text-blue-500 cursor-pointer hover:scale-105 transition-all duration-300 font-bold"
                                  href="/create"
                                >
                                  Add Links
                                </Link>
                              )}
                            </div>
                          </>
                        ) : (
                          <>
                            <h3 className="font-medium text-gray-900 text-left px-6 ">
                              Links
                            </h3>
                            <div className="mt-5 w-full gap-2 flex flex-col items-center overflow-hidden text-sm">
                              {data.link.map((item) => {
                                return (
                                  <div
                                    className=" flex justify-between gap-10  text-black font-semibold cursor-pointer text-xl  hover:scale-105 transition-all duration-300 items-center mb-2 "
                                    key={item.id}
                                  >
                                    {" "}
                                    {item.linkToGo.includes("facebook") ? (
                                      <AiFillFacebook />
                                    ) : item.linkToGo.includes("instagram") ? (
                                      <AiFillInstagram />
                                    ) : item.linkToGo.includes("youtube") ? (
                                      <AiFillYoutube />
                                    ) : item.linkToGo.includes("twitter") ? (
                                      <AiFillTwitterCircle />
                                    ) : item.linkToGo.includes("whatsapp") ? (
                                      <AiOutlineWhatsApp />
                                    ) : item.linkToGo.includes("t.me") ? (
                                      <BsTelegram />
                                    ) : (
                                      <span className="h-7 w-7 rounded-full bg-blue-500 grid place-content-center pb-1 ">
                                        {item.textToShow.charAt(0)}
                                      </span>
                                    )}
                                    <a
                                      href={item.linkToGo}
                                      rel="norefferer"
                                      target="_blank"
                                    >
                                      {item.textToShow}
                                    </a>
                                    {user && id == user.uid ? (
                                      <>
                                        <button
                                          onClick={() => deleteLink(item)}
                                        >
                                          <AiFillDelete />
                                        </button>

                                        <label
                                          htmlFor="my-modal-10"
                                          className="cursor-pointer"
                                          onClick={() => setPreviousValue(item)}
                                        >
                                          <FaEdit />
                                        </label>
                                      </>
                                    ) : null}
                                  </div>
                                );
                              })}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="min-h-screen grid place-content-center">
              <h1>No Data</h1>
            </div>
          )}
          <input type="checkbox" id="my-modal-4" className="modal-toggle" />
          <label htmlFor="my-modal-4" className="modal cursor-pointer">
            <label className="modal-box relative" htmlFor="">
              <h3 className="text-lg font-bold">Select File To Upload</h3>
              <p className="py-4">
                <FileBase64
                  multiple={false}
                  onDone={(image) => setimageUrl(image.base64)}
                />
              </p>
              <button className="btn" onClick={() => updatePicture(imageUrl)}>
                {updating ? <UpdatingLoader /> : "Update"}
              </button>
            </label>
          </label>{" "}
          <input type="checkbox" id="my-modal-5" className="modal-toggle" />
          <label htmlFor="my-modal-5" className="modal cursor-pointer">
            <label className="modal-box relative" htmlFor="">
              <div className="form-control h-[80vh]">
                <div className="input-group justify-center items-center gap-3 flex-col">
                  <textarea
                    type="text"
                    placeholder="Search…"
                    className="input input-bordered"
                   
                    onChange={(e) => setDescription(e.target.value)}
                  >
                    {data?.description}
                  </textarea>
                  <button
                    className="btn "
                    onClick={() => updateDescription(description)}
                  >
                    {updating ? <UpdatingLoader /> : "Update Description"}
                  </button>
                </div>
              </div>
            </label>
          </label>
          <input type="checkbox" id="my-modal-6" className="modal-toggle" />
          <label htmlFor="my-modal-6" className="modal cursor-pointer">
            <label className="modal-box relative" htmlFor="">
              <div className="form-control ">
                <div className="input-group justify-center items-center gap-3 flex-col">
                  <input
                    type="text"
                    placeholder="Search…"
                    className="input input-bordered"
                    onChange={(e) => setName(e.target.value)}
                    defaultValue={data?.name}
                  />

                  <button className="btn " onClick={() => updateName(name)}>
                    {updating ? <UpdatingLoader /> : "Update Name"}
                  </button>
                </div>
              </div>
            </label>
          </label>
          <input type="checkbox" id="my-modal-10" className="modal-toggle" />
          <label htmlFor="my-modal-10" className="modal cursor-pointer">
            <label className="modal-box relative" htmlFor="">
              <div className="flex flex-col gap-2 justify-center items-center">
                <input
                  type="text"
                  placeholder="Text to show"
                  className="input input-bordered w-full max-w-xs"
                  onChange={(e) =>
                    setNewValue({
                      ...newValue,
                      textToShow: e.target.value,
                    })
                  }
                />
                <input
                  type="text"
                  placeholder="link to go"
                  className="input input-bordered w-full max-w-xs"
                  onChange={(e) =>
                    setNewValue({
                      ...newValue,
                      linkToGo: e.target.value,
                    })
                  }
                />
                <button
                  className="btn"
                  onClick={() => editLink(previousValue, newValue)}
                >
                  {updating ? <UpdatingLoader /> : "Update link"}
                </button>
                {error ? (
                  <span className="text-red-500">Enter correct details</span>
                ) : null}
              </div>
            </label>
          </label>
        </>
      )}
    </>
  );
};

export default LinkPage;
