import UploadWidget from "./components/UploadWidget";

const Home = () => {
  return (
    <main className="max-w-[900px] min-h-screen mx-auto flex flex-col gap-5 items-center justify-center px-5">
      <h1 className="text-xl md:text-3xl">Upload and chat with your PDF</h1>
      <UploadWidget />
    </main>
  );
};
export default Home;
