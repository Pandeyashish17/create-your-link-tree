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

const LinkPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setimageUrl] = useState(null);
  const [random, setRandom] = useState(null);
  const [description, setDescription] = useState(null);
  const [name, setName] = useState(null);
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
    if (!id) return;
    const pathRef = doc(db, "users", user.email);
    await updateDoc(pathRef, {
      link: arrayRemove(item),
    });
    setRandom(Math.random());
  };

  const updatePicture = async (url) => {
    if (!url) return;

    const pathRef = doc(db, "users", user.email);
    await updateDoc(pathRef, {
      imageUrl: url,
    });

    setRandom(Math.random());
  };
  const updateDescription = async (desc) => {
    if (!desc) return;

    const pathRef = doc(db, "users", user.email);
    await updateDoc(pathRef, {
      description: desc,
    });

    setRandom(Math.random());
  };
  const updateName = async (name) => {
    if (!name) return;

    const pathRef = doc(db, "users", user.email);
    await updateDoc(pathRef, {
      name: name,
    });

    setRandom(Math.random());
  };
  console.log(data);
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
                                    <span>{item.textToShow}</span>
                                    {user && id == user.uid ? (
                                      <button onClick={() => deleteLink(item)}>
                                        <AiFillDelete />
                                      </button>
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
                Update
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
                    rows={100}
                    cols={50}
                    onChange={(e) => setDescription(e.target.value)}
                  >
                    {data?.description}
                  </textarea>
                  <button
                    className="btn "
                    onClick={() => updateDescription(description)}
                  >
                    Update Description
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
                    Update Name
                  </button>
                </div>
              </div>
            </label>
          </label>
        </>
      )}
    </>
  );
};

export default LinkPage;
