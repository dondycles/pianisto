import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { AiFillFacebook, AiFillGoogleSquare } from "react-icons/ai";
import { useState, useEffect, useRef } from "react";
import {
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  FacebookAuthProvider,
} from "firebase/auth";
import { google, auth, fb } from "@/utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { doc, serverTimestamp, setDoc, getDoc } from "firebase/firestore";
import { fireDB } from "@/utils/firebase";
import { map } from "@firebase/util";

export default function Portal() {
  const route = useRouter();
  const [showPass, setShowPass] = useState("password");
  const [showConfirmPass, setShowConfirmPass] = useState("password");
  const [portal, setPortal] = useState(false);
  const [user, loading] = useAuthState(auth);
  const [fullName, setFullName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const fullNameRef = useRef(null);
  const userEmailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  const clearInput = () => {
    setFullName("");
    setUserEmail("");
    setPassword("");
    setConfirmPassword("");
    fullNameRef.current.value = "";
    userEmailRef.current.value = "";
    passwordRef.current.value = "";
    confirmPasswordRef.current.value = "";
  };

  const writeNewAccount = async (fullname, email) => {
    const ref = doc(fireDB, "userAccounts", email);
    await setDoc(ref, {
      fullname: fullname,
      email: email,
      timeOfCreation: serverTimestamp(),
    });
  };

  const checkAccount = async (e) => {
    const ref = doc(fireDB, "userAccounts", e.user.email);
    const docSnap = await getDoc(ref);
    if (docSnap.exists()) return;
    await writeNewAccount(e.user.displayName, e.user.email);
  };

  const googleLogIn = async () => {
    try {
      const result = await signInWithPopup(auth, google);
      await checkAccount(result);
      console.log(result.user);
      route.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  const emailSignUp = async () => {
    if (fullName == "" || fullName == null)
      return (fullNameRef.current.placeholder = "Please enter your full name");
    if (userEmail == "" || userEmail == null)
      return (userEmailRef.current.placeholder =
        "Please enter your email address");
    if (password == "" || password == null)
      return (
        (passwordRef.current.value = ""),
        (passwordRef.current.placeholder = "Please enter a password")
      );
    if (confirmPassword == "" || confirmPassword == null)
      return (
        (confirmPasswordRef.current.value = ""),
        (confirmPasswordRef.current.placeholder =
          "Please confirm your password")
      );
    if (confirmPassword != password || password != confirmPassword)
      return (
        (passwordRef.current.value = ""),
        (confirmPasswordRef.current.value = ""),
        (passwordRef.current.placeholder = "Password doesn't match"),
        (confirmPasswordRef.current.placeholder = "Password doesn't match")
      );

    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        userEmail,
        password
      );
      await writeNewAccount(fullName, userEmail);
      console.log(result.user);
      route.push("/user/profile");
      toast.success("Account created successfully!");
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      toast.error("Error: " + errorCode);
    }
  };

  const emailLogIn = async () => {
    if (userEmail == "" || userEmail == null)
      return (userEmailRef.current.placeholder =
        "Please enter your email address");
    if (password == "" || password == null)
      return (
        (passwordRef.current.value = ""),
        (passwordRef.current.placeholder = "Please enter your password")
      );
    try {
      const result = await signInWithEmailAndPassword(
        auth,
        userEmail,
        password
      );
      console.log(result.user);
      route.push("/user/profile");
      toast.success("Logged In Successfully!", {
        position: "top-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
    }
  };

  const fbLogin = async () => {
    try {
      const result = await signInWithPopup(auth, fb);
      await checkAccount(result);
      const creds = FacebookAuthProvider.credentialFromResult(result);
      const token = creds.accessToken;
      let photo = result.user.photoURL + "?height=300&access_token=" + token;
      console.log(result.user);
      await updateProfile(auth.currentUser, { photoURL: photo });
      route.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    console.log(fullName + userEmail + password + confirmPassword);
  }, [fullName, userEmail, password, confirmPassword]);

  return (
    <main className="absolute top-0 bottom-0 left-0 right-0 flex md:flex-row flex-col-reverse items-center justify-center px-4 gap-y-0 gap-x-1">
      <div className=" w-[300px] h-[500px]flex flex-col justify-center">
        <h1 className="text-4xl font-black">{portal ? "Sign Up" : "Log In"}</h1>
        <form className=" flex flex-col gap-2 py-2 font-light">
          {portal && (
            <input
              ref={fullNameRef}
              onChange={(e) => setFullName(e.target.value)}
              type="text"
              placeholder="Full Name"
              className="text-white py-2 px-4 rounded bg-transparent outline-none border-2"
            />
          )}
          <input
            ref={userEmailRef}
            onChange={(e) => setUserEmail(e.target.value)}
            type="text"
            placeholder="Email Address"
            className="text-white py-2 px-4 rounded bg-transparent outline-none border-2"
          />
          <span className="w-full relative">
            <input
              ref={passwordRef}
              onChange={(e) => setPassword(e.target.value)}
              type={showPass}
              placeholder="Password"
              className="text-white py-2 px-4 rounded w-full bg-transparent outline-none border-2"
            />
            {showPass === "password" && (
              <AiOutlineEye
                onClick={() => setShowPass("text")}
                role={"button"}
                className="absolute text-white top-[50%] translate-y-[-50%] right-2 text-3xl"
              />
            )}
            {showPass === "text" && (
              <AiOutlineEyeInvisible
                onClick={() => setShowPass("password")}
                role={"button"}
                className="absolute text-white top-[50%] translate-y-[-50%] right-2 text-3xl"
              />
            )}
          </span>
          {portal && (
            <span className="w-full relative">
              <input
                ref={confirmPasswordRef}
                onChange={(e) => setConfirmPassword(e.target.value)}
                type={showConfirmPass}
                placeholder="Confirm Password"
                className="text-white py-2 px-4 rounded w-full bg-transparent outline-none border-2"
              />
              {showConfirmPass === "password" && (
                <AiOutlineEye
                  onClick={() => setShowConfirmPass("text")}
                  role={"button"}
                  className="absolute text-white top-[50%] translate-y-[-50%] right-2 text-3xl"
                />
              )}
              {showConfirmPass === "text" && (
                <AiOutlineEyeInvisible
                  onClick={() => setShowConfirmPass("password")}
                  role={"button"}
                  className="absolute text-white top-[50%] translate-y-[-50%] right-2 text-3xl"
                />
              )}
            </span>
          )}
        </form>
        <div className="flex flex-col  mb-2">
          {portal ? (
            <button
              onClick={() => emailSignUp()}
              className=" group/suBtn px-4 py-2 bg-white text-indigo-600 font-bold rounded w-full active:drop-shadow-md hover:drop-shadow-xl duration-100 relative overflow-hidden flex items-center justify-center"
            >
              <span className="z-10 group-hover/suBtn:text-white duration-500 ease-in-out">
                Sign Up
              </span>
              <span className="z-0 absolute top-0 bottom-0 h-full bg-black aspect-square rounded-full scale-0 group-hover/suBtn:scale-[1000%] duration-500 ease-in-out"></span>
            </button>
          ) : (
            <button
              onClick={() => emailLogIn()}
              className=" group/liBtn px-4 py-2 bg-white text-indigo-600 font-bold rounded w-full active:drop-shadow-md hover:drop-shadow-xl duration-100 relative overflow-hidden flex items-center justify-center"
            >
              <span className="z-10 group-hover/liBtn:text-white ease-in-out duration-500">
                Log In
              </span>
              <span className="absolute top-0 bottom-0 h-full aspect-square bg-black rounded-full scale-0 group-hover/liBtn:scale-[1000%] duration-500 ease-in-out"></span>
            </button>
          )}
          <p className=" w-full text-center font-light pt-1">
            {portal ? "Already have one? " : "Doesn't have one yet? "}

            <span
              onClick={() => setPortal((prev) => !prev)}
              role="button"
              className="font-bold hover:underline"
            >
              {portal ? "Log In" : "Sign Up"}
            </span>
          </p>
        </div>
        <hr />
        <div className="flex flex-col pt-4 gap-2">
          <button
            onClick={() => googleLogIn()}
            className=" group/ggBtn px-4 py-2 bg-white text-indigo-600 font-bold rounded w-full active:drop-shadow-md hover:drop-shadow-xl duration-100 flex flex-row items-center gap-1 justify-center relative overflow-hidden"
          >
            <AiFillGoogleSquare className="text-xl group-hover/ggBtn:text-white z-10 duration-1000" />
            <span className="h-full aspect-square scale-0 rounded-full group-hover/ggBtn:scale-[1000%] duration-500 ease-in-out bg-black absolute top-0 bottom-0 z-0"></span>
            <span className=" group-hover/ggBtn:text-white z-10 duration-500">
              Log In with Google
            </span>
          </button>
          <button
            onClick={() => fbLogin()}
            className=" group/fbBtn px-4 py-2 bg-white text-indigo-600 font-bold rounded w-full active:drop-shadow-md hover:drop-shadow-xl duration-100 flex flex-row items-center justify-center gap-1 relative overflow-hidden"
          >
            <AiFillFacebook className="text-xl group-hover/fbBtn:text-white z-10 duration-1000" />
            <span className="h-full aspect-square scale-0 rounded-full group-hover/fbBtn:scale-[1000%] duration-500 ease-in-out bg-black absolute top-0 bottom-0 z-0"></span>
            <span className=" group-hover/fbBtn:text-white z-10 duration-500">
              Log In with Facebook
            </span>
          </button>
        </div>
      </div>
    </main>
  );
}
