import { getAuth, signOut } from "firebase/auth";
import { useRouter } from "next/router";

export default function Profile() {
  const route = useRouter();
  const auth = getAuth();

  const logOut = () => {
    signOut(auth)
      .then(() => {
        route.push("/auth/portal");
      })
      .catch((error) => {
        // An error happened.
      });
  };

  return (
    <main className="absolute top-0 bottom-0 left-0 right-0 flex md:flex-row flex-col-reverse items-center justify-center px-4 gap-y-0 gap-x-1">
      <button onClick={() => logOut()}>Log Out</button>
    </main>
  );
}
