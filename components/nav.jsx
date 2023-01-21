import { GiGrandPiano } from "react-icons/gi";
import Link from "next/link";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/utils/firebase";
import { CgProfile } from "react-icons/cg";
import { useRouter } from "next/router";
import {
  doc,
  serverTimestamp,
  setDoc,
  getDoc,
  onSnapshot,
} from "firebase/firestore";
import { fireDB } from "@/utils/firebase";
import { useEffect, useState } from "react";

export default function Nav() {
  const [user, loading] = useAuthState(auth);
  const [userData, setUserData] = useState();

  const route = useRouter();

  const checkAccount = async () => {
    const ref = doc(fireDB, "userAccounts", user.email);
    const docSnap = await getDoc(ref);
    if (docSnap.exists()) {
      setUserData(docSnap.data());
      // alert("Document data:" + docSnap.data().email);
    } else {
      // doc.data() will be undefined in this case
      // alert("No such document!");
    }
  };

  useEffect(() => {
    if (!user) return;
    checkAccount();
  }, []);

  return (
    <nav className="z-[100] fixed top-0 left-0 right-0 h-20 flex flex-row items-center justify-between w-full px-4 sm:px-24">
      <span className="text-left font-black text-2xl xs:flex items-center gap-1 hidden">
        Pianisto <GiGrandPiano />
      </span>
      <ul className="list-none flex w-fit items-center flex-row gap-4 ml-auto mr-0">
        <li role="button">
          <Link href="/">Home</Link>
        </li>
        <li role="button">
          <Link href="/">About</Link>
        </li>
        <li role="button">
          <Link href="/">Contacts</Link>
        </li>
        {route.pathname != "/auth/portal" && (
          <li
            role="button"
            className="  rounded text-indigo-600  relative active:drop-shadow-md hover:drop-shadow-xl duration-100 flex items-center"
          >
            {!user ? (
              <Link
                href="/auth/portal"
                className="h-full w-full px-4 py-2 bg-white font-bold rounded relative overflow-hidden flex items-center justify-center group/navLiBtn"
              >
                <span className="z-10 group-hover/navLiBtn:text-white duration-500 ease-in-out">
                  Log In
                </span>
                <span className="z-0 absolute top-0 bottom-0 h-full aspect-square rounded-full bg-black scale-0 duration-500 ease-in-out group-hover/navLiBtn:scale-[1000%]"></span>
              </Link>
            ) : (
              <>
                <Link
                  href="/user/profile"
                  className=" text-white h-12 w-12 rounded-full overflow-hidden border-2 border-white"
                >
                  {/* {user.displayName || userData["fullname"]} */}
                  <img src={user.photoURL} alt={String(user.displayName)} />
                </Link>
              </>
            )}
          </li>
        )}
      </ul>
    </nav>
  );
}
