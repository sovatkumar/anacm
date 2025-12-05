import { Metadata } from "next";
import ZipSearch from "../components/findUser/findUser";

export const metadata: Metadata = {
  title: "Find a rep",
  description: "Find a representative closest to you",
};
export default function index() {
  return (
    <>
      <ZipSearch />
    </>
  );
}
