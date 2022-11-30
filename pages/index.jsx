import { useAuthState } from "react-firebase-hooks/auth";
import { signInWithPopup } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db, provider } from "../config/Firebase";
import Link from "next/link";
import { useStateContext } from "../context/StateContext";
const Home = () => {
  const [user, loading] = useAuthState(auth);

  const saveUser = async (user) => {
    const userRef = doc(db, "users", user.email);
    const docSnap = await getDoc(userRef);
    docSnap.exists()
      ? null
      : await setDoc(doc(db, "users", user.email), {
          id: user.uid,
          email: user.email,
          name: user.displayName,
          imageUrl: user.photoURL,
          link: [],
          description: "",
        });
  };

  const handleUserAuth = async () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        saveUser(user);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <div className="min-h-screen grid place-content-center px-6">
        {user ? (
          <>
            {" "}
            <div className="grid place-content-center">
              <div className="">
                <Link
                  href={`/${user.uid}`}
                  className="animate__animated animate__fadeIn relative inline-flex items-center justify-start px-6 py-3 overflow-hidden font-medium transition-all bg-white rounded hover:bg-white group"
                >
                  <span className="w-48 h-48 rounded rotate-[-40deg] bg-purple-600 absolute bottom-0 left-0 -translate-x-full ease-out duration-500 transition-all translate-y-full mb-9 ml-9 group-hover:ml-0 group-hover:mb-32 group-hover:translate-x-0"></span>
                  <span className="relative w-full text-left text-black transition-colors duration-300 ease-in-out group-hover:text-white">
                    See Your Page
                  </span>
                </Link>
              </div>
            </div>
            <h1 className=" animate__animated animate__fadeIn text-4xl font-semibold leading-[50px] tracking-wide text-transparent bg-clip-text bg-gradient-to-l from-pink-400 to-blue-600 mb-10">
              Create Your Link {user.displayName}
            </h1>
            <div className="grid place-content-center">
              <div className="">
                <Link
                  href="/create"
                  className="animate__animated animate__fadeIn relative inline-flex items-center justify-start px-6 py-3 overflow-hidden font-medium transition-all bg-white rounded hover:bg-white group"
                >
                  <span className="w-48 h-48 rounded rotate-[-40deg] bg-purple-600 absolute bottom-0 left-0 -translate-x-full ease-out duration-500 transition-all translate-y-full mb-9 ml-9 group-hover:ml-0 group-hover:mb-32 group-hover:translate-x-0"></span>
                  <span className="relative w-full text-left text-black transition-colors duration-300 ease-in-out group-hover:text-white">
                    Add Link
                  </span>
                </Link>
              </div>
            </div>
          </>
        ) : (
          <>
            <h1 className=" animate__animated animate__lightSpeedInRight text-4xl font-semibold leading-[50px] tracking-wide text-transparent bg-clip-text bg-gradient-to-l from-pink-400 to-blue-600 mb-10">
              Login To Get Access
            </h1>
            <div className="flex justify-center items-center p-2 rounded-md">
              <div>
                <button
                  onClick={() => handleUserAuth()}
                  className="relative inline-flex items-center justify-center px-10 py-4 overflow-hidden cursor-pointer font-mono font-medium tracking-tighter text-white bg-gray-800 rounded-lg group"
                >
                  <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-green-500 rounded-full group-hover:w-56 group-hover:h-56"></span>
                  <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-gray-700"></span>
                  <span className="relative">Login using Google</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Home;
