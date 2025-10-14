import Image from "next/image";
import Dashboard from "./components/Home/Home";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

export default function Home() {
  return (
    <>
    
    <Dashboard/>
    <ToastContainer />
    </>
  );
}
