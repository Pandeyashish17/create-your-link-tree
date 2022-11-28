import "../styles/globals.css";
import Navbar from "../components/Navbar";
import { useState } from "react";
import "animate.css";
import { auth } from "../config/Firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import Loader from "../components/Loader";
import { useRouter } from "next/router";
import { StateContext } from "../context/StateContext";

function MyApp({ Component, pageProps }) {
  const [theme, setTheme] = useState("dark");
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  if (loading) return <Loader />;
  return (
    <>
      <StateContext>
        <div data-theme={theme} className="">
          <Navbar setTheme={setTheme} />
          <Component {...pageProps} />
        </div>
        {user && (
          <>
            <input type="checkbox" id="my-modal-1" className="modal-toggle" />
            <label htmlFor="my-modal-1" className="modal cursor-pointer">
              <label className="modal-box relative" htmlFor="">
                <h3 className="text-lg font-bold capitalize">
                  Are You Sure You Want To Logout {user.displayName}?
                </h3>
                <button
                  className="btn mt-4 py-1 px-2 "
                  onClick={() => {
                    auth.signOut();
                    router.push("/");
                  }}
                >
                  Logout
                </button>
              </label>
            </label>
          </>
        )}
      </StateContext>
    </>
  );
}

export default MyApp;
