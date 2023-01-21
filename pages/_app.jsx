import "@/styles/globals.css";
import Nav from "@/components/nav";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App({ Component, pageProps }) {
  return (
    <>
      <ToastContainer />
      <Nav />
      <Component {...pageProps} />
    </>
  );
}
